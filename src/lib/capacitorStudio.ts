export type CapacitorInput={area:number;distance:number;er:number;voltage:number};export const CAP_DEFAULTS={area:50,distance:2,er:3.9,voltage:5};export function capSettings(v:CapacitorInput){return{area:Math.max(1,Math.min(100,Number(v.area)||1)),distance:Math.max(.5,Math.min(10,Number(v.distance)||.5)),er:Math.max(1,Math.min(10,Number(v.er)||1)),voltage:Math.max(0,Math.min(12,Number(v.voltage)||0))}}export function capSolution(v:CapacitorInput){const C=v.er*8.854e-12*(v.area*10)/(v.distance*1e-3);return{C,charge:C*v.voltage,energy:.5*C*v.voltage*v.voltage}}


