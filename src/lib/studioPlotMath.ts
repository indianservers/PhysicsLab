import type {PlotPoint} from './studioPlot';
export const plotValue=(n:number|null)=>n===null?'undefined':Number(n.toPrecision(6)).toString();
export function plotDomain(values:number[],log=false):[number,number] {
  const finite=values.filter(v=>Number.isFinite(v)&&(!log||v>0)).map(v=>log?Math.log10(v):v);
  if(!finite.length)return [0,1];
  let lo=Math.min(...finite),hi=Math.max(...finite);
  const pad=lo===hi?(log?.1:(Math.abs(lo)*.05||1)):(hi-lo)*.06;
  lo-=pad;hi+=pad;return [lo,hi];
}
export function plotPath(points:PlotPoint[],x:(n:number)=>number,y:(n:number)=>number,valid:(p:PlotPoint)=>boolean):string {
  let connected=false,branch:string|undefined;
  return [...points].sort((a,b)=>a.x-b.x||a.id-b.id).map(p=>{
    if(!valid(p)){connected=false;return '';}
    const command=connected&&branch===p.branch?'L':'M';connected=true;branch=p.branch;return `${command}${x(p.x).toFixed(3)},${y(p.y!).toFixed(3)}`;
  }).join(' ');
}
