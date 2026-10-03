import { Link } from "@tanstack/react-router";
import heroDesktop from "@/assets/products/hero/hero-desktop.jpg";
import heroMobile from "@/assets/products/hero/hero-mobile.jpg";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[var(--ink)]">
      <picture>
        <source media="(max-width: 768px)" srcSet={heroMobile} />
        <img
          src={heroDesktop}
          alt="EYVORA models wearing the Essentials Collection"
          width={1600}
          height={2000}
          fetchPriority="high"
          className="animate-veil absolute inset-0 h-full w-full object-cover object-[50%_20%]"
        />
      </picture>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,30,30,0.62)_0%,rgba(30,30,30,0.28)_48%,rgba(30,30,30,0.12)_100%)]" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-20 lg:px-10 lg:pb-28">
        <div className="max-w-2xl">
          <p
            className="animate-rise text-[0.625rem] tracking-[0.42em] text-[var(--ivory)]/70 uppercase"
            style={{ animationDelay: "120ms" }}
          >
            Essentials Collection
          </p>
          <h1
            className="animate-rise font-display mt-6 text-[clamp(2.6rem,7vw,6rem)] leading-[0.96] text-[var(--ivory)]"
            style={{ animationDelay: "220ms" }}
          >
            Everyday essentials.
            <br />
            Elevated.
          </h1>
          <p
            className="animate-rise mt-7 max-w-md text-[0.95rem] leading-relaxed text-[var(--ivory)]/75"
            style={{ animationDelay: "340ms" }}
          >
            Thoughtfully designed pieces for modern everyday wear.
          </p>
          <div
            className="animate-rise mt-10 flex flex-wrap gap-3"
            style={{ animationDelay: "460ms" }}
          >
            <Link
              to="/shop"
              search={{ category: "hoodies" }}
              className="bg-[var(--ivory)] px-8 py-3.5 text-[0.625rem] tracking-[0.28em] text-[var(--ink)] uppercase transition-opacity hover:opacity-90"
            >
              Shop Hoodies
            </Link>
            <Link
              to="/shop"
              search={{ category: "trousers" }}
              className="border border-[var(--ivory)]/55 px-8 py-3.5 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase transition-colors hover:bg-[var(--ivory)] hover:text-[var(--ink)]"
            >
              Shop Trousers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
