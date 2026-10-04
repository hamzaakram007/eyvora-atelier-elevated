import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  emailLink,
  whatsappConfigured,
  whatsappLink,
} from "@/lib/site";
import { Faq } from "@/components/home/Faq";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — EYVORA" },
      {
        name: "description",
        content:
          "Contact EYVORA for product questions, sizing help and order support. WhatsApp 0316 1609389 · eyvorapk@gmail.com.",
      },
      { property: "og:title", content: "Contact — EYVORA" },
      { property: "og:url", content: "https://eyvora.pk/contact" },
    ],
    links: [{ rel: "canonical", href: "https://eyvora.pk/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <header className="border-b border-border pb-12">
          <p className="eyebrow">Contact</p>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,5vw,4rem)]">Get in touch</h1>
        </header>

        <div className="grid gap-14 py-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <Reveal>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              Reach EYVORA for product questions, sizing guidance and order help. For purchases,
              use Checkout in your bag — Cash on Delivery or UBL bank transfer. See{" "}
              <Link to="/payments" className="underline underline-offset-2">
                Payment methods
              </Link>{" "}
              for account details, or message us here if you need assistance.
            </p>

            <ul className="mt-12 space-y-8">
              <li className="flex gap-5 border-t border-border pt-6">
                <MessageCircle className="mt-1 h-4 w-4 shrink-0" strokeWidth={1} />
                <div>
                  <p className="text-[0.95rem]">WhatsApp</p>
                  {whatsappConfigured() ? (
                    <>
                      <a
                        href={whatsappLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="rule-link mt-1 inline-block text-sm text-muted-foreground"
                      >
                        {WHATSAPP_DISPLAY}
                      </a>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Tap to chat on WhatsApp
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      WhatsApp number coming soon.
                    </p>
                  )}
                </div>
              </li>
              <li className="flex gap-5 border-t border-border pt-6">
                <Mail className="mt-1 h-4 w-4 shrink-0" strokeWidth={1} />
                <div>
                  <p className="text-[0.95rem]">Email</p>
                  {CONTACT_EMAIL ? (
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="rule-link mt-1 inline-block text-sm text-muted-foreground"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add the official support email once confirmed.
                    </p>
                  )}
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <form
              className="space-y-6 border border-border px-6 py-8 lg:px-8"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem("name") as HTMLInputElement)
                  .value;
                const email = (
                  form.elements.namedItem("email") as HTMLInputElement
                ).value;
                const message = (
                  form.elements.namedItem("message") as HTMLTextAreaElement
                ).value;
                const href = emailLink(
                  `EYVORA contact from ${name}`,
                  `From: ${name} <${email}>\n\n${message}`,
                );
                if (!href) {
                  toast.error("Contact email is not configured yet.");
                  return;
                }
                window.location.href = href;
                toast.success("Opening your email app");
              }}
            >
              <div>
                <label className="eyebrow" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="eyebrow" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="eyebrow" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-3 w-full resize-none border-b border-border bg-transparent py-3 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[var(--ink)] px-8 py-4 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase"
              >
                Send message
              </button>
            </form>
          </Reveal>
        </div>
      </div>
      <Faq />
    </div>
  );
}
