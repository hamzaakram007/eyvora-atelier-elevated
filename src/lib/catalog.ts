import type { ShopifyProduct } from "@/lib/shopify";
import { registerImageVariants } from "@/lib/image-variants";
import {
  HOODIE_LIST_PRICE,
  HOODIE_SALE_PRICE,
  PRODUCT_SALE_PERCENT,
  TROUSER_LIST_PRICE,
  TROUSER_SALE_PRICE,
} from "@/lib/pricing";

import olivePrimary from "@/assets/products/olive-hoodie/primary.webp";
import oliveSecondary from "@/assets/products/olive-hoodie/secondary.webp";
import oliveFront from "@/assets/products/olive-hoodie/front.webp";
import oliveBack from "@/assets/products/olive-hoodie/back.webp";
import oliveLifestyle from "@/assets/products/olive-hoodie/lifestyle.webp";
import oliveDetail from "@/assets/products/olive-hoodie/detail.webp";
import oliveWomenFront from "@/assets/products/olive-hoodie/women/front.webp";
import oliveWomenFrontAlt from "@/assets/products/olive-hoodie/women/front-alt.webp";
import oliveWomenDetail from "@/assets/products/olive-hoodie/women/detail.webp";
import oliveWomenHood from "@/assets/products/olive-hoodie/women/hood.webp";
import oliveWomenBack from "@/assets/products/olive-hoodie/women/back.webp";

import blackHoodiePrimary from "@/assets/products/black-hoodie/primary.webp";
import blackHoodieSecondary from "@/assets/products/black-hoodie/secondary.webp";
import blackHoodieFront from "@/assets/products/black-hoodie/front.webp";
import blackHoodieBack from "@/assets/products/black-hoodie/back.webp";
import blackHoodieLifestyle from "@/assets/products/black-hoodie/lifestyle.webp";
import blackHoodieDetail from "@/assets/products/black-hoodie/detail.webp";
import blackHoodieWomenFront from "@/assets/products/black-hoodie/women/front.webp";
import blackHoodieWomenFrontAlt from "@/assets/products/black-hoodie/women/front-alt.webp";
import blackHoodieWomenDetail from "@/assets/products/black-hoodie/women/detail.webp";
import blackHoodieWomenBackLook from "@/assets/products/black-hoodie/women/back-look.webp";
import blackHoodieWomenBackDetail from "@/assets/products/black-hoodie/women/back-detail.webp";
import blackHoodieWomenBack from "@/assets/products/black-hoodie/women/back.webp";

import greyPrimary from "@/assets/products/grey-trousers/primary.webp";
import greySecondary from "@/assets/products/grey-trousers/secondary.webp";
import greyFront from "@/assets/products/grey-trousers/front.webp";
import greyBack from "@/assets/products/grey-trousers/back.webp";
import greyLifestyle from "@/assets/products/grey-trousers/lifestyle.webp";
import greyDetail from "@/assets/products/grey-trousers/detail.webp";
import greyCloseup from "@/assets/products/grey-trousers/closeup.webp";
import greyWomenFront from "@/assets/products/grey-trousers/women/front.webp";
import greyWomenLifestyle from "@/assets/products/grey-trousers/women/lifestyle.webp";
import greyWomenLogo from "@/assets/products/grey-trousers/women/logo.webp";
import greyWomenPocketBack from "@/assets/products/grey-trousers/women/pocket-back.webp";
import greyWomenPocketSide from "@/assets/products/grey-trousers/women/pocket-side.webp";
import greyWomenPhonePocket from "@/assets/products/grey-trousers/women/phone-pocket.webp";

import blackTrousersPrimary from "@/assets/products/black-trousers/primary.webp";
import blackTrousersSecondary from "@/assets/products/black-trousers/secondary.webp";
import blackTrousersFront from "@/assets/products/black-trousers/front.webp";
import blackTrousersBack from "@/assets/products/black-trousers/back.webp";
import blackTrousersLifestyle from "@/assets/products/black-trousers/lifestyle.webp";
import blackTrousersDetail from "@/assets/products/black-trousers/detail.webp";
import blackTrousersCloseup from "@/assets/products/black-trousers/closeup.webp";
import blackTrousersWomenFront from "@/assets/products/black-trousers/women/front.webp";
import blackTrousersWomenLifestyle from "@/assets/products/black-trousers/women/lifestyle.webp";
import blackTrousersWomenLogo from "@/assets/products/black-trousers/women/logo.webp";
import blackTrousersWomenPocketBack from "@/assets/products/black-trousers/women/pocket-back.webp";
import blackTrousersWomenPocketSide from "@/assets/products/black-trousers/women/pocket-side.webp";
import blackTrousersWomenPhonePocket from "@/assets/products/black-trousers/women/phone-pocket.webp";
import blackTrousersWomenBackWalk from "@/assets/products/black-trousers/women/back-walk.webp";

import coupleContrastHoodiesA from "@/assets/products/couple/contrast/olive-black-grey.webp";
import coupleContrastHoodiesB from "@/assets/products/couple/contrast/black-olive-seated.webp";
import coupleContrastTrousersBack from "@/assets/products/couple/contrast/trousers-back.webp";
import coupleContrastTrousersFront from "@/assets/products/couple/contrast/trousers-front.webp";
import coupleContrastTrousersSide from "@/assets/products/couple/contrast/trousers-side.webp";

export type ProductImage = { url: string; altText: string };


function pic(url: string, publicBase: string, altText: string): ProductImage {
  registerImageVariants(url, publicBase);
  return { url, altText };
}

export type ModelGender = "men" | "women";

export type LaunchProductMeta = {
  handle: string;
  /**
   * Alternate Shopify Admin handles that map to this launch product.
   * Prefer male/unisex first — used for real Storefront variant GIDs (checkout).
   */
  shopifyHandles?: readonly string[];
  title: string;
  color: string;
  category: "hoodies" | "trousers";
  /** Offline fallback sale price (live prices come from Shopify). */
  price: number;
  /** Offline fallback compare-at price. */
  compareAtPrice: number;
  description: string;
  /** Default gallery (men-first for unisex browsing / couple). */
  images: ProductImage[];
  /** Male-model shots — used on Men shop + product pages. */
  imagesMen: ProductImage[];
  /** Female-model shots — used on Women shop + product pages. */
  imagesWomen: ProductImage[];
  tags: string[];
};

/**
 * Website handle + Shopify Admin aliases.
 * When Admin splits male/female products, prefer the matching gender first so
 * Price edits on "Female Olive Green Hoodie" show on Women cards/PDPs.
 */
export function shopifyHandleCandidates(
  meta: LaunchProductMeta,
  gender?: ModelGender | string | null,
): string[] {
  const aliases = [...(meta.shopifyHandles ?? [])];
  // "female" contains "male" — test women before men.
  const womenFirst = (h: string) => /female|women/i.test(h);
  const menFirst = (h: string) =>
    !womenFirst(h) && /male|\bmen\b/i.test(h);

  let ordered = aliases;
  if (gender === "women") {
    ordered = [
      ...aliases.filter(womenFirst),
      ...aliases.filter((h) => !womenFirst(h)),
    ];
  } else if (gender === "men") {
    ordered = [
      ...aliases.filter(menFirst),
      ...aliases.filter((h) => !menFirst(h)),
    ];
  }

  return [meta.handle, ...ordered];
}

/** Launch size run — Small, Medium, Large, Extra Large. */
export const PRODUCT_SIZES = ["S", "M", "L", "XL"] as const;

const SIZE_RANK = new Map(PRODUCT_SIZES.map((size, i) => [size.toUpperCase(), i]));

/** Drop leading brand from titles so cards don't read "EYVORA …" under the logo. */
export function displayProductTitle(title: string): string {
  return title.replace(/^EYVORA\s+/i, "").trim() || title;
}

/** Always render sizes as S → M → L → XL (Shopify option order can drift). */
export function sortProductSizes(values: readonly string[]): string[] {
  return [...values].sort((a, b) => {
    const ai = SIZE_RANK.get(a.toUpperCase());
    const bi = SIZE_RANK.get(b.toUpperCase());
    if (ai == null && bi == null) return a.localeCompare(b);
    if (ai == null) return 1;
    if (bi == null) return -1;
    return ai - bi;
  });
}

function sizeLabelFromVariant(
  variant: ShopifyProduct["node"]["variants"]["edges"][number]["node"],
) {
  return (
    variant.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value ||
    variant.title
  );
}

/** Sort variant edges so size buttons stay S → M → L → XL. */
export function sortVariantsBySize<
  T extends ShopifyProduct["node"]["variants"]["edges"][number],
>(edges: T[]): T[] {
  return [...edges].sort((a, b) => {
    const aLabel = sizeLabelFromVariant(a.node);
    const bLabel = sizeLabelFromVariant(b.node);
    const ai = SIZE_RANK.get(aLabel.toUpperCase());
    const bi = SIZE_RANK.get(bLabel.toUpperCase());
    if (ai == null && bi == null) return aLabel.localeCompare(bLabel);
    if (ai == null) return 1;
    if (bi == null) return -1;
    return ai - bi;
  });
}

/** Hoodie colours only. */
export const HOODIE_COLOURS = ["Olive Green", "Black"] as const;

/** Trouser colours only. */
export const TROUSER_COLOURS = ["Grey", "Black"] as const;

const SIZES = PRODUCT_SIZES;

export const LAUNCH_PRODUCTS: LaunchProductMeta[] = [
  {
    handle: "olive-green-hoodie",
    shopifyHandles: [
      "eyvora-male-olive-green-hoodie",
      "eyvora-female-olive-green-hoodie",
    ],
    title: "EYVORA Olive Green Hoodie",
    color: "Olive Green",
    category: "hoodies",
    price: HOODIE_SALE_PRICE,
    compareAtPrice: HOODIE_LIST_PRICE,
    description:
      "A relaxed everyday hoodie in muted olive, finished with signature white piping and a clean EYVORA mark.",
    imagesMen: [
      pic(olivePrimary, "olive-hoodie/primary", "EYVORA Olive Green Hoodie — men front view"),
      pic(oliveFront, "olive-hoodie/front", "EYVORA Olive Green Hoodie — men lifestyle"),
      pic(oliveBack, "olive-hoodie/back", "EYVORA Olive Green Hoodie — men back view"),
    ],
    imagesWomen: [
      pic(oliveWomenFront, "olive-hoodie/women/front", "EYVORA Olive Green Hoodie — women front view"),
      pic(oliveWomenFrontAlt, "olive-hoodie/women/front-alt", "EYVORA Olive Green Hoodie — women portrait"),
      pic(oliveWomenDetail, "olive-hoodie/women/detail", "EYVORA Olive Green Hoodie — women detail"),
      pic(oliveWomenHood, "olive-hoodie/women/hood", "EYVORA Olive Green Hoodie — women hood up"),
      pic(oliveWomenBack, "olive-hoodie/women/back", "EYVORA Olive Green Hoodie — women back view"),
    ],
    images: [
      pic(olivePrimary, "olive-hoodie/primary", "EYVORA Olive Green Hoodie — front view"),
      pic(oliveSecondary, "olive-hoodie/secondary", "EYVORA Olive Green Hoodie — alternate view"),
      pic(oliveFront, "olive-hoodie/front", "EYVORA Olive Green Hoodie — front lifestyle"),
      pic(oliveBack, "olive-hoodie/back", "EYVORA Olive Green Hoodie — back view"),
      pic(oliveLifestyle, "olive-hoodie/lifestyle", "EYVORA Olive Green Hoodie — lifestyle"),
      pic(oliveDetail, "olive-hoodie/detail", "EYVORA Olive Green Hoodie — detail"),
    ],
    tags: ["hoodies", "olive", "couple", "essentials", "new", "men", "women"],
  },
  {
    handle: "black-hoodie",
    shopifyHandles: ["eyvora-male-black-hoodie", "eyvora-female-black-hoodie"],
    title: "EYVORA Black Hoodie",
    color: "Black",
    category: "hoodies",
    price: HOODIE_SALE_PRICE,
    compareAtPrice: HOODIE_LIST_PRICE,
    description:
      "A deep charcoal hoodie with white piping and a refined silhouette for everyday wear.",
    imagesMen: [
      pic(blackHoodiePrimary, "black-hoodie/primary", "EYVORA Black Hoodie — men front view"),
      pic(blackHoodieFront, "black-hoodie/front", "EYVORA Black Hoodie — men lifestyle"),
      pic(blackHoodieLifestyle, "black-hoodie/lifestyle", "EYVORA Black Hoodie — men detail"),
      pic(blackHoodieBack, "black-hoodie/back", "EYVORA Black Hoodie — men back view"),
      pic(blackHoodieDetail, "black-hoodie/detail", "EYVORA Black Hoodie — men close-up"),
    ],
    imagesWomen: [
      pic(blackHoodieWomenFront, "black-hoodie/women/front", "EYVORA Black Hoodie — women front view"),
      pic(blackHoodieWomenFrontAlt, "black-hoodie/women/front-alt", "EYVORA Black Hoodie — women chest detail"),
      pic(blackHoodieWomenDetail, "black-hoodie/women/detail", "EYVORA Black Hoodie — women pocket detail"),
      pic(blackHoodieWomenBackLook, "black-hoodie/women/back-look", "EYVORA Black Hoodie — women back look"),
      pic(blackHoodieWomenBackDetail, "black-hoodie/women/back-detail", "EYVORA Black Hoodie — women back detail"),
      pic(blackHoodieWomenBack, "black-hoodie/women/back", "EYVORA Black Hoodie — women back view"),
    ],
    images: [
      pic(blackHoodiePrimary, "black-hoodie/primary", "EYVORA Black Hoodie — front view"),
      pic(blackHoodieSecondary, "black-hoodie/secondary", "EYVORA Black Hoodie — alternate view"),
      pic(blackHoodieFront, "black-hoodie/front", "EYVORA Black Hoodie — front lifestyle"),
      pic(blackHoodieBack, "black-hoodie/back", "EYVORA Black Hoodie — back view"),
      pic(blackHoodieLifestyle, "black-hoodie/lifestyle", "EYVORA Black Hoodie — lifestyle"),
      pic(blackHoodieDetail, "black-hoodie/detail", "EYVORA Black Hoodie — detail"),
    ],
    tags: ["hoodies", "black", "couple", "essentials", "new", "men", "women"],
  },
  {
    handle: "grey-trousers",
    shopifyHandles: [
      "eyvora-male-grey-trousers",
      "eyvora-female-grey-trousers-copy",
    ],
    title: "EYVORA Grey Trousers",
    color: "Grey",
    category: "trousers",
    price: TROUSER_SALE_PRICE,
    compareAtPrice: TROUSER_LIST_PRICE,
    description:
      "Relaxed straight-leg trousers in soft heather grey, designed for comfort with a quiet logo mark.",
    imagesMen: [
      pic(greyPrimary, "grey-trousers/primary", "EYVORA Grey Trousers — men front view"),
      pic(greyFront, "grey-trousers/front", "EYVORA Grey Trousers — men lifestyle"),
      pic(greyBack, "grey-trousers/back", "EYVORA Grey Trousers — men back view"),
      pic(greyDetail, "grey-trousers/detail", "EYVORA Grey Trousers — detail"),
      pic(greyCloseup, "grey-trousers/closeup", "EYVORA Grey Trousers — close-up"),
    ],
    imagesWomen: [
      pic(greyWomenFront, "grey-trousers/women/front", "EYVORA Grey Trousers — women front view"),
      pic(greyWomenLifestyle, "grey-trousers/women/lifestyle", "EYVORA Grey Trousers — women walking"),
      pic(greyWomenLogo, "grey-trousers/women/logo", "EYVORA Grey Trousers — women logo detail"),
      pic(greyWomenPocketBack, "grey-trousers/women/pocket-back", "EYVORA Grey Trousers — women pocket detail"),
      pic(greyWomenPocketSide, "grey-trousers/women/pocket-side", "EYVORA Grey Trousers — women side pocket"),
      pic(greyWomenPhonePocket, "grey-trousers/women/phone-pocket", "EYVORA Grey Trousers — women phone pocket"),
    ],
    images: [
      pic(greyPrimary, "grey-trousers/primary", "EYVORA Grey Trousers — front view"),
      pic(greySecondary, "grey-trousers/secondary", "EYVORA Grey Trousers — alternate view"),
      pic(greyFront, "grey-trousers/front", "EYVORA Grey Trousers — front lifestyle"),
      pic(greyBack, "grey-trousers/back", "EYVORA Grey Trousers — back view"),
      pic(greyLifestyle, "grey-trousers/lifestyle", "EYVORA Grey Trousers — lifestyle"),
      pic(greyDetail, "grey-trousers/detail", "EYVORA Grey Trousers — detail"),
      pic(greyCloseup, "grey-trousers/closeup", "EYVORA Grey Trousers — close-up"),
    ],
    tags: ["trousers", "grey", "couple", "essentials", "new", "men", "women"],
  },
  {
    handle: "black-trousers",
    // Admin handle eyvora-grey-trousers is misnamed — product is Male Black Trousers.
    shopifyHandles: ["eyvora-grey-trousers", "eyvora-women-black-trousers"],
    title: "EYVORA Black Trousers",
    color: "Black",
    category: "trousers",
    price: TROUSER_SALE_PRICE,
    compareAtPrice: TROUSER_LIST_PRICE,
    description:
      "Relaxed straight-leg trousers in deep black, finished with a minimal EYVORA mark on the thigh.",
    imagesMen: [
      pic(blackTrousersPrimary, "black-trousers/primary", "EYVORA Black Trousers — men front view"),
      pic(blackTrousersFront, "black-trousers/front", "EYVORA Black Trousers — men lifestyle"),
      pic(blackTrousersBack, "black-trousers/back", "EYVORA Black Trousers — men back view"),
      pic(blackTrousersDetail, "black-trousers/detail", "EYVORA Black Trousers — detail"),
      pic(blackTrousersCloseup, "black-trousers/closeup", "EYVORA Black Trousers — close-up"),
    ],
    imagesWomen: [
      pic(blackTrousersWomenFront, "black-trousers/women/front", "EYVORA Black Trousers — women front view"),
      pic(blackTrousersWomenLifestyle, "black-trousers/women/lifestyle", "EYVORA Black Trousers — women walking"),
      pic(blackTrousersWomenLogo, "black-trousers/women/logo", "EYVORA Black Trousers — women logo detail"),
      pic(blackTrousersWomenPocketBack, "black-trousers/women/pocket-back", "EYVORA Black Trousers — women pocket detail"),
      pic(blackTrousersWomenPocketSide, "black-trousers/women/pocket-side", "EYVORA Black Trousers — women side pocket"),
      pic(blackTrousersWomenPhonePocket, "black-trousers/women/phone-pocket", "EYVORA Black Trousers — women phone pocket"),
      pic(blackTrousersWomenBackWalk, "black-trousers/women/back-walk", "EYVORA Black Trousers — women back walk"),
    ],
    images: [
      pic(blackTrousersPrimary, "black-trousers/primary", "EYVORA Black Trousers — front view"),
      pic(blackTrousersSecondary, "black-trousers/secondary", "EYVORA Black Trousers — alternate view"),
      pic(blackTrousersFront, "black-trousers/front", "EYVORA Black Trousers — front lifestyle"),
      pic(blackTrousersBack, "black-trousers/back", "EYVORA Black Trousers — back view"),
      pic(blackTrousersLifestyle, "black-trousers/lifestyle", "EYVORA Black Trousers — lifestyle"),
      pic(blackTrousersDetail, "black-trousers/detail", "EYVORA Black Trousers — detail"),
      pic(blackTrousersCloseup, "black-trousers/closeup", "EYVORA Black Trousers — close-up"),
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
  { handle: "olive-green-hoodie", label: "Olive Green Hoodie", color: "Olive Green", kind: "hoodie" },
  { handle: "black-hoodie", label: "Black Hoodie", color: "Black", kind: "hoodie" },
];

export const COUPLE_TROUSERS: CouplePieceOption[] = [
  { handle: "grey-trousers", label: "Grey Trousers", color: "Grey", kind: "trousers" },
  { handle: "black-trousers", label: "Black Trousers", color: "Black", kind: "trousers" },
];

registerImageVariants(coupleContrastHoodiesA, "couple/contrast/olive-black-grey");
registerImageVariants(coupleContrastHoodiesB, "couple/contrast/black-olive-seated");
registerImageVariants(coupleContrastTrousersFront, "couple/contrast/trousers-front");
registerImageVariants(coupleContrastTrousersSide, "couple/contrast/trousers-side");
registerImageVariants(coupleContrastTrousersBack, "couple/contrast/trousers-back");

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
  const compareAt = {
    amount: meta.compareAtPrice.toFixed(1),
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
      compareAtPriceRange: { minVariantPrice: compareAt },
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
 *
 * Uses per-handle bindings captured during a full Storefront merge — never a
 * shared "last remote" list that single-product fetches can corrupt.
 */
export function expandProductsForBothGenders(
  products: ShopifyProduct[],
): Array<{ product: ShopifyProduct; gender: ModelGender }> {
  const items: Array<{ product: ShopifyProduct; gender: ModelGender }> = [];
  for (const product of products) {
    const meta = LAUNCH_PRODUCTS.find((p) => p.handle === product.node.handle);
    const bound = launchGenderBindings.get(product.node.handle);
    const hasMen = Boolean(meta?.imagesMen.length);
    const hasWomen = Boolean(meta?.imagesWomen.length);
    if (meta && hasMen && hasWomen) {
      const menBound = bound?.men ?? product;
      const womenBound = bound?.women ?? product;
      items.push({ product: productCardForGender(menBound, "men"), gender: "men" });
      items.push({
        product: productCardForGender(womenBound, "women"),
        gender: "women",
      });
      continue;
    }
    if (hasWomen) {
      items.push({
        product: productCardForGender(bound?.women ?? product, "women"),
        gender: "women",
      });
      continue;
    }
    items.push({
      product: hasMen
        ? productCardForGender(bound?.men ?? product, "men")
        : product,
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
  const launchOrAlias = mappedShopifyHandles();
  for (const meta of LAUNCH_PRODUCTS) launchOrAlias.add(meta.handle);
  const hasLaunch = products.some((p) => launchOrAlias.has(p.node.handle));
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

function isWomenHandle(handleOrTitle: string) {
  return /female|women/i.test(handleOrTitle);
}

function isMenHandle(handleOrTitle: string) {
  // "female" contains "male" — always exclude women handles first.
  return !isWomenHandle(handleOrTitle) && /male|\bmen\b/i.test(handleOrTitle);
}

function colorMatches(hay: string, color: string) {
  const tokens = color
    .toLowerCase()
    .split(/[\s/-]+/)
    .filter(Boolean);
  return tokens.every((token) => hay.includes(token));
}

/** Resolve a Shopify remote product for a launch meta (exact handle, alias, or fuzzy). */
export function resolveRemoteLaunchProduct(
  meta: LaunchProductMeta,
  remote: ShopifyProduct[],
  gender?: ModelGender | string | null,
): ShopifyProduct | null {
  const byHandle = new Map(remote.map((p) => [p.node.handle, p]));
  for (const handle of shopifyHandleCandidates(meta, gender)) {
    const hit = byHandle.get(handle);
    if (hit) return hit;
  }

  const kind = meta.category === "hoodies" ? "hoodie" : "trouser";
  const ranked = remote
    .map((p, index) => {
      const hay =
        `${p.node.handle} ${p.node.title} ${p.node.productType ?? ""}`.toLowerCase();
      if (!colorMatches(hay, meta.color) || !hay.includes(kind)) return null;

      const women = isWomenHandle(hay);
      const men = isMenHandle(hay);
      let score = 1;
      if (gender === "women") {
        if (!women) return null; // never attach a male/black product to a women card via fuzzy
        score += 5;
      } else if (gender === "men") {
        if (!men) return null;
        score += 5;
      }
      return { p, score, index };
    })
    .filter(Boolean) as Array<{ p: ShopifyProduct; score: number; index: number }>;

  ranked.sort((a, b) => b.score - a.score || a.index - b.index);
  return ranked[0]?.p ?? null;
}

export function mappedShopifyHandles(): Set<string> {
  const handles = new Set<string>();
  for (const meta of LAUNCH_PRODUCTS) {
    for (const handle of shopifyHandleCandidates(meta)) handles.add(handle);
  }
  return handles;
}

/** Per launch-handle Men/Women Shopify bindings from the last *full* catalogue merge. */
type LaunchGenderBindings = { men: ShopifyProduct; women: ShopifyProduct };
const launchGenderBindings = new Map<string, LaunchGenderBindings>();

function isFullRemoteCatalog(remote: ShopifyProduct[]) {
  const claimed = mappedShopifyHandles();
  const hits = remote.filter((p) => claimed.has(p.node.handle)).length;
  // Require multiple launch aliases so a 1-product PDP fetch cannot poison bindings.
  return hits >= 2 || remote.length >= 6;
}

function refreshLaunchGenderBindings(remote: ShopifyProduct[]) {
  if (!isFullRemoteCatalog(remote)) return;
  for (const meta of LAUNCH_PRODUCTS) {
    launchGenderBindings.set(meta.handle, {
      men: bindLaunchProduct(meta, remote, "men"),
      women: bindLaunchProduct(meta, remote, "women"),
    });
  }
}

export function getLaunchGenderBinding(handle: string) {
  return launchGenderBindings.get(handle) ?? null;
}

/**
 * Bind one launch product to a live Shopify product (prices + variant GIDs).
 * Gender picks male vs female Admin products when the catalogue is split.
 */
export function bindLaunchProduct(
  meta: LaunchProductMeta,
  remote: ShopifyProduct[],
  gender?: ModelGender | string | null,
): ShopifyProduct {
  const remoteProduct = resolveRemoteLaunchProduct(meta, remote, gender);
  if (!remoteProduct) return toShopifyProduct(meta, gender);

  const sizesFromVariants = remoteProduct.node.variants.edges
    .map(
      (edge) =>
        edge.node.selectedOptions.find((o) => o.name.toLowerCase() === "size")
          ?.value,
    )
    .filter((value): value is string => Boolean(value));
  const checkoutSafeSizes = sortProductSizes(
    Array.from(
      new Set(sizesFromVariants.length ? sizesFromVariants : [...PRODUCT_SIZES]),
    ),
  );

  const options = (remoteProduct.node.options ?? []).map((option) => {
    if (option.name.toLowerCase() === "size") {
      return { ...option, values: checkoutSafeSizes };
    }
    if (
      option.name.toLowerCase() === "color" ||
      option.name.toLowerCase() === "colour"
    ) {
      return { ...option, values: [meta.color] };
    }
    return option;
  });

  if (!options.some((o) => o.name.toLowerCase() === "size")) {
    options.unshift({ name: "Size", values: checkoutSafeSizes });
  }

  const sortedVariants = sortVariantsBySize(remoteProduct.node.variants.edges);

  return applyLaunchImagery(
    {
      node: {
        ...remoteProduct.node,
        handle: meta.handle,
        title: meta.title,
        description: remoteProduct.node.description || meta.description,
        productType: meta.category === "hoodies" ? "Hoodies" : "Trousers",
        options,
        tags: Array.from(
          new Set([...(remoteProduct.node.tags ?? []), ...meta.tags]),
        ),
        variants: {
          edges: sortedVariants,
        },
      },
    },
    gender,
  );
}

/**
 * Merge Shopify Admin catalogue with launch overrides.
 * - Launch handles keep curated titles/tags/photography when present remotely.
 * - Maps renamed Admin handles (eyvora-male-…) onto stable website URLs.
 * - Prices always come from Shopify (Price + Compare-at). Edit them in Admin.
 * - Hardcoded `pricing.ts` values are only used when Storefront is offline.
 * - Extra active Shopify products are appended automatically (not launch aliases).
 */
export function mergeWithShopifyCatalog(
  remote: ShopifyProduct[],
  gender?: ModelGender | string | null,
): ShopifyProduct[] {
  // Only refresh Men/Women bindings from a full catalogue — never from a
  // 1-product PDP fetch (that previously made black prices appear on olive).
  refreshLaunchGenderBindings(remote);

  if (looksLikeDemoCatalog(remote)) {
    return getLaunchCatalog(gender);
  }

  const claimed = mappedShopifyHandles();
  const launch = LAUNCH_PRODUCTS.map((meta) => {
    const bound = launchGenderBindings.get(meta.handle);
    if (bound) {
      return gender === "women" ? bound.women : bound.men;
    }
    return bindLaunchProduct(meta, remote, gender ?? "men");
  });

  const extras = remote
    .filter((p) => !claimed.has(p.node.handle))
    .filter((p) => p.node.availableForSale !== false)
    .map((p) => {
      const imaged = applyLaunchImagery(p, gender);
      return {
        node: {
          ...imaged.node,
          options: (imaged.node.options ?? []).map((option) =>
            option.name.toLowerCase() === "size"
              ? { ...option, values: sortProductSizes(option.values) }
              : option,
          ),
          variants: {
            edges: sortVariantsBySize(imaged.node.variants.edges),
          },
        },
      };
    });

  return [...launch, ...extras];
}

export function findCatalogProduct(
  products: ShopifyProduct[],
  handle: string,
  gender?: ModelGender | string | null,
): ShopifyProduct | null {
  const bound = launchGenderBindings.get(handle);
  if (bound) {
    return gender === "women" ? bound.women : bound.men;
  }
  const found = products.find((p) => p.node.handle === handle);
  if (found) return applyLaunchImagery(found, gender);
  return getLaunchProductByHandle(handle, gender);
}
