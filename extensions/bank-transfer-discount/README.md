# Bank transfer 7% off (Checkout UI Extension)

**Status: released** as app version `eyvora-storefront-2` on app **EYVORA Storefront**.

Updates the Shopify checkout **total live** when the shopper switches between
**Bank Deposit** and **Cash on Delivery** by adding/removing the `BANK7` code.

Target: `purchase.checkout.payment-method-list.render-after`

## Redeploy

```bash
export SHOPIFY_APP_AUTOMATION_TOKEN="..."   # optional for CI
npx shopify app deploy --client-id "$SHOPIFY_CLIENT_ID" --allow-updates
```

If the banner does not appear under payment methods, open Shopify Admin →
**Settings → Checkout → Customize**, confirm the app extension is enabled, Save.

## Related storefront behaviour

1. Bag: Bank transfer applies `BANK7`; COD removes it before opening checkout.
2. `ORDERS_CREATE` webhook adjusts the order after placement if needed.
