/**
 * Responsive card/thumb/gallery URLs for local launch imagery.
 * Files live in /public/img/products (stable paths, zero JS asset graph bloat).
 * Catalog registers each full Vite URL → public variant via `registerImageVariants`.
 *
 * Width descriptors come from `image-variant-widths.json` (generated) so srcset
 * never overstates pixel width — that previously made browsers pick soft files.
 *
 * When card and gallery share the same pixel width (common for ~941px masters),
 * only the higher-quality gallery encode is advertised so browsers don't settle
 * on the slightly softer card file.
 */

import variantWidths from "@/lib/image-variant-widths.json";

const cardByFull = new Map<string, string>();
const thumbByFull = new Map<string, string>();
const galleryByFull = new Map<string, string>();
const baseByFull = new Map<string, string>();

type WidthEntry = { full?: number; card?: number; gallery?: number; thumb?: number };

function widthsFor(base: string | undefined): WidthEntry {
  if (!base) return {};
  return (variantWidths as Record<string, WidthEntry>)[base] ?? {};
}

/** Gallery is meaningfully sharper/wider than card (worth a second srcset candidate). */
function galleryAddsResolution(cardW: number, galleryW: number) {
  return galleryW > cardW + 40;
}

/** Call from catalog when wiring a local product photo. */
export function registerImageVariants(fullUrl: string, publicBase: string) {
  // publicBase like "olive-hoodie/primary"
  cardByFull.set(fullUrl, `/img/products/${publicBase}.card.webp`);
  thumbByFull.set(fullUrl, `/img/products/${publicBase}.thumb.webp`);
  galleryByFull.set(fullUrl, `/img/products/${publicBase}.gallery.webp`);
  baseByFull.set(fullUrl, publicBase);
}

/** Stable public URLs for non-catalog imagery (hero / category / couple). */
export function publicVariantBase(publicBase: string) {
  return {
    full: `/img/products/${publicBase}.gallery.webp`,
    card: `/img/products/${publicBase}.card.webp`,
    gallery: `/img/products/${publicBase}.gallery.webp`,
    thumb: `/img/products/${publicBase}.thumb.webp`,
    srcSet: publicSrcSet(publicBase),
  };
}

function publicSrcSet(publicBase: string) {
  const w = widthsFor(publicBase);
  const card = `/img/products/${publicBase}.card.webp`;
  const gallery = `/img/products/${publicBase}.gallery.webp`;
  const cardW = w.card || 0;
  const galleryW = w.gallery || 0;

  // Prefer the higher-quality gallery encode. Only add card when it is a
  // smaller bandwidth rung with a real width difference.
  if (galleryW && cardW && galleryAddsResolution(cardW, galleryW)) {
    return `${card} ${cardW}w, ${gallery} ${galleryW}w`;
  }
  if (galleryW) return `${gallery} ${galleryW}w`;
  if (cardW) return `${card} ${cardW}w`;
  return undefined;
}

export function cardImageUrl(fullUrl: string | undefined | null) {
  if (!fullUrl) return "";
  return cardByFull.get(fullUrl) ?? fullUrl;
}

export function thumbImageUrl(fullUrl: string | undefined | null) {
  if (!fullUrl) return "";
  return thumbByFull.get(fullUrl) ?? fullUrl;
}

export function galleryImageUrl(fullUrl: string | undefined | null) {
  if (!fullUrl) return "";
  return galleryByFull.get(fullUrl) ?? cardByFull.get(fullUrl) ?? fullUrl;
}

/**
 * Responsive srcset for product cards / grids.
 * Prefer accurate widths so retina phones pull gallery/full instead of soft cards.
 */
export function productSrcSet(fullUrl: string | undefined | null) {
  if (!fullUrl) return undefined;
  const base = baseByFull.get(fullUrl);
  const w = widthsFor(base);
  const card = cardImageUrl(fullUrl);
  const gallery = galleryImageUrl(fullUrl);
  if ((!card || card === fullUrl) && (!gallery || gallery === fullUrl)) {
    return undefined;
  }

  const cardW = w.card || 0;
  const galleryW = w.gallery || 0;
  const parts: string[] = [];

  if (gallery && galleryW && card && cardW && galleryAddsResolution(cardW, galleryW)) {
    parts.push(`${card} ${cardW}w`);
    parts.push(`${gallery} ${galleryW}w`);
  } else if (gallery && galleryW) {
    parts.push(`${gallery} ${galleryW}w`);
  } else if (card && cardW) {
    parts.push(`${card} ${cardW}w`);
  } else if (gallery && gallery !== fullUrl) {
    parts.push(`${gallery} ${galleryW || 1200}w`);
  } else if (card && card !== fullUrl) {
    parts.push(`${card} ${cardW || 1000}w`);
  }

  if (fullUrl !== card && fullUrl !== gallery) {
    const fullW = w.full || 0;
    if (fullW && fullW > Math.max(galleryW, cardW) + 20) {
      parts.push(`${fullUrl} ${fullW}w`);
    }
  }
  return parts.length ? parts.join(", ") : undefined;
}

/** Product-page hero srcset — gallery first; card only as a smaller rung. */
export function gallerySrcSet(fullUrl: string | undefined | null) {
  if (!fullUrl) return undefined;
  const base = baseByFull.get(fullUrl);
  const w = widthsFor(base);
  const card = cardImageUrl(fullUrl);
  const gallery = galleryImageUrl(fullUrl);
  const cardW = w.card || 0;
  const galleryW = w.gallery || 0;

  if (!gallery || gallery === fullUrl) {
    return card && card !== fullUrl
      ? `${card} ${cardW || 1000}w, ${fullUrl} ${w.full || 1600}w`
      : undefined;
  }

  const parts: string[] = [];
  if (card && card !== gallery && cardW && galleryAddsResolution(cardW, galleryW || cardW)) {
    parts.push(`${card} ${cardW}w`);
  }
  parts.push(`${gallery} ${galleryW || 1600}w`);
  if (fullUrl !== gallery && w.full && w.full > (galleryW || 0) + 20) {
    parts.push(`${fullUrl} ${w.full}w`);
  }
  return parts.join(", ");
}
