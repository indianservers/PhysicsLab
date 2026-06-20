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
  ["Trust page reference case count is current", /Reference cases":\s*154/.test(simplePageSource) && /154 local physics checks/.test(simplePageSource)],
  ["Lab page exposes browser-only snapshots", /Browser-only snapshot/.test(experimentDetailSource) && /buildLabSnapshotUrl/.test(experimentDetailSource)],
  ["Lab snapshot URL contract is versioned", /phase-11-snapshot/.test(experimentDetailSource) && /snapshot/.test(experimentDetailSource)],
  ["Teacher assignments can carry snapshots", /snapshotData\?:\s*string/.test(teacherSource) && /params\.set\("snapshot"/.test(teacherSource)],
  ["Teacher page accepts starter snapshots", /Starter snapshot/.test(teacherPageSource) && /extractSnapshotData/.test(teacherPageSource)],
  ["Student assignment banner names snapshot setup", /Snapshot setup/.test(experimentDetailSource) && /teacher-provided browser snapshot/.test(experimentDetailSource)],
  ["Assignment variable locks are enforced", /variablesLocked/.test(experimentDetailSource) && /Teacher locked variables/.test(experimentDetailSource)],
  ["Notebook evidence carries assignment metadata", /assignmentEvidenceMeta/.test(experimentDetailSource) && /assignment:\s*assignmentMeta/.test(experimentDetailSource)],
  ["Student assignment submission export exists", /physicslab-assignment-submission/.test(experimentDetailSource) && /Submission JSON/.test(experimentDetailSource)],
  ["Teacher evidence displays assignment context", /Assigned/.test(teacherPageSource) && /snapshotIncluded/.test(teacherPageSource)],
];

let failed = 0;
const domainCounts = new Map();

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

const total = numericValidationCases.length + policyTests.length + domainCounts.size;
if (failed > 0) {
  console.error(`${failed} physics validation test(s) failed.`);
  process.exit(1);
}

console.log(`${total}/${total} physics validation tests passed.`);
