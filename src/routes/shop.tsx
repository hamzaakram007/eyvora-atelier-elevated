import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { matchesCategory, matchesDepartment } from "@/lib/catalog";
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
    const gender = match.search.gender;
    const title =
      gender === "men"
        ? "Men — EYVORA"
        : gender === "women"
          ? "Women — EYVORA"
          : gender === "couple"
            ? "Couple — EYVORA"
            : "Shop All — EYVORA Hoodies & Trousers";
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Browse EYVORA by Men, Women or Couple. Premium hoodies and trousers filtered by size, colour and availability.",
        },
        { property: "og:title", content: title },
      ],
    };
  },
  component: Shop,
});

const departments = [
  { key: undefined, label: "All" },
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
  { key: "couple", label: "Couple" },
] as const;

const sorts = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price low–high" },
  { key: "price-desc", label: "Price high–low" },
];

const sizes = ["S", "M", "L"];
const colours = ["Olive", "Black", "Grey"];

function textOf(p: ShopifyProduct) {
  return `${p.node.title} ${p.node.productType ?? ""} ${(p.node.tags ?? []).join(" ")}`.toLowerCase();
}

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const modelGender =
    search.gender === "men" || search.gender === "women" ? search.gender : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["products", "all", modelGender ?? "all"],
    queryFn: () => fetchProducts(60, undefined, modelGender),
  });

  const products = useMemo(() => {
    let list = [...(data ?? [])];

    list = list.filter((p) => matchesDepartment(p, search.gender));
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

  const set = (patch: ShopSearch) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

  const title =
    search.gender === "men"
      ? "Men"
      : search.gender === "women"
        ? "Women"
        : search.gender === "couple"
          ? "Couple pieces"
          : search.collection
            ? `${search.collection} collection`
            : [search.category].filter(Boolean).join(" ") || "All pieces";

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
              ? "Couple-ready essentials. For two-person colour & size selection, use the Couple builder."
              : search.gender === "men"
                ? "Men’s essentials — hoodies and trousers in S, M and L."
                : search.gender === "women"
                  ? "Women’s essentials — hoodies and trousers in S, M and L."
                  : "Shop by Men, Women or Couple — then filter by piece, size and colour."}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {isLoading ? "Loading pieces…" : `${products.length} pieces`}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {departments.map((d) => (
              <Chip
                key={d.label}
                active={(search.gender ?? undefined) === d.key}
                onClick={() => set({ gender: d.key })}
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
                  onClick={() => set({ category: search.category === c ? undefined : c })}
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
              products={products}
              loading={isLoading}
              columns="lg:grid-cols-3 xl:grid-cols-4"
              gender={modelGender}
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
