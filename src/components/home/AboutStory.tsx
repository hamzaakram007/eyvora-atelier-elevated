import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { publicVariantBase } from "@/lib/image-variants";

const about = publicVariantBase("couple/couple-3");

export function AboutStory() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow">About EYVORA</p>
          <h2 className="font-display mt-5 text-[clamp(2.1rem,4.5vw,3.6rem)] leading-[1.02]">
            A quieter take
            <br />
            on everyday dress.
          </h2>
          <div className="mt-10 max-w-lg space-y-6 text-[0.95rem] leading-[1.85] text-muted-foreground">
            <p>
              EYVORA is a premium clothing brand focused on hoodies, trousers and
              coordinated outfits. The launch collection keeps thewardrobe small and
              intentional.
            </p>
            <p>
              Brand story, design philosophy and atelier details remain editable placeholders
              until the client confirms final copy. Nothing here invents history or unverified
              materials claims.
            </p>
          </div>
          <Link
            to="/about"
            className="rule-link mt-11 inline-block text-[0.6875rem] tracking-[0.3em] uppercase"
          >
            About us
          </Link>
        </Reveal>
        <Reveal delay={140}>
          <img
            src={about.gallery}
            srcSet={about.srcSet}
            alt="EYVORA essentials campaign imagery"
            loading="lazy"
            width={1400}
            height={1750}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="aspect-[4/5] w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
