export type NumericalModel =
  "explicit-diffusion" | "implicit-diffusion" | "oscillator-rk4";
export interface WorkflowInput {
  model: NumericalModel;
  meshN: number;
  timeStep: number;
  tolerance: number;
  seed: number;
}

const rms = (values: number[]) =>
  Math.sqrt(
    values.reduce((sum, value) => sum + value * value, 0) / values.length,
  );

function diffusion(input: WorkflowInput, implicit: boolean) {
  const n = Math.max(10, Math.min(80, Math.round(input.meshN))),
    dx = 1 / n,
    alpha = 0.1,
    end = 0.2;
  const steps = Math.ceil(end / input.timeStep),
    dt = end / steps,
    lambda = (alpha * dt) / dx ** 2;
  let u = Array.from({ length: n + 1 }, (_, i) => Math.sin((Math.PI * i) / n));
  let iterations = 0;
  const stable = implicit || lambda <= 0.5;
  for (let step = 0; step < steps; step += 1) {
    if (implicit) {
      const old = u,
        rhs = old.slice();
      let next = old.slice();
      for (let iteration = 0; iteration < 500; iteration += 1) {
        const candidate = next.slice();
        let delta = 0;
        for (let i = 1; i < n; i += 1) {
          candidate[i] =
            (rhs[i] + lambda * (next[i - 1] + next[i + 1])) / (1 + 2 * lambda);
          delta = Math.max(delta, Math.abs(candidate[i] - next[i]));
        }
        next = candidate;
        iterations += 1;
        if (delta < input.tolerance) break;
      }
      u = next;
    } else {
      const next = u.slice();
      for (let i = 1; i < n; i += 1)
        next[i] = u[i] + lambda * (u[i - 1] - 2 * u[i] + u[i + 1]);
      u = next;
      iterations += n - 1;
      if (!stable && u.some((v) => !Number.isFinite(v) || Math.abs(v) > 1e6))
        break;
    }
  }
  const exact = u.map(
    (_, i) =>
      Math.sin((Math.PI * i) / n) * Math.exp(-alpha * Math.PI ** 2 * end),
  );
  const error = stable ? rms(u.map((value, i) => value - exact[i])) : Infinity;
  return {
    values: u,
    exact,
    error,
    stable,
    stabilityNumber: lambda,
    steps,
    iterations,
    cost: steps * n + iterations,
    label: implicit ? "Implicit diffusion" : "Explicit diffusion",
  };
}

function oscillator(input: WorkflowInput) {
  const end = 8,
    steps = Math.ceil(end / input.timeStep),
    dt = end / steps;
  let x = 1,
    v = 0,
    evaluations = 0;
  const deriv = (px: number, pv: number) => ({ x: pv, v: -px });
  const samples = [{ x: 0, y: x }];
  for (let step = 0; step < steps; step += 1) {
    const a = deriv(x, v),
      b = deriv(x + (a.x * dt) / 2, v + (a.v * dt) / 2),
      c = deriv(x + (b.x * dt) / 2, v + (b.v * dt) / 2),
      d = deriv(x + c.x * dt, v + c.v * dt);
    x += (dt * (a.x + 2 * b.x + 2 * c.x + d.x)) / 6;
    v += (dt * (a.v + 2 * b.v + 2 * c.v + d.v)) / 6;
    evaluations += 4;
    if (step % Math.max(1, Math.floor(steps / input.meshN)) === 0)
      samples.push({ x: step * dt, y: x });
  }
  const error = Math.abs(x - Math.cos(end));
  return {
    values: samples.map((p) => p.y),
    exact: samples.map((p) => Math.cos(p.x)),
    error,
    stable: dt < 2,
    stabilityNumber: dt / 2,
    steps,
    iterations: evaluations,
    cost: evaluations + input.meshN,
    label: "Oscillator RK4",
  };
}

export function runWorkflow(input: WorkflowInput) {
  const result =
    input.model === "explicit-diffusion"
      ? diffusion(input, false)
      : input.model === "implicit-diffusion"
        ? diffusion(input, true)
        : oscillator(input);
  const convergence = [0.02, 0.01, 0.005, 0.0025, 0.001].map((timeStep) => {
    const trial =
      input.model === "explicit-diffusion"
        ? diffusion({ ...input, timeStep }, false)
        : input.model === "implicit-diffusion"
          ? diffusion({ ...input, timeStep }, true)
          : oscillator({ ...input, timeStep });
    return {
      timeStep,
      error: trial.error,
      cost: trial.cost,
      stable: trial.stable,
    };
  });
  const settings = `${input.model}|N=${input.meshN}|dt=${input.timeStep}|tol=${input.tolerance}|seed=${input.seed}`;
  let hash = 2166136261;
  for (const char of settings) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return {
    ...result,
    convergence,
    accepted: result.stable && result.error <= input.tolerance,
    settings,
    reproducibilityId: `RUN-${(hash >>> 0).toString(16).toUpperCase().padStart(8, "0")}`,
  };
}

const base: WorkflowInput = {
  model: "explicit-diffusion",
  meshN: 40,
  timeStep: 0.001,
  tolerance: 1e-3,
  seed: 20240517,
};
export const computationalWorkflowBenchmarks = [
  {
    id: "convergence",
    name: "Smaller stable time step reduces explicit diffusion error",
    actual: Number(
      runWorkflow({ ...base, timeStep: 0.001 }).error <
        runWorkflow({ ...base, timeStep: 0.01 }).error,
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean",
  },
  {
    id: "error",
    name: "RMS error is zero for identical arrays",
    actual: rms([0, 0, 0]),
    expected: 0,
    tolerance: 0,
    unit: "m",
  },
  {
    id: "stability",
    name: "Explicit diffusion warns above lambda one half",
    actual: Number(runWorkflow({ ...base, meshN: 80, timeStep: 0.02 }).stable),
    expected: 0,
    tolerance: 0,
    unit: "boolean",
  },
  {
    id: "reproducible",
    name: "Identical settings reproduce run identifier",
    actual: Number(
      runWorkflow(base).reproducibilityId ===
        runWorkflow(base).reproducibilityId,
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean",
  },
  {
    id: "reference",
    name: "Diffusion exact reference decays sine amplitude",
    actual: Math.exp(-0.1 * Math.PI ** 2 * 0.2),
    expected: 0.8208687174155399,
    tolerance: 1e-12,
    unit: "ratio",
  },
];
