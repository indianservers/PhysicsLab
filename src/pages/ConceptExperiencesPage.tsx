import { CSSProperties, ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PhysicsIcon } from "../lib/icons";
import { ConceptStudioThreeScene } from "../components/ConceptStudioThreeScene";
import { studioHomeById, studioHomes, type StudioHome } from "../lib/conceptStudioHomes";
import "../concept-studio-homes.css";
import { PhysicsAtlasPage } from './PhysicsAtlasPage';

const mainNav = ["Learn", "Practice", "Challenges", "Progress", "Reference"];

const telemetryByStudio: Record<string, Array<[string,string]>> = {
  measurement:[["Least count","0.05 mm"],["Repeated trials","6"],["Uncertainty","±0.05 mm"]], mechanics:[["Applied force","18.0 N"],["Resultant","12.4 N"],["Mass","4.00 kg"]],
  "motion-kinematics":[["Position","0.13 m"],["Velocity","0.50 m/s"],["Acceleration","1.00 m/s²"]], "force-newton":[["Cart 1 force","−2.6 N"],["Cart 2 force","+2.6 N"],["Net pair","0 N"]],
  "work-energy-power":[["Kinetic","18.6 J"],["Potential","29.6 J"],["Total","48.2 J"]], gravitation:[["Orbital speed","7.67 km/s"],["Altitude","400 km"],["Period","92.4 min"]],
  oscillations:[["Frequency","1.24 Hz"],["Amplitude","8.0 cm"],["Phase","42°"]], "waves-sound":[["Wave speed","2.40 m/s"],["Frequency","4.0 Hz"],["Wavelength","0.60 m"]],
  optics:[["Wavelength","450 nm"],["Index","1.52"],["Angle","28.4°"]], electricity:[["Current","0.32 A"],["Voltage","6.00 V"],["Resistance","18.8 Ω"]],
  magnetism:[["Field","3.6 mT"],["Current","1.20 A"],["Turns","240"]], electronics:[["Output","3.30 V"],["Frequency","1.00 kHz"],["Duty cycle","50%"]],
  thermodynamics:[["Pressure","2.4 bar"],["Temperature","420 K"],["Volume","1.8 L"]], "fluid-mechanics":[["Throat pressure","18.2 kPa"],["Flow speed","3.8 m/s"],["Rate","2.1 L/s"]],
  "modern-physics":[["Detector","4827 cpm"],["Threshold","2.14 eV"],["Wavelength","365 nm"]], "astronomy-astrophysics":[["Target","M31"],["Distance","2.54 Mly"],["Magnitude","3.4"]],
};

const controlByStudio: Record<string,{label:string;unit:string;format:(value:number)=>string}> = {
  measurement:{label:"Object length",unit:"mm",format:value=>(25+value*.46).toFixed(1)}, mechanics:{label:"Applied force",unit:"N",format:value=>(value*.35).toFixed(1)},
  "motion-kinematics":{label:"Track acceleration",unit:"m/s²",format:value=>(value*.04).toFixed(2)}, "force-newton":{label:"Applied force",unit:"N",format:value=>(value*.1).toFixed(1)},
  "work-energy-power":{label:"Release height",unit:"m",format:value=>(value*.05).toFixed(2)}, gravitation:{label:"Orbital altitude",unit:"km",format:value=>(160+value*12).toFixed(0)},
  oscillations:{label:"Driving frequency",unit:"Hz",format:value=>(.25+value*.025).toFixed(2)}, "waves-sound":{label:"Source frequency",unit:"Hz",format:value=>(1+value*.12).toFixed(1)},
  optics:{label:"Wavelength",unit:"nm",format:value=>(380+value*3.2).toFixed(0)}, electricity:{label:"Supply voltage",unit:"V",format:value=>(1.5+value*.09).toFixed(2)},
  magnetism:{label:"Coil current",unit:"A",format:value=>(value*.025).toFixed(2)}, electronics:{label:"Input frequency",unit:"kHz",format:value=>(.1+value*.04).toFixed(2)},
  thermodynamics:{label:"Hot reservoir",unit:"K",format:value=>(300+value*6).toFixed(0)}, "fluid-mechanics":{label:"Flow rate",unit:"L/min",format:value=>(2+value*.35).toFixed(1)},
  "modern-physics":{label:"Photon energy",unit:"eV",format:value=>(1.2+value*.04).toFixed(2)}, "astronomy-astrophysics":{label:"Exposure time",unit:"s",format:value=>(5+value*1.15).toFixed(0)},
};

function liveReadings(id:string,level:number):Array<[string,string]>{
  const v=level;
  const values:Record<string,Array<[string,string]>>={
    measurement:[["Measured length",`${(25+v*.46).toFixed(2)} mm`],["Least count",`${(.1-v*.0005).toFixed(3)} mm`],["Uncertainty",`±${(.12-v*.0007).toFixed(3)} mm`]],
    mechanics:[["Applied force",`${(v*.35).toFixed(1)} N`],["Resultant",`${(v*.24).toFixed(1)} N`],["Acceleration",`${(v*.06).toFixed(2)} m/s²`]],
    "motion-kinematics":[["Position",`${(v*.025).toFixed(2)} m`],["Velocity",`${(.5+v*.055).toFixed(2)} m/s`],["Acceleration",`${(v*.04).toFixed(2)} m/s²`]],
    "force-newton":[["Cart 1 force",`−${(v*.052).toFixed(1)} N`],["Cart 2 force",`+${(v*.052).toFixed(1)} N`],["Net pair","0.0 N"]],
    "work-energy-power":[["Kinetic",`${(v*.36).toFixed(1)} J`],["Potential",`${((100-v)*.58).toFixed(1)} J`],["Total",`${(58-v*.02).toFixed(1)} J`]],
    gravitation:[["Orbital speed",`${(8.25-v*.011).toFixed(2)} km/s`],["Altitude",`${(160+v*12).toFixed(0)} km`],["Period",`${(82+v*.2).toFixed(1)} min`]],
    oscillations:[["Frequency",`${(.25+v*.025).toFixed(2)} Hz`],["Amplitude",`${(2+v*.12).toFixed(1)} cm`],["Phase",`${(v*3.6).toFixed(0)}°`]],
    "waves-sound":[["Wave speed",`${(1.6+v*.016).toFixed(2)} m/s`],["Frequency",`${(1+v*.12).toFixed(1)} Hz`],["Wavelength",`${((1.6+v*.016)/(1+v*.12)).toFixed(2)} m`]],
    optics:[["Wavelength",`${(380+v*3.2).toFixed(0)} nm`],["Index",`${(1.33+v*.0037).toFixed(2)}`],["Refraction angle",`${(18+v*.2).toFixed(1)}°`]],
    electricity:[["Voltage",`${(1.5+v*.09).toFixed(2)} V`],["Current",`${(.05+v*.0052).toFixed(2)} A`],["Power",`${((1.5+v*.09)*(.05+v*.0052)).toFixed(2)} W`]],
    magnetism:[["Field",`${(.4+v*.061).toFixed(1)} mT`],["Current",`${(v*.025).toFixed(2)} A`],["Flux",`${(v*.12).toFixed(1)} µWb`]],
    electronics:[["Output",`${(1+v*.045).toFixed(2)} V`],["Frequency",`${(.1+v*.04).toFixed(2)} kHz`],["Duty cycle",`${(25+v*.5).toFixed(0)}%`]],
    thermodynamics:[["Pressure",`${(1+v*.027).toFixed(2)} bar`],["Temperature",`${(300+v*6).toFixed(0)} K`],["Efficiency",`${(18+v*.45).toFixed(1)}%`]],
    "fluid-mechanics":[["Inlet pressure",`${(35+v*.35).toFixed(1)} kPa`],["Throat pressure",`${(30-v*.22).toFixed(1)} kPa`],["Flow speed",`${(.6+v*.065).toFixed(2)} m/s`]],
    "modern-physics":[["Photon energy",`${(1.2+v*.04).toFixed(2)} eV`],["Detector",`${(800+v*78).toFixed(0)} cpm`],["Stopping potential",`${Math.max(0,-1+v*.04).toFixed(2)} V`]],
    "astronomy-astrophysics":[["Exposure",`${(5+v*1.15).toFixed(0)} s`],["Signal / noise",`${(4+v*.16).toFixed(1)}`],["Limiting magnitude",`${(11+v*.08).toFixed(1)}`]],
  };
  return values[id]??telemetryByStudio[id]??[];
}

function StudioShell({children, studio}:{children:ReactNode; studio?:StudioHome}) {
  const navigate=useNavigate();
  const [open,setOpen]=useState(false);
  return <div className="csh" data-ui-theme="dark" style={{"--studio-accent":studio?.accent??"#27d8ff"} as CSSProperties}>
    <aside className="csh-rail" aria-label="Studio navigation">
      <Link className="csh-home" to="/" aria-label="Home"><PhysicsIcon name="home"/><span>Home</span></Link>
      {(studio?studio.concepts:studioHomes.slice(0,6)).map((item,index)=><button key={"id" in item?item.id:item.title} title={"name" in item?item.name:item.title} onClick={()=>studio?document.querySelectorAll<HTMLButtonElement>('.csh-concept-grid button')[index]?.click():navigate(`/concept-studio/${"id" in item?item.id:""}`)}><PhysicsIcon name={item.icon}/><span>{"name" in item?item.name.replace(" Studio",""):item.title}</span></button>)}
      <div className="csh-rail-spacer"/>
      <button onClick={()=>setOpen(value=>!value)} aria-expanded={open} aria-label="All studios"><PhysicsIcon name="menu"/><span>Studios</span></button>
      <button onClick={()=>document.querySelector('#activities')?.scrollIntoView({behavior:'smooth'})}><PhysicsIcon name="book"/><span>Notes</span></button>
    </aside>
    {open&&<div className="csh-switcher" role="dialog" aria-label="Choose a Physics Studio">
      <header><strong>Physics Studios</strong><button onClick={()=>setOpen(false)} aria-label="Close">×</button></header>
      <div>{studioHomes.map(item=><button key={item.id} onClick={()=>navigate(`/concept-studio/${item.id}`)}><PhysicsIcon name={item.icon}/><span>{item.name.replace(" Studio","")}</span></button>)}</div>
    </div>}
    {children}
  </div>
}

function StudioTop({studio,onSearch}:{studio?:StudioHome;onSearch?:(value:string)=>void}){
  return <header className="csh-top">
    <Link className="csh-brand" to="/concept-studio"><span className="csh-brand-mark"><PhysicsIcon name={studio?.icon??"atom"}/></span><span><b>{studio?.name??"Physics Atlas"}</b><small>{studio?.eyebrow??"CONCEPT STUDIO"}</small></span></Link>
    <nav aria-label="Studio sections">{mainNav.map((item,index)=><button key={item} onClick={()=>document.querySelector(index<2?"#concepts":"#activities")?.scrollIntoView({behavior:"smooth"})}>{item}</button>)}</nav>
    <label className="csh-search"><PhysicsIcon name="search"/><input aria-label="Search this studio" placeholder="Search this studio" onChange={event=>onSearch?.(event.target.value)}/><kbd>⌘ K</kbd></label>
  </header>
}

function KineticOverlay({id,level}:{id:string;level:number}){
  return <div className={`csh-kinetic csh-kinetic-${id}`} aria-hidden="true"><span className="pulse p1"/><span className="pulse p2"/><span className="pulse p3"/>
    <svg viewBox="0 0 900 400" preserveAspectRatio="none">
      {id==="motion-kinematics"&&<><path d="M50 315 Q260 305 430 250 T850 95"/><path d="M50 330 L850 330"/></>}
      {id==="force-newton"&&<><path d="M185 205 H470"/><path d="M715 205 H500"/></>}
      {id==="gravitation"&&<><ellipse cx="450" cy="210" rx={220+level} ry={92+level/3}/><ellipse cx="450" cy="210" rx={310+level} ry={145+level/3}/></>}
      {id==="waves-sound"&&[0,1,2,3].map(n=><path key={n} d={`M30 ${130+n*28} Q130 ${70+n*28} 230 ${130+n*28} T430 ${130+n*28} T630 ${130+n*28} T830 ${130+n*28}`}/>) }
      {id==="magnetism"&&[-2,-1,0,1,2].map(n=><path key={n} d={`M145 205 C300 ${30+n*35} 600 ${30+n*35} 755 205 C600 ${380-n*35} 300 ${380-n*35} 145 205`}/>) }
      {id==="fluid-mechanics"&&[-2,-1,0,1,2].map(n=><path key={n} d={`M30 ${200+n*34} C290 ${200+n*34} 330 ${200+n*12} 450 ${200+n*12} S610 ${200+n*34} 870 ${200+n*34}`}/>) }
      {id==="thermodynamics"&&Array.from({length:18},(_,n)=><circle key={n} cx={60+(n*73)%770} cy={65+(n*97)%270} r="4"/>)}
      {id==="modern-physics"&&<><path d="M55 205 H810"/><path d="M180 70 V340 M330 105 V305 M510 135 V275 M690 165 V245"/></>}
      {id==="optics"&&<><path d="M40 210 L390 210 L630 92"/><path d="M390 210 L650 330"/></>}
      {id==="electricity"&&<path d="M60 100 H790 V315 H60 Z"/>}
      {id==="oscillations"&&<path d="M30 210 Q90 50 150 210 T270 210 T390 210 T510 210 T630 210 T750 210 T870 210"/>}
    </svg>
  </div>
}

function StageInstrument({studio,level,onAction}:{studio:StudioHome;level:number;onAction:(message:string)=>void}) {
  if(studio.id==="motion-kinematics") return <aside className="csh-stage-instrument csh-motion-graphs" aria-label="Live motion graphs">
    {[["Position","x (m)",`M4 36 Q42 35 78 27 T150 5`],["Velocity","v (m/s)",`M4 35 L150 7`],["Acceleration","a (m/s²)",`M4 22 H150`]].map(([name,unit,path])=><div key={name}><b>{name}<small>{unit}</small></b><svg viewBox="0 0 154 42"><path d="M3 2 V39 H152"/><path className="signal" d={path}/></svg></div>)}
    <output>x = {(level*.0025).toFixed(2)} m</output>
  </aside>;
  if(studio.id==="force-newton") return <>
    <div className="csh-force-sensor left"><small>FORCE SENSOR A</small><strong>−{(level/20).toFixed(1)} N</strong><span>on cart 1</span></div>
    <div className="csh-force-sensor right"><small>FORCE SENSOR B</small><strong>+{(level/20).toFixed(1)} N</strong><span>on cart 2</span></div>
    <div className="csh-force-arrow left" aria-hidden="true">F₁₂</div><div className="csh-force-arrow right" aria-hidden="true">F₂₁</div>
  </>;
  if(studio.id==="astronomy-astrophysics") return <aside className="csh-stage-instrument csh-target-panel">
    <span>OBSERVATION TARGET</span><b>M31 <small>Andromeda Galaxy</small></b><dl><div><dt>Type</dt><dd>Spiral galaxy</dd></div><div><dt>Distance</dt><dd>2.54 million ly</dd></div><div><dt>Magnitude</dt><dd>3.4</dd></div></dl><button type="button" onClick={()=>onAction("M31 set as the active observation target")}>Set as target</button>
  </aside>;
  const readings=liveReadings(studio.id,level);
  return <aside className="csh-stage-instrument csh-diagnostic" aria-label={`${studio.name} live diagnostic panel`}>
    <span>LIVE DIAGNOSTICS</span><b>{studio.concepts[0].title}</b>
    <svg viewBox="0 0 180 54" aria-hidden="true"><path d="M2 48 H178 M2 3 V48"/><path className="signal" d={`M3 ${44-level*.25} C38 ${50-level*.42} 52 ${12+level*.12} 88 ${31-level*.08} S142 ${46-level*.3} 177 ${8+level*.16}`}/></svg>
    <dl>{readings.slice(0,2).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </aside>;
}

function SubjectHome({studio}:{studio:StudioHome}){
  const [query,setQuery]=useState(""); const [active,setActive]=useState(0); const [running,setRunning]=useState(true); const [level,setLevel]=useState(52); const [notice,setNotice]=useState(""); const [showGrid,setShowGrid]=useState(true); const [showOverlay,setShowOverlay]=useState(true);
  const control=controlByStudio[studio.id]??{label:"Model variable",unit:"%",format:(value:number)=>value.toFixed(0)};
  const readings=liveReadings(studio.id,level);
  const visible=useMemo(()=>studio.concepts.filter(item=>(item.title+item.detail).toLowerCase().includes(query.toLowerCase())),[query,studio]);
  useEffect(()=>{setActive(0);setLevel(52);setRunning(true);setNotice("");setShowGrid(true);setShowOverlay(true)},[studio.id]);
  useEffect(()=>{if(!running)return;const timer=window.setInterval(()=>setLevel(value=>value>=92?18:value+1),90);return()=>clearInterval(timer)},[running]);
  const perform=(message:string)=>{setNotice(message);window.setTimeout(()=>setNotice(""),2400)};
  return <StudioShell studio={studio}><main className={`csh-main csh-${studio.variant} csh-subject-${studio.id}`} id="content">
    <StudioTop studio={studio} onSearch={setQuery}/>
    <section className="csh-hero">
      <div className="csh-hero-copy"><span>{studio.eyebrow}</span><h1>{studio.name}</h1><p className="csh-hero-tagline">{studio.tagline}</p><p className="csh-hero-focus"><b>{studio.concepts[active]?.title}:</b> {studio.concepts[active]?.detail}</p>{studio.id === "motion-kinematics" && <><Link to="/motion/position-time">Position–Time <b>→</b></Link><Link to="/motion/velocity-time" style={{marginLeft:8}}>Velocity–Time <b>→</b></Link><Link to="/motion/acceleration-time" style={{marginLeft:8,marginTop:8}}>Acceleration–Time <b>→</b></Link><Link to="/motion/projectile-motion" style={{marginLeft:8,marginTop:8}}>Projectile Motion <b>→</b></Link><Link to="/motion/relative-motion" style={{marginLeft:8,marginTop:8}}>Relative Motion <b>→</b></Link><Link to="/motion/second-law-fma" style={{marginLeft:8,marginTop:8}}>Second Law <b>→</b></Link><Link to="/motion/first-law-inertia" style={{marginLeft:8,marginTop:8}}>First Law / Inertia <b>→</b></Link><Link to="/motion/circular-motion" style={{marginLeft:8,marginTop:8}}>Circular Motion <b>→</b></Link></>}<div><Link to={studio.startRoute}>Start interactive lab <b>→</b></Link>{studio.id === "mechanics" && <><Link to="/mechanics/free-body-diagrams">Free-Body Diagrams <b>→</b></Link><Link to="/mechanics/inclined-plane">Inclined Plane <b>→</b></Link><Link to="/mechanics/pulley-systems">Pulley Systems <b>→</b></Link><Link to="/mechanics/torque-levers">Torque &amp; Levers <b>→</b></Link><Link to="/mechanics/equilibrium-com">Equilibrium &amp; COM <b>→</b></Link><Link to="/mechanics/momentum-collisions">Momentum &amp; Collisions <b>→</b></Link></>}{studio.id === "measurement" && <><Link to="/measurement/meter-scale">Meter Scale <b>→</b></Link><Link to="/measurement/vernier-caliper">Vernier Caliper <b>→</b></Link><Link to="/measurement/micrometer">Micrometer <b>→</b></Link><Link to="/measurement/spherometer">Spherometer <b>→</b></Link><Link to="/measurement/mass-time">Mass &amp; Time <b>→</b></Link><Link to="/measurement/uncertainty">Uncertainty <b>→</b></Link></>}<button onClick={()=>setRunning(value=>!value)}>{running?"Pause model":"Run model"}</button></div></div>
      <div className={`csh-stage ${showGrid?"":"csh-hide-grid"} ${showOverlay?"":"csh-hide-overlay"}`} style={{"--activity":`${level}%`} as CSSProperties}>
        {showGrid&&<div className="csh-grid"/>}<img src={studio.asset} alt=""/><ConceptStudioThreeScene studioId={studio.id} level={level} running={running}/>{showOverlay&&<KineticOverlay id={studio.id} level={level}/>}<StageInstrument studio={studio} level={level} onAction={perform}/>
        <div className="csh-stage-chip"><i/><span>LIVE 3D APPARATUS</span></div>
        <div className="csh-readout"><small>{studio.liveTitle}</small><strong>{studio.liveValue}</strong><span>{running?"sampling live":"model paused"}</span></div>
        <label className="csh-model-control"><span>{control.label}<output>{control.format(level)} {control.unit}</output></span><input aria-label={control.label} type="range" min="0" max="100" value={level} onChange={e=>setLevel(Number(e.target.value))}/></label>
        <p className="csh-sr-state" aria-live="polite">{studio.name} model {running?"running":"paused"}. Control value {level} percent.</p>
      </div>
    </section>
    <section className="csh-concepts" id="concepts"><header><div><span>EXPLORE THE SUBJECT</span><h2>Core concepts</h2></div><p>Select a concept to retune the studio dashboard.</p></header>
      <div className="csh-concept-grid">{visible.map(item=>{const index=studio.concepts.indexOf(item);return <button key={item.title} className={active===index?"active":""} onClick={()=>setActive(index)}><span className="csh-concept-visual" style={{backgroundImage:`url(${studio.asset})`,backgroundPosition:`${index*18}% center`}}><PhysicsIcon name={item.icon}/></span><span><b>{item.title}</b><small>{item.detail}</small></span><em>0{index+1}</em></button>})}</div>
    </section>
    <section className="csh-workspace" id="activities">
      <article className="csh-feature"><span>FEATURED INVESTIGATION</span><h2>{studio.activities[active%studio.activities.length].title}</h2><p>{studio.activities[active%studio.activities.length].detail}</p><button onClick={()=>perform(`${studio.activities[active%studio.activities.length].title} ready`)}>{studio.activities[active%studio.activities.length].action} <b>→</b></button><div className="csh-feature-viz"><img src={studio.asset} alt=""/><i/><i/><i/></div></article>
      <div className="csh-activity-list">{studio.activities.map((item,index)=><button key={item.title} onClick={()=>{setActive(index);perform(`${item.title} selected`)}}><span className="csh-activity-thumb" style={{backgroundImage:`url(${studio.asset})`,backgroundPosition:`${20+index*34}% center`}}><PhysicsIcon name={studio.concepts[index%studio.concepts.length].icon}/></span><div><b>{item.title}</b><small>{item.detail}</small><i style={{width:`${45+index*18}%`}}/></div><em>↗</em></button>)}</div>
      <aside className="csh-progress csh-telemetry"><span>LIVE {studio.name.replace(" Studio","").toUpperCase()} READOUTS</span><h3>{studio.concepts[active].title}</h3><div>{readings.map(([label,value])=><output key={label}><small>{label}</small><b>{value}</b></output>)}</div><svg className="csh-console-graph" viewBox="0 0 220 42" aria-label="Live response graph"><path d="M1 39 H219 M1 2 V39"/><path className="signal" d={`M2 34 C40 ${36-level*.18} 70 ${8+level*.1} 110 ${27-level*.12} S180 ${37-level*.24} 218 ${7+level*.14}`}/></svg><div className="csh-display-toggles"><button className={showGrid?"active":""} type="button" onClick={()=>setShowGrid(value=>!value)}>Grid</button><button className={showOverlay?"active":""} type="button" onClick={()=>setShowOverlay(value=>!value)}>Vectors</button></div><p>{running?"Measurements update with the model control.":"Readings held while the model is paused."}</p><Link to={studio.startRoute}>Open full lab</Link></aside>
    </section>
    {notice&&<div className="csh-toast" role="status"><PhysicsIcon name="check"/>{notice}</div>}
  </main></StudioShell>
}

function AtlasHome(){
  const navigate=useNavigate(); const [selected,setSelected]=useState(1); const featured=studioHomes[selected];
  const atlasNodes=[studioHomes[2],studioHomes[3],studioHomes[7],studioHomes[8],studioHomes[9],studioHomes[12],studioHomes[14],studioHomes[15]];
  return <StudioShell><main className="csh-main csh-atlas" id="content"><StudioTop/>
    <section className="atlas-dashboard">
      <aside className="atlas-left"><article className="atlas-panel atlas-recent"><span>RECENT STUDIO</span><img src="/assets/experiments/projectile-motion/launcher-target.png" alt="Projectile motion apparatus"/><h2>Projectile Motion Lab</h2><small>Today · Studio</small><p>Change the launch angle, speed and gravity. See how the trajectory responds.</p><Link to="/experiments/projectile-motion">Open Studio →</Link></article><article className="atlas-panel atlas-quick"><span>QUICK ACCESS</span>{[["spark","New Studio","Start from a concept"],["folder","Open Saved","Your experiments"],["orbit","Browse Atlas","Explore connections"],["check","Try a Challenge","Apply what you know"]].map(([icon,title,detail])=><button key={title} onClick={()=>navigate('/concept-studio/measurement')}><PhysicsIcon name={icon as any}/><b>{title}<small>{detail}</small></b><em>›</em></button>)}</article></aside>
      <div className="atlas-center"><header><span>THE PHYSICS ATLAS</span><p>Connected ideas. A more complete universe.</p><small>Drag the 3D universe · Scroll to zoom · Select a studio</small></header><div className="atlas-orbit" aria-label="Interactive map of physics studios"><ConceptStudioThreeScene studioId="atlas" level={40+selected*4} running/><div className="atlas-earth" aria-hidden="true"/><div className="atlas-3d-label">REAL-TIME 3D ATLAS</div>{atlasNodes.map((item,index)=>{const studioIndex=studioHomes.indexOf(item);return <button key={item.id} style={{"--n":index,"--node-accent":item.accent} as CSSProperties} className={selected===studioIndex?"active":""} onMouseEnter={()=>setSelected(studioIndex)} onFocus={()=>setSelected(studioIndex)} onClick={()=>navigate(`/concept-studio/${item.id}`)}><img src={item.asset} alt=""/><span>{item.name.replace(" Studio","")}</span><small>{item.tagline.split('.')[0]}</small></button>})}</div></div>
      <aside className="atlas-right"><article className="atlas-panel atlas-next"><span>CONTINUE LEARNING</span><PhysicsIcon name={featured.icon}/><h2>{featured.name}</h2><p>{featured.tagline}</p><div><small>3 / 6 concepts</small><progress max="100" value={42+selected*4}/></div><ul><li>Measurement <b>Complete</b></li><li>Kinematics <b>Complete</b></li><li>Newton’s Laws <b>In progress</b></li><li>Work and Energy <b>Next</b></li></ul><Link to={`/concept-studio/${featured.id}`}>Open studio</Link></article><article className="atlas-panel atlas-idea"><span>TODAY’S IDEA</span><img src="/assets/astrophysics/galaxy-atlas.png" alt="Galaxy"/><h3>Why do objects fall?</h3><p>Gravity curves space, and objects follow straight paths in curved space.</p><Link to="/concept-studio/gravitation">Explore Gravity →</Link></article></aside>
    </section>
    <section className="atlas-bottom" id="concepts"><article className="atlas-families"><header><span>EXPLORE BY SUBCONCEPT FAMILY</span><a href="#content">View Atlas →</a></header><div>{[{n:"Measurement",i:"/assets/experiments/measurement-errors/measurement-instruments.png",r:"measurement"},{n:"Mechanics",i:"/assets/experiments/inclined-plane/inclined-plane-rig.png",r:"mechanics"},{n:"Waves",i:"/assets/experiments/wave-lab/ripple-tank.png",r:"waves-sound"},{n:"Fields",i:"/assets/experiments/magnetic-field-current/field-mapping-bench.png",r:"magnetism"},{n:"Matter",i:"/assets/experiments/photoelectric-equation/photoelectric-tube.png",r:"modern-physics"},{n:"Universe",i:"/assets/astrophysics/galaxy-atlas.png",r:"astronomy-astrophysics"}].map(item=><button key={item.n} onClick={()=>navigate(`/concept-studio/${item.r}`)}><img src={item.i} alt=""/><b>{item.n}</b><small>Explore connected ideas.</small><em>Explore →</em></button>)}</div></article><article className="atlas-featured"><span>FEATURED INTERACTIVE ACTIVITY</span><div><img src="/assets/experiments/young-double-slit/concept-effect.png" alt="Double-slit interference"/><section><h3>Double-Slit Experiment</h3><p>See how light builds patterns.</p><Link to="/experiments/young-double-slit">Start Studio →</Link></section></div></article></section>
  </main></StudioShell>
}

export function ConceptExperiencesPage(){const {conceptId}=useParams();if(!conceptId)return <PhysicsAtlasPage/>;const studio=studioHomeById.get(conceptId);return studio?<SubjectHome studio={studio}/>:<PhysicsAtlasPage/>}
