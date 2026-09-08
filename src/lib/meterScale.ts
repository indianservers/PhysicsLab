export interface MeterScaleInput {
  position: number;
  length: number;
  angle: number;
  division: number;
  bothEnds: boolean;
}
export const METER_DEFAULTS: MeterScaleInput = { position: 12, length: 4, angle: 0, division: .1, bothEnds: false };
export const METER_EDGE_HEIGHT = 1; // cm above the graduation plane
export const METER_MISSIONS = [
  { title: 'Read a length', position: 12, length: 4, angle: 0, prompt: 'Read both endpoints and enter the measured length.' },
  { title: 'Remove parallax', position: 11.3, length: 4.3, angle: 25, prompt: 'Set the eye perpendicular to the rule, then report the length.' },
  { title: 'Read between divisions', position: 13.15, length: 3.35, angle: 0, prompt: 'Select 0.5 mm divisions to resolve both endpoints, then report the length.' },
];
export function meterScaleState(input: MeterScaleInput) {
  const length = Math.max(.5, Math.min(10, input.length));
  const position = Math.max(0, Math.min(100 - length, input.position));
  const angle = Math.max(-30, Math.min(30, input.angle));
  const division = [.05, .1, .2, .5, 1].includes(input.division) ? input.division : .1;
  // Positive angle: observer to the left, apparent endpoint displaced right.
  const shift = METER_EDGE_HEIGHT * Math.tan(angle * Math.PI / 180);
  const apparentLeft = position + (input.bothEnds ? shift : 0);
  const apparentRight = position + length + shift;
  const quantize = (value: number) => Math.round((value + 1e-10) / division) * division;
  const left = quantize(apparentLeft), right = quantize(apparentRight);
  const onScale = apparentLeft >= 0 && apparentRight <= 100;
  const measured = right - left;
  return { position, length, angle, division, shift, apparentLeft, apparentRight, left, right, measured, error: measured - length,
    geometricLengthError: input.bothEnds ? 0 : shift, onScale, decimals: division === .05 ? 2 : division >= 1 ? 0 : 1,
    roundingBound: division, windowStart: Math.max(0, Math.min(88.5, position >= 9 && position + length <= 20.5 ? 9 : position + length / 2 - 5.75)) };
}
