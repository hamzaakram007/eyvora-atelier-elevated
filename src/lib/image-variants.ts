/**
 * Smaller card/thumb URLs for local launch imagery.
 * Files live in /public/img/products (stable paths, zero JS asset graph bloat).
 * Catalog registers each full Vite URL → public variant via `registerImageVariants`.
 */

const cardByFull = new Map<string, string>();
const thumbByFull = new Map<string, string>();

/** Call from catalog when wiring a local product photo. */
export function registerImageVariants(fullUrl: string, publicBase: string) {
  // publicBase like "olive-hoodie/primary"
  cardByFull.set(fullUrl, `/img/products/${publicBase}.card.webp`);
  thumbByFull.set(fullUrl, `/img/products/${publicBase}.thumb.webp`);
}

export function cardImageUrl(fullUrl: string | undefined | null) {
  if (!fullUrl) return "";
  return cardByFull.get(fullUrl) ?? fullUrl;
}

export function thumbImageUrl(fullUrl: string | undefined | null) {
  if (!fullUrl) return "";
  return thumbByFull.get(fullUrl) ?? fullUrl;
}

/** Prefer card for ~viewport cards; keep full as 2x fallback. */
export function productSrcSet(fullUrl: string | undefined | null) {
  if (!fullUrl) return undefined;
  const card = cardImageUrl(fullUrl);
  if (!card || card === fullUrl) return undefined;
  return `${card} 420w, ${fullUrl} 840w`;
}
