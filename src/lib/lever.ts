export type LeverInput = {load:number;effort:number;pivot:number;attachment:number};
export type LeverMotion = {angle:number;omega:number;time:number;loss:number;stopped:boolean};
export const LEVER_DEFAULTS:LeverInput={load:-.3,effort:6.7,pivot:0,attachment:.45};
export const LEVER_REST:LeverMotion={angle:0,omega:0,time:0,loss:0,stopped:false};
export const LEVER_WEIGHT=10, LEVER_DROP=.15, LEVER_HUB=.15, LEVER_DAMPING=.12, LEVER_LIMIT=Math.PI/12;
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function leverSettings(i:LeverInput):LeverInput{return {load:clamp(Number.isFinite(i.load)?i.load:-.3,-.5,.5),effort:clamp(Number.isFinite(i.effort)?i.effort:6.7,0,50),pivot:clamp(Number.isFinite(i.pivot)?i.pivot:0,-.5,.5),attachment:clamp(Number.isFinite(i.attachment)?i.attachment:.45,-.5,.5)}}
export function solveLever(raw:LeverInput,s:LeverMotion=LEVER_REST){
 const i=leverSettings(raw),rL=i.load-i.pivot,rE=i.attachment-i.pivot,c=Math.cos(s.angle),n=Math.sin(s.angle),armL=rL*c+LEVER_DROP*n,armE=rE*c;
 const loadTorque=-LEVER_WEIGHT*armL,effortTorque=-i.effort*armE,net=loadTorque+effortTorque,damping=-LEVER_DAMPING*s.omega;
 const inertia=LEVER_HUB+LEVER_WEIGHT/9.81*(rL*rL+LEVER_DROP**2),reaction=s.stopped?-net:0;
 const potential=LEVER_WEIGHT*(rL*n+LEVER_DROP*(1-c))+i.effort*rE*n,kinetic=.5*inertia*s.omega**2;
 const required=Math.abs(armE)>1e-10?-LEVER_WEIGHT*armL/armE:null;
 return {rL,rE,armL,armE,loadTorque,effortTorque,net,clockwise:-Math.min(0,loadTorque)-Math.min(0,effortTorque),counterclockwise:Math.max(0,loadTorque)+Math.max(0,effortTorque),inertia,damping,reaction,alpha:(net+damping+reaction)/inertia,potential,kinetic,totalEnergy:potential+kinetic+s.loss,ratio:i.effort>0?LEVER_WEIGHT/i.effort:null,ideal:Math.abs(armL)>1e-10&&armL*armE<0?Math.abs(armE/armL):null,required:required!==null&&required>=0?required:null};
}
// RK4 with sub-millisecond integration and bisection to locate each hard stop.
export function stepLever(i:LeverInput,state:LeverMotion,dt:number):LeverMotion{
 if(!Number.isFinite(dt)||dt<=0)return state;let s={...state},remaining=dt;
 const advance=(a:LeverMotion,h:number)=>{const d=(angle:number,omega:number)=>{const z=solveLever(i,{...a,angle,omega,stopped:false});return [omega,z.alpha,LEVER_DAMPING*omega*omega]};const k1=d(a.angle,a.omega),k2=d(a.angle+h*k1[0]/2,a.omega+h*k1[1]/2),k3=d(a.angle+h*k2[0]/2,a.omega+h*k2[1]/2),k4=d(a.angle+h*k3[0],a.omega+h*k3[1]);return {...a,angle:a.angle+h*(k1[0]+2*k2[0]+2*k3[0]+k4[0])/6,omega:a.omega+h*(k1[1]+2*k2[1]+2*k3[1]+k4[1])/6,loss:a.loss+h*(k1[2]+2*k2[2]+2*k3[2]+k4[2])/6,time:a.time+h,stopped:false}};
 while(remaining>1e-12){if(s.stopped){s.time+=remaining;break}const h=Math.min(.001,remaining),trial=advance(s,h);if(Math.abs(trial.angle)>LEVER_LIMIT){const sign=Math.sign(trial.angle);let lo=0,hi=h;for(let k=0;k<32;k++){const mid=(lo+hi)/2;if(sign*advance(s,mid).angle>=LEVER_LIMIT)hi=mid;else lo=mid}const hit=advance(s,hi);s={...hit,angle:sign*LEVER_LIMIT,omega:0,loss:hit.loss+.5*solveLever(i,hit).inertia*hit.omega**2,stopped:true};remaining-=hi}else{s=trial;remaining-=h}}
 return s;
}
