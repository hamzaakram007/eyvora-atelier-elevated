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
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums",
        className,
      )}
    >
      <span
        className={cn(
          "font-medium",
          size === "sm" && "text-[0.88rem]",
          size === "md" && "text-[0.95rem]",
          size === "lg" && "text-lg",
        )}
      >
        {formatPrice(sale, currency)}
      </span>
      {onSale && (
        <>
          <span
            className={cn(
              "text-muted-foreground line-through",
              size === "sm" && "text-[0.75rem]",
              size === "md" && "text-[0.8rem]",
              size === "lg" && "text-sm",
            )}
          >
            {formatPrice(list, currency)}
          </span>
          {showBadge && (
            <span className="text-[0.625rem] font-semibold tracking-[0.14em] text-emerald-700 uppercase">
              {PRODUCT_SALE_PERCENT}% off
            </span>
          )}
        </>
      )}
    </span>
  );
}
