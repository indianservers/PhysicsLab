export type CoulombInput={q1:number;q2:number;r:number};
export const COULOMB_DEFAULTS={q1:5,q2:-5,r:.3};
export function coulombSettings(v:CoulombInput){return{q1:Math.max(-10,Math.min(10,Number(v.q1)||0)),q2:Math.max(-10,Math.min(10,Number(v.q2)||0)),r:Math.max(.05,Math.min(1,Number(v.r)||.05))}}
export function coulombSolution(v:CoulombInput){const f=8.99e9*v.q1*1e-6*v.q2*1e-6/(v.r*v.r);return{f,mag:Math.abs(f),fieldA:8.99e9*Math.abs(v.q2*1e-6)/(v.r*v.r),fieldB:8.99e9*Math.abs(v.q1*1e-6)/(v.r*v.r)}}
