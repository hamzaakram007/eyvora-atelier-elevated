import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchProducts, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import {
  COUPLE_CONTRAST_GALLERY,
  COUPLE_HOODIES,
  COUPLE_OUTFITS,
  COUPLE_TROUSERS,
  findCatalogProduct,
  type CouplePieceOption,
  type ModelGender,
} from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import coupleHero from "@/assets/products/couple/contrast/olive-black-grey.webp";

export const Route = createFileRoute("/couple")({
  head: () => ({
    meta: [
      { title: "Couple Collection — Contrast Looks | EYVORA" },
      {
        name: "description",
        content:
          "EYVORA couple contrast looks — olive & black hoodies with grey & black trousers. Match or mix colours; each person picks their own size.",
      },
      { property: "og:title", content: "Couple Contrast Collection — EYVORA" },
      {
        property: "og:description",
        content:
          "Signature contrast outfits for two. Olive with black, black with grey — independent sizes for each person.",
      },
      { property: "og:url", content: "https://eyvora.pk/couple" },
      { property: "og:image", content: "https://eyvora.pk/og.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eyvora.pk/couple" }],
  }),
  component: CouplePage,
});

type ColorMode = "matching" | "mix";

type PersonSelection = {
  hoodieHandle: string;
  hoodieSize: string;
  trousersHandle: string;
  trousersSize: string;
};

const emptyPerson = (): PersonSelection => ({
  hoodieHandle: COUPLE_HOODIES[0].handle,
  hoodieSize: "",
  trousersHandle: COUPLE_TROUSERS[1].handle,
  trousersSize: "",
});

function variantFor(
  product: ShopifyProduct | null,
  size: string,
): ShopifyProduct["node"]["variants"]["edges"][number]["node"] | null {
  if (!product || !size) return null;
  return (
    product.node.variants.edges.find((v) =>
      v.node.selectedOptions.some((o) => o.name === "Size" && o.value === size),
    )?.node ?? null
  );
}

function PiecePicker({
  label,
  options,
  value,
  onChange,
  locked,
}: {
  label: string;
  options: CouplePieceOption[];
  value: string;
  onChange: (handle: string) => void;
  locked?: boolean;
}) {
  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.handle}
            type="button"
            disabled={locked}
            onClick={() => onChange(opt.handle)}
            className={cn(
              "border px-3 py-2 text-[0.625rem] tracking-[0.14em] uppercase transition-colors",
              value === opt.handle
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                : "border-border hover:border-foreground",
              locked && "opacity-70",
            )}
          >
            {opt.color}
          </button>
        ))}
        <button
          type="button"
          disabled={locked}
          onClick={() => onChange("")}
          className={cn(
            "border px-3 py-2 text-[0.625rem] tracking-[0.14em] uppercase",
            value === ""
              ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
              : "border-border",
            locked && "opacity-70",
          )}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function SizePicker({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (size: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {["S", "M", "L", "XL"].map((size) => (
          <button
            key={size}
            type="button"
            disabled={disabled}
            onClick={() => onChange(size)}
            className={cn(
              "min-w-11 border px-3 py-2 text-[0.625rem] tracking-[0.18em] uppercase",
              value === size
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                : "border-border",
              disabled && "opacity-40",
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

function PersonCard({
  title,
  subtitle,
  selection,
  onChange,
  products,
  colorLocked,
  gender,
}: {
  title: string;
  subtitle: string;
  selection: PersonSelection;
  onChange: (next: PersonSelection) => void;
  products: ShopifyProduct[];
  colorLocked?: boolean;
  /** Person 1 = male model photos; Person 2 = female model photos. */
  gender: ModelGender;
}) {
  const hoodie = selection.hoodieHandle
    ? findCatalogProduct(products, selection.hoodieHandle, gender)
    : null;
  const trousers = selection.trousersHandle
    ? findCatalogProduct(products, selection.trousersHandle, gender)
    : null;

  const hoodieImage = hoodie?.node.images.edges[0]?.node;
  const trousersImage = trousers?.node.images.edges[0]?.node;

  return (
    <div className="border border-border p-6 lg:p-8">
      <p className="eyebrow">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6 grid gap-6">
        <PiecePicker
          label="Hoodie colour"
          options={COUPLE_HOODIES}
          value={selection.hoodieHandle}
          locked={colorLocked}
          onChange={(hoodieHandle) =>
            onChange({ ...selection, hoodieHandle, hoodieSize: hoodieHandle ? selection.hoodieSize : "" })
          }
        />
        <SizePicker
          label="Hoodie size"
          value={selection.hoodieSize}
          disabled={!selection.hoodieHandle}
          onChange={(hoodieSize) => onChange({ ...selection, hoodieSize })}
        />
        {hoodie && hoodieImage && (
          <Link
            to="/product/$handle"
            params={{ handle: hoodie.node.handle }}
            search={{ gender }}
            className="block overflow-hidden bg-[var(--soft-grey)]"
          >
            <img
              src={hoodieImage.url}
              alt={hoodieImage.altText || `${hoodie.node.title} — ${gender === "women" ? "women" : "men"}`}
              className="aspect-[5/3] w-full object-cover"
              loading="lazy"
            />
          </Link>
        )}

        <PiecePicker
          label="Trousers colour"
          options={COUPLE_TROUSERS}
          value={selection.trousersHandle}
          locked={colorLocked}
          onChange={(trousersHandle) =>
            onChange({
              ...selection,
              trousersHandle,
              trousersSize: trousersHandle ? selection.trousersSize : "",
            })
          }
        />
        <SizePicker
          label="Trousers size"
          value={selection.trousersSize}
          disabled={!selection.trousersHandle}
          onChange={(trousersSize) => onChange({ ...selection, trousersSize })}
        />
        {trousers && trousersImage && (
          <Link
            to="/product/$handle"
            params={{ handle: trousers.node.handle }}
            search={{ gender }}
            className="block overflow-hidden bg-[var(--soft-grey)]"
          >
            <img
              src={trousersImage.url}
              alt={trousersImage.altText || `${trousers.node.title} — ${gender === "women" ? "women" : "men"}`}
              className="aspect-[5/3] w-full object-cover"
              loading="lazy"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

function CoupleBuilder() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "couple-page"],
    queryFn: () => fetchProducts(24),
  });
  const products = data ?? [];
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const [mode, setMode] = useState<ColorMode>("matching");
  const [person1, setPerson1] = useState<PersonSelection>(emptyPerson);
  const [person2, setPerson2] = useState<PersonSelection>(emptyPerson);
  const [loading, setLoading] = useState(false);

  // Matching mode: Person 2 colours follow Person 1; sizes stay independent.
  useEffect(() => {
    if (mode !== "matching") return;
    setPerson2((prev) => ({
      ...prev,
      hoodieHandle: person1.hoodieHandle,
      trousersHandle: person1.trousersHandle,
    }));
  }, [mode, person1.hoodieHandle, person1.trousersHandle]);

  const lineItems = useMemo(() => {
    const people: Array<{ person: PersonSelection; who: string; gender: ModelGender }> = [
      { person: person1, who: "Person 1 (Him)", gender: "men" },
      { person: person2, who: "Person 2 (Her)", gender: "women" },
    ];
    const lines: Array<{
      product: ShopifyProduct;
      variant: ShopifyProduct["node"]["variants"]["edges"][number]["node"];
      who: string;
    }> = [];

    for (const { person, who, gender } of people) {
      if (person.hoodieHandle && person.hoodieSize) {
        const product = findCatalogProduct(products, person.hoodieHandle, gender);
        const variant = variantFor(product, person.hoodieSize);
        if (product && variant) lines.push({ product, variant, who });
      }
      if (person.trousersHandle && person.trousersSize) {
        const product = findCatalogProduct(products, person.trousersHandle, gender);
        const variant = variantFor(product, person.trousersSize);
        if (product && variant) lines.push({ product, variant, who });
      }
    }
    return lines;
  }, [person1, person2, products]);

  const total = lineItems.reduce(
    (sum, line) => sum + parseFloat(line.variant.price.amount),
    0,
  );

  const applyPreset = (outfit: (typeof COUPLE_OUTFITS)[number]) => {
    const nextMode = outfit.mode;
    setMode(nextMode);
    setPerson1({
      hoodieHandle: outfit.hoodieHandle,
      hoodieSize: "",
      trousersHandle: outfit.trousersHandle,
      trousersSize: "",
    });
    setPerson2({
      hoodieHandle:
        "person2HoodieHandle" in outfit && outfit.person2HoodieHandle
          ? outfit.person2HoodieHandle
          : outfit.hoodieHandle,
      hoodieSize: "",
      trousersHandle:
        "person2TrousersHandle" in outfit && outfit.person2TrousersHandle
          ? outfit.person2TrousersHandle
          : outfit.trousersHandle,
      trousersSize: "",
    });
  };

  const addAll = async () => {
    if (lineItems.length === 0) {
      toast.message("Select pieces & sizes", {
        description: "Each person needs a colour and size for at least one piece.",
      });
      return;
    }
    // Require sizes whenever a colour/piece is chosen
    for (const [i, person] of [person1, person2].entries()) {
      const label = i === 0 ? "Person 1 (Him)" : "Person 2 (Her)";
      if (person.hoodieHandle && !person.hoodieSize) {
        toast.message(`${label}: choose hoodie size`);
        return;
      }
      if (person.trousersHandle && !person.trousersSize) {
        toast.message(`${label}: choose trousers size`);
        return;
      }
    }

    setLoading(true);
    try {
      for (const line of lineItems) {
        await addItem({
          product: line.product,
          variantId: line.variant.id,
          variantTitle: line.variant.title,
          price: line.variant.price,
          quantity: 1,
          selectedOptions: line.variant.selectedOptions,
        });
      }
      toast.success(`${lineItems.length} pieces added to bag`);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-16 lg:px-10 lg:py-24">
      <Reveal>
        <p className="eyebrow">Build your couple order</p>
        <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.2rem)]">
          Two people. Independent sizes.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">Person 1</strong> shows the male model
          photos; <strong className="font-medium text-foreground">Person 2</strong> shows the female
          model photos. Choose{" "}
          <strong className="font-medium text-foreground">Matching colours</strong> so both wear the
          same combination, or{" "}
          <strong className="font-medium text-foreground">Mix &amp; match</strong> so each person
          picks different colours. Colour and size stay independent for each person.
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        {(
          [
            ["matching", "Matching colours"],
            ["mix", "Mix & match colours"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={cn(
              "border px-5 py-3 text-[0.625rem] tracking-[0.22em] uppercase",
              mode === key
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                : "border-border hover:border-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <span className="eyebrow mr-2 self-center">Quick presets</span>
        {COUPLE_OUTFITS.map((outfit) => (
          <button
            key={outfit.id}
            type="button"
            onClick={() => applyPreset(outfit)}
            className="border border-border px-3 py-2 text-[0.6875rem] tracking-[0.12em] uppercase hover:border-foreground"
            title={outfit.note}
          >
            {outfit.title}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-12 text-sm text-muted-foreground">Loading pieces…</p>
      ) : (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <PersonCard
            title="Person 1 — Him"
            subtitle="Male model photos. Pick any colour and size."
            selection={person1}
            onChange={setPerson1}
            products={products}
            gender="men"
          />
          <PersonCard
            title="Person 2 — Her"
            subtitle="Female model photos. Pick any colour and size."
            selection={person2}
            onChange={setPerson2}
            products={products}
            gender="women"
            colorLocked={mode === "matching"}
          />
        </div>
      )}

      <div className="mt-10 border border-border p-6 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-8">
        <div>
          <p className="eyebrow">Order summary</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {lineItems.length === 0 ? (
              <li>Select colours and sizes for each person.</li>
            ) : (
              lineItems.map((line, i) => (
                <li key={`${line.variant.id}-${i}`}>
                  {line.who}: {line.product.node.title} — Size{" "}
                  {line.variant.selectedOptions.find((o) => o.name === "Size")?.value}{" "}
                  ({formatPrice(line.variant.price.amount, line.variant.price.currencyCode)})
                </li>
              ))
            )}
          </ul>
          {lineItems.length > 0 && (
            <p className="mt-4 text-sm">
              Combined {formatPrice(total, "PKR")} — no bundle discount applied.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={addAll}
          disabled={loading || lineItems.length === 0}
          className="mt-6 bg-[var(--ink)] px-8 py-4 text-[0.625rem] tracking-[0.28em] text-[var(--ivory)] uppercase disabled:opacity-40 lg:mt-0"
        >
          {loading ? "Adding…" : `Add ${lineItems.length || ""} to bag`}
        </button>
      </div>
    </section>
  );
}

function ContrastGallery() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-16 lg:px-10 lg:py-20">
      <Reveal>
        <p className="eyebrow">Contrast looks</p>
        <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3rem)]">
          Hoodies &amp; trousers, mixed.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Signature couple contrast — olive with black, black with grey. Use a preset below
          or build your own mix.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COUPLE_CONTRAST_GALLERY.map((shot, i) => (
          <Reveal key={shot.id} delay={i * 70} className="overflow-hidden bg-[var(--soft-grey)]">
            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <p className="px-4 py-3 text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
              {shot.caption}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CouplePage() {
  return (
    <main>
      <section className="relative">
        <img
          src={coupleHero}
          alt="Couple contrast look — olive and black EYVORA hoodies"
          width={1600}
          height={2000}
          className="h-[62vh] w-full object-cover object-[50%_18%] lg:h-[74vh]"
        />
        <div className="absolute inset-0 bg-[var(--ink)]/35" />
        <div className="absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-5 pb-16 text-[var(--ivory)] lg:px-10 lg:pb-24">
          <p className="eyebrow text-[var(--ivory)]/60">Couple Collection</p>
          <h1 className="font-display mt-5 max-w-2xl text-[clamp(2.5rem,6vw,5rem)] leading-[1.02]">
            Contrast, together.
          </h1>
          <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-[var(--ivory)]/75">
            Mix olive &amp; black hoodies with grey &amp; black trousers — each person picks
            their own size.
          </p>
        </div>
      </section>

      <ContrastGallery />
      <CoupleBuilder />

      <section className="border-t border-border py-16">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="text-sm text-muted-foreground">
            Shopping for one? Browse Men or Women essentials separately.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              search={{ gender: "men" }}
              className="border border-border px-5 py-3 text-[0.625rem] tracking-[0.22em] uppercase"
            >
              Shop Men
            </Link>
            <Link
              to="/shop"
              search={{ gender: "women" }}
              className="border border-border px-5 py-3 text-[0.625rem] tracking-[0.22em] uppercase"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
