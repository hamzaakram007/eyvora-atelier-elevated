#!/usr/bin/env node
/**
 * Recompress product/marketing images and emit WebP siblings for faster LCP.
 * Keeps JPEG originals (further compressed) and writes matching .webp files.
 *
 * IMPORTANT: constrain by WIDTH only (not a square max-edge). Portrait product
 * shots are ~941×1672 — a 1000px "max edge" previously crushed them to ~563×1000
 * and made the storefront look blurred on retina displays.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("src/assets");
/** Max output width by folder — never constrain height to the same value. */
const MAX_WIDTH = {
  hero: 1600,
  default: 1600,
  women: 1600,
  category: 1600,
  couple: 1600,
};

const JPEG_QUALITY = 88;
const WEBP_QUALITY = 86;

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function maxFor(file) {
  const p = file.replace(/\\/g, "/");
  if (p.includes("/hero/")) return MAX_WIDTH.hero;
  if (p.includes("/women/")) return MAX_WIDTH.women;
  if (p.includes("/category/")) return MAX_WIDTH.category;
  if (p.includes("/couple/")) return MAX_WIDTH.couple;
  return MAX_WIDTH.default;
}

async function writeIfSmaller(tmp, dest, before) {
  const after = (await fs.stat(tmp)).size;
  if (after < before * 0.995 || path.extname(dest).toLowerCase() === ".webp") {
    // Always keep freshly generated webp; replace jpeg only when smaller.
    if (path.extname(dest).toLowerCase() !== ".webp" && after >= before * 0.995) {
      await fs.unlink(tmp);
      return before;
    }
    await fs.rename(tmp, dest);
    return after;
  }
  await fs.unlink(tmp);
  return before;
}

async function optimize(file) {
  const before = (await fs.stat(file)).size;
  const ext = path.extname(file).toLowerCase();
  const max = maxFor(file);
  const meta = await sharp(file, { failOn: "none" }).metadata();
  const resize = {
    width: Math.min(meta.width || max, max),
    fit: "inside",
    withoutEnlargement: true,
  };

  const jpgTmp = `${file}.tmp`;
  const pipeline = sharp(file, { failOn: "none" }).rotate().resize(resize);
  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(jpgTmp);
  } else {
    await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toFile(jpgTmp);
  }
  const afterJpg = await writeIfSmaller(jpgTmp, file, before);

  const webpPath = file.replace(/\.(jpe?g|png)$/i, ".webp");
  const webpTmp = `${webpPath}.tmp`;
  await sharp(file, { failOn: "none" })
    .rotate()
    .resize(resize)
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(webpTmp);
  const afterWebp = await writeIfSmaller(webpTmp, webpPath, Number.MAX_SAFE_INTEGER);

  return { file, before, afterJpg, afterWebp, webpPath };
}

const files = await walk(ROOT);
let savedTotal = 0;
for (const file of files) {
  try {
    const result = await optimize(file);
    const saved = Math.max(0, result.before - result.afterJpg);
    savedTotal += saved;
    const webpSize = (await fs.stat(result.webpPath)).size;
    console.log(
      `${(result.before / 1024).toFixed(0)}KB → jpg ${(result.afterJpg / 1024).toFixed(0)}KB / webp ${(webpSize / 1024).toFixed(0)}KB  ${path.relative(process.cwd(), file)}`,
    );
  } catch (error) {
    console.warn("skip", file, error.message);
  }
}
console.log(`Processed ${files.length} images; jpeg savings ${(savedTotal / 1024 / 1024).toFixed(2)} MB`);
