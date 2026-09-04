import { readFileSync } from "node:fs";

const contentSource = readFileSync(new URL("../src/lib/lessonTeachingContent.ts", import.meta.url), "utf8");
const progressSource = readFileSync(new URL("../docs/PHYSICS_LESSON_IMPLEMENTATION_PROGRESS.md", import.meta.url), "utf8");
const uxSource = readFileSync(new URL("../src/components/LessonUXStudio.tsx", import.meta.url), "utf8");
const upgradeSource = readFileSync(new URL("../src/lib/lessonUiUpgrades.ts", import.meta.url), "utf8");
const investigationSource = readFileSync(new URL("../src/components/LessonInvestigationConsole.tsx", import.meta.url), "utf8");
const contentIds = [...contentSource.matchAll(/^\s+"([^"]+)": \{ title:/gm)].map((match) => match[1]);
const routeIds = [...progressSource.matchAll(/^\|\s+\d+\s+\|.*?\|\s*\/experiments\/([^\s|]+)\s*\|/gm)].map((match) => match[1]);
const duplicates = contentIds.filter((id, index) => contentIds.indexOf(id) !== index);
const missing = routeIds.filter((id) => !contentIds.includes(id));
const extra = contentIds.filter((id) => !routeIds.includes(id));
const uniqueLabels = [...uxSource.matchAll(/label: "(Signature manipulation|Concept animation|Prediction challenge|Authentic measurement|Mastery mission)"/g)].map((match) => match[1]);
const commonLabels = [...uxSource.matchAll(/<li><b>(Consistent controls|Learning sequence|One source of truth|Accessible input|Persistent workspace)<\/b>/g)].map((match) => match[1]);
const upgradeIds = [...upgradeSource.matchAll(/^\s+"([^"]+)": upgrade\(/gm)].map((match) => match[1]);
const upgradeModes = [...upgradeSource.matchAll(/^\s+"[^"]+": upgrade\("([^"]+)"/gm)].map((match) => match[1]);
const missingUpgrades = routeIds.filter((id) => !upgradeIds.includes(id));
const extraUpgrades = upgradeIds.filter((id) => !routeIds.includes(id));
const duplicateUpgradeIds = upgradeIds.filter((id, index) => upgradeIds.indexOf(id) !== index);
const duplicateModes = upgradeModes.filter((mode, index) => upgradeModes.indexOf(mode) !== index);
const interactionContracts = ["Pin trial A", "Pin trial B", "SYNCHRONIZED TIMELINE", "Export lesson evidence", 'control("play")', 'control("pause")', 'control("step")', 'control("reset")'];
const missingInteractionContracts = interactionContracts.filter((contract) => !investigationSource.includes(contract));

if (routeIds.length !== 80 || contentIds.length !== 80 || duplicates.length || missing.length || extra.length || uniqueLabels.length !== 5 || commonLabels.length !== 5 || upgradeIds.length !== 80 || missingUpgrades.length || extraUpgrades.length || duplicateUpgradeIds.length || duplicateModes.length || missingInteractionContracts.length) {
  console.error({ routeCount: routeIds.length, contentCount: contentIds.length, duplicates, missing, extra, uniqueLabels, commonLabels, upgradeCount: upgradeIds.length, missingUpgrades, extraUpgrades, duplicateUpgradeIds, duplicateModes, missingInteractionContracts });
  process.exit(1);
}

console.log(`PASS lesson-specific theory and examples: ${contentIds.length}/${routeIds.length} routes covered.`);
console.log("PASS lesson UX contract: 5 lesson-specific elements + 5 common elements.");
console.log(`PASS lesson-specific UI upgrades: ${upgradeIds.length}/${routeIds.length} unique modes with comparison, timeline, evidence, and playback controls.`);
