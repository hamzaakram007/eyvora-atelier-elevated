import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { whatsappConfigured, whatsappLink } from "@/lib/site";
import visitImg from "@/assets/products/couple/couple-4.jpg";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit Us — EYVORA" },
      {
        name: "description",
        content:
          "Visit EYVORA studio details will appear here once the client confirms locations and hours.",
      },
      { property: "og:title", content: "Visit Us — EYVORA" },
    ],
  }),
  component: Visit,
});

function Visit() {
  return (
    <div className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <header className="border-b border-border pb-12">
          <p className="eyebrow">Visit Us</p>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,5vw,4rem)]">Studios</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Studio addresses, hours and appointment details remain placeholders until confirmed by
            EYVORA. No invented locations are published.
          </p>
        </header>

        <div className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <img
              src={visitImg}
              alt="EYVORA product photography"
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
          </Reveal>
          <Reveal delay={120} className="border border-dashed border-border px-8 py-12">
            <p className="font-display text-3xl">Location coming soon</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Add the official studio address, map embed and visiting hours here when available.
            </p>
            {whatsappConfigured() && (
              <a
                href={whatsappLink("Hello EYVORA, I would like to book a visit.")}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block bg-[var(--ink)] px-8 py-4 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase"
              >
                Enquire on WhatsApp
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
