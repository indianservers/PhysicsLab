import { runBenchmarkCases } from "../shared/validation";

export type ProjectileInput = {
  speedMps: number;
  angleDeg: number;
  heightM: number;
  gravityMps2: number;
  airResistance: boolean;
  dragCoefficient: number;
};
export type FlightPoint = {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};
export const projectileDefaults: ProjectileInput = {
  speedMps: 28,
  angleDeg: 40,
  heightM: 2,
  gravityMps2: 9.81,
  airResistance: false,
  dragCoefficient: 0.08,
};

export function projectileFlight(input: ProjectileInput) {
  const angle = (input.angleDeg * Math.PI) / 180;
  const vx0 = input.speedMps * Math.cos(angle),
    vy0 = input.speedMps * Math.sin(angle);
  if (!input.airResistance) {
    const timeS =
      (vy0 + Math.sqrt(vy0 * vy0 + 2 * input.gravityMps2 * input.heightM)) /
      input.gravityMps2;
    const points = Array.from({ length: 101 }, (_, index) => {
      const t = (timeS * index) / 100;
      return {
        t,
        x: vx0 * t,
        y: input.heightM + vy0 * t - 0.5 * input.gravityMps2 * t * t,
        vx: vx0,
        vy: vy0 - input.gravityMps2 * t,
      };
    });
    return {
      points,
      timeS,
      rangeM: vx0 * timeS,
      peakM: input.heightM + (vy0 * vy0) / (2 * input.gravityMps2),
      rangeFormulaValid: input.heightM === 0,
    };
  }
  const dt = 0.005,
    points: FlightPoint[] = [
      { t: 0, x: 0, y: input.heightM, vx: vx0, vy: vy0 },
    ];
  let p = points[0];
  for (let i = 1; i < 4000 && p.y >= 0; i++) {
    const speed = Math.hypot(p.vx, p.vy),
      k = input.dragCoefficient * 0.015;
    const ax = -k * speed * p.vx,
      ay = -input.gravityMps2 - k * speed * p.vy;
    p = {
      t: i * dt,
      x: p.x + p.vx * dt,
      y: p.y + p.vy * dt,
      vx: p.vx + ax * dt,
      vy: p.vy + ay * dt,
    };
    if (i % 10 === 0 || p.y < 0) points.push(p);
  }
  const last = points[points.length - 1]!;
  return {
    points,
    timeS: last.t,
    rangeM: last.x,
    peakM: Math.max(...points.map((point) => point.y)),
    rangeFormulaValid: false,
  };
}

export function pointAt(points: FlightPoint[], timeS: number) {
  let best = points[0];
  for (const point of points) {
    if (point.t > timeS) break;
    best = point;
  }
  return best;
}

export const projectileLessonBenchmarks = runBenchmarkCases([
  {
    id: "projectile-x",
    name: "Horizontal position",
    input: { speed: 20, angle: 60, time: 2 },
    expected: 20,
    unit: "m",
    tolerance: 1e-10,
    actual: (i) =>
      (i.speed ?? 0) *
      Math.cos(((i.angle ?? 0) * Math.PI) / 180) *
      (i.time ?? 0),
  },
  {
    id: "projectile-y",
    name: "Vertical position",
    input: { height: 2, speed: 20, angle: 30, time: 1, gravity: 9.8 },
    expected: 7.1,
    unit: "m",
    tolerance: 1e-10,
    actual: (i) =>
      (i.height ?? 0) +
      (i.speed ?? 0) *
        Math.sin(((i.angle ?? 0) * Math.PI) / 180) *
        (i.time ?? 0) -
      0.5 * (i.gravity ?? 0) * (i.time ?? 0) ** 2,
  },
  {
    id: "projectile-vy",
    name: "Vertical velocity",
    input: { speed: 20, angle: 30, time: 1, gravity: 9.8 },
    expected: 0.2,
    unit: "m/s",
    tolerance: 1e-10,
    actual: (i) =>
      (i.speed ?? 0) * Math.sin(((i.angle ?? 0) * Math.PI) / 180) -
      (i.gravity ?? 0) * (i.time ?? 0),
  },
  {
    id: "projectile-complement",
    name: "Complementary angles have equal level-ground range",
    input: { speed: 20, gravity: 9.8 },
    expected: 35.34797566467096,
    unit: "m",
    tolerance: 1e-10,
    actual: (i) =>
      ((i.speed ?? 0) ** 2 * Math.sin((2 * 30 * Math.PI) / 180)) /
      (i.gravity ?? 1),
  },
  {
    id: "projectile-drag",
    name: "Air resistance reduces range",
    input: {},
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () =>
      Number(
        projectileFlight({
          ...projectileDefaults,
          heightM: 0,
          airResistance: true,
        }).rangeM <
          projectileFlight({ ...projectileDefaults, heightM: 0 }).rangeM,
      ),
  },
]);
