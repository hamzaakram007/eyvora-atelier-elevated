import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow">11 — Good To Know</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
              Questions,
              <br />
              answered.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <ul className="border-t border-border">
              {faqs.map((item, i) => {
                const active = open === i;
                return (
                  <li key={item.q} className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => setOpen(active ? null : i)}
                      aria-expanded={active}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-[0.95rem]">{item.q}</span>
                      {active ? (
                        <Minus className="h-4 w-4 shrink-0" strokeWidth={1} />
                      ) : (
                        <Plus className="h-4 w-4 shrink-0" strokeWidth={1} />
                      )}
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        active ? "grid-rows-[1fr] pb-7 opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <p className="max-w-2xl overflow-hidden text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
