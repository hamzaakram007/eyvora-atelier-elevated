import { Reveal } from "@/components/site/Reveal";
import hero from "@/assets/hero.webp";
import couple from "@/assets/couple.webp";
import fabric from "@/assets/fabric.webp";
import about from "@/assets/about.webp";
import men from "@/assets/cat-men-hoodies.webp";
import women from "@/assets/cat-women-hoodies.webp";

const tiles = [men, couple, fabric, women, hero, about];

export function InstagramFeed() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
      <Reveal className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">10 — The Feed</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)]">@eyvora</h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="rule-link text-[0.6875rem] tracking-[0.28em] uppercase"
        >
          Follow
        </a>
      </Reveal>

      <div className="grid grid-cols-3 gap-2 lg:grid-cols-6 lg:gap-3">
        {tiles.map((src, i) => (
          <a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden bg-[var(--sand)]"
          >
            <img
              src={src}
              alt="EYVORA on Instagram"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-[var(--ink)]/0 transition-colors duration-500 group-hover:bg-[var(--ink)]/20" />
          </a>
        ))}
      </div>
    </section>
  );
}
