import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

export const BUNDLE_DISCOUNT = 0.1;
export const BUNDLE_CODE = "COUPLE10";

type Variant = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

function firstAvailable(product: ShopifyProduct) {
  const variants = product.node.variants.edges;
  return (variants.find((v) => v.node.availableForSale) ?? variants[0])?.node;
}

function SidePicker({
  label,
  product,
  selected,
  onSelect,
}: {
  label: string;
  product: ShopifyProduct;
  selected: Variant | undefined;
  onSelect: (v: Variant) => void;
}) {
  const node = product.node;
  const image = node.images.edges[0]?.node;

  return (
    <div>
      <Link
        to="/product/$handle"
        params={{ handle: node.handle }}
        className="block overflow-hidden bg-[var(--sand)]"
      >
        {image && (
          <img
            src={image.url}
            alt={image.altText ?? node.title}
            loading="lazy"
            width={1024}
            height={1280}
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
          />
        )}
      </Link>
      <p className="eyebrow mt-5">{label}</p>
      <Link
        to="/product/$handle"
        params={{ handle: node.handle }}
        className="mt-2 block text-[0.9rem] leading-snug"
      >
        {node.title}
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        {node.variants.edges.map(({ node: v }) => (
          <button
            key={v.id}
            type="button"
            disabled={!v.availableForSale}
            onClick={() => onSelect(v)}
            className={cn(
              "min-w-11 border px-3 py-2 text-[0.625rem] tracking-[0.2em] uppercase transition-colors",
              selected?.id === v.id
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                : "border-border hover:border-[var(--ink)]",
              !v.availableForSale && "opacity-35",
            )}
          >
            {v.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BundleCard({
  index,
  title,
  note,
  men,
  women,
}: {
  index: number;
  title: string;
  note: string;
  men: ShopifyProduct;
  women: ShopifyProduct;
}) {
  const [menVariant, setMenVariant] = useState<Variant | undefined>(() =>
    firstAvailable(men),
  );
  const [womenVariant, setWomenVariant] = useState<Variant | undefined>(() =>
    firstAvailable(women),
  );
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);

  const currency = menVariant?.price.currencyCode ?? "PKR";
  const subtotal =
    parseFloat(menVariant?.price.amount ?? "0") +
    parseFloat(womenVariant?.price.amount ?? "0");
  const bundlePrice = subtotal * (1 - BUNDLE_DISCOUNT);

  const addBundle = async () => {
    if (!menVariant || !womenVariant) return;
    setAdding(true);
    await addItem({
      product: men,
      variantId: menVariant.id,
      variantTitle: menVariant.title,
      price: menVariant.price,
      quantity: 1,
      selectedOptions: menVariant.selectedOptions || [],
    });
    await addItem({
      product: women,
      variantId: womenVariant.id,
      variantTitle: womenVariant.title,
      price: womenVariant.price,
      quantity: 1,
      selectedOptions: womenVariant.selectedOptions || [],
    });
    setAdding(false);
    toast.success("Bundle added to your bag", {
      description: `Use code ${BUNDLE_CODE} at checkout for 10% off the pair.`,
    });
    setCartOpen(true);
  };

  return (
    <article className="border-t border-border pt-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            0{index + 1} — Matching Set
          </p>
          <h2 className="font-display mt-4 text-[clamp(1.75rem,3.2vw,2.75rem)]">
            {title}
          </h2>
          <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">
            {note}
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="text-[0.625rem] tracking-[0.28em] text-muted-foreground uppercase">
            Bundle price
          </p>
          <p className="font-display mt-2 text-2xl">
            {formatPrice(bundlePrice, currency)}
          </p>
          <p className="mt-1 text-[0.8rem] text-muted-foreground line-through">
            {formatPrice(subtotal, currency)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
        <SidePicker
          label="For him"
          product={men}
          selected={menVariant}
          onSelect={setMenVariant}
        />
        <SidePicker
          label="For her"
          product={women}
          selected={womenVariant}
          onSelect={setWomenVariant}
        />
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={addBundle}
          disabled={adding || !menVariant || !womenVariant}
          className="w-full bg-[var(--ink)] px-10 py-4 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase transition-opacity hover:opacity-85 disabled:opacity-40 sm:w-auto"
        >
          {adding ? (
            <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
          ) : (
            "Add bundle to cart"
          )}
        </button>
        <p className="text-[0.75rem] text-muted-foreground">
          Apply code{" "}
          <span className="tracking-[0.2em] text-foreground uppercase">
            {BUNDLE_CODE}
          </span>{" "}
          at checkout — 10% off the pair.
        </p>
      </div>
    </article>
  );
}
