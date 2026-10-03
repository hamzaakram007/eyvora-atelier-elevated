import { createFileRoute } from "@tanstack/react-router";
import { AboutStory } from "@/components/home/AboutStory";
import { WhyEyvora } from "@/components/home/WhyEyvora";
import { Reveal } from "@/components/site/Reveal";
import hero from "@/assets/products/hero/hero-mobile.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — EYVORA" },
      {
        name: "description",
        content:
          "EYVORA is a premium clothing brand focused on hoodies, trousers and coordinated everyday outfits.",
      },
      { property: "og:title", content: "About Us — EYVORA" },
      {
        property: "og:description",
        content: "Everyday essentials. Elevated.",
      },
    ],
  }),
  component: About,
});

const sections = [
  {
    title: "Brand Story",
    body: "Share the verified EYVORA origin story here. Until final client copy is provided, this remains an editable placeholder.",
  },
  {
    title: "Design Philosophy",
    body: "Quiet silhouettes, considered proportion, and photography-led presentation. Luxury through restraint rather than excess.",
  },
  {
    title: "Our Approach",
    body: "A focused launch wardrobe — hoodies and trousers that work alone or as coordinated outfits — built to scale as the catalogue grows.",
  },
  {
    title: "EYVORA Identity",
    body: "Warm ivory, deep charcoal, soft grey and stone. Editorial serif headings with a clean modern sans for product information.",
  },
];

function About() {
  return (
    <div>
      <section className="relative flex min-h-[58vh] items-end overflow-hidden">
        <img
          src={hero}
          alt="EYVORA campaign photography"
          className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
        />
        <div className="absolute inset-0 bg-[var(--ink)]/40" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-16 lg:px-10 lg:pb-24">
          <p className="eyebrow text-[var(--ivory)]/60">About Us</p>
          <h1 className="font-display mt-4 max-w-3xl text-[clamp(2.5rem,6vw,5rem)] leading-[1] text-[var(--ivory)]">
            Everyday essentials.
            <br />
            Elevated.
          </h1>
        </div>
      </section>

      <AboutStory />

      <section className="border-y border-border bg-[var(--ivory)]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 md:grid-cols-2">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="border-t border-border pt-6">
                <h2 className="font-display text-3xl">{s.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyEyvora />
    </div>
  );
}
