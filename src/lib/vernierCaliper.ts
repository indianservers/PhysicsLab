export interface VernierInput { jaw: number; diameter: number; zeroError: number; objectPresent: boolean }
export const VERNIER_LC = .02;
export const VERNIER_DEFAULTS: VernierInput = { jaw: 27.12, diameter: 27.12, zeroError: 0, objectPresent: true };
const snap = (value: number) => Math.round(value / VERNIER_LC) * VERNIER_LC;
export function vernierState(input: VernierInput) {
  const diameter = snap(Math.max(5, Math.min(40, input.diameter)));
  const zeroError = snap(Math.max(-.2, Math.min(.2, input.zeroError)));
  const jaw = snap(Math.max(input.objectPresent ? diameter : 0, Math.min(50, input.jaw)));
  const rawSteps = Math.round((jaw + zeroError) / VERNIER_LC);
  const main = Math.floor(rawSteps / 50), coincidence = ((rawSteps % 50) + 50) % 50;
  const raw = main + coincidence * VERNIER_LC;
  const corrected = raw - zeroError;
  const contact = input.objectPresent && Math.abs(jaw - diameter) < 1e-8;
  return { diameter, zeroError, jaw, raw, main, coincidence, corrected, contact, gap: jaw - diameter,
    vernierSpacing: .98, divisions: 50, leastCount: VERNIER_LC, closed: jaw === 0 };
}
export const VERNIER_CHALLENGES = [
  { title: 'Read the diameter', diameter: 27.12, zeroError: 0 },
  { title: 'Correct positive zero error', diameter: 18.46, zeroError: .12 },
  { title: 'Correct negative zero error', diameter: 32.78, zeroError: -.08 },
];
