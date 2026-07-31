import { useState } from "react";
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
}: {
  product: ShopifyProduct;
  index?: number;
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

  const colorOption = node.options?.find((o) =>
    ["color", "colour"].includes(o.name.toLowerCase()),
  );
  const variants = node.variants.edges;
  const firstAvailable = variants.find((v) => v.node.availableForSale)?.node;
  const soldOut = variants.length > 0 && !firstAvailable;
  const price = node.priceRange.minVariantPrice;
  const compareAt = node.compareAtPriceRange?.minVariantPrice;
  const onSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);

  const quickAdd = async () => {
    if (!firstAvailable) return;
    setAdding(true);
    await addItem({
      product,
      variantId: firstAvailable.id,
      variantTitle: firstAvailable.title,
      price: firstAvailable.price,
      quantity: 1,
      selectedOptions: firstAvailable.selectedOptions || [],
    });
    setAdding(false);
    toast.success("Added to your bag", { description: node.title });
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
        className="block overflow-hidden bg-[var(--sand)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {primary && (
            <img
              src={primary}
              alt={images[0]?.node.altText ?? node.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-0"
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
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {soldOut && (
              <span className="bg-background/90 px-2.5 py-1 text-[0.5625rem] tracking-[0.24em] uppercase">
                Sold out
              </span>
            )}
            {onSale && !soldOut && (
              <span className="bg-[var(--ink)] px-2.5 py-1 text-[0.5625rem] tracking-[0.24em] text-[var(--ivory)] uppercase">
                Reduced
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist(node.handle)}
        className="absolute top-4 right-4 grid h-8 w-8 place-items-center bg-background/85 opacity-0 transition-opacity duration-500 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Heart
          className={cn("h-3.5 w-3.5", wishlisted && "fill-current")}
          strokeWidth={1.2}
        />
      </button>

      {!soldOut && (
        <button
          type="button"
          onClick={quickAdd}
          disabled={adding}
          className="absolute right-3 bottom-[7.5rem] left-3 hidden translate-y-2 bg-background/95 py-3 text-[0.625rem] tracking-[0.28em] uppercase opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 lg:block"
        >
          {adding ? (
            <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
          ) : (
            "Quick add"
          )}
        </button>
      )}

      <div className="pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <Link
            to="/product/$handle"
            params={{ handle: node.handle }}
            className="text-[0.9rem] leading-snug"
          >
            {node.title}
          </Link>
          <span className="shrink-0 text-[0.85rem] text-muted-foreground">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
        </div>
        {colorOption && (
          <div className="mt-3 flex items-center gap-2">
            {colorOption.values.slice(0, 5).map((value) => (
              <span
                key={value}
                title={value}
                className="h-2.5 w-2.5 rounded-full border border-border"
                style={{ background: swatch(value) }}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={quickAdd}
          disabled={adding || soldOut}
          className="mt-4 w-full border border-border py-3 text-[0.625rem] tracking-[0.28em] uppercase transition-colors hover:bg-[var(--ink)] hover:text-[var(--ivory)] disabled:opacity-40 lg:hidden"
        >
          {soldOut ? "Sold out" : adding ? "Adding…" : "Add to bag"}
        </button>
      </div>
    </article>
  );
}

function swatch(value: string) {
  const key = value.toLowerCase();
  if (key.includes("black")) return "#151515";
  if (key.includes("ivory") || key.includes("cream")) return "#F0EBE1";
  if (key.includes("white")) return "#FCFCFA";
  if (key.includes("stone") || key.includes("grey") || key.includes("gray"))
    return "#B7B2AB";
  if (key.includes("taupe")) return "#CFC4B6";
  if (key.includes("beige") || key.includes("sand")) return "#E3D9C8";
  if (key.includes("olive")) return "#6B6C55";
  if (key.includes("navy")) return "#232A38";
  return "#C9C3BA";
}
