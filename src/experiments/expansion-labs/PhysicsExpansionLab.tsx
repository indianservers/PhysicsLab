import { useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import "./physics-expansion-lab.css";

type Values = Record<string, number>;
type Control = { key: string; label: string; unit: string; min: number; max: number; step: number; initial: number };
type Reading = { label: string; value: string };
type LabConfig = {
  eyebrow: string;
  question: string;
  formula: string;
  controls: Control[];
  solve: (values: Values) => { readings: Reading[]; conclusion: string };
};

const control = (key: string, label: string, unit: string, min: number, max: number, step: number, initial: number): Control => ({ key, label, unit, min, max, step, initial });
const fixed = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : "—";

const LABS: Record<string, LabConfig> = {
  "balancing-act": {
    eyebrow: "MECHANICS · MOMENTS",
    question: "Where must the second mass sit to balance the beam?",
    formula: "τ = rF = rmg   ·   equilibrium when Στ = 0",
    controls: [control("m1", "Left mass", "kg", 1, 10, .5, 5), control("r1", "Left distance", "m", .2, 2, .1, 1.2), control("m2", "Right mass", "kg", 1, 10, .5, 4)],
    solve: v => { const target = v.m1 * v.r1 / v.m2; const delta = v.m1 * v.r1 - v.m2; return { readings: [{ label: "Left moment", value: `${fixed(v.m1 * v.r1)} kg·m` }, { label: "Balance distance", value: `${fixed(target)} m` }, { label: "At 1 m", value: Math.abs(delta) < .08 ? "Balanced" : delta > 0 ? "Left falls" : "Right falls" }], conclusion: "Mass and distance trade off. Equal weights are not required—equal and opposite moments are." }; },
  },
  "blackbody-spectrum": {
    eyebrow: "THERMAL PHYSICS · RADIATION",
    question: "How does temperature move the peak of a thermal spectrum?",
    formula: "λmax T = 2.898 × 10⁻³ m·K   ·   P/A = εσT⁴",
    controls: [control("temperature", "Temperature", "K", 1000, 10000, 100, 5800), control("emissivity", "Emissivity", "", .1, 1, .05, 1)],
    solve: v => ({ readings: [{ label: "Peak wavelength", value: `${fixed(2.898e6 / v.temperature, 0)} nm` }, { label: "Radiant exitance", value: `${fixed(v.emissivity * 5.670374419e-8 * v.temperature ** 4 / 1e6, 2)} MW/m²` }, { label: "Visible impression", value: v.temperature < 2500 ? "Infrared / red" : v.temperature < 5000 ? "Warm white" : "White / blue" }], conclusion: "Hotter bodies emit much more power and peak at shorter wavelengths; brightness and colour both change." }),
  },
  "build-a-nucleus": {
    eyebrow: "NUCLEAR PHYSICS · STABILITY",
    question: "How do proton and neutron counts influence nuclear stability?",
    formula: "A = Z + N   ·   B ≈ avA − asA²ᐟ³ − acZ(Z−1)/A¹ᐟ³ − aa(A−2Z)²/A",
    controls: [control("protons", "Protons Z", "", 1, 92, 1, 6), control("neutrons", "Neutrons N", "", 0, 146, 1, 6)],
    solve: v => { const A = v.protons + v.neutrons; const B = 15.75*A - 17.8*A**(2/3) - .711*v.protons*(v.protons-1)/A**(1/3) - 23.7*(A-2*v.protons)**2/A; const ratio=v.neutrons/v.protons; const stable = v.protons <= 20 ? Math.abs(v.neutrons-v.protons)<=2 : ratio > 1.05 && ratio < 1.62; return { readings: [{label:"Nuclide",value:`Z=${v.protons}, A=${A}`},{label:"N/Z ratio",value:fixed(ratio,2)},{label:"Binding estimate",value:`${fixed(Math.max(0,B/A),2)} MeV/nucleon`}], conclusion: stable ? "This neutron-to-proton balance lies near the broad valley of stability." : "This combination is away from the broad stability band and is likely radioactive or unbound." }; },
  },
  "color-vision": {
    eyebrow: "OPTICS · HUMAN VISION",
    question: "What colour does the eye perceive when red, green, and blue light mix?",
    formula: "Additive light mixing: perceived RGB = (R, G, B)",
    controls: [control("red", "Red", "%", 0, 100, 1, 100), control("green", "Green", "%", 0, 100, 1, 55), control("blue", "Blue", "%", 0, 100, 1, 10)],
    solve: v => { const hex = [v.red,v.green,v.blue].map(n=>Math.round(n*2.55).toString(16).padStart(2,"0")).join("").toUpperCase(); const lum=.2126*v.red+.7152*v.green+.0722*v.blue; return {readings:[{label:"Display colour",value:`#${hex}`},{label:"Relative luminance",value:`${fixed(lum,0)}%`},{label:"Active cones",value:[v.red>5?"L":"",v.green>5?"M":"",v.blue>5?"S":""].filter(Boolean).join(" + ")||"None"}],conclusion:"The cones respond in overlapping bands; the brain interprets their relative signals as colour."}; },
  },
  "fourier-making-waves": {
    eyebrow: "WAVES · HARMONICS",
    question: "How do simple sine waves combine into a complex waveform?",
    formula: "y(t) = A₁sin(ωt) + A₂sin(2ωt) + A₃sin(3ωt)",
    controls: [control("a1", "Fundamental A₁", "", 0, 1, .05, .8), control("a2", "Second harmonic A₂", "", 0, 1, .05, .3), control("a3", "Third harmonic A₃", "", 0, 1, .05, .2)],
    solve: v => { const rms=Math.sqrt((v.a1*v.a1+v.a2*v.a2+v.a3*v.a3)/2); return {readings:[{label:"RMS amplitude",value:fixed(rms,3)},{label:"Strongest component",value:v.a1>=v.a2&&v.a1>=v.a3?"Fundamental":v.a2>=v.a3?"2nd harmonic":"3rd harmonic"},{label:"Bandwidth",value:v.a3>0?"3f₀":v.a2>0?"2f₀":"f₀"}],conclusion:"Superposition changes the shape, while each harmonic keeps its own frequency and amplitude."}; },
  },
  "resistance-in-a-wire": {
    eyebrow: "ELECTRICITY · RESISTIVITY",
    question: "How do material, length, and cross-section set a wire’s resistance?",
    formula: "R = ρL/A",
    controls: [control("rho", "Resistivity ρ", "nΩ·m", 15, 1000, 5, 17), control("length", "Wire length", "m", .1, 10, .1, 2), control("area", "Area", "mm²", .1, 5, .1, 1)],
    solve: v => { const R=v.rho*1e-9*v.length/(v.area*1e-6); return {readings:[{label:"Resistance",value:`${fixed(R,4)} Ω`},{label:"At 5 V",value:`${fixed(5/R,2)} A`},{label:"Power at 5 V",value:`${fixed(25/R,1)} W`}],conclusion:"A longer wire resists more; a thicker wire offers more parallel paths and resists less."}; },
  },
  "rutherford-scattering": {
    eyebrow: "ATOMIC PHYSICS · SCATTERING",
    question: "Why do a few alpha particles turn through very large angles?",
    formula: "θ = 2 tan⁻¹[k Z₁Z₂e² / (2Eb)]",
    controls: [control("energy", "Alpha energy", "MeV", 1, 10, .1, 5), control("impact", "Impact parameter", "fm", 2, 80, 1, 15), control("z", "Nuclear charge Z", "", 10, 92, 1, 79)],
    solve: v => { const theta=2*Math.atan(v.z*2*1.44/(2*v.energy*v.impact))*180/Math.PI; return {readings:[{label:"Scattering angle",value:`${fixed(theta,1)}°`},{label:"Closest approach trend",value:v.energy>6?"Closer":"Farther"},{label:"Outcome",value:theta>90?"Backscatter":theta>20?"Large deflection":"Small deflection"}],conclusion:"Large deflections are rare because they require a close encounter with a tiny, concentrated positive nucleus."}; },
  },
  "states-of-matter": {
    eyebrow: "THERMAL PHYSICS · PHASES",
    question: "How do temperature, pressure, and attraction determine a material’s phase?",
    formula: "Microscopic kinetic energy grows with absolute temperature",
    controls: [control("temperature", "Temperature", "K", 50, 700, 5, 280), control("pressure", "Pressure", "atm", .1, 8, .1, 1), control("attraction", "Attraction", "%", 20, 100, 1, 55)],
    solve: v => { const melt=120+2.2*v.attraction+8*v.pressure; const boil=260+3.6*v.attraction+22*v.pressure; const phase=v.temperature<melt?"Solid":v.temperature<boil?"Liquid":"Gas"; return {readings:[{label:"Predicted phase",value:phase},{label:"Model melt point",value:`${fixed(melt,0)} K`},{label:"Model boil point",value:`${fixed(boil,0)} K`}],conclusion:`In this comparative particle model the sample is ${phase.toLowerCase()}; stronger attraction or pressure favours condensed phases.`}; },
  },
  "atomic-interactions": {
    eyebrow: "ATOMIC PHYSICS · POTENTIAL ENERGY",
    question: "At what separation do attraction and repulsion balance?",
    formula: "U(r) = 4ε[(σ/r)¹² − (σ/r)⁶]",
    controls: [control("distance", "Separation r", "Å", 2.5, 8, .05, 3.8), control("sigma", "Atomic size σ", "Å", 2, 5, .05, 3.4), control("epsilon", "Well depth ε", "meV", 1, 25, .5, 10)],
    solve: v => { const q=v.sigma/v.distance; const U=4*v.epsilon*(q**12-q**6); const F=24*v.epsilon/v.distance*(2*q**12-q**6); return {readings:[{label:"Potential energy",value:`${fixed(U,2)} meV`},{label:"Radial force",value:`${fixed(F,2)} meV/Å`},{label:"Interaction",value:Math.abs(F)<.3?"Near equilibrium":F>0?"Repulsive":"Attractive"}],conclusion:"Electron-cloud repulsion dominates at short range; dispersion attraction dominates farther out."}; },
  },
  diffusion: {
    eyebrow: "STATISTICAL PHYSICS · TRANSPORT",
    question: "How quickly does a particle cloud spread through random motion?",
    formula: "xᵣₘₛ = √(2Dt)",
    controls: [control("time", "Elapsed time", "s", 0, 60, 1, 15), control("temperature", "Temperature", "K", 100, 600, 10, 300), control("mass", "Particle mass", "u", 2, 100, 1, 28)],
    solve: v => { const D=.08*(v.temperature/300)*Math.sqrt(28/v.mass); const rms=Math.sqrt(2*D*v.time); return {readings:[{label:"Diffusion coefficient",value:`${fixed(D,3)} cm²/s`},{label:"RMS spread",value:`${fixed(rms,2)} cm`},{label:"Spread rate",value:v.temperature>400?"Fast":v.temperature<220?"Slow":"Moderate"}],conclusion:"Individual steps are random, but the ensemble width follows a predictable square-root-of-time law."}; },
  },
  "greenhouse-effect": {
    eyebrow: "CLIMATE PHYSICS · ENERGY BALANCE",
    question: "How do reflectivity and infrared trapping affect equilibrium temperature?",
    formula: "T = [S(1−α) / 4σ(1−ε/2)]¹ᐟ⁴  (one-layer model)",
    controls: [control("solar", "Solar flux", "W/m²", 900, 1500, 10, 1361), control("albedo", "Albedo", "%", 5, 80, 1, 30), control("emissivity", "IR absorption", "%", 0, 90, 1, 45)],
    solve: v => { const T=(v.solar*(1-v.albedo/100)/(4*5.670374419e-8*(1-v.emissivity/200)))**.25; return {readings:[{label:"Equilibrium",value:`${fixed(T,1)} K`},{label:"Celsius",value:`${fixed(T-273.15,1)} °C`},{label:"Absorbed sunlight",value:`${fixed(v.solar*(1-v.albedo/100)/4,1)} W/m²`}],conclusion:"This deliberately simple energy-balance model separates reflected sunlight from absorbed and re-emitted infrared energy."}; },
  },
  "molecules-and-light": {
    eyebrow: "SPECTROSCOPY · MOLECULAR ENERGY",
    question: "When does a molecule strongly absorb incoming light?",
    formula: "E = hc/λ   ·   absorption peaks when photon energy matches a transition",
    controls: [control("wavelength", "Light wavelength", "nm", 200, 2000, 10, 800), control("resonance", "Transition wavelength", "nm", 250, 1800, 10, 950), control("intensity", "Intensity", "%", 1, 100, 1, 70)],
    solve: v => { const match=Math.exp(-(((v.wavelength-v.resonance)/(Math.max(60,v.resonance*.09)))**2)); const absorbed=match*v.intensity; return {readings:[{label:"Photon energy",value:`${fixed(1240/v.wavelength,2)} eV`},{label:"Absorbed",value:`${fixed(absorbed,1)}%`},{label:"Response",value:match>.65?"Strong transition":match>.15?"Weak response":"Transmitted"}],conclusion:"Molecules absorb selectively: rotation, vibration, and electronic transitions respond to different photon energies."}; },
  },
};

export function PhysicsExpansionLab({ experiment }: DedicatedExperimentLabProps) {
  const config = LABS[experiment.id];
  const initial = useMemo(() => Object.fromEntries(config.controls.map(item => [item.key, item.initial])), [config]);
  const [values, setValues] = useState<Values>(initial);
  const result = config.solve(values);
  const update = (key: string, value: number) => setValues(current => ({ ...current, [key]: value }));

  return (
    <section className="expansion-lab">
      <header><div><span>{config.eyebrow}</span><h2>{experiment.title}</h2><p>{config.question}</p></div><button type="button" onClick={() => setValues(initial)}>Reset</button></header>
      <div className="expansion-layout">
        <aside className="expansion-controls"><h3>Change one variable</h3>{config.controls.map(item => <label key={item.key}><span>{item.label}<output>{values[item.key]} {item.unit}</output></span><input type="range" min={item.min} max={item.max} step={item.step} value={values[item.key]} onChange={event=>update(item.key,Number(event.target.value))}/></label>)}</aside>
        <div className="expansion-stage"><LabVisual id={experiment.id} values={values}/><div className="expansion-formula">{config.formula}</div></div>
        <aside className="expansion-readings"><h3>Live evidence</h3>{result.readings.map(item=><div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}<p>{result.conclusion}</p></aside>
      </div>
      <footer><b>Investigation:</b> predict first, change only one control, then explain the direction of the result using the displayed relationship.</footer>
    </section>
  );
}

function LabVisual({ id, values: v }: { id: string; values: Values }) {
  if (id === "balancing-act") { const tilt=Math.max(-12,Math.min(12,(v.m1*v.r1-v.m2)*3)); return <svg viewBox="0 0 600 360" role="img" aria-label="Torque balance"><g transform={`rotate(${-tilt} 300 190)`}><rect x="85" y="178" width="430" height="22" rx="10"/><circle cx={300-v.r1*120} cy="148" r={18+v.m1}/><circle cx="420" cy="148" r={18+v.m2}/></g><path d="M300 190 250 300h100z"/><text x="300" y="330">pivot</text></svg>; }
  if (id === "blackbody-spectrum") { const peak=2.898e6/v.temperature; const x=70+Math.max(0,Math.min(460,(peak-250)/1750*460)); return <svg viewBox="0 0 600 360" role="img" aria-label="Blackbody spectrum"><defs><linearGradient id="spectrum"><stop stopColor="#7347ff"/><stop offset=".25" stopColor="#2ab8ff"/><stop offset=".5" stopColor="#58e06f"/><stop offset=".72" stopColor="#ffd53d"/><stop offset="1" stopColor="#ff3c35"/></linearGradient></defs><rect x="70" y="285" width="460" height="12" fill="url(#spectrum)"/><path d={`M70 285 C ${x-80} 280, ${x-55} 80, ${x} 60 S ${x+90} 260,530 285`} /><line x1={x} x2={x} y1="48" y2="298"/><text x={Math.min(500,x+8)} y="45">λmax</text></svg>; }
  if (id === "color-vision") { const color=`rgb(${v.red*2.55},${v.green*2.55},${v.blue*2.55})`; return <svg viewBox="0 0 600 360" role="img" aria-label="Additive color mixing"><circle cx="245" cy="160" r="100" fill={`rgb(${v.red*2.55},0,0)`}/><circle cx="355" cy="160" r="100" fill={`rgb(0,${v.green*2.55},0)`}/><circle cx="300" cy="245" r="100" fill={`rgb(0,0,${v.blue*2.55})`}/><circle cx="300" cy="190" r="65" fill={color}/></svg>; }
  if (id === "fourier-making-waves") { const points=Array.from({length:121},(_,i)=>{const t=i/120*Math.PI*4; const y=v.a1*Math.sin(t)+v.a2*Math.sin(2*t)+v.a3*Math.sin(3*t); return `${40+i*4.3},${180-y*75}`}).join(" "); return <svg viewBox="0 0 600 360" role="img" aria-label="Fourier waveform"><line x1="40" x2="560" y1="180" y2="180"/><polyline points={points}/></svg>; }
  if (id === "resistance-in-a-wire") { const width=8+v.area*5; return <svg viewBox="0 0 600 360" role="img" aria-label="Resistance wire"><circle cx="80" cy="180" r="42"/><circle cx="520" cy="180" r="42"/><line x1="80" x2="520" y1="180" y2="180" style={{strokeWidth:width}}/><g className="charge-dots">{[150,220,290,360,430].map(x=><circle key={x} cx={x} cy="180" r="6"/>)}</g></svg>; }
  if (id === "rutherford-scattering") { const theta=2*Math.atan(v.z*2*1.44/(2*v.energy*v.impact)); const y=180-Math.tan(Math.min(1.2,theta))*170; return <svg viewBox="0 0 600 360" role="img" aria-label="Rutherford scattering"><circle cx="360" cy="180" r={12+v.z/8}/><path d={`M40 250 Q 330 250 360 210 Q 390 175 550 ${Math.max(35,y)}`}/><circle cx="65" cy="249" r="9"/><text x="375" y="180">+{v.z}</text></svg>; }
  if (id === "states-of-matter" || id === "diffusion") { const spread=id==="diffusion"?Math.min(220,35+v.time*3):v.temperature>450?210:v.temperature>220?120:65; return <svg viewBox="0 0 600 360" role="img" aria-label="Particle model"><rect x="70" y="45" width="460" height="265" rx="18"/>{Array.from({length:36},(_,i)=>{const a=i*2.399; const rr=(i%7)/6*spread; return <circle key={i} cx={300+Math.cos(a)*rr} cy={178+Math.sin(a)*rr*.58} r="7"/>})}</svg>; }
  if (id === "greenhouse-effect") return <svg viewBox="0 0 600 360" role="img" aria-label="Planetary energy balance"><circle cx="110" cy="95" r="50"/><circle cx="390" cy="220" r="105"/><path d="M155 105 315 175M155 85l170 45M370 115q80-90 145 10M420 120q90-45 105 45"/><text x="70" y="175">shortwave in</text><text x="430" y="70">infrared out</text></svg>;
  if (id === "molecules-and-light") { const absorb=Math.exp(-(((v.wavelength-v.resonance)/(Math.max(60,v.resonance*.09)))**2)); return <svg viewBox="0 0 600 360" role="img" aria-label="Molecular light absorption"><path d="M25 180q25-70 50 0t50 0t50 0t50 0"/><g transform={`rotate(${20*absorb} 330 180)`}><circle cx="290" cy="180" r="38"/><circle cx="370" cy="180" r="38"/><line x1="325" x2="335" y1="180" y2="180"/></g><path d={`M410 180q20-${50*(1-absorb)} 40 0t40 0t40 0`}/></svg>; }
  if (id === "atomic-interactions") { const gap=(v.distance-2.5)/5.5*240; return <svg viewBox="0 0 600 360" role="img" aria-label="Atomic interaction"><circle cx={300-gap/2} cy="180" r={v.sigma*14}/><circle cx={300+gap/2} cy="180" r={v.sigma*14}/><line x1={300-gap/2} x2={300+gap/2} y1="180" y2="180"/><text x="275" y="300">r = {v.distance.toFixed(2)} Å</text></svg>; }
  const protons=Math.round(v.protons||6), neutrons=Math.round(v.neutrons||6); return <svg viewBox="0 0 600 360" role="img" aria-label="Nucleus builder"><circle cx="300" cy="180" r="130" className="nucleus-shell"/>{Array.from({length:Math.min(80,protons+neutrons)},(_,i)=>{const a=i*2.4, r=12*Math.sqrt(i); return <circle key={i} cx={300+Math.cos(a)*r} cy={180+Math.sin(a)*r} r="11" className={i<protons?"proton":"neutron"}/>})}</svg>;
}
