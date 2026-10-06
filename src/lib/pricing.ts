/**
 * Launch catalogue pricing — list (compare-at) + automatic sale %.
 * Sale prices are what customers pay; compare-at is shown struck through.
 */
export const PRODUCT_SALE_PERCENT = 20;

export function salePriceFromList(listPrice: number, percent = PRODUCT_SALE_PERCENT) {
  return Math.round(listPrice * (1 - percent / 100));
}

export const HOODIE_LIST_PRICE = 4499;
export const HOODIE_SALE_PRICE = salePriceFromList(HOODIE_LIST_PRICE); // 3599

export const TROUSER_LIST_PRICE = 2999;
export const TROUSER_SALE_PRICE = salePriceFromList(TROUSER_LIST_PRICE); // 2399
