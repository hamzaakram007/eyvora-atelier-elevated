# EYVORA — Independent Deploy (No Lovable)

## Architecture

- **GitHub** → source code
- **Vercel** → website hosting
- **Shopify** → products / future native checkout (needs a paid plan to unlock Storefront)
- **Email / WhatsApp** → order intake while Shopify is on trial

Lovable is not required.

## Trial-mode note (current)

Shopify **trial** keeps Online Store password protection on. That locks the Storefront API
(`Online Store channel is locked`), so native cart/checkout cannot run yet.

What already works without buying a plan:

- Vercel storefront with the 4 launch products + photography
- Bag → **Order via Email** (or WhatsApp if `VITE_WHATSAPP_NUMBER` is set)
- Shopify Admin catalogue seeded (products, images, collections, inventory, shipping rates)

After you buy a Shopify plan:

1. Online Store → Preferences → turn **off** password
2. Set `SHOPIFY_CHECKOUT_LOCKED` to `false` in `src/lib/site.ts` (or remove the trial banner)
3. Redeploy — Storefront checkout will activate automatically

## 1) Vercel deploy

Live project URL:

`https://eyvora-hamzaakram007s-projects.vercel.app`

Env vars:

```bash
VITE_SHOPIFY_STORE_DOMAIN=eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=YOUR_STOREFRONT_TOKEN
VITE_CONTACT_EMAIL=hamzaakram090909@gmail.com
VITE_WHATSAPP_NUMBER=92XXXXXXXXXX
VITE_WHATSAPP_MESSAGE=Hello EYVORA, I need help with your products.
```

## 2) Point eyvora.pk to Vercel

1. Vercel → Project → **Domains** → add `eyvora.pk` and `www.eyvora.pk`
2. At your DNS provider, set the records Vercel shows (A / CNAME)
3. In Shopify, remove any Hydrogen / Lovable redirect so the apex domain is free for Vercel

Until DNS is updated, use the Vercel URL above.

## 3) Shopify Admin (already done via Dev Dashboard app)

- Demo products archived
- Launch products created @ PKR 4399 / 2499 with S/M/L
- Photos + inventory attached
- Collections: `hoodies`, `trousers`, `couple`, `frontpage`
- Domestic shipping set to **PKR 250**, international **PKR 2500**

To re-seed:

```bash
export SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
export SHOPIFY_CLIENT_ID=...
export SHOPIFY_CLIENT_SECRET=...
export ARCHIVE_DEMO_PRODUCTS=true
node scripts/seed-shopify-launch.mjs
```

## 4) Launch checks

- [x] Vercel site loads new EYVORA design
- [x] Products show PKR 4399 / 2499 (local catalogue while Storefront locked)
- [x] Bag → Order via Email works on trial
- [ ] WhatsApp number set on Vercel (`VITE_WHATSAPP_NUMBER`)
- [ ] `eyvora.pk` DNS → Vercel
- [ ] Buy Shopify plan → disable password → native checkout
- [ ] Enable COD / payments in Shopify Admin
- [ ] Rotate Client secret (shared in chat)
