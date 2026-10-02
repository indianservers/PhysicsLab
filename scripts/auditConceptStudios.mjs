import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

let routes = [
  "concept-studio",
  "concept-studio/measurement",
  "concept-studio/mechanics",
  "concept-studio/motion-kinematics",
  "concept-studio/force-newton",
  "concept-studio/work-energy-power",
  "concept-studio/gravitation",
  "concept-studio/oscillations",
  "concept-studio/waves-sound",
  "concept-studio/optics",
  "concept-studio/electricity",
  "concept-studio/magnetism",
  "concept-studio/electronics",
  "concept-studio/thermodynamics",
  "concept-studio/fluid-mechanics",
  "concept-studio/modern-physics",
  "concept-studio/astronomy-astrophysics",
];
if (process.env.STUDIO_AUDIT_ROUTE) routes = routes.filter((route) => route === process.env.STUDIO_AUDIT_ROUTE);

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const mobile = process.env.STUDIO_AUDIT_MOBILE === "1";
const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
const results = [];
const outputDirectory = mobile ? "artifacts/concept-studio-audit-mobile" : "artifacts/concept-studio-audit";
await mkdir(outputDirectory, { recursive: true });

for (const route of routes) {
  const errors = [];
  const onConsole = (message) => {
    if (message.type() === "error") errors.push(message.text());
  };
  page.on("console", onConsole);
  const response = await page.goto(`http://localhost:5367/${route}`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForTimeout(650);
  const metrics = await page.evaluate(() => {
    const images = [...document.images];
    const main = document.querySelector(".csh-main");
    return {
      title: document.querySelector("h1")?.textContent?.trim() ?? "",
      statusText: document.body.innerText.length,
      canvases: document.querySelectorAll("canvas").length,
      buttons: document.querySelectorAll("button").length,
      brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      referenceImages: images.filter((image) => image.src.includes("reference-mockups")).length,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      mainWidth: main ? Math.round(main.getBoundingClientRect().width) : 0,
      conceptHeadingColor: getComputedStyle(document.querySelector(".csh-concepts h2") ?? document.body).color,
      conceptTitleColor: getComputedStyle(document.querySelector(".csh-concept-grid b") ?? document.body).color,
    };
  });
  let interaction = null;
  if (route !== "concept-studio") {
    const runButton = page.locator(".csh-hero-copy button").first();
    const before = await runButton.textContent();
    await runButton.evaluate((element) => element.click());
    await page.locator(".csh-display-toggles button").first().evaluate((element) => element.click());
    await page.waitForTimeout(50);
    interaction = {
      runChanged: before !== await runButton.textContent(),
      gridChanged: await page.locator(".csh-stage").evaluate((element) => element.classList.contains("csh-hide-grid")),
    };
  }
  await page.screenshot({ path: `${outputDirectory}/${route.replaceAll("/", "-")}.png`, fullPage: true });
  results.push({ route: `/${route}`, http: response?.status(), ...metrics, interaction, errors });
  page.off("console", onConsole);
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
