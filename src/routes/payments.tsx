import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, Building2, Copy, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import {
  BANK_TRANSFER,
  BANK_TRANSFER_DISCOUNT_CODE,
  BANK_TRANSFER_DISCOUNT_PERCENT,
  CONTACT_EMAIL,
  PAYMENT_METHODS,
  RECOMMENDED_PAYMENT_OPTIONS,
  emailLink,
  whatsappConfigured,
  whatsappLink,
} from "@/lib/site";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment Methods — EYVORA" },
      {
        name: "description",
        content:
          "Pay EYVORA with free shipping and tax-free prices. Cash on Delivery or UBL bank transfer with 7% off (code BANK7).",
      },
      { property: "og:title", content: "Payment Methods — EYVORA" },
      { property: "og:url", content: "https://eyvora.pk/payments" },
    ],
    links: [{ rel: "canonical", href: "https://eyvora.pk/payments" }],
  }),
  component: PaymentsPage,
});

function copyText(label: string, value: string) {
  void navigator.clipboard.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => toast.message("Copy manually", { description: value }),
  );
}

function PaymentsPage() {
  const proofLink = whatsappConfigured()
    ? whatsappLink(
        "Hello EYVORA, I have paid by bank transfer. Order number: ____. Payment screenshot attached/following.",
      )
    : emailLink(
        "EYVORA bank transfer payment proof",
        `Hello EYVORA,\n\nI have paid by bank transfer.\nOrder number: \nAccount title used: ${BANK_TRANSFER.accountTitle}\nAmount: PKR \n\nI will attach the payment screenshot.\n`,
      );

  return (
    <main className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <header className="border-b border-border pb-12">
          <p className="eyebrow">Payments</p>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,5vw,4rem)]">
            How to pay
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Free shipping and tax-free prices on every order. Pay by Cash on Delivery, or choose
            UBL bank transfer and save {BANK_TRANSFER_DISCOUNT_PERCENT}% with code{" "}
            <strong className="text-foreground">{BANK_TRANSFER_DISCOUNT_CODE}</strong>.
          </p>
        </header>

        <section className="grid gap-6 py-14 md:grid-cols-2">
          {PAYMENT_METHODS.map((method, i) => (
            <Reveal key={method.id} delay={i * 80} className="border border-border p-7 lg:p-9">
              <div className="flex items-start gap-4">
                {method.id === "cod" ? (
                  <Banknote className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.2} />
                ) : (
                  <Building2 className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.2} />
                )}
                <div>
                  <h2 className="font-display text-2xl">{method.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {method.summary}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {method.details}
                  </p>
                  {method.id === "bank" ? (
                    <button
                      type="button"
                      onClick={() =>
                        copyText("Discount code", BANK_TRANSFER_DISCOUNT_CODE)
                      }
                      className="mt-5 inline-flex items-center gap-2 border border-border px-3 py-2 text-[0.625rem] tracking-[0.16em] uppercase"
                    >
                      <Copy className="h-3 w-3" strokeWidth={1.4} />
                      Copy code {BANK_TRANSFER_DISCOUNT_CODE}
                    </button>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        <Reveal className="border border-border bg-[var(--soft-grey)] p-7 lg:p-10">
          <p className="eyebrow">Manual payment — bank account</p>
          <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">
            United Bank Limited (UBL)
          </h2>
          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            {(
              [
                ["Bank Name", BANK_TRANSFER.bankName],
                ["Account Title", BANK_TRANSFER.accountTitle],
                ["Account Number", BANK_TRANSFER.accountNumber],
                ["IBAN", BANK_TRANSFER.iban],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="border-t border-border pt-4">
                <dt className="text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {label}
                </dt>
                <dd className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[0.95rem] break-all">{value}</span>
                  <button
                    type="button"
                    onClick={() => copyText(label, value)}
                    className="inline-flex shrink-0 items-center gap-1.5 border border-border px-2.5 py-1.5 text-[0.625rem] tracking-[0.14em] uppercase"
                    aria-label={`Copy ${label}`}
                  >
                    <Copy className="h-3 w-3" strokeWidth={1.4} />
                    Copy
                  </button>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Apply code <strong className="text-foreground">{BANK_TRANSFER_DISCOUNT_CODE}</strong>{" "}
            at checkout for {BANK_TRANSFER_DISCOUNT_PERCENT}% off, transfer the discounted total,
            then send your <strong className="text-foreground">order number</strong> and payment
            screenshot so we can mark the order paid and dispatch.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {proofLink ? (
              <a
                href={proofLink}
                target="_blank"
                rel="noreferrer"
                className="bg-[var(--ink)] px-7 py-3.5 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase"
              >
                Send payment proof
              </a>
            ) : null}
            <Link
              to="/shop"
              search={{}}
              className="border border-border px-7 py-3.5 text-[0.625rem] tracking-[0.28em] uppercase"
            >
              Continue shopping
            </Link>
          </div>
          {CONTACT_EMAIL ? (
            <p className="mt-5 text-xs text-muted-foreground">
              Or email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
            </p>
          ) : null}
        </Reveal>

        <section className="py-16 lg:py-20">
          <Reveal>
            <div className="flex items-start gap-4">
              <CreditCard className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.2} />
              <div>
                <p className="eyebrow">Other methods you can add</p>
                <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">
                  Recommended for Pakistan
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  COD and bank transfer are live on this page. These extra options need a Shopify
                  payment app or gateway account — useful when you want cards or wallets at
                  checkout.
                </p>
              </div>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {RECOMMENDED_PAYMENT_OPTIONS.map((option, i) => (
              <Reveal
                key={option.title}
                delay={i * 70}
                className="border border-border p-6"
              >
                <h3 className="text-[0.95rem]">{option.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {option.note}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
