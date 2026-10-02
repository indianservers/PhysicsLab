export type GuidedTopic = 'measurement'|'mechanics'|'waves'|'thermo'|'em'|'quantum'|'astronomy';
export const guidedTopics: Array<{id:GuidedTopic;name:string;short:string;lab:string;route:string;description:string}> = [
 {id:'measurement',name:'Measurement',short:'Measurement',lab:'Length & Resolution',route:'measurement-errors',description:'Read length from a scale. Half the smallest division estimates the reading uncertainty for this ideal ruler.'},
 {id:'mechanics',name:'Classical Mechanics',short:'Mechanics',lab:'Free Fall (Classical Mechanics)',route:'free-fall',description:'Release a ball from rest. With no air resistance, all masses have the same downward acceleration.'},
 {id:'waves',name:'Waves & Optics',short:'Waves',lab:'Traveling Wave',route:'wave-lab',description:'A traveling wave moves one wavelength in one period. Change wavelength or frequency and compare the wave speed.'},
 {id:'thermo',name:'Thermodynamics',short:'Thermo',lab:'Heating Water',route:'heat-and-temperature',description:'An ideal heater transfers energy to water with no losses. More water warms more slowly at the same power.'},
 {id:'em',name:'Electromagnetism',short:'EM',lab:'Ideal Solenoid',route:'magnetic-field-current',description:'Inside a long air-core solenoid, the magnetic field is proportional to current. Reversing current reverses the field.'},
 {id:'quantum',name:'Quantum Physics',short:'Quantum',lab:'Electron Wavelength',route:'de-broglie-wavelength',description:'A moving electron has a de Broglie wavelength. This nonrelativistic model applies here because speed stays below 0.034c.'},
 {id:'astronomy',name:'Astronomy',short:'Astronomy',lab:'Circular Earth Orbit',route:'satellite-orbit',description:'In an ideal circular orbit, gravity provides centripetal acceleration. Higher orbits have lower speeds and longer periods.'},
];
export const GUIDED_DEFAULTS={mass:1,height:5,length:12,resolution:1,frequency:2,wavelength:1,power:250,current:1,electronSpeed:1,altitude:400};
export type GuidedParameters=typeof GUIDED_DEFAULTS;
export const guidedControls:Record<keyof GuidedParameters,{label:string;min:number;max:number;step:number;unit:string}>={
 mass:{label:'Mass',min:.1,max:5,step:.1,unit:'kg'},height:{label:'Release height',min:0,max:20,step:.1,unit:'m'},
 length:{label:'Object length',min:1,max:20,step:.1,unit:'cm'},resolution:{label:'Smallest division',min:1,max:5,step:1,unit:'mm'},
 frequency:{label:'Frequency',min:0,max:5,step:.1,unit:'Hz'},wavelength:{label:'Wavelength',min:.2,max:2,step:.1,unit:'m'},
 power:{label:'Heater power',min:0,max:500,step:10,unit:'W'},current:{label:'Coil current',min:-5,max:5,step:.1,unit:'A'},
 electronSpeed:{label:'Electron speed',min:.1,max:10,step:.1,unit:'× 10⁶ m/s'},altitude:{label:'Orbital altitude',min:200,max:3000,step:50,unit:'km'},
};
export const guidedParameterKeys:Record<GuidedTopic,Array<keyof GuidedParameters>>={measurement:['length','resolution'],mechanics:['mass','height'],waves:['frequency','wavelength'],thermo:['mass','power'],em:['current'],quantum:['electronSpeed'],astronomy:['altitude']};
export function guidedReadings(topic:GuidedTopic,p:GuidedParameters,time:number){
 const g=9.81,fallTime=Math.sqrt(2*p.height/g),t=Math.min(time,fallTime),velocity=g*t,remaining=Math.max(0,p.height-.5*g*t*t),mu=6.67430e-11*5.972e24,r=6371000+p.altitude*1000,orbitalSpeed=Math.sqrt(mu/r),period=2*Math.PI*r/orbitalSpeed;
 const rows:Record<GuidedTopic,Array<[string,number,string]>>={
  measurement:[['Length',p.length,'cm'],['Length',p.length/100,'m'],['Division',p.resolution,'mm'],['Uncertainty',p.resolution/2,'± mm'],['Relative uncertainty',p.resolution/(2*p.length*10)*100,'%']],
  mechanics:[['Mass',p.mass,'kg'],['Height',remaining,'m'],['Time',t,'s'],['Velocity',velocity,'m/s ↓'],['KE',.5*p.mass*velocity**2,'J']],
  waves:[['Frequency',p.frequency,'Hz'],['Wavelength',p.wavelength,'m'],['Time',time,'s'],['Wave speed',p.frequency*p.wavelength,'m/s'],['Amplitude',.1,'m']],
  thermo:[['Mass',p.mass,'kg'],['Power',p.power,'W'],['Time',time,'s'],['Temperature',20+p.power*time/(p.mass*4184),'°C'],['Heat',p.power*time,'J']],
  em:[['Current',p.current,'A'],['Turns / length',1000,'m⁻¹'],['Permeability',1.256637,'μH/m'],['Field',4*Math.PI*.1*p.current,'mT'],['Core',1,'relative μ']],
  quantum:[['Electron speed',p.electronSpeed,'10⁶ m/s'],['Electron mass',9.1093837139,'10⁻³¹ kg'],['Momentum',9.1093837139*p.electronSpeed,'10⁻²⁵ kg m/s'],['Wavelength',6.62607015e-34/(9.1093837139e-31*p.electronSpeed*1e6)*1e9,'nm'],['Speed / c',p.electronSpeed*1e6/299792458*100,'%']],
  astronomy:[['Altitude',p.altitude,'km'],['Radius',r/1000,'km'],['Time',time,'s'],['Orbital speed',orbitalSpeed/1000,'km/s'],['Period',period/60,'min']],
 };
 return {rows:rows[topic],fallTime,remaining,velocity,impactSpeed:Math.sqrt(2*g*p.height),period,orbitalSpeed,r};
}
export const guidedEquations:Record<GuidedTopic,string>={measurement:'δL ≈ division / 2',mechanics:'v = √(2gh)',waves:'v = λ f',thermo:'Q = m c ΔT',em:'B = μ₀ n I',quantum:'λ = h / mv',astronomy:'v = √(GM / r)'};
export const guidedConditions:Record<GuidedTopic,string>={measurement:'Ideal analogue reading; this estimate excludes calibration and systematic error.',mechanics:'g = 9.81 m/s²; released from rest; no drag. Downward velocity is positive.',waves:'y(x,t) = 0.10 sin[2π(x/λ − ft)] m. Positive x is rightward.',thermo:'Water starts at 20 °C; c = 4,184 J/(kg·K); constant power and no heat loss.',em:'n = 1,000 m⁻¹; μ₀ ≈ 4π × 10⁻⁷ H/m. Signed axial field inside an ideal long solenoid.',quantum:'h = 6.62607015 × 10⁻³⁴ J·s. The plot shows a spatial matter-wave schematic at t = 0, not an electron trajectory.',astronomy:'Earth mass 5.972 × 10²⁴ kg; radius 6,371 km; G = 6.67430 × 10⁻¹¹ SI. Circular orbit, no atmosphere.'};
export function guidedPathOrder(length:number,goal:string):GuidedTopic[]{
 const order:GuidedTopic[]=goal==='energy'?['measurement','mechanics','thermo','em','waves','quantum','astronomy']:goal==='motion'?['measurement','mechanics','waves','astronomy','thermo','em','quantum']:guidedTopics.map(t=>t.id);
 return order.slice(0,length-1);
}
