#!/usr/bin/env node
/**
 * Recompress product/marketing images and emit WebP siblings for faster LCP.
 * Keeps JPEG originals (further compressed) and writes matching .webp files.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("src/assets");
const MAX_EDGE = {
  hero: 1400,
  default: 1100,
  women: 1000,
  category: 1000,
  couple: 1200,
  card: 800,
};

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
  if (p.includes("/hero/")) return MAX_EDGE.hero;
  if (p.includes("/women/")) return MAX_EDGE.women;
  if (p.includes("/category/")) return MAX_EDGE.category;
  if (p.includes("/couple/")) return MAX_EDGE.couple;
  return MAX_EDGE.default;
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
  const img = sharp(file, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const width = meta.width || max;
  const resized = {
    width: Math.min(width, max),
    height: Math.min(meta.height || max, max),
    fit: "inside",
    withoutEnlargement: true,
  };

  const jpgTmp = `${file}.tmp`;
  const pipeline = sharp(file, { failOn: "none" }).rotate().resize(resized);
  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(jpgTmp);
  } else {
    await pipeline
      .jpeg({ quality: 68, mozjpeg: true, progressive: true })
      .toFile(jpgTmp);
  }
  const afterJpg = await writeIfSmaller(jpgTmp, file, before);

  const webpPath = file.replace(/\.(jpe?g|png)$/i, ".webp");
  const webpTmp = `${webpPath}.tmp`;
  await sharp(file, { failOn: "none" })
    .rotate()
    .resize(resized)
    .webp({ quality: 68, effort: 5 })
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
