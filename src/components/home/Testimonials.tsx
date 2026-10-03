import { Reveal } from "@/components/site/Reveal";
import { whatsappConfigured, whatsappLink } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="border-y border-border bg-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal className="mb-10 max-w-xl">
          <p className="eyebrow">Testimonials</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.1rem)]">
            Client voices
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            This section stays empty until verified client testimonials are provided. No fabricated
            reviews are published.
          </p>
        </Reveal>

        <Reveal className="border border-dashed border-border bg-background px-8 py-14 text-center">
          <p className="font-display text-2xl">No testimonials yet</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Editable testimonials can be added in the storefront once approved by EYVORA.
          </p>
          {whatsappConfigured() && (
            <a
              href={whatsappLink("Hello EYVORA, I would like to share a review.")}
              target="_blank"
              rel="noreferrer"
              className="rule-link mt-8 inline-block text-[0.6875rem] tracking-[0.28em] uppercase"
            >
              Share a review
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
