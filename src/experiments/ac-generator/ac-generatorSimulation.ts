import { computePremiumEm } from "../shared/electromagnetismPremiumLibrary";
import { computeAcGenerator } from "./acGeneratorPhysics";

export const simulateAcGenerator = (values: Record<string, number>) => computePremiumEm("ac-generator", values);

export const acGeneratorBenchmarks = [
  { id: "peak", name: "Peak emf follows NBAomega", actual: computeAcGenerator({magneticField:.5,coilArea:.1,turns:50,angularSpeed:20,angleRad:Math.PI/2,polarity:1,direction:1,loadResistance:20}).emf, expected: 50, tolerance: 0.000001, unit: "V" },
  { id: "flux-at-zero", name: "Flux is maximum when emf is zero", actual: computeAcGenerator({magneticField:.5,coilArea:.1,turns:50,angularSpeed:20,angleRad:0,polarity:1,direction:1,loadResistance:20}).fluxLinkage, expected:2.5, tolerance:1e-12, unit:"Wb-turn" },
  { id: "emf-at-zero", name: "Emf is zero at maximum flux", actual: computeAcGenerator({magneticField:.5,coilArea:.1,turns:50,angularSpeed:20,angleRad:0,polarity:1,direction:1,loadResistance:20}).emf, expected:0, tolerance:1e-12, unit:"V" },
  { id: "sign-reversal", name: "Emf reverses after half a turn", actual: computeAcGenerator({magneticField:.5,coilArea:.1,turns:50,angularSpeed:20,angleRad:Math.PI/2,polarity:1,direction:1,loadResistance:20}).emf + computeAcGenerator({magneticField:.5,coilArea:.1,turns:50,angularSpeed:20,angleRad:3*Math.PI/2,polarity:1,direction:1,loadResistance:20}).emf, expected:0, tolerance:1e-10, unit:"V" },
  { id: "omega-trend", name: "Doubling omega doubles peak emf", actual: computeAcGenerator({magneticField:.5,coilArea:.1,turns:50,angularSpeed:40,angleRad:Math.PI/2,polarity:1,direction:1,loadResistance:20}).peakEmf / computeAcGenerator({magneticField:.5,coilArea:.1,turns:50,angularSpeed:20,angleRad:Math.PI/2,polarity:1,direction:1,loadResistance:20}).peakEmf, expected:2, tolerance:1e-12, unit:"ratio" },
];
