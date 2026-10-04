import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import {
  expandProductsForBothGenders,
  HOODIE_COLOURS,
  matchesCategory,
  matchesDepartment,
  PRODUCT_SIZES,
  TROUSER_COLOURS,
} from "@/lib/catalog";
import { ProductGrid } from "@/components/site/ProductGrid";
import { cn } from "@/lib/utils";

type ShopSearch = {
  gender?: string | undefined;
  category?: string | undefined;
  collection?: string | undefined;
  occasion?: string | undefined;
  sort?: string | undefined;
  color?: string | undefined;
  size?: string | undefined;
  availability?: string | undefined;
};

const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    gender: str(search["gender"]),
    category: str(search["category"]),
    collection: str(search["collection"]),
    occasion: str(search["occasion"]),
    sort: str(search["sort"]),
    color: str(search["color"]),
    size: str(search["size"]),
    availability: str(search["availability"]),
  }),
  head: ({ match }) => {
    const category = match.search.category;
    const gender = match.search.gender;
    const title =
      gender === "couple"
        ? "Couple — EYVORA"
        : category === "hoodies"
          ? "Hoodies — EYVORA"
          : category === "trousers"
            ? "Trousers — EYVORA"
            : "Shop All — EYVORA Hoodies & Trousers";
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Browse EYVORA hoodies, trousers and couple looks. Free shipping, tax-free prices, COD and 7% off bank transfer. Filter by size and colour.",
        },
        { property: "og:title", content: title },
        { property: "og:url", content: "https://eyvora.pk/shop" },
        { property: "og:image", content: "https://eyvora.pk/og.jpg" },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: "https://eyvora.pk/shop" }],
    };
  },
  component: Shop,
});

const departments = [
  { key: "all", label: "All" },
  { key: "hoodies", label: "Hoodies" },
  { key: "trousers", label: "Trousers" },
  { key: "couple", label: "Couple" },
] as const;

const sorts = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price low–high" },
  { key: "price-desc", label: "Price high–low" },
];

const sizes = [...PRODUCT_SIZES];

function textOf(p: ShopifyProduct) {
  return `${p.node.title} ${p.node.productType ?? ""} ${(p.node.tags ?? []).join(" ")}`.toLowerCase();
}

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts(60),
  });

  const products = useMemo(() => {
    let list = [...(data ?? [])];

    if (search.gender === "couple") {
      list = list.filter((p) => matchesDepartment(p, "couple"));
    }
    list = list.filter((p) => matchesCategory(p, search.category));

    if (search.collection) {
      const c = search.collection.toLowerCase();
      list = list.filter((p) => textOf(p).includes(c));
    }
    if (search.occasion) {
      const o = search.occasion.toLowerCase();
      list = list.filter((p) => textOf(p).includes(o));
    }
    if (search.color) {
      list = list.filter((p) => textOf(p).includes(search.color!.toLowerCase()));
    }
    if (search.size) {
      list = list.filter((p) =>
        p.node.variants.edges.some((v) =>
          v.node.selectedOptions.some(
            (o) => o.value.toLowerCase() === search.size!.toLowerCase(),
          ),
        ),
      );
    }
    if (search.availability === "in-stock") {
      list = list.filter((p) => p.node.variants.edges.some((v) => v.node.availableForSale));
    }
    if (maxPrice != null) {
      list = list.filter(
        (p) => parseFloat(p.node.priceRange.minVariantPrice.amount) <= maxPrice,
      );
    }
    if (search.sort === "price-asc") {
      list.sort(
        (a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) -
          parseFloat(b.node.priceRange.minVariantPrice.amount),
      );
    }
    if (search.sort === "price-desc") {
      list.sort(
        (a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount),
      );
    }
    return list;
  }, [data, search, maxPrice]);

  /** Keep both male and female model galleries in Shop All / Hoodies / Trousers / Couple. */
  const gridItems = useMemo(
    () => expandProductsForBothGenders(products),
    [products],
  );

  const set = (patch: ShopSearch) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

  const title =
    search.gender === "couple"
      ? "Couple pieces"
      : search.collection
        ? `${search.collection} collection`
        : search.category === "hoodies"
          ? "Hoodies"
          : search.category === "trousers"
            ? "Trousers"
            : "All pieces";

  const colours =
    search.category === "hoodies"
      ? [...HOODIE_COLOURS]
      : search.category === "trousers"
        ? [...TROUSER_COLOURS]
        : Array.from(new Set([...HOODIE_COLOURS, ...TROUSER_COLOURS]));

  const activeDepartment =
    search.gender === "couple"
      ? "couple"
      : search.category === "hoodies"
        ? "hoodies"
        : search.category === "trousers"
          ? "trousers"
          : "all";

  return (
    <div className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <header className="border-b border-border pb-10">
          <p className="eyebrow">Collection</p>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,5vw,4rem)] capitalize">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            {search.gender === "couple"
              ? "Couple-ready essentials with male and female model photos. For two-person colour & size selection, use the Couple builder."
              : search.category === "hoodies"
                ? "Olive green and black hoodies in S, M, L and XL — shown on male and female models. Free shipping · tax-free prices."
                : search.category === "trousers"
                  ? "Grey and black trousers in S, M, L and XL — shown on male and female models. Free shipping · tax-free prices."
                  : "Shop All, Hoodies, Trousers or Couple. Each piece shows male and female model photos. Free shipping, tax-free prices, and 7% off with bank transfer."}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {isLoading
              ? "Loading pieces…"
              : `${gridItems.length} ${gridItems.length === 1 ? "piece" : "pieces"}`}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {departments.map((d) => (
              <Chip
                key={d.label}
                active={activeDepartment === d.key}
                onClick={() => {
                  if (d.key === "all") {
                    set({ gender: undefined, category: undefined });
                  } else if (d.key === "couple") {
                    set({ gender: "couple", category: undefined });
                  } else {
                    set({ category: d.key, gender: undefined });
                  }
                }}
              >
                {d.label}
              </Chip>
            ))}
            {search.gender === "couple" && (
              <Link
                to="/couple"
                className="border border-[var(--ink)] bg-[var(--ink)] px-3 py-1.5 text-[0.6875rem] tracking-[0.14em] text-[var(--ivory)] uppercase"
              >
                Open couple builder
              </Link>
            )}
          </div>
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[210px_1fr] lg:gap-16">
          <aside className="space-y-9">
            <FilterBlock label="Category">
              {["hoodies", "trousers"].map((c) => (
                <Chip
                  key={c}
                  active={search.category === c}
                  onClick={() =>
                    set({
                      category: search.category === c ? undefined : c,
                      // Reset colour when category changes so hoodie/trouser colours stay accurate.
                      color: undefined,
                    })
                  }
                >
                  {c}
                </Chip>
              ))}
            </FilterBlock>

            <FilterBlock label="Size">
              {sizes.map((s) => (
                <Chip
                  key={s}
                  active={search.size === s}
                  onClick={() => set({ size: search.size === s ? undefined : s })}
                >
                  {s}
                </Chip>
              ))}
            </FilterBlock>

            <FilterBlock label="Colour">
              {colours.map((c) => (
                <Chip
                  key={c}
                  active={search.color === c}
                  onClick={() => set({ color: search.color === c ? undefined : c })}
                >
                  {c}
                </Chip>
              ))}
            </FilterBlock>

            <FilterBlock label="Availability">
              <Chip
                active={search.availability === "in-stock"}
                onClick={() =>
                  set({
                    availability: search.availability === "in-stock" ? undefined : "in-stock",
                  })
                }
              >
                In stock
              </Chip>
            </FilterBlock>

            <div>
              <p className="eyebrow mb-4">Price</p>
              <input
                type="range"
                min={2000}
                max={5000}
                step={100}
                value={maxPrice ?? 5000}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[var(--ink)]"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Up to PKR {(maxPrice ?? 5000).toLocaleString("en-PK")}
              </p>
            </div>
          </aside>

          <div>
            <div className="mb-10 flex flex-wrap items-center gap-3 border-b border-border pb-5">
              <span className="eyebrow mr-2">Sort</span>
              {sorts.map((s) => (
                <Chip
                  key={s.key}
                  active={search.sort === s.key}
                  onClick={() => set({ sort: search.sort === s.key ? undefined : s.key })}
                >
                  {s.label}
                </Chip>
              ))}
            </div>
            <ProductGrid
              items={gridItems}
              loading={isLoading}
              columns="lg:grid-cols-3 xl:grid-cols-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-4">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-3 py-1.5 text-[0.6875rem] tracking-[0.14em] capitalize transition-colors duration-300",
        active
          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
          : "border-border hover:border-foreground",
      )}
    >
      {children}
    </button>
  );
}
