import { Reveal } from "@/components/site/Reveal";
import { whyPoints } from "@/lib/site";

export function WhyEyvora() {
  return (
    <section className="border-t border-border bg-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow">Why EYVORA</p>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.25rem)] leading-[1.03]">
              Quiet confidence
              <br />
              for everyday wear.
            </h2>
            <p className="mt-7 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
              A restrained essentials wardrobe — hoodies and trousers designed to feel
              considered without overstated claims.
            </p>
          </Reveal>

          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {whyPoints.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="border-t border-border pt-6">
                <h3 className="text-[0.95rem] tracking-[0.04em]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
