import {COULOMB_K} from './coulombStudio';
import {electricFieldAt,electricFieldPotential,type FieldSource,type FieldPoint} from './electricFieldStudio';
export type PotentialInput={z:number;layout:number;px?:number;py?:number;reference?:number};
export const POTENTIAL_DEFAULTS:PotentialInput={z:.5,layout:0,px:0,py:0,reference:0};
const bounded=(v:number|undefined,a:number,b:number,f:number)=>v!==undefined&&Number.isFinite(v)?Math.max(a,Math.min(b,v)):f;
export function potentialSettings(v:PotentialInput){return{z:bounded(v.z,0,2,.5),layout:Math.round(bounded(v.layout,0,2,0)),px:bounded(v.px,-2,2,0),py:bounded(v.py,-2,2,0),reference:Math.round(bounded(v.reference,0,1,0))}}
export const POTENTIAL_LAYOUT_NAMES=['Two Positive, One Negative','Electric Dipole','Three Positive Charges'];
export function potentialSources(layout:number):FieldSource[]{const charges=layout===1?[[5,-1,0],[-5,1,0]]:layout===2?[[5,-1,0],[5,0,-1],[3,1.2,.8]]:[[5,-1,0],[-5,0,-1],[3,1.2,.8]];return charges.map(([q,x,y],id)=>({q:q*1e-6,point:{x,y,z:0},id}))}
/** The optional reference is the physical point (0,0,3 m), outside all source singularities. */
export function potentialOffset(sources:FieldSource[],reference:number){return reference===1?electricFieldPotential(sources,{x:0,y:0,z:3})!:0}
export function potentialAt(sources:FieldSource[],p:FieldPoint,offset=0){const v=electricFieldPotential(sources,p);return v===null?null:v-offset}
export function potentialSolution(v:PotentialInput){const input=potentialSettings(v),sources=potentialSources(input.layout),offset=potentialOffset(sources,input.reference),probe={x:input.px,y:input.py,z:input.z},V=potentialAt(sources,probe,offset),field=electricFieldAt(sources,probe);return{input,sources,offset,probe,V,energy:V===null?null:V*1e-6,gradient:field?.mag??null,field,testCharge:1e-6,k:COULOMB_K}}
export type PotentialSolution=ReturnType<typeof potentialSolution>;
export const POTENTIAL_DISPLAY_LIMIT=100000;
/** Height is a clipped plot ordinate, never used by the SI model. */
export function potentialPlotHeight(v:number|null){return v===null?null:Math.max(-1.5,Math.min(1.5,v/POTENTIAL_DISPLAY_LIMIT*1.5))}
export function potentialColor(v:number){const t=Math.max(-1,Math.min(1,v/POTENTIAL_DISPLAY_LIMIT)),stops=[{t:-1,c:[.36,.04,.92]},{t:-.5,c:[.03,.24,.96]},{t:0,c:[0,.38,.58]},{t:.3,c:[0,.65,.72]},{t:.6,c:[1,.85,.12]},{t:1,c:[1,.12,.12]}];const index=Math.min(stops.length-2,Math.max(0,stops.findIndex((s,i)=>i<stops.length-1&&t>=s.t&&t<=stops[i+1].t))),a=stops[index],b=stops[index+1],f=(t-a.t)/(b.t-a.t);return a.c.map((c,i)=>c+(b.c[i]-c)*f)}
export function potentialContourColor(v:number){return v>0?[1,.2,.18]:v<0?[.24,.2,1]:[.03,.65,.85]}
/** Marching triangles avoids ambiguous saddle cells. Segments interpolate the same sampled potential as the mesh. */
export function potentialGrid(s:PotentialSolution,n=80){const values:(number|null)[]=[],positions:number[]=[],colors:number[]=[],indices:number[]=[],wire:number[]=[],contours:number[]=[],contourColors:number[]=[],levels=Array.from({length:39},(_,i)=>(i-19)*5000);for(let j=0;j<=n;j++)for(let i=0;i<=n;i++){const x=-2+4*i/n,y=-2+4*j/n,v=potentialAt(s.sources,{x,y,z:s.input.z},s.offset),h=potentialPlotHeight(v);values.push(v);positions.push(x,h??0,-y);colors.push(...potentialColor(v??0))}const point=(i:number)=>positions.slice(i*3,i*3+3);const edge=(a:number,b:number)=>{if(values[a]===null||values[b]===null)return;wire.push(...point(a),...point(b))};for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+1,c=a+n+1,d=c+1;for(const tri of[[a,c,b],[b,c,d]]){if(tri.some(k=>values[k]===null))continue;indices.push(...tri);for(const level of levels){const cross:number[][]=[];for(let e=0;e<3;e++){const u=tri[e],v=tri[(e+1)%3],vu=values[u]!,vv=values[v]!;if((vu<=level&&vv>level)||(vv<=level&&vu>level)){const t=(level-vu)/(vv-vu),p=point(u),q=point(v);cross.push([p[0]+t*(q[0]-p[0]),-2,p[2]+t*(q[2]-p[2])])}}if(cross.length===2){contours.push(...cross[0],...cross[1]);const color=potentialContourColor(level);contourColors.push(...color,...color)}}}if(j%2===0&&values[a]!==null&&values[b]!==null)edge(a,b);if(i%2===0&&values[a]!==null&&values[c]!==null)edge(a,c)}return{positions,colors,indices,wire,contours,contourColors,n,values}}

/** Reflected probe scan: phase is path distance from x=-2 m; the return leg preserves direction across pause. */
export function potentialScanPosition(phase:number){const p=((phase%8)+8)%8;return p<=4?-2+p:6-p}
