export interface PrismMaterial {
  id: string;
  name: string;
  meanIndex: number;
  dispersion: number;
}

export interface PrismColorRay {
  name: string;
  wavelength: number;
  color: string;
  refractiveIndex: number;
  deviationDeg: number;
  yOffset: number;
}

export interface PrismModel {
  prismAngleDeg: number;
  incidenceDeg: number;
  meanIndex: number;
  dispersion: number;
  material: PrismMaterial;
  refraction1Deg: number;
  refraction2Deg: number;
  emergenceDeg: number;
  meanDeviationDeg: number;
  minimumDeviationDeg: number;
  criticalAngleDeg: number;
  tirInside: boolean;
  spreadDeg: number;
  rays: PrismColorRay[];
}

export const prismMaterials: PrismMaterial[] = [
  { id: "water", name: "Water prism", meanIndex: 1.333, dispersion: 0.012 },
  { id: "crown", name: "Crown glass", meanIndex: 1.52, dispersion: 0.028 },
  { id: "flint", name: "Flint glass", meanIndex: 1.62, dispersion: 0.052 },
  { id: "diamond", name: "Diamond", meanIndex: 2.42, dispersion: 0.075 },
];

export const prismSpectrum = [
  { name: "Violet", wavelength: 410, color: "#7c3aed" },
  { name: "Indigo", wavelength: 445, color: "#4f46e5" },
  { name: "Blue", wavelength: 475, color: "#2563eb" },
  { name: "Green", wavelength: 530, color: "#22c55e" },
  { name: "Yellow", wavelength: 580, color: "#facc15" },
  { name: "Orange", wavelength: 610, color: "#fb923c" },
  { name: "Red", wavelength: 680, color: "#ef4444" },
];

export function nearestPrismMaterial(meanIndex: number, dispersion: number) {
  return prismMaterials.reduce((best, item) => {
    const bestScore = Math.abs(best.meanIndex - meanIndex) + Math.abs(best.dispersion - dispersion) * 8;
    const itemScore = Math.abs(item.meanIndex - meanIndex) + Math.abs(item.dispersion - dispersion) * 8;
    return itemScore < bestScore ? item : best;
  }, prismMaterials[0]);
}

export function makePrismModel(prismAngleDeg: number, meanIndex: number, dispersion: number, incidenceDeg = 50): PrismModel {
  const angle = clamp(prismAngleDeg, 20, 70);
  const n = clamp(meanIndex, 1.01, 2.6);
  const dispersivePower = clamp(dispersion, 0, 0.09);
  const incidence = clamp(incidenceDeg, 15, 80);
  const iRad = degToRad(incidence);
  const aRad = degToRad(angle);
  const r1 = Math.asin(clamp(Math.sin(iRad) / n, -1, 1));
  const r2 = Math.max(0, aRad - r1);
  const criticalAngle = Math.asin(clamp(1 / n, -1, 1));
  const emergenceSin = n * Math.sin(r2);
  const tirInside = emergenceSin > 1;
  const emergence = tirInside ? Number.NaN : Math.asin(clamp(emergenceSin, -1, 1));
  const meanDeviation = tirInside ? incidence + angle - radToDeg(r1) : incidence + radToDeg(emergence) - angle;
  const minimumDeviation = 2 * radToDeg(Math.asin(clamp(n * Math.sin(aRad / 2), -1, 1))) - angle;
  const rays = prismSpectrum.map((ray, index) => {
    const wavelengthOffset = (560 - ray.wavelength) / 150;
    const refractiveIndex = n + wavelengthOffset * dispersivePower * 0.16;
    const deviationDeg = (refractiveIndex - 1) * angle;
    return {
      ...ray,
      refractiveIndex,
      deviationDeg,
      yOffset: (index - 3) * (4 + dispersivePower * angle * 2.4),
    };
  });
  return {
    prismAngleDeg: angle,
    incidenceDeg: incidence,
    meanIndex: n,
    dispersion: dispersivePower,
    material: nearestPrismMaterial(n, dispersivePower),
    refraction1Deg: radToDeg(r1),
    refraction2Deg: radToDeg(r2),
    emergenceDeg: radToDeg(emergence),
    meanDeviationDeg: meanDeviation,
    minimumDeviationDeg: minimumDeviation,
    criticalAngleDeg: radToDeg(criticalAngle),
    tirInside,
    spreadDeg: Math.max(...rays.map((ray) => ray.deviationDeg)) - Math.min(...rays.map((ray) => ray.deviationDeg)),
    rays,
  };
}

function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

function radToDeg(value: number) {
  return (value * 180) / Math.PI;
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
