import type { KeyboardEvent, PointerEvent } from "react";
import "./direct-axis-control.css";

export function DirectAxisControl({ label, value, min, max, step, onChange, vertical=false, className="" }: { label:string; value:number; min:number; max:number; step:number; onChange:(value:number)=>void; vertical?:boolean; className?:string }) {
  const clampStep=(next:number)=>Number(Math.max(min,Math.min(max,Math.round(next/step)*step)).toFixed(10));
  const changeFromPointer=(event:PointerEvent<HTMLButtonElement>)=>{
    if(event.type==="pointermove"&&!event.currentTarget.hasPointerCapture(event.pointerId))return;
    if(event.type==="pointerdown")event.currentTarget.setPointerCapture(event.pointerId);
    const rect=event.currentTarget.getBoundingClientRect();
    const fraction=vertical?1-(event.clientY-rect.top)/rect.height:(event.clientX-rect.left)/rect.width;
    const raw=min+Math.max(0,Math.min(1,fraction))*(max-min);
    onChange(clampStep(raw));
  };
  const key=(event:KeyboardEvent<HTMLButtonElement>)=>{
    const lower=event.key==="ArrowLeft"||event.key==="ArrowDown";
    const higher=event.key==="ArrowRight"||event.key==="ArrowUp";
    if(!lower&&!higher)return;
    event.preventDefault();
    onChange(clampStep(value+(higher?step:-step)));
  };
  const fraction=(value-min)/(max-min||1);
  return <button type="button" className={`direct-axis ${vertical?"vertical":""} ${className}`} aria-label={`${label}, ${value}`} role="slider" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} onPointerDown={changeFromPointer} onPointerMove={changeFromPointer} onKeyDown={key}><i style={vertical?{bottom:`${fraction*100}%`}:{left:`${fraction*100}%`}}/><span>{label}</span></button>;
}
