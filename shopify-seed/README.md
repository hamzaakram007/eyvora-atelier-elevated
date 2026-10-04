# EYVORA Shopify Launch Seed

The live Shopify Admin currently contains a temporary demo catalogue with incorrect titles and prices.

## Verified launch catalogue

| Product | Handle | Price | Sizes | Color |
|---|---|---|---|---|
| EYVORA Olive Green Hoodie | `olive-green-hoodie` | PKR 4,399 | S / M / L / XL | Olive Green |
| EYVORA Black Hoodie | `black-hoodie` | PKR 4,399 | S / M / L / XL | Black |
| EYVORA Grey Trousers | `grey-trousers` | PKR 2,499 | S / M / L / XL | Grey |
| EYVORA Black Trousers | `black-trousers` | PKR 2,499 | S / M / L / XL | Black |

Total: **4 products / 12 variants**

## Import steps (Shopify Admin)

1. Archive or delete the demo products (Essential / Signature / Classic / Premium Relaxed).
2. Go to **Products → Import** and upload `eyvora-launch-products.csv`.
3. Upload authentic photography from `src/assets/products/*` onto each product (primary, secondary, front, back, lifestyle, detail).
4. Create collections:
   - `hoodies`
   - `trousers`
   - `couple`
   - keep `/collections/all`
5. Set inventory quantities only when real stock is confirmed.
6. Configure payments (COD / bank transfer / gateway) and shipping in Shopify Admin.
7. Set the storefront WhatsApp number via `VITE_WHATSAPP_NUMBER`.

Until the handles above exist in Shopify, the storefront displays the verified launch catalogue with authentic images. Shopify Cart / Checkout activate automatically once matching product handles and Storefront-available variants are published.
