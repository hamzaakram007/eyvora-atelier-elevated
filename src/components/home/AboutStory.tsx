import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import about from "@/assets/about.jpg";

export function AboutStory() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow">08 — The House</p>
          <h2 className="font-display mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]">
            Built quietly,
            <br />
            in Pakistan.
          </h2>
          <div className="mt-10 max-w-lg space-y-6 text-[0.95rem] leading-[1.85] text-muted-foreground">
            <p>
              EYVORA began with a single frustration: everyday clothing that looked
              considered for a week, then gave up. We started with one hoodie, one
              trouser, and a refusal to cut corners on cotton.
            </p>
            <p>
              Everything is developed with a small atelier we visit weekly — pattern,
              wash, weight and finish argued over until the piece feels inevitable.
              We release in limited runs because that is the only honest way to hold
              this standard.
            </p>
          </div>
          <Link
            to="/about"
            className="rule-link mt-11 inline-block text-[0.6875rem] tracking-[0.3em] uppercase"
          >
            Read the full story
          </Link>
        </Reveal>
        <Reveal delay={140}>
          <img
            src={about}
            alt="EYVORA atelier with garment rails and pattern paper"
            loading="lazy"
            width={1408}
            height={1600}
            className="aspect-[4/5] w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
