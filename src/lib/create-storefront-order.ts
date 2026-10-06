/**
 * Create a Shopify order from the headless /checkout form.
 * Bank transfer applies a 7% draft-order discount; COD is full price.
 */
import {
  BANK_TRANSFER_DISCOUNT_CODE,
  BANK_TRANSFER_DISCOUNT_PERCENT,
} from "@/lib/site";
import { adminGraphql } from "@/lib/shopify-admin";

/** Keep in sync with bank7-order-sync TAG_APPLIED so the webhook skips double-apply. */
const TAG_BANK7_APPLIED = "bank7-synced";

export type CheckoutPaymentMethod = "cod" | "bank";

export type CheckoutLineInput = {
  variantId: string;
  quantity: number;
  title?: string;
};

export type CheckoutCustomerInput = {
  fullName: string;
  phone: string;
  email?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  postalCode?: string;
  note?: string;
};

export type CreateStorefrontOrderInput = {
  paymentMethod: CheckoutPaymentMethod;
  customer: CheckoutCustomerInput;
  lines: CheckoutLineInput[];
};

export type CreateStorefrontOrderResult = {
  orderId: string;
  orderName: string;
  total: string;
  currencyCode: string;
  paymentMethod: CheckoutPaymentMethod;
  discountPercent: number;
};

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Customer", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

const DRAFT_CREATE = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        totalPrice
        currencyCode
      }
      userErrors { field message }
    }
  }
`;

const DRAFT_COMPLETE = `
  mutation draftOrderComplete($id: ID!, $paymentPending: Boolean) {
    draftOrderComplete(id: $id, paymentPending: $paymentPending) {
      draftOrder {
        order {
          id
          name
          displayFinancialStatus
          totalPriceSet { shopMoney { amount currencyCode } }
          tags
        }
      }
      userErrors { field message }
    }
  }
`;

export async function createStorefrontOrder(
  input: CreateStorefrontOrderInput,
): Promise<CreateStorefrontOrderResult> {
  if (!input.lines.length) {
    throw new Error("Bag is empty");
  }

  const { firstName, lastName } = splitName(input.customer.fullName);
  const paymentMethod = input.paymentMethod;
  const isBank = paymentMethod === "bank";

  const address = {
    firstName,
    lastName: lastName || firstName,
    phone: input.customer.phone,
    address1: input.customer.address1,
    address2: input.customer.address2 || undefined,
    city: input.customer.city,
    province: input.customer.province || undefined,
    zip: input.customer.postalCode || undefined,
    countryCode: "PK" as const,
  };

  const noteParts = [
    isBank
      ? `Payment: Bank transfer (UBL). ${BANK_TRANSFER_DISCOUNT_PERCENT}% off applied (${BANK_TRANSFER_DISCOUNT_CODE}). Customer will send payment proof.`
      : "Payment: Cash on Delivery (COD). Full price.",
    input.customer.note?.trim() ? `Customer note: ${input.customer.note.trim()}` : "",
  ].filter(Boolean);

  const tags = [
    "eyvora-storefront-checkout",
    isBank ? "payment-bank" : "payment-cod",
    ...(isBank
      ? [
          TAG_BANK7_APPLIED,
          "bank-transfer-7-off",
          BANK_TRANSFER_DISCOUNT_CODE.toLowerCase(),
        ]
      : []),
  ];

  const draftInput: Record<string, unknown> = {
    lineItems: input.lines.map((line) => ({
      variantId: line.variantId,
      quantity: line.quantity,
    })),
    shippingAddress: address,
    billingAddress: address,
    email: input.customer.email || undefined,
    note: noteParts.join("\n"),
    tags,
    taxExempt: true,
    acceptAutomaticDiscounts: false,
    shippingLine: {
      title: "Free shipping — Pakistan",
      price: "0.00",
    },
    customAttributes: [
      { key: "payment_method", value: paymentMethod },
      { key: "checkout_source", value: "eyvora.pk/checkout" },
    ],
  };

  if (isBank) {
    draftInput.appliedDiscount = {
      title: `${BANK_TRANSFER_DISCOUNT_CODE} bank transfer`,
      description: `Bank transfer ${BANK_TRANSFER_DISCOUNT_PERCENT}% off`,
      value: BANK_TRANSFER_DISCOUNT_PERCENT,
      valueType: "PERCENTAGE",
    };
  }

  const created = await adminGraphql<{
    draftOrderCreate: {
      draftOrder: {
        id: string;
        name: string;
        totalPrice: string;
        currencyCode: string;
      } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(DRAFT_CREATE, { input: draftInput });

  const createErrors = created.draftOrderCreate?.userErrors || [];
  if (createErrors.length) {
    throw new Error(createErrors.map((e) => e.message).join("; "));
  }

  const draft = created.draftOrderCreate?.draftOrder;
  if (!draft?.id) {
    throw new Error("Draft order was not created");
  }

  const completed = await adminGraphql<{
    draftOrderComplete: {
      draftOrder: {
        order: {
          id: string;
          name: string;
          totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
        } | null;
      } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(DRAFT_COMPLETE, { id: draft.id, paymentPending: true });

  const completeErrors = completed.draftOrderComplete?.userErrors || [];
  if (completeErrors.length) {
    throw new Error(completeErrors.map((e) => e.message).join("; "));
  }

  const order = completed.draftOrderComplete?.draftOrder?.order;
  if (!order?.id || !order.name) {
    throw new Error("Order was not completed from draft");
  }

  return {
    orderId: order.id,
    orderName: order.name,
    total: order.totalPriceSet.shopMoney.amount,
    currencyCode: order.totalPriceSet.shopMoney.currencyCode || "PKR",
    paymentMethod,
    discountPercent: isBank ? BANK_TRANSFER_DISCOUNT_PERCENT : 0,
  };
}
