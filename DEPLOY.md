# EYVORA — Independent Deploy (No Lovable)

## Architecture

- **GitHub** → source code
- **Vercel** → website hosting
- **Shopify** → products / future native checkout (needs a paid plan to unlock Storefront)
- **Email / WhatsApp** → order intake while Shopify is on trial

Lovable is not required.

## Checkout status

Shopify plan is active and Online Store password is off.

- Storefront API serves Shopify products (launch 4 + any new ones you add in Admin)
- Bag → Shopify Cart → hosted checkout (rewritten to `*.myshopify.com` so `eyvora.pk` can sit on Vercel)
- `SHOPIFY_CHECKOUT_LOCKED = false` in `src/lib/site.ts`

## Adding new products (Shopify Admin)

No code change needed for a normal new product:

1. Shopify Admin → **Products** → **Add product**
2. Title, price (PKR), sizes (S/M/L/XL), photos, inventory
3. **Publish** to **Online Store** (and any other channels you use)
4. Optional: add tags like `hoodies`, `trousers`, `couple`, `new` so filters/collections pick it up
5. Optional: add to a collection (`hoodies` / `trousers` / `couple`)

The Vercel site reads the Storefront API — new published products show on `/shop` automatically (usually within a minute; hard-refresh if cached).

## Changing prices (Shopify Admin)

**Live prices on eyvora.pk come from Shopify Admin** — not from code.

1. Shopify Admin → **Products** → open the product
2. Set **Price** = what the customer pays (sale price)
3. Set **Compare-at price** = original list price (shown struck through + “% OFF” badge). Use a real list price — **Compare-at `0` means no sale badge**.
4. Save → hard-refresh eyvora.pk (clear bag if an old price was already added)

Example: list 2999, 20% off → Price `2399`, Compare-at `2999`.

### Male / female split products (current Admin setup)

You currently have separate Shopify products (e.g. *Male Olive Green Hoodie* and *Female Olive Green Hoodie*).

- **Women** cards / PDPs use the **Female** Admin product price  
- **Men** cards / PDPs use the **Male** Admin product price  

So if you change only *Female Olive Green Hoodie* to Rs 4100, the **Women** card updates — the **Men** card still shows the male product’s price until you edit that one too (or set both the same).

Long-term simplest setup: **one Shopify product per colour** (not male/female duplicates), and keep Men/Women photos on the website only.

`src/lib/pricing.ts` is only an offline fallback if Storefront API is unavailable.

## Product handles (important for checkout)

Website URLs stay stable (`/product/olive-green-hoodie`, etc.).

If Shopify Admin renames products (e.g. `eyvora-male-olive-green-hoodie`), keep those Admin handles listed under `shopifyHandles` on the matching entry in `src/lib/catalog.ts` (`LAUNCH_PRODUCTS`). Otherwise the site falls back to local placeholder variants and the bag shows **Order via WhatsApp** instead of checkout.

## 1) Vercel deploy

Live project URL:

`https://eyvora-hamzaakram007s-projects.vercel.app`

Env vars:

```bash
VITE_SHOPIFY_STORE_DOMAIN=eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=YOUR_STOREFRONT_TOKEN
VITE_CONTACT_EMAIL=eyvorapk@gmail.com
VITE_WHATSAPP_NUMBER=923497712366
VITE_WHATSAPP_MESSAGE=Hello EYVORA, I need help with your products.
```

## 2) Point eyvora.pk to Vercel

1. Vercel → Project → **Domains** → add `eyvora.pk` and `www.eyvora.pk`
2. At your DNS provider, set the records Vercel shows (A / CNAME)
3. In Shopify, remove any Hydrogen / Lovable redirect so the apex domain is free for Vercel

Until DNS is updated, use the Vercel URL above.

## 3) Shopify Admin (already done via Dev Dashboard app)

- Demo products archived
- Launch products created @ PKR 3749 / 2499 with S/M/L/XL (hoodies: olive green & black; trousers: grey & black)
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
- [x] Products show PKR 3749 / 2499 via Storefront API
- [x] Bag → Shopify checkout works (password off, plan active)
- [x] Domestic shipping PKR 250
- [ ] `eyvora.pk` Cloudflare DNS → Vercel (still on Shopify `23.227.38.65`)
- [ ] Enable COD + Bank deposit in Shopify Admin (required for checkout buttons)
- [x] Contact: `eyvorapk@gmail.com` + WhatsApp `923497712366` (`03497712366`)
- [ ] Rotate Client secret (shared in chat)

### Enable Cash on Delivery + UBL bank transfer (Shopify Admin)

These cannot be activated via API — do this once in Admin:

1. Open **Shopify Admin → Settings → Payments**
2. Under **Manual payment methods**, click **Add manual payment method**
3. Add **Cash on Delivery (COD)** and save
4. Add **Bank deposit** (or “Bank transfer”) and paste these instructions:

```
Bank Name: United Bank Limited (UBL)
Account Number: 321342838
Account Title: Muhammad Hamza
IBAN: PK02UNIL0109000321342838

After payment, send your order number + screenshot to EYVORA.
```

5. Save. COD and bank transfer then appear on Shopify checkout.

Storefront page with the same details: `/payments` (also published in Shopify as Online Store page `payment-methods`).

### Require phone at Shopify checkout (storefront no longer asks)

Phone is **not** required on the eyvora.pk bag anymore. Collect it only in Shopify checkout:

1. Open Admin → **Settings → Checkout**
2. Under **Customer information**, set **Shipping address phone number** → **Required**
3. **Save**

Direct link:  
https://admin.shopify.com/store/eyvora-premium-essentials-bv3bk/settings/checkout

### Make Shopify checkout shorter (Basic plan)

You cannot redesign the hosted checkout layout on Basic. You *can* hide extra fields:

1. **Settings → Checkout**
2. Scroll to **Form options** / **Customer information**
3. Set:
   - **Company name** → **Don't include**
   - **Address line 2 (apartment, unit, etc.)** → **Don't include** (or Optional)
   - **Full name** → **Only require last name** (optional; shorter than first+last)
4. **Save**
5. Test checkout again

Keep **Shipping address phone number** as **Required**.

The long `...myshopify.com/checkouts/cn/...` URL is normal — Shopify generates it; it cannot be shortened on Basic.

### Checkout DNS note (headless + Vercel)

- `eyvora.pk` → **Vercel** (storefront) — keep this
- `account.eyvora.pk` → **Shopify** (`shops.myshopify.com`) — customer accounts / order status only
- Checkout must open on `*.myshopify.com` (the storefront rewrites Shopify’s checkout URL automatically)

Do **not** point the apex `eyvora.pk` A/CNAME at Shopify if you want the Vercel site to stay live.

### Cloudflare DNS for eyvora.pk → Vercel

| Type | Name | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Remove Shopify A/CNAME records. Checkout still works on `*.myshopify.com`.
