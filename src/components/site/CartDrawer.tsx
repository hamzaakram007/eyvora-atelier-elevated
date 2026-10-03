import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { fetchProducts, formatPrice } from "@/lib/shopify";
import { isShopifySyncedVariantId } from "@/lib/catalog";
import { orderChannelLabel, SHOPIFY_CHECKOUT_LOCKED } from "@/lib/site";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setOpen,
    isLoading,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  const { data: upsell } = useQuery({
    queryKey: ["products", "upsell"],
    queryFn: () => fetchProducts(4),
    enabled: isOpen,
  });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode ?? "PKR";
  const allSynced = items.length > 0 && items.every((i) => isShopifySyncedVariantId(i.variantId));
  const suggestions =
    upsell?.filter(
      (p) => !items.some((i) => i.product.node.handle === p.node.handle),
    ).slice(0, 2) ?? [];

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-6 py-5">
          <SheetTitle className="text-[0.7rem] font-normal tracking-[0.3em] uppercase">
            Your Bag {totalItems > 0 ? `(${totalItems})` : ""}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
            <p className="font-display text-2xl">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">
              Add a hoodie or pair of trousers to begin.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 border border-border px-6 py-3 text-[0.625rem] tracking-[0.28em] uppercase"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-7">
                {items.map((item) => {
                  const size =
                    item.selectedOptions.find((o) => o.name.toLowerCase() === "size")
                      ?.value ?? item.variantTitle;
                  return (
                    <li key={item.variantId} className="flex gap-4">
                      <div className="h-28 w-22 shrink-0 overflow-hidden bg-[var(--soft-grey)]">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm">{item.product.node.title}</p>
                            <p className="mt-1 text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
                              Size {size}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() => removeItem(item.variantId)}
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={1.2} />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              className="grid h-8 w-8 place-items-center"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" strokeWidth={1.2} />
                            </button>
                            <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              className="grid h-8 w-8 place-items-center"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" strokeWidth={1.2} />
                            </button>
                          </div>
                          <p className="text-sm">
                            {formatPrice(
                              parseFloat(item.price.amount) * item.quantity,
                              item.price.currencyCode,
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {suggestions.length > 0 && (
                <div className="mt-10 border-t border-border pt-8">
                  <p className="eyebrow mb-5">You may also like</p>
                  <ul className="space-y-4">
                    {suggestions.map((p) => (
                      <li key={p.node.id}>
                        <Link
                          to="/product/$handle"
                          params={{ handle: p.node.handle }}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3"
                        >
                          <div className="h-16 w-14 overflow-hidden bg-[var(--soft-grey)]">
                            {p.node.images.edges[0] && (
                              <img
                                src={p.node.images.edges[0].node.url}
                                alt={p.node.title}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm">{p.node.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {formatPrice(
                                p.node.priceRange.minVariantPrice.amount,
                                p.node.priceRange.minVariantPrice.currencyCode,
                              )}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="tracking-[0.16em] uppercase">Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {SHOPIFY_CHECKOUT_LOCKED || !allSynced
                  ? `Shopify checkout unlocks after a paid plan removes the store password. Until then, place your order via ${orderChannelLabel() ?? "contact"}.`
                  : "Shipping and payment methods are confirmed at Shopify checkout."}
              </p>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoading || !getCheckoutUrl()}
                className="mt-5 flex w-full items-center justify-center bg-[var(--ink)] py-4 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : allSynced && !SHOPIFY_CHECKOUT_LOCKED ? (
                  "Checkout"
                ) : getCheckoutUrl() ? (
                  `Order via ${orderChannelLabel()}`
                ) : (
                  "Checkout unavailable"
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 w-full py-3 text-[0.625rem] tracking-[0.28em] uppercase"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
