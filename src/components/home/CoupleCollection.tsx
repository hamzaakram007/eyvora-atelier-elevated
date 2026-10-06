import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { publicVariantBase } from "@/lib/image-variants";
import { PRODUCT_SALE_PERCENT } from "@/lib/pricing";

const couple = publicVariantBase("couple/contrast/olive-black-grey");

export function CoupleCollection() {
  return (
    <section className="content-auto mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <Reveal className="relative overflow-hidden bg-[var(--soft-grey)]">
          <img
            src={couple.gallery}
            srcSet={couple.srcSet}
            alt="Couple contrast look — olive and black EYVORA hoodies with grey and black trousers"
            loading="lazy"
            decoding="async"
            width={1200}
            height={1500}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="aspect-[4/5] w-full object-cover lg:aspect-[5/4]"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow">Couple Collection</p>
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1.03]">
            Contrast,
            <br />
            not identical.
          </h2>
          <p className="mt-7 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            Signature couple looks — olive with black, black with grey. Matching colours or
            mix &amp; match, with independent sizes for each person. Storewide {PRODUCT_SALE_PERCENT}% off
            applies to every piece.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>— Contrast hoodies (Olive + Black)</li>
            <li>— Contrast trousers (Grey + Black)</li>
            <li>— Independent sizes for Person 1 &amp; Person 2</li>
          </ul>
          <Link
            to="/couple"
            className="mt-10 inline-flex min-h-13 items-center justify-center bg-[var(--ink)] px-12 py-4 text-[0.75rem] font-bold tracking-[0.2em] text-[var(--ivory)] uppercase transition-opacity hover:opacity-90"
          >
            Build couple order
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
