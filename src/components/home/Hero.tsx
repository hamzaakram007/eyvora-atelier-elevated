import { Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <img
        src={hero}
        alt="Two models wearing EYVORA hoodies and trousers in a concrete gallery"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="animate-veil absolute inset-0 h-full w-full object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/10" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-24 lg:px-10 lg:pb-28">
        <div className="max-w-2xl">
          <p
            className="animate-rise text-[0.625rem] tracking-[0.42em] text-[var(--ivory)]/70 uppercase"
            style={{ animationDelay: "160ms" }}
          >
            Winter 26 — Volume One
          </p>
          <h1
            className="animate-rise font-display mt-7 text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[0.94] text-[var(--ivory)]"
            style={{ animationDelay: "280ms" }}
          >
            Elevate
            <br />
            everyday wear.
          </h1>
          <p
            className="animate-rise mt-8 max-w-md text-[0.95rem] leading-relaxed text-[var(--ivory)]/75"
            style={{ animationDelay: "420ms" }}
          >
            Minimal. Timeless. Built for comfort — heavyweight cotton hoodies and
            tailored trousers, made in small runs.
          </p>
          <div
            className="animate-rise mt-11 flex flex-wrap gap-4"
            style={{ animationDelay: "540ms" }}
          >
            <Link
              to="/shop"
              search={{ gender: "men" }}
              className="bg-[var(--ivory)] px-9 py-4 text-[0.625rem] tracking-[0.3em] text-[var(--ink)] uppercase transition-colors duration-500 hover:bg-[var(--gold)]"
            >
              Shop Men
            </Link>
            <Link
              to="/shop"
              search={{ gender: "women" }}
              className="border border-[var(--ivory)]/50 px-9 py-4 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase transition-colors duration-500 hover:bg-[var(--ivory)] hover:text-[var(--ink)]"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="text-[0.5625rem] tracking-[0.34em] text-[var(--ivory)]/60 uppercase">
          Scroll
        </span>
        <span className="animate-scroll-hint h-10 w-px bg-[var(--ivory)]/60" />
      </div>
    </section>
  );
}
