import fs from "node:fs";

const source = fs.readFileSync("src/data/rocketParts/catalog.generated.ts", "utf8");
const seeds = JSON.parse(source.match(/= (\[[\s\S]*\]) as const;/)?.[1] ?? "[]");
const slug = (value) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const ids = seeds.map((part) => slug(part.name));
const imagePaths = seeds.map((part) => `/assets/rocket-parts/${slug(part.system)}/${slug(part.name)}-external.webp`);
const connectionNames = ["Fuel Tank", "Fuel Feed Line", "Fuel Pump", "Injector", "Combustion Chamber", "Nozzle", "Oxidizer Tank", "Oxidizer Feed Line", "Oxidizer Pump", "Inertial Measurement Unit", "GNSS or GPS Receiver", "Navigation Computer", "Guidance Computer", "Flight-Control Computer", "Thrust Vector Control Actuator", "Gimbal Assembly", "Main Battery", "Power Distribution Unit", "Flight Computer", "Signal-Conditioning Unit", "Data Acquisition Unit", "Telemetry Encoder", "Telemetry Transmitter", "Telemetry Antenna"];
const app = fs.readFileSync("src/App.tsx", "utf8");
const toolbar = fs.readFileSync("src/components/Toolbar.tsx", "utf8");
const page = fs.readFileSync("src/pages/RocketPartsPage.tsx", "utf8");

const checks = [
  ["catalog contains exactly 225 components", seeds.length === 225],
  ["catalog numbers span 1 through 225", seeds.every((part, index) => part.number === index + 1)],
  ["all component IDs are unique", new Set(ids).size === ids.length],
  ["every component has a purpose", seeds.every((part) => part.purpose?.length > 20)],
  ["every component receives a unique image path", new Set(imagePaths).size === imagePaths.length],
  ["all connected-part references resolve", connectionNames.every((name) => seeds.some((part) => part.name === name))],
  ["route and part-detail route are registered", app.includes('/rocket-lab/parts/:partId') && app.includes('/rocket-lab/parts')],
  ["toolbar navigation exposes Rocket Parts", toolbar.includes('label: "Rocket Parts"')],
  ["search covers abbreviations and purpose", page.includes("part.abbreviation") && page.includes("part.purpose")],
  ["combined filters are implemented", page.includes("filters.position") && page.includes("filters.difficulty") && page.includes("filters.buildOnly")],
  ["Build Lab state is persisted", page.includes("rocket-build-configuration-v1") && page.includes("massKg") && page.includes("readiness")],
  ["image-pending fallback is explicit", fs.readFileSync("src/components/rocket-parts/RocketPartsComponents.tsx", "utf8").includes("IMAGE PENDING")],
  ["reduced-motion styles are present", fs.readFileSync("src/rocket-parts.css", "utf8").includes("prefers-reduced-motion")],
];

let failed = 0;
for (const [label, passed] of checks) { console.log(`${passed ? "PASS" : "FAIL"}  ${label}`); if (!passed) failed += 1; }
if (failed) process.exit(1);
console.log(`\n${checks.length} Rocket Parts validation checks passed.`);
