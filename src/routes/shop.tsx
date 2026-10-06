import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import {
  expandProductsForBothGenders,
  matchesCategory,
  matchesDepartment,
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
            "Browse EYVORA hoodies, trousers and couple looks. Shipping PKR 249, tax-free prices, COD and 7% off bank transfer.",
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

function textOf(p: ShopifyProduct) {
  return `${p.node.title} ${p.node.productType ?? ""} ${(p.node.tags ?? []).join(" ")}`.toLowerCase();
}

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

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
  }, [data, search]);

  /** Keep both male and female model galleries in Shop All / Hoodies / Trousers / Couple. */
  const gridItems = useMemo(
    () => expandProductsForBothGenders(products),
    [products],
  );

  const set = (patch: ShopSearch) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

  const activeDepartment =
    search.gender === "couple"
      ? "couple"
      : search.category === "hoodies"
        ? "hoodies"
        : search.category === "trousers"
          ? "trousers"
          : "all";

  return (
    <div className="pt-28 lg:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 pb-16 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading pieces…"
              : `${gridItems.length} ${gridItems.length === 1 ? "piece" : "pieces"}`}
          </p>
          <div className="flex flex-wrap gap-2">
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
        </div>

        <div className="mt-5 mb-6 flex flex-wrap items-center gap-3">
          <span className="eyebrow mr-1">Sort</span>
          {sorts.map((s) => (
            <Chip
              key={s.key}
              active={(search.sort ?? "featured") === s.key}
              onClick={() =>
                set({
                  sort:
                    s.key === "featured"
                      ? undefined
                      : search.sort === s.key
                        ? undefined
                        : s.key,
                })
              }
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
