export type Orientation = "broad" | "side" | "end" | "custom";
export type SurfaceMaterial = "steel" | "foam" | "clay";
export interface ContactPressureInput { appliedForceN:number; contactAreaM2:number; orientation:Orientation; surface:SurfaceMaterial }
export const FACE_AREAS:Record<Exclude<Orientation,"custom">,number>={broad:.08,side:.04,end:.02};
export const MATERIAL_MODULUS:Record<SurfaceMaterial,number>={steel:200e9,foam:5e6,clay:.8e6};
const clamp=(n:number,a:number,b:number)=>Math.min(b,Math.max(a,n));
export function solveContactPressure(input:ContactPressureInput){const forceN=clamp(input.appliedForceN,0,2000);const contactAreaM2=clamp(input.contactAreaM2,.005,.16);const pressurePa=forceN/contactAreaM2;const modulus=MATERIAL_MODULUS[input.surface];const strain=pressurePa/modulus;return{forceN,normalForceN:forceN,contactAreaM2,pressurePa,pressureKPa:pressurePa/1000,strain,deformationMm:strain*.08*1000,visualDeformation:Math.min(28,strain*2400),loadShare:forceN===0?0:1};}
export const contactPressureCases=[
 {id:"definition",name:"Pressure is force divided by area",actual:solveContactPressure({appliedForceN:600,contactAreaM2:.04,orientation:"side",surface:"steel"}).pressurePa,expected:15000,tolerance:1e-12,unit:"Pa"},
 {id:"area",name:"Doubling area halves pressure",actual:solveContactPressure({appliedForceN:600,contactAreaM2:.04,orientation:"side",surface:"steel"}).pressurePa/solveContactPressure({appliedForceN:600,contactAreaM2:.08,orientation:"broad",surface:"steel"}).pressurePa,expected:2,tolerance:1e-12,unit:"ratio"},
 {id:"normal",name:"Total normal force equals applied force",actual:solveContactPressure({appliedForceN:1200,contactAreaM2:.02,orientation:"end",surface:"foam"}).normalForceN,expected:1200,tolerance:0,unit:"N"},
 {id:"units",name:"Ten newtons per square metre is ten pascals",actual:solveContactPressure({appliedForceN:1,contactAreaM2:.1,orientation:"custom",surface:"steel"}).pressurePa,expected:10,tolerance:0,unit:"Pa"},
 {id:"material",name:"Foam deforms more than steel",actual:Number(solveContactPressure({appliedForceN:600,contactAreaM2:.04,orientation:"side",surface:"foam"}).strain>solveContactPressure({appliedForceN:600,contactAreaM2:.04,orientation:"side",surface:"steel"}).strain),expected:1,tolerance:0,unit:"boolean"},
];
