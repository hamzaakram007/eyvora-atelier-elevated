import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { fetchProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Reveal } from "@/components/site/Reveal";

export function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "bestsellers"],
    queryFn: () => fetchProducts(8),
  });

  return (
    <section className="border-t border-border bg-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
        <Reveal className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">02 — Most Wanted</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)]">Best Sellers</h2>
          </div>
          <Link
            to="/shop"
            search={{ sort: "popular" }}
            className="rule-link text-[0.6875rem] tracking-[0.28em] uppercase"
          >
            All best sellers
          </Link>
        </Reveal>

        <ProductGrid
          products={data ?? []}
          loading={isLoading}
          emptyNote="No products found."
        />
      </div>
    </section>
  );
}
