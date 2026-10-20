export type KeplerInput={a:number;e:number;dt:number};export const KEPLER_DEFAULTS={a:1,e:.3,dt:5};
export function keplerSettings(v:KeplerInput){return{a:Math.max(.5,Math.min(3,Number(v.a)||.5)),e:Math.max(0,Math.min(.9,Number(v.e)||0)),dt:Math.max(.1,Math.min(50,Number(v.dt)||.1))};}
/** Solar-mass orbit evaluated at aphelion. Constant areal speed = pi*a*b/T. */
export function keplerSolution(raw:KeplerInput){const v=keplerSettings(raw),T=365.25*v.a**1.5,r=v.a*(1+v.e),speed=29.7847*Math.sqrt(2/r-1/v.a),area=Math.PI*(149597870.7*v.a)**2*Math.sqrt(1-v.e*v.e)*v.dt/T;return{T,r,speed,area};}
