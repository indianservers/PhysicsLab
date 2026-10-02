import {runBenchmarkCases} from "../shared/validation";import{demandAt,simulateDay,type GridInput}from"./energyGridPhysics";
const base:GridInput={capacities:{solar:8,wind:8,hydro:4,gas:4,coal:0,nuclear:3},demandScale:100,weather:"clear",storageCapacity:12,storagePower:3,reliabilityTarget:99.5};
export const energyGridBenchmarks=runBenchmarkCases([
 {id:"balance",name:"Hourly energy balance closes",input:0,expected:0,unit:"GWh",tolerance:1e-10,actual:()=>simulateDay(base).balanceResidual},
 {id:"storage-loss",name:"Storage round trip loses energy",input:0,expected:1,unit:"boolean",tolerance:0,actual:()=>Number(simulateDay(base).storageLoss>0)},
 {id:"solar-night",name:"Solar output is zero at midnight",input:0,expected:0,unit:"factor",tolerance:0,actual:()=>simulateDay(base).hours[0].outputs.solar},
 {id:"demand-peak",name:"Evening demand exceeds noon demand",input:0,expected:1,unit:"boolean",tolerance:0,actual:()=>Number(demandAt(19,100)>demandAt(12,100))},
 {id:"intermittency",name:"Clouds reduce daily solar energy",input:0,expected:1,unit:"boolean",tolerance:0,actual:()=>Number(simulateDay({...base,weather:"cloudy"}).hours.reduce((s,h)=>s+h.outputs.solar,0)<simulateDay(base).hours.reduce((s,h)=>s+h.outputs.solar,0))},
]);
