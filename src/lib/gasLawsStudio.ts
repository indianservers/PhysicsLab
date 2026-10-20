export type GasInput={load:number;n:number;T:number};export const GAS_DEFAULTS={load:5,n:.04,T:298};
export const GAS_R=8.31446261815324,GAS_PISTON_AREA=.05,GAS_ATMOSPHERE_KPA=101.325;
export function gasSettings(v:GasInput){return{load:Math.max(0,Math.min(20,Number(v.load)||0)),n:Math.max(.01,Math.min(.1,Number(v.n)||.01)),T:Math.max(200,Math.min(600,Number(v.T)||200))};}
/** Massless frictionless piston, external air plus load; kPa*L = J. */
export function gasSolution(raw:GasInput){const v=gasSettings(raw),P=GAS_ATMOSPHERE_KPA+v.load*9.81/GAS_PISTON_AREA/1000,V=v.n*GAS_R*v.T/P;return{P,V};}
