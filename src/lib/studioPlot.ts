import definitions from './studioVisualDefinitions.json';
import type { VisualFrame, VisualState } from './studioVisualModel';
import { visualNumber } from './studioVisualModel';

export type VisualDefinition={title:string;parameter:string;source:string;xLabel:string;xUnit:string;quantity:string;yLabel:string;yUnit:string;discrete:boolean;solverVersion:string;bounds?:{min:number;max:number;values?:number[]}};
export const visualDefinitions:Record<string,VisualDefinition>=definitions;
export type PlotPoint={id:number;x:number;y:number|null;input:VisualState;scene:VisualState;branch?:string};
export {plotValue,plotDomain,plotPath} from './studioPlotMath';
export function pointFromFrame(frame:VisualFrame,definition:VisualDefinition,id:number):PlotPoint|null {
  const x=visualNumber((definition.source==='scene'?frame.scene:frame.input)[definition.parameter]);
  if(x===null)return null;
  const flags=Object.entries(frame.quantities).filter(([key])=>/\.(real|atInfinity|singular|valid|bound)$/.test(key));
  return {id,x,y:frame.quantities[definition.quantity]??null,input:frame.input,scene:frame.scene,branch:JSON.stringify([frame.states,flags])};
}
/** Locate authored bounds, never reinterpret a logarithmic slider as a physical value. */
export function parameterBounds(root:HTMLElement|null,frame:VisualFrame,d:VisualDefinition) {
  if(d.bounds)return {...d.bounds,values:d.bounds.values??null};
  const value=(d.source==='scene'?frame.scene:frame.input)[d.parameter];
  if(typeof value==='boolean')return {min:0,max:1,values:[0,1]};
  const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
  const words=d.xLabel.toLowerCase().match(/[a-z]{3,}/g)??[];
  const candidates=[...(root?.querySelectorAll<HTMLInputElement|HTMLSelectElement>('input[type="number"],input[type="range"],select')??[])].filter(n=>!n.closest('[role="dialog"]'));
  const score=(n:HTMLInputElement|HTMLSelectElement)=>{const label=n.getAttribute('aria-label')||n.closest('label')?.textContent||'';return (d.parameter.length>1&&norm(label).includes(norm(d.parameter))?12:0)+words.filter(w=>label.toLowerCase().includes(w)).length*4+(n instanceof HTMLInputElement&&n.type==='number'?2:0)+(Number(n.value)===value?1:0);};
  const best=candidates.sort((a,b)=>score(b)-score(a))[0];
  if(best&&score(best)>=5){
    if(best instanceof HTMLSelectElement){let values=[...best.options].filter(o=>!o.disabled&&o.value.trim()!==''&&Number.isFinite(Number(o.value))).map(o=>Number(o.value));if(frame.route==='/modern-physics/atomic-spectra'&&d.parameter==='ni')values=values.filter(n=>n>Number(frame.input.nf));if(values.length)return {min:Math.min(...values),max:Math.max(...values),values};}
    else if(best.min!==''&&best.max!==''&&Number(best.max)>Number(best.min))return {min:Number(best.min),max:Number(best.max),values:null};
  }
  const current=visualNumber(value)??0,extent=Math.abs(current)*.25||1;
  return d.source==='scene'?{min:0,max:Math.max(5,current),values:null}:{min:current-extent,max:current+extent,values:null};
}
