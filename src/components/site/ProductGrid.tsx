import type { ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export type ProductGridItem = {
  product: ShopifyProduct;
  gender?: string;
};

export function ProductGrid({
  products,
  items,
  loading,
  emptyNote = "No products found.",
  columns = "lg:grid-cols-4",
  gender,
}: {
  products?: ShopifyProduct[];
  /** Prefer this when each card needs its own Men/Women gallery. */
  items?: ProductGridItem[];
  loading?: boolean;
  emptyNote?: string;
  columns?: string;
  /** Shared gender for all cards when `items` is not provided. */
  gender?: string;
}) {
  const resolved: ProductGridItem[] =
    items ??
    (products ?? []).map((product) => ({
      product,
      gender,
    }));

  if (loading) {
    return (
      <div className={`grid grid-cols-2 gap-x-5 gap-y-12 ${columns}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-[var(--sand)]" />
            <div className="mt-5 h-3 w-2/3 bg-[var(--sand)]" />
            <div className="mt-2 h-3 w-1/3 bg-[var(--sand)]" />
          </div>
        ))}
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="border border-dashed border-border px-8 py-24 text-center">
        <p className="font-display text-2xl">{emptyNote}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Pieces added to the EYVORA catalogue will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-x-5 gap-y-14 ${columns}`}>
      {resolved.map((item, i) => (
        <Reveal key={item.product.node.id} delay={(i % 4) * 90} as="div">
          <ProductCard product={item.product} index={i} gender={item.gender} />
        </Reveal>
      ))}
    </div>
  );
}
