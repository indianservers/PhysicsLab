import assert from "node:assert/strict";
import { build } from "esbuild";
const compiled = await build({ entryPoints: ["src/experiments/chaotic-coupled-oscillators/chaotic-coupled-oscillatorsSimulation.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { defaultCoupledParams, rk4Step, oscillatorEnergy } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`);
function trial(damping, drive, duration = 60) {
  const params = { ...defaultCoupledParams, dampingNmsPerRad: damping, driveAmplitudeNm: drive };
  let state = { theta1: 20 * Math.PI / 180, theta2: 0, omega1: 0, omega2: 0 };
  const initial = oscillatorEnergy(state, params).totalEnergy;
  let previous = initial, maxIncrease = 0, driveWork = 0, frictionLoss = 0;
  const step = 1 / 240;
  for (let index = 0; index < duration * 240; index++) {
    const power = drive * Math.sin(params.driveFrequencyRadS * index * step) * state.omega1;
    driveWork += power * step;
    frictionLoss += damping * (state.omega1 ** 2 + state.omega2 ** 2) * step;
    state = rk4Step(state, params, index * step, step);
    const energy = oscillatorEnergy(state, params).totalEnergy;
    maxIncrease = Math.max(maxIncrease, energy - previous); previous = energy;
  }
  return { initial, final: previous, maxIncrease, balanceError: previous - initial - driveWork + frictionLoss };
}
const ideal = trial(0, 0), damped = trial(.06, 0), driven = trial(.06, .15);
assert.ok(Math.abs(ideal.final / ideal.initial - 1) < 1e-6, "Undamped energy conservation");
assert.ok(damped.maxIncrease < 1e-10, "Damped energy decreases monotonically");
assert.ok(damped.final / damped.initial < 1e-5, "Damped motion approaches rest");
assert.ok(driven.final > damped.final * 100, "External drive sustains energy");
assert.ok(Math.abs(driven.balanceError) < .005, "Energy change matches motor work minus friction loss");
console.log(JSON.stringify({ ideal, damped, driven }, null, 2));
console.log("PASS: conservative, damped, and driven 60-second trials; energy balance.");
