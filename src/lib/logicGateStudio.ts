export type LogicGate='complex'|'and'|'or'|'xor'|'nand';
export type LogicInput={a:boolean;b:boolean;gate:string};
export const LOGIC_DEFAULTS:LogicInput={a:true,b:false,gate:'complex'};
export const LOGIC_GATES:LogicGate[]=['complex','and','or','xor','nand'];
export const LOGIC_RISE=6.05e-9,LOGIC_FALL=6.35e-9,LOGIC_DURATION=120e-9;
export function logicSettings(v:LogicInput):LogicInput{return{a:Boolean(v.a),b:Boolean(v.b),gate:LOGIC_GATES.includes(v.gate as LogicGate)?v.gate:'complex'}}
export function logicSolution(v:LogicInput){const na=!v.a,ab=v.a&&v.b,y=v.gate==='and'?ab:v.gate==='or'?v.a||v.b:v.gate==='xor'?v.a!==v.b:v.gate==='nand'?!ab:ab||na;return{a:v.a,b:v.b,y,na,ab}}
export const logicFormula=(gate:string)=>gate==='and'?String.raw`Y=A\cdot B`:gate==='or'?'Y=A+B':gate==='xor'?String.raw`Y=A\oplus B`:gate==='nand'?String.raw`Y=\overline{A\cdot B}`:String.raw`Y=(A\cdot B)+\overline A`;
export type LogicState=ReturnType<typeof logicSolution>;export type LogicNode=keyof LogicState;
export type LogicEvent={time:number;node:LogicNode;value:boolean;version?:number};
/** Deterministic inertial gate model. SI seconds internally; delays are illustrative, not a device fit. */
export function logicTrial(input:LogicInput,transitions?:LogicEvent[],duration=LOGIC_DURATION){const v=logicSettings(input),state=logicSolution(v),history=[{time:0,...state}],versions:Partial<Record<LogicNode,number>>={},queue:LogicEvent[]=(transitions??([[ [20,40,65,80],'a',v.a],[[25,50,85,100],'b',v.b]] as [number[],'a'|'b',boolean][]).flatMap(([times,node,initial])=>(times as number[]).map((t,i)=>({time:t*1e-9,node:node as LogicNode,value:i%2===0?!initial:!!initial})))).filter(e=>e.time>0&&e.time<=duration&&(e.node==='a'||e.node==='b')).map(e=>({...e}));const gates:LogicNode[]=v.gate==='complex'?['ab','na','y']:['y'];
 const target=(node:LogicNode)=>node==='ab'?state.a&&state.b:node==='na'?!state.a:logicSolution({...v,a:state.a,b:state.b}).y;
 const pending:Partial<Record<LogicNode,boolean>>={};let steps=0;
 while(queue.length&&steps++<10000){queue.sort((a,b)=>a.time-b.time);const time=queue[0].time;if(time>duration)break;const batch=queue.splice(0,queue.findIndex(e=>e.time!==time)<0?queue.length:queue.findIndex(e=>e.time!==time));let changed=false;for(const e of batch){if(e.version!==undefined&&e.version!==versions[e.node])continue;if(e.version!==undefined)delete pending[e.node];if(state[e.node]!==e.value){state[e.node]=e.value;changed=true}}
 if(changed){history.push({time,...state});for(const node of gates){const value=node==='y'&&v.gate==='complex'?state.ab||state.na:target(node);if(pending[node]===value)continue;versions[node]=(versions[node]??0)+1;delete pending[node];if(value!==state[node]){pending[node]=value;queue.push({time:time+(value?LOGIC_RISE:LOGIC_FALL),node,value,version:versions[node]})}}}
 }
 return{input:v,history,duration,riseDelay:LOGIC_RISE,fallDelay:LOGIC_FALL,nominalPathDelay:(v.gate==='complex'?2:1)*(LOGIC_RISE+LOGIC_FALL)/2};}
export function logicFrame(trial:ReturnType<typeof logicTrial>,time:number){const t=Math.max(0,Math.min(trial.duration,Number.isFinite(time)?time:0));let row=trial.history[0];for(const s of trial.history){if(s.time>t)break;row=s}const settled=logicSolution({...trial.input,a:row.a,b:row.b}).y;return{...row,time:t,settled,pending:row.y!==settled,aVolts:row.a?5:0,bVolts:row.b?5:0,yVolts:row.y?5:0,finished:t>=trial.duration}}
