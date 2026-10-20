export type ExoInput={radius:number;period:number;inclination:number};export const EXO_DEFAULTS={radius:1.6,period:30,inclination:89.2};
export function exoSettings(v:ExoInput){return{radius:Math.max(.5,Math.min(4,Number(v.radius)||.5)),period:Math.max(1,Math.min(200,Number(v.period)||1)),inclination:Math.max(80,Math.min(90,Number(v.inclination)||80))};}
/** Circular solar-mass/solar-radius host; uniform stellar disk. Earth-density mass is an assumption, not a transit measurement. */
export function exoSolution(raw:ExoInput){const v=exoSettings(raw),a=(v.period/365.25)**(2/3),starRadiusAU=695700/149597870.7,p=v.radius*6371/695700,b=a*Math.cos(v.inclination*Math.PI/180)/starRadiusAU;
let overlap=0;if(b<=1-p)overlap=Math.PI*p*p;else if(b<1+p){const d=b,c1=Math.acos(Math.max(-1,Math.min(1,(d*d+1-p*p)/(2*d)))),c2=Math.acos(Math.max(-1,Math.min(1,(d*d+p*p-1)/(2*d*p)))),area=.5*Math.sqrt(Math.max(0,(-d+1+p)*(d+1-p)*(d-1+p)*(d+1+p)));overlap=c1+p*p*c2-area;}
const depth=overlap/Math.PI,mass=v.radius**3,temp=278.3/Math.sqrt(a);return{depth,mass,temp,a,impact:b,transits:b<1+p,habitable:a>=.95&&a<=1.67};}
