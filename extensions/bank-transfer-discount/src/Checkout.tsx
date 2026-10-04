import {
  Banner,
  reactExtension,
  Text,
  useApplyDiscountCodeChange,
  useDiscountCodes,
  useSelectedPaymentOptions,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useMemo, useRef } from "react";

const DISCOUNT_CODE = "BANK7";

/**
 * EYVORA checkout payment methods:
 * - Cash on Delivery → type paymentOnDelivery / handle with cash|cod
 * - Bank Deposit → type deferred / handle with bank|deposit|manual
 *
 * When a shopper picks COD in the bag (no BANK7) then switches to Bank
 * Deposit here, we add BANK7. Switching back to COD removes it.
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
  // Shopify manual bank deposit is typically type "deferred"
  if (t === "deferred" || t === "manualpayment" || t === "manual") {
    return true;
  }
  return false;
}

function Extension() {
  const paymentOptions = useSelectedPaymentOptions();
  const discountCodes = useDiscountCodes();
  const applyDiscountCodeChange = useApplyDiscountCodeChange();
  const busy = useRef(false);
  const lastAction = useRef<string>("");

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
    if (busy.current || selection.empty) return;

    const desired =
      selection.bank && !hasCode
        ? "add"
        : selection.cod && hasCode
          ? "remove"
          : "noop";

    if (desired === "noop" || lastAction.current === `${desired}-${hasCode}`) {
      return;
    }

    const run = async () => {
      busy.current = true;
      try {
        if (desired === "add") {
          await applyDiscountCodeChange({
            type: "addDiscountCode",
            code: DISCOUNT_CODE,
          });
          lastAction.current = `add-${true}`;
        } else if (desired === "remove") {
          await applyDiscountCodeChange({
            type: "removeDiscountCode",
            code: DISCOUNT_CODE,
          });
          lastAction.current = `remove-${false}`;
        }
      } catch (error) {
        console.error("Bank transfer discount sync failed", error);
        lastAction.current = "";
      } finally {
        busy.current = false;
      }
    };

    void run();
  }, [
    applyDiscountCodeChange,
    hasCode,
    selection.bank,
    selection.cod,
    selection.empty,
  ]);

  if (selection.bank) {
    return (
      <Banner status="success" title="7% OFF applied">
        <Text emphasis="bold">7% OFF</Text>
        <Text>
          {" "}
          is applied automatically for Bank Deposit — even if you chose COD in
          your bag first. No discount code needed.
        </Text>
      </Banner>
    );
  }

  if (selection.cod && hasCode) {
    return (
      <Banner status="info" title="Updating total">
        <Text>
          Bank transfer discount is being removed because Cash on Delivery was
          selected.
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
