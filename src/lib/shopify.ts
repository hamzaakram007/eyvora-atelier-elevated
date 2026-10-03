import { toast } from "sonner";
import {
  getLaunchCatalog,
  getLaunchProductByHandle,
  mergeWithShopifyCatalog,
  applyLaunchImagery,
} from "@/lib/catalog";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ||
  "eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN ||
  "47b5ed97d3036975d1521c07a7b2af0a";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType?: string;
    tags?: string[];
    availableForSale?: boolean;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange?: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  productType
  tags
  availableForSale
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  images(first: 12) { edges { node { url altText } } }
  variants(first: 30) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        availableForSale
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

export const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export const SEARCH_QUERY = `
  query Search($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT, COLLECTION]) {
      edges {
        node {
          ... on Product {
            ${PRODUCT_FIELDS}
          }
          ... on Collection {
            id
            title
            handle
            image { url altText }
          }
        }
      }
    }
  }
`;

export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  // Trial / unpaid stores lock the Online Store channel — fall back to local catalogue quietly.
  if (response.status === 402 || response.status === 400 || response.status === 423) {
    throw new Error(`Shopify Storefront unavailable (HTTP ${response.status})`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    const message = data.errors
      .map((e: { message: string }) => e.message)
      .join(", ");
    if (/locked|payment required|unavailable/i.test(message)) {
      throw new Error(`Shopify Storefront unavailable: ${message}`);
    }
    toast.error("Shopify storefront error", { description: message });
    throw new Error(`Error calling Shopify: ${message}`);
  }

  return data;
}

export async function fetchProducts(
  first = 24,
  query?: string,
  gender?: string | null,
): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { first, query });
    const remote: ShopifyProduct[] = data?.data?.products?.edges ?? [];
    if (query) {
      // Tag/search queries still prefer authentic launch mapping when possible.
      const merged = mergeWithShopifyCatalog(remote, gender);
      if (query.toLowerCase().includes("hoodie")) {
        return merged.filter((p) =>
          (p.node.productType ?? "").toLowerCase().includes("hoodie"),
        );
      }
      if (query.toLowerCase().includes("trouser")) {
        return merged.filter((p) =>
          (p.node.productType ?? "").toLowerCase().includes("trouser"),
        );
      }
      if (query.toLowerCase().includes("couple") || query.toLowerCase().includes("tag:couple")) {
        return merged.filter((p) => (p.node.tags ?? []).includes("couple"));
      }
      return merged;
    }
    return mergeWithShopifyCatalog(remote, gender);
  } catch (error) {
    console.warn("Shopify products unavailable, using launch catalog.", error);
    return getLaunchCatalog(gender);
  }
}

export async function fetchProductByHandle(
  handle: string,
  gender?: string | null,
): Promise<ShopifyProduct | null> {
  try {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    const product = data?.data?.product;
    if (product) {
      return applyLaunchImagery({ node: product }, gender);
    }
  } catch (error) {
    console.warn("Shopify product lookup failed:", error);
  }
  return getLaunchProductByHandle(handle, gender);
}

export async function searchStorefront(term: string, first = 8) {
  const q = term.trim();
  if (!q) return { products: [] as ShopifyProduct[], collections: [] as Array<{ id: string; title: string; handle: string; image?: { url: string; altText: string | null } | null }> };

  try {
    const data = await storefrontApiRequest(SEARCH_QUERY, { query: q, first });
    const edges = data?.data?.search?.edges ?? [];
    const products: ShopifyProduct[] = [];
    const collections: Array<{
      id: string;
      title: string;
      handle: string;
      image?: { url: string; altText: string | null } | null;
    }> = [];

    for (const edge of edges) {
      const node = edge.node;
      if (!node) continue;
      if (node.handle && node.priceRange) {
        products.push(applyLaunchImagery({ node }));
      } else if (node.handle && node.title && !node.priceRange) {
        collections.push(node);
      }
    }

    if (products.length === 0) {
      const local = getLaunchCatalog().filter((p) => {
        const hay =
          `${p.node.title} ${p.node.productType} ${(p.node.tags ?? []).join(" ")}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      });
      return { products: local, collections };
    }

    return { products, collections };
  } catch {
    const local = getLaunchCatalog().filter((p) => {
      const hay =
        `${p.node.title} ${p.node.productType} ${(p.node.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
    return { products: local, collections: [] };
  }
}

export function formatPrice(amount: string | number, currencyCode = "PKR") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return "";
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `PKR ${Math.round(value).toLocaleString("en-PK")}`;
  }
}
