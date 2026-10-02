import { Upcoming3DSimulation } from "../components/Upcoming3DSimulation";
import { CSSProperties, ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PhysicsIcon } from "../lib/icons";
import { ConceptStudioThreeScene } from "../components/ConceptStudioThreeScene";
import { studioHomeById, studioHomes, type StudioHome } from "../lib/conceptStudioHomes";
import "../concept-studio-homes.css";
import { PhysicsAtlasPage } from './PhysicsAtlasPage';

const mainNav = ["Learn", "Practice", "Challenges", "Progress", "Reference"];

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

function SubjectHome({studio}:{studio:StudioHome}){
  const [query,setQuery]=useState(""); const [active,setActive]=useState(0); const [notice,setNotice]=useState("");
  const visible=useMemo(()=>studio.concepts.filter(item=>(item.title+item.detail).toLowerCase().includes(query.toLowerCase())),[query,studio]);
  useEffect(()=>{setActive(0);setNotice("")},[studio.id]);
  const perform=(message:string)=>{setNotice(message);window.setTimeout(()=>setNotice(""),2400)};
  return <StudioShell studio={studio}><main className={`csh-main csh-${studio.variant} csh-subject-${studio.id}`} id="content">
    <StudioTop studio={studio} onSearch={setQuery}/>
    <section className="csh-hero">
      <div className="csh-hero-copy"><span>{studio.eyebrow}</span><h1>{studio.name}</h1><p className="csh-hero-tagline">{studio.tagline}</p><p className="csh-hero-focus"><b>{studio.concepts[active]?.title}:</b> {studio.concepts[active]?.detail}</p>{studio.id === "motion-kinematics" && <><Link to="/motion/position-time">Position–Time <b>→</b></Link><Link to="/motion/velocity-time" style={{marginLeft:8}}>Velocity–Time <b>→</b></Link><Link to="/motion/acceleration-time" style={{marginLeft:8,marginTop:8}}>Acceleration–Time <b>→</b></Link><Link to="/motion/projectile-motion" style={{marginLeft:8,marginTop:8}}>Projectile Motion <b>→</b></Link><Link to="/motion/relative-motion" style={{marginLeft:8,marginTop:8}}>Relative Motion <b>→</b></Link><Link to="/motion/second-law-fma" style={{marginLeft:8,marginTop:8}}>Second Law <b>→</b></Link><Link to="/motion/first-law-inertia" style={{marginLeft:8,marginTop:8}}>First Law / Inertia <b>→</b></Link><Link to="/motion/circular-motion" style={{marginLeft:8,marginTop:8}}>Circular Motion <b>→</b></Link></>}<div><Link to={studio.startRoute}>Start interactive lab <b>→</b></Link>{studio.id === "mechanics" && <><Link to="/mechanics/free-body-diagrams">Free-Body Diagrams <b>→</b></Link><Link to="/mechanics/inclined-plane">Inclined Plane <b>→</b></Link><Link to="/mechanics/pulley-systems">Pulley Systems <b>→</b></Link><Link to="/mechanics/torque-levers">Torque &amp; Levers <b>→</b></Link><Link to="/mechanics/equilibrium-com">Equilibrium &amp; COM <b>→</b></Link><Link to="/mechanics/momentum-collisions">Momentum &amp; Collisions <b>→</b></Link></>}{studio.id === "measurement" && <><Link to="/measurement/meter-scale">Meter Scale <b>→</b></Link><Link to="/measurement/vernier-caliper">Vernier Caliper <b>→</b></Link><Link to="/measurement/micrometer">Micrometer <b>→</b></Link><Link to="/measurement/spherometer">Spherometer <b>→</b></Link><Link to="/measurement/mass-time">Mass &amp; Time <b>→</b></Link><Link to="/measurement/uncertainty">Uncertainty <b>→</b></Link></>}</div></div>
      <Upcoming3DSimulation title={studio.concepts[active]?.title ?? studio.name} />
    </section>
    <section className="csh-concepts" id="concepts"><header><div><span>EXPLORE THE SUBJECT</span><h2>Core concepts</h2></div><p>Select a concept to explore its explanation.</p></header>
      <div className="csh-concept-grid">{visible.map(item=>{const index=studio.concepts.indexOf(item);return <button key={item.title} className={active===index?"active":""} onClick={()=>setActive(index)}><span className="csh-concept-visual" style={{backgroundImage:`url(${studio.asset})`,backgroundPosition:`${index*18}% center`}}><PhysicsIcon name={item.icon}/></span><span><b>{item.title}</b><small>{item.detail}</small></span><em>0{index+1}</em></button>})}</div>
    </section>
    <section className="csh-workspace" id="activities">
      <article className="csh-feature"><span>FEATURED INVESTIGATION</span><h2>{studio.activities[active%studio.activities.length].title}</h2><p>{studio.activities[active%studio.activities.length].detail}</p><button onClick={()=>perform(`${studio.activities[active%studio.activities.length].title} ready`)}>{studio.activities[active%studio.activities.length].action} <b>→</b></button><div className="csh-feature-viz"><img src={studio.asset} alt=""/><i/><i/><i/></div></article>
      <div className="csh-activity-list">{studio.activities.map((item,index)=><button key={item.title} onClick={()=>{setActive(index);perform(`${item.title} selected`)}}><span className="csh-activity-thumb" style={{backgroundImage:`url(${studio.asset})`,backgroundPosition:`${20+index*34}% center`}}><PhysicsIcon name={studio.concepts[index%studio.concepts.length].icon}/></span><div><b>{item.title}</b><small>{item.detail}</small><i style={{width:`${45+index*18}%`}}/></div><em>↗</em></button>)}</div>
      <aside className="csh-progress"><span>3D SIMULATION</span><h3>Upcoming</h3><p>Explore the dedicated lab for this subject.</p><Link to={studio.startRoute}>Open full lab</Link></aside>
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
