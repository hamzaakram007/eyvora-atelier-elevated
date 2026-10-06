#!/usr/bin/env node
import puppeteer from "puppeteer";

const BASE =
  process.argv[2] ||
  "https://eyvora-git-cursor-storefront-che-f36b6c-hamzaakram007s-projects.vercel.app";

const browser = await puppeteer.launch({
  headless: true,
  executablePath: "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-device-scale-factor=3"],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });

const responses = [];
page.on("response", async (res) => {
  const url = res.url();
  if (!/\.(webp|jpg|jpeg|png)(\?|$)/i.test(url)) return;
  if (!url.includes("/img/products/") && !url.includes("/assets/")) return;
  try {
    const buf = Buffer.from(await res.buffer());
    responses.push({
      url: url.replace(BASE, ""),
      status: res.status(),
      bytes: buf.length,
      headers: res.headers(),
    });
  } catch {
    /* navigation aborted */
  }
});

await page.goto(`${BASE}/shop?gender=women`, {
  waitUntil: "networkidle2",
  timeout: 60000,
});
await new Promise((r) => setTimeout(r, 2000));

const imgs = await page.evaluate(() =>
  [...document.querySelectorAll("img")]
    .slice(0, 10)
    .map((img) => ({
      currentSrc: (img.currentSrc || "").replace(location.origin, ""),
      srcset: img.srcset?.slice(0, 180) || "",
      sizes: img.sizes || "",
      naturalW: img.naturalWidth,
      complete: img.complete,
    })),
);

console.log("DOM imgs:");
for (const i of imgs) console.log(JSON.stringify(i));

console.log("\nNetwork image responses:");
for (const r of responses.slice(0, 20)) {
  console.log(
    `${r.status} ${r.bytes}B  ${r.url.slice(0, 100)}  ct=${r.headers["content-type"] || ""}`,
  );
}

// Decode one downloaded card
import sharp from "sharp";
const sample = responses.find((r) => r.url.includes("women/front.card"));
if (sample) {
  const res = await page.goto(`${BASE}${sample.url.split("?")[0]}`, {
    waitUntil: "networkidle0",
  });
  const buf = Buffer.from(await res.buffer());
  const meta = await sharp(buf).metadata();
  console.log(`\nDecoded ${sample.url}: ${meta.width}x${meta.height} file=${buf.length}B`);
}

await browser.close();
