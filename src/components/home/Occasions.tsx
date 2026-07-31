import { Link } from "@tanstack/react-router";
import { occasions } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";

export function Occasions() {
  return (
    <section className="border-y border-border bg-[var(--ink)] text-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
        <Reveal className="mb-14 max-w-xl">
          <p className="eyebrow text-[var(--ivory)]/45">04 — Dress The Day</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)]">
            Shop by occasion
          </h2>
        </Reveal>

        <ul className="divide-y divide-[var(--ivory)]/12 border-y border-[var(--ivory)]/12">
          {occasions.map((occ, i) => (
            <Reveal as="li" key={occ.title} delay={i * 60}>
              <Link
                to="/shop"
                search={{ occasion: occ.title.toLowerCase() }}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-6 lg:py-8"
              >
                <span className="text-[0.625rem] tracking-[0.24em] text-[var(--ivory)]/35">
                  0{i + 1}
                </span>
                <span className="min-w-0">
                  <span className="font-display block text-[clamp(1.5rem,3.4vw,2.75rem)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
                    {occ.title}
                  </span>
                  <span className="mt-1 block text-[0.8rem] text-[var(--ivory)]/45">
                    {occ.note}
                  </span>
                </span>
                <span className="text-[0.5625rem] tracking-[0.3em] uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Explore →
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
