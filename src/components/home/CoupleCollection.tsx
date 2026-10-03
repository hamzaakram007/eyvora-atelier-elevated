import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import couple from "@/assets/products/couple/couple-1.jpg";

export function CoupleCollection() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <Reveal className="relative overflow-hidden bg-[var(--soft-grey)]">
          <img
            src={couple}
            alt="Couple wearing coordinated EYVORA hoodies and trousers"
            loading="lazy"
            width={1400}
            height={1750}
            className="aspect-[4/5] w-full object-cover lg:aspect-[5/4]"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow">Couple Collection</p>
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1.03]">
            Coordinated,
            <br />
            not identical.
          </h2>
          <p className="mt-7 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            Build an outfit from the launch essentials — olive or black hoodie, grey or
            black trousers — and choose each size independently.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>— Olive Green Hoodie + Black Trousers</li>
            <li>— Black Hoodie + Grey Trousers</li>
            <li>— Black Hoodie + Black Trousers</li>
          </ul>
          <Link
            to="/couple"
            className="mt-10 inline-block bg-[var(--ink)] px-9 py-3.5 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase transition-opacity hover:opacity-85"
          >
            Explore outfits
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
