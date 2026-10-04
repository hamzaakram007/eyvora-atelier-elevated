# Bank transfer 7% off (Checkout UI Extension)

Applies or removes the `BANK7` discount code on Shopify checkout when the shopper switches between **Bank Deposit** and **Cash on Delivery**.

This covers the case: bag = COD → checkout payment = Bank Deposit (and the reverse).

## Deploy (requires Shopify CLI login)

From the repo root, after `shopify auth login`:

```bash
npm install
cd extensions/bank-transfer-discount && npm install && cd ../..
npx shopify app deploy --client-id "$SHOPIFY_CLIENT_ID" --allow-updates
```

Then in Shopify Admin → Settings → Checkout → Customize → add **Bank transfer 7% off** near the payment methods.

## Backup (already live)

`ORDERS_CREATE` webhook → `https://eyvora-hamzaakram007s-projects.vercel.app/api/shopify/webhooks/orders-create`

If the extension is not installed, the webhook still adds/removes the 7% via order edit after the order is placed.
