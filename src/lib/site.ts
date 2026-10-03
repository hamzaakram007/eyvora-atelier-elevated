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

/** Set VITE_WHATSAPP_NUMBER (digits only, country code included) when provided by the client. */
export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(
    /\D/g,
    "",
  ) || "";

export const WHATSAPP_MESSAGE =
  (import.meta.env.VITE_WHATSAPP_MESSAGE as string | undefined) ||
  "Hello EYVORA, I need help with your products.";

export const whatsappConfigured = () => WHATSAPP_NUMBER.length >= 10;

export const whatsappLink = (message = WHATSAPP_MESSAGE) => {
  if (!whatsappConfigured()) return "";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const announcements = [
  {
    text: "Discover the EYVORA Essentials Collection.",
    href: "/shop",
  },
];

export const faqs = [
  {
    q: "How do EYVORA sizes fit?",
    a: "Hoodies and trousers are offered in S, M and L. Use the size guide on each product page. If measurements are not yet published, they will appear as “coming soon” rather than estimated figures.",
  },
  {
    q: "Where do you deliver?",
    a: "EYVORA currently focuses on Pakistan. Delivery timelines and rates are confirmed at Shopify checkout once shipping is configured by the merchant.",
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
    a: "Available payment methods are shown at Shopify checkout and depend on what the merchant has enabled (for example Cash on Delivery, bank transfer, or a local gateway).",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Cash on Delivery appears at checkout only when it has been enabled in the Shopify admin for your region.",
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
    a: "Use the Contact page or the WhatsApp button when a number has been configured in the store settings.",
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
    note: "Priced in PKR and prepared for local checkout configuration.",
  },
];

export const navLinks = [
  { label: "Home", to: "/" as const },
  { label: "Collections", to: "/shop" as const, search: {} },
  { label: "Men", to: "/shop" as const, search: { gender: "men" } },
  { label: "Women", to: "/shop" as const, search: { gender: "women" } },
  { label: "About Us", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
  { label: "Visit Us", to: "/visit" as const },
];

export const sizeGuideColumns = [
  "Size",
  "Chest",
  "Length",
  "Waist",
  "Hip",
  "Inseam",
] as const;

/** Measurements stay empty until the client provides verified values. */
export const sizeGuideRows: Array<Record<(typeof sizeGuideColumns)[number], string>> = [];
