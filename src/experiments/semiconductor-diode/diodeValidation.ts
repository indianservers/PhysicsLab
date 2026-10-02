import { runBenchmarkCases } from "../shared/validation";
import { solveJunction, solveRectifier, type DiodeInput } from "./diodePhysics";
const base:DiodeInput={biasVoltage:.7,dopingFactor:1,temperatureC:25,acAmplitude:18,acFrequency:50,loadResistance:1000,capacitanceMicroF:1000,rectifierMode:"full-wave"};
export const diodeBenchmarks=runBenchmarkCases([
  {id:"forward-exponential",name:"Forward current rises exponentially",input:0,expected:1,unit:"boolean",tolerance:0,actual:()=>Number(solveJunction({...base,biasVoltage:.7}).current/solveJunction({...base,biasVoltage:.6}).current>5)},
  {id:"reverse-leakage",name:"Reverse current approaches negative saturation current",input:0,expected:1,unit:"boolean",tolerance:0,actual:()=>{const j=solveJunction({...base,biasVoltage:-2});return Number(Math.abs(j.current+j.saturationCurrent)<1e-18)}},
  {id:"polarity-width",name:"Forward narrows and reverse widens depletion layer",input:0,expected:1,unit:"boolean",tolerance:0,actual:()=>Number(solveJunction({...base,biasVoltage:.5}).depletionWidthMicron<solveJunction({...base,biasVoltage:-2}).depletionWidthMicron)},
  {id:"full-wave-frequency",name:"Full-wave ripple frequency is twice source frequency",input:0,expected:100,unit:"Hz",tolerance:0,actual:()=>solveRectifier(base).rippleFrequency},
  {id:"capacitance-ripple",name:"Larger filter capacitance reduces ripple",input:0,expected:1,unit:"boolean",tolerance:0,actual:()=>Number(solveRectifier({...base,capacitanceMicroF:1000}).ripplePeakToPeak<solveRectifier({...base,capacitanceMicroF:100}).ripplePeakToPeak)},
]);
