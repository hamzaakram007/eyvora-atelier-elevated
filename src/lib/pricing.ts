/**
 * Offline / Storefront-unavailable fallback prices only.
 *
 * Live storefront prices come from Shopify Admin:
 *   Price        = what the customer pays (sale)
 *   Compare-at   = original list price (shown struck through)
 *
 * Changing Admin prices updates eyvora.pk after a refresh (no code deploy).
 */
export const PRODUCT_SALE_PERCENT = 20;

export function salePriceFromList(listPrice: number, percent = PRODUCT_SALE_PERCENT) {
  return Math.round(listPrice * (1 - percent / 100));
}

/** @deprecated Prefer Shopify Admin prices. Kept for offline catalogue fallback. */
export const HOODIE_LIST_PRICE = 4499;
/** @deprecated Prefer Shopify Admin prices. Kept for offline catalogue fallback. */
export const HOODIE_SALE_PRICE = salePriceFromList(HOODIE_LIST_PRICE); // 3599

/** @deprecated Prefer Shopify Admin prices. Kept for offline catalogue fallback. */
export const TROUSER_LIST_PRICE = 2999;
/** @deprecated Prefer Shopify Admin prices. Kept for offline catalogue fallback. */
export const TROUSER_SALE_PRICE = salePriceFromList(TROUSER_LIST_PRICE); // 2399
