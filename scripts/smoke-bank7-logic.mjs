/**
 * Pure-logic checks for bank7 double-discount guards (no network).
 */
import assert from "node:assert/strict";

// Mirror the critical pure helpers (keep in sync with src/lib/bank7-order-sync.ts)
const DISCOUNT_CODE = "BANK7";
const TAG_APPLIED = "bank7-synced";
const TAG_STOREFRONT = "eyvora-storefront-checkout";

function paymentHaystack(order) {
  return [order.gateway || "", ...(order.payment_gateway_names || [])]
    .join(" ")
    .toLowerCase();
}
function tagsOf(order) {
  return (order.tags || "").toLowerCase();
}
function isBankDeposit(order) {
  const hay = paymentHaystack(order);
  if (/cash\s*on\s*delivery|\bcod\b|payment_on_delivery|paymentondelivery/.test(hay)) {
    return false;
  }
  const tags = tagsOf(order);
  if (tags.includes("payment-bank")) return true;
  if (tags.includes("payment-cod")) return false;
  for (const attr of order.note_attributes || []) {
    if ((attr.name || "").toLowerCase() === "payment_method") {
      const v = (attr.value || "").toLowerCase();
      if (v === "bank") return true;
      if (v === "cod") return false;
    }
  }
  return /bank\s*deposit|bank\s*transfer|money\s*order|wire|\bubl\b/.test(hay);
}
function isStorefrontCheckoutOrder(order) {
  return tagsOf(order).includes(TAG_STOREFRONT);
}
function hasBankDiscount(order) {
  const codes = (order.discount_codes || []).map((d) => (d.code || "").toUpperCase());
  if (codes.includes(DISCOUNT_CODE)) return true;
  const tags = tagsOf(order);
  return (
    tags.includes(TAG_APPLIED) ||
    tags.includes("bank-transfer-7-off") ||
    tags.includes("bank7")
  );
}

// Order #1010-shaped payload: payment-pending draft often reports gateway "manual"
const storefrontBank = {
  name: "#1010",
  tags: "eyvora-storefront-checkout, payment-bank, bank7-synced, bank-transfer-7-off",
  payment_gateway_names: ["manual"],
  discount_codes: [],
};
assert.equal(isStorefrontCheckoutOrder(storefrontBank), true, "skip storefront");
assert.equal(isBankDeposit(storefrontBank), true, "payment-bank tag");
assert.equal(hasBankDiscount(storefrontBank), true, "already discounted");

// Bare "manual" must NOT count as bank (this caused the double 7%)
assert.equal(
  isBankDeposit({ payment_gateway_names: ["manual"], tags: "" }),
  false,
  "manual alone is not bank",
);

// Real Shopify Bank Deposit still works
assert.equal(
  isBankDeposit({ payment_gateway_names: ["Bank Deposit"], tags: "" }),
  true,
  "Bank Deposit gateway",
);

// COD storefront with manual gateway must stay COD
assert.equal(
  isBankDeposit({
    payment_gateway_names: ["manual"],
    tags: "eyvora-storefront-checkout, payment-cod",
  }),
  false,
  "payment-cod wins over manual",
);

// Math of the bug
const once = 3599 * 0.93;
const twice = 3599 * 0.93 * 0.93;
assert.ok(Math.abs(once - 3347.07) < 0.01, "single 7%");
assert.ok(Math.abs(twice - 3112.78) < 0.01, "double 7% matches #1010");

console.log("smoke-bank7-logic: all assertions passed");
console.log(`  expected bank total (hoodie+ship): ${(3347.07 + 249).toFixed(2)}`);
console.log(`  buggy double-discount total:       ${(3112.78 + 249).toFixed(2)} (#1010)`);
