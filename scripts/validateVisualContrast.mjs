import fs from "node:fs";

const styles = fs.readFileSync("src/styles.css", "utf8");
const scaleCss = fs.readFileSync("src/physics/scale-of-universe/scaleUniverse.css", "utf8");
const renderer = fs.readFileSync("src/physics/scale-of-universe/scaleUniverseRenderer.js", "utf8");
const immersivePages = [
  "src/physics/scale-of-universe/ScaleOfUniversePage.tsx",
  "src/pages/ClientDemosPage.tsx",
  "src/pages/ConceptExperiencesPage.tsx",
  "src/pages/ProLabPage.tsx",
  "src/pages/ProLabProgramPage.tsx",
  "src/pages/RocketPartsPage.tsx",
  "src/pages/AppDirectoryPage.tsx",
  "src/pages/AstroPhysicsPage.tsx",
];

const checks = [
  ["global heading recoloring excludes dark workspaces", styles.includes('h1:not([data-ui-theme="dark"] *)')],
  ["global body-copy recoloring excludes dark workspaces", styles.includes('p:not([data-ui-theme="dark"] *)') && styles.includes('li:not([data-ui-theme="dark"] *)')],
  ["global form recoloring excludes dark workspaces", styles.includes('input:not([data-ui-theme="dark"] *)') && styles.includes('textarea:not([data-ui-theme="dark"] *)')],
  ["all immersive page families declare their theme", immersivePages.every((path) => fs.readFileSync(path, "utf8").includes('data-ui-theme="dark"'))],
  ["universe explorer uses realistic reference layers", renderer.includes("galaxy-atlas.png") && renderer.includes("cosmic-timeline.png") && renderer.includes("black-hole-lensing.png")],
  ["universe text palette keeps bright foreground colors", scaleCss.includes("#f8fafc") && scaleCss.includes("#e0f2fe") && scaleCss.includes("#67e8f9")],
  ["scale thumb meets improved violet contrast", scaleCss.includes("background: #6d28d9")],
];

let failed = 0;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}`);
  if (!pass) failed += 1;
}
if (failed) process.exit(1);
console.log(`\n${checks.length} visual-contrast checks passed.`);
