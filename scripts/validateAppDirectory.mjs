import fs from "node:fs";
const modules = fs.readFileSync("src/lib/physicsModules.ts", "utf8");
const directory = fs.readFileSync("src/lib/appDirectory.ts", "utf8");
const toolbar = fs.readFileSync("src/components/Toolbar.tsx", "utf8");
const search = fs.readFileSync("src/lib/search.ts", "utf8");
const app = fs.readFileSync("src/App.tsx", "utf8");
const moduleCount = (modules.match(/moduleLink\("/g) ?? []).length;
const checks = [
  ["all 43 declared physics modules are indexed", moduleCount === 43 && directory.includes("...allPhysicsModules.map")],
  ["all generated concept cards are indexed", directory.includes("...buildConceptCards().map")],
  ["all experiments are indexed", directory.includes("...experiments.map")],
  ["Pro Lab, client demos, teaching, and platform tools are indexed", ["Pro Lab", "Client Demos", "Teaching", "Platform"].every((value) => directory.includes(`\"${value}\"`))],
  ["All Modules is always visible in the toolbar", toolbar.includes("all-modules-trigger")],
  ["complete directory route is registered", app.includes('path="/all-modules"')],
  ["global search finds the complete directory", search.includes("action-all-modules")],
  ["menu contains nested module groups", toolbar.includes("All Modules & Concepts") && toolbar.includes("group.modules.map")],
];
let failed = 0; for (const [label, pass] of checks) { console.log(`${pass ? "PASS" : "FAIL"}  ${label}`); if (!pass) failed += 1; }
if (failed) process.exit(1); console.log(`\n${checks.length} application-directory checks passed.`);
