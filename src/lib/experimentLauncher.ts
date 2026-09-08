export type LauncherStudio='mechanics'|'optics'|'circuits'|'thermal'|'waves';
export type LauncherEquipment='standard'|'precision'|'white-light';
export const launcherStudios:Array<{id:LauncherStudio;label:string;route:string;equation:string;description:string}>=[
 {id:'mechanics',label:'Mechanics',route:'simple-pendulum',equation:'T = 2π √(L/g)',description:'A small-angle ideal pendulum converts potential and kinetic energy. Length changes its period; mass does not.'},
 {id:'optics',label:'Optics',route:'glass-slab-refraction',equation:'n₁ sin θ₁ = n₂ sin θ₂',description:'Trace refraction through a 60° glass prism. The selected laser remains monochromatic; the white-light kit combines seven wavelengths.'},
 {id:'circuits',label:'Circuits',route:'ohms-law',equation:'V = I R',description:'A resistor limits the current from an ideal voltage source. Reverse the voltage to reverse current.'},
 {id:'thermal',label:'Thermal',route:'heat-and-temperature',equation:'Q = m c ΔT',description:'An ideal heater transfers energy to water. With no losses, temperature change follows the supplied heat.'},
 {id:'waves',label:'Waves',route:'wave-lab',equation:'v = f λ',description:'A speaker creates a sinusoidal pressure wave. At fixed sound speed, higher frequency gives a shorter wavelength.'},
];
export const LAUNCHER_DEFAULTS={wavelength:532,incidence:30,index:1.52,beamWidth:1.3,length:1,amplitude:8,mass:1,voltage:6,resistance:100,power:250,frequency:440,pressure:1};
export type LauncherParameters=typeof LAUNCHER_DEFAULTS;
export const launcherControls:Record<keyof LauncherParameters,{label:string;min:number;max:number;step:number;unit:string}>={
 wavelength:{label:'Wavelength',min:380,max:750,step:1,unit:'nm'},incidence:{label:'Incident angle',min:0,max:75,step:.5,unit:'°'},index:{label:'Index at 532 nm',min:1.3,max:1.8,step:.01,unit:''},beamWidth:{label:'Beam radius',min:.3,max:3,step:.1,unit:'mm'},
 length:{label:'Pendulum length',min:.2,max:2,step:.05,unit:'m'},amplitude:{label:'Release angle',min:0,max:10,step:.5,unit:'°'},mass:{label:'Mass',min:.1,max:2,step:.1,unit:'kg'},
 voltage:{label:'Voltage',min:-12,max:12,step:.5,unit:'V'},resistance:{label:'Resistance',min:10,max:200,step:5,unit:'Ω'},power:{label:'Heater power',min:0,max:500,step:10,unit:'W'},frequency:{label:'Sound frequency',min:100,max:1000,step:10,unit:'Hz'},pressure:{label:'Pressure amplitude',min:0,max:2,step:.1,unit:'Pa'},
};
export const launcherParameterKeys:Record<LauncherStudio,Array<keyof LauncherParameters>>={optics:['wavelength','incidence','index','beamWidth'],mechanics:['length','amplitude','mass'],circuits:['voltage','resistance'],thermal:['power','mass'],waves:['frequency','pressure']};
const rad=Math.PI/180;
/** Educational Cauchy dispersion: B=0.004 µm², index specified at 532 nm. */
export function launcherIndex(wavelengthNm:number,indexAt532:number){return indexAt532+.004*(1/(wavelengthNm/1000)**2-1/.532**2)}
function fresnel(n1:number,n2:number,i:number,r:number){
 const a=n1*Math.cos(i),b=n2*Math.cos(r),c=n2*Math.cos(i),d=n1*Math.cos(r);
 return .5*(((a-b)/(a+b))**2+((c-d)/(c+d))**2);
}
/** Two air/glass boundaries; non-absorbing prism; secondary internal reflections omitted. */
export function launcherPrism(wavelength:number,incidence:number,indexAt532:number){
 const n=launcherIndex(wavelength,indexAt532),i=incidence*rad,r=Math.asin(Math.sin(i)/n),internalSecond=60*rad-r,sineExit=n*Math.sin(internalSecond),tir=Math.abs(sineExit)>1;
 const exit=tir?null:Math.asin(Math.max(-1,Math.min(1,sineExit))),deviation=exit===null?null:incidence+exit/rad-60;
 const transmission=exit===null?0:(1-fresnel(1,n,i,r))*(1-fresnel(n,1,internalSecond,exit));
 return {n,refraction:r/rad,internalSecond:internalSecond/rad,exit:exit===null?null:exit/rad,deviation,tir,transmission};
}
export function launcherRayGeometry(wavelength:number,incidence:number,indexAt532:number){
 const ray=launcherPrism(wavelength,incidence,indexAt532),entry={x:-.175,y:.35*Math.sqrt(3)/2},incoming=(30-incidence)*rad,inside=(30-ray.refraction)*rad,d={x:Math.cos(inside),y:Math.sin(inside)},edge={x:.5,y:Math.sqrt(3)/2};
 const distance=(-entry.x*edge.y+entry.y*edge.x)/(d.x*edge.y-d.y*edge.x),exit={x:entry.x+distance*d.x,y:entry.y+distance*d.y};
 const outgoing=(ray.exit===null?120-(30-ray.refraction):ray.exit-30)*rad;
 // Stop the first internally reflected segment at the next surface. Secondary
 // reflections/transmission are outside this direct-beam model.
 let travel=.55;
 if(ray.tir){
  const direction={x:Math.cos(outgoing),y:Math.sin(outgoing)},vertices=[{x:0,y:0},{x:-.5,y:Math.sqrt(3)/2},edge];
  const cross=(a:{x:number;y:number},b:{x:number;y:number})=>a.x*b.y-a.y*b.x;
  travel=Infinity;
  for(let j=0;j<3;j++){
   const a=vertices[j],b=vertices[(j+1)%3],segment={x:b.x-a.x,y:b.y-a.y},offset={x:a.x-exit.x,y:a.y-exit.y},denominator=cross(direction,segment);
   if(Math.abs(denominator)<1e-12)continue;
   const t=cross(offset,segment)/denominator,u=cross(offset,direction)/denominator;
   if(t>1e-8&&u>=-1e-8&&u<=1+1e-8)travel=Math.min(travel,t);
  }
 }
 return {...ray,entry,exit,start:{x:entry.x-.65*Math.cos(incoming),y:entry.y-.65*Math.sin(incoming)},end:{x:exit.x+travel*Math.cos(outgoing),y:exit.y+travel*Math.sin(outgoing)},incoming,inside,outgoing};
}
export function launcherColor(wavelength:number){
 const w=wavelength;let r=0,g=0,b=0;
 if(w<440){r=(440-w)/60;b=1}else if(w<490){g=(w-440)/50;b=1}else if(w<510){g=1;b=(510-w)/20}else if(w<580){r=(w-510)/70;g=1}else if(w<645){r=1;g=(645-w)/65}else r=1;
 return `rgb(${[r,g,b].map(v=>Math.round(Math.max(0,Math.min(1,v))*255)).join(',')})`;
}
export function launcherOpticalProfile(p:LauncherParameters,equipment:LauncherEquipment){
 const reference=launcherPrism(532,30,1.52).deviation!,wavelengths=equipment==='white-light'?[410,450,490,532,580,630,680]:[p.wavelength];
 return wavelengths.map(wavelength=>{const ray=launcherPrism(wavelength,p.incidence,p.index),offset=ray.deviation===null?null:100*Math.tan((ray.deviation-reference)*rad),width=equipment==='precision'?p.beamWidth/2:p.beamWidth;
  return {wavelength,color:launcherColor(wavelength),...ray,offset,width,points:Array.from({length:161},(_,i)=>{const x=-20+i*.25;return{x,y:offset===null?0:ray.transmission*Math.exp(-2*((x-offset)/width)**2)/wavelengths.length}})};
 });
}
export function launcherReadings(studio:LauncherStudio,p:LauncherParameters,time:number){
 const prism=launcherPrism(p.wavelength,p.incidence,p.index),omega=Math.sqrt(9.81/p.length),angle=p.amplitude*rad*Math.cos(omega*time),angularVelocity=-p.amplitude*rad*omega*Math.sin(omega*time),period=2*Math.PI/omega,current=p.voltage/p.resistance,temperature=20+p.power*Math.min(time,60)/(p.mass*4184);
 const rows:Record<LauncherStudio,Array<[string,string,number|null,string]>>={
  optics:[['Wavelength','λ',p.wavelength,'nm'],['Incident angle','θ₁',p.incidence,'°'],['Refracted angle','θ₂',prism.refraction,'°'],['Refractive index','n',prism.n,'']],
  mechanics:[['Length','L',p.length,'m'],['Displacement','θ',angle/rad,'°'],['Period','T',period,'s'],['Speed','v',Math.abs(p.length*angularVelocity),'m/s']],
  circuits:[['Voltage','V',p.voltage,'V'],['Resistance','R',p.resistance,'Ω'],['Current','I',current,'A'],['Power','P',p.voltage*current,'W']],
  thermal:[['Power','P',p.power,'W'],['Water mass','m',p.mass,'kg'],['Temperature','T',temperature,'°C'],['Heat supplied','Q',p.power*Math.min(time,60),'J']],
  waves:[['Frequency','f',p.frequency,'Hz'],['Sound speed','v',343,'m/s'],['Wavelength','λ',343/p.frequency,'m'],['Amplitude','p₀',p.pressure,'Pa']],
 };
 return {rows:rows[studio],prism,angle,angularVelocity,period,current,temperature};
}
export function launcherGraph(studio:LauncherStudio,p:LauncherParameters,time:number){
 const range=studio==='circuits'?12:studio==='thermal'?60:studio==='waves'?2:8;
 return Array.from({length:161},(_,i)=>{const x=range*i/160+(studio==='mechanics'?Math.max(0,time-8):0);return{x:studio==='circuits'?x*2-12:x,y:studio==='mechanics'?p.amplitude*Math.cos(Math.sqrt(9.81/p.length)*x):studio==='thermal'?20+p.power*x/(p.mass*4184):studio==='circuits'?(x*2-12)/p.resistance:p.pressure*Math.sin(2*Math.PI*(p.frequency/343*x-p.frequency*time))}});
}
