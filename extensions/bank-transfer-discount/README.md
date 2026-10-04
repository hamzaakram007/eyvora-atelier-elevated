# Bank transfer 7% off (Checkout UI Extension)

Updates the Shopify checkout **total live** when the shopper switches between
**Bank Deposit** and **Cash on Delivery** by adding/removing the `BANK7` code.

## Why this is required

Shopify hosted checkout does not change discount codes when the payment method
changes unless a Checkout UI Extension (or similar app code) does it.

## Deploy (one-time Shopify login)

From the repo root:

```bash
# Option A — interactive login
npx shopify auth login
npx shopify app deploy --client-id "$SHOPIFY_CLIENT_ID" --allow-updates

# Option B — CI / non-interactive
# Dev Dashboard → Eyvora cursor → Settings → App Automation Token → Create
export SHOPIFY_APP_AUTOMATION_TOKEN="shpat_or_token_value"
npx shopify app deploy --client-id "$SHOPIFY_CLIENT_ID" --allow-updates
```

Then in Shopify Admin → **Settings → Checkout → Customize** → add
**Bank transfer 7% off** under the payment methods block → Save.

## Already live without the extension

1. Bag: Bank transfer applies `BANK7`; COD removes it before opening checkout.
2. `ORDERS_CREATE` webhook adjusts the order after placement if the final
   payment method and discount disagree.
