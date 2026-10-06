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
  title: string;
  color: string;
  category: "hoodies" | "trousers";
  /** Sale price customers pay (after PRODUCT_SALE_PERCENT off). */
  price: number;
  /** Pre-discount list / compare-at price shown struck through. */
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

    // Prefer sizes from variants — Storefront option.values can lag after Admin adds XL.
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

    const launchPrice = {
      amount: meta.price.toFixed(1),
      currencyCode: remoteProduct.node.priceRange.minVariantPrice.currencyCode || "PKR",
    };
    const launchCompareAt = {
      amount: meta.compareAtPrice.toFixed(1),
      currencyCode: launchPrice.currencyCode,
    };

    const sortedVariants = sortVariantsBySize(
      remoteProduct.node.variants.edges.map((edge) => ({
        node: {
          ...edge.node,
          price: launchPrice,
        },
      })),
    );

    return applyLaunchImagery(
      {
        node: {
          ...remoteProduct.node,
          title: meta.title,
          description: remoteProduct.node.description || meta.description,
          productType: meta.category === "hoodies" ? "Hoodies" : "Trousers",
          priceRange: { minVariantPrice: launchPrice },
          compareAtPriceRange: { minVariantPrice: launchCompareAt },
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
  });

  const extras = remote
    .filter((p) => !launchHandles.has(p.node.handle))
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
  const found = products.find((p) => p.node.handle === handle);
  if (found) return applyLaunchImagery(found, gender);
  return getLaunchProductByHandle(handle, gender);
}
