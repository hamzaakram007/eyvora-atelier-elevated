#!/usr/bin/env node
/**
 * Recompress product/marketing JPEGs for faster LCP.
 * Keeps original paths so imports stay unchanged.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("src/assets");
const MAX_EDGE = {
  hero: 1600,
  default: 1400,
  women: 1200,
  category: 1200,
  couple: 1400,
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

async function optimize(file) {
  const before = (await fs.stat(file)).size;
  const ext = path.extname(file).toLowerCase();
  const max = maxFor(file);
  const img = sharp(file, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const width = meta.width || max;
  const pipeline = img.resize({
    width: Math.min(width, max),
    height: Math.min(meta.height || max, max),
    fit: "inside",
    withoutEnlargement: true,
  });

  const tmp = `${file}.tmp`;
  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(tmp);
  } else {
    await pipeline
      .jpeg({ quality: 72, mozjpeg: true, progressive: true })
      .toFile(tmp);
  }

  const after = (await fs.stat(tmp)).size;
  if (after < before * 0.98) {
    await fs.rename(tmp, file);
    return { file, before, after, saved: before - after };
  }
  await fs.unlink(tmp);
  return { file, before, after: before, saved: 0 };
}

const files = await walk(ROOT);
let savedTotal = 0;
for (const file of files) {
  try {
    const result = await optimize(file);
    savedTotal += result.saved;
    if (result.saved > 0) {
      console.log(
        `${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB  ${path.relative(process.cwd(), file)}`,
      );
    }
  } catch (error) {
    console.warn("skip", file, error.message);
  }
}
console.log(`Saved ${(savedTotal / 1024 / 1024).toFixed(2)} MB across ${files.length} images`);
