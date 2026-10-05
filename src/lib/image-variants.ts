/**
 * Responsive card/thumb/gallery URLs for local launch imagery.
 * Files live in /public/img/products (stable paths, zero JS asset graph bloat).
 * Catalog registers each full Vite URL → public variant via `registerImageVariants`.
 */

const cardByFull = new Map<string, string>();
const thumbByFull = new Map<string, string>();
const galleryByFull = new Map<string, string>();

/** Call from catalog when wiring a local product photo. */
export function registerImageVariants(fullUrl: string, publicBase: string) {
  // publicBase like "olive-hoodie/primary"
  cardByFull.set(fullUrl, `/img/products/${publicBase}.card.webp`);
  thumbByFull.set(fullUrl, `/img/products/${publicBase}.thumb.webp`);
  galleryByFull.set(fullUrl, `/img/products/${publicBase}.gallery.webp`);
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
 * 800w card covers retina phone + desktop tiles without pulling the full master.
 */
export function productSrcSet(fullUrl: string | undefined | null) {
  if (!fullUrl) return undefined;
  const card = cardImageUrl(fullUrl);
  const gallery = galleryImageUrl(fullUrl);
  if (!card || card === fullUrl) return undefined;
  const parts = [`${card} 800w`];
  if (gallery && gallery !== card) parts.push(`${gallery} 1200w`);
  if (fullUrl !== card && fullUrl !== gallery) parts.push(`${fullUrl} 1600w`);
  return parts.join(", ");
}

/** Product-page hero srcset — prefer gallery, fall back to full. */
export function gallerySrcSet(fullUrl: string | undefined | null) {
  if (!fullUrl) return undefined;
  const card = cardImageUrl(fullUrl);
  const gallery = galleryImageUrl(fullUrl);
  if (!gallery || gallery === fullUrl) {
    return card && card !== fullUrl ? `${card} 800w, ${fullUrl} 1600w` : undefined;
  }
  const parts = [] as string[];
  if (card && card !== gallery) parts.push(`${card} 800w`);
  parts.push(`${gallery} 1200w`);
  if (fullUrl !== gallery) parts.push(`${fullUrl} 1600w`);
  return parts.join(", ");
}
