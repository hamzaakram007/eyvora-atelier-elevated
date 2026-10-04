import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — EYVORA" },
      {
        name: "description",
        content:
          "Pieces you've saved from the EYVORA collection. Add them to your bag whenever you're ready.",
      },
      { property: "og:title", content: "Your EYVORA Wishlist" },
      { property: "og:description", content: "The EYVORA pieces you've saved." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://eyvora.pk/wishlist" }],
  }),
  component: Wishlist,
});

function Wishlist() {
  const handles = useWishlist((s) => s.handles);
  const { data, isLoading } = useQuery({
    queryKey: ["products", "wishlist"],
    queryFn: () => fetchProducts(60),
    enabled: handles.length > 0,
  });

  const products = (data ?? []).filter((p) => handles.includes(p.node.handle));

  return (
    <div className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 pb-24 lg:px-10">
        <header className="border-b border-border pb-10">
          <p className="eyebrow">Saved</p>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,5vw,4rem)]">Wishlist</h1>
        </header>

        <div className="py-14">
          {handles.length === 0 ? (
            <div className="border border-dashed border-border px-8 py-28 text-center">
              <p className="font-display text-2xl">Nothing saved yet</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Tap the heart on any piece to keep it here.
              </p>
              <Link
                to="/shop"
                className="mt-9 inline-block bg-[var(--ink)] px-9 py-4 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase"
              >
                Browse the collection
              </Link>
            </div>
          ) : (
            <ProductGrid
              products={products}
              loading={isLoading}
              emptyNote="Saved pieces are no longer available."
              columns="lg:grid-cols-3 xl:grid-cols-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
