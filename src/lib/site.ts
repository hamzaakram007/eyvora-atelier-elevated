export const WHATSAPP_NUMBER = "923001234567";
export const WHATSAPP_MESSAGE =
  "Hello EYVORA,\nI'm interested in your collection.";

export const whatsappLink = () =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const announcements = [
  "Free delivery nationwide",
  "Premium quality guaranteed",
  "Winter 26 — now in stores",
  "Easy 7-day exchange",
  "International shipping available",
];

export const occasions = [
  { title: "Work", note: "Considered layers for long days" },
  { title: "Casual", note: "Weightless ease, every hour" },
  { title: "Travel", note: "Crease-resistant, cabin-ready" },
  { title: "Gym", note: "Breathable structure in motion" },
  { title: "Airport", note: "Quiet comfort, sharp silhouette" },
  { title: "Weekend", note: "Slow mornings, softer cotton" },
  { title: "Date Night", note: "Matte black, tailored intent" },
];

export const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders placed before 4pm PKT are dispatched the same working day. Karachi, Lahore and Islamabad receive within 1–2 working days; the rest of Pakistan within 3–5.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We ship to the GCC, UK, EU, US, Canada and Australia via tracked express courier. Duties are calculated at checkout where applicable.",
  },
  {
    q: "What is your exchange policy?",
    a: "Any unworn piece with tags attached can be exchanged within 7 days of delivery. Sizing exchanges within Pakistan are collected and redelivered at our cost.",
  },
  {
    q: "How do returns and refunds work?",
    a: "Return requests are accepted within 7 days. Once the piece is received and inspected, refunds are issued to the original payment method within 5 working days.",
  },
  {
    q: "How does EYVORA sizing fit?",
    a: "Hoodies are cut with a relaxed, dropped shoulder — take your usual size for the intended fit, or size down for a closer line. Trousers sit at the natural waist with a straight leg.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Cash on delivery, all major debit and credit cards, and direct bank transfer. Card payments are processed on Shopify's secure checkout.",
  },
  {
    q: "How should I care for the fabric?",
    a: "Cold machine wash inside out with like colours. Do not bleach. Dry flat in shade. Warm iron on the reverse. Loop-back cotton softens with every wash — it is designed to.",
  },
  {
    q: "Where is EYVORA made?",
    a: "Every piece is cut and finished in Pakistan by a small atelier we work with directly, using long-staple cotton spun and knitted locally.",
  },
];

export const navLinks = [
  { label: "Home", to: "/" as const },
  { label: "Men", to: "/shop" as const, search: { gender: "men" } },
  { label: "Women", to: "/shop" as const, search: { gender: "women" } },
  { label: "Hoodies", to: "/shop" as const, search: { category: "hoodies" } },
  { label: "Trousers", to: "/shop" as const, search: { category: "trousers" } },
  { label: "Couple", to: "/shop" as const, search: { collection: "couple" } },
  { label: "About", to: "/about" as const },
  { label: "Visit Us", to: "/visit" as const },
  { label: "Contact", to: "/contact" as const },
];
