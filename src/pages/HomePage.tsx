import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studioHomes } from "../lib/conceptStudioHomes";
import { experiments } from "../lib/experiments";
import { referenceLabsByStudio } from "../lib/studioReferenceLabs";
import { PhysicsIcon, type PhysicsIconName } from "../lib/icons";
import "./home-premium.css";

const categories: Array<{ title: string; group: string; categories: string[]; description: string; icon: PhysicsIconName }> = [
  { title: "Motion & Forces", group: "motion", categories: ["Mechanics", "Fluid Mechanics", "Measurement"], description: "Motion, force, gravity, fluids and measurement", icon: "gauge" },
  { title: "Energy & Matter", group: "matter", categories: ["Energy", "Thermodynamics"], description: "Energy, heat, gases, phases and radiation", icon: "thermometer" },
  { title: "Electricity & Magnetism", group: "electricity", categories: ["Electricity", "Magnetism", "Electronics"], description: "Charge, circuits, fields, magnets and electronics", icon: "battery" },
  { title: "Waves & Light", group: "waves", categories: ["Waves", "Oscillations", "Optics"], description: "Sound, waves, colour, lenses and interference", icon: "wave" },
  { title: "Modern Physics & Space", group: "modern", categories: ["Modern Physics", "Astronomy"], description: "Atoms, nuclei, quantum physics and the universe", icon: "atom" },
];

const homeStudios = [
  { id: "overview", name: "Concept Overview", tagline: "Explore every branch of physics and choose your learning path.", icon: "atom" as PhysicsIconName, asset: "/assets/concept-studio/mechanics-hero.png", route: "/concept-studio" },
  ...studioHomes.map(studio => ({ ...studio, route: `/concept-studio/${studio.id}` })),
];

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const search = (event: FormEvent) => { event.preventDefault(); const value = query.trim(); navigate(value ? `/experiments?q=${encodeURIComponent(value)}` : "/experiments"); };

  return (
    <div className="simple-home">
      <header className="simple-home-nav">
        <Link className="simple-brand" to="/"><PhysicsIcon name="atom" /><span>PhysicsLab</span></Link>
        <nav aria-label="Primary navigation"><Link to="/experiments">Browse labs</Link><Link to="/concept-studio">Learn by subject</Link><Link to="/all-modules">Tools</Link><Link to="/settings">Settings</Link></nav>
      </header>
      <main id="content" className="simple-home-main">
        <section className="simple-hero">
          <div><span className="simple-kicker">INTERACTIVE PHYSICS</span><h1>Choose a topic.<br/><em>Start experimenting.</em></h1><p>Lessons, simulations and measurement tools—organized around the physics you want to learn.</p>
            <form className="simple-search" onSubmit={search} role="search"><PhysicsIcon name="search" /><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search torque, waves, colour, nuclei…" aria-label="Search experiments"/><button type="submit">Search</button></form>
          </div>
          <aside className="simple-start-card"><span>QUICK START</span><strong>Learn by experimenting</strong><p style={{ color: "#bcd0d8", WebkitTextFillColor: "#bcd0d8" }}>Pick a guided lab and change one variable at a time.</p><Link to="/experiments">Choose an experiment <b>→</b></Link></aside>
        </section>

        <section className="simple-section" aria-labelledby="studio-title">
          <header><div><span className="simple-kicker">LEARN BY SUBJECT</span><h2 id="studio-title">Explore all {homeStudios.length} studios</h2></div><Link to="/concept-studio">View concept overview &rarr;</Link></header>
          <div className="home-studio-grid">
            {homeStudios.map((studio, index) => (
              <Link className="home-studio-card" key={studio.id} to={studio.route}>
                <div className="home-studio-image"><img src={studio.asset} alt="" loading="lazy"/><span>{String(index + 1).padStart(2, "0")}</span></div>
                <div className="home-studio-copy"><span className="simple-category-icon"><PhysicsIcon name={studio.icon}/></span><h3>{studio.name}</h3><p>{studio.tagline}</p><span className="home-studio-open">Open studio <b aria-hidden="true">&rarr;</b></span></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="simple-section home-topic-directory" aria-labelledby="topics-title">
          <header><div><span className="simple-kicker">OPEN A TOPIC</span><h2 id="topics-title">All studio topics by category</h2></div><p>{Object.values(referenceLabsByStudio).flat().length} interactive topic pages</p></header>
          <nav className="home-topic-index" aria-label="Jump to topic category">
            {studioHomes.map(studio => <a key={studio.id} href={`#topics-${studio.id}`}><PhysicsIcon name={studio.icon}/>{studio.name}</a>)}
          </nav>
          {studioHomes.map(studio => {
            const topics = referenceLabsByStudio[studio.id] ?? [];
            return <section className="home-topic-category" id={`topics-${studio.id}`} key={studio.id} aria-labelledby={`topics-heading-${studio.id}`}>
              <header><div><span className="simple-category-icon"><PhysicsIcon name={studio.icon}/></span><div><h3 id={`topics-heading-${studio.id}`}>{studio.name}</h3><p>{studio.tagline}</p></div></div><Link to={`/concept-studio/${studio.id}`}>Explore category &rarr;</Link></header>
              <div className="home-topic-grid">{topics.map(topic => <Link className="home-topic-card" key={topic.route} to={topic.route}><PhysicsIcon name={studio.icon}/><span><strong>{topic.title}</strong><small>{studio.name}</small></span><b aria-hidden="true">&rarr;</b></Link>)}</div>
            </section>;
          })}
        </section>

        <section className="simple-section" aria-labelledby="category-title">
          <header><div><span className="simple-kicker">EXPLORE</span><h2 id="category-title">Choose a branch of physics</h2></div><Link to="/experiments">All {experiments.length} experiments</Link></header>
          <div className="simple-category-grid simple-category-five">{categories.map(item => { const count=experiments.filter(experiment=>item.categories.includes(experiment.category)).length; return <Link key={item.group} to={`/experiments?group=${item.group}`}><span className="simple-category-icon"><PhysicsIcon name={item.icon}/></span><span><strong>{item.title}</strong><small>{item.description}</small></span><b>{count}</b></Link>; })}</div>
        </section>

        <details className="simple-more"><summary>Need a specific tool?</summary><div><Link to="/sandbox">Open Lab</Link><Link to="/syllabus">Syllabus</Link><Link to="/formulas">Formula Bank</Link><Link to="/graphs">Graph Studio</Link><Link to="/quiz">Quiz</Link><Link to="/teacher">Teacher Workspace</Link><Link to="/all-modules">All tools</Link></div></details>
      </main>
    </div>
  );
}
