import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, User, X, ShoppingBag } from "lucide-react";
import { announcements } from "@/lib/site";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import menHoodie from "@/assets/cat-men-hoodies.jpg";
import womenHoodie from "@/assets/cat-women-hoodies.jpg";
import couple from "@/assets/couple.jpg";

function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-[var(--ink)] py-2.5 text-[var(--ivory)]">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {announcements.map((a) => (
              <span
                key={`${dup}-${a}`}
                className="flex items-center gap-10 px-10 text-[0.625rem] tracking-[0.34em] uppercase opacity-80"
              >
                {a}
                <span className="h-px w-8 bg-current opacity-40" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const megaColumns = [
  {
    heading: "Collections",
    items: [
      { label: "New Arrivals", search: { sort: "newest" } },
      { label: "Best Sellers", search: { sort: "popular" } },
      { label: "Winter 26", search: { collection: "winter" } },
      { label: "Couple Collection", search: { collection: "couple" } },
      { label: "All Pieces", search: {} },
    ],
  },
  {
    heading: "Men",
    items: [
      { label: "Hoodies", search: { gender: "men", category: "hoodies" } },
      { label: "Trousers", search: { gender: "men", category: "trousers" } },
      { label: "Full Sets", search: { gender: "men" } },
    ],
  },
  {
    heading: "Women",
    items: [
      { label: "Hoodies", search: { gender: "women", category: "hoodies" } },
      { label: "Trousers", search: { gender: "women", category: "trousers" } },
      { label: "Full Sets", search: { gender: "women" } },
    ],
  },
];

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-12 px-10 py-12 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.4fr]">
      {megaColumns.map((col) => (
        <div key={col.heading}>
          <p className="eyebrow mb-6">{col.heading}</p>
          <ul className="space-y-3.5">
            {col.items.map((item) => (
              <li key={item.label}>
                <Link
                  to="/shop"
                  search={item.search}
                  onClick={onNavigate}
                  className="rule-link text-[0.95rem] font-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-3">
        {[
          { img: menHoodie, label: "Men" },
          { img: womenHoodie, label: "Women" },
          { img: couple, label: "Couple" },
        ].map((tile) => (
          <Link
            key={tile.label}
            to="/shop"
            search={
              tile.label === "Couple"
                ? { collection: "couple" }
                : { gender: tile.label.toLowerCase() }
            }
            onClick={onNavigate}
            className="group relative overflow-hidden"
          >
            <img
              src={tile.img}
              alt={`${tile.label} collection`}
              loading="lazy"
              className="h-56 w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
            <span className="absolute bottom-3 left-3 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const wishlist = useWishlist((s) => s.handles);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || megaOpen || mobileOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "bg-background/95 backdrop-blur-xl" : "bg-transparent",
      )}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <AnnouncementBar />
      <div
        className={cn(
          "border-b transition-colors duration-500",
          solid ? "border-border" : "border-transparent",
        )}
      >
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 lg:px-10">
          <nav
            className={cn(
              "hidden items-center gap-7 text-[0.7rem] tracking-[0.22em] uppercase lg:flex",
              solid ? "text-foreground" : "text-[var(--ivory)]",
            )}
          >
            <Link to="/" className="rule-link">
              Home
            </Link>
            <button
              type="button"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
              className="rule-link uppercase"
            >
              Collections
            </button>
            <Link to="/shop" search={{ gender: "men" }} className="rule-link">
              Men
            </Link>
            <Link to="/shop" search={{ gender: "women" }} className="rule-link">
              Women
            </Link>
            <Link to="/shop" search={{ collection: "couple" }} className="rule-link">
              Couple
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className={cn("justify-self-start lg:hidden", solid ? "text-foreground" : "text-[var(--ivory)]")}
          >
            <Menu className="h-5 w-5" strokeWidth={1.2} />
          </button>

          <Link
            to="/"
            className={cn(
              "font-display text-center text-xl tracking-[0.42em] transition-colors duration-500 sm:text-2xl",
              solid ? "text-foreground" : "text-[var(--ivory)]",
            )}
          >
            EYVORA
          </Link>

          <div
            className={cn(
              "flex items-center justify-end gap-5",
              solid ? "text-foreground" : "text-[var(--ivory)]",
            )}
          >
            <Link to="/shop" aria-label="Search" className="hidden sm:block">
              <Search className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.2} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative hidden sm:block">
              <Heart className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.2} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[0.55rem] tracking-normal">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/contact" aria-label="Account" className="hidden sm:block">
              <User className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.2} />
            </Link>
            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.2} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[0.55rem] tracking-normal">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "hidden overflow-hidden border-t border-border bg-background transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block",
            megaOpen ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <MegaMenu onNavigate={() => setMegaOpen(false)} />
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <span className="font-display text-lg tracking-[0.4em]">EYVORA</span>
          <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" strokeWidth={1.2} />
          </button>
        </div>
        <nav className="flex flex-col px-5 py-8">
          {[
            { label: "Home", to: "/", search: undefined },
            { label: "New Arrivals", to: "/shop", search: { sort: "newest" } },
            { label: "Men", to: "/shop", search: { gender: "men" } },
            { label: "Women", to: "/shop", search: { gender: "women" } },
            { label: "Hoodies", to: "/shop", search: { category: "hoodies" } },
            { label: "Trousers", to: "/shop", search: { category: "trousers" } },
            { label: "Couple Collection", to: "/shop", search: { collection: "couple" } },
            { label: "Wishlist", to: "/wishlist", search: undefined },
            { label: "About", to: "/about", search: undefined },
            { label: "Visit Us", to: "/visit", search: undefined },
            { label: "Contact", to: "/contact", search: undefined },
          ].map((l) => (
            <Link
              key={l.label}
              to={l.to}
              search={l.search as never}
              onClick={() => setMobileOpen(false)}
              className="border-b border-border/60 py-4 font-display text-2xl"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
