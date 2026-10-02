import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const baseUrl = "http://127.0.0.1:4173";
const root = "C:/Indian Servers/temp/Physics";
const indexPath = path.join(root, "screenshot_index.json");
const records = JSON.parse(await fs.readFile(indexPath, "utf8"));
const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
  args: ["--disable-gpu", "--hide-scrollbars", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await context.addInitScript(() => sessionStorage.setItem("physicslab-splash-v1", "1"));

const retryNames = new Set(["Formula Revision Grid", "Glass Slab Refraction", "Lens Formula"]);
for (const record of records.filter((item) => item.status === "Failed" || retryNames.has(item.pageName))) {
  const page = await context.newPage();
  const outputPath = path.join(root, record.pageType === "Lesson Lab" ? "Lessons" : "Pages", record.fileName);
  await page.goto(baseUrl + record.route, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  if (record.pageName === "Solver") {
    await page.evaluate(() => { document.documentElement.style.zoom = "0.4"; });
    record.note = "Captured at 40% page zoom to fit the complete 70,000+ pixel source page into one PNG.";
  }
  const dimensions = await page.evaluate(() => ({
    width: Math.ceil(document.documentElement.scrollWidth),
    height: Math.ceil(document.documentElement.scrollHeight),
    textLength: document.body?.innerText?.length ?? 0,
  }));
  await page.screenshot({ path: outputPath, fullPage: true, animations: "disabled", timeout: 120000 });
  Object.assign(record, dimensions, { status: "Captured", captureMode: record.pageName === "Solver" ? "single-scaled" : "single-retry", tileCount: 0 });
  console.log(`${record.pageName}\t${dimensions.width}x${dimensions.height}\t${record.status}`);
  await page.close();
}
await browser.close();

const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const headers = ["Page Type", "Page Name", "Lesson ID", "Lesson Code", "Category", "Class Level", "Route", "URL", "Filename", "Width", "Height", "Capture Mode", "Tile Count", "Status", "Notes"];
const rows = records.map((record) => [record.pageType, record.pageName, record.lessonId, record.lessonCode, record.category, record.classLevel,
  record.route, record.url, record.fileName, record.width, record.height, record.captureMode, record.tileCount, record.status, record.note]);
await fs.writeFile(indexPath, JSON.stringify(records, null, 2), "utf8");
await fs.writeFile(path.join(root, "screenshot_index.csv"), [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n"), "utf8");
