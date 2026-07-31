import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
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
  head: () => ({
    meta: [
      { title: "Shop All — EYVORA Hoodies & Trousers" },
      {
        name: "description",
        content:
          "Browse the full EYVORA collection: premium hoodies and trousers for men and women, filtered by size, colour and availability.",
      },
      { property: "og:title", content: "Shop EYVORA" },
      {
        property: "og:description",
        content: "Premium hoodies and trousers. Filter by gender, size, colour and price.",
      },
    ],
  }),
  component: Shop,
});

const sorts = [
  { key: "newest", label: "Newest" },
  { key: "popular", label: "Popular" },
  { key: "price-asc", label: "Price low" },
  { key: "price-desc", label: "Price high" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colours = ["Black", "Ivory", "Stone", "Beige", "Taupe"];

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
    const filters = [search.gender, search.category, search.collection, search.occasion]
      .filter(Boolean)
      .map((f) => (f as string).toLowerCase());
    filters.forEach((f) => {
      list = list.filter((p) => textOf(p).includes(f.replace(/s$/, "")));
    });
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

  const title = search.collection
    ? `${search.collection} collection`
    : [search.gender, search.category].filter(Boolean).join(" ") || "All pieces";

  return (
    <div className="pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <header className="border-b border-border pb-10">
          <p className="eyebrow">Collection</p>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,5vw,4rem)] capitalize">
            {title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {isLoading ? "Loading pieces…" : `${products.length} pieces`}
          </p>
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[210px_1fr] lg:gap-16">
          <aside className="space-y-9">
            <FilterBlock label="Gender">
              {["men", "women", "couple"].map((g) => (
                <Chip
                  key={g}
                  active={search.gender === g}
                  onClick={() => set({ gender: search.gender === g ? undefined : g })}
                >
                  {g}
                </Chip>
              ))}
            </FilterBlock>

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
              <p className="eyebrow mb-4">Max price</p>
              <input
                type="range"
                min={2000}
                max={30000}
                step={1000}
                value={maxPrice ?? 30000}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[var(--ink)]"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Up to {(maxPrice ?? 30000).toLocaleString()} PKR
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
