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
import blackHoodieWomenFront from "@/assets/products/black-hoodie/women/front.jpg";
import blackHoodieWomenFrontAlt from "@/assets/products/black-hoodie/women/front-alt.jpg";
import blackHoodieWomenDetail from "@/assets/products/black-hoodie/women/detail.jpg";
import blackHoodieWomenBackLook from "@/assets/products/black-hoodie/women/back-look.jpg";
import blackHoodieWomenBackDetail from "@/assets/products/black-hoodie/women/back-detail.jpg";
import blackHoodieWomenBack from "@/assets/products/black-hoodie/women/back.jpg";

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

export type ProductImage = { url: string; altText: string };
export type ModelGender = "men" | "women";

export type LaunchProductMeta = {
  handle: string;
  title: string;
  color: string;
  category: "hoodies" | "trousers";
  price: number;
  description: string;
  /** Default gallery (men-first for unisex browsing / couple). */
  images: ProductImage[];
  /** Male-model shots — used on Men shop + product pages. */
  imagesMen: ProductImage[];
  /** Female-model shots — used on Women shop + product pages. */
  imagesWomen: ProductImage[];
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
    imagesMen: [
      { url: olivePrimary, altText: "EYVORA Olive Green Hoodie — men front view" },
      { url: oliveFront, altText: "EYVORA Olive Green Hoodie — men lifestyle" },
      { url: oliveBack, altText: "EYVORA Olive Green Hoodie — men back view" },
    ],
    imagesWomen: [
      { url: oliveSecondary, altText: "EYVORA Olive Green Hoodie — women front view" },
      { url: oliveLifestyle, altText: "EYVORA Olive Green Hoodie — women lifestyle" },
      { url: oliveDetail, altText: "EYVORA Olive Green Hoodie — women detail" },
    ],
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
    imagesMen: [
      { url: blackHoodiePrimary, altText: "EYVORA Black Hoodie — men front view" },
      { url: blackHoodieFront, altText: "EYVORA Black Hoodie — men lifestyle" },
      { url: blackHoodieLifestyle, altText: "EYVORA Black Hoodie — men detail" },
      { url: blackHoodieBack, altText: "EYVORA Black Hoodie — men back view" },
      { url: blackHoodieDetail, altText: "EYVORA Black Hoodie — men close-up" },
    ],
    imagesWomen: [
      { url: blackHoodieSecondary, altText: "EYVORA Black Hoodie — women front view" },
    ],
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
    imagesMen: [
      { url: greyPrimary, altText: "EYVORA Grey Trousers — men front view" },
      { url: greyFront, altText: "EYVORA Grey Trousers — men lifestyle" },
      { url: greyBack, altText: "EYVORA Grey Trousers — men back view" },
      { url: greyDetail, altText: "EYVORA Grey Trousers — detail" },
      { url: greyCloseup, altText: "EYVORA Grey Trousers — close-up" },
    ],
    imagesWomen: [
      { url: greySecondary, altText: "EYVORA Grey Trousers — women front view" },
      { url: greyLifestyle, altText: "EYVORA Grey Trousers — women lifestyle" },
      { url: greyDetail, altText: "EYVORA Grey Trousers — detail" },
      { url: greyCloseup, altText: "EYVORA Grey Trousers — close-up" },
    ],
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
    imagesMen: [
      { url: blackTrousersPrimary, altText: "EYVORA Black Trousers — men front view" },
      { url: blackTrousersFront, altText: "EYVORA Black Trousers — men lifestyle" },
      { url: blackTrousersBack, altText: "EYVORA Black Trousers — men back view" },
      { url: blackTrousersDetail, altText: "EYVORA Black Trousers — detail" },
      { url: blackTrousersCloseup, altText: "EYVORA Black Trousers — close-up" },
    ],
    imagesWomen: [
      { url: blackTrousersSecondary, altText: "EYVORA Black Trousers — women front view" },
      { url: blackTrousersLifestyle, altText: "EYVORA Black Trousers — women lifestyle" },
      { url: blackTrousersDetail, altText: "EYVORA Black Trousers — detail" },
      { url: blackTrousersCloseup, altText: "EYVORA Black Trousers — close-up" },
    ],
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

export function resolveModelGender(
  value: string | null | undefined,
): ModelGender | undefined {
  if (value === "men" || value === "women") return value;
  return undefined;
}

export function imagesForGender(
  meta: LaunchProductMeta,
  gender?: ModelGender | string | null,
): ProductImage[] {
  if (gender === "women" && meta.imagesWomen.length) return meta.imagesWomen;
  if (gender === "men" && meta.imagesMen.length) return meta.imagesMen;
  return meta.images;
}

export type CouplePieceOption = {
  handle: string;
  label: string;
  color: string;
  kind: "hoodie" | "trousers";
};

/** Selectable pieces for the couple builder (Person 1 / Person 2). */
export const COUPLE_HOODIES: CouplePieceOption[] = [
  { handle: "olive-green-hoodie", label: "Olive Green Hoodie", color: "Olive", kind: "hoodie" },
  { handle: "black-hoodie", label: "Black Hoodie", color: "Black", kind: "hoodie" },
];

export const COUPLE_TROUSERS: CouplePieceOption[] = [
  { handle: "grey-trousers", label: "Grey Trousers", color: "Grey", kind: "trousers" },
  { handle: "black-trousers", label: "Black Trousers", color: "Black", kind: "trousers" },
];

export const COUPLE_OUTFITS = [
  {
    id: "olive-black",
    title: "Olive + Black",
    note: "Muted olive against deep black — a calm everyday pairing.",
    hoodieHandle: "olive-green-hoodie",
    trousersHandle: "black-trousers",
    mode: "matching" as const,
  },
  {
    id: "black-grey",
    title: "Black + Grey",
    note: "High contrast essentials with a soft grey base.",
    hoodieHandle: "black-hoodie",
    trousersHandle: "grey-trousers",
    mode: "matching" as const,
  },
  {
    id: "black-black",
    title: "All Black",
    note: "A monochrome set for a sharper silhouette.",
    hoodieHandle: "black-hoodie",
    trousersHandle: "black-trousers",
    mode: "matching" as const,
  },
  {
    id: "mix-olive-black",
    title: "Mix — Olive & Black hoodies",
    note: "Different colours for each person, paired with black trousers.",
    hoodieHandle: "olive-green-hoodie",
    trousersHandle: "black-trousers",
    person2HoodieHandle: "black-hoodie",
    person2TrousersHandle: "black-trousers",
    mode: "mix" as const,
  },
] as const;

export type ShopDepartment = "men" | "women" | "couple" | "all";

/** Exact department match via product tags (avoids “men” matching inside “women”). */
export function matchesDepartment(
  product: ShopifyProduct,
  department: ShopDepartment | string | undefined,
): boolean {
  if (!department || department === "all") return true;
  const tags = (product.node.tags ?? []).map((t) => t.toLowerCase());
  const title = product.node.title.toLowerCase();
  const hay = `${product.node.productType ?? ""} ${tags.join(" ")}`.toLowerCase();

  if (department === "men") {
    // Unisex launch pieces carry both tags; men-only future SKUs use `men` without `women-only`.
    if (tags.includes("women-only")) return false;
    return tags.includes("men") || tags.includes("unisex") || tags.includes("essentials");
  }
  if (department === "women") {
    if (tags.includes("men-only")) return false;
    return tags.includes("women") || tags.includes("unisex") || tags.includes("essentials");
  }
  if (department === "couple") {
    return tags.includes("couple") || title.includes("couple") || hay.includes("couple");
  }
  return hay.includes(department.toLowerCase());
}

export function matchesCategory(
  product: ShopifyProduct,
  category: string | undefined,
): boolean {
  if (!category) return true;
  const needle = category.toLowerCase().replace(/s$/, "");
  const hay =
    `${product.node.title} ${product.node.productType ?? ""} ${(product.node.tags ?? []).join(" ")}`.toLowerCase();
  return hay.includes(needle);
}

export function isShopifySyncedVariantId(id: string) {
  return id.startsWith("gid://shopify/ProductVariant/");
}

function buildLocalVariantId(handle: string, size: string) {
  return `local://${handle}/${size}`;
}

export function toShopifyProduct(
  meta: LaunchProductMeta,
  gender?: ModelGender | string | null,
): ShopifyProduct {
  const price = {
    amount: meta.price.toFixed(1),
    currencyCode: "PKR",
  };
  const images = imagesForGender(meta, gender);

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
        edges: images.map((img) => ({
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

export function getLaunchCatalog(gender?: ModelGender | string | null): ShopifyProduct[] {
  return LAUNCH_PRODUCTS.map((meta) => toShopifyProduct(meta, gender));
}

export function getLaunchProductByHandle(
  handle: string,
  gender?: ModelGender | string | null,
): ShopifyProduct | null {
  const meta = LAUNCH_PRODUCTS.find((p) => p.handle === handle);
  return meta ? toShopifyProduct(meta, gender) : null;
}

/** Prefer authentic launch photography; honour Men/Women model gender when provided. */
export function applyLaunchImagery(
  product: ShopifyProduct,
  gender?: ModelGender | string | null,
): ShopifyProduct {
  const meta = LAUNCH_PRODUCTS.find((p) => p.handle === product.node.handle);
  if (!meta) return product;
  const images = imagesForGender(meta, gender);
  return {
    node: {
      ...product.node,
      images: {
        edges: images.map((img) => ({
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

/**
 * Merge Shopify Admin catalogue with launch overrides.
 * - Launch handles keep curated titles/tags/photography when present remotely.
 * - Any additional active Shopify products are appended automatically
 *   (add in Admin → they appear on the Vercel storefront after publish).
 */
export function mergeWithShopifyCatalog(
  remote: ShopifyProduct[],
  gender?: ModelGender | string | null,
): ShopifyProduct[] {
  if (looksLikeDemoCatalog(remote)) {
    return getLaunchCatalog(gender);
  }

  const byHandle = new Map(remote.map((p) => [p.node.handle, p]));
  const launchHandles = new Set(LAUNCH_PRODUCTS.map((p) => p.handle));

  const launch = LAUNCH_PRODUCTS.map((meta) => {
    const remoteProduct = byHandle.get(meta.handle);
    if (!remoteProduct) return toShopifyProduct(meta, gender);
    return applyLaunchImagery(
      {
        node: {
          ...remoteProduct.node,
          title: meta.title,
          description: remoteProduct.node.description || meta.description,
          productType: meta.category === "hoodies" ? "Hoodies" : "Trousers",
          tags: Array.from(
            new Set([...(remoteProduct.node.tags ?? []), ...meta.tags]),
          ),
        },
      },
      gender,
    );
  });

  const extras = remote
    .filter((p) => !launchHandles.has(p.node.handle))
    .filter((p) => p.node.availableForSale !== false)
    .map((p) => applyLaunchImagery(p, gender));

  return [...launch, ...extras];
}

export function findCatalogProduct(
  products: ShopifyProduct[],
  handle: string,
  gender?: ModelGender | string | null,
): ShopifyProduct | null {
  return (
    products.find((p) => p.node.handle === handle) ??
    getLaunchProductByHandle(handle, gender)
  );
}
