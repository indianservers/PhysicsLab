export type RelationshipFamily = 'dynamics'|'work'|'kinetic'|'potential'|'power'|'oscillation'|'waves'|'light'|'fields';
export interface RelationshipConcept {id:string;label:string;x:number;y:number;family:RelationshipFamily;main?:boolean;tone:'cyan'|'blue'|'purple';prerequisite?:boolean;description:string;route:string}
export const relationshipConcepts:RelationshipConcept[]=[
 {id:'force',label:'Force',x:382,y:115,family:'dynamics',main:true,tone:'cyan',description:'The net force on a constant mass determines its acceleration in an inertial frame.',route:'/experiments/newton-s-second-law'},
 {id:'acceleration',label:'Acceleration',x:286,y:259,family:'dynamics',main:true,tone:'cyan',description:'Acceleration is the rate of change of velocity, with a direction set by the net force.',route:'/experiments/newton-s-second-law'},
 {id:'work',label:'Work',x:546,y:257,family:'work',main:true,tone:'blue',description:'Net work is the change in kinetic energy. Here the net force is constant and collinear with displacement.',route:'/experiments/work-power'},
 {id:'energy',label:'Energy',x:763,y:258,family:'work',main:true,tone:'purple',description:'Work transfers energy. The work–energy theorem relates net work to the change in kinetic energy.',route:'/experiments/conservation-of-energy'},
 {id:'oscillation',label:'Oscillation',x:188,y:453,family:'oscillation',main:true,tone:'cyan',description:'One complete cycle takes a period T. Frequency counts cycles per second: f = 1/T.',route:'/experiments/shm-spring'},
 {id:'waves',label:'Waves',x:405,y:451,family:'waves',main:true,tone:'blue',description:'A traveling wave advances one wavelength each period, so its speed is frequency times wavelength.',route:'/experiments/wave-lab'},
 {id:'fields',label:'Fields',x:608,y:456,family:'fields',main:true,tone:'cyan',description:'Fields describe physical quantities at every location. A long ideal solenoid has B = μ₀nI inside it.',route:'/experiments/magnetic-field-current'},
 {id:'light',label:'Light',x:770,y:459,family:'light',main:true,tone:'purple',description:'Light is an electromagnetic wave. In vacuum its frequency and wavelength satisfy c = fλ.',route:'/experiments/em-spectrum'},
 {id:'mass',label:'Mass',x:297,y:48,family:'dynamics',tone:'blue',prerequisite:true,description:'At fixed net force, a larger mass has a smaller acceleration.',route:'/experiments/mass-and-weight'},
 {id:'momentum',label:'Momentum',x:480,y:59,family:'dynamics',tone:'blue',description:'For a constant mass, net force is the rate of change of momentum: F = dp/dt = ma.',route:'/experiments/elastic-collision'},
 {id:'velocity',label:'Velocity',x:191,y:205,family:'dynamics',tone:'blue',prerequisite:true,description:'Velocity gives the rate and direction of change of position. Acceleration changes velocity.',route:'/experiments/uniform-motion'},
 {id:'motion',label:'Motion',x:196,y:316,family:'dynamics',tone:'blue',description:'Motion describes how position changes over time in a chosen reference frame.',route:'/experiments/uniform-motion'},
 {id:'displacement',label:'Displacement',x:585,y:162,family:'work',tone:'blue',prerequisite:true,description:'Only the component of force along displacement contributes to work.',route:'/experiments/work-power'},
 {id:'power',label:'Power',x:577,y:335,family:'power',tone:'purple',description:'Average power is work transferred divided by the elapsed time.',route:'/experiments/work-power'},
 {id:'kinetic',label:'Kinetic',x:838,y:156,family:'kinetic',tone:'purple',description:'Kinetic energy is proportional to mass and to the square of speed.',route:'/experiments/conservation-of-energy'},
 {id:'potential',label:'Potential',x:833,y:325,family:'potential',tone:'purple',description:'Near Earth, a rise in height increases gravitational potential energy by mgh relative to the chosen zero.',route:'/experiments/conservation-of-energy'},
 {id:'period',label:'Period',x:99,y:387,family:'oscillation',tone:'blue',prerequisite:true,description:'Period is the time for one cycle and is the reciprocal of frequency.',route:'/experiments/shm-spring'},
 {id:'frequency',label:'Frequency',x:105,y:514,family:'oscillation',tone:'blue',prerequisite:true,description:'Frequency is the number of completed cycles per second, measured in hertz.',route:'/experiments/wave-lab'},
 {id:'electromagnetic',label:'Electromagnetic',x:805,y:399,family:'light',tone:'purple',description:'Coupled electric and magnetic fields can propagate as electromagnetic waves.',route:'/experiments/em-spectrum'},
 {id:'radiation',label:'Radiation',x:829,y:523,family:'light',tone:'purple',description:'Electromagnetic radiation carries energy. Visible light is one part of its spectrum.',route:'/experiments/em-spectrum'},
];
export const relationshipById=new Map(relationshipConcepts.map(c=>[c.id,c]));
export const relationshipEdges:Array<{a:string;b:string;strength:number;kind?:'wave'}>=[
 {a:'force',b:'acceleration',strength:1},{a:'force',b:'mass',strength:.6},{a:'force',b:'momentum',strength:.6},
 {a:'acceleration',b:'velocity',strength:.6},{a:'acceleration',b:'motion',strength:.6},{a:'acceleration',b:'work',strength:.7},
 {a:'work',b:'displacement',strength:.6},{a:'work',b:'power',strength:.6},{a:'work',b:'energy',strength:1},
 {a:'energy',b:'kinetic',strength:.8},{a:'energy',b:'potential',strength:.7},
 {a:'oscillation',b:'period',strength:.7},{a:'oscillation',b:'frequency',strength:.7},{a:'oscillation',b:'waves',strength:.9,kind:'wave'},
 {a:'waves',b:'fields',strength:.6,kind:'wave'},{a:'fields',b:'light',strength:.9},{a:'light',b:'electromagnetic',strength:.8},{a:'light',b:'radiation',strength:.7},
];
export const RELATIONSHIP_DEFAULTS={force:10,mass:2,displacement:2,duration:2,speed:4,height:2,period:.5,frequency:2,wavelength:1,opticalFrequency:600,current:1};
export type RelationshipParameters=typeof RELATIONSHIP_DEFAULTS;
export function relationshipReadings(family:RelationshipFamily,p:RelationshipParameters) {
 const rows:Record<RelationshipFamily,Array<[string,string,number,string]>>={
  dynamics:[['Force','F',p.force,'N'],['Mass','m',p.mass,'kg'],['Acceleration','a',p.force/p.mass,'m/s²']],
  work:[['Net force','F',p.force,'N'],['Displacement','d',p.displacement,'m'],['Net work','W',p.force*p.displacement,'J']],
  kinetic:[['Mass','m',p.mass,'kg'],['Speed','v',p.speed,'m/s'],['Kinetic energy','K',.5*p.mass*p.speed**2,'J']],
  potential:[['Mass','m',p.mass,'kg'],['Height','h',p.height,'m'],['Potential energy','U',p.mass*9.81*p.height,'J']],
  power:[['Work','W',p.force*p.displacement,'J'],['Time','t',p.duration,'s'],['Average power','P',p.force*p.displacement/p.duration,'W']],
  oscillation:[['Period','T',p.period,'s'],['Frequency','f',1/p.period,'Hz'],['Angular frequency','ω',2*Math.PI/p.period,'rad/s']],
  waves:[['Frequency','f',p.frequency,'Hz'],['Wavelength','λ',p.wavelength,'m'],['Wave speed','v',p.frequency*p.wavelength,'m/s']],
  light:[['Frequency','f',p.opticalFrequency,'THz'],['Wavelength','λ',299792.458/p.opticalFrequency,'nm'],['Vacuum speed','c',299792458,'m/s']],
  fields:[['Current','I',p.current,'A'],['Turns / length','n',1000,'m⁻¹'],['Magnetic field','B',4*Math.PI*1e-7*1000*p.current*1000,'mT']],
 };
 return rows[family];
}
export const relationshipFormula:Record<RelationshipFamily,{equation:string;variables:Array<[string,string]>}>={
 dynamics:{equation:'F = m a',variables:[['F','Force (N)'],['m','Mass (kg)'],['a','Acceleration (m/s²)']]},
 work:{equation:'Wₙₑₜ = ΔK',variables:[['Wₙₑₜ','Net work (J)'],['ΔK','Kinetic energy change (J)'],['F d','Constant collinear net force × displacement']]},
 kinetic:{equation:'K = ½mv²',variables:[['K','Kinetic energy (J)'],['m','Mass (kg)'],['v','Speed (m/s)']]},
 potential:{equation:'U = m g h',variables:[['U','Potential energy (J)'],['g','9.81 m/s² near Earth'],['h','Height relative to zero (m)']]},
 power:{equation:'P = W / t',variables:[['P','Average power (W)'],['W','Work (J)'],['t','Elapsed time (s)']]},
 oscillation:{equation:'f = 1 / T',variables:[['f','Frequency (Hz)'],['T','Period (s)'],['ω','Angular frequency, 2πf (rad/s)']]},
 waves:{equation:'v = λ f',variables:[['v','Wave speed (m/s)'],['λ','Wavelength (m)'],['f','Frequency (Hz)']]},
 light:{equation:'c = λ f',variables:[['c','299,792,458 m/s in vacuum'],['λ','Wavelength (m)'],['f','Frequency (Hz)']]},
 fields:{equation:'B = μ₀ n I',variables:[['B','Field inside a long ideal solenoid (T)'],['n','Turns per unit length (m⁻¹)'],['I','Current (A); μ₀ ≈ 4π × 10⁻⁷ H/m']]},
};
