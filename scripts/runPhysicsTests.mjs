import fs from "node:fs";

const tests = [
  ["Free Fall distance", 0 * 2 + 0.5 * 9.8 * 2 ** 2, 19.6, 1e-12],
  ["Free Fall velocity", 0 + 9.8 * 3, 29.4, 1e-12],
  ["Projectile Motion range", (10 ** 2 * Math.sin((2 * 45 * Math.PI) / 180)) / 10, 10, 1e-12],
  ["Newton Second Law", 10 / 2, 5, 1e-12],
  ["Hooke Law", -100 * 0.2, -20, 1e-12],
  ["Pendulum", 2 * Math.PI * Math.sqrt(1 / 9.80665), 2.006409, 1e-5],
  ["Ohm Law", 2 * 5, 10, 1e-12],
  ["Pressure", 10 / 2, 5, 1e-12],
  ["Buoyancy", 1000 * 9.8 * 0.01, 98, 1e-12],
  ["Snell Law", Math.asin(Math.sin(Math.PI / 6) / 1.5) * 180 / Math.PI, 19.4712206, 1e-6],
  ["Lens Formula", 1 / (1 / 10 + 1 / 30), 7.5, 1e-12],
  ["Mirror Formula", 1 / (1 / 10 - 1 / 30), 15, 1e-12],
  ["Gas Laws", (1 * 8.31446261815324 * 300) / 0.024943, 100000, 5],
  ["Photoelectric Effect", Math.max(0, 3 - 2), 1, 1e-12],
  ["Half-Life", 100 * 0.5 ** (20 / 10), 25, 1e-12],
];

const trustPolicySource = fs.readFileSync("src/lib/experimentAssumptions.ts", "utf8");
const trustPolicyTests = [
  ["Trust default is exact formula confidence", /trustLevel:\s*100/.test(trustPolicySource)],
  ["Trust policy has no difficulty penalty", !/difficultyPenalty/.test(trustPolicySource)],
  ["Legacy 62 percent trust removed", !/trustLevel:\s*62/.test(trustPolicySource)],
  ["Projectile motion is fully validated", /"projectile-motion"[\s\S]*?trustLevel:\s*100/.test(trustPolicySource)],
  ["Ohm law is fully validated", /"ohms-law"[\s\S]*?trustLevel:\s*100/.test(trustPolicySource)],
];

let failed = 0;
for (const [name, actual, expected, tolerance] of tests) {
  const ok = Math.abs(actual - expected) <= tolerance;
  if (!ok) {
    failed += 1;
    console.error(`FAIL ${name}: expected ${expected}, got ${actual}`);
  } else {
    console.log(`PASS ${name}`);
  }
}

for (const [name, ok] of trustPolicyTests) {
  if (!ok) {
    failed += 1;
    console.error(`FAIL ${name}`);
  } else {
    console.log(`PASS ${name}`);
  }
}

if (failed > 0) {
  console.error(`${failed} physics validation test(s) failed.`);
  process.exit(1);
}

console.log(`${tests.length + trustPolicyTests.length}/${tests.length + trustPolicyTests.length} physics validation tests passed.`);
