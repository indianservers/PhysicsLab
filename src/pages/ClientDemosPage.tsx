import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { clientDemos } from "../lib/clientDemos";
import { PhysicsIcon } from "../lib/icons";

export function ClientDemosPage() {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All");
  const demos = useMemo(() => clientDemos.filter((demo) => (category === "All" || demo.category === category) && [demo.title, demo.category, demo.pitch, ...demo.show].join(" ").toLowerCase().includes(query.toLowerCase())), [query, category]);
  return <div className="client-demos-page" data-ui-theme="dark"><Toolbar /><main id="content" className="client-demo-shell">
    <header className="client-demo-hero"><div><span>CLIENT PRESENTATION MODE · 15 LIVE EXPERIENCES</span><h1>The strongest PhysicsLab 100 demos, <em>in presentation order.</em></h1><p>Begin with the flagship Pro Lab, transition into visually memorable science, demonstrate hands-on experimentation, and close with the complete education platform.</p><div><Link to={clientDemos[0].path}>Start the presentation</Link><button onClick={() => window.print()}>Print presenter guide</button></div></div><aside><span>RECOMMENDED SESSION</span><b>45–60</b><small>MINUTES</small><dl><div><dt>Flagship</dt><dd>3 demos</dd></div><div><dt>Immersive science</dt><dd>6 demos</dd></div><div><dt>Interactive labs</dt><dd>4 demos</dd></div><div><dt>Platform value</dt><dd>2 demos</dd></div></dl></aside></header>
    <section className="client-demo-controls" aria-label="Filter client demonstrations"><label><PhysicsIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search demos, outcomes, or presentation moments..." /></label><div>{["All", "Flagship", "Immersive Science", "Interactive Lab", "Education Platform"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><span>{demos.length} demonstrations</span></section>
    <section className="client-demo-grid">{demos.map((demo) => <article key={demo.rank} data-accent={demo.accent}><header><b>{String(demo.rank).padStart(2, "0")}</b><span><PhysicsIcon name={demo.icon} /></span><small>{demo.category} · {demo.duration}</small></header><h2>{demo.title}</h2><p>{demo.pitch}</p><div><span>WHAT TO SHOW</span><ol>{demo.show.map((step) => <li key={step}>{step}</li>)}</ol></div><footer><Link to={demo.path}>Launch live demo <b>↗</b></Link><small>DEMO {String(demo.rank).padStart(2, "0")} / 15</small></footer></article>)}</section>
    {demos.length === 0 && <div className="client-demo-empty">No presentation demos match this search. <button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
    <section className="client-demo-script"><span>PRESENTATION CLOSE</span><h2>One connected platform—from curiosity to evidence.</h2><p>PhysicsLab 100 combines premium scientific visualization, authentic laboratory workflows, curriculum guidance, assessment, teacher operations, accessibility, and local validation in one searchable environment.</p><Link to="/comparison">Open platform comparison →</Link></section>
  </main></div>;
}
