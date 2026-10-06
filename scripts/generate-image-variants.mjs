#!/usr/bin/env node
/**
 * Emit responsive WebP siblings for product imagery into:
 *   - public/img/products/** (stable runtime URLs — keeps JS lean)
 *   - src/assets/products/** siblings for local tooling
 *   - src/lib/image-variant-widths.json (actual pixel widths for accurate srcset)
 *
 *   photo.webp →
 *     photo.thumb.webp  (max 320w)  — gallery strip
 *     photo.card.webp   (max 1000w) — product cards / grids (retina phone tiles)
 *     photo.gallery.webp(max 1600w) — product page hero / large modules
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_ROOT = path.resolve("src/assets/products");
const PUBLIC_ROOT = path.resolve("public/img/products");
const WIDTHS_JSON = path.resolve("src/lib/image-variant-widths.json");

const VARIANTS = [
  { suffix: "thumb", maxWidth: 320, quality: 78 },
  { suffix: "card", maxWidth: 1000, quality: 86 },
  { suffix: "gallery", maxWidth: 1600, quality: 90 },
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
  const meta = await sharp(dest).metadata();
  const size = (await fs.stat(dest)).size;
  return { size, width: meta.width || 0, height: meta.height || 0 };
}

const files = await walk(SRC_ROOT);
const widths = {};
let written = 0;
for (const file of files) {
  const rel = path.relative(SRC_ROOT, file); // e.g. olive-hoodie/primary.webp
  const base = rel.replace(/\.webp$/i, "");
  const parts = [];
  const masterMeta = await sharp(file).metadata();
  const entry = {
    full: masterMeta.width || 0,
  };

  for (const variant of VARIANTS) {
    const publicPath = path.join(PUBLIC_ROOT, `${base}.${variant.suffix}.webp`);
    const srcSibling = file.replace(/\.webp$/i, `.${variant.suffix}.webp`);
    const result = await writeVariant(
      file,
      publicPath,
      variant.maxWidth,
      variant.quality,
    );
    await fs.copyFile(publicPath, srcSibling);
    entry[variant.suffix] = result.width;
    parts.push(
      `${variant.suffix} ${result.width}w/${(result.size / 1024).toFixed(1)}KB`,
    );
  }

  widths[base] = entry;
  written += 1;
  console.log(`${rel} → ${parts.join(" · ")}`);
}

await fs.writeFile(WIDTHS_JSON, `${JSON.stringify(widths, null, 2)}\n`);
console.log(
  `\n✓ ${written} sources → public/img/products thumb + card + gallery variants`,
);
console.log(`✓ wrote ${path.relative(process.cwd(), WIDTHS_JSON)}`);
