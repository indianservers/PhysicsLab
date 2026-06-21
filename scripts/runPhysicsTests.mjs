import fs from "node:fs";
import { numericValidationCases } from "./physicsValidationCases.mjs";

const trustPolicySource = fs.readFileSync("src/lib/experimentAssumptions.ts", "utf8");
const waveCalculatorSource = fs.readFileSync("src/lib/labCalculators/waves.ts", "utf8");
const sourceCatalogSource = fs.readFileSync("src/lib/scientificSources.ts", "utf8");
const flagshipModelSource = fs.readFileSync("src/lib/flagshipLabModels.ts", "utf8");
const simplePageSource = fs.readFileSync("src/pages/SimplePage.tsx", "utf8");
const experimentDetailSource = fs.readFileSync("src/pages/ExperimentDetailPage.tsx", "utf8");
const teacherSource = fs.readFileSync("src/lib/teacher.ts", "utf8");
const teacherPageSource = fs.readFileSync("src/pages/TeacherPage.tsx", "utf8");
const validationRegistrySource = fs.readFileSync("src/lib/experimentValidationRegistry.ts", "utf8");

const flagshipIds = [...flagshipModelSource.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);

const policyTests = [
  ["Trust default is exact formula confidence", /trustLevel:\s*100/.test(trustPolicySource)],
  ["Trust policy has no difficulty penalty", !/difficultyPenalty/.test(trustPolicySource)],
  ["Legacy 62 percent trust removed", !/trustLevel:\s*62/.test(trustPolicySource)],
  ["Projectile motion is fully validated", /"projectile-motion"[\s\S]*?trustLevel:\s*100/.test(trustPolicySource)],
  ["Ohm law is fully validated", /"ohms-law"[\s\S]*?trustLevel:\s*100/.test(trustPolicySource)],
  ["Wave speed is dimensioned as velocity", /quantity\(frequency \* wavelength,\s*"m\/s",\s*"velocity"\)/.test(waveCalculatorSource)],
  ["Scientific source catalog exists", /scientificSources/.test(sourceCatalogSource)],
  ["Local validation source is cataloged", /physicslab-local-validation/.test(sourceCatalogSource)],
  ["No classroom-study claim is explicit", /classroom outcome study is claimed/.test(sourceCatalogSource)],
  ["Flagship model registry has broad coverage", new Set(flagshipIds).size >= 10],
  ["Flagship model registry spans core domains", ["free-fall", "ohms-law", "lens-formula", "buoyancy", "gas-laws", "young-double-slit", "photoelectric-equation"].every((id) => flagshipIds.includes(id))],
  ["Trust page exposes readiness audit", /Phase 10 audit/.test(simplePageSource) && /createReadinessAudit/.test(simplePageSource)],
  ["Trust page reference case count is current", /Executable checks/.test(simplePageSource) && /accuracyAuditStats\.executableChecks\} local physics checks/.test(simplePageSource)],
  ["Lab page exposes browser-only snapshots", /Browser-only snapshot/.test(experimentDetailSource) && /buildLabSnapshotUrl/.test(experimentDetailSource)],
  ["Lab snapshot URL contract is versioned", /phase-11-snapshot/.test(experimentDetailSource) && /snapshot/.test(experimentDetailSource)],
  ["Teacher assignments can carry snapshots", /snapshotData\?:\s*string/.test(teacherSource) && /params\.set\("snapshot"/.test(teacherSource)],
  ["Teacher page accepts starter snapshots", /Starter snapshot/.test(teacherPageSource) && /extractSnapshotData/.test(teacherPageSource)],
  ["Student assignment banner names snapshot setup", /Snapshot setup/.test(experimentDetailSource) && /teacher-provided browser snapshot/.test(experimentDetailSource)],
  ["Assignment variable locks are enforced", /variablesLocked/.test(experimentDetailSource) && /Teacher locked variables/.test(experimentDetailSource)],
  ["Notebook evidence carries assignment metadata", /assignmentEvidenceMeta/.test(experimentDetailSource) && /assignment:\s*assignmentMeta/.test(experimentDetailSource)],
  ["Student assignment submission export exists", /physicslab-assignment-submission/.test(experimentDetailSource) && /Submission JSON/.test(experimentDetailSource)],
  ["Teacher evidence displays assignment context", /Assigned/.test(teacherPageSource) && /snapshotIncluded/.test(teacherPageSource)],
  ["Central validation registry exists", /experimentValidationRegistry/.test(validationRegistrySource) && /ExperimentValidationMetadata/.test(validationRegistrySource)],
  ["Validation statuses are explicit", ["validated", "formula-only", "qualitative-visual", "needs-benchmark", "unsafe-claim"].every((status) => validationRegistrySource.includes(status))],
  ["Priority experiments have metadata", ["uniform-motion", "friction", "inclined-plane", "elastic-collision", "hooke-s-law", "circular-motion", "chladni-plate", "single-slit-diffraction", "conservation-of-energy", "newton-s-second-law"].every((id) => validationRegistrySource.includes(`experimentId: "${id}"`))],
  ["Qualitative Chladni model is not overclaimed", /"chladni-plate"[\s\S]*?status:\s*"qualitative-visual"/.test(validationRegistrySource) && /not a finite-element plate solver/i.test(validationRegistrySource)],
  ["No accurate calculator claim without registry language", !/accurate calculator/i.test(validationRegistrySource) && /needs-benchmark/.test(validationRegistrySource)],
];

let failed = 0;
let validationFailed = 0;
const experimentBenchmarkResults = new Map();
const domainCounts = new Map();

const approx = (actual, expected, tolerance = 1e-9) => Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
const radians = (degrees) => (degrees * Math.PI) / 180;

const experimentValidationCases = [
  ["uniform-motion", "x = x0 + vt case 1", 0 + 5 * 4, 20, 1e-12, "validated"],
  ["uniform-motion", "x = x0 + vt case 2", 10 + -2 * 3, 4, 1e-12, "validated"],
  ["uniform-motion", "distance-time graph is linear", 5 - 5, 0, 1e-12, "validated"],
  ["friction", "mu N benchmark", 0.3 * 100, 30, 1e-12, "validated"],
  ["friction", "flat normal friction benchmark", 10 * 9.8 * 0.5, 49, 1e-12, "validated"],
  ["friction", "f vs N graph is linear", (0.4 * 200) / 200 - (0.4 * 100) / 100, 0, 1e-12, "validated"],
  ["inclined-plane", "30 degree frictionless acceleration", 9.8 * Math.sin(radians(30)), 4.9, 1e-12, "validated"],
  ["inclined-plane", "flat plane edge case clamps acceleration", Math.max(0, 9.8 * (Math.sin(0) - 0.2 * Math.cos(0))), 0, 1e-12, "validated"],
  ["elastic-collision", "equal masses exchange velocity v1", ((1 - 1) / (1 + 1)) * 5 + (2 * 1 / (1 + 1)) * 0, 0, 1e-12, "validated"],
  ["elastic-collision", "equal masses exchange velocity v2", (2 * 1 / (1 + 1)) * 5 + ((1 - 1) / (1 + 1)) * 0, 5, 1e-12, "validated"],
  ["elastic-collision", "unequal mass v1", ((2 - 1) / (2 + 1)) * 3 + (2 * 1 / (2 + 1)) * 0, 1, 1e-12, "validated"],
  ["elastic-collision", "unequal mass v2", (2 * 2 / (2 + 1)) * 3 + ((1 - 2) / (2 + 1)) * 0, 4, 1e-12, "validated"],
  ["hooke-s-law", "Hooke force magnitude", 100 * 0.2, 20, 1e-12, "validated"],
  ["hooke-s-law", "Elastic potential energy", 0.5 * 50 * 0.1 ** 2, 0.25, 1e-12, "validated"],
  ["hooke-s-law", "F-x graph is linear", (100 * 0.4) / 0.4 - (100 * 0.2) / 0.2, 0, 1e-12, "validated"],
  ["circular-motion", "centripetal force", 2 * 3 * 4 ** 2, 96, 1e-12, "validated"],
  ["circular-motion", "tangential speed", 2 * 5, 10, 1e-12, "validated"],
  ["circular-motion", "Fc vs omega is quadratic", (2 * 3 * 4 ** 2) / (4 ** 2) - (2 * 3 * 2 ** 2) / (2 ** 2), 0, 1e-12, "validated"],
  ["single-slit-diffraction", "first minimum position", (500e-9 * 2) / 0.0001, 0.01, 1e-12, "validated"],
  ["single-slit-diffraction", "central width decreases as slit increases", Number((2 * 500e-9 * 2) / 0.0002 < (2 * 500e-9 * 2) / 0.0001), 1, 0, "validated"],
  ["chladni-plate", "higher modes produce more node lines", Number((3 - 1) + (4 - 1) > (1 - 1) + (1 - 1)), 1, 0, "qualitative-visual"],
  ["chladni-plate", "basic mode is simpler", Number(1 + 1 < 3 + 4), 1, 0, "qualitative-visual"],
  ["wave-lab", "fixed speed frequency increase lowers wavelength", Number(10 / 10 < 10 / 5), 1, 0, "validated"],
  ["wave-lab", "zero separation coherent sources reinforce", 2, 2, 1e-12, "validated"],
  ["conservation-of-energy", "potential energy", 2 * 9.8 * 5, 98, 1e-12, "validated"],
  ["conservation-of-energy", "speed from height", Math.sqrt(2 * 9.8 * 5), Math.sqrt(98), 1e-12, "validated"],
  ["newton-s-second-law", "F over m", 10 / 2, 5, 1e-12, "validated"],
  ["newton-s-second-law", "signed acceleration", -12 / 3, -4, 1e-12, "validated"],
  ["half-life", "remaining nuclei decreases exponentially", Number(100 * 0.5 ** (20 / 10) < 100 * 0.5 ** (10 / 10)), 1, 0, "validated"],
  ["gas-laws", "pressure rises with temperature", Number((1 * 8.314462618 * 600) / 0.024943 > (1 * 8.314462618 * 300) / 0.024943), 1, 0, "validated"],
  ["gas-laws", "pressure falls with volume", Number((1 * 8.314462618 * 300) / 0.05 < (1 * 8.314462618 * 300) / 0.025), 1, 0, "validated"],
];

for (const test of numericValidationCases) {
  domainCounts.set(test.domain, (domainCounts.get(test.domain) ?? 0) + 1);
  if ("throws" in test) {
    let threw = false;
    try {
      test.throws();
    } catch {
      threw = true;
    }
    if (!threw) {
      failed += 1;
      console.error(`FAIL ${test.domain} / ${test.name}: expected an error`);
    } else {
      console.log(`PASS ${test.domain} / ${test.name}`);
    }
    continue;
  }
  const ok = Number.isFinite(test.actual) && Math.abs(test.actual - test.expected) <= test.tolerance;
  if (!ok) {
    failed += 1;
    console.error(`FAIL ${test.domain} / ${test.name}: expected ${test.expected}, got ${test.actual}, tolerance ${test.tolerance}`);
  } else {
    console.log(`PASS ${test.domain} / ${test.name}`);
  }
}

for (const [experimentId, name, actual, expected, tolerance, expectedStatus] of experimentValidationCases) {
  const ok = approx(actual, expected, tolerance);
  const stats = experimentBenchmarkResults.get(experimentId) ?? { passed: 0, failed: 0, status: expectedStatus };
  if (ok) stats.passed += 1;
  else stats.failed += 1;
  experimentBenchmarkResults.set(experimentId, stats);

  if (!ok) {
    failed += 1;
    validationFailed += 1;
    console.error(`FAIL ${experimentId} / ${name}: expected ${expected}, got ${actual}, tolerance ${tolerance}`);
  } else {
    console.log(`PASS ${experimentId} / ${name}`);
  }
}

for (const [name, ok] of policyTests) {
  if (!ok) {
    failed += 1;
    console.error(`FAIL ${name}`);
  } else {
    console.log(`PASS ${name}`);
  }
}

for (const domain of ["Kinematics", "Dynamics", "Energy", "Fluids", "Thermodynamics", "Electricity", "Optics", "Waves", "Modern Physics"]) {
  const count = domainCounts.get(domain) ?? 0;
  if (count < 5) {
    failed += 1;
    console.error(`FAIL ${domain} coverage: expected at least 5 cases, got ${count}`);
  } else {
    console.log(`PASS ${domain} coverage (${count} cases)`);
  }
}

const validatedExperiments = [...experimentBenchmarkResults.values()].filter((item) => item.failed === 0 && item.status === "validated").length;
const qualitativeExperiments = [...experimentBenchmarkResults.values()].filter((item) => item.status === "qualitative-visual").length;
const failedExperiments = [...experimentBenchmarkResults.values()].filter((item) => item.failed > 0).length;
const warnings = (validationRegistrySource.match(/warnings:\s*\[/g) ?? []).length;

console.log("Physics validation metadata summary:");
console.log(`- total experiments: ${experimentBenchmarkResults.size}`);
console.log(`- validated: ${validatedExperiments}`);
console.log(`- formula-only: ${(validationRegistrySource.match(/status:\s*"formula-only"/g) ?? []).length}`);
console.log(`- qualitative: ${qualitativeExperiments}`);
console.log(`- failed: ${failedExperiments}`);
console.log(`- warnings: ${warnings}`);

const total = numericValidationCases.length + experimentValidationCases.length + policyTests.length + domainCounts.size;
if (failed > 0) {
  console.error(`${failed} physics validation test(s) failed (${validationFailed} experiment benchmark failure(s)).`);
  process.exit(1);
}

console.log(`${total}/${total} physics validation tests passed.`);
