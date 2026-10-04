/**
 * Shared Shopify Admin GraphQL client (server-only).
 * Uses Dev Dashboard client_credentials or a legacy Admin token.
 */

export const SHOPIFY_ADMIN_API_VERSION = "2025-07";

function env(name: string) {
  return (process.env[name] || "").trim();
}

export function shopifyStoreDomain() {
  return (
    env("SHOPIFY_STORE_DOMAIN") ||
    env("VITE_SHOPIFY_STORE_DOMAIN") ||
    "eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com"
  )
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

let cachedToken = "";
let tokenExpiresAt = 0;

export async function getShopifyAdminToken(): Promise<{
  token: string;
  domain: string;
}> {
  const domain = shopifyStoreDomain();
  const legacy = env("SHOPIFY_ADMIN_API_TOKEN");
  if (legacy) {
    return { token: legacy, domain };
  }

  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return { token: cachedToken, domain };
  }

  const shop = domain.replace(/\.myshopify\.com$/i, "");
  const clientId = env("SHOPIFY_CLIENT_ID");
  const clientSecret = env("SHOPIFY_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
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
  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    errors?: unknown;
  };
  if (!json.access_token) {
    throw new Error(`Token failed: ${JSON.stringify(json)}`);
  }

  cachedToken = json.access_token;
  tokenExpiresAt = Date.now() + (json.expires_in || 86399) * 1000;
  return { token: cachedToken, domain };
}

export async function adminGraphql<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const { token, domain } = await getShopifyAdminToken();
  const res = await fetch(
    `https://${domain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const json = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (json.errors?.length) {
    throw new Error(JSON.stringify(json.errors));
  }
  if (!json.data) {
    throw new Error("Admin GraphQL returned no data");
  }
  return json.data;
}
