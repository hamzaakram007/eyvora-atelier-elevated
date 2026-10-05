import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  useCartStore,
  type CheckoutPaymentMethod,
} from "@/stores/cartStore";
import { fetchProducts, formatPrice } from "@/lib/shopify";
import { isShopifySyncedVariantId } from "@/lib/catalog";
import {
  BANK_TRANSFER_DISCOUNT_PERCENT,
  orderChannelLabel,
  orderLink,
  SHOPIFY_CHECKOUT_LOCKED,
} from "@/lib/site";
import { BankTransferDetails } from "@/components/site/BankTransferDetails";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const navigate = useNavigate();
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
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("cod");

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

  const bankDiscount = (subtotal * BANK_TRANSFER_DISCOUNT_PERCENT) / 100;
  const payable =
    paymentMethod === "bank" ? Math.max(0, subtotal - bankDiscount) : subtotal;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setOpen(false);

    // Synced catalogue → headless checkout with live COD/Bank totals.
    // Unsynced / contact-only bag → WhatsApp/email order link.
    if (allSynced && !SHOPIFY_CHECKOUT_LOCKED) {
      void navigate({
        to: "/checkout",
        search: { payment: paymentMethod },
      });
      return;
    }

    const fallback = getCheckoutUrl();
    if (fallback) {
      window.location.assign(fallback);
      return;
    }

    const summary = items
      .map((i) => {
        const size =
          i.selectedOptions.find((o) => o.name.toLowerCase() === "size")
            ?.value ?? i.variantTitle;
        return `• ${i.product.node.title} — Size ${size} × ${i.quantity}`;
      })
      .join("\n");
    const href = orderLink(
      `Hello EYVORA, I would like to order:\n${summary}\n\nPayment: ${
        paymentMethod === "bank"
          ? `Bank transfer (${BANK_TRANSFER_DISCOUNT_PERCENT}% off)`
          : "Cash on Delivery"
      }\nTotal: PKR ${Math.round(payable).toLocaleString("en-PK")}`,
    );
    if (href) window.location.assign(href);
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
              <p className="text-[0.625rem] tracking-[0.22em] uppercase text-muted-foreground">
                Payment method
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={cn(
                    "border px-3 py-3 text-left text-[0.625rem] leading-snug tracking-[0.12em] uppercase transition-colors",
                    paymentMethod === "cod"
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                      : "border-border hover:border-foreground",
                  )}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={cn(
                    "relative border px-3 py-3 text-left text-[0.625rem] leading-snug tracking-[0.12em] uppercase transition-colors",
                    paymentMethod === "bank"
                      ? "border-emerald-700 bg-emerald-50 text-[var(--ink)]"
                      : "border-border hover:border-emerald-700",
                  )}
                >
                  <span className="block">Bank transfer</span>
                  <span className="mt-1.5 inline-block text-[0.7rem] font-semibold tracking-[0.18em] text-emerald-700">
                    {BANK_TRANSFER_DISCOUNT_PERCENT}% OFF
                  </span>
                </button>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="tracking-[0.16em] uppercase">Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                {paymentMethod === "bank" && (
                  <div className="flex items-center justify-between font-semibold text-emerald-700">
                    <span className="tracking-[0.12em] uppercase">
                      {BANK_TRANSFER_DISCOUNT_PERCENT}% OFF · Bank transfer
                    </span>
                    <span>-{formatPrice(bankDiscount, currency)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="tracking-[0.16em] uppercase">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="tracking-[0.16em] uppercase">Total</span>
                  <span className={cn(paymentMethod === "bank" && "text-emerald-700")}>
                    {formatPrice(payable, currency)}
                  </span>
                </div>
              </div>

              {paymentMethod === "bank" && (
                <BankTransferDetails
                  className="mt-3"
                  compact
                  amountLabel={formatPrice(payable, currency)}
                  note={`Transfer this amount after checkout. No discount code needed — ${BANK_TRANSFER_DISCOUNT_PERCENT}% off is already in your total. Send order number + payment screenshot to EYVORA.`}
                />
              )}

              {paymentMethod !== "bank" && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {allSynced && !SHOPIFY_CHECKOUT_LOCKED
                    ? "Free shipping · tax-free prices. Cash on Delivery is full price. Switch to Bank transfer above and UBL account details appear with 7% off. "
                    : `Native checkout is syncing. You can still place the order via ${orderChannelLabel() ?? "contact"}. `}
                  <Link
                    to="/payments"
                    onClick={() => setOpen(false)}
                    className="underline underline-offset-2"
                  >
                    Payment details
                  </Link>
                </p>
              )}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoading || items.length === 0}
                className={cn(
                  "mt-5 flex min-h-14 w-full items-center justify-center py-4 text-[0.7rem] font-bold tracking-[0.2em] uppercase disabled:opacity-40",
                  paymentMethod === "bank"
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "bg-[var(--ink)] text-[var(--ivory)]",
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : allSynced && !SHOPIFY_CHECKOUT_LOCKED ? (
                  paymentMethod === "bank" ? (
                    <span>
                      Checkout ·{" "}
                      <span className="font-semibold">{BANK_TRANSFER_DISCOUNT_PERCENT}% OFF</span>
                    </span>
                  ) : (
                    "Checkout · Cash on Delivery"
                  )
                ) : getCheckoutUrl() || orderChannelLabel() ? (
                  `Order via ${orderChannelLabel() ?? "contact"}`
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
