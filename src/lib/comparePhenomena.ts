export type Phenomenon = 'pendulum' | 'orbit' | 'wave' | 'lc';
export type SharedQuantity = 'period' | 'frequency' | 'angular';
export const PHENOMENA: Array<{ id: Phenomenon; label: string; short: string; color: string; formula: string }> = [
  { id: 'pendulum', label: 'Pendulum', short: 'Pendulum', color: '#25b5ff', formula: 'T = 2π √(ℓ/g)' },
  { id: 'orbit', label: 'Orbit (circular)', short: 'Orbit', color: '#b677ff', formula: 'T = 2π √(r³/μ)' },
  { id: 'wave', label: 'Wave (string)', short: 'Wave', color: '#24e0ed', formula: 'T = 1/f = λ/v' },
  { id: 'lc', label: 'AC circuit (LC)', short: 'AC Circuit', color: '#b497ff', formula: 'T = 2π √(LC)' },
];
export const COMPARE_DEFAULTS = { length: 1, angle: .2, radius: 384.4, frequency: 2, speed: 2, amplitude: .8, inductance: 1, capacitance: 10, voltage: 5 };
export type CompareParameters = typeof COMPARE_DEFAULTS;
export type CompareCard = { kind: Phenomenon; p: CompareParameters };
export const makeCompareCards = (): CompareCard[] => PHENOMENA.map(({ id }) => ({ kind: id, p: { ...COMPARE_DEFAULTS } }));
// JPL DE440 Earth + Moon GM, km³/s² converted to m³/s². Relative circular orbit.
// https://ssd.jpl.nasa.gov/astro_par.html
export const EARTH_MOON_MU = (398600.435507 + 4902.800118) * 1e9;
export const DAY = 86400;
export const COMPARE_CONTROLS: Record<keyof CompareParameters, { label: string; min: number; max: number; step: number; unit: string }> = {
  length: { label: 'Pendulum length', min: .25, max: 2, step: .05, unit: 'm' },
  angle: { label: 'Angular amplitude', min: 0, max: .2, step: .01, unit: 'rad' },
  radius: { label: 'Orbital separation', min: 200, max: 600, step: 1, unit: 'Mm' },
  frequency: { label: 'Driving frequency', min: .25, max: 5, step: .25, unit: 'Hz' },
  speed: { label: 'String wave speed', min: .5, max: 5, step: .25, unit: 'm/s' },
  amplitude: { label: 'Wave amplitude', min: 0, max: 1, step: .05, unit: 'm' },
  inductance: { label: 'Inductance', min: .1, max: 5, step: .1, unit: 'H' },
  capacitance: { label: 'Capacitance', min: 1, max: 50, step: 1, unit: 'mF' },
  voltage: { label: 'Initial voltage', min: -10, max: 10, step: .5, unit: 'V' },
};
export const COMPARE_KEYS: Record<Phenomenon, Array<keyof CompareParameters>> = {
  pendulum: ['length', 'angle'], orbit: ['radius'], wave: ['frequency', 'speed', 'amplitude'], lc: ['inductance', 'capacitance', 'voltage'],
};
export function compareModel(kind: Phenomenon, p: CompareParameters) {
  const period = kind === 'pendulum' ? 2 * Math.PI * Math.sqrt(p.length / 9.81)
    : kind === 'orbit' ? 2 * Math.PI * Math.sqrt((p.radius * 1e6) ** 3 / EARTH_MOON_MU)
      : kind === 'wave' ? 1 / p.frequency : 2 * Math.PI * Math.sqrt(p.inductance * p.capacitance / 1000);
  const amplitude = kind === 'pendulum' ? p.length * p.angle : kind === 'orbit' ? p.radius : kind === 'wave' ? p.amplitude : p.voltage;
  return { period, frequency: 1 / period, angular: 2 * Math.PI / period, amplitude, wavelength: p.speed / p.frequency,
    timeUnit: kind === 'orbit' ? 'd' : 's', timeScale: kind === 'orbit' ? DAY : 1,
    playback: kind === 'orbit' ? 4 * DAY : 1,
    axis: kind === 'pendulum' ? 'Arc displacement (m)' : kind === 'orbit' ? 'Position (Mm)' : kind === 'wave' ? 'Displacement (m)' : 'Voltage (V)',
  };
}
export function compareValue(kind: Phenomenon, p: CompareParameters, physicalSeconds: number) {
  const m = compareModel(kind, p);
  return m.amplitude * Math.cos(m.angular * physicalSeconds);
}
export function compareWave(p: CompareParameters, x: number, seconds: number) {
  return p.amplitude * Math.cos(2 * Math.PI * (p.frequency * seconds - x * p.frequency / p.speed));
}
export function compareDisplay(kind: Phenomenon, p: CompareParameters, q: SharedQuantity) {
  const m = compareModel(kind, p);
  if (q === 'period') return kind === 'orbit' ? `${(m.period / DAY).toFixed(1)} d` : `${m.period < 1 ? m.period.toFixed(3) : m.period.toFixed(2)} s`;
  if (q === 'frequency') return kind === 'orbit' ? `${(m.frequency * DAY).toFixed(4)} d⁻¹` : `${m.frequency < 1 ? m.frequency.toFixed(3) : m.frequency.toFixed(2)} Hz`;
  return kind === 'orbit' ? `${(m.angular * DAY).toFixed(3)} rad/d` : `${m.angular.toFixed(2)} rad/s`;
}
export const COMPARE_EXPLANATIONS: Record<Phenomenon, string> = {
  pendulum: 'An ideal small-angle pendulum exchanges gravitational and kinetic energy. The plotted arc displacement is ℓθ. This linear model is limited to 0.20 rad; its period differs from the nonlinear pendulum by at most about 0.25%. No friction is included.',
  orbit: 'The Earth–Moon separation vector turns uniformly in an ideal circular two-body orbit. Its x projection is sinusoidal. μ includes both bodies. Earth is the coordinate origin; sizes are illustrative. Playback advances four orbital days per real second at 1×.',
  wave: 'A travelling sinusoidal wave moves along an ideal uniform string. The graph follows the marked point x = 0. Changing driving frequency at fixed wave speed changes wavelength through λ = v/f. Changing the wave speed represents changing the string or its tension.',
  lc: 'An ideal charged capacitor and inductor exchange electric and magnetic energy with no resistance or source. V is upper-plate voltage relative to the lower plate, Q = CV is upper-plate charge, and counterclockwise I = −dQ/dt. V = V₀ cos(ωt). Zero initial voltage produces no oscillation; a negative voltage reverses the initial phase.',
};
export const COMPARE_QUESTIONS = [
  { prompt: 'Double a system’s frequency. What happens to its period?', answers: ['It halves', 'It doubles', 'It stays the same'], correct: 0, reason: 'T = 1/f. Frequency and period are reciprocal, provided they use matching time units.' },
  { prompt: 'Make the pendulum four times as long, keeping g fixed. Its period…', answers: ['Doubles', 'Quadruples', 'Halves'], correct: 0, reason: 'T is proportional to √ℓ. √4 = 2 in the small-angle model.' },
  { prompt: 'At fixed string wave speed, double the driving frequency. The wavelength…', answers: ['Doubles', 'Halves', 'Stays the same'], correct: 1, reason: 'λ = v/f, so doubling f at fixed v halves λ.' },
  { prompt: 'Double both L and C in an ideal LC circuit. Its period…', answers: ['Stays the same', 'Halves', 'Doubles'], correct: 2, reason: 'T = 2π√(LC). Multiplying LC by four doubles T.' },
  { prompt: 'Double the radius of a circular orbit with the same two bodies. The period increases by…', answers: ['2', '2√2 ≈ 2.83', '4'], correct: 1, reason: 'T is proportional to r³ᐟ², so a factor of two in radius gives 2³ᐟ².' },
];
