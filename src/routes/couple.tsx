import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchProducts, formatPrice } from "@/lib/shopify";
import { COUPLE_OUTFITS, findCatalogProduct } from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import coupleHero from "@/assets/products/hero/hero-desktop.jpg";

export const Route = createFileRoute("/couple")({
  head: () => ({
    meta: [
      { title: "Couple Collection — Coordinated Outfits | EYVORA" },
      {
        name: "description",
        content:
          "Build coordinated EYVORA outfits from the launch essentials. Choose hoodie and trouser sizes independently — no invented bundle discounts.",
      },
      { property: "og:title", content: "Couple Collection — EYVORA" },
      {
        property: "og:description",
        content:
          "Olive and black hoodies with grey and black trousers. Select sizes for each piece and add both to bag.",
      },
    ],
  }),
  component: CouplePage,
});

function OutfitBuilder({
  title,
  note,
  hoodieHandle,
  trousersHandle,
}: {
  title: string;
  note: string;
  hoodieHandle: string;
  trousersHandle: string;
}) {
  const { data } = useQuery({
    queryKey: ["products", "couple-page"],
    queryFn: () => fetchProducts(12),
  });
  const products = data ?? [];
  const hoodie = findCatalogProduct(products, hoodieHandle);
  const trousers = findCatalogProduct(products, trousersHandle);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const [hoodieSize, setHoodieSize] = useState("");
  const [trouserSize, setTrouserSize] = useState("");
  const [loading, setLoading] = useState(false);

  if (!hoodie || !trousers) return null;

  const addBoth = async () => {
    if (!hoodieSize || !trouserSize) {
      toast.message("Select both sizes", {
        description: "Choose a hoodie size and a trouser size.",
      });
      return;
    }
    const hoodieVariant = hoodie.node.variants.edges.find((v) =>
      v.node.selectedOptions.some((o) => o.name === "Size" && o.value === hoodieSize),
    )?.node;
    const trouserVariant = trousers.node.variants.edges.find((v) =>
      v.node.selectedOptions.some((o) => o.name === "Size" && o.value === trouserSize),
    )?.node;
    if (!hoodieVariant || !trouserVariant) return;

    setLoading(true);
    await addItem({
      product: hoodie,
      variantId: hoodieVariant.id,
      variantTitle: hoodieVariant.title,
      price: hoodieVariant.price,
      quantity: 1,
      selectedOptions: hoodieVariant.selectedOptions,
    });
    await addItem({
      product: trousers,
      variantId: trouserVariant.id,
      variantTitle: trouserVariant.title,
      price: trouserVariant.price,
      quantity: 1,
      selectedOptions: trouserVariant.selectedOptions,
    });
    setLoading(false);
    toast.success("Outfit added to bag");
    setOpen(true);
  };

  const total =
    parseFloat(hoodie.node.priceRange.minVariantPrice.amount) +
    parseFloat(trousers.node.priceRange.minVariantPrice.amount);

  return (
    <Reveal className="grid gap-8 border-t border-border py-14 lg:grid-cols-2 lg:gap-12">
      <div className="grid grid-cols-2 gap-3">
        {[hoodie, trousers].map((p) => (
          <Link
            key={p.node.id}
            to="/product/$handle"
            params={{ handle: p.node.handle }}
            className="overflow-hidden bg-[var(--soft-grey)]"
          >
            {p.node.images.edges[0] && (
              <img
                src={p.node.images.edges[0].node.url}
                alt={p.node.title}
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            )}
          </Link>
        ))}
      </div>
      <div>
        <p className="eyebrow">Outfit</p>
        <h2 className="font-display mt-3 text-3xl">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{note}</p>
        <p className="mt-5 text-sm">
          Combined {formatPrice(total, "PKR")} — no bundle discount applied.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Hoodie size</p>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setHoodieSize(size)}
                  className={cn(
                    "min-w-11 border px-3 py-2 text-[0.625rem] tracking-[0.18em] uppercase",
                    hoodieSize === size
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                      : "border-border",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm">{hoodie.node.title}</p>
          </div>
          <div>
            <p className="eyebrow mb-3">Trouser size</p>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTrouserSize(size)}
                  className={cn(
                    "min-w-11 border px-3 py-2 text-[0.625rem] tracking-[0.18em] uppercase",
                    trouserSize === size
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                      : "border-border",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm">{trousers.node.title}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={addBoth}
          disabled={loading}
          className="mt-8 bg-[var(--ink)] px-8 py-4 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase disabled:opacity-40"
        >
          {loading ? "Adding…" : "Add both to bag"}
        </button>
      </div>
    </Reveal>
  );
}

function CouplePage() {
  return (
    <main>
      <section className="relative">
        <img
          src={coupleHero}
          alt="Couple wearing coordinated EYVORA pieces"
          width={1600}
          height={2000}
          className="h-[62vh] w-full object-cover object-[50%_20%] lg:h-[74vh]"
        />
        <div className="absolute inset-0 bg-[var(--ink)]/35" />
        <div className="absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-5 pb-16 text-[var(--ivory)] lg:px-10 lg:pb-24">
          <p className="eyebrow text-[var(--ivory)]/60">Couple Collection</p>
          <h1 className="font-display mt-5 max-w-2xl text-[clamp(2.5rem,6vw,5rem)] leading-[1.02]">
            Dress together.
          </h1>
          <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-[var(--ivory)]/75">
            Choose an outfit from the launch essentials, select each size independently, and add
            both pieces to your bag.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 lg:px-10">
        {COUPLE_OUTFITS.map((outfit) => (
          <OutfitBuilder key={outfit.id} {...outfit} />
        ))}
      </section>
    </main>
  );
}
