import { Link } from "@tanstack/react-router";
import { Instagram, Facebook } from "lucide-react";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  whatsappConfigured,
  whatsappLink,
} from "@/lib/site";

const columns = [
  {
    heading: "Shop",
    links: [
      { label: "Hoodies", to: "/shop", search: { category: "hoodies" } },
      { label: "Trousers", to: "/shop", search: { category: "trousers" } },
      { label: "Couple Collection", to: "/couple", search: undefined },
      { label: "All Products", to: "/shop", search: {} },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/about", search: undefined },
      { label: "Contact", to: "/contact", search: undefined },
      { label: "Visit Us", to: "/visit", search: undefined },
    ],
  },
  {
    heading: "Customer Care",
    links: [
      { label: "FAQ", to: "/", hash: "faq" },
      { label: "Payments", to: "/payments", search: undefined },
      { label: "Shipping", to: "/contact", search: undefined },
      { label: "Returns", to: "/contact", search: undefined },
      { label: "Exchange", to: "/contact", search: undefined },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Privacy", to: "/contact", search: undefined },
      { label: "Terms", to: "/contact", search: undefined },
      { label: "Refund", to: "/contact", search: undefined },
      { label: "Shipping Policy", to: "/contact", search: undefined },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-[var(--ink)] text-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-10 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-md">
            <p className="font-display text-3xl font-semibold tracking-[0.24em]">EYVORA</p>
            <p className="mt-6 text-sm leading-relaxed text-[var(--ivory)]/60">
              Premium hoodies and trousers for modern everyday wear. Free shipping, tax-free
              prices, and 7% off with bank transfer.
            </p>
            <form
              className="mt-10 flex max-w-sm items-center gap-4 border-b border-[var(--ivory)]/25 pb-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address for newsletter"
                className="w-full bg-transparent text-sm placeholder:text-[var(--ivory)]/40 focus:outline-none"
              />
              <button
                type="submit"
                className="text-[0.625rem] tracking-[0.3em] uppercase transition-opacity hover:opacity-60"
              >
                Join
              </button>
            </form>
            <p className="mt-3 text-[0.6875rem] text-[var(--ivory)]/40">
              Newsletter signup can be connected to Shopify customer accounts or email.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="mb-5 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)]/45 uppercase">
                  {col.heading}
                </p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {"hash" in l && l.hash ? (
                        <a
                          href={`/#${l.hash}`}
                          className="rule-link text-[0.85rem] text-[var(--ivory)]/75"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.to}
                          search={l.search as never}
                          className="rule-link text-[0.85rem] text-[var(--ivory)]/75"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-[var(--ivory)]/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.6875rem] tracking-[0.2em] text-[var(--ivory)]/40 uppercase">
            © {new Date().getFullYear()} EYVORA. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[var(--ivory)]/60">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.2} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" strokeWidth={1.2} />
            </a>
            {whatsappConfigured() && (
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="text-[0.625rem] tracking-[0.22em] uppercase"
              >
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            )}
            {CONTACT_EMAIL ? (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[0.625rem] tracking-[0.22em] uppercase"
              >
                {CONTACT_EMAIL}
              </a>
            ) : null}
          </div>
        </div>
        <p className="mt-6 text-[0.65rem] text-[var(--ivory)]/35">
          WhatsApp {WHATSAPP_DISPLAY} · {CONTACT_EMAIL} · Payments: COD &amp; UBL bank
          transfer.{" "}
          <Link to="/payments" className="underline underline-offset-2">
            View details
          </Link>
        </p>
      </div>
    </footer>
  );
}
