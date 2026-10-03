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

1. Archive old demo products
2. Import `shopify-seed/eyvora-launch-products.csv`
3. Create collections: `hoodies`, `trousers`, `couple`
4. Upload photos from `src/assets/products/`
5. Configure payments + shipping

## 4) Launch checks

- [ ] Vercel site loads new EYVORA design
- [ ] Products show PKR 4399 / 2499
- [ ] Size → Add to bag → Shopify checkout works
- [ ] WhatsApp button works
- [ ] Password protection disabled
- [ ] No Lovable URL in the live path
