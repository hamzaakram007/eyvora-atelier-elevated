import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import couple from "@/assets/couple.jpg";

export function CoupleCollection() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.45fr_1fr] lg:gap-20">
        <Reveal className="relative overflow-hidden">
          <img
            src={couple}
            alt="A couple wearing matching EYVORA hoodies"
            loading="lazy"
            width={1600}
            height={1104}
            className="aspect-[4/3] w-full object-cover"
          />
        </Reveal>
        <Reveal delay={140}>
          <p className="eyebrow">05 — Two Of A Kind</p>
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.5rem)] leading-[1.03]">
            The Couple
            <br />
            Collection
          </h2>
          <p className="mt-7 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            Matching hoodies and trousers cut in the same dye lot, sized separately
            for how each of you actually wears them. Same tone. Different fit. No
            compromise.
          </p>
          <ul className="mt-9 space-y-3 text-sm text-muted-foreground">
            <li>— Paired sizing on a single order</li>
            <li>— Identical garment-dye batch</li>
            <li>— Gift packaging on request</li>
          </ul>
          <Link
            to="/shop"
            search={{ collection: "couple" }}
            className="mt-11 inline-block bg-[var(--ink)] px-10 py-4 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase transition-opacity hover:opacity-85"
          >
            Shop Together
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
