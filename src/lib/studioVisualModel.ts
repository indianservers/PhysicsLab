import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { getAssignmentFromSearch } from './teacher';

export type VisualValue = number|string|boolean|null|VisualValue[]|{[key:string]:VisualValue};
export type VisualState = Record<string,VisualValue>;
export type VisualFrame = {
  route:string; revision:number; input:VisualState; scene:VisualState;
  quantities:Record<string,number|null>; states:Record<string,string>; locked:boolean;
  applyInput:(patch:VisualState)=>void; applyScene:(patch:VisualState)=>void; resetView:()=>void;
};
const frames=new Map<string,VisualFrame>();
const listeners=new Set<()=>void>();
const subscribe=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
function clone(value:unknown):VisualState { try{return JSON.parse(JSON.stringify(value)) as VisualState;}catch{return {};} }
function flatten(value:unknown,path:string,result:Record<string,number|null>,states:Record<string,string>,depth=0) {
  if(typeof value==='number'){result[path]=Number.isFinite(value)?value:null;return;}
  if(typeof value==='boolean'){result[path]=value?1:0;return;}
  if(value===null){result[path]=null;return;}
  if(typeof value==='string'){states[path]=value;return;}
  if(!value||typeof value!=='object'||Array.isArray(value)||depth>5)return;
  for(const [key,child] of Object.entries(value))flatten(child,path?`${path}.${key}`:key,result,states,depth+1);
}
/** Called inside each real lab, after its existing solver has run. No second physics engine. */
export function useStudioVisualModel<I extends object,S extends object>({route,input,outputs,apply,scene,sceneSetters,resetSceneView}: {
  route:string;input:I;outputs:Record<string,unknown>;apply:(patch:Partial<I>)=>void;
  scene:S;sceneSetters:{[K in keyof S]?:(value:S[K])=>void};
  resetSceneView?:()=>void;
}) {
  const {search}=useLocation();
  const locked=Boolean(getAssignmentFromSearch(search)?.lockVariables);
  const initialView=useRef(clone(scene));
  const latest=useRef({input,apply,scene,sceneSetters,locked,resetSceneView});latest.current={input,apply,scene,sceneSetters,locked,resetSceneView};
  const signature=useRef('');
  useEffect(()=>{
    const quantities:Record<string,number|null>={},states:Record<string,string>={};flatten(outputs,'',quantities,states);
    const inputCopy=clone(input),sceneCopy=clone(scene);
    const nextSignature=JSON.stringify([inputCopy,quantities,states,sceneCopy,locked]);
    if(signature.current===nextSignature)return;signature.current=nextSignature;
    const applyInput=(patch:VisualState)=>{
      if(latest.current.locked)return;
      const current=latest.current.input as Record<string,unknown>;
      const permitted:Record<string,unknown>={};
      for(const [key,value] of Object.entries(patch)){
        if(!(key in current)||typeof value!==typeof current[key])continue;
        if(typeof value==='number'&&!Number.isFinite(value))continue;
        permitted[key]=value;
      }
      latest.current.apply(permitted as Partial<I>);
    };
    const applyScene=(patch:VisualState)=>{
      // Native clock setters may pause playback. Restore run state after the
      // clock and geometry, independently of object-property insertion order.
      const playback=(key:string)=>['running','run','scanning'].includes(key)?1:0;
      for(const [key,value] of Object.entries(patch).sort(([a],[b])=>playback(a)-playback(b))){
        const setter=latest.current.sceneSetters[key as keyof S];
        if(setter&&typeof value===typeof latest.current.scene[key as keyof S])setter(value as S[keyof S]);
      }
    };
    frames.set(route,{route,revision:(frames.get(route)?.revision??0)+1,input:inputCopy,scene:sceneCopy,quantities,states,locked,applyInput,applyScene,resetView:()=>{
      latest.current.resetSceneView?.();
      const view:VisualState={};for(const [key,value] of Object.entries(initialView.current))if(['camera','zoom','view','overlays','visibility','layers','bright','light','display','primary','secondary','vectors','flow','tangent','area','equation','trails','values'].includes(key))view[key]=value;
      applyScene(view);
    }});
    listeners.forEach(listener=>listener());
  });
  useEffect(()=>()=>{signature.current='';frames.delete(route);listeners.forEach(listener=>listener());},[route]);
}
export function useStudioVisualFrame(route:string) {
  return useSyncExternalStore(subscribe,()=>frames.get(route),()=>undefined);
}
export function readStudioVisualFrame(route:string) {return frames.get(route);}

export function visualNumber(value:unknown):number|null {
  return typeof value==='number'&&Number.isFinite(value)?value:typeof value==='boolean'?(value?1:0):null;
}
