import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { whatsappLink } from "@/lib/site";
import about from "@/assets/about.jpg";
import couple from "@/assets/couple.jpg";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit EYVORA — Flagship Studio & Fitting Rooms" },
      {
        name: "description",
        content:
          "Visit the EYVORA studio to feel the fabric, try the fit and book a private styling appointment.",
      },
      { property: "og:title", content: "Visit EYVORA" },
      {
        property: "og:description",
        content: "Feel the fabric in person. Private fittings by appointment.",
      },
    ],
  }),
  component: Visit,
});

const stores = [
  {
    city: "Karachi",
    address: "Studio 04, Khayaban-e-Shahbaz, DHA Phase VI",
    hours: "Mon – Sun · 12:00 – 21:00",
  },
  {
    city: "Lahore",
    address: "12-C, MM Alam Road, Gulberg III",
    hours: "Mon – Sun · 12:00 – 21:00",
  },
];

function Visit() {
  return (
    <div className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <header className="border-b border-border pb-12">
          <p className="eyebrow">Studios</p>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,5vw,4rem)]">Visit us</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Cotton is a material you understand with your hands. Come feel the weight,
            try the fit, and leave with the right size.
          </p>
        </header>

        <div className="grid gap-16 py-16 lg:grid-cols-2 lg:gap-24">
          {stores.map((s, i) => (
            <Reveal key={s.city} delay={i * 120}>
              <img
                src={i === 0 ? about : couple}
                alt={`EYVORA studio in ${s.city}`}
                loading="lazy"
                className="aspect-[5/4] w-full object-cover"
              />
              <h2 className="font-display mt-8 text-3xl">{s.city}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{s.address}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.hours}</p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="rule-link mt-6 inline-block text-[0.625rem] tracking-[0.3em] uppercase"
              >
                Book a private fitting
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
