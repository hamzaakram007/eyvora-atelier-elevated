import type { ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function ProductGrid({
  products,
  loading,
  emptyNote = "No products found.",
  columns = "lg:grid-cols-4",
}: {
  products: ShopifyProduct[];
  loading?: boolean;
  emptyNote?: string;
  columns?: string;
}) {
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

  if (products.length === 0) {
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
      {products.map((product, i) => (
        <Reveal key={product.node.id} delay={(i % 4) * 90} as="div">
          <ProductCard product={product} index={i} />
        </Reveal>
      ))}
    </div>
  );
}
