import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Truck, RefreshCw, ShieldCheck, ChevronRight } from "lucide-react";
import { fetchProductByHandle, fetchProducts, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Faq } from "@/components/home/Faq";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => {
    const name = params.handle
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} — EYVORA` },
        {
          name: "description",
          content: `${name} by EYVORA. Premium heavyweight cotton, tailored fit, limited run. Free delivery nationwide.`,
        },
        { property: "og:title", content: `${name} — EYVORA` },
        {
          property: "og:description",
          content: `${name} by EYVORA. Premium cotton, limited run.`,
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

  const { data: related } = useQuery({
    queryKey: ["products", "related"],
    queryFn: () => fetchProducts(8),
  });

  const node = product?.node;
  const images = node?.images.edges ?? [];
  const variants = node?.variants.edges ?? [];

  const variant = useMemo(() => {
    if (variants.length === 0) return null;
    const match = variants.find((v) =>
      v.node.selectedOptions.every((o) => !selected[o.name] || selected[o.name] === o.value),
    );
    return (match ?? variants[0])!.node;
  }, [variants, selected]);

  if (loadingProduct) {
    return (
      <div className="mx-auto max-w-[1600px] px-5 pt-40 lg:px-10">
        <div className="grid animate-pulse gap-10 lg:grid-cols-2">
          <div className="aspect-[4/5] bg-[var(--sand)]" />
          <div className="space-y-4 py-10">
            <div className="h-8 w-2/3 bg-[var(--sand)]" />
            <div className="h-4 w-1/4 bg-[var(--sand)]" />
            <div className="h-24 w-full bg-[var(--sand)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-48 pb-32 text-center">
        <p className="eyebrow">Not available</p>
        <h1 className="font-display mt-5 text-4xl">This piece isn't in the catalogue</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          It may have sold out or been retired. Browse the current collection instead.
        </p>
        <Link
          to="/shop"
          className="mt-9 inline-block bg-[var(--ink)] px-9 py-4 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase"
        >
          Shop all
        </Link>
      </div>
    );
  }

  const price = variant?.price ?? node.priceRange.minVariantPrice;
  const compareAt = node.compareAtPriceRange?.minVariantPrice;
  const onSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount)
      ? compareAt
      : null;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: { node },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions,
    });
    toast.success("Added to your bag", { description: node.title });
    setOpen(true);
  };

  return (
    <div className="pt-28 lg:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <nav className="flex items-center gap-2 py-6 text-[0.625rem] tracking-[0.22em] text-muted-foreground uppercase">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1} />
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1} />
          <span className="text-foreground">{node.title}</span>
        </nav>

        <div className="grid gap-10 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="flex gap-4">
            {images.length > 1 && (
              <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
                {images.map((img, i) => (
                  <button
                    key={img.node.url}
                    onMouseEnter={() => setActiveImage(i)}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "aspect-[4/5] overflow-hidden border transition-colors",
                      activeImage === i ? "border-[var(--ink)]" : "border-transparent",
                    )}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText ?? node.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 overflow-hidden bg-[var(--sand)]">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]!.node.url}
                  alt={images[activeImage]!.node.altText ?? node.title}
                  width={1200}
                  height={1500}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="aspect-[4/5] w-full" />
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-32 lg:self-start lg:py-4">
            <h1 className="font-display text-[clamp(1.85rem,3.4vw,3rem)] leading-[1.08]">
              {node.title}
            </h1>
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-lg">{formatPrice(price.amount, price.currencyCode)}</span>
              {onSale && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(onSale.amount, onSale.currencyCode)}
                </span>
              )}
            </div>

            {node.description && (
              <p className="mt-7 max-w-md text-[0.9rem] leading-[1.85] text-muted-foreground">
                {node.description}
              </p>
            )}

            <div className="mt-10 space-y-7">
              {node.options
                .filter((o) => o.values.length > 1 || o.name !== "Title")
                .map((option) => (
                  <div key={option.name}>
                    <p className="eyebrow mb-3">{option.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const active =
                          selected[option.name] === value ||
                          (!selected[option.name] &&
                            variant?.selectedOptions.some(
                              (o) => o.name === option.name && o.value === value,
                            ));
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              setSelected((s) => ({ ...s, [option.name]: value }))
                            }
                            className={cn(
                              "min-w-12 border px-4 py-2.5 text-[0.75rem] tracking-[0.08em] transition-colors duration-300",
                              active
                                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                                : "border-border hover:border-foreground",
                            )}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              <div>
                <p className="eyebrow mb-3">Quantity</p>
                <div className="inline-flex items-center border border-border">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="px-4 py-3"
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={1} />
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="px-4 py-3"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={1} />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={isLoading || !variant?.availableForSale}
              className="mt-9 w-full bg-[var(--ink)] px-8 py-5 text-[0.6875rem] tracking-[0.32em] text-[var(--ivory)] uppercase transition-opacity duration-300 hover:opacity-85 disabled:opacity-40"
            >
              {variant?.availableForSale ? "Add to bag" : "Sold out"}
            </button>

            <ul className="mt-10 space-y-4 border-t border-border pt-8 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Truck className="h-4 w-4" strokeWidth={1} /> Free nationwide delivery
              </li>
              <li className="flex items-center gap-3">
                <RefreshCw className="h-4 w-4" strokeWidth={1} /> 7-day easy exchange
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4" strokeWidth={1} /> Secure Shopify checkout
              </li>
            </ul>
          </div>
        </div>

        <section className="border-t border-border py-20">
          <p className="eyebrow">You may also like</p>
          <h2 className="font-display mt-4 mb-12 text-[clamp(1.75rem,3vw,2.5rem)]">
            Complete the look
          </h2>
          <ProductGrid
            products={(related ?? []).filter((p) => p.node.handle !== handle).slice(0, 4)}
          />
        </section>
      </div>

      <Faq />
    </div>
  );
}
