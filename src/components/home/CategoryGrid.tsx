import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import menHoodies from "@/assets/cat-men-hoodies.jpg";
import womenHoodies from "@/assets/cat-women-hoodies.jpg";
import menTrousers from "@/assets/cat-men-trousers.jpg";
import womenTrousers from "@/assets/cat-women-trousers.jpg";

const categories = [
  {
    title: "Men Hoodies",
    note: "420 GSM loop-back",
    img: menHoodies,
    search: { gender: "men", category: "hoodies" },
    span: "lg:col-span-7",
    ratio: "aspect-[16/13]",
  },
  {
    title: "Women Hoodies",
    note: "Dropped shoulder",
    img: womenHoodies,
    search: { gender: "women", category: "hoodies" },
    span: "lg:col-span-5",
    ratio: "aspect-[16/13]",
  },
  {
    title: "Men Trousers",
    note: "Straight leg",
    img: menTrousers,
    search: { gender: "men", category: "trousers" },
    span: "lg:col-span-5",
    ratio: "aspect-[16/13]",
  },
  {
    title: "Women Trousers",
    note: "High-rise, wide",
    img: womenTrousers,
    search: { gender: "women", category: "trousers" },
    span: "lg:col-span-7",
    ratio: "aspect-[16/13]",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-36">
      <Reveal className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">01 — The Wardrobe</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
            Four pieces.
            <br />
            Endless combinations.
          </h2>
        </div>
        <Link to="/shop" search={{}} className="rule-link text-[0.6875rem] tracking-[0.28em] uppercase">
          View all
        </Link>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-12">
        {categories.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 100} className={cat.span}>
            <Link
              to="/shop"
              search={cat.search}
              className="group relative block overflow-hidden bg-[var(--sand)]"
            >
              <div className={cat.ratio}>
                <img
                  src={cat.img}
                  alt={cat.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
              <div className="absolute right-6 bottom-6 left-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.5625rem] tracking-[0.3em] text-[var(--ivory)]/65 uppercase">
                    {cat.note}
                  </p>
                  <p className="font-display mt-2 text-2xl text-[var(--ivory)] lg:text-3xl">
                    {cat.title}
                  </p>
                </div>
                <span className="translate-y-2 text-[0.5625rem] tracking-[0.3em] text-[var(--ivory)] uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  Shop →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
