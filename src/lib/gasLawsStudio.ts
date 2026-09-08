export type GasInput={load:number;n:number;T:number};export const GAS_DEFAULTS={load:5,n:.04,T:298};export function gasSettings(v:GasInput){return{load:Math.max(0,Math.min(20,Number(v.load)||0)),n:Math.max(.01,Math.min(.1,Number(v.n)||.01)),T:Math.max(200,Math.min(600,Number(v.T)||200))}}export function gasSolution(v:GasInput){const P=Math.max(1,102.3*v.load/5),V=v.n*8.42*v.T/P;return{P,V}}

