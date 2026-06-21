import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon, PhysicsIconName, iconForExperiment, iconForTool } from "../lib/icons";
import { experiments } from "../lib/experiments";
import { buildConceptCards, ConceptCard, conceptJourney, conceptLibraryStats } from "../lib/concepts";
import { InteractionModePanel } from "../components/InteractionModePanel";

const classFilters = ["all", "6", "7", "8", "9", "10", "11", "12", "advanced"];
const depthLabels: Record<ConceptCard["depth"], string> = {
  foundation: "Foundation",
  board: "Board",
  advanced: "Advanced",
  research: "Research",
};

export function ConceptsPage() {
  const [params, setParams] = useSearchParams();
  const cards = useMemo(() => buildConceptCards(), []);
  const stats = conceptLibraryStats(cards);
  const experimentById = useMemo(() => new Map(experiments.map((experiment) => [experiment.id, experiment])), []);
  const domains = useMemo(() => ["all", ...Array.from(new Set(cards.map((card) => card.domain))).sort()], [cards]);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState(params.get("domain") ?? "all");
  const [classFilter, setClassFilter] = useState(params.get("class") ?? "all");
  const selectedId = params.get("concept") ?? cards[0]?.id ?? "";
  const filtered = cards.filter((card) => {
    const searchText = [
      card.id,
      card.title,
      card.domain,
      card.classLabel,
      card.unitTitle,
      card.summary,
      card.outcomes.join(" "),
      card.tools.join(" "),
      card.essentials.join(" "),
      card.misconception,
    ].join(" ").toLowerCase();
    const textMatch = searchText.includes(query.toLowerCase());
    const domainMatch = domain === "all" || card.domain === domain;
    const classMatch = classFilter === "all" || (classFilter === "advanced" ? card.grade > 12 : card.grade === Number(classFilter));
    return textMatch && domainMatch && classMatch;
  });
  const selected = filtered.find((card) => card.id === selectedId) ?? cards.find((card) => card.id === selectedId) ?? filtered[0] ?? cards[0];

  const selectConcept = (id: string) => {
    const next = new URLSearchParams(params);
    next.set("concept", id);
    if (domain !== "all") next.set("domain", domain);
    if (classFilter !== "all") next.set("class", classFilter);
    setParams(next);
  };
  const conceptHref = (id: string) => {
    const next = new URLSearchParams(params);
    next.set("concept", id);
    if (domain !== "all") next.set("domain", domain);
    else next.delete("domain");
    if (classFilter !== "all") next.set("class", classFilter);
    else next.delete("class");
    return `/concepts?${next.toString()}`;
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="mx-auto max-w-[1500px] px-3 py-4">
        <section className="page-hero mesh-bg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="ui-label">Phase 2 concept library</p>
              <h1 className="text-3xl font-black text-gradient">Physics concepts</h1>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Short concept cards with essentials, misconception repair, learning path, and direct jumps into 2D and 3D labs.
              </p>
            </div>
            <div className="grid min-w-[280px] gap-2 sm:grid-cols-4">
              <Metric icon="book" label="Concepts" value={stats.concepts} />
              <Metric icon="flask" label="Interactive" value={stats.interactive} />
              <Metric icon="compass" label="Domains" value={stats.domains} />
              <Metric icon="spark" label="Advanced" value={stats.advanced} />
            </div>
          </div>
        </section>

        <section className="topic-lens-panel mt-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_360px]">
            <label className="grid gap-1">
              <span className="ui-label">Search</span>
              <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search force, light, AC, nuclei..." />
            </label>
            <label className="grid gap-1">
              <span className="ui-label">Domain</span>
              <select className="select-field" value={domain} onChange={(event) => setDomain(event.target.value)}>
                {domains.map((item) => <option key={item} value={item}>{item === "all" ? "All domains" : item}</option>)}
              </select>
            </label>
            <div>
              <p className="ui-label">Class</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {classFilters.map((item) => (
                  <button key={item} className={classFilter === item ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setClassFilter(item)}>
                    {item === "all" ? "All" : item === "advanced" ? "UG+" : item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filtered.length === 0 && (
              <div className="panel p-5 md:col-span-2 2xl:col-span-3">
                <h2 className="panel-title">No concepts found</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Try a broader word like force, field, light, current, heat, wave, or motion.</p>
              </div>
            )}
            {filtered.map((card) => {
              const firstLab = card.experimentIds[0] ? experimentById.get(card.experimentIds[0]) : undefined;
              const launchTarget = firstLab ? `/experiments/${firstLab.id}` : card.topicPath;
              return (
                <article key={card.id} className={selected?.id === card.id ? "enhanced-card concept-card concept-card-active" : "enhanced-card concept-card"}>
                  <button className="concept-card-main text-left" type="button" onClick={() => selectConcept(card.id)} aria-label={`Open ${card.title} concept details`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="ui-label">{card.classLabel} / {card.domain}</p>
                        <h2 className="mt-1 text-lg font-black text-slate-800 dark:text-slate-100">{card.title}</h2>
                      </div>
                      <span className="status-chip">{depthLabels[card.depth]}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">{card.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {card.essentials.map((item) => <span key={item} className="status-chip">{item}</span>)}
                    </div>
                    {firstLab && (
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-cyan-600 dark:text-cyan-300">
                        <PhysicsIcon name={iconForExperiment(firstLab)} className="h-3.5 w-3.5" />{firstLab.title}
                      </span>
                    )}
                  </button>
                  <div className="concept-card-actions" aria-label={`${card.title} actions`}>
                    <Link to={conceptHref(card.id)} className="concept-card-action concept-card-action-secondary" onClick={() => selectConcept(card.id)}>
                      <PhysicsIcon name="book" className="h-4 w-4" />
                      Open
                    </Link>
                    <Link to={launchTarget} className="concept-card-action concept-card-action-primary">
                      <PhysicsIcon name={firstLab ? "flask" : "spark"} className="h-4 w-4" />
                      Launch
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {selected && (
            <aside className="panel h-fit p-4 xl:sticky xl:top-20">
              <InteractionModePanel experiment={selected.experimentIds[0] ? experimentById.get(selected.experimentIds[0]) : undefined} conceptTitle={selected.title} compact />
              <p className="ui-label">{selected.classLabel} learning journey</p>
              <h2 className="mt-1 text-2xl font-black">{selected.title}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{selected.summary}</p>
              <div className="mt-4 grid gap-2">
                {conceptJourney(selected).map((step, index) => (
                  <Link key={step.id} to={step.target ?? selected.topicPath} className="concept-journey-step">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-sm font-black text-cyan-500">{index + 1}</span>
                    <span className="min-w-0">
                      <strong>{step.label}</strong>
                      <span>{step.detail}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-4 rounded-md border border-amber-400/35 bg-amber-400/10 p-3">
                <p className="ui-label text-amber-600 dark:text-amber-200">Misconception repair</p>
                <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">{selected.misconception}</p>
              </div>
              <div className="mt-4">
                <p className="ui-label">Tools</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.tools.slice(0, 6).map((tool) => (
                    <span key={tool} className="status-chip"><PhysicsIcon name={iconForTool(tool)} className="h-3.5 w-3.5" />{tool}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={selected.topicPath} className="hero-btn-secondary inline-flex items-center gap-2"><PhysicsIcon name="book" className="h-4 w-4" />Topic</Link>
                {selected.experimentIds[0] && <Link to={`/experiments/${selected.experimentIds[0]}`} className="hero-btn inline-flex items-center gap-2"><PhysicsIcon name="flask" className="h-4 w-4" />Open lab</Link>}
              </div>
            </aside>
          )}
        </section>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: PhysicsIconName; label: string; value: number }) {
  return (
    <div className="metric-card flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
        <PhysicsIcon name={icon} />
      </span>
      <div>
        <div className="ui-label">{label}</div>
        <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
      </div>
    </div>
  );
}
