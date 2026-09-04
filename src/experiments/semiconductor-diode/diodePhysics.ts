export type RectifierMode = "half-wave" | "full-wave";
export interface DiodeInput { biasVoltage:number; dopingFactor:number; temperatureC:number; acAmplitude:number; acFrequency:number; loadResistance:number; capacitanceMicroF:number; rectifierMode:RectifierMode; }
export interface JunctionResult { thermalVoltage:number; saturationCurrent:number; current:number; barrierPotential:number; depletionWidthMicron:number; bias:"forward"|"reverse"|"equilibrium"; }
export interface RectifierResult { rippleFrequency:number; diodeDrop:number; peakOutput:number; dcVoltage:number; loadCurrent:number; ripplePeakToPeak:number; ripplePercent:number; peakInverseVoltage:number; peakDiodeCurrent:number; safe:boolean; }
const clamp=(v:number,min:number,max:number)=>Math.min(max,Math.max(min,v));
export function solveJunction(input:Pick<DiodeInput,"biasVoltage"|"dopingFactor"|"temperatureC">):JunctionResult {
  const temperatureK=clamp(input.temperatureC,-20,125)+273.15;
  const thermalVoltage=8.617333262e-5*temperatureK;
  const doping=clamp(input.dopingFactor,.5,2);
  const saturationCurrent=(5e-9/doping)*Math.exp((temperatureK-298.15)/24);
  const ideality=2;
  const exponent=clamp(input.biasVoltage/(ideality*thermalVoltage),-50,18);
  const current=saturationCurrent*(Math.exp(exponent)-1);
  const barrierPotential=clamp(.70-.002*(input.temperatureC-25)+.025*Math.log(doping),.35,.9);
  const effectiveBarrier=Math.max(.015,barrierPotential-input.biasVoltage);
  const depletionWidthMicron=clamp(.58*Math.sqrt(effectiveBarrier/barrierPotential)/Math.sqrt(doping),.07,1.4);
  return {thermalVoltage,saturationCurrent,current,barrierPotential,depletionWidthMicron,bias:Math.abs(input.biasVoltage)<.005?"equilibrium":input.biasVoltage>0?"forward":"reverse"};
}
export function solveRectifier(input:DiodeInput):RectifierResult {
  const junction=solveJunction(input);
  const diodeDrop=junction.barrierPotential;
  const diodeCount=input.rectifierMode==="full-wave"?2:1;
  const peakOutput=Math.max(0,input.acAmplitude-diodeCount*diodeDrop);
  const rippleFrequency=input.acFrequency*(input.rectifierMode==="full-wave"?2:1);
  const resistance=clamp(input.loadResistance,100,5000);
  const capacitance=Math.max(0,input.capacitanceMicroF)*1e-6;
  let dcVoltage:number;
  let ripplePeakToPeak:number;
  if(capacitance===0){
    dcVoltage=input.rectifierMode==="full-wave"?(2*peakOutput)/Math.PI:peakOutput/Math.PI;
    ripplePeakToPeak=peakOutput;
  }else{
    dcVoltage=peakOutput;
    for(let i=0;i<3;i+=1){const current=dcVoltage/resistance;ripplePeakToPeak=current/(rippleFrequency*capacitance);dcVoltage=Math.max(0,peakOutput-ripplePeakToPeak/2);}
    ripplePeakToPeak=(dcVoltage/resistance)/(rippleFrequency*capacitance);
  }
  const loadCurrent=dcVoltage/resistance;
  const ripplePercent=dcVoltage===0?0:(ripplePeakToPeak/dcVoltage)*100;
  const peakInverseVoltage=input.rectifierMode==="full-wave"?input.acAmplitude:2*input.acAmplitude;
  const peakDiodeCurrent=loadCurrent+(capacitance>0?ripplePeakToPeak*rippleFrequency*capacitance:0);
  return {rippleFrequency,diodeDrop,peakOutput,dcVoltage,loadCurrent,ripplePeakToPeak,ripplePercent,peakInverseVoltage,peakDiodeCurrent,safe:peakInverseVoltage<=1000&&peakDiodeCurrent<=1};
}
