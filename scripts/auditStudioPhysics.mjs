import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Execute the actual TypeScript models, including their production dependencies.
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'physics-studio-audit-'));
const compiled = new Map();
function compile(file) {
  file = path.resolve(file);
  if (compiled.has(file)) return compiled.get(file);
  const target = path.join(temporaryRoot, `${compiled.size}.mjs`);
  compiled.set(file, target);
  let source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  source = source.replace(/(from\s*|import\s*)['"](\.[^'"]+)['"]/g, (match, prefix, specifier) => {
    const base = path.resolve(path.dirname(file), specifier);
    const dependency = [base, `${base}.ts`, `${base}.js`, path.join(base, 'index.ts')].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!dependency) throw Error(`Cannot resolve ${specifier} from ${file}`);
    return `${prefix}${JSON.stringify(pathToFileURL(compile(dependency)).href)}`;
  });
  fs.writeFileSync(target, source);
  return target;
}
const modules = new Map();
async function model(name) {
  if (!modules.has(name)) modules.set(name, await import(pathToFileURL(compile(`src/lib/${name}.ts`)).href));
  return modules.get(name);
}
const report = [];
let assertions = 0;
const near = (actual, expected, tolerance = 1e-8) => {
  assertions++;
  assert.ok(Number.isFinite(actual), `nonfinite result: ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(Math.abs(expected), 1e-6), `expected ${expected}, received ${actual}`);
};
const ok = (value, message) => { assertions++; assert.ok(value, message); };
async function check(route, name, run) {
  const start = assertions;
  try { await run(await model(name)); report.push({ route, model: name, status: 'pass', assertions: assertions - start }); }
  catch (error) { report.push({ route, model: name, status: 'fail', assertions: assertions - start, error: error.message }); console.error(`FAIL ${route}: ${error.message}`); }
}

try {
await check('/measurement/meter-scale','meterScale',m=>{const s=m.meterScaleState(m.METER_DEFAULTS);near(s.measured,4);near(m.meterScaleState({...m.METER_DEFAULTS,angle:30,bothEnds:true}).geometricLengthError,0);});
await check('/measurement/vernier-caliper','vernierCaliper',m=>{const s=m.vernierState({...m.VERNIER_DEFAULTS,jaw:18.46,diameter:18.46,zeroError:.12});near(s.raw,18.58);near(s.corrected,18.46);});
await check('/measurement/micrometer','micrometer',m=>{const s=m.micrometerState({...m.MICROMETER_DEFAULTS,wire:.5,turns:1,correction:-.03});near(s.raw,.53);near(s.corrected,.5);});
await check('/measurement/spherometer','spherometer',m=>{near(m.spherometerState({height:1,legRadius:30,surface:'convex'}).radius,450.5);ok(m.spherometerState({...m.SPHEROMETER_DEFAULTS,height:0}).flat);near(m.spherometerProfile(m.SPHEROMETER_DEFAULTS,30),0);});
await check('/measurement/mass-time','massTime',m=>{near(m.balanceReading(250,20),230);const t=m.massTimeTrial(m.MASS_TIME_DEFAULTS,0);ok(t.elapsed>0);near(m.massTimePosition(m.MASS_TIME_DEFAULTS,1),1.232);});
await check('/measurement/uncertainty','uncertaintyAnalysis',m=>{const s=m.uncertaintyStatistics([{value:1},{value:2},{value:3}],.5);near(s.mean,2);near(s.std,1);near(s.sem,1/Math.sqrt(3));near(s.uB,.5/Math.sqrt(3));ok(m.formatUncertainty(66.4,.3).includes('±'));});
await check('/mechanics/free-body-diagrams','freeBody',m=>{const s=m.solveFreeBody({force:0,angle:0,mu:.5,mass:2});near(s.ax,0);near(s.normal,2*m.FREE_BODY_G);near(m.solveFreeBody({force:100,angle:90,mu:.5,mass:2}).normal,0);});
await check('/mechanics/inclined-plane','inclineStudio',m=>{near(m.solveIncline({angle:30,mass:2,mu:0}).acceleration,4.905);near(m.solveIncline({angle:0,mass:2,mu:.3}).acceleration,0);});
await check('/mechanics/pulley-systems','atwood',m=>{const s=m.solveAtwood(m.ATWOOD_DEFAULTS);near(s.acceleration,4.905/6.5);near(s.tensionB-s.tensionA,m.ATWOOD_DEFAULTS.inertia*s.acceleration/m.ATWOOD_RADIUS**2);const end=m.stepAtwood(m.ATWOOD_DEFAULTS,m.ATWOOD_REST,2);near(m.solveAtwood(m.ATWOOD_DEFAULTS,end).totalEnergy,0,1e-2);});
await check('/mechanics/torque-levers','lever',m=>{const s=m.solveLever({...m.LEVER_DEFAULTS,effort:10*.3/.45});near(s.net,0);near(s.required,10*.3/.45);});
await check('/mechanics/equilibrium-com','centreOfMass',m=>{const s=m.solveCom(m.COM_DEFAULTS);near(s.mass,s.bodies.reduce((a,b)=>a+b.mass,0));near(s.minimumFriction,0);ok(s.status==='Stable');});
await check('/mechanics/momentum-collisions','momentumCollision',m=>{const trial=m.collisionTrial({...m.MOMENTUM_DEFAULTS,e:1});const first=m.collisionState(trial,0),last=m.collisionState(trial,1);near(first.momentum,last.momentum);near(first.kinetic,last.kinetic);});
await check('/motion/position-time','positionTime',m=>{const s=m.positionState(m.POSITION_DEFAULTS,2);near(s.v,.24);near(s.displacement,.24);});
await check('/motion/velocity-time','velocityTime',m=>{const i={v0:1,acceleration:-1,duration:2};near(m.velocityState(i,2).displacement,0);near(m.velocityAreas(i,2).reduce((sum,a)=>sum+Math.abs(a.area),0),1);});
await check('/motion/acceleration-time','accelerationTime',m=>{near(m.accelerationState(m.ACCELERATION_DEFAULTS,3).v,1);const samples=m.accelerationSensorSamples(m.ACCELERATION_DEFAULTS);near(samples.reduce((sum,s)=>sum+s.a/500,0),1);});
await check('/motion/projectile-motion','projectileStudio',m=>{const i={speed:20,angle:45,gravity:9.81},s=m.projectileStudioFlight(i);near(s.rangeM,400/9.81);near(m.projectileStudioState(i,s.timeS).y,0);near(m.projectileStudioState(i,s.peakTime).vy,0);});
await check('/motion/relative-motion','relativeMotion',m=>{const s=m.relativeMotionSolution({boat:5,current:2,heading:0});near(s.crossingTime,60);near(s.drift,120);near(m.noDriftHeading(5,3),-36.86989764584402);ok(m.noDriftHeading(3,3)===null);});
await check('/motion/circular-motion','circularStudio',m=>{const s=m.circularStudioState(m.CIRCULAR_STUDIO_DEFAULTS,.2);near(Math.hypot(s.force.x,s.force.y),.45);near(s.velocity.x*s.acceleration.x+s.velocity.y*s.acceleration.y,0,1);});
await check('/motion/first-law-inertia','inertiaStudio',m=>{const s=m.inertiaSolution(m.INERTIA_DEFAULTS);near(s.stopTime,8);near(s.stopDistance,3.2);near(m.inertiaSolution({...m.INERTIA_DEFAULTS,mass:.4}).stopTime,16);near(m.inertiaSolution({...m.INERTIA_DEFAULTS,drag:0}).velocityAt(100),.8);});
await check('/motion/second-law-fma','../experiments/newton-s-second-law/newton-s-second-lawSimulation',m=>{near(m.newtonState({massKg:.5,appliedForceN:2.4,frictionN:.05,samplingIntervalS:.25}).accelerationMps2,4.7);near(m.newtonState({massKg:1,appliedForceN:.2,frictionN:.3}).accelerationMps2,0);});
await check('/motion/third-law-pairs','thirdLawStudio',m=>{const i=m.THIRD_LAW_DEFAULTS,s=m.thirdLawSolution(i,.1),next=m.thirdLawSolution(i,.2);near(s.impulseA+s.impulseB,0);near(i.massA*s.velocityA+i.massB*s.velocityB,0);near(next.positionA-s.positionA,s.velocityA*.1);near(m.thirdLawSolution(i,0).impulseA,0);});
await check('/motion/friction','frictionStudio',m=>{near(m.frictionStudioSolution({normal:10,pull:4,surface:'wood'}).net,0);near(m.frictionStudioSolution({normal:10,pull:6,surface:'wood'}).net,2.4);});
await check('/motion/tension-normal','tensionStudio',m=>{const s=m.tensionSolution({angleA:45,angleB:45,mass:10});near(s.ta,98.1/Math.SQRT2);near((s.ta+s.tb)/Math.SQRT2,s.weight);near(s.normal,0);});
await check('/motion/multi-force-challenge','multiForceStudio',m=>{near(m.multiSolution({tension:300,wind:300,angle:0}).net,0);near(m.multiSolution({tension:0,wind:0,angle:0}).acceleration,0);ok(m.multiSolution({tension:0,wind:300,angle:0}).acceleration<0);});
await check('/motion/work','workStudio',m=>{near(m.workSolution({force:40,angle:60,distance:3}).work,60);ok(Math.abs(m.workSolution({force:100,angle:90,distance:5}).work)<1e-10);});
await check('/motion/kinetic-energy','kineticStudio',m=>{near(m.kineticSolution({mass:.5,speed:2}).energy,1);near(m.kineticSolution({mass:.5,speed:4}).energy,4);});
await check('/motion/potential-energy','potentialStudio',m=>near(m.potentialSolution(m.POTENTIAL_DEFAULTS).energy,29430));
await check('/motion/conservation-energy','conservationStudio',m=>{const first=m.conservationSolution(m.CONSERVATION_DEFAULTS);near(first.ke,0);const s=m.conservationSolution({...m.CONSERVATION_DEFAULTS,position:125});near(s.pe+s.ke+s.loss,first.total);near(m.conservationSolution({...m.CONSERVATION_DEFAULTS,height:40}).total/first.total,1.25);});
await check('/motion/power','powerStudio',m=>{const s=m.powerSolution({...m.POWER_DEFAULTS,time:2});near(s.work,49.05);near(s.power,24.525);});
await check('/motion/efficiency','efficiencyStudio',m=>{const s=m.efficiencySolution(m.EFFICIENCY_DEFAULTS);near(s.pin,s.pout+s.loss);near(s.efficiency,90);ok(m.efficiencySolution({...m.EFFICIENCY_DEFAULTS,load:0}).efficiency===null);});
await check('/motion/universal-gravity','gravityStudio',m=>{const s=m.gravitySolution(m.GRAVITY_DEFAULTS);near(s.force,6.6743e-11*5/.09);near(s.torque,0);near(s.force/m.gravitySolution({...m.GRAVITY_DEFAULTS,r:.6}).force,4);});
await check('/motion/gravitational-field','fieldStudio',m=>{const s=m.fieldSolution(m.FIELD_DEFAULTS);near(s.g,-s.phi/m.FIELD_DEFAULTS.radius);});
await check('/motion/gravitational-potential','potentialGravityStudio',m=>{const a=m.potentialSolution({...m.POTENTIAL_DEFAULTS,angle:0}),b=m.potentialSolution({...m.POTENTIAL_DEFAULTS,angle:180});ok(a.V<b.V);ok(a.moonDistance<b.moonDistance);const h=1,s=m.potentialSolution(m.POTENTIAL_DEFAULTS),u=m.potentialSolution({...m.POTENTIAL_DEFAULTS,radius:m.POTENTIAL_DEFAULTS.radius+h}),l=m.potentialSolution({...m.POTENTIAL_DEFAULTS,radius:m.POTENTIAL_DEFAULTS.radius-h}),angle=m.POTENTIAL_DEFAULTS.angle*Math.PI/180;near((u.V-l.V)/(2*h),-(s.gx*Math.cos(angle)+s.gy*Math.sin(angle)),1e-7);});
await check('/motion/orbits','orbitStudio',m=>{const i={...m.ORBIT_DEFAULTS,speed:Math.sqrt(6.6743e-11*m.ORBIT_DEFAULTS.mass/(6371e3+650e3))/1000},s=m.orbitSolution(i);near(s.e,0,1);near(s.period,2*Math.PI*Math.sqrt((7021e3)**3/(6.6743e-11*i.mass))/3600);const fast=m.orbitSolution({mass:1e23,altitude:10000,speed:12});ok(!fast.bound&&fast.period===null&&fast.e>1);});
await check('/motion/escape-velocity','escapeStudio',m=>{const s=m.escapeSolution(m.ESCAPE_DEFAULTS);near(s.ve,Math.sqrt(2*6.674e-11*5.97e24/6371e3)/1000);ok(s.ve>11&&s.ve<11.3);});
await check('/motion/keplers-laws','keplerStudio',m=>{const s=m.keplerSolution(m.KEPLER_DEFAULTS),circle=m.keplerSolution({...m.KEPLER_DEFAULTS,e:0});near(s.T,365.25);near(s.area/circle.area,Math.sqrt(1-.3**2));near(m.keplerSolution({...m.KEPLER_DEFAULTS,a:2}).T/s.T,Math.sqrt(8));});
await check('/motion/spring-shm','springStudio',m=>{const i={...m.SPRING_DEFAULTS,time:.1},s=m.springSolution(i);near(.5*i.m*s.vel**2+.5*i.k*s.x**2,s.energy);near(s.acc,-i.k*s.x/i.m);});
await check('/motion/pendulum','pendulumStudio',m=>{const s=m.pendulumSolution({...m.PENDULUM_DEFAULTS,angle:60});ok(s.finiteT>s.T*1.07&&s.finiteT<s.T*1.08);});
await check('/motion/energy-exchange','energyExchangeStudio',m=>{const s=m.energySolution({...m.ENERGY_DEFAULTS,time:2,damping:.5});near(s.total+s.lost,s.initial);near(m.energySolution({...m.ENERGY_DEFAULTS,damping:.5}).vel,0);});
await check('/motion/damping','dampingStudio',m=>{ok(m.dampingSolution({...m.DAMPING_DEFAULTS,m:.05,b:2*Math.sqrt(50*.05)}).regime==='Critical');const s=m.dampingSolution({...m.DAMPING_DEFAULTS,time:2});ok(s.total<s.initial);});
await check('/motion/resonance','resonanceStudio',m=>{const s=m.resonanceMotion(m.RESONANCE_DEFAULTS,0,true);near(s.x,0);near(s.vel,0);near(s.acc,m.RESONANCE_DEFAULTS.drive/m.RESONANCE_DEFAULTS.mass);});
await check('/motion/coupled-oscillators','coupledStudio',m=>{const s=m.coupledSolution(m.COUPLED_DEFAULTS);near(m.coupledSolution({...m.COUPLED_DEFAULTS,time:10}).energy,s.energy);});
await check('/motion/wave-properties','wavePropertiesStudio',m=>{const s=m.waveSolution(m.WAVE_DEFAULTS);near(s.lambda,.4);near(s.particleAcceleration,m.WAVE_DEFAULTS.speed**2*s.spatialSecondDerivative);});
await check('/motion/superposition','superpositionStudio',m=>{const s=m.superSolution(m.SUPER_DEFAULTS);near(s.y,s.ya+s.yb);near(s.lambdaA,1);});
await check('/motion/interference','interferenceStudio',m=>{near(m.interferenceSolution({...m.INTERFERENCE_DEFAULTS,probe:.1}).I,1);near(m.interferenceSolution({...m.INTERFERENCE_DEFAULTS,probe:.1,phase:Math.PI}).I,0,1);});
await check('/motion/standing-waves','standingStudio',m=>{const s=m.standingSolution(m.STANDING_DEFAULTS);near(s.freq,106.06601717798213);near(m.standingAt(m.STANDING_DEFAULTS,0).displacement,0);near(m.standingAt(m.STANDING_DEFAULTS,1).displacement,0,1);near(m.standingSolution({...m.STANDING_DEFAULTS,time:.1}).energy,s.energy);});
await check('/motion/sound-spectrum','spectrumStudio',m=>{near(m.spectrumSolution(m.SPECTRUM_DEFAULTS).level,74.2);const samples=m.spectrumSamples({...m.SPECTRUM_DEFAULTS,frequency:1500},0,8192);const fft=m.spectrumFFT(samples);const peak=fft.reduce((a,b)=>a.amplitude>b.amplitude?a:b);near(peak.frequency,1500);});
await check('/motion/doppler-effect','dopplerStudio',m=>{const s=m.dopplerSolution(m.DOPPLER_DEFAULTS);near(s.app,800*343/313);near(s.rec,800*343/373);});
await check('/optics/reflection','reflectionStudio',m=>{const s=m.reflectionSolution(m.REFLECTION_DEFAULTS);near(s.incident,s.reflected);near(Math.hypot(s.outgoing.x,s.outgoing.z),1);});
await check('/optics/refraction','refractionStudio',m=>{const s=m.refractInterface({x:.5,y:0,z:Math.sqrt(.75)},{x:0,y:0,z:-1},1,1.5);near(s.refracted,19.47122063449069);near(s.reflectance+s.transmittance,1);ok(m.refractInterface({x:Math.sin(Math.PI/3),y:0,z:.5},{x:0,y:0,z:-1},1.5,1).tir);});
await check('/optics/lenses','lensStudio',m=>{const s=m.lensSolution(m.LENS_DEFAULTS);near(s.di,20);near(s.m,-1);ok(m.lensSolution({...m.LENS_DEFAULTS,object:10}).atInfinity);});
await check('/optics/mirrors','mirrorStudio',m=>{const s=m.mirrorSolution(m.MIRROR_DEFAULTS);near(s.di,60);near(s.m,-2);ok(m.mirrorSolution({...m.MIRROR_DEFAULTS,type:'convex'}).kind==='virtual');});
await check('/optics/interference','opticsInterferenceStudio',m=>{const s=m.opticsInterSolution(m.OPTICS_INTER_DEFAULTS);near(s.spacing,2.1666666666666665);near(s.I,1);const q=m.opticalQuadrature(32);near(q.reduce((sum,n)=>sum+n.w,0),2);near(q.reduce((sum,n)=>sum+n.w*n.x*n.x,0),2/3);});
await check('/optics/diffraction','diffractionStudio',m=>{const s=m.diffractionSolution(m.DIFF_DEFAULTS,257);near(s.dy,6.32);near(s.I,1);near(m.diffractionFarField({a:100e-6,lambda:632e-9,L:.5,aperture:'slit'},.5*Math.tan(Math.asin(632e-9/100e-6))),0,1);});
await check('/electricity/coulomb-force','coulombStudio',m=>{const s=m.coulombSolution(m.COULOMB_DEFAULTS);near(s.mag,2.4972222222222222);near(s.forceA+s.forceB,0);});
await check('/electricity/electric-field','electricFieldStudio',m=>{const s=m.electricFieldSolution({...m.ELECTRIC_FIELD_DEFAULTS,q2:5,px:0,py:0});near(s.mag,0);});
await check('/electricity/electric-potential','electricPotentialStudio',m=>{const a=m.potentialSolution(m.POTENTIAL_DEFAULTS),b=m.potentialSolution({...m.POTENTIAL_DEFAULTS,reference:1});near(a.gradient,b.gradient);near(a.energy,a.V*1e-6);});
await check('/electricity/current','currentStudio',m=>{const s=m.currentSolution(m.CURRENT_DEFAULTS);near(s.power,s.I*s.I*s.R);near(s.J,8.5e28*1.602176634e-19*s.vd);});
await check('/electricity/circuits','circuitsStudio',m=>{const s=m.circuitSolution(m.CIRCUIT_DEFAULTS);near(s.power,s.pR1+s.pR2+s.pL1+s.pL2);near(s.vR1+s.vL1,s.voltage);near(m.circuitSolution({...m.CIRCUIT_DEFAULTS,closed:false}).total,0);});
await check('/electricity/capacitors','capacitorStudio',m=>{const s=m.capSolution(m.CAP_DEFAULTS),t=m.capSolution(m.CAP_DEFAULTS,s.tau);near(t.fraction,1-Math.exp(-1));near(t.sourceWork,t.energy+t.resistorHeat);near(s.charge,s.C*5);});
await check('/magnetism/field-lines','magneticFieldStudio',m=>{const s=m.magneticSolution(m.MAGNETIC_DEFAULTS??m.MAG_DEFAULTS);near(s.B,4e-7*.5/(.045**3));});
await check('/magnetism/lorentz-force','lorentzStudio',m=>{const s=m.lorentzState(m.LORENTZ_DEFAULTS,1e-7);near(Math.hypot(s.vx,s.vz),5e6);near(s.fx*s.vx+s.fz*s.vz,0,1);});
await check('/magnetism/current-wire','currentWireStudio',m=>{const s=m.wireSolution(m.WIRE_DEFAULTS);near(s.B,12e-6);near(s.circulation,4*Math.PI*1e-7*3);});
await check('/magnetism/solenoids','solenoidStudio',m=>{const i={turns:800,current:1.5,mu:1},s=m.solenoidSolution(i);near(s.B,4*Math.PI*1e-7*800*1.5/.16*(.08/Math.hypot(.08,.025)));near(m.solenoidSolution({...i,current:0}).B,0);});
await check('/magnetism/induction','inductionStudio',m=>{const s=m.inductionSample(m.INDUC_DEFAULTS,.12);near(s.force*s.velocity+s.power,0,1);near(m.inductionSample(m.INDUC_DEFAULTS,.12,0).emf,0);});
await check('/magnetism/electromagnets','electromagnetStudio',m=>{const s=m.emSolution(m.EM_DEFAULTS);near(s.H*m.EM_CORE_LENGTH+s.B*s.g/m.EM_MU0,1600);near(s.energy+s.coenergy,s.current*s.linkage);near(m.emSolution({...m.EM_DEFAULTS,current:0}).force,0);});
await check('/electronics/semiconductors','semiconductorStudio',m=>{const s=m.semiSolution(m.SEMI_DEFAULTS);ok(Math.abs(s.residual)/Math.max(s.nSI,s.pSI)<1e-10);near(s.sigma,1.602176634e-19*(s.nSI*s.muN+s.pSI*s.muP));});
await check('/electronics/diodes','diodeStudio',m=>{for(const kind of ['pn','zener','led','schottky']){const s=m.diodeSolution({...m.DIODE_DEFAULTS,kind,voltage:5});ok(Math.abs(s.kvl)<1e-10);ok(Math.abs(s.powerBalance)<1e-10);}});
await check('/electronics/transistors','transistorStudio',m=>{for(const fixture of ['controlled','loadline']){const s=m.transSolution({...m.TRANS_DEFAULTS,fixture});ok(Math.abs(s.kcl)<1e-10);ok(Math.abs(s.powerBalance)<1e-10);}});
await check('/electronics/amplifiers','amplifierStudio',m=>{const setup=m.ampSetup(m.AMP_DEFAULTS);for(const phase of [0,.25,.5,.75]){const s=m.ampPoint(setup,phase);ok(Math.abs(s.powerBalance)<1e-8);ok(Math.abs(s.baseResidual)<1e-8);}});
await check('/electronics/logic-gates','logicGateStudio',m=>{for(const a of [false,true])for(const b of [false,true])ok(m.logicSolution({a,b,gate:'complex'}).y===(!a||b));});
await check('/electronics/sensors','sensorStudio',m=>{near(m.sensorSolution({stimulus:0,rate:10,type:-1}).voltage,5*m.sensorSolution({stimulus:0,rate:10,type:-1}).resistance/(m.sensorSolution({stimulus:0,rate:10,type:-1}).resistance+4180));ok(m.sensorSolution({stimulus:100,rate:10,type:-1}).resistance<m.sensorSolution({stimulus:0,rate:10,type:-1}).resistance);});
await check('/thermodynamics/temperature','temperatureStudio',m=>{near(m.tempSolution(m.TEMP_DEFAULTS).eq,400);near(m.tempSolution(m.TEMP_DEFAULTS).ka,1.5*1.380649e-23*600);});
await check('/thermodynamics/heat-transfer','heatTransferStudio',m=>{const s=m.heatSolution(m.HEAT_DEFAULTS);near(s.flux,189600);near(s.rate,948);near(s.energy,56880);});
await check('/thermodynamics/gas-laws','gasLawsStudio',m=>{const s=m.gasSolution(m.GAS_DEFAULTS);near(s.P,102.306);near(s.P*s.V,.04*8.31446261815324*298);near(m.gasSolution({...m.GAS_DEFAULTS,load:0}).P,101.325);});
await check('/thermodynamics/first-law','firstLawStudio',m=>{for(const process of ['isobaric','isochoric','isothermal','adiabatic']){const s=m.firstSolution({...m.FIRST_DEFAULTS,process});near(s.dU,s.Q-s.W);near(s.pressure*s.V,2*8.31446261815324*s.T);ok(s.T>0&&s.V>0);if(process==='adiabatic')near(s.Q,0);if(process==='isothermal')near(s.dU,0);}near(m.firstSolution(m.FIRST_DEFAULTS).W,.8);});
await check('/thermodynamics/entropy','entropyStudio',m=>{near(m.entropySolution({...m.ENTROPY_DEFAULTS,deltaT:0,mixed:true}).S,500*1.380649e-23*Math.LN2);ok(m.entropySolution({...m.ENTROPY_DEFAULTS,mixed:true}).S>0);});
await check('/thermodynamics/heat-engines','heatEngineStudio',m=>{const s=m.engineSolution(m.ENGINE_DEFAULTS);near(s.eta,.5);near(s.work,s.qh-s.qc);near(s.qh/600,s.qc/300);ok(!m.engineSolution({hot:300,cold:600,ratio:8}).valid);});
await check('/fluid-mechanics/density-pressure','densityPressureStudio',m=>near(m.densitySolution(m.DENSITY_DEFAULTS).pressure,2.943));
await check('/fluid-mechanics/hydrostatics','densityPressureStudio',m=>near(m.densitySolution({fluid:'glycerin',depth:.5,g:9.81}).pressure,6.1803));
await check('/fluid-mechanics/buoyancy','buoyancyStudio',m=>{const s=m.buoyancySolution(m.BUOYANCY_DEFAULTS);near(s.fb,.5886);near(s.weight,3.17844);near(m.buoyancySolution({density:1000,fraction:1,fluid:'water'}).apparent,0);});
await check('/fluid-mechanics/continuity','continuityStudio',m=>{const s=m.continuitySolution(m.CONTINUITY_DEFAULTS);near(s.v1,.64);near(s.v2,2.1333333333333333);near(s.mass,2.56);});
await check('/fluid-mechanics/bernoulli','bernoulliStudio',m=>{const s=m.bernoulliSolution(m.BERNOULLI_DEFAULTS);near(s.p3,s.p1);near(s.p1*1000+.5*998*s.v1**2,s.p2*1000+.5*998*s.v2**2);});
await check('/fluid-mechanics/viscosity','viscosityStudio',m=>{const s=m.viscositySolution(m.VISCOSITY_DEFAULTS);near(s.drag,4/3*Math.PI*.005**3*190*9.81);ok(s.re<1);});
await check('/modern-physics/quantum-ideas','quantumIdeasStudio',m=>{const s=m.quantumSolution(m.QUANTUM_DEFAULTS);near(s.spread,120);near(s.spread*1e-9*s.deltaP,1.054571817e-34/2);near(m.quantumSolution({...m.QUANTUM_DEFAULTS,measurement:1}).visibility,0);});
await check('/modern-physics/photoelectric-effect','photoelectricStudio',m=>{near(m.photoSolution(m.PHOTO_DEFAULTS).k,1.0288);near(m.photoSolution({...m.PHOTO_DEFAULTS,freq:4}).current,0);near(m.photoSolution({...m.PHOTO_DEFAULTS,intensity:0}).current,0);});
await check('/modern-physics/matter-waves','matterWavesStudio',m=>{const s=m.matterSolution(m.MATTER_DEFAULTS);near(s.lambda,.0037014366,1e-7);near(s.radius,30*Math.tan(2*s.angle*Math.PI/180));});
await check('/modern-physics/atomic-spectra','atomicSpectraStudio',m=>{const s=m.spectraSolution(m.SPECTRA_DEFAULTS);ok(s.lambda>485&&s.lambda<487);near(m.spectraSolution({...m.SPECTRA_DEFAULTS,element:'helium'}).lambda,s.lambda/4);ok(m.spectraSolution({element:'hydrogen',ni:6,nf:5}).series==='Pfund');});
await check('/modern-physics/nuclear-structure','nuclearStructureStudio',m=>{const s=m.nuclearSolution(m.NUCLEAR_DEFAULTS);ok(s.per>8&&s.per<10);ok(s.stable===null);near(s.massDefect,s.be/931.5);});
await check('/modern-physics/radioactivity','radioactivityStudio',m=>{const zero=m.radioSolution({...m.RADIO_DEFAULTS,time:0,thickness:0}),half=m.radioSolution({...m.RADIO_DEFAULTS,time:5.27,thickness:0});near(half.n,zero.n/2);near(half.count,zero.count/2);ok(m.radioSolution({...m.RADIO_DEFAULTS,time:0,thickness:10,shield:'lead'}).count<m.radioSolution({...m.RADIO_DEFAULTS,time:0,thickness:10,shield:'paper'}).count);});
await check('/astrophysics/solar-system','solarSystemStudio',m=>{near(m.solarSolution({...m.SOLAR_DEFAULTS,time:365.25/4}).angle,Math.PI/2);});
await check('/astrophysics/stellar-life','stellarLifeStudio',m=>{const s=m.stellarSolution({...m.STELLAR_DEFAULTS,mass:2});near(s.lum,Math.sqrt(128));near(s.life,1e10/Math.sqrt(32));});
await check('/astrophysics/spectroscopy','spectroscopyStudio',m=>{const s=m.spectroSolution(m.SPECTRO_DEFAULTS);ok(s.name.includes('Alpha'));near(m.spectroSolution({...m.SPECTRO_DEFAULTS,redshift:0}).velocity,0);});
await check('/astrophysics/galaxies','galaxiesStudio',m=>{const s=m.galaxySolution(m.GALAXY_DEFAULTS);near(s.speed*s.speed*m.GALAXY_DEFAULTS.radius/4.30091e-6,s.mass);ok(s.mass>m.galaxySolution({...m.GALAXY_DEFAULTS,halo:'None'}).mass);});
await check('/astrophysics/cosmology','cosmologyStudio',m=>{const s=m.cosmoSolution(m.COSMO_DEFAULTS);ok(s.age>13.4&&s.age<13.6);near(s.dist,s.distanceMpc*.003261563777);near(s.velocity,70*s.distanceMpc);const present=m.cosmoSolution({...m.COSMO_DEFAULTS,epoch:13.8e9});near(present.z,0);near(present.dist,0);ok(m.cosmoSolution({...m.COSMO_DEFAULTS,omega:1}).age<s.age);});
await check('/astrophysics/exoplanets','exoplanetsStudio',m=>{const central=m.exoSolution({radius:1,period:30,inclination:90}),miss=m.exoSolution({radius:1,period:30,inclination:80});near(central.depth,(6371/695700)**2);near(miss.depth,0);near(m.exoSolution({radius:2,period:30,inclination:90}).depth,4*central.depth);ok(m.exoSolution({radius:1,period:100,inclination:90}).temp<central.temp);});

const { referenceLabsByStudio } = await model('studioReferenceLabs');
const theory = JSON.parse(fs.readFileSync('src/lib/studioTheoryContent.json', 'utf8'));
const all = Object.entries(referenceLabsByStudio).flatMap(([studio,labs]) => labs.map(lab=>({...lab,studio})));
assert.equal(all.length,96);
assert.equal(new Set(report.map(item=>item.route)).size,96);
for (const lab of all) {
  assert.ok(report.some(item=>item.route===lab.route),`No numeric test for ${lab.route}`);
  const chapter=theory[lab.route];
  assert.ok(chapter&&chapter.studio===lab.studio,`Missing theory ${lab.route}`);
  for(const key of ['core','equation','symbols','assumptions','misconception','investigation','question','answer','extension']) assert.ok(chapter[key]?.length>=(key==='equation'?5:15),`Empty ${key} for ${lab.route}`);
  assert.ok(chapter.derivation.length>=3&&chapter.example.length>=3,`Incomplete reasoning ${lab.route}`);
}
const failed=report.filter(item=>item.status==='fail');
fs.mkdirSync('artifacts/studio-physics-audit',{recursive:true});
fs.writeFileSync('artifacts/studio-physics-audit/results.json',JSON.stringify({scope:'96 studio lab routes',assertions,chapters:all.length,passed:96-failed.length,failed:failed.length,labs:report},null,2)+'\n');
console.log(`${96-failed.length}/96 studio models passed; ${assertions} numeric/invariant assertions; 96 complete theory chapters.`);
if(failed.length)process.exitCode=1;
} finally {
  const resolved=path.resolve(temporaryRoot),expectedParent=path.resolve(os.tmpdir());
  if(path.dirname(resolved)!==expectedParent||!path.basename(resolved).startsWith('physics-studio-audit-'))throw Error('Refusing unexpected runtime cleanup path');
  fs.rmSync(resolved,{recursive:true,force:true});
}
