#!/usr/bin/env node
/**
 * Seeds the verified EYVORA launch catalogue into Shopify Admin.
 *
 * Required env:
 *   SHOPIFY_STORE_DOMAIN=eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com
 *   SHOPIFY_ADMIN_API_TOKEN=shpat_xxx
 *
 * Optional:
 *   ARCHIVE_DEMO_PRODUCTS=true
 */

const DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.VITE_SHOPIFY_STORE_DOMAIN ||
  "eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com";
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";
const API = `https://${DOMAIN}/admin/api/2025-07/graphql.json`;

if (!TOKEN) {
  console.error("Missing SHOPIFY_ADMIN_API_TOKEN");
  process.exit(1);
}

const LAUNCH = [
  {
    title: "EYVORA Olive Green Hoodie",
    handle: "olive-green-hoodie",
    productType: "Hoodies",
    color: "Olive Green",
    price: "4399.00",
    tags: ["hoodies", "olive", "couple", "essentials", "new", "men", "women"],
    description:
      "A relaxed everyday hoodie in muted olive, finished with signature white piping and a clean EYVORA mark.",
  },
  {
    title: "EYVORA Black Hoodie",
    handle: "black-hoodie",
    productType: "Hoodies",
    color: "Black",
    price: "4399.00",
    tags: ["hoodies", "black", "couple", "essentials", "new", "men", "women"],
    description:
      "A deep charcoal hoodie with white piping and a refined silhouette for everyday wear.",
  },
  {
    title: "EYVORA Grey Trousers",
    handle: "grey-trousers",
    productType: "Trousers",
    color: "Grey",
    price: "2499.00",
    tags: ["trousers", "grey", "couple", "essentials", "new", "men", "women"],
    description:
      "Relaxed straight-leg trousers in soft heather grey, designed for comfort with a quiet logo mark.",
  },
  {
    title: "EYVORA Black Trousers",
    handle: "black-trousers",
    productType: "Trousers",
    color: "Black",
    price: "2499.00",
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

async function admin(query, variables = {}) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
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

async function ensureProduct(p) {
  const existing = (await listProducts()).find((x) => x.handle === p.handle);
  if (existing && existing.status === "ACTIVE") {
    console.log(`✓ exists: ${p.handle}`);
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
          { name: "Size", values: [{ name: "S" }, { name: "M" }, { name: "L" }] },
          { name: "Color", values: [{ name: p.color }] },
        ],
      },
    },
  );

  const errors = data.productCreate.userErrors;
  if (errors?.length) throw new Error(JSON.stringify(errors, null, 2));
  const productId = data.productCreate.product.id;
  console.log(`+ created product: ${p.handle}`);

  // Create variants with prices via productVariantsBulkCreate
  const variants = ["S", "M", "L"].map((size) => ({
    optionValues: [
      { optionName: "Size", name: size },
      { optionName: "Color", name: p.color },
    ],
    price: p.price,
    inventoryPolicy: "DENY",
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
  console.log(`  variants: S/M/L @ PKR ${p.price}`);
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
