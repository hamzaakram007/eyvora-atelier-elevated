#!/usr/bin/env node
/**
 * Restore product masters that were previously crushed below their
 * original source resolution (women / hero / category / couple).
 *
 * Sources live in the Cursor project assets folder; destinations are
 * src/assets/products/** masters (jpg + webp), then regenerate variants.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const plan = JSON.parse(await fs.readFile("/tmp/restore-plan.json", "utf8"));
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 90;
const JPEG_QUALITY = 92;

let updated = 0;
for (const item of plan) {
  const destJpg = path.resolve(item.dest);
  const destWebp = destJpg.replace(/\.jpe?g$/i, ".webp");
  const srcPath = item.src;

  const buffer = await fs.readFile(srcPath);
  const meta = await sharp(buffer, { failOn: "none" }).metadata();
  const width = Math.min(MAX_WIDTH, meta.width || MAX_WIDTH);

  await fs.mkdir(path.dirname(destJpg), { recursive: true });

  await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(destJpg);

  await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(destWebp);

  const out = await sharp(destWebp).metadata();
  const kb = ((await fs.stat(destWebp)).size / 1024).toFixed(1);
  console.log(
    `✓ ${path.relative(process.cwd(), destWebp)} ← ${item.from[0]}x${item.from[1]} → ${out.width}x${out.height} ${kb}KB`,
  );
  updated += 1;
}

console.log(`\nRestored ${updated} masters`);
