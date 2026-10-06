import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Minus, Plus, ChevronRight } from "lucide-react";
import { fetchProductByHandle, fetchProducts, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import { resolveModelGender, sortProductSizes } from "@/lib/catalog";
import { cardImageUrl, galleryImageUrl, gallerySrcSet, thumbImageUrl } from "@/lib/image-variants";
import { ProductPrice } from "@/components/site/ProductPrice";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Faq = lazy(() =>
  import("@/components/home/Faq").then((m) => ({ default: m.Faq })),
);
const SizeGuideModal = lazy(() =>
  import("@/components/site/SizeGuideModal").then((m) => ({
    default: m.SizeGuideModal,
  })),
);
const ProductGrid = lazy(() =>
  import("@/components/site/ProductGrid").then((m) => ({
    default: m.ProductGrid,
  })),
);

type ProductSearch = {
  gender?: string | undefined;
};

function titleFromHandle(handle: string) {
  return handle
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const Route = createFileRoute("/product/$handle")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    gender: typeof search.gender === "string" ? search.gender : undefined,
  }),
  loaderDeps: ({ search }) => ({ gender: search.gender }),
  loader: async ({ params, deps }) => {
    const product = await fetchProductByHandle(
      params.handle,
      resolveModelGender(deps.gender),
    );
    return { product };
  },
  head: ({ params, loaderData }) => {
    const node = loaderData?.product?.node;
    const name = node?.title ?? titleFromHandle(params.handle);
    const description =
      node?.description?.slice(0, 155) ||
      `Shop the ${name} from EYVORA. Sizes S, M, L, XL with Cash on Delivery across Pakistan. Priced in PKR.`;
    const imageFull =
      node?.images.edges[0]?.node.url || "https://eyvora.pk/og.jpg";
    const imageCard = cardImageUrl(imageFull) || imageFull;
    const url = `https://eyvora.pk/product/${params.handle}`;
    const price = node?.priceRange.minVariantPrice;
    const scripts = node
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: node.title,
              description: node.description,
              image: node.images.edges.map((i) => i.node.url),
              sku: node.handle,
              brand: { "@type": "Brand", name: "EYVORA" },
              offers: {
                "@type": "Offer",
                priceCurrency: price?.currencyCode ?? "PKR",
                price: price?.amount ?? "0",
                availability: node.availableForSale
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                url,
              },
            }),
          },
        ]
      : [];
    return {
      meta: [
        { title: `${name} | Buy Online Pakistan — EYVORA` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — EYVORA` },
        {
          property: "og:description",
          content: `${name} by EYVORA. Everyday essentials with COD and bank transfer.`,
        },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: imageFull },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: imageFull },
        { name: "robots", content: "index, follow" },
      ],
      links: [
        { rel: "canonical", href: url },
        ...(imageFull && imageFull !== "https://eyvora.pk/og.jpg"
          ? [
              {
                rel: "preload",
                as: "image" as const,
                href: imageCard,
                fetchPriority: "high" as const,
              },
            ]
          : []),
      ],
      scripts,
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const search = Route.useSearch();
  const { product: initialProduct } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/product/$handle" });
  const modelGender = resolveModelGender(search.gender);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [loadRelated, setLoadRelated] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);
  const wishlisted = useWishlist((s) => s.handles.includes(handle));
  const toggleWishlist = useWishlist((s) => s.toggle);

  const { data: product } = useQuery({
    queryKey: ["product", handle, modelGender ?? "default"],
    queryFn: () => fetchProductByHandle(handle, modelGender),
    initialData: initialProduct ?? undefined,
    staleTime: 60_000,
  });

  // Defer related catalogue work until after first paint / idle.
  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setLoadRelated(true);
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 1800 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const t = window.setTimeout(enable, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [handle]);

  const { data: related } = useQuery({
    queryKey: ["products", "related", modelGender ?? "default"],
    queryFn: () => fetchProducts(8, undefined, modelGender),
    enabled: loadRelated,
    staleTime: 60_000,
  });

  const node = product?.node ?? initialProduct?.node;
  const images = node?.images.edges ?? [];
  const variants = node?.variants.edges ?? [];

  const sizeSelected = Boolean(selected.Size);

  const variant = useMemo(() => {
    if (variants.length === 0) return null;
    if (!sizeSelected) return null;
    const match = variants.find((v) =>
      v.node.selectedOptions.every(
        (o) => !selected[o.name] || selected[o.name] === o.value,
      ),
    );
    return match?.node ?? null;
  }, [variants, selected, sizeSelected]);

  useEffect(() => {
    setActiveImage(0);
    setSelected({});
    setQty(1);
  }, [handle, modelGender]);

  if (!node) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-48 pb-32 text-center">
        <p className="eyebrow">Not available</p>
        <h1 className="font-display mt-5 text-4xl">This piece isn't in the catalogue</h1>
        <Link
          to="/shop"
          className="mt-9 inline-block bg-[var(--ink)] px-9 py-4 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase"
        >
          Shop all
        </Link>
      </div>
    );
  }

  const price = variant?.price ?? node.priceRange.minVariantPrice;
  const compareAt = node.compareAtPriceRange?.minVariantPrice;
  const color =
    node.options.find((o) => ["color", "colour"].includes(o.name.toLowerCase()))
      ?.values[0] ?? "";

  const ensureSize = () => {
    if (!sizeSelected) {
      toast.message("Select a size", {
        description: "Choose S, M or L before continuing.",
      });
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!ensureSize() || !variant) return;
    await addItem({
      product: { node },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions,
    });
    toast.success("Added to your bag", { description: `${node.title} / ${selected.Size}` });
    setOpen(true);
  };

  const handleBuyNow = async () => {
    if (!ensureSize() || !variant) return;
    await addItem({
      product: { node },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions,
    });
    setOpen(true);
    toast.message("Ready in your bag", {
      description: "Continue to Checkout when you’re ready.",
    });
  };

  return (
    <div className="pt-28 lg:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <nav className="flex items-center gap-2 py-6 text-[0.625rem] tracking-[0.22em] text-muted-foreground uppercase">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1} />
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1} />
          <span className="text-foreground">{node.title}</span>
        </nav>

        <div className="grid gap-10 pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="flex gap-4">
            {images.length > 1 && (
              <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
                {images.map((img, i) => (
                  <button
                    key={img.node.url}
                    type="button"
                    aria-label={`Show image ${i + 1}: ${img.node.altText ?? node.title}`}
                    onMouseEnter={() => setActiveImage(i)}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "aspect-[4/5] overflow-hidden border transition-colors",
                      activeImage === i ? "border-[var(--ink)]" : "border-transparent",
                    )}
                  >
                    <img
                      src={thumbImageUrl(img.node.url) || img.node.url}
                      alt=""
                      width={80}
                      height={100}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 overflow-hidden bg-[var(--soft-grey)]">
              {images[activeImage] ? (
                <img
                  src={
                    galleryImageUrl(images[activeImage]!.node.url) ||
                    images[activeImage]!.node.url
                  }
                  srcSet={gallerySrcSet(images[activeImage]!.node.url)}
                  alt={images[activeImage]!.node.altText ?? node.title}
                  width={1600}
                  height={2000}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  fetchPriority={activeImage === 0 ? "high" : "auto"}
                  decoding="async"
                  loading={activeImage === 0 ? "eager" : "lazy"}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="aspect-[4/5] w-full" />
              )}
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
                  {images.map((img, i) => (
                    <button
                      key={img.node.url}
                      type="button"
                      aria-label={`Show image ${i + 1}`}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "h-20 w-16 shrink-0 overflow-hidden border",
                        activeImage === i ? "border-[var(--ink)]" : "border-transparent",
                      )}
                    >
                      <img
                        src={thumbImageUrl(img.node.url) || img.node.url}
                        alt=""
                        width={64}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-32 lg:self-start lg:py-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-[clamp(1.85rem,3.4vw,3rem)] leading-[1.08]">
                {node.title}
              </h1>
              <button
                type="button"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => toggleWishlist(handle)}
                className="mt-2 grid h-10 w-10 place-items-center border border-border"
              >
                <Heart
                  className={cn("h-4 w-4", wishlisted && "fill-current")}
                  strokeWidth={1.2}
                />
              </button>
            </div>
            <div className="mt-5 flex items-baseline gap-4">
              <ProductPrice price={price} compareAt={compareAt} size="lg" />
            </div>
            <p className="mt-2 text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
              Tax-free · Shipping PKR 249
            </p>
            {color && (
              <p className="mt-4 text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
                Color — {color}
              </p>
            )}

            <div className="mt-6">
              <p className="eyebrow mb-3">Model photos</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["men", "Male model"],
                    ["women", "Female model"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      navigate({
                        search: (prev) => ({ ...prev, gender: key }),
                        replace: true,
                      })
                    }
                    className={cn(
                      "border px-4 py-2 text-[0.625rem] tracking-[0.18em] uppercase",
                      modelGender === key
                        ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Same piece — switch between male and female model photography.
              </p>
            </div>

            {node.description && (
              <p className="mt-7 max-w-md text-[0.9rem] leading-[1.85] text-muted-foreground">
                {node.description}
              </p>
            )}

            <div className="mt-10 space-y-7">
              {node.options
                .filter((o) => o.name.toLowerCase() !== "color" && o.name.toLowerCase() !== "colour")
                .filter((o) => o.values.length > 1 || o.name !== "Title")
                .map((option) => (
                  <div key={option.name}>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="eyebrow">{option.name}</p>
                      {option.name.toLowerCase() === "size" && (
                        <button
                          type="button"
                          onClick={() => setSizeGuideOpen(true)}
                          className="text-[0.625rem] tracking-[0.2em] uppercase underline-offset-4 hover:underline"
                        >
                          Size guide
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(option.name.toLowerCase() === "size"
                        ? sortProductSizes(option.values)
                        : option.values
                      ).map((value) => {
                        const optionVariant = variants.find((v) =>
                          v.node.selectedOptions.some(
                            (o) => o.name === option.name && o.value === value,
                          ),
                        )?.node;
                        const unavailable = optionVariant
                          ? !optionVariant.availableForSale
                          : false;
                        const active = selected[option.name] === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={unavailable}
                            onClick={() =>
                              setSelected((s) => ({ ...s, [option.name]: value }))
                            }
                            className={cn(
                              "min-w-12 border px-4 py-2.5 text-[0.75rem] tracking-[0.08em] transition-colors duration-300",
                              active
                                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                                : "border-border hover:border-foreground",
                              unavailable && "cursor-not-allowed opacity-30 line-through",
                            )}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              <div>
                <p className="eyebrow mb-3">Quantity</p>
                <div className="inline-flex items-center border border-border">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="px-4 py-3"
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={1} />
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="px-4 py-3"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={1} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={isLoading}
                className="w-full min-h-14 bg-[var(--ink)] px-10 py-4 text-[0.75rem] font-bold tracking-[0.2em] text-[var(--ivory)] uppercase transition-opacity duration-300 hover:opacity-90 disabled:opacity-40"
              >
                Add to bag
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isLoading}
                className="w-full min-h-14 border-2 border-[var(--ink)] px-10 py-4 text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-colors hover:bg-[var(--ink)] hover:text-[var(--ivory)] disabled:opacity-40"
              >
                Buy now
              </button>
            </div>

            <div className="mt-10 space-y-4 border-t border-border pt-8 text-sm text-muted-foreground">
              <details>
                <summary className="cursor-pointer tracking-[0.08em] uppercase">Material</summary>
                <p className="mt-3 leading-relaxed">
                  Material details will appear here once confirmed by EYVORA.
                </p>
              </details>
              <details>
                <summary className="cursor-pointer tracking-[0.08em] uppercase">Care</summary>
                <p className="mt-3 leading-relaxed">
                  Follow the care label on the garment. Expanded care notes coming soon.
                </p>
              </details>
              <details>
                <summary className="cursor-pointer tracking-[0.08em] uppercase">Delivery</summary>
                <p className="mt-3 leading-relaxed">
                  Flat shipping PKR 249 across Pakistan. Prices are tax-free. Pay by COD, or choose bank
                  transfer in your bag for 7% off applied automatically — details on the Payments
                  page.
                </p>
              </details>
              <details>
                <summary className="cursor-pointer tracking-[0.08em] uppercase">Exchanges</summary>
                <p className="mt-3 leading-relaxed">
                  Exchange terms follow the published store policy. Contact EYVORA for help with
                  sizing.
                </p>
              </details>
              <div className="border border-dashed border-border px-4 py-5">
                <p className="text-[0.7rem] tracking-[0.2em] uppercase">Reviews</p>
                <p className="mt-2 text-sm">Be the first to review this piece.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="border-t border-border py-20">
          <p className="eyebrow">Related products</p>
          <h2 className="font-display mt-4 mb-12 text-[clamp(1.75rem,3vw,2.5rem)]">
            Complete the look
          </h2>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-[var(--sand)]" />
                  </div>
                ))}
              </div>
            }
          >
            <ProductGrid
              products={(related ?? [])
                .filter((p) => p.node.handle !== handle)
                .slice(0, 4)}
              gender={modelGender}
              prioritizeImages={false}
              loading={!loadRelated || related == null}
            />
          </Suspense>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{node.title}</p>
            <p className="text-sm text-muted-foreground">
              <ProductPrice price={price} compareAt={compareAt} size="sm" showBadge={false} />
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="bg-[var(--ink)] px-5 py-3.5 text-[0.625rem] tracking-[0.24em] text-[var(--ivory)] uppercase"
          >
            {sizeSelected ? "Add to bag" : "Select size"}
          </button>
        </div>
      </div>

      <Suspense fallback={null}>
        <Faq />
      </Suspense>
      {sizeGuideOpen && (
        <Suspense fallback={null}>
          <SizeGuideModal
            open={sizeGuideOpen}
            onOpenChange={setSizeGuideOpen}
            kind={
              (node.productType ?? "").toLowerCase().includes("trouser") ||
              node.handle.includes("trousers")
                ? "trousers"
                : "hoodies"
            }
          />
        </Suspense>
      )}
    </div>
  );
}
