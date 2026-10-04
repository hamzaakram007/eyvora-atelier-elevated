#!/usr/bin/env node
import { createHmac } from "node:crypto";
import { existsSync } from "node:fs";

if (existsSync(".env")) process.loadEnvFile(".env");

const secret = process.env.SHOPIFY_CLIENT_SECRET;
const url =
  process.env.SHOPIFY_ORDERS_WEBHOOK_URL ||
  "https://eyvora-hamzaakram007s-projects.vercel.app/api/shopify/webhooks/orders-create";

async function post(order) {
  const raw = JSON.stringify(order);
  const hmac = createHmac("sha256", secret).update(raw, "utf8").digest("base64");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Topic": "orders/create",
      "X-Shopify-Hmac-Sha256": hmac,
    },
    body: raw,
  });
  const text = await res.text();
  console.log(order.name, "status", res.status, text);
}

await post({
  id: 999999999001,
  name: "#TEST-BANK7",
  tags: "",
  discount_codes: [],
  payment_gateway_names: ["Bank Deposit"],
  financial_status: "pending",
});

await post({
  id: 999999999002,
  name: "#TEST-COD",
  tags: "",
  discount_codes: [],
  payment_gateway_names: ["Cash on Delivery (COD)"],
  financial_status: "pending",
});
