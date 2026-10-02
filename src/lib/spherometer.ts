export type SphericalSurface = 'convex' | 'concave';
export interface SpherometerInput { height: number; legRadius: number; surface: SphericalSurface }
export const SPHEROMETER_DEFAULTS: SpherometerInput = { height: .42, legRadius: 30, surface: 'convex' };
export const SPHEROMETER_UNCERTAINTY = { height: .005, legRadius: .02 }; // independent standard uncertainties, mm
export function spherometerState(input: SpherometerInput) {
  const h = Math.max(0, Math.min(2, input.height)), r = Math.max(10, Math.min(100, input.legRadius));
  const sign = input.surface === 'concave' ? -1 : 1;
  const curvature = sign * 2 * h / (r*r+h*h);
  const radius = h === 0 ? Infinity : (r*r+h*h)/(2*h);
  const radiusUncertainty = h === 0 ? Infinity : Math.hypot(r/h*SPHEROMETER_UNCERTAINTY.legRadius, (.5-r*r/(2*h*h))*SPHEROMETER_UNCERTAINTY.height);
  const curvatureUncertainty = Math.hypot(-4*h*r/(r*r+h*h)**2*SPHEROMETER_UNCERTAINTY.legRadius, 2*(r*r-h*h)/(r*r+h*h)**2*SPHEROMETER_UNCERTAINTY.height);
  return { h, r, sign, curvature, radius, radiusUncertainty, curvatureUncertainty, flat: h === 0, signedHeight: sign*h,
    legSeparation: Math.sqrt(3)*r };
}
/** Height above the plane through the three feet. rho must lie within the support circle. */
export function spherometerProfile(input: SpherometerInput, rho: number) {
  const s=spherometerState(input);if(s.flat)return 0;
  const x=Math.max(0,Math.min(s.r,Math.abs(rho)));
  // Rationalized spherical sag avoids cancellation for a nearly flat surface.
  const drop=x*x/(s.radius+Math.sqrt(Math.max(0,s.radius*s.radius-x*x)));
  return s.sign*(s.h-drop);
}
export const SPHEROMETER_CHALLENGES = [
  { title:'Read a convex surface', height:.42,legRadius:30,surface:'convex' as const },
  { title:'Measure a concave surface',height:1.2,legRadius:25,surface:'concave' as const },
  { title:'Recognize a flat surface',height:0,legRadius:30,surface:'convex' as const },
];
