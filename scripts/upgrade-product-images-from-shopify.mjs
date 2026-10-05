#!/usr/bin/env node
/**
 * Pull higher-res product photos from Shopify CDN and rewrite local WebP masters
 * (keeps gender-specific local shots that aren't on Shopify).
 */
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

if (existsSync(".env")) process.loadEnvFile(".env");

const DOMAIN = (
  process.env.VITE_SHOPIFY_STORE_DOMAIN ||
  process.env.SHOPIFY_STORE_DOMAIN ||
  ""
)
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");
const TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "";

/** Map Shopify filename stem → local asset path (without extension). */
const MAP = {
  "olive-green-hoodie-primary": "olive-hoodie/primary",
  "olive-green-hoodie-secondary": "olive-hoodie/secondary",
  "olive-green-hoodie-front": "olive-hoodie/front",
  "olive-green-hoodie-back": "olive-hoodie/back",
  "olive-green-hoodie-lifestyle": "olive-hoodie/lifestyle",
  "olive-green-hoodie-detail": "olive-hoodie/detail",
  "black-hoodie-primary": "black-hoodie/primary",
  "black-hoodie-secondary": "black-hoodie/secondary",
  "black-hoodie-front": "black-hoodie/front",
  "black-hoodie-back": "black-hoodie/back",
  "black-hoodie-lifestyle": "black-hoodie/lifestyle",
  "black-hoodie-detail": "black-hoodie/detail",
  "grey-trousers-primary": "grey-trousers/primary",
  "grey-trousers-secondary": "grey-trousers/secondary",
  "grey-trousers-front": "grey-trousers/front",
  "grey-trousers-back": "grey-trousers/back",
  "grey-trousers-lifestyle": "grey-trousers/lifestyle",
  "grey-trousers-detail": "grey-trousers/detail",
  "grey-trousers-closeup": "grey-trousers/closeup",
  "black-trousers-primary": "black-trousers/primary",
  "black-trousers-secondary": "black-trousers/secondary",
  "black-trousers-front": "black-trousers/front",
  "black-trousers-back": "black-trousers/back",
  "black-trousers-lifestyle": "black-trousers/lifestyle",
  "black-trousers-detail": "black-trousers/detail",
  "black-trousers-closeup": "black-trousers/closeup",
};

const ROOT = path.resolve("src/assets/products");
/** Cap width only — keep full portrait height for crisp product heroes. */
const MAX_WIDTH = 1200;
const QUALITY = 85;

async function shopifyImages() {
  const query = `{
    products(first: 20) {
      edges {
        node {
          handle
          images(first: 30) {
            edges { node { url width height } }
          }
        }
      }
    }
  }`;
  const res = await fetch(`https://${DOMAIN}/api/2025-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  return json?.data?.products?.edges ?? [];
}

function stemFromUrl(url) {
  try {
    const base = path.basename(new URL(url).pathname);
    return base.replace(/\.(jpe?g|png|webp|gif)$/i, "");
  } catch {
    return "";
  }
}

async function writeMaster(localBase, buffer, remoteW, remoteH) {
  const webpPath = path.join(ROOT, `${localBase}.webp`);
  const jpgPath = path.join(ROOT, `${localBase}.jpg`);
  await fs.mkdir(path.dirname(webpPath), { recursive: true });

  let existingW = 0;
  try {
    existingW = (await sharp(webpPath).metadata()).width || 0;
  } catch {
    existingW = 0;
  }

  // Replace when Shopify is sharper, or when we previously crushed height.
  if (existingW && remoteW <= existingW + 20) {
    try {
      const existingH = (await sharp(webpPath).metadata()).height || 0;
      const expectedH = remoteH
        ? Math.round(remoteH * (existingW / remoteW))
        : existingH;
      if (existingH >= expectedH - 30) {
        return { skipped: true, reason: `local ${existingW}px >= remote ${remoteW}px` };
      }
    } catch {
      /* rewrite */
    }
  }

  const meta = await sharp(buffer, { failOn: "none" }).metadata();
  const width = Math.min(MAX_WIDTH, meta.width || MAX_WIDTH);
  const base = sharp(buffer, { failOn: "none" }).rotate().resize({
    width,
    fit: "inside",
    withoutEnlargement: true,
  });

  // Encode separately (avoid sharp clone edge-cases on resized pipelines).
  await base.webp({ quality: QUALITY, effort: 6 }).toFile(webpPath);
  await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(jpgPath);
  const out = await sharp(webpPath).metadata();
  const size = (await fs.stat(webpPath)).size;
  return {
    skipped: false,
    width: out.width,
    height: out.height,
    kb: +(size / 1024).toFixed(1),
    from: `${remoteW}x${remoteH}`,
  };
}

if (!DOMAIN || !TOKEN) {
  console.error("Missing VITE_SHOPIFY_STORE_DOMAIN / VITE_SHOPIFY_STOREFRONT_TOKEN");
  process.exit(1);
}

const products = await shopifyImages();
let updated = 0;
let skipped = 0;

for (const edge of products) {
  for (const img of edge.node.images.edges) {
    const stem = stemFromUrl(img.node.url);
    const localBase = MAP[stem];
    if (!localBase) continue;

    // Request original-ish width from CDN.
    const url = img.node.url.includes("?")
      ? `${img.node.url}&width=1600`
      : `${img.node.url}?width=1600`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("download failed", stem, res.status);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const result = await writeMaster(
      localBase,
      buffer,
      img.node.width || 0,
      img.node.height || 0,
    );
    if (result.skipped) {
      skipped += 1;
      console.log(`skip ${localBase} (${result.reason})`);
    } else {
      updated += 1;
      console.log(
        `✓ ${localBase} ← Shopify ${result.from} → ${result.width}x${result.height} ${result.kb}KB`,
      );
    }
  }
}

console.log(`\nUpdated ${updated}, skipped ${skipped}`);
