/**
 * Post-checkout sync for bank-transfer 7% off.
 * Used by the ORDERS_CREATE webhook when the customer changes payment
 * method on Shopify checkout (e.g. bag COD → checkout Bank Deposit).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const DISCOUNT_CODE = "BANK7";
export const DISCOUNT_PERCENT = 7;
export const TAG_APPLIED = "bank7-synced";
export const TAG_REMOVED = "bank7-removed-for-cod";

export type ShopifyOrder = {
  id: number | string;
  admin_graphql_api_id?: string;
  name?: string;
  tags?: string;
  discount_codes?: Array<{ code?: string }>;
  payment_gateway_names?: string[];
  gateway?: string;
  financial_status?: string;
};

function env(name: string) {
  return (process.env[name] || "").trim();
}

export function verifyShopifyHmac(rawBody: string, hmacHeader: string | null) {
  const secret = env("SHOPIFY_CLIENT_SECRET") || env("SHOPIFY_WEBHOOK_SECRET");
  if (!secret || !hmacHeader) return false;
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  try {
    const a = Buffer.from(digest);
    const b = Buffer.from(hmacHeader);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function paymentHaystack(order: ShopifyOrder) {
  return [order.gateway || "", ...(order.payment_gateway_names || [])]
    .join(" ")
    .toLowerCase();
}

export function isBankDeposit(order: ShopifyOrder) {
  const hay = paymentHaystack(order);
  if (/cash\s*on\s*delivery|\bcod\b|payment_on_delivery|paymentondelivery/.test(hay)) {
    return false;
  }
  return /bank\s*deposit|bank\s*transfer|money\s*order|wire|ubl|manual/.test(hay);
}

export function isCod(order: ShopifyOrder) {
  const hay = paymentHaystack(order);
  return /cash\s*on\s*delivery|\bcod\b|payment_on_delivery|paymentondelivery/.test(
    hay,
  );
}

export function hasBankDiscount(order: ShopifyOrder) {
  const codes = (order.discount_codes || []).map((d) => (d.code || "").toUpperCase());
  if (codes.includes(DISCOUNT_CODE)) return true;
  const tags = (order.tags || "").toLowerCase();
  return tags.includes(TAG_APPLIED) || tags.includes("bank-transfer-7-off");
}

async function adminToken() {
  const domain = env("SHOPIFY_STORE_DOMAIN")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const shop = domain.replace(/\.myshopify\.com$/i, "");
  const clientId = env("SHOPIFY_CLIENT_ID");
  const clientSecret = env("SHOPIFY_CLIENT_SECRET");
  if (!domain || !clientId || !clientSecret) {
    throw new Error("Missing Shopify Admin env vars");
  }
  const res = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error(`Token failed: ${JSON.stringify(json)}`);
  return { token: json.access_token, domain };
}

async function adminGraphql(
  domain: string,
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
) {
  const res = await fetch(`https://${domain}/admin/api/2025-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

async function addTags(
  domain: string,
  token: string,
  orderGid: string,
  tags: string[],
) {
  await adminGraphql(
    domain,
    token,
    `mutation tagsAdd($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        userErrors { message }
      }
    }`,
    { id: orderGid, tags },
  );
}

async function applyBankDiscount(
  domain: string,
  token: string,
  orderGid: string,
) {
  const began = await adminGraphql(
    domain,
    token,
    `mutation orderEditBegin($id: ID!) {
      orderEditBegin(id: $id) {
        calculatedOrder {
          id
          lineItems(first: 50) {
            edges { node { id quantity } }
          }
        }
        userErrors { field message }
      }
    }`,
    { id: orderGid },
  );

  const beginErrors = began.orderEditBegin?.userErrors || [];
  if (beginErrors.length) {
    throw new Error(`orderEditBegin: ${JSON.stringify(beginErrors)}`);
  }

  const calculated = began.orderEditBegin?.calculatedOrder;
  if (!calculated?.id) throw new Error("No calculated order");

  for (const edge of calculated.lineItems.edges || []) {
    const lineItemId = edge.node.id as string;
    const result = await adminGraphql(
      domain,
      token,
      `mutation orderEditAddLineItemDiscount(
        $id: ID!
        $lineItemId: ID!
        $discount: OrderEditAppliedDiscountInput!
      ) {
        orderEditAddLineItemDiscount(
          id: $id
          lineItemId: $lineItemId
          discount: $discount
        ) {
          userErrors { field message }
        }
      }`,
      {
        id: calculated.id,
        lineItemId,
        discount: {
          description: `Bank transfer ${DISCOUNT_PERCENT}% off`,
          percentValue: DISCOUNT_PERCENT,
        },
      },
    );
    const errors = result.orderEditAddLineItemDiscount?.userErrors || [];
    if (errors.length) {
      throw new Error(`line discount: ${JSON.stringify(errors)}`);
    }
  }

  const committed = await adminGraphql(
    domain,
    token,
    `mutation orderEditCommit($id: ID!, $notifyCustomer: Boolean) {
      orderEditCommit(
        id: $id
        notifyCustomer: $notifyCustomer
        staffNote: "Applied automatic bank transfer 7% off"
      ) {
        order { id name totalPriceSet { shopMoney { amount } } }
        userErrors { field message }
      }
    }`,
    { id: calculated.id, notifyCustomer: true },
  );
  const commitErrors = committed.orderEditCommit?.userErrors || [];
  if (commitErrors.length) {
    throw new Error(`orderEditCommit: ${JSON.stringify(commitErrors)}`);
  }

  await addTags(domain, token, orderGid, [TAG_APPLIED, "bank-transfer-7-off"]);
  return committed.orderEditCommit?.order;
}

async function removeBankDiscountIfPresent(
  domain: string,
  token: string,
  orderGid: string,
  order: ShopifyOrder,
) {
  const began = await adminGraphql(
    domain,
    token,
    `mutation orderEditBegin($id: ID!) {
      orderEditBegin(id: $id) {
        calculatedOrder {
          id
          discountApplications(first: 20) {
            edges {
              node {
                ... on CalculatedDiscountApplication {
                  id
                  description
                  value { ... on PricingPercentageValue { percentage } }
                }
              }
            }
          }
          lineItems(first: 50) {
            edges {
              node {
                id
                calculatedDiscountAllocations {
                  discountApplication {
                    ... on CalculatedDiscountApplication {
                      id
                      description
                      value {
                        ... on PricingPercentageValue { percentage }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }`,
    { id: orderGid },
  );

  const beginErrors = began.orderEditBegin?.userErrors || [];
  if (beginErrors.length) {
    if (hasBankDiscount(order)) {
      await addTags(domain, token, orderGid, ["review-cod-with-discount"]);
    }
    return null;
  }

  const calculated = began.orderEditBegin?.calculatedOrder;
  if (!calculated?.id) return null;

  const candidates: Array<{ id?: string; description?: string; percentage?: number }> =
    [];
  for (const edge of calculated.lineItems.edges || []) {
    for (const alloc of edge.node.calculatedDiscountAllocations || []) {
      const app = alloc.discountApplication;
      if (app) {
        candidates.push({
          id: app.id,
          description: app.description,
          percentage: app.value?.percentage,
        });
      }
    }
  }
  for (const edge of calculated.discountApplications?.edges || []) {
    const app = edge.node;
    if (app) {
      candidates.push({
        id: app.id,
        description: app.description,
        percentage: app.value?.percentage,
      });
    }
  }

  const seen = new Set<string>();
  let removed = 0;
  for (const app of candidates) {
    if (!app?.id || seen.has(app.id)) continue;
    const desc = (app.description || "").toLowerCase();
    const pct = app.percentage;
    const isBankDisc =
      desc.includes("bank transfer") ||
      desc.includes("bank7") ||
      desc.includes(DISCOUNT_CODE.toLowerCase()) ||
      pct === DISCOUNT_PERCENT;
    if (!isBankDisc) continue;
    seen.add(app.id);

    const result = await adminGraphql(
      domain,
      token,
      `mutation orderEditRemoveDiscount($id: ID!, $discountApplicationId: ID!) {
        orderEditRemoveDiscount(id: $id, discountApplicationId: $discountApplicationId) {
          userErrors { field message }
        }
      }`,
      { id: calculated.id, discountApplicationId: app.id },
    );
    const errors = result.orderEditRemoveDiscount?.userErrors || [];
    if (!errors.length) removed += 1;
  }

  if (removed > 0) {
    const committed = await adminGraphql(
      domain,
      token,
      `mutation orderEditCommit($id: ID!, $notifyCustomer: Boolean) {
        orderEditCommit(
          id: $id
          notifyCustomer: $notifyCustomer
          staffNote: "Removed bank-transfer discount for COD order"
        ) {
          order { id name }
          userErrors { field message }
        }
      }`,
      { id: calculated.id, notifyCustomer: true },
    );
    const commitErrors = committed.orderEditCommit?.userErrors || [];
    if (commitErrors.length) {
      throw new Error(`orderEditCommit remove: ${JSON.stringify(commitErrors)}`);
    }
    await addTags(domain, token, orderGid, [TAG_REMOVED]);
    return committed.orderEditCommit?.order;
  }

  // Discount code on the order may not be removable via order edit — flag for staff.
  if (hasBankDiscount(order)) {
    await addTags(domain, token, orderGid, ["review-cod-with-discount"]);
  }
  return null;
}

export type SyncResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  action?: string;
  order?: string;
  total?: string;
  error?: string;
  payment?: string[];
};

export async function syncBank7ForOrder(order: ShopifyOrder): Promise<SyncResult> {
  const orderGid =
    order.admin_graphql_api_id || `gid://shopify/Order/${order.id}`;

  const tags = (order.tags || "").toLowerCase();
  if (tags.includes(TAG_APPLIED) || tags.includes(TAG_REMOVED)) {
    return { ok: true, skipped: true, reason: "already-synced", order: order.name };
  }

  const { token, domain } = await adminToken();

  if (isBankDeposit(order) && !hasBankDiscount(order)) {
    const updated = await applyBankDiscount(domain, token, orderGid);
    return {
      ok: true,
      action: "applied-bank-discount",
      order: order.name,
      total: updated?.totalPriceSet?.shopMoney?.amount,
    };
  }

  if (isCod(order) && hasBankDiscount(order)) {
    await removeBankDiscountIfPresent(domain, token, orderGid, order);
    return {
      ok: true,
      action: "removed-bank-discount-for-cod",
      order: order.name,
    };
  }

  return {
    ok: true,
    skipped: true,
    reason: "no-change-needed",
    order: order.name,
    payment: order.payment_gateway_names,
  };
}
