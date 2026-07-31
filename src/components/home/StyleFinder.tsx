import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

type Answers = {
  gender: string;
  height: string;
  weight: string;
  fit: string;
  style: string;
  colour: string;
  occasion: string;
  budget: string;
};

const steps: Array<{ key: keyof Answers; label: string; options: string[] }> = [
  { key: "gender", label: "Who are we styling?", options: ["Men", "Women", "Couple"] },
  { key: "height", label: "Height", options: ["Under 5'5\"", "5'5\" – 5'9\"", "5'10\" – 6'1\"", "Over 6'1\""] },
  { key: "weight", label: "Weight", options: ["Under 60kg", "60 – 75kg", "76 – 90kg", "Over 90kg"] },
  { key: "fit", label: "Preferred fit", options: ["Close", "True to size", "Relaxed", "Oversized"] },
  { key: "style", label: "Style language", options: ["Minimal", "Street", "Tailored", "Sport"] },
  { key: "colour", label: "Colour preference", options: ["Matte Black", "Warm Ivory", "Stone Grey", "Soft Beige"] },
  { key: "occasion", label: "Mostly worn for", options: ["Work", "Casual", "Travel", "Gym", "Date Night"] },
  { key: "budget", label: "Budget per piece", options: ["Under 8k", "8k – 14k", "14k – 22k", "Open"] },
];

function recommendSize(a: Answers) {
  const h = steps[1]!.options.indexOf(a.height);
  const w = steps[2]!.options.indexOf(a.weight);
  const base = Math.round((h + w) / 2);
  const scale = ["XS", "S", "M", "L", "XL"];
  let index = base + 1;
  if (a.fit === "Oversized") index += 1;
  if (a.fit === "Relaxed") index += 0.5;
  if (a.fit === "Close") index -= 1;
  return scale[Math.max(0, Math.min(scale.length - 1, Math.round(index)))] ?? "M";
}

export function StyleFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const done = step >= steps.length;

  const { data } = useQuery({
    queryKey: ["products", "stylefinder"],
    queryFn: () => fetchProducts(24),
    enabled: done,
  });

  const products = data ?? [];
  const matches = (keyword: string): ShopifyProduct[] =>
    products.filter((p) => {
      const hay = `${p.node.title} ${p.node.productType ?? ""} ${(p.node.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(keyword);
    });

  const hoodie = matches("hood")[0] ?? products[0];
  const trouser = matches("trouser")[0] ?? matches("pant")[0] ?? products[1];
  const cross = products.filter((p) => p !== hoodie && p !== trouser).slice(0, 2);

  const current = steps[step];
  const progress = Math.round((Math.min(step, steps.length) / steps.length) * 100);

  return (
    <section className="border-t border-border bg-[var(--ink)] text-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow text-[var(--ivory)]/45">12 — Styling Desk</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
              Find your
              <br />
              exact pieces.
            </h2>
            <p className="mt-7 max-w-sm text-[0.95rem] leading-relaxed text-[var(--ivory)]/55">
              Eight questions. One tailored recommendation — silhouette, size and the
              pieces that work together.
            </p>
            <div className="mt-10 h-px w-full max-w-xs bg-[var(--ivory)]/15">
              <div
                className="h-px bg-[var(--gold)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="border border-[var(--ivory)]/15 px-6 py-10 lg:px-12 lg:py-14">
            {!done && current ? (
              <div>
                <p className="text-[0.625rem] tracking-[0.3em] text-[var(--ivory)]/45 uppercase">
                  Step {step + 1} / {steps.length}
                </p>
                <h3 className="font-display mt-4 text-3xl">{current.label}</h3>
                <div className="mt-9 flex flex-wrap gap-3">
                  {current.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setAnswers((a) => ({ ...a, [current.key]: opt }));
                        setStep((s) => s + 1);
                      }}
                      className={cn(
                        "border border-[var(--ivory)]/25 px-5 py-3 text-[0.75rem] tracking-[0.1em] transition-colors duration-400",
                        "hover:bg-[var(--ivory)] hover:text-[var(--ink)]",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-10 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)]/45 uppercase"
                  >
                    ← Back
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="text-[0.625rem] tracking-[0.3em] text-[var(--ivory)]/45 uppercase">
                  Your edit
                </p>
                <h3 className="font-display mt-4 text-3xl">
                  Recommended size {recommendSize(answers as Answers)}
                </h3>
                <p className="mt-4 max-w-md text-sm text-[var(--ivory)]/55">
                  {answers.style ?? "Minimal"} silhouette in {answers.colour ?? "Matte Black"},
                  cut {(answers.fit ?? "true to size").toLowerCase()} for {(answers.occasion ?? "everyday").toLowerCase()}.
                </p>

                {products.length === 0 ? (
                  <p className="mt-10 border border-dashed border-[var(--ivory)]/25 px-6 py-10 text-sm text-[var(--ivory)]/55">
                    No products found. Once the EYVORA catalogue is live, your
                    recommendation will appear here.
                  </p>
                ) : (
                  <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    {[hoodie, trouser].filter(Boolean).map((p, i) => (
                      <div key={p!.node.id}>
                        <p className="mb-4 text-[0.625rem] tracking-[0.26em] text-[var(--ivory)]/45 uppercase">
                          {i === 0 ? "Your hoodie" : "Your trouser"}
                        </p>
                        <ProductCard product={p!} />
                      </div>
                    ))}
                  </div>
                )}

                {cross.length > 0 && (
                  <div className="mt-12">
                    <p className="mb-5 text-[0.625rem] tracking-[0.26em] text-[var(--ivory)]/45 uppercase">
                      Completes the look
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {cross.map((p) => (
                        <ProductCard key={p.node.id} product={p} />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setAnswers({});
                    setStep(0);
                  }}
                  className="mt-12 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)]/45 uppercase"
                >
                  ← Start again
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
