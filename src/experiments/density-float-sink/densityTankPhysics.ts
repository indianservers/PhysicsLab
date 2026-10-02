export const G = 9.80665;
export type Shape = "cube" | "sphere" | "cylinder";
export interface DensityTankInput { massG: number; volumeCm3: number; fluidDensity: number; depthFraction: number; layered: boolean; shape: Shape }
export interface DensityTankResult { objectDensity: number; localFluidDensity: number; weightN: number; buoyantForceN: number; netForceN: number; displacedCm3: number; equilibriumDepth: number; state: "float" | "suspend" | "sink" | "interface"; layer: string; orientation: string }
const clamp=(n:number,a:number,b:number)=>Math.min(b,Math.max(a,n));
export const layers=[{name:"Oil",density:850,end:.25},{name:"Water",density:1000,end:.5},{name:"Saltwater",density:1025,end:.75},{name:"Dense liquid",density:13600,end:1}];
export function solveDensityTank(input:DensityTankInput):DensityTankResult{
  const massG=clamp(input.massG,10,1000),volumeCm3=clamp(input.volumeCm3,10,1000),objectDensity=massG/volumeCm3*1000,volumeM3=volumeCm3*1e-6,depth=clamp(input.depthFraction,0,1);
  let localFluidDensity=input.fluidDensity,layer="Single fluid",equilibriumDepth=.5,state:DensityTankResult["state"]="suspend",displacedFraction=1;
  if(input.layered){const current=layers.find(x=>depth<=x.end)??layers[3];localFluidDensity=current.density;layer=current.name;const exact=layers.find(x=>Math.abs(x.density-objectDensity)<1e-9);if(exact){equilibriumDepth=exact.end-.125;state="suspend";layer=exact.name}else if(objectDensity<layers[0].density){displacedFraction=objectDensity/layers[0].density;equilibriumDepth=.04+.14*displacedFraction;state="float";layer="Oil surface"}else{const lowerIndex=layers.findIndex(x=>x.density>objectDensity);if(lowerIndex<0){equilibriumDepth=.96;state="sink";layer="Tank bottom"}else{const upper=layers[lowerIndex-1],lower=layers[lowerIndex];const lowerFraction=(objectDensity-upper.density)/(lower.density-upper.density);equilibriumDepth=upper.end-.07+lowerFraction*.14;state="interface";layer=`${upper.name} / ${lower.name}`;}}}
  else{const ratio=objectDensity/input.fluidDensity;if(ratio<1){displacedFraction=ratio;equilibriumDepth=.08+.35*ratio;state="float"}else if(Math.abs(ratio-1)<1e-9){equilibriumDepth=.5;state="suspend"}else{equilibriumDepth=.95;state="sink"}}
  if (state === "interface" && Math.abs(depth - equilibriumDepth) < 0.04) {
    // At an interface the object displaces portions of both adjacent fluids;
    // their volume-weighted effective density equals the object's at rest.
    localFluidDensity = objectDensity;
  }
  const atSurface=depth<.2&&!input.layered;const activeFraction=atSurface?clamp(depth/.2,0,1)*displacedFraction:1;const displacedCm3=volumeCm3*activeFraction;const weightN=massG/1000*G;const buoyantForceN=localFluidDensity*G*displacedCm3*1e-6;
  return{objectDensity,localFluidDensity,weightN,buoyantForceN,netForceN:buoyantForceN-weightN,displacedCm3,equilibriumDepth,state,layer,orientation:input.shape==="sphere"?"orientation independent":input.shape==="cylinder"?"horizontal, broad side stable":"face-down stable"};
}
export function settlingDepth(t:number,start:number,target:number,reduced=false){if(reduced)return target;return clamp(target+(start-target)*Math.exp(-.65*t)*Math.cos(3.8*t),0,1)}
export const densityTankCases=[
 {id:"density",name:"Density is mass divided by volume",actual:solveDensityTank({massG:205,volumeCm3:200,fluidDensity:1000,depthFraction:.5,layered:true,shape:"cube"}).objectDensity,expected:1025,tolerance:1e-12,unit:"kg/m3"},
 {id:"neutral",name:"Saltwater neutral design balances force",actual:solveDensityTank({massG:205,volumeCm3:200,fluidDensity:1000,depthFraction:.65,layered:true,shape:"cube"}).netForceN,expected:0,tolerance:1e-12,unit:"N"},
 {id:"oil",name:"Cork floats in oil",actual:Number(solveDensityTank({massG:24,volumeCm3:100,fluidDensity:1000,depthFraction:.1,layered:true,shape:"cube"}).state==="float"),expected:1,tolerance:0,unit:"boolean"},
 {id:"interface",name:"Aluminum rests above dense layer",actual:Number(solveDensityTank({massG:270,volumeCm3:100,fluidDensity:1000,depthFraction:.8,layered:true,shape:"cube"}).state==="interface"),expected:1,tolerance:0,unit:"boolean"},
 {id:"single",name:"Single fluid density controls sinking",actual:Number(solveDensityTank({massG:120,volumeCm3:100,fluidDensity:1000,depthFraction:.8,layered:false,shape:"sphere"}).state==="sink"),expected:1,tolerance:0,unit:"boolean"},
];
