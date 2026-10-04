import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCartStore,
  type CheckoutPaymentMethod,
} from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";
import { isShopifySyncedVariantId } from "@/lib/catalog";
import {
  BANK_TRANSFER_DISCOUNT_PERCENT,
  normalizePakistanPhone,
  orderChannelLabel,
  orderLink,
} from "@/lib/site";
import { BankTransferDetails } from "@/components/site/BankTransferDetails";
import { cn } from "@/lib/utils";

type CheckoutSearch = {
  payment?: CheckoutPaymentMethod;
};

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => ({
    payment:
      search.payment === "bank" || search.payment === "cod"
        ? search.payment
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Checkout — EYVORA" },
      {
        name: "description",
        content:
          "Complete your EYVORA order with Cash on Delivery or UBL bank transfer (7% off). Free shipping across Pakistan.",
      },
      { property: "og:title", content: "Checkout — EYVORA" },
      { property: "og:url", content: "https://eyvora.pk/checkout" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://eyvora.pk/checkout" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { payment: paymentFromSearch } = Route.useSearch();
  const { items, note, setNote, clearCart, setOpen } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>(
    paymentFromSearch || "cod",
  );
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (paymentFromSearch) setPaymentMethod(paymentFromSearch);
  }, [paymentFromSearch]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
        0,
      ),
    [items],
  );
  const currency = items[0]?.price.currencyCode ?? "PKR";
  const bankDiscount = (subtotal * BANK_TRANSFER_DISCOUNT_PERCENT) / 100;
  const payable =
    paymentMethod === "bank" ? Math.max(0, subtotal - bankDiscount) : subtotal;
  const allSynced =
    items.length > 0 && items.every((i) => isShopifySyncedVariantId(i.variantId));

  const placeWhatsAppOrder = () => {
    const summary = items
      .map((i) => {
        const size =
          i.selectedOptions.find((o) => o.name.toLowerCase() === "size")
            ?.value ?? i.variantTitle;
        const lineTotal = parseFloat(i.price.amount) * i.quantity;
        return `• ${i.product.node.title} — Size ${size} × ${i.quantity} (PKR ${Math.round(lineTotal).toLocaleString("en-PK")})`;
      })
      .join("\n");
    const href = orderLink(
      `Hello EYVORA, I would like to order:\n${summary}\n\nPayment: ${
        paymentMethod === "bank"
          ? `Bank transfer (${BANK_TRANSFER_DISCOUNT_PERCENT}% off)`
          : "Cash on Delivery"
      }\nSubtotal: PKR ${Math.round(subtotal).toLocaleString("en-PK")}\nTotal: PKR ${Math.round(payable).toLocaleString("en-PK")}\n\nName: ${fullName}\nPhone: ${phone}\nCity: ${city}\nAddress: ${address1}`,
    );
    if (href) window.location.assign(href);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      toast.message("Your bag is empty");
      return;
    }

    const normalizedPhone = normalizePakistanPhone(phone);
    if (!normalizedPhone) {
      toast.error("Enter a valid Pakistan mobile number", {
        description: "Example: 03XX XXXXXXX",
      });
      return;
    }

    if (!allSynced) {
      placeWhatsAppOrder();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          customer: {
            fullName: fullName.trim(),
            phone: normalizedPhone,
            email: email.trim(),
            address1: address1.trim(),
            address2: address2.trim(),
            city: city.trim(),
            province: province.trim(),
            postalCode: postalCode.trim(),
            note: note.trim(),
          },
          lines: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            title: item.product.node.title,
          })),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        orderName?: string;
        total?: string;
        currencyCode?: string;
        paymentMethod?: CheckoutPaymentMethod;
        discountPercent?: number;
      };

      if (!res.ok || !data.ok || !data.orderName) {
        toast.error("Could not place order", {
          description: data.error || "Please try again in a moment.",
        });
        return;
      }

      clearCart();
      void navigate({
        to: "/checkout/success",
        search: {
          order: data.orderName,
          total: data.total || String(payable),
          currency: data.currencyCode || currency,
          payment: data.paymentMethod || paymentMethod,
          discount: String(data.discountPercent ?? 0),
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Could not place order", {
        description: "Check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-32 lg:pt-40">
        <div className="mx-auto max-w-xl px-5 py-20 text-center lg:px-10">
          <p className="eyebrow">Checkout</p>
          <h1 className="font-display mt-4 text-4xl">Your bag is empty</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Add a hoodie or trousers, then return to checkout.
          </p>
          <Link
            to="/shop"
            search={{}}
            className="mt-8 inline-flex bg-[var(--ink)] px-8 py-4 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase"
          >
            Shop all
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1200px] px-5 pb-24 lg:px-10">
        <header className="border-b border-border pb-10">
          <p className="eyebrow">Checkout</p>
          <h1 className="font-display mt-4 text-[clamp(2rem,4vw,3.5rem)]">
            Place your order
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Free shipping · Tax-free prices. Switch payment below — the total updates
            instantly. Bank transfer includes {BANK_TRANSFER_DISCOUNT_PERCENT}% off.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
        >
          <div className="space-y-8">
            <section>
              <h2 className="text-[0.7rem] tracking-[0.28em] uppercase">
                Delivery details
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2 block">
                  <span className="text-xs text-muted-foreground">Full name *</span>
                  <input
                    required
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">Phone *</span>
                  <input
                    required
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX XXXXXXX"
                    className="mt-1.5 w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">Email (optional)</span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                    autoComplete="email"
                  />
                </label>
                <label className="sm:col-span-2 block">
                  <span className="text-xs text-muted-foreground">Address *</span>
                  <input
                    required
                    name="address1"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="mt-1.5 w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                    autoComplete="address-line1"
                  />
                </label>
                <label className="sm:col-span-2 block">
                  <span className="text-xs text-muted-foreground">
                    Apartment / landmark (optional)
                  </span>
                  <input
                    name="address2"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="mt-1.5 w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                    autoComplete="address-line2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">City *</span>
                  <input
                    required
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1.5 w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                    autoComplete="address-level2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">Province (optional)</span>
                  <input
                    name="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="mt-1.5 w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                    autoComplete="address-level1"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">
                    Postal code (optional)
                  </span>
                  <input
                    name="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="mt-1.5 w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                    autoComplete="postal-code"
                  />
                </label>
                <label className="sm:col-span-2 block">
                  <span className="text-xs text-muted-foreground">Order note (optional)</span>
                  <textarea
                    name="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full resize-y border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-[0.7rem] tracking-[0.28em] uppercase">
                Payment method
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={cn(
                    "border px-4 py-4 text-left text-[0.625rem] tracking-[0.14em] uppercase transition-colors",
                    paymentMethod === "cod"
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                      : "border-border hover:border-foreground",
                  )}
                >
                  Cash on Delivery
                  <span className="mt-2 block text-[0.7rem] tracking-normal normal-case opacity-80">
                    Full price · pay courier
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={cn(
                    "border px-4 py-4 text-left text-[0.625rem] tracking-[0.14em] uppercase transition-colors",
                    paymentMethod === "bank"
                      ? "border-red-600 bg-red-50 text-[var(--ink)]"
                      : "border-border hover:border-red-600",
                  )}
                >
                  Bank transfer
                  <span className="mt-2 block text-[0.75rem] font-semibold tracking-[0.16em] text-red-600">
                    {BANK_TRANSFER_DISCOUNT_PERCENT}% OFF
                  </span>
                </button>
              </div>

              {paymentMethod === "bank" && (
                <BankTransferDetails
                  className="mt-4"
                  amountLabel={formatPrice(payable, currency)}
                  note={`Transfer ${formatPrice(payable, currency)} after you place this order, then send your order number and payment screenshot to EYVORA.`}
                />
              )}
            </section>
          </div>

          <aside className="h-fit border border-border p-6 lg:sticky lg:top-28 lg:p-8">
            <h2 className="text-[0.7rem] tracking-[0.28em] uppercase">Order summary</h2>
            <ul className="mt-5 space-y-4 border-b border-border pb-5">
              {items.map((item) => {
                const size =
                  item.selectedOptions.find((o) => o.name.toLowerCase() === "size")
                    ?.value ?? item.variantTitle;
                return (
                  <li key={item.variantId} className="flex justify-between gap-4 text-sm">
                    <div>
                      <p>{item.product.node.title}</p>
                      <p className="mt-1 text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
                        Size {size} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0">
                      {formatPrice(
                        parseFloat(item.price.amount) * item.quantity,
                        item.price.currencyCode,
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="tracking-[0.14em] uppercase">Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              {paymentMethod === "bank" && (
                <div className="flex justify-between font-semibold text-red-600">
                  <span className="tracking-[0.12em] uppercase">
                    {BANK_TRANSFER_DISCOUNT_PERCENT}% OFF · Bank
                  </span>
                  <span>-{formatPrice(bankDiscount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="tracking-[0.14em] uppercase">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
                <span className="tracking-[0.14em] uppercase">Total</span>
                <span className={cn(paymentMethod === "bank" && "text-red-600")}>
                  {formatPrice(payable, currency)}
                </span>
              </div>
            </div>

            {paymentMethod === "bank" && (
              <BankTransferDetails
                className="mt-5"
                compact
                amountLabel={formatPrice(payable, currency)}
              />
            )}

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "mt-6 flex w-full items-center justify-center py-4 text-[0.625rem] tracking-[0.28em] uppercase disabled:opacity-40",
                paymentMethod === "bank"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-[var(--ink)] text-[var(--ivory)]",
              )}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : allSynced ? (
                paymentMethod === "bank" ? (
                  <span>
                    Place order · {BANK_TRANSFER_DISCOUNT_PERCENT}% OFF
                  </span>
                ) : (
                  "Place order · Cash on Delivery"
                )
              ) : (
                `Continue via ${orderChannelLabel() ?? "WhatsApp"}`
              )}
            </button>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {allSynced
                ? "Your order is created in Shopify as payment pending. You can switch COD ↔ bank above and the total updates before you place the order."
                : "Native checkout sync is pending for some items — we will open WhatsApp/email with your order details."}
            </p>

            <Link
              to="/shop"
              search={{}}
              className="mt-4 inline-block text-[0.625rem] tracking-[0.22em] uppercase underline underline-offset-4"
            >
              Continue shopping
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}
