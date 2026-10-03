import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, User, X, ShoppingBag } from "lucide-react";
import { announcements } from "@/lib/site";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/site/SearchOverlay";
import hoodies from "@/assets/products/category/hoodies.jpg";
import trousers from "@/assets/products/category/trousers.jpg";
import couple from "@/assets/products/couple/couple-2.jpg";

function AnnouncementBar() {
  const item = announcements[0];
  if (!item) return null;
  return (
    <div className="bg-[var(--ink)] py-2.5 text-center text-[var(--ivory)]">
      <Link
        to="/shop"
        className="text-[0.625rem] tracking-[0.28em] uppercase opacity-90 transition-opacity hover:opacity-100"
      >
        {item.text}
      </Link>
    </div>
  );
}

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-10 px-8 py-10 lg:grid-cols-[1fr_1fr_1.4fr] lg:px-10">
      <div>
        <p className="eyebrow mb-5">Collections</p>
        <ul className="space-y-3">
          {[
            { label: "Men", search: { gender: "men" } },
            { label: "Women", search: { gender: "women" } },
            { label: "Couple Collection", to: "/couple" as const },
            { label: "Hoodies", search: { category: "hoodies" } },
            { label: "Trousers", search: { category: "trousers" } },
            { label: "Shop All", search: {} },
          ].map((item) => (
            <li key={item.label}>
              {"to" in item && item.to ? (
                <Link to={item.to} onClick={onNavigate} className="rule-link text-[0.95rem]">
                  {item.label}
                </Link>
              ) : (
                <Link
                  to="/shop"
                  search={item.search}
                  onClick={onNavigate}
                  className="rule-link text-[0.95rem]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow mb-5">Explore</p>
        <ul className="space-y-3">
          <li>
            <Link to="/shop" search={{ gender: "men" }} onClick={onNavigate} className="rule-link text-[0.95rem]">
              Men
            </Link>
          </li>
          <li>
            <Link to="/shop" search={{ gender: "women" }} onClick={onNavigate} className="rule-link text-[0.95rem]">
              Women
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={onNavigate} className="rule-link text-[0.95rem]">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={onNavigate} className="rule-link text-[0.95rem]">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/visit" onClick={onNavigate} className="rule-link text-[0.95rem]">
              Visit Us
            </Link>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { img: hoodies, label: "Hoodies", search: { category: "hoodies" } },
          { img: trousers, label: "Trousers", search: { category: "trousers" } },
          { img: couple, label: "Couple", to: "/couple" as const },
        ].map((tile) =>
          "to" in tile && tile.to ? (
            <Link key={tile.label} to={tile.to} onClick={onNavigate} className="group relative overflow-hidden">
              <img
                src={tile.img}
                alt={`${tile.label} collection`}
                loading="lazy"
                className="h-44 w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase">
                {tile.label}
              </span>
            </Link>
          ) : (
            <Link
              key={tile.label}
              to="/shop"
              search={tile.search}
              onClick={onNavigate}
              className="group relative overflow-hidden"
            >
              <img
                src={tile.img}
                alt={`${tile.label} collection`}
                loading="lazy"
                className="h-44 w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase">
                {tile.label}
              </span>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
    <>
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
                "hidden items-center gap-6 text-[0.68rem] tracking-[0.2em] uppercase lg:flex",
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
                aria-expanded={megaOpen}
              >
                Collections
              </button>
              <Link to="/shop" search={{ gender: "men" }} className="rule-link">
                Men
              </Link>
              <Link to="/shop" search={{ gender: "women" }} className="rule-link">
                Women
              </Link>
              <Link to="/couple" className="rule-link">
                Couple
              </Link>
              <Link to="/about" className="rule-link">
                About Us
              </Link>
              <Link to="/contact" className="rule-link">
                Contact
              </Link>
              <Link to="/visit" className="rule-link">
                Visit Us
              </Link>
            </nav>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className={cn(
                "justify-self-start lg:hidden",
                solid ? "text-foreground" : "text-[var(--ivory)]",
              )}
            >
              <Menu className="h-5 w-5" strokeWidth={1.2} />
            </button>

            <Link
              to="/"
              className={cn(
                "font-display text-center text-2xl tracking-[0.34em] transition-colors duration-500 sm:text-[1.7rem]",
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
              <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.2} />
              </button>
              <Link to="/wishlist" aria-label="Wishlist" className="relative hidden sm:block">
                <Heart className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.2} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-[0.55rem] tracking-normal">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <a
                href={`https://${"eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com"}/account`}
                aria-label="Account"
                className="hidden sm:block"
              >
                <User className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.2} />
              </a>
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
              megaOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <MegaMenu onNavigate={() => setMegaOpen(false)} />
          </div>
        </div>

        <div
          className={cn(
            "fixed inset-0 z-50 bg-background transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-5">
            <span className="font-display text-lg tracking-[0.34em]">EYVORA</span>
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" strokeWidth={1.2} />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-8">
            {[
              { label: "Home", to: "/", search: undefined },
              { label: "Collections", to: "/shop", search: {} },
              { label: "Men", to: "/shop", search: { gender: "men" } },
              { label: "Women", to: "/shop", search: { gender: "women" } },
              { label: "Hoodies", to: "/shop", search: { category: "hoodies" } },
              { label: "Trousers", to: "/shop", search: { category: "trousers" } },
              { label: "Couple Collection", to: "/couple", search: undefined },
              { label: "Wishlist", to: "/wishlist", search: undefined },
              { label: "About Us", to: "/about", search: undefined },
              { label: "Contact", to: "/contact", search: undefined },
              { label: "Visit Us", to: "/visit", search: undefined },
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
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
              className="border-b border-border/60 py-4 text-left font-display text-2xl"
            >
              Search
            </button>
          </nav>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
