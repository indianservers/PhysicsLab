export type FrictionStudioInput={normal:number;pull:number;surface:'wood'|'metal'|'rubber'};
export const FRICTION_DEFAULTS:FrictionStudioInput={normal:10,pull:0,surface:'wood'};
const COEFF={wood:[.5,.36],metal:[.15,.1],rubber:[1,.8]} as const;
export function frictionStudioSettings(v:FrictionStudioInput):FrictionStudioInput{return{normal:Math.round(Math.min(30,Math.max(0,Number.isFinite(v.normal)?v.normal:10))*10)/10,pull:Math.round(Math.min(30,Math.max(0,Number.isFinite(v.pull)?v.pull:0))*10)/10,surface:v.surface in COEFF?v.surface:'wood'}}
export function frictionStudioSolution(raw:FrictionStudioInput){const input=frictionStudioSettings(raw),[muS,muK]=COEFF[input.surface],staticLimit=muS*input.normal,kinetic=muK*input.normal,moving=input.pull>staticLimit,friction=moving?-kinetic:-input.pull;return{input,muS,muK,staticLimit,kinetic,friction,net:input.pull+friction,moving}}
