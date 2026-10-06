#!/usr/bin/env node
/**
 * Push launch catalogue prices to Shopify Admin variants.
 * Hoodies list 4549 / sale 3639 (20% off) · Trousers list 2799 / sale 2239 (20% off)
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

/** price = sale (what customer pays), compareAt = list before 20% off */
const PRICES = {
  "olive-green-hoodie": { price: "3639.00", compareAt: "4549.00" },
  "black-hoodie": { price: "3639.00", compareAt: "4549.00" },
  "grey-trousers": { price: "2239.00", compareAt: "2799.00" },
  "black-trousers": { price: "2239.00", compareAt: "2799.00" },
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
for (const [handle, money] of Object.entries(PRICES)) {
  const data = await admin(
    accessToken,
    `{
      productByHandle(handle: "${handle}") {
        id
        title
        variants(first: 50) {
          edges { node { id title price compareAtPrice } }
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
    price: money.price,
    compareAtPrice: money.compareAt,
  }));
  const updated = await admin(
    accessToken,
    `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id title price compareAtPrice }
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
  const sample = updated.productVariantsBulkUpdate.productVariants[0];
  console.log(
    `✓ ${handle} → sale PKR ${sample?.price} (was ${sample?.compareAtPrice})`,
  );
}
console.log("\nDone updating Shopify variant prices + compare-at.");
