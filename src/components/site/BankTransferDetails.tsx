import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
  BANK_TRANSFER,
  BANK_TRANSFER_DISCOUNT_PERCENT,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type BankTransferDetailsProps = {
  /** Discounted amount the customer should transfer (formatted string). */
  amountLabel?: string;
  className?: string;
  compact?: boolean;
  /** Extra note under the account fields. */
  note?: string;
};

function copyText(label: string, value: string) {
  void navigator.clipboard.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => toast.message("Copy manually", { description: value }),
  );
}

const FIELDS = [
  ["Bank", BANK_TRANSFER.bankName],
  ["Account title", BANK_TRANSFER.accountTitle],
  ["Account number", BANK_TRANSFER.accountNumber],
  ["IBAN", BANK_TRANSFER.iban],
] as const;

export function BankTransferDetails({
  amountLabel,
  className,
  compact = false,
  note,
}: BankTransferDetailsProps) {
  return (
    <div
      className={cn(
        "border border-red-600/30 bg-red-50 text-red-900",
        compact ? "px-3 py-3" : "px-4 py-4",
        className,
      )}
    >
      <p
        className={cn(
          "font-semibold tracking-[0.14em] text-red-800 uppercase",
          compact ? "text-[0.65rem]" : "text-[0.7rem]",
        )}
      >
        Transfer here · {BANK_TRANSFER_DISCOUNT_PERCENT}% off
      </p>
      {amountLabel ? (
        <p className={cn("mt-1.5 font-medium text-red-700", compact ? "text-sm" : "text-base")}>
          Amount due: {amountLabel}
        </p>
      ) : null}

      <ul className={cn("space-y-2.5", compact ? "mt-3" : "mt-4")}>
        {FIELDS.map(([label, value]) => (
          <li key={label} className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[0.6rem] tracking-[0.16em] text-red-800/70 uppercase">
                {label}
              </p>
              <p
                className={cn(
                  "mt-0.5 break-all font-medium text-red-950",
                  compact ? "text-xs" : "text-sm",
                )}
              >
                {value}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Copy ${label}`}
              onClick={() => copyText(label, value)}
              className="mt-0.5 inline-flex shrink-0 items-center gap-1 border border-red-600/25 px-2 py-1 text-[0.6rem] tracking-[0.12em] text-red-800 uppercase"
            >
              <Copy className="h-3 w-3" strokeWidth={1.4} />
              Copy
            </button>
          </li>
        ))}
      </ul>

      <p
        className={cn(
          "leading-relaxed text-red-800/90",
          compact ? "mt-3 text-[0.7rem]" : "mt-4 text-xs",
        )}
      >
        {note ||
          `After placing your order, send the order number and payment screenshot to EYVORA so we can confirm and dispatch.`}
      </p>
    </div>
  );
}
