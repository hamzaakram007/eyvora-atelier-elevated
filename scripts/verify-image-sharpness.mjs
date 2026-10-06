#!/usr/bin/env node
/**
 * Verify product imagery sharpness on a deployed storefront URL.
 */
import puppeteer from "puppeteer";

const BASE =
  process.argv[2] ||
  "https://eyvora-git-cursor-storefront-che-f36b6c-hamzaakram007s-projects.vercel.app";

const PAGES = ["/", "/shop", "/shop?gender=women", "/product/olive-green-hoodie?gender=women", "/couple"];

const browser = await puppeteer.launch({
  headless: true,
  executablePath: "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-device-scale-factor=3"],
});

function grade(naturalW, displayW, dpr) {
  const need = displayW * dpr;
  const ratio = naturalW / Math.max(need, 1);
  if (ratio >= 0.85) return "SHARP";
  if (ratio >= 0.55) return "OK";
  return "SOFT";
}

let soft = 0;
let total = 0;

for (const path of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  const url = `${BASE}${path}`;
  console.log(`\n=== ${url} ===`);
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));
    const imgs = await page.evaluate(() => {
      return [...document.querySelectorAll("img")]
        .filter((img) => img.offsetParent !== null || img.getClientRects().length)
        .slice(0, 12)
        .map((img) => {
          const rect = img.getBoundingClientRect();
          return {
            src: (img.currentSrc || img.src || "").split("?")[0],
            alt: img.alt || "",
            naturalW: img.naturalWidth,
            naturalH: img.naturalHeight,
            displayW: Math.round(rect.width),
            displayH: Math.round(rect.height),
          };
        })
        .filter((i) => i.naturalW > 0 && i.displayW > 40);
    });

    for (const img of imgs) {
      total += 1;
      const g = grade(img.naturalW, img.displayW, 3);
      if (g === "SOFT") soft += 1;
      const short = img.src.replace(BASE, "").slice(-70);
      console.log(
        `${g.padEnd(5)} nat ${img.naturalW}×${img.naturalH} css ${img.displayW}×${img.displayH}  ${short}`,
      );
    }
  } catch (e) {
    console.log("ERROR", e.message);
  }
  await page.close();
}

await browser.close();
console.log(`\nSummary: ${total - soft}/${total} not soft (DPR3 mobile). Soft=${soft}`);
process.exit(soft > Math.max(2, total * 0.25) ? 1 : 0);
