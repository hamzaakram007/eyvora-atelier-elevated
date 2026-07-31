import { Star } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { whatsappLink } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="border-y border-border bg-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
        <Reveal className="mb-14 max-w-xl">
          <p className="eyebrow">09 — In Their Words</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)]">
            Client reviews
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Verified reviews are published here as soon as real clients submit them —
            we never write them ourselves. Photo and video reviews are supported.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Reveal
              key={i}
              delay={i * 100}
              className="border border-dashed border-border bg-background px-8 py-12"
            >
              <div className="flex gap-1 text-muted-foreground/40">
                {Array.from({ length: 5 }).map((__, s) => (
                  <Star key={s} className="h-3.5 w-3.5" strokeWidth={1} />
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground">No reviews yet.</p>
              <p className="mt-2 text-[0.6875rem] tracking-[0.2em] text-muted-foreground/60 uppercase">
                Awaiting verified buyer
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="rule-link text-[0.6875rem] tracking-[0.28em] uppercase"
          >
            Bought from us? Send your review
          </a>
        </Reveal>
      </div>
    </section>
  );
}
