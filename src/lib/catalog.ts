import type { ShopifyProduct } from "@/lib/shopify";

import olivePrimary from "@/assets/products/olive-hoodie/primary.jpg";
import oliveSecondary from "@/assets/products/olive-hoodie/secondary.jpg";
import oliveFront from "@/assets/products/olive-hoodie/front.jpg";
import oliveBack from "@/assets/products/olive-hoodie/back.jpg";
import oliveLifestyle from "@/assets/products/olive-hoodie/lifestyle.jpg";
import oliveDetail from "@/assets/products/olive-hoodie/detail.jpg";
import oliveWomenFront from "@/assets/products/olive-hoodie/women/front.jpg";
import oliveWomenFrontAlt from "@/assets/products/olive-hoodie/women/front-alt.jpg";
import oliveWomenDetail from "@/assets/products/olive-hoodie/women/detail.jpg";
import oliveWomenHood from "@/assets/products/olive-hoodie/women/hood.jpg";
import oliveWomenBack from "@/assets/products/olive-hoodie/women/back.jpg";

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
import greyWomenFront from "@/assets/products/grey-trousers/women/front.jpg";
import greyWomenLifestyle from "@/assets/products/grey-trousers/women/lifestyle.jpg";
import greyWomenLogo from "@/assets/products/grey-trousers/women/logo.jpg";
import greyWomenPocketBack from "@/assets/products/grey-trousers/women/pocket-back.jpg";
import greyWomenPocketSide from "@/assets/products/grey-trousers/women/pocket-side.jpg";
import greyWomenPhonePocket from "@/assets/products/grey-trousers/women/phone-pocket.jpg";

import blackTrousersPrimary from "@/assets/products/black-trousers/primary.jpg";
import blackTrousersSecondary from "@/assets/products/black-trousers/secondary.jpg";
import blackTrousersFront from "@/assets/products/black-trousers/front.jpg";
import blackTrousersBack from "@/assets/products/black-trousers/back.jpg";
import blackTrousersLifestyle from "@/assets/products/black-trousers/lifestyle.jpg";
import blackTrousersDetail from "@/assets/products/black-trousers/detail.jpg";
import blackTrousersCloseup from "@/assets/products/black-trousers/closeup.jpg";
import blackTrousersWomenFront from "@/assets/products/black-trousers/women/front.jpg";
import blackTrousersWomenLifestyle from "@/assets/products/black-trousers/women/lifestyle.jpg";
import blackTrousersWomenLogo from "@/assets/products/black-trousers/women/logo.jpg";
import blackTrousersWomenPocketBack from "@/assets/products/black-trousers/women/pocket-back.jpg";
import blackTrousersWomenPocketSide from "@/assets/products/black-trousers/women/pocket-side.jpg";
import blackTrousersWomenPhonePocket from "@/assets/products/black-trousers/women/phone-pocket.jpg";
import blackTrousersWomenBackWalk from "@/assets/products/black-trousers/women/back-walk.jpg";

import coupleContrastHoodiesA from "@/assets/products/couple/contrast/olive-black-grey.jpg";
import coupleContrastHoodiesB from "@/assets/products/couple/contrast/black-olive-seated.jpg";
import coupleContrastTrousersBack from "@/assets/products/couple/contrast/trousers-back.jpg";
import coupleContrastTrousersFront from "@/assets/products/couple/contrast/trousers-front.jpg";
import coupleContrastTrousersSide from "@/assets/products/couple/contrast/trousers-side.jpg";

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
      { url: oliveWomenFront, altText: "EYVORA Olive Green Hoodie — women front view" },
      { url: oliveWomenFrontAlt, altText: "EYVORA Olive Green Hoodie — women portrait" },
      { url: oliveWomenDetail, altText: "EYVORA Olive Green Hoodie — women detail" },
      { url: oliveWomenHood, altText: "EYVORA Olive Green Hoodie — women hood up" },
      { url: oliveWomenBack, altText: "EYVORA Olive Green Hoodie — women back view" },
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
      { url: blackHoodieWomenFront, altText: "EYVORA Black Hoodie — women front view" },
      { url: blackHoodieWomenFrontAlt, altText: "EYVORA Black Hoodie — women chest detail" },
      { url: blackHoodieWomenDetail, altText: "EYVORA Black Hoodie — women pocket detail" },
      { url: blackHoodieWomenBackLook, altText: "EYVORA Black Hoodie — women back look" },
      { url: blackHoodieWomenBackDetail, altText: "EYVORA Black Hoodie — women back detail" },
      { url: blackHoodieWomenBack, altText: "EYVORA Black Hoodie — women back view" },
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
      { url: greyWomenFront, altText: "EYVORA Grey Trousers — women front view" },
      { url: greyWomenLifestyle, altText: "EYVORA Grey Trousers — women walking" },
      { url: greyWomenLogo, altText: "EYVORA Grey Trousers — women logo detail" },
      { url: greyWomenPocketBack, altText: "EYVORA Grey Trousers — women pocket detail" },
      { url: greyWomenPocketSide, altText: "EYVORA Grey Trousers — women side pocket" },
      { url: greyWomenPhonePocket, altText: "EYVORA Grey Trousers — women phone pocket" },
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
      { url: blackTrousersWomenFront, altText: "EYVORA Black Trousers — women front view" },
      { url: blackTrousersWomenLifestyle, altText: "EYVORA Black Trousers — women walking" },
      { url: blackTrousersWomenLogo, altText: "EYVORA Black Trousers — women logo detail" },
      { url: blackTrousersWomenPocketBack, altText: "EYVORA Black Trousers — women pocket detail" },
      { url: blackTrousersWomenPocketSide, altText: "EYVORA Black Trousers — women side pocket" },
      { url: blackTrousersWomenPhonePocket, altText: "EYVORA Black Trousers — women phone pocket" },
      { url: blackTrousersWomenBackWalk, altText: "EYVORA Black Trousers — women back walk" },
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

export const COUPLE_CONTRAST_GALLERY = [
  {
    id: "hoodies-olive-black",
    src: coupleContrastHoodiesA,
    alt: "Couple contrast — olive hoodie with black trousers and black hoodie with grey trousers",
    caption: "Contrast hoodies — Olive + Black",
  },
  {
    id: "hoodies-seated",
    src: coupleContrastHoodiesB,
    alt: "Couple contrast — black hoodie and olive hoodie seated look",
    caption: "Contrast hoodies — seated look",
  },
  {
    id: "trousers-front",
    src: coupleContrastTrousersFront,
    alt: "Couple contrast trousers — black and grey front",
    caption: "Contrast trousers — Black + Grey",
  },
  {
    id: "trousers-side",
    src: coupleContrastTrousersSide,
    alt: "Couple contrast trousers — side view",
    caption: "Contrast trousers — side",
  },
  {
    id: "trousers-back",
    src: coupleContrastTrousersBack,
    alt: "Couple contrast trousers — back pockets",
    caption: "Contrast trousers — back",
  },
] as const;

export const COUPLE_OUTFITS = [
  {
    id: "contrast-olive-black",
    title: "Contrast — Olive & Black",
    note: "Signature couple contrast: one olive hoodie + black trousers, one black hoodie + grey trousers.",
    hoodieHandle: "olive-green-hoodie",
    trousersHandle: "black-trousers",
    person2HoodieHandle: "black-hoodie",
    person2TrousersHandle: "grey-trousers",
    mode: "mix" as const,
  },
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

/** Stable product id for a gendered shop card (keeps Shopify/local id for cart). */
export function productCardForGender(
  product: ShopifyProduct,
  gender: ModelGender,
): ShopifyProduct {
  const imaged = applyLaunchImagery(product, gender);
  const baseId = imaged.node.id.replace(/::(men|women)$/i, "");
  return {
    node: {
      ...imaged.node,
      id: `${baseId}::${gender}`,
    },
  };
}

/**
 * Expand unisex launch pieces into Men + Women cards so category / Shop All
 * views show both model galleries (Hoodies & Trousers menu links).
 */
export function expandProductsForBothGenders(
  products: ShopifyProduct[],
): Array<{ product: ShopifyProduct; gender: ModelGender }> {
  const items: Array<{ product: ShopifyProduct; gender: ModelGender }> = [];
  for (const product of products) {
    const meta = LAUNCH_PRODUCTS.find((p) => p.handle === product.node.handle);
    const hasMen = Boolean(meta?.imagesMen.length);
    const hasWomen = Boolean(meta?.imagesWomen.length);
    if (hasMen && hasWomen) {
      items.push({ product: productCardForGender(product, "men"), gender: "men" });
      items.push({ product: productCardForGender(product, "women"), gender: "women" });
      continue;
    }
    if (hasWomen) {
      items.push({ product: productCardForGender(product, "women"), gender: "women" });
      continue;
    }
    items.push({
      product: hasMen ? productCardForGender(product, "men") : product,
      gender: "men",
    });
  }
  return items;
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
  const found = products.find((p) => p.node.handle === handle);
  if (found) return applyLaunchImagery(found, gender);
  return getLaunchProductByHandle(handle, gender);
}
