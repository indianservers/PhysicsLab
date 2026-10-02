export type ComInput={distribution:number;width:number;tilt:number};
export type Point3={x:number;y:number;z:number};
export const COM_DEFAULTS:ComInput={distribution:.7,width:4,tilt:0};
export const COM_PLATE_THICKNESS=.35;
// Centimetres; one shared polygon supplies both render geometry and mass moments.
const PLATE_CONTROL:Array<[number,number]>=[[-9,-4],[-7,-5.8],[-5,-6],[-2,-5.6],[0,-6.5],[3,-5.7],[5.5,-6.2],[7,-4.8],[9,-3],[9.5,-1],[8,1],[8.5,3.5],[6,5.5],[4,6],[1,5.7],[-2,6.5],[-5.5,5.8],[-7,4],[-8,2],[-9,-1]];
export const COM_OUTLINE:Array<[number,number]>=PLATE_CONTROL.flatMap((p,k)=>Array.from({length:8},(_,j)=>{const t=j/8,a=PLATE_CONTROL[(k+PLATE_CONTROL.length-1)%PLATE_CONTROL.length],b=PLATE_CONTROL[(k+1)%PLATE_CONTROL.length],c=PLATE_CONTROL[(k+2)%PLATE_CONTROL.length];return [0,1].map(d=>.5*((2*p[d])+(-a[d]+b[d])*t+(2*a[d]-5*p[d]+4*b[d]-c[d])*t*t+(-a[d]+3*p[d]-3*b[d]+c[d])*t*t*t)) as [number,number]}));
export const COM_HOLES=[{x:-7,y:-2,r:.5},{x:7,y:-1,r:.5}];
export function plateMassProperties(){let area2=0,mx6=0,my6=0;for(let k=0;k<COM_OUTLINE.length;k++){const a=COM_OUTLINE[k],b=COM_OUTLINE[(k+1)%COM_OUTLINE.length],cross=a[0]*b[1]-b[0]*a[1];area2+=cross;mx6+=(a[0]+b[0])*cross;my6+=(a[1]+b[1])*cross}let area=area2/2,mx=mx6/6,my=my6/6;for(const h of COM_HOLES){const a=Math.PI*h.r*h.r;area-=a;mx-=a*h.x;my-=a*h.y}return {area,mass:area*COM_PLATE_THICKNESS*2.7/1000,x:mx/area,y:my/area,z:COM_PLATE_THICKNESS/2}}
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function comSettings(i:ComInput):ComInput{return {distribution:clamp(Number.isFinite(i.distribution)?i.distribution:.7,0,1),width:clamp(Number.isFinite(i.width)?i.width:4,1,10),tilt:clamp(Number.isFinite(i.tilt)?i.tilt:0,-15,15)}}
export function comBodies(raw:ComInput){const i=comSettings(raw),p=plateMassProperties();return [{id:'plate',mass:p.mass,x:p.x,y:p.y,z:p.z,size:[0,0,COM_PLATE_THICKNESS],color:'#727e88'},{id:'left',mass:.015+.24*(1-i.distribution),x:-4,y:1,z:1.55,size:[4,3,2.4],color:'#34424b'},{id:'gold',mass:.07,x:-4,y:1,z:3.4,size:[2,1.7,1.3],color:'#bda475'},{id:'right',mass:.015+.24*i.distribution,x:4,y:1.5,z:1.6,size:[2.5,2.5,2.5],color:'#9facb8'},{id:'bronze',mass:.015,x:5,y:-2.5,z:.95,size:[1.2,1.2,1.2],color:'#856452'}]}
export function solveCom(raw:ComInput){const input=comSettings(raw),bodies=comBodies(input),mass=bodies.reduce((a,b)=>a+b.mass,0),com={x:0,y:0,z:0};for(const b of bodies){com.x+=b.mass*b.x/mass;com.y+=b.mass*b.y/mass;com.z+=b.mass*b.z/mass}const theta=input.tilt*Math.PI/180,c=Math.cos(theta),n=Math.sin(theta),projection={x:com.x+com.z*Math.tan(theta),y:com.y,z:0},half=input.width/2,margin=Math.min(half-Math.abs(projection.x),half-Math.abs(projection.y)),contact={x:clamp(projection.x,-half,half),y:clamp(projection.y,-half,half),z:0};
 const worldCom={x:com.x*c+com.z*n,y:com.y,z:-com.x*n+com.z*c},worldContact={x:contact.x*c,y:contact.y,z:-contact.x*n};
 // Upward resultant can move within the support. At the nearest edge its residual moment predicts tipping.
 const torqueX=-mass*9.81*(worldCom.y-worldContact.y)/100,torqueY=mass*9.81*(worldCom.x-worldContact.x)/100,netTorque=Math.hypot(torqueX,torqueY),status=margin>1e-8?'Stable':margin>=-1e-8?'Marginal':'Would tip';
 return {input,bodies,mass,com,worldCom,projection,contact,margin,distance:Math.hypot(projection.x,projection.y),netTorque:netTorque<1e-12?0:netTorque,torqueX,torqueY,status,normalForce:mass*9.81*c,frictionRequired:mass*9.81*Math.abs(n),minimumFriction:Math.abs(Math.tan(theta))};
}
export function comSweep(input:ComInput,count=41){return Array.from({length:count},(_,k)=>{const distribution=k/(count-1),s=solveCom({...input,distribution});return {distribution,...s.com}})}
