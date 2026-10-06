#!/usr/bin/env node
/**
 * Seeds the verified EYVORA launch catalogue into Shopify Admin.
 *
 * Auth (either):
 *   A) Legacy admin custom app token:
 *      SHOPIFY_ADMIN_API_TOKEN=shpat_xxx
 *   B) Dev Dashboard app (current Shopify path):
 *      SHOPIFY_CLIENT_ID=...
 *      SHOPIFY_CLIENT_SECRET=...
 *
 * Required:
 *   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *
 * Optional:
 *   ARCHIVE_DEMO_PRODUCTS=true
 */

import { existsSync } from "node:fs";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const DOMAIN = (
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.VITE_SHOPIFY_STORE_DOMAIN ||
  "eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com"
).replace(/^https?:\/\//, "").replace(/\/$/, "");

const API = `https://${DOMAIN}/admin/api/2025-07/graphql.json`;
const SHOP = DOMAIN.replace(/\.myshopify\.com$/i, "");

let cachedToken = process.env.SHOPIFY_ADMIN_API_TOKEN || "";
let tokenExpiresAt = cachedToken ? Number.POSITIVE_INFINITY : 0;

async function resolveAdminToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID || "";
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing Admin auth. Set SHOPIFY_ADMIN_API_TOKEN=shpat_... OR SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET from Dev Dashboard → App settings.",
    );
  }

  const res = await fetch(`https://${SHOP}.myshopify.com/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(
      `Token request failed: ${JSON.stringify(json)}\n` +
        "Check: app installed on this store, scopes include write_products, and store is in the same Dev Dashboard organization.",
    );
  }
  cachedToken = json.access_token;
  tokenExpiresAt = Date.now() + (json.expires_in || 86399) * 1000;
  console.log(`✓ Admin token acquired (scopes: ${json.scope || "n/a"})`);
  return cachedToken;
}

const LAUNCH = [
  {
    title: "EYVORA Olive Green Hoodie",
    handle: "olive-green-hoodie",
    productType: "Hoodies",
    color: "Olive Green",
    price: "3599.00",
    tags: ["hoodies", "olive", "couple", "essentials", "new", "men", "women"],
    description:
      "A relaxed everyday hoodie in muted olive, finished with signature white piping and a clean EYVORA mark.",
  },
  {
    title: "EYVORA Black Hoodie",
    handle: "black-hoodie",
    productType: "Hoodies",
    color: "Black",
    price: "3599.00",
    tags: ["hoodies", "black", "couple", "essentials", "new", "men", "women"],
    description:
      "A deep charcoal hoodie with white piping and a refined silhouette for everyday wear.",
  },
  {
    title: "EYVORA Grey Trousers",
    handle: "grey-trousers",
    productType: "Trousers",
    color: "Grey",
    price: "2239.00",
    tags: ["trousers", "grey", "couple", "essentials", "new", "men", "women"],
    description:
      "Relaxed straight-leg trousers in soft heather grey, designed for comfort with a quiet logo mark.",
  },
  {
    title: "EYVORA Black Trousers",
    handle: "black-trousers",
    productType: "Trousers",
    color: "Black",
    price: "2239.00",
    tags: ["trousers", "black", "couple", "essentials", "new", "men", "women"],
    description:
      "Relaxed straight-leg trousers in deep black, finished with a minimal EYVORA mark on the thigh.",
  },
];

const COLLECTIONS = [
  { title: "Hoodies", handle: "hoodies", productHandles: ["olive-green-hoodie", "black-hoodie"] },
  { title: "Trousers", handle: "trousers", productHandles: ["grey-trousers", "black-trousers"] },
  {
    title: "Couple",
    handle: "couple",
    productHandles: [
      "olive-green-hoodie",
      "black-hoodie",
      "grey-trousers",
      "black-trousers",
    ],
  },
];

/** Small, Medium, Large, Extra Large */
const SIZES = ["S", "M", "L", "XL"];

async function admin(query, variables = {}) {
  const token = await resolveAdminToken();
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(JSON.stringify(json.errors || json, null, 2));
  }
  return json.data;
}

async function listProducts() {
  const data = await admin(`{
    products(first: 50) {
      edges { node { id title handle status } }
    }
  }`);
  return data.products.edges.map((e) => e.node);
}

async function archiveProduct(id) {
  await admin(
    `mutation($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id status }
        userErrors { field message }
      }
    }`,
    { input: { id, status: "ARCHIVED" } },
  );
}

async function productVariantSnapshot(productId) {
  const data = await admin(
    `query($id: ID!) {
      product(id: $id) {
        id
        handle
        options { id name values }
        variants(first: 50) {
          edges {
            node {
              id
              title
              selectedOptions { name value }
            }
          }
        }
      }
    }`,
    { id: productId },
  );
  return data.product;
}

async function ensureMissingSizeVariants(productId, p) {
  const product = await productVariantSnapshot(productId);
  const existingSizes = new Set(
    (product.variants?.edges ?? [])
      .map((e) =>
        e.node.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value,
      )
      .filter(Boolean),
  );
  const missing = SIZES.filter((size) => !existingSizes.has(size));
  if (missing.length === 0) {
    console.log(`✓ sizes complete: ${p.handle} (${SIZES.join("/")})`);
    return;
  }

  const variants = missing.map((size) => ({
    optionValues: [
      { optionName: "Size", name: size },
      { optionName: "Color", name: p.color },
    ],
    price: p.price,
    inventoryPolicy: "CONTINUE",
  }));

  const variantData = await admin(
    `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants { id title price }
        userErrors { field message }
      }
    }`,
    { productId, variants },
  );
  const vErrors = variantData.productVariantsBulkCreate.userErrors;
  if (vErrors?.length) throw new Error(JSON.stringify(vErrors, null, 2));
  console.log(`+ added sizes ${missing.join("/")} on ${p.handle}`);
}

async function ensureProduct(p) {
  const existing = (await listProducts()).find((x) => x.handle === p.handle);
  if (existing && existing.status === "ACTIVE") {
    console.log(`✓ exists: ${p.handle}`);
    await ensureMissingSizeVariants(existing.id, p);
    return existing.id;
  }

  const data = await admin(
    `mutation($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product { id handle }
        userErrors { field message }
      }
    }`,
    {
      product: {
        title: p.title,
        handle: p.handle,
        descriptionHtml: `<p>${p.description}</p>`,
        productType: p.productType,
        vendor: "EYVORA",
        status: "ACTIVE",
        tags: p.tags,
        productOptions: [
          { name: "Size", values: SIZES.map((name) => ({ name })) },
          { name: "Color", values: [{ name: p.color }] },
        ],
      },
    },
  );

  const errors = data.productCreate.userErrors;
  if (errors?.length) throw new Error(JSON.stringify(errors, null, 2));
  const productId = data.productCreate.product.id;
  console.log(`+ created product: ${p.handle}`);

  const variants = SIZES.map((size) => ({
    optionValues: [
      { optionName: "Size", name: size },
      { optionName: "Color", name: p.color },
    ],
    price: p.price,
    inventoryPolicy: "CONTINUE",
  }));

  const variantData = await admin(
    `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants, strategy: REMOVE_STANDALONE_VARIANT) {
        productVariants { id title price }
        userErrors { field message }
      }
    }`,
    { productId, variants },
  );
  const vErrors = variantData.productVariantsBulkCreate.userErrors;
  if (vErrors?.length) throw new Error(JSON.stringify(vErrors, null, 2));
  console.log(`  variants: ${SIZES.join("/")} @ PKR ${p.price}`);
  return productId;
}

async function ensureCollection(c, handleToId) {
  const existing = await admin(`{
    collectionByHandle(handle: "${c.handle}") { id title }
  }`);
  let collectionId = existing.collectionByHandle?.id;
  if (!collectionId) {
    const created = await admin(
      `mutation($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection { id handle }
          userErrors { field message }
        }
      }`,
      {
        input: {
          title: c.title,
          handle: c.handle,
          descriptionHtml: `<p>EYVORA ${c.title} collection.</p>`,
        },
      },
    );
    if (created.collectionCreate.userErrors?.length) {
      throw new Error(JSON.stringify(created.collectionCreate.userErrors, null, 2));
    }
    collectionId = created.collectionCreate.collection.id;
    console.log(`+ created collection: ${c.handle}`);
  } else {
    console.log(`✓ collection exists: ${c.handle}`);
  }

  const productIds = c.productHandles.map((h) => handleToId[h]).filter(Boolean);
  if (productIds.length) {
    await admin(
      `mutation($id: ID!, $productIds: [ID!]!) {
        collectionAddProducts(id: $id, productIds: $productIds) {
          userErrors { field message }
        }
      }`,
      { id: collectionId, productIds },
    );
    console.log(`  linked ${productIds.length} products`);
  }
}

async function main() {
  console.log(`Seeding Shopify Admin: ${DOMAIN}`);
  const current = await listProducts();

  if (process.env.ARCHIVE_DEMO_PRODUCTS === "true") {
    const launchHandles = new Set(LAUNCH.map((p) => p.handle));
    for (const p of current) {
      if (!launchHandles.has(p.handle) && p.status === "ACTIVE") {
        await archiveProduct(p.id);
        console.log(`archived demo: ${p.handle}`);
      }
    }
  }

  const handleToId = {};
  for (const p of LAUNCH) {
    handleToId[p.handle] = await ensureProduct(p);
  }
  for (const c of COLLECTIONS) {
    await ensureCollection(c, handleToId);
  }
  console.log("\nLaunch catalogue ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
