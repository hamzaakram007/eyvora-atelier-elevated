#!/usr/bin/env node
/**
 * Registers ORDERS_CREATE webhook that syncs bank-transfer 7% off after checkout.
 */
import { existsSync } from "node:fs";

if (existsSync(".env")) process.loadEnvFile(".env");

const DOMAIN = (
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.VITE_SHOPIFY_STORE_DOMAIN ||
  ""
)
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");
const SHOP = DOMAIN.replace(/\.myshopify\.com$/i, "");
// Shopify blocks webhooks to the shop's own primary domains (eyvora.pk).
// Use the stable Vercel project alias instead.
const CALLBACK =
  process.env.SHOPIFY_ORDERS_WEBHOOK_URL ||
  "https://eyvora-hamzaakram007s-projects.vercel.app/api/shopify/webhooks/orders-create";

async function token() {
  const res = await fetch(`https://${SHOP}.myshopify.com/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SHOPIFY_CLIENT_ID || "",
      client_secret: process.env.SHOPIFY_CLIENT_SECRET || "",
    }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(JSON.stringify(json));
  return json.access_token;
}

async function admin(t, query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": t,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

const t = await token();

const existing = await admin(
  t,
  `{
    webhookSubscriptions(first: 50, topics: ORDERS_CREATE) {
      edges { node { id callbackUrl topic } }
    }
  }`,
);

const already = (existing.webhookSubscriptions?.edges || []).find(
  (e) => e.node.callbackUrl === CALLBACK,
);
if (already) {
  console.log("✓ webhook already registered:", already.node.id);
  process.exit(0);
}

// Remove stale ORDERS_CREATE hooks pointing elsewhere for this app if needed — keep others.
const created = await admin(
  t,
  `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
    webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
      webhookSubscription { id callbackUrl }
      userErrors { field message }
    }
  }`,
  {
    topic: "ORDERS_CREATE",
    webhookSubscription: {
      format: "JSON",
      callbackUrl: CALLBACK,
    },
  },
);

const errors = created.webhookSubscriptionCreate?.userErrors || [];
if (errors.length) {
  console.error(errors);
  process.exit(1);
}
console.log(
  "✓ registered ORDERS_CREATE →",
  created.webhookSubscriptionCreate.webhookSubscription.callbackUrl,
);
