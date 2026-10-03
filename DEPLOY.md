# EYVORA — Independent Deploy (No Lovable)

## Architecture

- **GitHub** → source code
- **Vercel** → website hosting
- **Shopify** → products, cart, checkout, payments, orders

Lovable is not required.

## 1) Vercel deploy

### Fast claim (if a temporary deploy URL was created)

1. Open the claim link provided by Cursor
2. Sign in with GitHub / Vercel
3. Claim the deployment into your account
4. Then connect the GitHub repo for permanent auto-deploys

### Permanent project setup

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import `hamzaakram007/eyvora-atelier-elevated`
3. Add environment variables:

```bash
VITE_SHOPIFY_STORE_DOMAIN=eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=YOUR_STOREFRONT_TOKEN
VITE_WHATSAPP_NUMBER=92XXXXXXXXXX
VITE_WHATSAPP_MESSAGE=Hello EYVORA, I need help with your products.
```

4. Deploy
5. Copy the Vercel URL (example: `https://eyvora-xxx.vercel.app`)

### CLI alternative

```bash
npx vercel login
npx vercel link
npx vercel env add VITE_SHOPIFY_STOREFRONT_TOKEN
npx vercel env add VITE_SHOPIFY_STORE_DOMAIN
npx vercel --prod
```

## 2) Point eyvora.pk away from Lovable

### Fast option
Shopify Admin → Online Store → Themes → Redirect theme settings  
Change destination from Lovable URL → your Vercel URL

### Clean option
Vercel → Project → Domains → add `eyvora.pk`  
Update DNS at your domain provider as Vercel instructs

## 3) Replace demo products in Shopify

### Fastest: CSV import (no Admin API needed)
1. Shopify Admin → **Products** → **Import**
2. Upload `shopify-seed/eyvora-launch-products.csv`
3. Archive old demo products
4. Create collections: `hoodies`, `trousers`, `couple`
5. Upload photos from `src/assets/products/`
6. Configure payments + shipping

### Optional: real Admin API (Dev Dashboard — current Shopify path)
Shopify no longer lets you create new “Develop apps” custom apps that show a permanent `shpat_` token in Admin. Use the Dev Dashboard instead:

1. Open [dev.shopify.com/dashboard](https://dev.shopify.com/dashboard) (same Shopify account that owns the store)
2. **Apps** → **Create app** → **Start from Dev Dashboard** → name it `EYVORA Admin Seed`
3. Create a **Version**:
   - App URL: `https://shopify.dev/apps/default-app-home`
   - Scopes: `write_products`, `write_files` (optional: `read_orders`)
   - Release the version
4. **Install app** on your EYVORA store and approve scopes
5. App → **Settings** → copy **Client ID** + **Client secret**
6. Run seed locally (do not commit secrets):

```bash
export SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
export SHOPIFY_CLIENT_ID=...
export SHOPIFY_CLIENT_SECRET=...
export ARCHIVE_DEMO_PRODUCTS=true
node scripts/seed-shopify-launch.mjs
```

If you still have an older Admin custom app with a visible `shpat_` token, that also works via `SHOPIFY_ADMIN_API_TOKEN`.

## 4) Launch checks

- [ ] Vercel site loads new EYVORA design
- [ ] Products show PKR 4399 / 2499
- [ ] Size → Add to bag → Shopify checkout works
- [ ] WhatsApp button works
- [ ] Password protection disabled
- [ ] No Lovable URL in the live path
