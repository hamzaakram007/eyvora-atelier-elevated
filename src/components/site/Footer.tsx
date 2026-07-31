import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { whatsappLink } from "@/lib/site";

const columns = [
  {
    heading: "Collections",
    links: [
      { label: "New Arrivals", to: "/shop", search: { sort: "newest" } },
      { label: "Best Sellers", to: "/shop", search: { sort: "popular" } },
      { label: "Hoodies", to: "/shop", search: { category: "hoodies" } },
      { label: "Trousers", to: "/shop", search: { category: "trousers" } },
      { label: "Couple Collection", to: "/shop", search: { collection: "couple" } },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About EYVORA", to: "/about", search: undefined },
      { label: "Visit Us", to: "/visit", search: undefined },
      { label: "Contact", to: "/contact", search: undefined },
      { label: "Wishlist", to: "/wishlist", search: undefined },
    ],
  },
  {
    heading: "Customer Care",
    links: [
      { label: "Shipping", to: "/policies/shipping", search: undefined },
      { label: "Exchange", to: "/policies/exchange", search: undefined },
      { label: "Refunds", to: "/policies/refund", search: undefined },
      { label: "Size Guide", to: "/policies/shipping", search: undefined },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Privacy Policy", to: "/policies/privacy", search: undefined },
      { label: "Terms of Service", to: "/policies/terms", search: undefined },
      { label: "Refund Policy", to: "/policies/refund", search: undefined },
      { label: "Shipping Policy", to: "/policies/shipping", search: undefined },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-[var(--ink)] text-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-10 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-md">
            <p className="font-display text-3xl tracking-[0.34em]">EYVORA</p>
            <p className="mt-6 text-sm leading-relaxed text-[var(--ivory)]/60">
              Premium hoodies and trousers, cut for the way you actually live.
              Considered fabric, quiet colour, built to outlast the season.
            </p>
            <form
              className="mt-10 flex max-w-sm items-center gap-4 border-b border-[var(--ivory)]/25 pb-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
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
              Early access to drops. No noise.
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
                      <Link
                        to={l.to}
                        search={l.search as never}
                        className="rule-link text-[0.85rem] text-[var(--ivory)]/75"
                      >
                        {l.label}
                      </Link>
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
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="h-4 w-4" strokeWidth={1.2} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="h-4 w-4" strokeWidth={1.2} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube className="h-4 w-4" strokeWidth={1.2} />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="text-[0.6875rem] tracking-[0.2em] uppercase"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
