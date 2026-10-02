export interface MicrometerInput { turns: number; wire: number; correction: number; wirePresent: boolean }
export const MICROMETER_PITCH = .5; // mm per revolution
export const MICROMETER_DIVISIONS = 50;
export const MICROMETER_LC = MICROMETER_PITCH / MICROMETER_DIVISIONS;
export const MICROMETER_DEFAULTS: MicrometerInput = { turns: 1.64, wire: .3, correction: 0, wirePresent: true };
export const MICROMETER_WIRES = [.1, .2, .3, .5, 1];
export function micrometerState(input: MicrometerInput) {
  const wire = MICROMETER_WIRES.includes(input.wire) ? input.wire : .3;
  const correction = Math.round(Math.max(-.05, Math.min(.05, input.correction)) / MICROMETER_LC) * MICROMETER_LC;
  const openingSteps = Math.round(Math.max(input.wirePresent ? wire : 0, Math.min(2, input.turns * MICROMETER_PITCH)) / MICROMETER_LC);
  const opening = openingSteps * MICROMETER_LC, turns = opening / MICROMETER_PITCH;
  const rawSteps = openingSteps - Math.round(correction / MICROMETER_LC);
  const halfMillimeters = Math.floor(rawSteps / MICROMETER_DIVISIONS);
  const sleeve = halfMillimeters * MICROMETER_PITCH;
  const divisions = ((rawSteps % MICROMETER_DIVISIONS) + MICROMETER_DIVISIONS) % MICROMETER_DIVISIONS;
  const thimble = divisions * MICROMETER_LC, raw = sleeve + thimble;
  const corrected = raw + correction, contact = input.wirePresent && Math.abs(opening - wire) < 1e-8;
  return { wire, correction, opening, turns, sleeve, divisions, thimble, raw, corrected, contact,
    gap: input.wirePresent ? opening - wire : opening, closed: openingSteps === 0,
    rotationDegrees: divisions / MICROMETER_DIVISIONS * 360 };
}
export const MICROMETER_CHALLENGES = [
  { title: 'Measure the thin wire', wire: .3, correction: 0 },
  { title: 'Apply a negative correction', wire: .5, correction: -.03 },
  { title: 'Apply a positive correction', wire: .2, correction: .02 },
];
