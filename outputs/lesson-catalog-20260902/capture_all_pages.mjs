import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const baseUrl = "http://127.0.0.1:4173";
const captureRoot = "C:/Indian Servers/temp/Physics";
const dataPath = "C:/Indian Servers/Physics Simulator/outputs/lesson-catalog-20260902/lesson_data.json";
const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const staticPages = [
  ["Home", "/"], ["Client Demos", "/client-demos"], ["All Modules", "/all-modules"], ["Concept Studio", "/concept-studio"],
  ["Guided Lab", "/lab"], ["Pro Lab Program", "/pro-lab"], ["Pro Lab Launch Vehicle", "/pro-lab/launch-vehicle"],
  ["Rocket Parts Catalog", "/rocket-lab/parts"], ["Sandbox", "/sandbox"], ["Experiments Library", "/experiments"],
  ["Syllabus", "/syllabus"], ["Concepts", "/concepts"], ["Physics Modules", "/modules"], ["Roadmap", "/roadmap"],
  ["Solver", "/solver"], ["Formulas", "/formulas"], ["Formula Revision Grid", "/formulas/revision-grid"], ["Dictionary", "/dictionary"],
  ["Astrophysics", "/astrophysics"], ["Particle Physics", "/particle-physics"], ["Atmosphere", "/atmosphere"], ["String Theory", "/string-theory"],
  ["Physics Innovations", "/physics-innovations"], ["Scale of Universe", "/physics/scale-of-universe"], ["Comparison", "/comparison"],
  ["Quality Audit", "/quality-audit"], ["Accuracy Center", "/accuracy-center"], ["Learning Studio", "/learning-studio"],
  ["Simulation Depth", "/simulation-depth"], ["Classroom Deployment", "/classroom-deployment"], ["Accessibility Center", "/accessibility-center"],
  ["Insights Center", "/insights-center"], ["Release Governance", "/release-governance"], ["Excellence Benchmark", "/excellence-benchmark"],
  ["Quiz", "/quiz"], ["Video Analysis", "/video"], ["Quantum", "/quantum"], ["Teacher", "/teacher"], ["LMS Config", "/lms-config"],
  ["Topic - Mechanics", "/topics/mechanics"], ["Topic - Waves", "/topics/waves"], ["Topic - Optics", "/topics/optics"],
  ["Topic - Electricity", "/topics/electricity"], ["Topic - Magnetism", "/topics/magnetism"], ["Topic - Thermodynamics", "/topics/thermodynamics"],
  ["Topic - Modern Physics", "/topics/modern-physics"], ["Topic - Fluid Mechanics", "/topics/fluid-mechanics"], ["Topic - Oscillations", "/topics/oscillations"],
  ["Topic - Astronomy", "/topics/astronomy"], ["Topic - Astrophysics", "/topics/astrophysics"], ["Topic - Measurement", "/topics/measurement"],
  ["Topic - Electronics", "/topics/electronics"], ["Topic - Energy", "/topics/energy"], ["Graph Studio", "/graphs"],
  ["Knowledge Graph", "/graph"], ["Projects", "/projects"], ["Settings", "/settings"], ["Backup", "/backup"], ["Help", "/help"],
  ["Scientific Trust", "/trust"], ["Privacy", "/privacy"], ["Terms", "/terms"],
].map(([pageName, route], index) => ({ pageType: "Page", pageName, route, sequence: index + 1 }));

const lessonData = JSON.parse(await fs.readFile(dataPath, "utf8"));
const sortedLessons = lessonData.lessonProfiles
  .slice()
  .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
const lessonPages = sortedLessons.map((lesson, index) => ({
  pageType: "Lesson Lab",
  pageName: lesson.title,
  lessonId: index + 1,
  lessonCode: lesson.lessonId,
  category: lesson.category,
  classLevel: lesson.classLevel,
  route: `/experiments/${lesson.lessonId}`,
  sequence: index + 1,
}));

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
const filenameFor = (entry) => entry.pageType === "Lesson Lab"
  ? `${String(entry.lessonId).padStart(3, "0")}__lesson__${slugify(entry.pageName)}__${entry.lessonCode}.png`
  : `${String(entry.sequence).padStart(3, "0")}__page__${slugify(entry.pageName)}.png`;

await fs.mkdir(path.join(captureRoot, "Pages"), { recursive: true });
await fs.mkdir(path.join(captureRoot, "Lessons"), { recursive: true });

const browser = await chromium.launch({
  executablePath: browserPath,
  headless: true,
  args: ["--disable-gpu", "--hide-scrollbars", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await context.addInitScript(() => sessionStorage.setItem("physicslab-splash-v1", "1"));
const records = [];
let completedCount = 0;

async function capture(page, entry, globalIndex) {
  const folder = entry.pageType === "Lesson Lab" ? "Lessons" : "Pages";
  const fileName = filenameFor(entry);
  const outputPath = path.join(captureRoot, folder, fileName);
  const url = baseUrl + entry.route;
  let navigationNote = "";
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch (error) {
    navigationNote = `Navigation warning: ${error.message}`;
  }
  await page.waitForTimeout(500);
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  const title = await page.title();
  const dimensions = await page.evaluate(() => ({
    width: Math.ceil(document.documentElement.scrollWidth),
    height: Math.ceil(document.documentElement.scrollHeight),
    textLength: document.body?.innerText?.length ?? 0,
  }));
  let captureMode = "single";
  let tileCount = 0;
  try {
    await page.screenshot({ path: outputPath, fullPage: true, animations: "disabled" });
  } catch (error) {
    captureMode = "tiled";
    const tileHeight = 10000;
    tileCount = Math.ceil(dimensions.height / tileHeight);
    for (let tileIndex = 0; tileIndex < tileCount; tileIndex += 1) {
      const y = tileIndex * tileHeight;
      const height = Math.min(tileHeight, dimensions.height - y);
      const tilePath = outputPath.replace(/\.png$/, `.part${String(tileIndex).padStart(3, "0")}.png`);
      await page.screenshot({ path: tilePath, clip: { x: 0, y, width: dimensions.width, height }, animations: "disabled" });
    }
  }
  const record = {
    ...entry,
    url,
    title,
    fileName,
    filePath: outputPath,
    width: dimensions.width,
    height: dimensions.height,
    textLength: dimensions.textLength,
    captureMode,
    tileCount,
    status: dimensions.textLength > 0 ? "Captured" : "Captured - blank page",
    note: navigationNote,
  };
  records.push(record);
  completedCount += 1;
  console.log(`${String(completedCount).padStart(3, "0")}/142\t${record.status}\t${captureMode}\t${entry.pageType}\t${entry.pageName}\t${dimensions.height}px`);
}

const allEntries = [...staticPages, ...lessonPages];
let nextIndex = 0;
async function worker() {
  const page = await context.newPage();
  while (true) {
    const index = nextIndex;
    nextIndex += 1;
    if (index >= allEntries.length) break;
    try {
      await capture(page, allEntries[index], index);
    } catch (error) {
      const entry = allEntries[index];
      records.push({ ...entry, url: baseUrl + entry.route, fileName: filenameFor(entry), status: "Failed", note: error.message });
      completedCount += 1;
      console.log(`${String(completedCount).padStart(3, "0")}/142\tFailed\t${entry.pageType}\t${entry.pageName}\t${error.message}`);
    }
  }
  await page.close();
}
await Promise.all(Array.from({ length: 4 }, () => worker()));

await browser.close();
records.sort((a, b) => (a.pageType === b.pageType ? a.sequence - b.sequence : a.pageType.localeCompare(b.pageType)));

const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvHeaders = ["Page Type", "Page Name", "Lesson ID", "Lesson Code", "Category", "Class Level", "Route", "URL", "Filename", "Width", "Height", "Capture Mode", "Tile Count", "Status", "Notes"];
const csvRows = records.map((record) => [record.pageType, record.pageName, record.lessonId, record.lessonCode, record.category, record.classLevel,
  record.route, record.url, record.fileName, record.width, record.height, record.captureMode, record.tileCount, record.status, record.note]);
await fs.writeFile(path.join(captureRoot, "screenshot_index.csv"), [csvHeaders, ...csvRows].map((row) => row.map(escapeCsv).join(",")).join("\r\n"), "utf8");
await fs.writeFile(path.join(captureRoot, "screenshot_index.json"), JSON.stringify(records, null, 2), "utf8");
console.log(JSON.stringify({ total: records.length, captured: records.filter((row) => row.status.startsWith("Captured")).length, failed: records.filter((row) => row.status === "Failed").length, tiled: records.filter((row) => row.captureMode === "tiled").length }));
