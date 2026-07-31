import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, Clock } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { whatsappLink } from "@/lib/site";
import { Faq } from "@/components/home/Faq";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EYVORA — Client Care & Styling Support" },
      {
        name: "description",
        content:
          "Reach the EYVORA client care team for sizing advice, order updates, exchanges and styling support. WhatsApp, email or the form.",
      },
      { property: "og:title", content: "Contact EYVORA" },
      {
        property: "og:description",
        content: "Sizing advice, order updates and styling support from our client care team.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <header className="border-b border-border pb-12">
          <p className="eyebrow">Client Care</p>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,5vw,4rem)]">Contact us</h1>
        </header>

        <div className="grid gap-14 py-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <Reveal>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              Our styling desk answers within a few hours, seven days a week. For the
              fastest response on sizing and order tracking, message us on WhatsApp.
            </p>

            <ul className="mt-12 space-y-8">
              <li className="flex gap-5 border-t border-border pt-6">
                <MessageCircle className="mt-1 h-4 w-4 shrink-0" strokeWidth={1} />
                <div>
                  <p className="text-[0.95rem]">WhatsApp</p>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="rule-link mt-1 inline-block text-sm text-muted-foreground"
                  >
                    +92 300 1234567
                  </a>
                </div>
              </li>
              <li className="flex gap-5 border-t border-border pt-6">
                <Mail className="mt-1 h-4 w-4 shrink-0" strokeWidth={1} />
                <div>
                  <p className="text-[0.95rem]">Email</p>
                  <a
                    href="mailto:care@eyvora.com"
                    className="rule-link mt-1 inline-block text-sm text-muted-foreground"
                  >
                    care@eyvora.com
                  </a>
                </div>
              </li>
              <li className="flex gap-5 border-t border-border pt-6">
                <Phone className="mt-1 h-4 w-4 shrink-0" strokeWidth={1} />
                <div>
                  <p className="text-[0.95rem]">Phone</p>
                  <p className="mt-1 text-sm text-muted-foreground">+92 300 1234567</p>
                </div>
              </li>
              <li className="flex gap-5 border-t border-border pt-6">
                <Clock className="mt-1 h-4 w-4 shrink-0" strokeWidth={1} />
                <div>
                  <p className="text-[0.95rem]">Hours</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Monday – Sunday, 10:00 – 20:00 PKT
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Message sent", {
                  description: "Our client care team will reply shortly.",
                });
                (e.target as HTMLFormElement).reset();
              }}
              className="space-y-7 border border-border px-6 py-10 lg:px-10 lg:py-12"
            >
              <Field label="Full name" name="name" />
              <Field label="Email" name="email" type="email" />
              <Field label="Order number (optional)" name="order" required={false} />
              <div>
                <label
                  htmlFor="message"
                  className="eyebrow mb-3 block"
                >
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full border-b border-border bg-transparent pb-3 text-sm outline-none focus:border-foreground"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--ink)] px-8 py-4 text-[0.625rem] tracking-[0.32em] text-[var(--ivory)] uppercase transition-opacity hover:opacity-85"
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

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-3 block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-border bg-transparent pb-3 text-sm outline-none focus:border-foreground"
      />
    </div>
  );
}
