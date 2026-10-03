import type { ShopifyProduct } from "@/lib/shopify";

import olivePrimary from "@/assets/products/olive-hoodie/primary.jpg";
import oliveSecondary from "@/assets/products/olive-hoodie/secondary.jpg";
import oliveFront from "@/assets/products/olive-hoodie/front.jpg";
import oliveBack from "@/assets/products/olive-hoodie/back.jpg";
import oliveLifestyle from "@/assets/products/olive-hoodie/lifestyle.jpg";
import oliveDetail from "@/assets/products/olive-hoodie/detail.jpg";

import blackHoodiePrimary from "@/assets/products/black-hoodie/primary.jpg";
import blackHoodieSecondary from "@/assets/products/black-hoodie/secondary.jpg";
import blackHoodieFront from "@/assets/products/black-hoodie/front.jpg";
import blackHoodieBack from "@/assets/products/black-hoodie/back.jpg";
import blackHoodieLifestyle from "@/assets/products/black-hoodie/lifestyle.jpg";
import blackHoodieDetail from "@/assets/products/black-hoodie/detail.jpg";

import greyPrimary from "@/assets/products/grey-trousers/primary.jpg";
import greySecondary from "@/assets/products/grey-trousers/secondary.jpg";
import greyFront from "@/assets/products/grey-trousers/front.jpg";
import greyBack from "@/assets/products/grey-trousers/back.jpg";
import greyLifestyle from "@/assets/products/grey-trousers/lifestyle.jpg";
import greyDetail from "@/assets/products/grey-trousers/detail.jpg";
import greyCloseup from "@/assets/products/grey-trousers/closeup.jpg";

import blackTrousersPrimary from "@/assets/products/black-trousers/primary.jpg";
import blackTrousersSecondary from "@/assets/products/black-trousers/secondary.jpg";
import blackTrousersFront from "@/assets/products/black-trousers/front.jpg";
import blackTrousersBack from "@/assets/products/black-trousers/back.jpg";
import blackTrousersLifestyle from "@/assets/products/black-trousers/lifestyle.jpg";
import blackTrousersDetail from "@/assets/products/black-trousers/detail.jpg";
import blackTrousersCloseup from "@/assets/products/black-trousers/closeup.jpg";

export type LaunchProductMeta = {
  handle: string;
  title: string;
  color: string;
  category: "hoodies" | "trousers";
  price: number;
  description: string;
  images: Array<{ url: string; altText: string }>;
  tags: string[];
};

const SIZES = ["S", "M", "L"] as const;

export const LAUNCH_PRODUCTS: LaunchProductMeta[] = [
  {
    handle: "olive-green-hoodie",
    title: "EYVORA Olive Green Hoodie",
    color: "Olive Green",
    category: "hoodies",
    price: 4399,
    description:
      "A relaxed everyday hoodie in muted olive, finished with signature white piping and a clean EYVORA mark.",
    images: [
      { url: olivePrimary, altText: "EYVORA Olive Green Hoodie — front view" },
      { url: oliveSecondary, altText: "EYVORA Olive Green Hoodie — alternate view" },
      { url: oliveFront, altText: "EYVORA Olive Green Hoodie — front lifestyle" },
      { url: oliveBack, altText: "EYVORA Olive Green Hoodie — back view" },
      { url: oliveLifestyle, altText: "EYVORA Olive Green Hoodie — lifestyle" },
      { url: oliveDetail, altText: "EYVORA Olive Green Hoodie — detail" },
    ],
    tags: ["hoodies", "olive", "couple", "essentials", "new", "men", "women"],
  },
  {
    handle: "black-hoodie",
    title: "EYVORA Black Hoodie",
    color: "Black",
    category: "hoodies",
    price: 4399,
    description:
      "A deep charcoal hoodie with white piping and a refined silhouette for everyday wear.",
    images: [
      { url: blackHoodiePrimary, altText: "EYVORA Black Hoodie — front view" },
      { url: blackHoodieSecondary, altText: "EYVORA Black Hoodie — alternate view" },
      { url: blackHoodieFront, altText: "EYVORA Black Hoodie — front lifestyle" },
      { url: blackHoodieBack, altText: "EYVORA Black Hoodie — back view" },
      { url: blackHoodieLifestyle, altText: "EYVORA Black Hoodie — lifestyle" },
      { url: blackHoodieDetail, altText: "EYVORA Black Hoodie — detail" },
    ],
    tags: ["hoodies", "black", "couple", "essentials", "new", "men", "women"],
  },
  {
    handle: "grey-trousers",
    title: "EYVORA Grey Trousers",
    color: "Grey",
    category: "trousers",
    price: 2499,
    description:
      "Relaxed straight-leg trousers in soft heather grey, designed for comfort with a quiet logo mark.",
    images: [
      { url: greyPrimary, altText: "EYVORA Grey Trousers — front view" },
      { url: greySecondary, altText: "EYVORA Grey Trousers — alternate view" },
      { url: greyFront, altText: "EYVORA Grey Trousers — front lifestyle" },
      { url: greyBack, altText: "EYVORA Grey Trousers — back view" },
      { url: greyLifestyle, altText: "EYVORA Grey Trousers — lifestyle" },
      { url: greyDetail, altText: "EYVORA Grey Trousers — detail" },
      { url: greyCloseup, altText: "EYVORA Grey Trousers — close-up" },
    ],
    tags: ["trousers", "grey", "couple", "essentials", "new", "men", "women"],
  },
  {
    handle: "black-trousers",
    title: "EYVORA Black Trousers",
    color: "Black",
    category: "trousers",
    price: 2499,
    description:
      "Relaxed straight-leg trousers in deep black, finished with a minimal EYVORA mark on the thigh.",
    images: [
      { url: blackTrousersPrimary, altText: "EYVORA Black Trousers — front view" },
      { url: blackTrousersSecondary, altText: "EYVORA Black Trousers — alternate view" },
      { url: blackTrousersFront, altText: "EYVORA Black Trousers — front lifestyle" },
      { url: blackTrousersBack, altText: "EYVORA Black Trousers — back view" },
      { url: blackTrousersLifestyle, altText: "EYVORA Black Trousers — lifestyle" },
      { url: blackTrousersDetail, altText: "EYVORA Black Trousers — detail" },
      { url: blackTrousersCloseup, altText: "EYVORA Black Trousers — close-up" },
    ],
    tags: ["trousers", "black", "couple", "essentials", "new", "men", "women"],
  },
];

export const COUPLE_OUTFITS = [
  {
    id: "olive-black",
    title: "Olive Hoodie + Black Trousers",
    note: "Muted olive against deep black — a calm everyday pairing.",
    hoodieHandle: "olive-green-hoodie",
    trousersHandle: "black-trousers",
  },
  {
    id: "black-grey",
    title: "Black Hoodie + Grey Trousers",
    note: "High contrast essentials with a soft grey base.",
    hoodieHandle: "black-hoodie",
    trousersHandle: "grey-trousers",
  },
  {
    id: "black-black",
    title: "Black Hoodie + Black Trousers",
    note: "A monochrome set for a sharper silhouette.",
    hoodieHandle: "black-hoodie",
    trousersHandle: "black-trousers",
  },
] as const;

export function isShopifySyncedVariantId(id: string) {
  return id.startsWith("gid://shopify/ProductVariant/");
}

function buildLocalVariantId(handle: string, size: string) {
  return `local://${handle}/${size}`;
}

export function toShopifyProduct(meta: LaunchProductMeta): ShopifyProduct {
  const price = {
    amount: meta.price.toFixed(1),
    currencyCode: "PKR",
  };

  return {
    node: {
      id: `local://product/${meta.handle}`,
      title: meta.title,
      description: meta.description,
      handle: meta.handle,
      productType: meta.category === "hoodies" ? "Hoodies" : "Trousers",
      tags: meta.tags,
      availableForSale: true,
      priceRange: { minVariantPrice: price },
      compareAtPriceRange: undefined,
      images: {
        edges: meta.images.map((img) => ({
          node: { url: img.url, altText: img.altText },
        })),
      },
      options: [
        { name: "Size", values: [...SIZES] },
        { name: "Color", values: [meta.color] },
      ],
      variants: {
        edges: SIZES.map((size) => ({
          node: {
            id: buildLocalVariantId(meta.handle, size),
            title: size,
            price,
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: size },
              { name: "Color", value: meta.color },
            ],
          },
        })),
      },
    },
  };
}

export function getLaunchCatalog(): ShopifyProduct[] {
  return LAUNCH_PRODUCTS.map(toShopifyProduct);
}

export function getLaunchProductByHandle(handle: string): ShopifyProduct | null {
  const meta = LAUNCH_PRODUCTS.find((p) => p.handle === handle);
  return meta ? toShopifyProduct(meta) : null;
}

/** Prefer authentic launch photography when handles match. */
export function applyLaunchImagery(product: ShopifyProduct): ShopifyProduct {
  const meta = LAUNCH_PRODUCTS.find((p) => p.handle === product.node.handle);
  if (!meta) return product;
  return {
    node: {
      ...product.node,
      images: {
        edges: meta.images.map((img) => ({
          node: { url: img.url, altText: img.altText },
        })),
      },
    },
  };
}

/**
 * Detect the temporary demo catalogue currently in Shopify Admin
 * (wrong titles/prices vs the verified launch assortment).
 */
export function looksLikeDemoCatalog(products: ShopifyProduct[]) {
  if (products.length === 0) return true;
  const launchHandles = new Set(LAUNCH_PRODUCTS.map((p) => p.handle));
  const hasLaunch = products.some((p) => launchHandles.has(p.node.handle));
  if (hasLaunch) return false;

  const demoSignals = products.filter((p) => {
    const title = p.node.title.toLowerCase();
    const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
    return (
      title.includes("essential hoodie") ||
      title.includes("signature oversized") ||
      title.includes("classic trousers") ||
      title.includes("premium relaxed") ||
      price >= 9000
    );
  });
  return demoSignals.length >= Math.max(1, Math.floor(products.length / 2));
}

export function mergeWithShopifyCatalog(
  remote: ShopifyProduct[],
): ShopifyProduct[] {
  if (looksLikeDemoCatalog(remote)) {
    return getLaunchCatalog();
  }

  const byHandle = new Map(remote.map((p) => [p.node.handle, p]));
  return LAUNCH_PRODUCTS.map((meta) => {
    const remoteProduct = byHandle.get(meta.handle);
    if (!remoteProduct) return toShopifyProduct(meta);
    return applyLaunchImagery({
      node: {
        ...remoteProduct.node,
        title: meta.title,
        description: remoteProduct.node.description || meta.description,
        productType: meta.category === "hoodies" ? "Hoodies" : "Trousers",
        tags: Array.from(
          new Set([...(remoteProduct.node.tags ?? []), ...meta.tags]),
        ),
      },
    });
  });
}

export function findCatalogProduct(
  products: ShopifyProduct[],
  handle: string,
): ShopifyProduct | null {
  return (
    products.find((p) => p.node.handle === handle) ??
    getLaunchProductByHandle(handle)
  );
}
