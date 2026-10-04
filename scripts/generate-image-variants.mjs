#!/usr/bin/env node
/**
 * Emit smaller WebP siblings for product imagery:
 *   photo.webp → photo.card.webp (max 420w) + photo.thumb.webp (max 160w)
 * Used for ProductCard / gallery thumbs so mobile doesn't download full frames.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("src/assets/products");

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

  try {
    const prev = await fs.stat(dest);
    const next = await fs.stat(tmp);
    if (next.size >= prev.size * 0.98) {
      // Keep existing if not meaningfully smaller, but refresh anyway for dimension changes.
    }
  } catch {
    // dest missing
  }
  await fs.rename(tmp, dest);
  return (await fs.stat(dest)).size;
}

const files = await walk(ROOT);
let written = 0;
for (const file of files) {
  const card = file.replace(/\.webp$/i, ".card.webp");
  const thumb = file.replace(/\.webp$/i, ".thumb.webp");
  const cardSize = await writeVariant(file, card, 420, 62);
  const thumbSize = await writeVariant(file, thumb, 160, 58);
  written += 1;
  console.log(
    `${path.relative(process.cwd(), file)} → card ${(cardSize / 1024).toFixed(1)}KB / thumb ${(thumbSize / 1024).toFixed(1)}KB`,
  );
}
console.log(`\n✓ ${written} sources → card + thumb variants`);
