export type PotentialInput={planet:number;moon:number;radius:number;angle:number};
export const POTENTIAL_DEFAULTS={planet:5.97e24,moon:7.35e22,radius:1.42e7,angle:32};
export function potentialSettings(v:PotentialInput){return{planet:Math.max(1e23,Math.min(1e26,Number(v.planet)||1e23)),moon:Math.max(1e21,Math.min(1e24,Number(v.moon)||1e21)),radius:Math.max(1e6,Math.min(3e8,Number(v.radius)||1e6)),angle:Math.max(0,Math.min(180,Number(v.angle)||0))};}
/** Planet at origin, moon at (384400 km,0); probe polar angle measured from their line. */
export function potentialSolution(raw:PotentialInput){const v=potentialSettings(raw),G=6.67430e-11,D=384400e3,a=v.angle*Math.PI/180,x=v.radius*Math.cos(a),y=v.radius*Math.sin(a),dx=x-D,d=Math.hypot(dx,y),V=-G*v.planet/v.radius-G*v.moon/d,gx=-G*v.planet*x/v.radius**3-G*v.moon*dx/d**3,gy=-G*v.planet*y/v.radius**3-G*v.moon*y/d**3;return{V,energy:V*1000,gradient:Math.hypot(gx,gy),gx,gy,moonDistance:d};}
