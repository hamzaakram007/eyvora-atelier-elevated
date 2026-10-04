import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import fabric from "@/assets/fabric.webp";

const specs = [
  { label: "Cotton", value: 100, suffix: "%", note: "Long-staple, ring-spun" },
  { label: "Weight", value: 420, suffix: " GSM", note: "Loop-back winter fleece" },
  { label: "Shrinkage", value: 2, suffix: "%", note: "Pre-washed, colour-locked" },
  { label: "Wash cycles", value: 60, suffix: "+", note: "Tested without pilling" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)]">
      {value}
      {suffix}
    </span>
  );
}

export function FabricExperience() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden">
          <img
            src={fabric}
            alt="Macro detail of EYVORA heavyweight loop-back cotton"
            loading="lazy"
            width={1600}
            height={1104}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="bg-background px-5 py-20 lg:px-16 lg:py-28">
          <Reveal>
            <p className="eyebrow">07 — Fabric Experience</p>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
              You feel the
              <br />
              difference first.
            </h2>
            <p className="mt-7 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              A dense loop-back knit brushed on the inside for softness and left
              structured on the face so it holds its line. Breathable enough for a
              Karachi evening, warm enough for Islamabad in January.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {specs.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="border-t border-border pt-5">
                <Counter to={s.value} suffix={s.suffix} />
                <p className="mt-3 text-[0.6875rem] tracking-[0.24em] uppercase">{s.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
