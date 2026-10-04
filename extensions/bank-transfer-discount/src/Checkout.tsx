import {
  Banner,
  reactExtension,
  Text,
  useApplyDiscountCodeChange,
  useDiscountCodes,
  useInstructions,
  useSelectedPaymentOptions,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useMemo, useRef, useState } from "react";

const DISCOUNT_CODE = "BANK7";

/**
 * Sync BANK7 with the selected Shopify payment method so the checkout
 * total updates live when the buyer switches COD ↔ Bank Deposit.
 */
function isCodPayment(type: string, handle: string) {
  const hay = `${type} ${handle}`.toLowerCase();
  return /paymentondelivery|payment_on_delivery|cash|cod/.test(hay);
}

function isBankPayment(type: string, handle: string) {
  if (isCodPayment(type, handle)) return false;
  const t = (type || "").toLowerCase();
  const h = (handle || "").toLowerCase();
  if (/bank|deposit|moneyorder|money_order|wire|transfer|ubl/.test(h)) {
    return true;
  }
  if (t === "deferred" || t === "manualpayment" || t === "manual") {
    return true;
  }
  return false;
}

function Extension() {
  const paymentOptions = useSelectedPaymentOptions();
  const discountCodes = useDiscountCodes();
  const instructions = useInstructions();
  const applyDiscountCodeChange = useApplyDiscountCodeChange();
  const busy = useRef(false);
  const [status, setStatus] = useState<"idle" | "applying" | "removing" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const canUpdateCodes = Boolean(
    instructions?.discounts?.canUpdateDiscountCodes,
  );

  const selection = useMemo(() => {
    const opts = paymentOptions || [];
    const bank = opts.some((o) => isBankPayment(o.type || "", o.handle || ""));
    const cod = opts.some((o) => isCodPayment(o.type || "", o.handle || ""));
    return { bank, cod, empty: opts.length === 0 };
  }, [paymentOptions]);

  const hasCode = (discountCodes || []).some(
    (d) => (d.code || "").toUpperCase() === DISCOUNT_CODE,
  );

  useEffect(() => {
    if (busy.current || selection.empty || !canUpdateCodes) return;

    const desired =
      selection.bank && !hasCode
        ? "add"
        : selection.cod && hasCode
          ? "remove"
          : "noop";

    if (desired === "noop") {
      setStatus("idle");
      return;
    }

    const run = async () => {
      busy.current = true;
      setStatus(desired === "add" ? "applying" : "removing");
      setErrorMessage("");
      try {
        const result = await applyDiscountCodeChange(
          desired === "add"
            ? { type: "addDiscountCode", code: DISCOUNT_CODE }
            : { type: "removeDiscountCode", code: DISCOUNT_CODE },
        );
        if (result && "type" in result && result.type === "error") {
          setStatus("error");
          setErrorMessage(
            ("message" in result && String(result.message)) ||
              "Could not update discount",
          );
        } else {
          setStatus("idle");
        }
      } catch (error) {
        console.error("Bank transfer discount sync failed", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Could not update discount",
        );
      } finally {
        busy.current = false;
      }
    };

    void run();
  }, [
    applyDiscountCodeChange,
    canUpdateCodes,
    hasCode,
    selection.bank,
    selection.cod,
    selection.empty,
  ]);

  if (!canUpdateCodes) {
    return null;
  }

  if (selection.bank) {
    return (
      <Banner
        status={status === "error" ? "critical" : "success"}
        title={hasCode ? "7% OFF applied" : "Applying 7% OFF…"}
      >
        <Text emphasis="bold">7% OFF</Text>
        <Text>
          {" "}
          {hasCode
            ? "is applied for Bank Deposit. Your total updates automatically."
            : "is being applied for Bank Deposit — your total will update in a moment."}
        </Text>
        {status === "error" && errorMessage ? (
          <Text>{` ${errorMessage}`}</Text>
        ) : null}
      </Banner>
    );
  }

  if (selection.cod) {
    if (hasCode || status === "removing") {
      return (
        <Banner status="info" title="Updating total for Cash on Delivery">
          <Text>
            Removing the bank-transfer 7% off so Cash on Delivery is charged at
            full price.
          </Text>
        </Banner>
      );
    }
    return (
      <Banner status="info" title="Cash on Delivery">
        <Text>
          Full price for COD. Switch to Bank Deposit anytime for automatic 7%
          off.
        </Text>
      </Banner>
    );
  }

  return null;
}

export default reactExtension(
  "purchase.checkout.payment-method-list.render-after",
  () => <Extension />,
);
