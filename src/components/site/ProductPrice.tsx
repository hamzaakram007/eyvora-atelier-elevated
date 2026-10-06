import { formatPrice } from "@/lib/shopify";
import { PRODUCT_SALE_PERCENT } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Money = { amount: string | number; currencyCode?: string };

export function ProductPrice({
  price,
  compareAt,
  className,
  size = "md",
  showBadge = true,
}: {
  price: Money;
  compareAt?: Money | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}) {
  const sale = typeof price.amount === "number" ? price.amount : parseFloat(price.amount);
  const list = compareAt
    ? typeof compareAt.amount === "number"
      ? compareAt.amount
      : parseFloat(compareAt.amount)
    : NaN;
  const currency = price.currencyCode || compareAt?.currencyCode || "PKR";
  const onSale = Number.isFinite(list) && list > sale + 0.5;

  return (
    <span className={cn("flex flex-col items-start gap-1.5 tabular-nums", className)}>
      <span className="inline-flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "font-semibold tracking-tight text-[var(--ink)]",
            size === "sm" && "text-[1rem] leading-none",
            size === "md" && "text-[1.1rem] leading-none",
            size === "lg" && "text-[1.35rem] leading-none",
          )}
        >
          {formatPrice(sale, currency)}
        </span>
        {onSale && showBadge && (
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-sm bg-emerald-700 font-extrabold tracking-[0.14em] text-white uppercase",
              size === "sm" && "min-h-6 px-2.5 text-[0.6875rem]",
              size === "md" && "min-h-7 px-3 text-[0.75rem]",
              size === "lg" && "min-h-8 px-3.5 text-[0.8125rem]",
            )}
          >
            {PRODUCT_SALE_PERCENT}% OFF
          </span>
        )}
      </span>
      {onSale && (
        <span
          className={cn(
            "text-muted-foreground/80 line-through",
            size === "sm" && "text-[0.75rem] leading-none",
            size === "md" && "text-[0.82rem] leading-none",
            size === "lg" && "text-[0.95rem] leading-none",
          )}
        >
          {formatPrice(list, currency)}
        </span>
      )}
    </span>
  );
}
