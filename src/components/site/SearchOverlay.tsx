import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { formatPrice, searchStorefront, type ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<
    Array<{ id: string; title: string; handle: string }>
  >([]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setProducts([]);
      setCollections([]);
      return;
    }
    let alive = true;
    const t = window.setTimeout(async () => {
      setLoading(true);
      try {
        const result = await searchStorefront(q, 8);
        if (!alive) return;
        setProducts(result.products);
        setCollections(result.collections);
      } finally {
        if (alive) setLoading(false);
      }
    }, 220);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [query, open]);

  const empty = useMemo(
    () => !loading && query.trim().length > 0 && products.length === 0 && collections.length === 0,
    [loading, products.length, collections.length, query],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(30,30,30,0.45)]"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-0 max-h-[100svh] w-full max-w-3xl overflow-auto bg-background shadow-xl sm:mt-16 sm:max-h-[80vh]">
        <div className="sticky top-0 flex items-center gap-3 border-b border-border bg-background px-5 py-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.2} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hoodies, trousers, olive, black…"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="Search products"
          />
          <button type="button" aria-label="Close search" onClick={onClose}>
            <X className="h-4 w-4" strokeWidth={1.2} />
          </button>
        </div>

        <div className="px-5 py-6">
          {loading && (
            <p className="text-sm text-muted-foreground">Searching…</p>
          )}
          {empty && (
            <div className="py-10 text-center">
              <p className="font-display text-2xl">No results</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Try “hoodie”, “trousers”, “olive”, or “grey”.
              </p>
            </div>
          )}
          {!query.trim() && (
            <div className="flex flex-wrap gap-2">
              {["Hoodies", "Trousers", "Olive", "Black", "Grey", "Couple"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="border border-border px-3 py-2 text-[0.625rem] tracking-[0.2em] uppercase"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {collections.length > 0 && (
            <div className="mb-8">
              <p className="eyebrow mb-4">Collections</p>
              <ul className="space-y-2">
                {collections.map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/shop"
                      search={{ collection: c.handle }}
                      onClick={onClose}
                      className="text-sm hover:underline"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {products.length > 0 && (
            <div>
              <p className="eyebrow mb-4">Products</p>
              <ul className="space-y-4">
                {products.map((p) => {
                  const img = p.node.images.edges[0]?.node;
                  const price = p.node.priceRange.minVariantPrice;
                  return (
                    <li key={p.node.id}>
                      <Link
                        to="/product/$handle"
                        params={{ handle: p.node.handle }}
                        onClick={onClose}
                        className={cn("flex items-center gap-4")}
                      >
                        <div className="h-16 w-14 shrink-0 overflow-hidden bg-[var(--soft-grey)]">
                          {img && (
                            <img
                              src={img.url}
                              alt={img.altText ?? p.node.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{p.node.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatPrice(price.amount, price.currencyCode)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
