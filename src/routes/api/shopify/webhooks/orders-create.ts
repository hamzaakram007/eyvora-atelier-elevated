import { createFileRoute } from "@tanstack/react-router";
import {
  syncBank7ForOrder,
  verifyShopifyHmac,
  type ShopifyOrder,
} from "@/lib/bank7-order-sync";

/**
 * Shopify ORDERS_CREATE webhook.
 * If a customer picks COD in the bag then switches to Bank Deposit on
 * Shopify checkout (or the reverse), this syncs the 7% bank discount.
 */
export const Route = createFileRoute("/api/shopify/webhooks/orders-create")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const hmac = request.headers.get("x-shopify-hmac-sha256");
        const topic = request.headers.get("x-shopify-topic");

        if (!verifyShopifyHmac(raw, hmac)) {
          return Response.json(
            { ok: false, error: "Invalid webhook HMAC" },
            { status: 401 },
          );
        }

        if (topic && topic !== "orders/create") {
          return Response.json({ ok: true, skipped: true, reason: "topic" });
        }

        let order: ShopifyOrder;
        try {
          order = JSON.parse(raw) as ShopifyOrder;
        } catch {
          return Response.json(
            { ok: false, error: "Invalid JSON" },
            { status: 400 },
          );
        }

        try {
          const result = await syncBank7ForOrder(order);
          return Response.json(result);
        } catch (error) {
          console.error("[shopify webhook orders-create]", error);
          // 200 so Shopify does not endless-retry on logic errors.
          return Response.json({
            ok: false,
            error: error instanceof Error ? error.message : "unknown",
            order: order.name,
          });
        }
      },
    },
  },
});
