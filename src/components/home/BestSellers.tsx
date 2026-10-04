import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { fetchProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Reveal } from "@/components/site/Reveal";

export function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "essentials"],
    queryFn: () => fetchProducts(8),
    staleTime: 60_000,
  });

  return (
    <section className="border-t border-border bg-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">The essentials</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.1rem)]">
              Launch collection
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Four pieces. Twelve sizes. Designed to stand alone or work as coordinated outfits.
            </p>
          </div>
          <Link
            to="/shop"
            search={{}}
            className="rule-link text-[0.6875rem] tracking-[0.28em] uppercase"
          >
            View all
          </Link>
        </Reveal>

        <ProductGrid
          products={data ?? []}
          loading={isLoading}
          emptyNote="Products will appear here once the catalogue is available."
        />
      </div>
    </section>
  );
}
