import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { COUPLE_OUTFITS, findCatalogProduct } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Answers = {
  preference: string;
  fit: string;
  size: string;
  colour: string;
  occasion: string;
  piece: string;
};

const steps: Array<{ key: keyof Answers; label: string; options: string[] }> = [
  {
    key: "preference",
    label: "Style preference",
    options: ["Men", "Women", "Shared / Couple"],
  },
  {
    key: "fit",
    label: "Preferred fit",
    options: ["Close", "True to size", "Relaxed"],
  },
  {
    key: "size",
    label: "Your size",
    options: ["S", "M", "L"],
  },
  {
    key: "colour",
    label: "Colour preference",
    options: ["Olive", "Black", "Grey", "No preference"],
  },
  {
    key: "occasion",
    label: "Occasion",
    options: ["Everyday", "Travel", "Weekend", "Evening"],
  },
  {
    key: "piece",
    label: "Looking for",
    options: ["Hoodie", "Trousers", "Full outfit"],
  },
];

function scoreProduct(product: ShopifyProduct, answers: Answers) {
  const hay =
    `${product.node.title} ${(product.node.tags ?? []).join(" ")} ${product.node.productType ?? ""}`.toLowerCase();
  let score = 0;
  if (answers.piece === "Hoodie" && hay.includes("hoodie")) score += 4;
  if (answers.piece === "Trousers" && hay.includes("trouser")) score += 4;
  if (answers.piece === "Full outfit") score += 1;
  if (answers.colour !== "No preference" && hay.includes(answers.colour.toLowerCase())) {
    score += 3;
  }
  if (answers.occasion && hay.includes("essentials")) score += 1;
  if (answers.preference === "Shared / Couple" && hay.includes("couple")) score += 1;
  return score;
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
  const ranked = useMemo(() => {
    if (!done) return [] as ShopifyProduct[];
    const a = answers as Answers;
    return [...products]
      .map((p) => ({ p, score: scoreProduct(p, a) }))
      .sort((x, y) => y.score - x.score)
      .map((x) => x.p);
  }, [answers, done, products]);

  const recommendedSize = (answers.size as string) || "M";
  const primary = ranked[0];
  const secondary = ranked[1];
  const outfit = useMemo(() => {
    if (!done) return null;
    const colour = (answers.colour || "").toLowerCase();
    if (colour.includes("olive")) return COUPLE_OUTFITS[0];
    if (colour.includes("grey")) return COUPLE_OUTFITS[1];
    return COUPLE_OUTFITS[2];
  }, [answers.colour, done]);

  const outfitProducts = outfit
    ? [
        findCatalogProduct(products, outfit.hoodieHandle),
        findCatalogProduct(products, outfit.trousersHandle),
      ].filter(Boolean) as ShopifyProduct[]
    : [];

  const current = steps[step];
  const progress = Math.round((Math.min(step, steps.length) / steps.length) * 100);

  return (
    <section className="border-t border-border bg-[var(--ink)] text-[var(--ivory)]">
      <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow text-[var(--ivory)]/45">Find your EYVORA fit</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.1rem)] leading-[1.05]">
              A simple guide
              <br />
              to your essentials.
            </h2>
            <p className="mt-7 max-w-sm text-[0.95rem] leading-relaxed text-[var(--ivory)]/55">
              Rule-based recommendations from the launch catalogue. Not medical, biometric,
              or scientifically predictive — just a clearer starting point.
            </p>
            <div className="mt-10 h-px w-full max-w-xs bg-[var(--ivory)]/15">
              <div
                className="h-px bg-[var(--ivory)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="border border-[var(--ivory)]/15 px-6 py-10 lg:px-12 lg:py-14"
          >
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
                        setAnswers((prev) => ({ ...prev, [current.key]: opt }));
                        setStep((s) => s + 1);
                      }}
                      className={cn(
                        "border border-[var(--ivory)]/25 px-5 py-3 text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:bg-[var(--ivory)] hover:text-[var(--ink)]",
                        answers[current.key] === opt &&
                          "bg-[var(--ivory)] text-[var(--ink)]",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="mt-8 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)]/55 uppercase"
                  >
                    Back
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="text-[0.625rem] tracking-[0.3em] text-[var(--ivory)]/45 uppercase">
                  Your recommendation
                </p>
                <h3 className="font-display mt-4 text-3xl">Suggested size: {recommendedSize}</h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--ivory)]/60">
                  Based on your preference for a {String(answers.fit || "relaxed").toLowerCase()} fit
                  {answers.colour && answers.colour !== "No preference"
                    ? ` in ${answers.colour.toLowerCase()}`
                    : ""}
                  . Review the pieces below and confirm sizing on the product page.
                </p>

                <div className="mt-10 grid gap-6 text-[var(--ink)] sm:grid-cols-2">
                  {[primary, secondary].filter(Boolean).map((p, i) => (
                    <ProductCard key={p!.node.id} product={p!} index={i} />
                  ))}
                </div>

                {outfit && outfitProducts.length === 2 && (
                  <div className="mt-12 border-t border-[var(--ivory)]/15 pt-10">
                    <p className="text-[0.625rem] tracking-[0.28em] text-[var(--ivory)]/45 uppercase">
                      Suggested outfit
                    </p>
                    <p className="font-display mt-3 text-2xl">{outfit.title}</p>
                    <p className="mt-2 text-sm text-[var(--ivory)]/55">{outfit.note}</p>
                    <div className="mt-8 grid gap-6 text-[var(--ink)] sm:grid-cols-2">
                      {outfitProducts.map((p, i) => (
                        <ProductCard key={p.node.id} product={p} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setAnswers({});
                  }}
                  className="mt-10 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)]/55 uppercase"
                >
                  Start again
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
