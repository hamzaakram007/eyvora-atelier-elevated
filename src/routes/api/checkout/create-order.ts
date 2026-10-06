import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  createStorefrontOrder,
  type CheckoutPaymentMethod,
} from "@/lib/create-storefront-order";
import { normalizePakistanPhone } from "@/lib/site";

const bodySchema = z.object({
  paymentMethod: z.enum(["cod", "bank"]),
  customer: z.object({
    fullName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(10).max(20),
    email: z.union([z.string().trim().email(), z.literal("")]).optional(),
    address1: z.string().trim().min(5).max(200),
    address2: z.union([z.string().trim().max(200), z.literal("")]).optional(),
    city: z.string().trim().min(2).max(80),
    province: z.union([z.string().trim().max(80), z.literal("")]).optional(),
    postalCode: z.union([z.string().trim().max(20), z.literal("")]).optional(),
    note: z.union([z.string().trim().max(500), z.literal("")]).optional(),
  }),
  lines: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
        title: z.string().optional(),
      }),
    )
    .min(1)
    .max(50),
});

export const Route = createFileRoute("/api/checkout/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json(
            { ok: false, error: "Invalid JSON body" },
            { status: 400 },
          );
        }

        const parsed = bodySchema.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            {
              ok: false,
              error: "Please check your details and try again.",
              details: parsed.error.flatten(),
            },
            { status: 400 },
          );
        }

        const phone = normalizePakistanPhone(parsed.data.customer.phone);
        if (!phone) {
          return Response.json(
            {
              ok: false,
              error: "Enter a valid Pakistan mobile number (e.g. 03XX XXXXXXX).",
            },
            { status: 400 },
          );
        }

        const invalidVariant = parsed.data.lines.find(
          (line) => !line.variantId.startsWith("gid://shopify/ProductVariant/"),
        );
        if (invalidVariant) {
          return Response.json(
            {
              ok: false,
              error:
                "One or more bag items are not synced with Shopify yet. Refresh the page and try again.",
            },
            { status: 400 },
          );
        }

        try {
          const result = await createStorefrontOrder({
            paymentMethod: parsed.data.paymentMethod as CheckoutPaymentMethod,
            customer: {
              ...parsed.data.customer,
              phone,
              email: parsed.data.customer.email || undefined,
              address2: parsed.data.customer.address2 || undefined,
              province: parsed.data.customer.province || undefined,
              postalCode: parsed.data.customer.postalCode || undefined,
              note: parsed.data.customer.note || undefined,
            },
            lines: parsed.data.lines,
          });

          return Response.json({ ok: true, ...result });
        } catch (error) {
          console.error("[checkout create-order]", error);
          const message =
            error instanceof Error ? error.message : "Could not place order";
          return Response.json(
            {
              ok: false,
              error:
                message.length < 220
                  ? message
                  : "Could not place the order. Please try again or contact EYVORA.",
            },
            { status: 502 },
          );
        }
      },
    },
  },
});
