import { useEffect, useState } from "react";
import { Loader2, Minus, Plus, X, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

const FREE_SHIPPING_THRESHOLD = 15000;

export function CartDrawer() {
  const {
    items,
    isOpen,
    setOpen,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
    note,
    setNote,
  } = useCartStore();
  const [coupon, setCoupon] = useState("");

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode ?? "PKR";
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

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
              Pieces you add will rest here, quietly.
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-6 py-4">
              <p className="text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase">
                {remaining > 0
                  ? `${formatPrice(remaining, currency)} away from complimentary delivery`
                  : "Complimentary delivery unlocked"}
              </p>
              <div className="mt-3 h-px w-full bg-border">
                <div
                  className="h-px bg-[var(--gold)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-7">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-4">
                    <div className="h-28 w-22 shrink-0 overflow-hidden bg-[var(--sand)]">
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
                        <p className="truncate text-sm">{item.product.node.title}</p>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={1.2} />
                        </button>
                      </div>
                      <p className="mt-1 text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                        {item.selectedOptions.map((o) => o.value).join(" / ")}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 border border-border px-2 py-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" strokeWidth={1.4} />
                          </button>
                          <span className="w-5 text-center text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" strokeWidth={1.4} />
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
                ))}
              </ul>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3 border-b border-border pb-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Promo code"
                    className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                  <span className="text-[0.625rem] tracking-[0.24em] text-muted-foreground uppercase">
                    Apply at checkout
                  </span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Add a gift note"
                  className="w-full resize-none border-b border-border bg-transparent pb-2 text-sm placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-5 border-t border-border px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="text-[0.6875rem] tracking-[0.24em] text-muted-foreground uppercase">
                  Subtotal
                </span>
                <span className="font-display text-xl">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <p className="text-[0.6875rem] text-muted-foreground">
                Taxes and shipping calculated at checkout. Cash on delivery available
                nationwide.
              </p>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoading || isSyncing}
                className="group flex w-full items-center justify-center gap-3 bg-[var(--ink)] py-4 text-[0.6875rem] tracking-[0.3em] text-[var(--ivory)] uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Proceed to checkout
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.4}
                    />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
