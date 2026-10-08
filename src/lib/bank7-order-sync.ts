/**
 * Post-checkout sync for bank-transfer 7% off.
 * Used by the ORDERS_CREATE webhook when the customer changes payment
 * method on Shopify checkout (e.g. bag COD → checkout Bank Deposit).
 *
 * Headless /checkout draft orders already apply (or skip) the 7% discount
 * themselves — this webhook must never stack a second 7% on those orders.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const DISCOUNT_CODE = "BANK7";
export const DISCOUNT_PERCENT = 7;
export const TAG_APPLIED = "bank7-synced";
export const TAG_REMOVED = "bank7-removed-for-cod";
/** Set by createStorefrontOrder — discount already correct on the draft. */
export const TAG_STOREFRONT_CHECKOUT = "eyvora-storefront-checkout";

export type ShopifyOrder = {
  id: number | string;
  admin_graphql_api_id?: string;
  name?: string;
  tags?: string;
  note?: string;
  discount_codes?: Array<{ code?: string }>;
  payment_gateway_names?: string[];
  gateway?: string;
  financial_status?: string;
  note_attributes?: Array<{ name?: string; value?: string }>;
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

function tagsOf(order: ShopifyOrder) {
  return (order.tags || "").toLowerCase();
}

/**
 * Detect Bank Deposit / bank transfer gateways.
 * Do NOT match bare "manual" — payment-pending draft orders often use
 * gateway "manual" for both COD and bank, which caused a second 7% apply.
 */
export function isBankDeposit(order: ShopifyOrder) {
  const hay = paymentHaystack(order);
  if (/cash\s*on\s*delivery|\bcod\b|payment_on_delivery|paymentondelivery/.test(hay)) {
    return false;
  }
  // Storefront marks payment method explicitly on the order.
  const tags = tagsOf(order);
  if (tags.includes("payment-bank")) return true;
  if (tags.includes("payment-cod")) return false;

  const attrs = order.note_attributes || [];
  for (const attr of attrs) {
    if ((attr.name || "").toLowerCase() === "payment_method") {
      const v = (attr.value || "").toLowerCase();
      if (v === "bank") return true;
      if (v === "cod") return false;
    }
  }

  return /bank\s*deposit|bank\s*transfer|money\s*order|wire|\bubl\b/.test(hay);
}

export function isCod(order: ShopifyOrder) {
  const hay = paymentHaystack(order);
  if (/cash\s*on\s*delivery|\bcod\b|payment_on_delivery|paymentondelivery/.test(hay)) {
    return true;
  }
  const tags = tagsOf(order);
  if (tags.includes("payment-cod")) return true;
  if (tags.includes("payment-bank")) return false;

  const attrs = order.note_attributes || [];
  for (const attr of attrs) {
    if ((attr.name || "").toLowerCase() === "payment_method") {
      return (attr.value || "").toLowerCase() === "cod";
    }
  }
  return false;
}

export function hasBankDiscount(order: ShopifyOrder) {
  const codes = (order.discount_codes || []).map((d) => (d.code || "").toUpperCase());
  if (codes.includes(DISCOUNT_CODE)) return true;
  const tags = tagsOf(order);
  if (
    tags.includes(TAG_APPLIED) ||
    tags.includes("bank-transfer-7-off") ||
    tags.includes(DISCOUNT_CODE.toLowerCase())
  ) {
    return true;
  }
  const note = (order.note || "").toLowerCase();
  return (
    note.includes("bank transfer") &&
    (note.includes("7% off") || note.includes(DISCOUNT_CODE.toLowerCase()))
  );
}

/** Headless /checkout already applied the correct bank/COD total on the draft. */
export function isStorefrontCheckoutOrder(order: ShopifyOrder) {
  return tagsOf(order).includes(TAG_STOREFRONT_CHECKOUT);
}

function looksLikeBankDiscountApp(app: {
  description?: string | null;
  percentage?: number | null;
  title?: string | null;
}) {
  const desc = `${app.description || ""} ${app.title || ""}`.toLowerCase();
  const pct = app.percentage;
  return (
    desc.includes("bank transfer") ||
    desc.includes("bank7") ||
    desc.includes(DISCOUNT_CODE.toLowerCase()) ||
    pct === DISCOUNT_PERCENT
  );
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

/** Authoritative order state — webhook payloads can omit tags briefly. */
async function fetchLiveOrder(
  domain: string,
  token: string,
  orderGid: string,
): Promise<ShopifyOrder | null> {
  const data = await adminGraphql(
    domain,
    token,
    `query ($id: ID!) {
      order(id: $id) {
        id
        name
        tags
        note
        paymentGatewayNames
        discountCodes
        customAttributes { key value }
        discountApplications(first: 20) {
          edges {
            node {
              ... on DiscountApplication {
                __typename
              }
              ... on ManualDiscountApplication {
                title
                value { ... on PricingPercentageValue { percentage } }
              }
              ... on DiscountCodeApplication {
                code
                value { ... on PricingPercentageValue { percentage } }
              }
            }
          }
        }
      }
    }`,
    { id: orderGid },
  );

  const order = data?.order;
  if (!order) return null;

  const attrs = (order.customAttributes || []).map(
    (a: { key?: string; value?: string }) => ({
      name: a.key,
      value: a.value,
    }),
  );

  const codes: Array<{ code?: string }> = [];
  for (const edge of order.discountApplications?.edges || []) {
    const node = edge.node;
    if (node?.code) codes.push({ code: node.code });
  }
  for (const code of order.discountCodes || []) {
    if (typeof code === "string") codes.push({ code });
  }

  // If any discount application already looks like BANK7, mirror that into tags
  // so hasBankDiscount short-circuits without another apply.
  let tags = Array.isArray(order.tags) ? order.tags.join(", ") : order.tags || "";
  for (const edge of order.discountApplications?.edges || []) {
    const node = edge.node || {};
    const percentage = node.value?.percentage;
    if (
      looksLikeBankDiscountApp({
        description: node.title,
        title: node.title,
        percentage,
      }) ||
      (node.code || "").toUpperCase() === DISCOUNT_CODE
    ) {
      if (!tags.toLowerCase().includes(TAG_APPLIED)) {
        tags = tags ? `${tags}, ${TAG_APPLIED}` : TAG_APPLIED;
      }
      break;
    }
  }

  return {
    id: order.id,
    admin_graphql_api_id: order.id,
    name: order.name,
    tags,
    note: order.note || "",
    discount_codes: codes,
    payment_gateway_names: order.paymentGatewayNames || [],
    note_attributes: attrs,
  };
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
                quantity
                calculatedDiscountAllocations {
                  discountApplication {
                    ... on CalculatedDiscountApplication {
                      id
                      description
                      value { ... on PricingPercentageValue { percentage } }
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
    throw new Error(`orderEditBegin: ${JSON.stringify(beginErrors)}`);
  }

  const calculated = began.orderEditBegin?.calculatedOrder;
  if (!calculated?.id) throw new Error("No calculated order");

  // Already has a bank / 7% discount from draft or code — do not stack.
  for (const edge of calculated.discountApplications?.edges || []) {
    const app = edge.node;
    if (
      looksLikeBankDiscountApp({
        description: app?.description,
        percentage: app?.value?.percentage,
      })
    ) {
      await addTags(domain, token, orderGid, [TAG_APPLIED, "bank-transfer-7-off"]);
      return null;
    }
  }

  let discountedLines = 0;
  for (const edge of calculated.lineItems.edges || []) {
    const line = edge.node;
    const already = (line.calculatedDiscountAllocations || []).some(
      (alloc: {
        discountApplication?: { description?: string; value?: { percentage?: number } };
      }) =>
        looksLikeBankDiscountApp({
          description: alloc.discountApplication?.description,
          percentage: alloc.discountApplication?.value?.percentage,
        }),
    );
    if (already) continue;

    const lineItemId = line.id as string;
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
    discountedLines += 1;
  }

  if (discountedLines === 0) {
    await addTags(domain, token, orderGid, [TAG_APPLIED, "bank-transfer-7-off"]);
    return null;
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
    if (!looksLikeBankDiscountApp(app)) continue;
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

  // Fast path from webhook payload.
  if (isStorefrontCheckoutOrder(order)) {
    return {
      ok: true,
      skipped: true,
      reason: "storefront-checkout-already-priced",
      order: order.name,
    };
  }

  const tags = tagsOf(order);
  if (tags.includes(TAG_APPLIED) || tags.includes(TAG_REMOVED)) {
    return { ok: true, skipped: true, reason: "already-synced", order: order.name };
  }

  const { token, domain } = await adminToken();

  // Webhook payloads can omit tags right after draftOrderComplete — re-fetch.
  const live = (await fetchLiveOrder(domain, token, orderGid)) || order;

  if (isStorefrontCheckoutOrder(live)) {
    return {
      ok: true,
      skipped: true,
      reason: "storefront-checkout-already-priced",
      order: live.name || order.name,
    };
  }

  const liveTags = tagsOf(live);
  if (liveTags.includes(TAG_APPLIED) || liveTags.includes(TAG_REMOVED)) {
    return {
      ok: true,
      skipped: true,
      reason: "already-synced",
      order: live.name || order.name,
    };
  }

  if (isBankDeposit(live) && !hasBankDiscount(live)) {
    const updated = await applyBankDiscount(domain, token, orderGid);
    return {
      ok: true,
      action: updated ? "applied-bank-discount" : "already-had-bank-discount",
      order: live.name || order.name,
      total: updated?.totalPriceSet?.shopMoney?.amount,
    };
  }

  if (isCod(live) && hasBankDiscount(live)) {
    await removeBankDiscountIfPresent(domain, token, orderGid, live);
    return {
      ok: true,
      action: "removed-bank-discount-for-cod",
      order: live.name || order.name,
    };
  }

  return {
    ok: true,
    skipped: true,
    reason: "no-change-needed",
    order: live.name || order.name,
    payment: live.payment_gateway_names || order.payment_gateway_names,
  };
}
