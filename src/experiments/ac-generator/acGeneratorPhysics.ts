export interface AcGeneratorInput {
  magneticField: number;
  coilArea: number;
  turns: number;
  angularSpeed: number;
  angleRad: number;
  polarity: 1 | -1;
  direction: 1 | -1;
  loadResistance: number;
}

export interface AcGeneratorResult {
  fluxLinkage: number;
  emf: number;
  peakEmf: number;
  rmsEmf: number;
  current: number;
  rmsCurrent: number;
  frequency: number;
  phase: "zero rising" | "positive" | "positive peak" | "zero falling" | "negative" | "negative peak";
}

export function sanitizeAcGeneratorInput(input: AcGeneratorInput): AcGeneratorInput {
  return {
    magneticField: clamp(input.magneticField, 0, 2),
    coilArea: clamp(input.coilArea, .005, .5),
    turns: Math.round(clamp(input.turns, 1, 500)),
    angularSpeed: clamp(input.angularSpeed, 0, 200),
    angleRad: normalizeAngle(input.angleRad),
    polarity: input.polarity === -1 ? -1 : 1,
    direction: input.direction === -1 ? -1 : 1,
    loadResistance: clamp(input.loadResistance, 1, 1000),
  };
}

export function computeAcGenerator(raw: AcGeneratorInput): AcGeneratorResult {
  const input = sanitizeAcGeneratorInput(raw);
  const amplitude = input.turns * input.magneticField * input.coilArea;
  const signedAngle = input.angleRad * input.direction;
  const peakEmf = amplitude * input.angularSpeed;
  const fluxLinkage = input.polarity * amplitude * Math.cos(signedAngle);
  const emf = input.polarity * input.direction * peakEmf * Math.sin(signedAngle);
  const current = emf / input.loadResistance;
  const sine = Math.sin(signedAngle) * input.polarity * input.direction;
  const cosine = Math.cos(signedAngle) * input.polarity;
  const phase = Math.abs(sine) < .035 ? (cosine >= 0 ? "zero rising" : "zero falling")
    : Math.abs(cosine) < .035 ? (sine > 0 ? "positive peak" : "negative peak")
    : sine > 0 ? "positive" : "negative";
  return { fluxLinkage, emf, peakEmf, rmsEmf: peakEmf / Math.SQRT2, current, rmsCurrent: peakEmf / Math.SQRT2 / input.loadResistance, frequency: input.angularSpeed / (2*Math.PI), phase };
}

export function generatorSeries(input: AcGeneratorInput, samples = 181) {
  return Array.from({ length:samples }, (_,index) => {
    const angle = index / (samples-1) * Math.PI * 2;
    const result = computeAcGenerator({ ...input, angleRad:angle });
    return { angle, flux:result.fluxLinkage, emf:result.emf };
  });
}

export const normalizeAngle = (angle:number) => ((angle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
const clamp = (value:number,min:number,max:number) => Number.isFinite(value) ? Math.max(min,Math.min(max,value)) : min;
