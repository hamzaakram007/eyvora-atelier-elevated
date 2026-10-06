import { Link } from "@tanstack/react-router";
import { publicVariantBase } from "@/lib/image-variants";

const desktop = publicVariantBase("hero/hero-desktop");
const mobile = publicVariantBase("hero/hero-mobile");

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[var(--ink)]">
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={mobile.srcSet ?? mobile.gallery}
          sizes="100vw"
        />
        <img
          src={desktop.gallery}
          srcSet={desktop.srcSet}
          alt="EYVORA models wearing premium olive and black hoodies from the Essentials Collection"
          width={1600}
          height={2000}
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
          className="animate-veil absolute inset-0 h-full w-full object-cover object-[50%_20%]"
        />
      </picture>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,30,30,0.62)_0%,rgba(30,30,30,0.28)_48%,rgba(30,30,30,0.12)_100%)]" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-20 lg:px-10 lg:pb-28">
        <div className="max-w-2xl">
          <p
            className="animate-rise text-[0.75rem] font-bold tracking-[0.32em] text-[var(--ivory)] uppercase"
            style={{ animationDelay: "120ms" }}
          >
            Essentials Collection
          </p>
          <h1
            className="animate-rise font-display mt-6 text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.96] text-[var(--ivory)]"
            style={{ animationDelay: "220ms" }}
          >
            Everyday essentials.
            <br />
            Elevated.
          </h1>
          <p
            className="animate-rise mt-7 max-w-md text-[1.05rem] leading-relaxed font-semibold text-[var(--ivory)]/95"
            style={{ animationDelay: "340ms" }}
          >
            Thoughtfully designed pieces for modern everyday wear.
          </p>
          <div
            className="animate-rise mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "460ms" }}
          >
            <Link
              to="/shop"
              search={{ category: "hoodies" }}
              className="inline-flex min-h-14 w-full flex-1 items-center justify-center bg-[var(--ivory)] px-10 py-4 text-[0.8rem] font-bold tracking-[0.2em] text-[var(--ink)] uppercase shadow-[0_10px_28px_rgba(0,0,0,0.32)] transition-opacity hover:opacity-95"
            >
              Shop Hoodies
            </Link>
            <Link
              to="/shop"
              search={{ category: "trousers" }}
              className="inline-flex min-h-14 w-full flex-1 items-center justify-center border-[2.5px] border-[var(--ivory)] bg-[var(--ivory)]/15 px-10 py-4 text-[0.8rem] font-bold tracking-[0.2em] text-[var(--ivory)] uppercase backdrop-blur-[2px] transition-colors hover:bg-[var(--ivory)] hover:text-[var(--ink)]"
            >
              Shop Trousers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
