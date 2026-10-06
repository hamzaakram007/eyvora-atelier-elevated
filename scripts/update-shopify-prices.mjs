#!/usr/bin/env node
/**
 * Push launch catalogue prices to Shopify Admin variants.
 * Hoodies → 3749 · Trousers → 2499
 */
import { existsSync } from "node:fs";
if (existsSync(".env")) process.loadEnvFile(".env");

const DOMAIN = (
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.VITE_SHOPIFY_STORE_DOMAIN ||
  ""
)
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || "";
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || "";

const PRICES = {
  "olive-green-hoodie": "3749.00",
  "black-hoodie": "3749.00",
  "grey-trousers": "2499.00",
  "black-trousers": "2499.00",
};

async function token() {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`token failed: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function admin(accessToken, query, variables) {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

const accessToken = await token();
for (const [handle, price] of Object.entries(PRICES)) {
  const data = await admin(
    accessToken,
    `{
      productByHandle(handle: "${handle}") {
        id
        title
        variants(first: 50) {
          edges { node { id title price } }
        }
      }
    }`,
  );
  const product = data.productByHandle;
  if (!product) {
    console.warn(`missing ${handle}`);
    continue;
  }
  const variants = product.variants.edges.map((e) => ({
    id: e.node.id,
    price,
  }));
  const updated = await admin(
    accessToken,
    `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id title price }
        userErrors { field message }
      }
    }`,
    { productId: product.id, variants },
  );
  const errors = updated.productVariantsBulkUpdate.userErrors || [];
  if (errors.length) {
    console.error(handle, errors);
    continue;
  }
  const prices = updated.productVariantsBulkUpdate.productVariants
    .map((v) => `${v.title}=${v.price}`)
    .join(", ");
  console.log(`✓ ${handle} → PKR ${price} (${prices})`);
}
console.log("\nDone updating Shopify variant prices.");
