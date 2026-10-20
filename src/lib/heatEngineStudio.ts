export type EngineInput={hot:number;cold:number;ratio:number};export const ENGINE_DEFAULTS={hot:600,cold:300,ratio:8};
export function engineSettings(v:EngineInput){return{hot:Math.max(300,Math.min(1200,Number(v.hot)||300)),cold:Math.max(100,Math.min(600,Number(v.cold)||100)),ratio:Math.max(2,Math.min(20,Number(v.ratio)||2))};}
/** Reversible Carnot cycle, 1 mol ideal gas. ratio = hot-isotherm V2/V1, V1=1 L. */
export function engineSolution(raw:EngineInput){const v=engineSettings(raw),valid=v.hot>v.cold,R=8.31446261815324,eta=valid?1-v.cold/v.hot:0,qh=valid?R*v.hot*Math.log(v.ratio):0,qc=valid?R*v.cold*Math.log(v.ratio):0;return{eta,work:qh-qc,qh,qc,pressure:R*v.hot,volume:1,valid};}
