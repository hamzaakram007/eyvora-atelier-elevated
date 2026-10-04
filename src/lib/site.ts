/**
 * Merchant-configurable storefront copy and contact settings.
 * Keep claims factual. Prefer placeholders over invented business data.
 */

export const BRAND = {
  name: "EYVORA",
  tagline: "Everyday essentials. Elevated.",
  description:
    "Thoughtfully designed hoodies and trousers for modern everyday wear.",
  currency: "PKR",
  market: "Pakistan",
} as const;

/** Digits only with country code (Pakistan: 92…). Env overrides the default. */
export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(
    /\D/g,
    "",
  ) || "923161609389";

export const WHATSAPP_MESSAGE =
  (import.meta.env.VITE_WHATSAPP_MESSAGE as string | undefined) ||
  "Hello EYVORA, I need help with your products.";

/** Official support inbox — env overrides the default. */
export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() ||
  "eyvorapk@gmail.com";

/** Display-friendly WhatsApp number for Pakistan. */
export const WHATSAPP_DISPLAY = "0316 1609389";

/**
 * Normalize Pakistan mobile numbers to E.164 (+92##########).
 * Accepts 03XXXXXXXXX, 3XXXXXXXXX, 923XXXXXXXXX, +92…
 */
export function normalizePakistanPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let national = digits;
  if (national.startsWith("92") && national.length >= 12) {
    national = national.slice(2);
  }
  if (national.startsWith("0") && national.length >= 11) {
    national = national.slice(1);
  }
  if (national.length === 10 && national.startsWith("3")) {
    return `+92${national}`;
  }
  return null;
}

export const whatsappConfigured = () => WHATSAPP_NUMBER.length >= 10;

export const whatsappLink = (message = WHATSAPP_MESSAGE) => {
  if (!whatsappConfigured()) return "";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const emailLink = (subject: string, body: string) => {
  if (!CONTACT_EMAIL) return "";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/** Prefer WhatsApp; fall back to email so orders work before Shopify plan / Storefront unlock. */
export const orderLink = (message: string) => {
  if (whatsappConfigured()) return whatsappLink(message);
  return emailLink("EYVORA order request", message);
};

export const orderChannelLabel = () =>
  whatsappConfigured() ? "WhatsApp" : CONTACT_EMAIL ? "Email" : null;

/**
 * Set true only while Shopify Online Store password / trial blocks Storefront API.
 * Password is off and plan is active — native checkout is enabled.
 */
export const SHOPIFY_CHECKOUT_LOCKED = false;

/** Manual bank transfer details shown on Payments page + checkout guidance. */
export const BANK_TRANSFER = {
  bankName: "United Bank Limited (UBL)",
  accountNumber: "321342838",
  accountTitle: "Muhammad Hamza",
  iban: "PK02UNIL0109000321342838",
} as const;

/** Free Pakistan shipping — keep Shopify shipping rates at PKR 0 to match. */
export const FREE_SHIPPING = true;

/** Listed prices include no tax / GST — products are sold tax-free. */
export const TAX_FREE = true;

/** Bank transfer incentive (apply code at Shopify checkout). */
export const BANK_TRANSFER_DISCOUNT_PERCENT = 7;
export const BANK_TRANSFER_DISCOUNT_CODE = "BANK7";

/** Payment methods EYVORA offers (enable matching methods in Shopify Admin too). */
export const PAYMENT_METHODS = [
  {
    id: "cod",
    title: "Cash on Delivery (COD)",
    summary: "Pay in cash when your order is delivered in Pakistan. Shipping is free.",
    details:
      "Select Cash on Delivery at Shopify checkout. Keep the exact amount ready for the courier. Prices are tax-free.",
  },
  {
    id: "bank",
    title: "Bank transfer — 7% off",
    summary: `Pay by UBL bank transfer and get ${BANK_TRANSFER_DISCOUNT_PERCENT}% off automatically — no discount code needed.`,
    details: `In your bag, choose Bank transfer and continue to checkout — the ${BANK_TRANSFER_DISCOUNT_PERCENT}% discount is applied for you. At Shopify checkout select Bank deposit / manual payment, transfer the discounted total to UBL, then email or WhatsApp your order number and payment screenshot so we can confirm and dispatch.`,
  },
] as const;

/**
 * Other gateways suitable for Pakistan once you’re ready to connect cards / wallets.
 * Shopify Payments is not available in PK — use apps or local processors instead.
 */
export const RECOMMENDED_PAYMENT_OPTIONS = [
  {
    title: "JazzCash / Easypaisa",
    note: "Popular mobile wallets in Pakistan. Usually connected via a Shopify payment app (for example PayFast or a JazzCash/Easypaisa connector).",
  },
  {
    title: "PayFast (Pakistan)",
    note: "Local payment gateway supporting cards, JazzCash, Easypaisa and bank options through a Shopify app.",
  },
  {
    title: "Debit / credit cards",
    note: "Via a Pakistan-ready gateway app (PayFast or similar). Shopify Payments is not offered for PK stores.",
  },
  {
    title: "Raast / IBFT bank apps",
    note: "Customers can already pay with any bank app using the UBL IBAN above; you confirm manually from your banking app.",
  },
] as const;

export const announcements = [
  {
    text: `Free shipping · Tax-free prices · ${BANK_TRANSFER_DISCOUNT_PERCENT}% off when you choose bank transfer`,
    href: "/payments",
  },
];

export const faqs = [
  {
    q: "How do EYVORA sizes fit?",
    a: "Hoodies and trousers are offered in S, M, L and XL. Hoodies come in Olive Green and Black; trousers in Grey and Black. Full measurements are in the size guide on each product page (hoodies: chest, length, shoulder, sleeves; trousers: waist, length, thigh, bottom).",
  },
  {
    q: "Where do you deliver?",
    a: "EYVORA delivers across Pakistan with free shipping on every order.",
  },
  {
    q: "Is shipping really free?",
    a: "Yes. EYVORA offers free shipping on all Pakistan orders — no minimum spend.",
  },
  {
    q: "Are prices tax-free?",
    a: "Yes. Product prices are tax-free. What you see on the product page is what you pay for the garment (plus any COD courier handling if applicable).",
  },
  {
    q: "What is your exchange policy?",
    a: "Exchange terms are published in the store policies. Until final policy copy is confirmed, please contact EYVORA for assistance with sizing exchanges.",
  },
  {
    q: "How do returns and refunds work?",
    a: "Returns and refunds follow the merchant’s published refund policy in Shopify. Contact support if you need help with an order.",
  },
  {
    q: "Which payment methods are available?",
    a: `EYVORA accepts Cash on Delivery and bank transfer to United Bank Limited (UBL). Choose bank transfer in your bag and ${BANK_TRANSFER_DISCOUNT_PERCENT}% off is applied automatically. Full account details are on the Payments page.`,
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes. Choose Cash on Delivery in your bag / at checkout and pay the courier in cash when your order arrives. Shipping stays free.",
  },
  {
    q: "How do I get 7% off with bank transfer?",
    a: `Open your bag, select Bank transfer, then continue to checkout — the ${BANK_TRANSFER_DISCOUNT_PERCENT}% discount is applied automatically (no code to type). If you chose COD in the bag first, switch to Bank deposit on Shopify checkout and the ${BANK_TRANSFER_DISCOUNT_PERCENT}% off still applies. Transfer to UBL account ${BANK_TRANSFER.accountNumber} (Title: ${BANK_TRANSFER.accountTitle}, IBAN: ${BANK_TRANSFER.iban}), and send your order number plus payment screenshot to EYVORA.`,
  },
  {
    q: "How do I pay by bank transfer?",
    a: `Choose Bank transfer in your bag so the ${BANK_TRANSFER_DISCOUNT_PERCENT}% off is applied, complete checkout with Bank deposit, then transfer to UBL account ${BANK_TRANSFER.accountNumber} (Title: ${BANK_TRANSFER.accountTitle}, IBAN: ${BANK_TRANSFER.iban}). Send your order number and payment screenshot to EYVORA so we can confirm the order.`,
  },
  {
    q: "How can I track my order?",
    a: "Tracking details are shared after dispatch according to the fulfilment method selected at checkout. You can also message EYVORA with your order number for help.",
  },
  {
    q: "How should I care for my pieces?",
    a: "Care guidance will be listed on each product page once confirmed. Until then, follow the care label on the garment.",
  },
  {
    q: "How do I contact EYVORA?",
    a: "WhatsApp 03161609389 or email eyvorapk@gmail.com — also linked from the Contact and Payments pages.",
  },
];

export const whyPoints = [
  {
    title: "Thoughtful Design",
    note: "Clean silhouettes and considered details — designed to feel intentional, not loud.",
  },
  {
    title: "Everyday Comfort",
    note: "Pieces made for long days, soft movement, and repeated wear.",
  },
  {
    title: "Modern Silhouettes",
    note: "Relaxed proportions that stay refined on and off duty.",
  },
  {
    title: "Coordinated Dressing",
    note: "Hoodies and trousers that work alone or as quiet couple pairings.",
  },
  {
    title: "Quality Focus",
    note: "Attention on fit, finish and photography — without unverified fabric claims.",
  },
  {
    title: "Pakistan-Ready",
    note: "Free shipping, tax-free PKR pricing, COD and bank transfer with 7% off.",
  },
];

export const navLinks = [
  { label: "Home", to: "/" as const },
  { label: "Shop All", to: "/shop" as const, search: {} },
  { label: "Hoodies", to: "/shop" as const, search: { category: "hoodies" } },
  { label: "Trousers", to: "/shop" as const, search: { category: "trousers" } },
  { label: "Couple", to: "/couple" as const },
  { label: "About Us", to: "/about" as const },
  { label: "Payments", to: "/payments" as const },
  { label: "Contact", to: "/contact" as const },
  { label: "Visit Us", to: "/visit" as const },
];

export type SizeGuideKind = "hoodies" | "trousers";

export const trousersSizeGuideColumns = [
  "Size",
  "Waist",
  "Length",
  "Thigh",
  "Bottom",
] as const;

/** Verified trouser measurements (inches) provided by EYVORA. */
export const trousersSizeGuideRows: Array<
  Record<(typeof trousersSizeGuideColumns)[number], string>
> = [
  { Size: "S", Waist: "30-32", Length: "41.5", Thigh: "13", Bottom: "10" },
  { Size: "M", Waist: "32-34", Length: "42", Thigh: "13.5", Bottom: "10" },
  { Size: "L", Waist: "34-36", Length: "42.5", Thigh: "14", Bottom: "10.5" },
  { Size: "XL", Waist: "36-38", Length: "43", Thigh: "14", Bottom: "10.5" },
];

export const hoodiesSizeGuideColumns = [
  "Size",
  "Chest",
  "Length",
  "Shoulder",
  "Sleeves",
] as const;

/** Verified hoodie measurements (inches) provided by EYVORA. */
export const hoodiesSizeGuideRows: Array<
  Record<(typeof hoodiesSizeGuideColumns)[number], string>
> = [
  { Size: "S", Chest: "25.5", Length: "26", Shoulder: "9", Sleeves: "20" },
  { Size: "M", Chest: "25.5", Length: "26.5", Shoulder: "9", Sleeves: "20.5" },
  { Size: "L", Chest: "26", Length: "27.5", Shoulder: "9.5", Sleeves: "21.5" },
  { Size: "XL", Chest: "26.5", Length: "28.5", Shoulder: "9.5", Sleeves: "22" },
];

/** @deprecated Use trousers/hoodies size guides. Kept for older imports. */
export const sizeGuideColumns = trousersSizeGuideColumns;
/** @deprecated Use trousers/hoodies size guides. Kept for older imports. */
export const sizeGuideRows = trousersSizeGuideRows;
