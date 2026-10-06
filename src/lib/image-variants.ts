/**
 * Responsive card/thumb/gallery URLs for local launch imagery.
 * Files live in /public/img/products (stable paths, zero JS asset graph bloat).
 * Catalog registers each full Vite URL → public variant via `registerImageVariants`.
 *
 * Width descriptors come from `image-variant-widths.json` (generated) so srcset
 * never overstates pixel width — that previously made browsers pick soft files.
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
  const parts: string[] = [];
  if (w.card) parts.push(`${card} ${w.card}w`);
  if (w.gallery && w.gallery !== w.card) parts.push(`${gallery} ${w.gallery}w`);
  else if (!w.gallery && w.card) {
    /* gallery missing — card only */
  } else if (w.gallery) {
    parts.push(`${gallery} ${w.gallery}w`);
  }
  return parts.length ? parts.join(", ") : undefined;
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
  if (!card || card === fullUrl) return undefined;

  const parts: string[] = [];
  const cardW = w.card || 1000;
  parts.push(`${card} ${cardW}w`);
  if (gallery && gallery !== card) {
    const galleryW = w.gallery || Math.max(cardW, 1200);
    parts.push(`${gallery} ${galleryW}w`);
  }
  if (fullUrl !== card && fullUrl !== gallery) {
    const fullW = w.full || Math.max(w.gallery || 0, cardW, 1600);
    // Only advertise the master when it is actually wider than gallery.
    if (!w.gallery || (w.full && w.full > (w.gallery || 0) + 20)) {
      parts.push(`${fullUrl} ${fullW}w`);
    }
  }
  return parts.join(", ");
}

/** Product-page hero srcset — prefer gallery, fall back to full. */
export function gallerySrcSet(fullUrl: string | undefined | null) {
  if (!fullUrl) return undefined;
  const base = baseByFull.get(fullUrl);
  const w = widthsFor(base);
  const card = cardImageUrl(fullUrl);
  const gallery = galleryImageUrl(fullUrl);

  if (!gallery || gallery === fullUrl) {
    return card && card !== fullUrl
      ? `${card} ${w.card || 1000}w, ${fullUrl} ${w.full || 1600}w`
      : undefined;
  }

  const parts: string[] = [];
  if (card && card !== gallery) parts.push(`${card} ${w.card || 1000}w`);
  parts.push(`${gallery} ${w.gallery || 1600}w`);
  if (fullUrl !== gallery && w.full && w.full > (w.gallery || 0) + 20) {
    parts.push(`${fullUrl} ${w.full}w`);
  }
  return parts.join(", ");
}
