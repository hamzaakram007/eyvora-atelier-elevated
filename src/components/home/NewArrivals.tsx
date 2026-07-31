import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

export function NewArrivals() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "new"],
    queryFn: () => fetchProducts(12),
  });
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: "smooth" });
  };

  const products = data ?? [];

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
      <Reveal className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">03 — Just Landed</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)]">New Arrivals</h2>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            className="grid h-11 w-11 place-items-center border border-border transition-colors hover:bg-[var(--ink)] hover:text-[var(--ivory)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.2} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollBy(1)}
            className="grid h-11 w-11 place-items-center border border-border transition-colors hover:bg-[var(--ink)] hover:text-[var(--ivory)]"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.2} />
          </button>
        </div>
      </Reveal>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse bg-[var(--sand)]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-border px-8 py-24 text-center">
          <p className="font-display text-2xl">No products found.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            New pieces appear here the moment they are added to the catalogue.
          </p>
        </div>
      ) : (
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, i) => (
            <div
              key={product.node.id}
              className="w-[70vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23vw]"
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
