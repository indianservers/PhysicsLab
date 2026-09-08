/** Closed-energy teaching model: regenerative cart -> light source -> focused
 * absorption -> lumped thermal sample. No sustained external power source. */
export const MASTERY_DEFAULTS = {
  mass: .5, speed: 2.2, resistance: 15, focalLength: .1,
  sampleMassMg: 10, heatLeak: .4,
};
export type MasteryParameters = typeof MASTERY_DEFAULTS;
export type MasteryGraph = 'cart' | 'circuit' | 'lens' | 'temperature';
export const MASTERY_CONSTANTS = {
  generator: 4.8 / 2.2, // Back-emf coefficient, V s/m; same force coefficient in SI.
  friction: .08, // Viscous mechanical drag, N s/m.
  luminousEfficiency: .7, lensTransmission: .85, absorptivity: .85,
  apertureRadius: .01, sampleDistance: .1, sourceDivergence: .006,
  sampleRadius: .001, specificHeat: 900, ambient: 20,
};
export const MASTERY_CONTROLS: Record<keyof MasteryParameters, {label:string;min:number;max:number;step:number;unit:string;stage:number}> = {
  mass:{label:'Cart mass',min:.1,max:.75,step:.05,unit:'kg',stage:0},
  speed:{label:'Launch speed',min:0,max:3,step:.1,unit:'m/s',stage:0},
  resistance:{label:'Load resistance',min:5,max:30,step:1,unit:'Ω',stage:1},
  focalLength:{label:'Lens focal length',min:.05,max:.2,step:.005,unit:'m',stage:2},
  sampleMassMg:{label:'Sample mass',min:5,max:50,step:1,unit:'mg',stage:3},
  heatLeak:{label:'Thermal conductance',min:0,max:1,step:.05,unit:'mW/K',stage:3},
};
export function masteryCoefficients(p: MasteryParameters) {
  const c = MASTERY_CONSTANTS, electricDrag = c.generator ** 2 / p.resistance;
  const drag = electricDrag + c.friction, velocityRate = drag / p.mass, powerRate = 2 * velocityRate;
  const waist = Math.hypot(c.sourceDivergence * p.focalLength, c.apertureRadius * (c.sampleDistance - p.focalLength) / p.focalLength);
  const capture = -Math.expm1(-2 * (c.sampleRadius / waist) ** 2);
  const opticalEfficiency = c.luminousEfficiency * c.lensTransmission * c.absorptivity * capture;
  const heatCapacity = p.sampleMassMg * 1e-6 * c.specificHeat, heatConductance = p.heatLeak * .001;
  return { electricDrag, drag, velocityRate, powerRate, waist, capture, opticalEfficiency,
    heatCapacity, heatConductance, coolingRate: heatConductance / heatCapacity,
    initialEnergy: .5 * p.mass * p.speed ** 2,
    initialElectricalPower: electricDrag * p.speed ** 2,
    electricalFraction: electricDrag / drag,
  };
}
export function masteryState(p: MasteryParameters, seconds: number) {
  const t = Math.max(0, seconds), c = MASTERY_CONSTANTS, a = masteryCoefficients(p);
  const velocity = p.speed * Math.exp(-a.velocityRate * t), position = p.speed / a.velocityRate * -Math.expm1(-a.velocityRate * t);
  const voltage = c.generator * velocity, current = voltage / p.resistance, electricalPower = voltage * current;
  const absorbedPower = a.opticalEfficiency * electricalPower;
  const remainingEnergy = .5 * p.mass * velocity ** 2;
  const releasedEnergy = a.initialEnergy * -Math.expm1(-a.powerRate * t);
  const electricalEnergy = releasedEnergy * a.electricalFraction, mechanicalLoss = releasedEnergy - electricalEnergy;
  const absorbedEnergy = electricalEnergy * a.opticalEfficiency;
  const source = a.opticalEfficiency * a.initialElectricalPower / a.heatCapacity;
  const delta = a.coolingRate - a.powerRate;
  // Stable convolution of exponentially decaying power with Newton cooling.
  const rise = Math.abs(delta) < 1e-10
    ? source * t * Math.exp(-a.powerRate * t)
    : source * Math.exp(-Math.min(a.powerRate, a.coolingRate) * t) * -Math.expm1(-Math.abs(delta) * t) / Math.abs(delta);
  const storedHeat = a.heatCapacity * rise, heatLoss = Math.max(0, absorbedEnergy - storedHeat);
  return { t, ...a, velocity, position, voltage, current, electricalPower, absorbedPower,
    remainingEnergy, electricalEnergy, mechanicalLoss, absorbedEnergy, storedHeat, heatLoss,
    opticalLoss: electricalEnergy - absorbedEnergy, temperature: c.ambient + rise,
  };
}
/** Predicted maximum includes all future time; no arbitrary graph sampling. */
export function masteryPeak(p: MasteryParameters) {
  const a = masteryCoefficients(p);
  if (p.speed === 0) return { time:0, temperature:MASTERY_CONSTANTS.ambient };
  if (a.coolingRate === 0) return { time:Infinity, temperature:MASTERY_CONSTANTS.ambient + a.initialEnergy * a.electricalFraction * a.opticalEfficiency / a.heatCapacity };
  const delta = a.powerRate - a.coolingRate;
  const time = Math.abs(delta) < 1e-10 ? 1 / a.powerRate : Math.log(a.powerRate / a.coolingRate) / delta;
  return { time, temperature:masteryState(p,time).temperature };
}
/** Irradiance on the sample plane, W/m², with r in millimetres.
 * Gaussian profile before sample absorption; radial integral is transmitted light. */
export function masteryIrradiance(p: MasteryParameters, seconds: number, radiusMm: number) {
  const s = masteryState(p,seconds), c = MASTERY_CONSTANTS;
  const incidentPower = s.electricalPower * c.luminousEfficiency * c.lensTransmission;
  return 2 * incidentPower / (Math.PI * s.waist ** 2) * Math.exp(-2 * (radiusMm * .001 / s.waist) ** 2);
}
export function masteryPlot(p: MasteryParameters, graph: MasteryGraph, seconds: number) {
  const span = graph === 'lens' ? 6 : 12;
  return Array.from({length:241},(_,i)=>{
    const x = graph === 'lens' ? -3 + i / 240 * span : Math.max(0,seconds-span) + i / 240 * span;
    const s = graph === 'lens' ? null : masteryState(p,x);
    return {x,y:graph==='lens'?masteryIrradiance(p,seconds,x):graph==='cart'?s!.velocity:graph==='circuit'?s!.voltage:s!.temperature};
  });
}
