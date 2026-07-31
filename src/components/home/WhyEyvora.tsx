import { Reveal } from "@/components/site/Reveal";
import { Feather, Ruler, ShieldCheck, Truck, RefreshCw, Gem } from "lucide-react";

const pillars = [
  { icon: Feather, title: "Premium Fabric", note: "Long-staple cotton, spun for weight and drape." },
  { icon: Ruler, title: "Tailored Fit", note: "Patterns graded on real bodies, not blocks." },
  { icon: ShieldCheck, title: "Made to Last", note: "Reinforced seams, pre-shrunk, colour-locked." },
  { icon: Truck, title: "Fast Delivery", note: "Same-day dispatch before 4pm PKT." },
  { icon: RefreshCw, title: "Easy Exchange", note: "Seven days, collected at our cost." },
  { icon: Gem, title: "Small Runs", note: "Limited quantities per colourway. Never restocked twice." },
];

export function WhyEyvora() {
  return (
    <section className="border-t border-border bg-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow">06 — The Standard</p>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.5rem)] leading-[1.03]">
              Why
              <br />
              EYVORA
            </h2>
            <p className="mt-7 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
              We make fewer things, in better cotton, with more time on the pattern
              table. Everything else follows from that.
            </p>
          </Reveal>

          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="border-t border-border pt-6">
                <p.icon className="h-5 w-5 text-[var(--gold)]" strokeWidth={1} />
                <h3 className="mt-5 text-[0.95rem] tracking-[0.05em]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
