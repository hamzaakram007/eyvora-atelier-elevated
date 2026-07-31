import { createFileRoute } from "@tanstack/react-router";
import { AboutStory } from "@/components/home/AboutStory";
import { WhyEyvora } from "@/components/home/WhyEyvora";
import { FabricExperience } from "@/components/home/FabricExperience";
import { Reveal } from "@/components/site/Reveal";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EYVORA — Premium Cotton, Made in Small Runs" },
      {
        name: "description",
        content:
          "EYVORA makes fewer things in better cotton. Read how our hoodies and trousers are developed with a small Pakistani atelier.",
      },
      { property: "og:title", content: "About EYVORA" },
      {
        property: "og:description",
        content: "Fewer things, better cotton, more time on the pattern table.",
      },
    ],
  }),
  component: About,
});

const timeline = [
  { year: "2021", title: "One hoodie", note: "A single heavyweight prototype, made for ourselves." },
  { year: "2023", title: "The atelier", note: "A direct partnership with a small cutting house." },
  { year: "2024", title: "Trousers", note: "The tailored straight leg completes the wardrobe." },
  { year: "2026", title: "Limited runs", note: "Colourways released in fixed quantities only." },
];

function About() {
  return (
    <div>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <img
          src={hero}
          alt="EYVORA campaign photography"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[var(--ink)]/45" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-16 lg:px-10 lg:pb-24">
          <p className="eyebrow text-[var(--ivory)]/60">The House</p>
          <h1 className="font-display mt-4 max-w-3xl text-[clamp(2.5rem,6vw,5rem)] leading-[1] text-[var(--ivory)]">
            Considered clothing, quietly made.
          </h1>
        </div>
      </section>

      <AboutStory />

      <section className="border-y border-border bg-[var(--ivory)]">
        <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
          <p className="eyebrow mb-12">Milestones</p>
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 90} className="border-t border-border pt-6">
                <p className="font-display text-4xl">{t.year}</p>
                <h3 className="mt-4 text-[0.95rem] tracking-[0.05em]">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FabricExperience />
      <WhyEyvora />
    </div>
  );
}
