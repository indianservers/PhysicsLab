export type ConservationInput={height:number;drag:number;position:number};
export const CONSERVATION_DEFAULTS={height:32,drag:.02,position:0};
export const CONSERVATION_MASS=120,CONSERVATION_G=9.81,CONSERVATION_LENGTH=250;
export function conservationSettings(v:ConservationInput){return{height:Math.max(5,Math.min(50,Number(v.height)||5)),drag:Math.max(0,Math.min(.1,Number(v.drag)||0)),position:Math.max(0,Math.min(250,Number(v.position)||0))};}
/** Prescribed downhill height profile; drag is the fraction of released energy dissipated. Released from rest. */
export function conservationSolution(raw:ConservationInput){const v=conservationSettings(raw),fraction=v.position/CONSERVATION_LENGTH,total=CONSERVATION_MASS*CONSERVATION_G*v.height,pe=total*(1-fraction),released=total-pe,loss=released*v.drag,ke=released-loss;return{total,pe,ke,loss,speed:Math.sqrt(2*ke/CONSERVATION_MASS),height:v.height*(1-fraction)};}
