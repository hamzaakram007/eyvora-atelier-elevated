#!/usr/bin/env node
/**
 * Emit responsive WebP siblings for product imagery into:
 *   - public/img/products/** (stable runtime URLs — keeps JS lean)
 *   - src/assets/products/** siblings for local tooling
 *
 *   photo.webp →
 *     photo.thumb.webp  (max 240w)  — gallery strip
 *     photo.card.webp   (max 800w)  — product cards / grids
 *     photo.gallery.webp(max 1200w) — product page hero
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_ROOT = path.resolve("src/assets/products");
const PUBLIC_ROOT = path.resolve("public/img/products");

const VARIANTS = [
  { suffix: "thumb", maxWidth: 240, quality: 72 },
  { suffix: "card", maxWidth: 800, quality: 80 },
  { suffix: "gallery", maxWidth: 1200, quality: 84 },
];

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (
      /\.webp$/i.test(entry.name) &&
      !/\.(card|thumb|gallery)\.webp$/i.test(entry.name)
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
  const parts = [];

  for (const variant of VARIANTS) {
    const publicPath = path.join(PUBLIC_ROOT, `${base}.${variant.suffix}.webp`);
    const srcSibling = file.replace(/\.webp$/i, `.${variant.suffix}.webp`);
    const size = await writeVariant(
      file,
      publicPath,
      variant.maxWidth,
      variant.quality,
    );
    await fs.copyFile(publicPath, srcSibling);
    parts.push(`${variant.suffix} ${(size / 1024).toFixed(1)}KB`);
  }

  written += 1;
  console.log(`${rel} → ${parts.join(" · ")}`);
}
console.log(
  `\n✓ ${written} sources → public/img/products thumb + card + gallery variants`,
);
