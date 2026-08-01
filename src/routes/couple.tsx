import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { BundleCard, BUNDLE_CODE } from "@/components/site/BundleCard";
import { Reveal } from "@/components/site/Reveal";
import couple from "@/assets/couple.jpg";

export const Route = createFileRoute("/couple")({
  head: () => ({
    meta: [
      { title: "Couple Collection — Matching Sets | EYVORA" },
      {
        name: "description",
        content:
          "Matching EYVORA hoodies and trousers cut in the same dye lot, sized separately. Add a bundle to your cart and save 10% on the pair.",
      },
      { property: "og:title", content: "Couple Collection — Matching Sets | EYVORA" },
      {
        property: "og:description",
        content:
          "Two of a kind. Matching hoodies and trousers in one dye lot, with bundle pricing on every pair.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CouplePage,
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-2xl px-5 py-40 text-center">
      <p className="font-display text-2xl">Something went wrong.</p>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-5 py-40 text-center">
      <p className="font-display text-2xl">Nothing here yet.</p>
    </div>
  ),
});

const PAIRS = [
  {
    title: "The Essential Pair",
    note: "Our foundation hoodie in the same matte black dye lot — his relaxed, hers shaped through the shoulder.",
    men: "essential hoodie",
    women: "essential hoodie",
  },
  {
    title: "The Signature Pair",
    note: "Heavyweight oversized fleece in warm neutrals. The widest silhouette we cut, for both of you.",
    men: "signature oversized",
    women: "signature oversized",
  },
  {
    title: "The Tailored Pair",
    note: "Compact twill trousers with a pressed crease — quietly formal, cut for two different lines.",
    men: "classic trousers",
    women: "classic trousers",
  },
  {
    title: "The Weekend Pair",
    note: "Brushed cotton-linen in a full leg. Soft, fluid, and built for long days out of the city.",
    men: "premium relaxed",
    women: "premium relaxed",
  },
];

function match(products: ShopifyProduct[], key: string, gender: "men" | "women") {
  return products.find((p) => {
    const title = p.node.title.toLowerCase();
    return title.includes(key) && title.includes(gender === "men" ? "men" : "women")
      ? gender === "women"
        ? title.includes("women")
        : !title.includes("women")
      : false;
  });
}

function CouplePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "couple"],
    queryFn: () => fetchProducts(50, "tag:couple"),
  });

  const products = data ?? [];
  const bundles = PAIRS.map((pair) => ({
    ...pair,
    menProduct: match(products, pair.men, "men"),
    womenProduct: match(products, pair.women, "women"),
  })).filter((b) => b.menProduct && b.womenProduct);

  return (
    <main>
      <section className="relative">
        <img
          src={couple}
          alt="A couple wearing matching EYVORA pieces"
          width={1600}
          height={1104}
          className="h-[62vh] w-full object-cover lg:h-[74vh]"
        />
        <div className="absolute inset-0 bg-[var(--ink)]/35" />
        <div className="absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-5 pb-16 text-[var(--ivory)] lg:px-10 lg:pb-24">
          <p className="eyebrow text-[var(--ivory)]/60">Two Of A Kind</p>
          <h1 className="font-display mt-5 max-w-2xl text-[clamp(2.5rem,6vw,5rem)] leading-[1.02]">
            The Couple Collection
          </h1>
          <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-[var(--ivory)]/75">
            Same tone. Different fit. Every pair is cut from a single garment-dye
            batch and sized separately — add both to your cart in one move and take
            10% off with code {BUNDLE_CODE}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
        {isLoading ? (
          <div className="space-y-24">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="grid animate-pulse gap-8 sm:grid-cols-2">
                <div className="aspect-[4/5] bg-[var(--sand)]" />
                <div className="aspect-[4/5] bg-[var(--sand)]" />
              </div>
            ))}
          </div>
        ) : bundles.length === 0 ? (
          <div className="border border-dashed border-border px-8 py-24 text-center">
            <p className="font-display text-2xl">No matching sets yet.</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Pairs tagged “couple” in the EYVORA catalogue appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-24 lg:space-y-32">
            {bundles.map((bundle, i) => (
              <Reveal key={bundle.title} as="div">
                <BundleCard
                  index={i}
                  title={bundle.title}
                  note={bundle.note}
                  men={bundle.menProduct!}
                  women={bundle.womenProduct!}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
