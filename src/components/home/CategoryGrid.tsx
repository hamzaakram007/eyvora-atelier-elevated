import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import hoodies from "@/assets/products/category/hoodies.jpg";
import trousers from "@/assets/products/category/trousers.jpg";

const categories = [
  {
    title: "Hoodies",
    note: "Olive & black essentials",
    img: hoodies,
    search: { category: "hoodies" },
  },
  {
    title: "Trousers",
    note: "Grey & black relaxed fits",
    img: trousers,
    search: { category: "trousers" },
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
      <Reveal className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Shop by category</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.1rem)] leading-[1.05]">
            Two silhouettes.
            <br />
            Endless pairing.
          </h2>
        </div>
        <Link
          to="/shop"
          search={{}}
          className="rule-link text-[0.6875rem] tracking-[0.28em] uppercase"
        >
          Shop all
        </Link>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {categories.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 90}>
            <Link
              to="/shop"
              search={cat.search}
              className="group relative block overflow-hidden bg-[var(--soft-grey)]"
            >
              <div className="aspect-[4/5] sm:aspect-[5/4]">
                <img
                  src={cat.img}
                  alt={`${cat.title} collection`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,30,30,0.55)] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-8">
                <div>
                  <p className="text-[0.5625rem] tracking-[0.3em] text-[var(--ivory)]/70 uppercase">
                    {cat.note}
                  </p>
                  <p className="font-display mt-2 text-3xl text-[var(--ivory)] lg:text-4xl">
                    {cat.title}
                  </p>
                </div>
                <span className="text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase transition-transform duration-500 group-hover:translate-x-1">
                  Explore collection
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
