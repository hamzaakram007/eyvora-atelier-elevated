import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  index = 0,
  gender,
}: {
  product: ShopifyProduct;
  index?: number;
  gender?: string;
}) {
  const node = product.node;
  const images = node.images.edges;
  const primary = images[0]?.node.url;
  const secondary = images[1]?.node.url ?? primary;
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const wishlisted = useWishlist((s) => s.handles.includes(node.handle));
  const toggleWishlist = useWishlist((s) => s.toggle);
  const [adding, setAdding] = useState(false);
  const [size, setSize] = useState<string>("");

  const colorOption = node.options?.find((o) =>
    ["color", "colour"].includes(o.name.toLowerCase()),
  );
  const sizeOption = node.options?.find((o) => o.name.toLowerCase() === "size");
  const variants = node.variants.edges;
  const soldOut = variants.length > 0 && !variants.some((v) => v.node.availableForSale);
  const price = node.priceRange.minVariantPrice;

  const selectedVariant = useMemo(() => {
    if (!size) return null;
    return (
      variants.find((v) =>
        v.node.selectedOptions.some(
          (o) => o.name.toLowerCase() === "size" && o.value === size,
        ),
      )?.node ?? null
    );
  }, [size, variants]);

  const quickAdd = async () => {
    if (!size || !selectedVariant) {
      toast.message("Select a size", {
        description: "Choose S, M or L before adding to bag.",
      });
      return;
    }
    if (!selectedVariant.availableForSale) return;
    setAdding(true);
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    setAdding(false);
    toast.success("Added to your bag", { description: `${node.title} / ${size}` });
    setCartOpen(true);
  };

  return (
    <article
      className="group relative"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link
        to="/product/$handle"
        params={{ handle: node.handle }}
        search={gender === "men" || gender === "women" ? { gender } : undefined}
        className="block overflow-hidden bg-[var(--soft-grey)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {primary && (
            <img
              src={primary}
              alt={images[0]?.node.altText ?? node.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:opacity-0"
            />
          )}
          {secondary && (
            <img
              src={secondary}
              alt={node.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          {(gender === "men" || gender === "women") && !soldOut && (
            <span className="absolute top-4 left-4 bg-background/90 px-2.5 py-1 text-[0.5625rem] tracking-[0.24em] uppercase">
              {gender === "men" ? "Men" : "Women"}
            </span>
          )}
          {soldOut && (
            <span className="absolute top-4 left-4 bg-background/90 px-2.5 py-1 text-[0.5625rem] tracking-[0.24em] uppercase">
              Sold out
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist(node.handle)}
        className="absolute top-4 right-4 grid h-9 w-9 place-items-center bg-background/90 opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100"
      >
        <Heart
          className={cn("h-3.5 w-3.5", wishlisted && "fill-current")}
          strokeWidth={1.2}
        />
      </button>

      <div className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              to="/product/$handle"
              params={{ handle: node.handle }}
              search={gender === "men" || gender === "women" ? { gender } : undefined}
              className="block text-[0.92rem] leading-snug"
            >
              {node.title}
            </Link>
            {colorOption && (
              <p className="mt-1.5 text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
                {colorOption.values[0]}
              </p>
            )}
          </div>
          <span className="shrink-0 text-[0.88rem] tabular-nums">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
        </div>

        {sizeOption && !soldOut && (
          <div className="mt-4 flex flex-wrap gap-2">
            {sizeOption.values.map((value) => {
              const variant = variants.find((v) =>
                v.node.selectedOptions.some(
                  (o) => o.name.toLowerCase() === "size" && o.value === value,
                ),
              )?.node;
              const unavailable = variant ? !variant.availableForSale : true;
              return (
                <button
                  key={value}
                  type="button"
                  disabled={unavailable}
                  onClick={() => setSize(value)}
                  className={cn(
                    "min-w-10 border px-2.5 py-2 text-[0.625rem] tracking-[0.18em] uppercase transition-colors",
                    size === value
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                      : "border-border hover:border-[var(--ink)]",
                    unavailable && "cursor-not-allowed opacity-30 line-through",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        )}

        {!soldOut && (
          <button
            type="button"
            onClick={quickAdd}
            disabled={adding}
            className="mt-4 w-full border border-border py-3 text-[0.625rem] tracking-[0.28em] uppercase transition-colors hover:bg-[var(--ink)] hover:text-[var(--ivory)] disabled:opacity-40"
          >
            {adding ? (
              <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
            ) : size ? (
              "Add to bag"
            ) : (
              "Select size"
            )}
          </button>
        )}
      </div>
    </article>
  );
}
