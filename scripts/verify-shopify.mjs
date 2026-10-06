#!/usr/bin/env node
const DOMAIN =
  process.env.VITE_SHOPIFY_STORE_DOMAIN ||
  "eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com";
const TOKEN =
  process.env.VITE_SHOPIFY_STOREFRONT_TOKEN ||
  "f0b3a9c2276107f0a76757ebf0cd2e98";

const EXPECTED = [
  ["olive-green-hoodie", "3599.0"],
  ["black-hoodie", "3599.0"],
  ["grey-trousers", "2239.0"],
  ["black-trousers", "2239.0"],
];

async function main() {
  const res = await fetch(
    `https://${DOMAIN}/api/2025-07/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: `{
          products(first: 50) {
            edges {
              node {
                title handle
                priceRange { minVariantPrice { amount currencyCode } }
                variants(first: 10) { edges { node { title } } }
              }
            }
          }
        }`,
      }),
    },
  );
  const json = await res.json();
  const products = json.data?.products?.edges?.map((e) => e.node) || [];
  console.log(`Store: ${DOMAIN}`);
  console.log(`Products visible: ${products.length}`);
  for (const p of products) {
    console.log(
      `- ${p.handle} | ${p.title} | ${p.priceRange.minVariantPrice.amount} ${p.priceRange.minVariantPrice.currencyCode} | variants=${p.variants.edges.map((v) => v.node.title).join(",")}`,
    );
  }

  let ok = true;
  for (const [handle, price] of EXPECTED) {
    const found = products.find((p) => p.handle === handle);
    if (!found) {
      console.log(`MISSING launch product: ${handle}`);
      ok = false;
      continue;
    }
    if (!found.priceRange.minVariantPrice.amount.startsWith(price.replace(".0", ""))) {
      console.log(
        `PRICE mismatch ${handle}: got ${found.priceRange.minVariantPrice.amount}, expected ${price}`,
      );
      ok = false;
    }
  }
  process.exit(ok ? 0 : 2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
