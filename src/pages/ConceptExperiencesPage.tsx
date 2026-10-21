import { referenceLabsByStudio } from "../lib/studioReferenceLabs";
import { CSSProperties, ReactNode, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PhysicsIcon } from "../lib/icons";
import { ConceptStudioThreeScene } from "../components/ConceptStudioThreeScene";
import { studioHomeById, studioHomes, type StudioHome } from "../lib/conceptStudioHomes";
import "../concept-studio-homes.css";
import { PhysicsAtlasPage } from './PhysicsAtlasPage';

const mainNav = ["Labs", "Concepts", "Activities"];

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
    <nav aria-label="Studio sections"><Link to="/studios">All studios</Link>{mainNav.map((item,index)=><button key={item} onClick={()=>document.querySelector(["#labs", "#concepts", "#activities"][index])?.scrollIntoView({behavior:"smooth"})}>{item}</button>)}</nav>
    <label className="csh-search"><PhysicsIcon name="search"/><input key={studio?.id} aria-label="Search this studio" placeholder="Search this studio" onChange={event=>onSearch?.(event.target.value)}/><kbd>⌘ K</kbd></label>
  </header>
}

function SubjectHome({studio}:{studio:StudioHome}){
  const labs=referenceLabsByStudio[studio.id]??[];
  const [query,setQuery]=useState("");
  const visibleLabs=labs.filter(lab=>lab.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="csh csh-labs-only" data-ui-theme="dark" style={{"--studio-accent":studio.accent} as CSSProperties}>
    <main className={`csh-main csh-${studio.variant} csh-subject-${studio.id}`} id="content">
      <header className="csh-top"><div className="csh-brand"><span className="csh-brand-mark"><PhysicsIcon name={studio.icon}/></span><span><b>{studio.name}</b><small>INTERACTIVE PHYSICS LABS</small></span></div><label className="csh-search"><PhysicsIcon name="search"/><input type="search" aria-label="Search this studio" placeholder="Search these six labs" value={query} onChange={e=>setQuery(e.target.value)}/></label></header>
      <section className="csh-reference-labs" id="labs"><header><span>{labs.length} INTERACTIVE LABS</span><h1>{studio.name}</h1><p>{studio.tagline}</p></header><div className="csh-lab-cards" aria-label={`${studio.name} labs`}>{visibleLabs.map(lab=><Link className="csh-lab-card" key={lab.route} to={lab.route}><div className="csh-lab-art"><img src={studio.asset} alt="" loading="lazy"/><span><PhysicsIcon name={studio.icon}/></span><small>LAB {String(labs.indexOf(lab)+1).padStart(2,"0")}</small></div><div className="csh-lab-copy"><h2>{lab.title}</h2><p>Predict, investigate and explain {lab.title.toLowerCase()}.</p><span>Open lab <b aria-hidden="true">→</b></span></div></Link>)}</div><p role="status">{visibleLabs.length} of {labs.length} labs{query&&` matching “${query}”`}</p></section>
    </main>
  </div>;
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

export function StudiosHomePage(){
  const [query,setQuery]=useState("");
  const studios=studioHomes.filter(studio=>(studio.name+" "+studio.tagline).toLowerCase().includes(query.toLowerCase()));
  return <StudioShell><main className="csh-main csh-directory" id="content"><header className="csh-directory-heading"><Link to="/concept-studio">← Physics Atlas</Link><span>EXPLORE PHYSICS</span><h1>Find your studio</h1><p>16 studios. 96 interactive labs. Choose a subject and start exploring.</p><label>Search studios<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search optics, mechanics, waves…"/></label></header><section className="csh-studio-grid" aria-label="All studios">{studios.map(studio=><Link className="csh-lab-card" key={studio.id} to={`/concept-studio/${studio.id}`} style={{"--studio-accent":studio.accent} as CSSProperties}><div className="csh-lab-art"><img src={studio.asset} alt="" loading="lazy"/><span><PhysicsIcon name={studio.icon}/></span><small>{referenceLabsByStudio[studio.id]?.length??0} LABS</small></div><div className="csh-lab-copy"><h2>{studio.name}</h2><p>{studio.tagline}</p><span>Explore studio <b aria-hidden="true">→</b></span></div></Link>)}</section>{studios.length===0&&<p role="status">No studios found. Try a different subject.</p>}</main></StudioShell>
}
