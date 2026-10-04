#!/usr/bin/env node
/**
 * Emit smaller WebP siblings for product imagery into BOTH:
 *   - src/assets/products/** (optional local siblings)
 *   - public/img/products/** (stable URLs used at runtime — keeps JS lean)
 *
 *   photo.webp → photo.card.webp (max 420w) + photo.thumb.webp (max 160w)
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_ROOT = path.resolve("src/assets/products");
const PUBLIC_ROOT = path.resolve("public/img/products");

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (
      /\.webp$/i.test(entry.name) &&
      !/\.(card|thumb)\.webp$/i.test(entry.name)
    ) {
      out.push(full);
    }
  }
  return out;
}

async function writeVariant(src, dest, maxWidth, quality) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const tmp = `${dest}.tmp`;
  await sharp(src, { failOn: "none" })
    .rotate()
    .resize({
      width: maxWidth,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 6 })
    .toFile(tmp);
  await fs.rename(tmp, dest);
  return (await fs.stat(dest)).size;
}

const files = await walk(SRC_ROOT);
let written = 0;
for (const file of files) {
  const rel = path.relative(SRC_ROOT, file); // e.g. olive-hoodie/primary.webp
  const base = rel.replace(/\.webp$/i, "");
  const cardPublic = path.join(PUBLIC_ROOT, `${base}.card.webp`);
  const thumbPublic = path.join(PUBLIC_ROOT, `${base}.thumb.webp`);
  const cardSrc = file.replace(/\.webp$/i, ".card.webp");
  const thumbSrc = file.replace(/\.webp$/i, ".thumb.webp");

  const cardSize = await writeVariant(file, cardPublic, 420, 62);
  const thumbSize = await writeVariant(file, thumbPublic, 160, 58);
  // Keep src siblings in sync for local tooling / optional imports.
  await fs.copyFile(cardPublic, cardSrc);
  await fs.copyFile(thumbPublic, thumbSrc);

  written += 1;
  console.log(
    `${rel} → /img/products/${base}.card.webp ${(cardSize / 1024).toFixed(1)}KB · thumb ${(thumbSize / 1024).toFixed(1)}KB`,
  );
}
console.log(`\n✓ ${written} sources → public/img/products card + thumb variants`);
