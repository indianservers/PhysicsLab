import { useMemo, useState } from "react";
import { Toolbar } from "../components/Toolbar";
import { astroCategories, astrophysicsConcepts } from "../lib/astrophysics";
import { PhysicsIcon } from "../lib/icons";

export function AstroPhysicsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return astrophysicsConcepts.filter((concept) => {
      const categoryMatch = category === "all" || concept.category === category;
      const text = `${concept.title} ${concept.category} ${concept.summary} ${concept.explanation} ${concept.keyIdeas.join(" ")} ${concept.formula ?? ""}`.toLowerCase();
      return categoryMatch && (!q || text.includes(q));
    });
  }, [category, query]);

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="ui-label">AstroPhysics module</p>
              <h1 className="text-3xl font-black text-gradient">AstroPhysics Concepts</h1>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                A focused space-physics learning map for stars, galaxies, relativity, cosmology, observation, and compact objects.
              </p>
            </div>
            <div className="grid min-w-[260px] gap-2 sm:grid-cols-3">
              <Metric label="Concepts" value={astrophysicsConcepts.length} icon="book" />
              <Metric label="Topics" value={astroCategories.length} icon="compass" />
              <Metric label="Formula links" value={astrophysicsConcepts.filter((item) => item.formula).length} icon="calculator" />
            </div>
          </div>
        </section>

        <section className="topic-lens-panel mt-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
            <label className="grid gap-1">
              <span className="ui-label">Search</span>
              <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search black holes, redshift, CMB, exoplanets..." />
            </label>
            <label className="grid gap-1">
              <span className="ui-label">Concept category</span>
              <select className="select-field" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {astroCategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className={category === "all" ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setCategory("all")}>All</button>
            {astroCategories.map((item) => (
              <button key={item} className={category === item ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((concept) => (
            <article key={concept.id} className="enhanced-card concept-card">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-cyan-300/25 bg-cyan-400/10 text-cyan-500">
                  <PhysicsIcon name={concept.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="ui-label">{concept.category}</p>
                  <h2 className="mt-1 text-lg font-black text-slate-800 dark:text-slate-100">{concept.title}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">{concept.summary}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{concept.explanation}</p>
              {concept.formula && (
                <div className="mt-3 rounded-md border border-amber-400/30 bg-amber-400/10 p-3">
                  <p className="ui-label text-amber-600 dark:text-amber-200">Key relation</p>
                  <p className="mt-1 font-mono text-sm font-black">{concept.formula}</p>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {concept.keyIdeas.map((idea) => <span key={idea} className="status-chip">{idea}</span>)}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: "book" | "compass" | "calculator"; label: string; value: number }) {
  return (
    <div className="metric-card">
      <div className="flex items-center gap-2">
        <PhysicsIcon name={icon} className="h-4 w-4 text-cyan-500" />
        <div className="ui-label">{label}</div>
      </div>
      <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
    </div>
  );
}
