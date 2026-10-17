export type WireInput={current:number;radius:number;direction:number};
export const WIRE_DEFAULTS:WireInput={current:3,radius:5,direction:1};
export const WIRE_MU0=4*Math.PI*1e-7,WIRE_CORE=.0032,WIRE_SCAN_RATE=.3;
export function wireSettings(v:WireInput):WireInput{return{current:Number.isFinite(v.current)?Math.max(0,Math.min(10,v.current)):3,radius:Number.isFinite(v.radius)?Math.max(1,Math.min(20,v.radius)):5,direction:v.direction<0?-1:1}}
export function wireFieldAt(input:WireInput,x:number,y:number){const v=wireSettings(input),r=Math.hypot(x,y);if(r<WIRE_CORE)return null;const factor=2e-7*v.current*v.direction/(r*r),bx=-factor*y,by=factor*x,B=Math.hypot(bx,by);return{bx,by,bz:0,B,r,angle:B>0?Math.atan2(by,bx):null}}
export function wireSolution(input:WireInput,angle=0){const v=wireSettings(input),r=v.radius/100,x=r*Math.cos(angle),y=r*Math.sin(angle),field=wireFieldAt(v,x,y)!;return{...v,...field,x,y,probeAngle:angle,signedCurrent:v.current*v.direction,circulation:WIRE_MU0*v.current*v.direction}}
export function wireCircle(radius:number,n=129){return Array.from({length:n},(_,i)=>{const a=i/(n-1)*2*Math.PI;return{x:radius*Math.cos(a),y:radius*Math.sin(a)}})}
