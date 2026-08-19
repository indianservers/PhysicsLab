import fs from "node:fs";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Pass the Rocket Parts brief path.");

const text = fs.readFileSync(sourcePath, "utf8").replace(/\r/g, "");
const systemNames = {
  A: "Payload System",
  B: "Structural System",
  C: "Aerodynamic Control",
  D: "Propulsion System",
  E: "Propellant Storage & Feed",
  F: "Avionics",
  G: "Guidance, Navigation & Control",
  H: "Electrical Power",
  I: "Communications & Telemetry",
  J: "Flight Safety",
  K: "Stage Separation",
  L: "Thermal Protection",
  M: "Recovery System",
  N: "Ground Interface",
};

const sectionPattern = /^## ([A-N])\. ([^\n]+)$/gm;
const sections = [...text.matchAll(sectionPattern)];
const parts = [];

for (let s = 0; s < sections.length; s += 1) {
  const start = sections[s].index + sections[s][0].length;
  const end = sections[s + 1]?.index ?? text.indexOf("# 7. COMPONENT CARD DESIGN");
  const block = text.slice(start, end);
  const matches = [...block.matchAll(/^### (\d+)\. ([^\n]+)$/gm)];
  for (let i = 0; i < matches.length; i += 1) {
    const itemStart = matches[i].index + matches[i][0].length;
    const itemEnd = matches[i + 1]?.index ?? block.length;
    const details = block.slice(itemStart, itemEnd).trim();
    const purpose = details.match(/Purpose:\s*([^\n]+)/)?.[1]?.trim() ?? "Purpose documented in the engineering reference.";
    const abbreviation = details.match(/Abbreviation:\s*([^\n]+)/)?.[1]?.trim();
    const notes = details
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("Purpose:") && !line.startsWith("Abbreviation:") && line !== "---")
      .join(" ");
    parts.push({
      number: Number(matches[i][1]),
      name: matches[i][2].trim(),
      purpose,
      abbreviation,
      notes,
      system: systemNames[sections[s][1]],
    });
  }
}

if (parts.length !== 225) throw new Error(`Expected 225 parts, found ${parts.length}.`);

const output = `// Generated from the approved Rocket Parts brief. Do not edit by hand.\nexport const rocketPartSeed = ${JSON.stringify(parts, null, 2)} as const;\n`;
fs.mkdirSync("src/data/rocketParts", { recursive: true });
fs.writeFileSync("src/data/rocketParts/catalog.generated.ts", output);
console.log(`Generated ${parts.length} rocket-part records.`);
