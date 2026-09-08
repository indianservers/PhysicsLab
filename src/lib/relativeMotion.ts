export type RelativeMotionInput = {boat: number; current: number; heading: number};
export const RELATIVE_MOTION_DEFAULTS: RelativeMotionInput = {boat:5,current:2,heading:30};
export const RIVER_WIDTH = 300;
const clamp=(n:number,lo:number,hi:number,fallback:number)=>Math.max(lo,Math.min(hi,Number.isFinite(n)?n:fallback));
export function relativeMotionSettings(input:RelativeMotionInput):RelativeMotionInput{
 return {boat:Math.round(clamp(input.boat,0,20,5)*10)/10,current:Math.round(clamp(input.current,0,10,2)*10)/10,heading:Math.round(clamp(input.heading,-90,90,30))};
}
export function relativeMotionSolution(raw:RelativeMotionInput){
 const input=relativeMotionSettings(raw),angle=input.heading*Math.PI/180;
 const boatX=input.boat*Math.sin(angle),boatY=Math.abs(input.heading)===90?0:input.boat*Math.cos(angle),groundX=boatX+input.current,groundY=boatY;
 const time=groundY>0?RIVER_WIDTH/groundY:null;
 return {input,boatX,boatY,groundX,groundY,groundSpeed:Math.hypot(groundX,groundY),crossingTime:time,drift:time===null?null:groundX*time,currentDrift:time===null?null:input.current*time};
}
export function relativeMotionState(raw:RelativeMotionInput,seconds:number){
 const solution=relativeMotionSolution(raw),t=Math.max(0,Math.min(solution.crossingTime??Infinity,Number.isFinite(seconds)?seconds:0));
 return {t,x:solution.groundX*t,y:solution.crossingTime!==null&&t===solution.crossingTime?RIVER_WIDTH:solution.groundY*t,waterX:solution.boatX*t,waterY:solution.boatY*t,shoreOriginInWater:-solution.input.current*t,arrived:solution.crossingTime!==null&&t===solution.crossingTime};
}
/** Upstream heading for a finite crossing with zero downstream displacement. */
export function noDriftHeading(boat:number,current:number):number|null{
 return boat>0&&current>=0&&current<boat?-Math.asin(current/boat)*180/Math.PI:null;
}
