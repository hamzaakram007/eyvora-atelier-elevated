import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
  BANK_TRANSFER,
  BANK_TRANSFER_DISCOUNT_PERCENT,
  emailLink,
  whatsappConfigured,
  whatsappLink,
} from "@/lib/site";
import { formatPrice } from "@/lib/shopify";

type SuccessSearch = {
  order?: string;
  total?: string;
  currency?: string;
  payment?: "cod" | "bank";
  discount?: string;
};

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search: Record<string, unknown>): SuccessSearch => ({
    order: typeof search.order === "string" ? search.order : undefined,
    total: typeof search.total === "string" ? search.total : undefined,
    currency: typeof search.currency === "string" ? search.currency : "PKR",
    payment:
      search.payment === "bank" || search.payment === "cod"
        ? search.payment
        : undefined,
    discount: typeof search.discount === "string" ? search.discount : "0",
  }),
  head: () => ({
    meta: [
      { title: "Order confirmed — EYVORA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutSuccessPage,
});

function copyText(label: string, value: string) {
  void navigator.clipboard.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => toast.message("Copy manually", { description: value }),
  );
}

function CheckoutSuccessPage() {
  const { order, total, currency, payment, discount } = Route.useSearch();
  const isBank = payment === "bank";
  const amount = total ? parseFloat(total) : NaN;
  const discountPct = discount ? parseInt(discount, 10) : 0;

  const proofHref = whatsappConfigured()
    ? whatsappLink(
        `Hello EYVORA, I have paid by bank transfer.\nOrder number: ${order || "____"}\nAmount: PKR ${
          Number.isFinite(amount) ? Math.round(amount).toLocaleString("en-PK") : "____"
        }\nPayment screenshot attached/following.`,
      )
    : emailLink(
        `EYVORA bank transfer — ${order || "order"}`,
        `Hello EYVORA,\n\nI have paid by bank transfer.\nOrder number: ${order || ""}\nAmount: PKR ${
          Number.isFinite(amount) ? Math.round(amount).toLocaleString("en-PK") : ""
        }\n\nI will attach the payment screenshot.\n`,
      );

  if (!order) {
    return (
      <main className="pt-32 lg:pt-40">
        <div className="mx-auto max-w-xl px-5 py-20 text-center lg:px-10">
          <h1 className="font-display text-4xl">No order found</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            If you just checked out, open the confirmation link from your bag again, or
            contact EYVORA with your phone number.
          </p>
          <Link
            to="/shop"
            search={{}}
            className="mt-8 inline-flex bg-[var(--ink)] px-8 py-4 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-2xl px-5 pb-24 lg:px-10">
        <header className="border-b border-border pb-10">
          <p className="eyebrow">Thank you</p>
          <h1 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)]">
            Order {order} placed
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {isBank
              ? `Bank transfer selected${
                  discountPct > 0 ? ` with ${discountPct}% off` : ""
                }. Transfer the total below, then send your payment proof.`
              : "Cash on Delivery selected. Keep the exact amount ready for the courier. Shipping is free."}
          </p>
        </header>

        <div className="mt-8 space-y-3 border border-border p-6 text-sm">
          <div className="flex justify-between">
            <span className="tracking-[0.14em] uppercase text-muted-foreground">
              Order
            </span>
            <span className="font-medium">{order}</span>
          </div>
          <div className="flex justify-between">
            <span className="tracking-[0.14em] uppercase text-muted-foreground">
              Payment
            </span>
            <span>
              {isBank
                ? `Bank transfer${
                    discountPct > 0 ? ` · ${discountPct}% off` : ""
                  }`
                : "Cash on Delivery"}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
            <span className="tracking-[0.14em] uppercase">Total due</span>
            <span className={isBank ? "text-red-600" : undefined}>
              {Number.isFinite(amount)
                ? formatPrice(amount, currency || "PKR")
                : "—"}
            </span>
          </div>
        </div>

        {isBank && (
          <section className="mt-8 border border-red-600/30 bg-red-50 p-6">
            <h2 className="text-[0.7rem] font-semibold tracking-[0.22em] text-red-800 uppercase">
              Transfer {BANK_TRANSFER_DISCOUNT_PERCENT}% off total to UBL
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-red-900">
              {(
                [
                  ["Bank", BANK_TRANSFER.bankName],
                  ["Account title", BANK_TRANSFER.accountTitle],
                  ["Account number", BANK_TRANSFER.accountNumber],
                  ["IBAN", BANK_TRANSFER.iban],
                ] as const
              ).map(([label, value]) => (
                <li key={label} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] tracking-[0.16em] uppercase opacity-70">
                      {label}
                    </p>
                    <p className="mt-0.5 font-medium">{value}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Copy ${label}`}
                    onClick={() => copyText(label, value)}
                    className="mt-1 text-red-800"
                  >
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.4} />
                  </button>
                </li>
              ))}
            </ul>
            {proofHref && (
              <a
                href={proofHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex w-full items-center justify-center bg-red-600 py-3.5 text-[0.625rem] tracking-[0.24em] text-white uppercase"
              >
                Send payment proof
              </a>
            )}
          </section>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/shop"
            search={{}}
            className="inline-flex bg-[var(--ink)] px-7 py-3.5 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase"
          >
            Continue shopping
          </Link>
          <Link
            to="/contact"
            className="inline-flex border border-border px-7 py-3.5 text-[0.625rem] tracking-[0.28em] uppercase"
          >
            Contact EYVORA
          </Link>
        </div>
      </div>
    </main>
  );
}
