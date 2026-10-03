# EYVORA Storefront

Independent premium Shopify headless storefront for EYVORA.

## Stack

- React + TanStack Start
- Shopify Storefront API (catalogue, cart, checkout)
- Vercel hosting
- GitHub source control

Lovable is not required for development or deployment.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Required `.env` values:

```bash
VITE_SHOPIFY_STORE_DOMAIN=eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
VITE_WHATSAPP_NUMBER=
VITE_WHATSAPP_MESSAGE=Hello EYVORA, I need help with your products.
```

## Deploy

See [`DEPLOY.md`](./DEPLOY.md).

## Shopify launch seed

See [`shopify-seed/README.md`](./shopify-seed/README.md).

## Launch catalogue

| Product | Price | Sizes |
|---|---|---|
| Olive Green Hoodie | PKR 4,399 | S / M / L |
| Black Hoodie | PKR 4,399 | S / M / L |
| Grey Trousers | PKR 2,499 | S / M / L |
| Black Trousers | PKR 2,499 | S / M / L |
