export type MatterInput={energy:number;spacing:number;width:number};export const MATTER_DEFAULTS={energy:100,spacing:.213,width:.5};
export function matterSettings(v:MatterInput){return{energy:Math.max(20,Math.min(300,Number(v.energy)||20)),spacing:Math.max(.1,Math.min(.4,Number(v.spacing)||.1)),width:Math.max(.1,Math.min(2,Number(v.width)||.1))};}
/** Relativistic electron momentum; screen distance 30 cm, scattering angle 2*Bragg angle. */
export function matterSolution(raw:MatterInput){const v=matterSettings(raw),h=6.62607015e-34,m=9.1093837139e-31,c=299792458,E=v.energy*1e3*1.602176634e-19,p=Math.sqrt(E*(E+2*m*c*c))/c,lambda=h/p*1e9,angle=Math.asin(lambda/(2*v.spacing))*180/Math.PI;return{lambda,angle,radius:30*Math.tan(2*angle*Math.PI/180),momentum:p};}
