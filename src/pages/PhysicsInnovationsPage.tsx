import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { innovationDomains, innovationEras, innovationStats, innovationTypes, PhysicsInnovation, physicsInnovations } from "../lib/physicsInnovations";
import { PhysicsIcon } from "../lib/icons";

export function PhysicsInnovationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get("innovation");
  const initialDomain = searchParams.get("domain") ?? "all";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [domain, setDomain] = useState(innovationDomains.includes(initialDomain) ? initialDomain : "all");
  const [type, setType] = useState(searchParams.get("type") ?? "all");
  const [era, setEra] = useState(searchParams.get("era") ?? "all");
  const [selectedId, setSelectedId] = useState(
    physicsInnovations.some((item) => item.id === initialId) ? initialId ?? physicsInnovations[0].id : physicsInnovations[0].id
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return physicsInnovations.filter((item) => {
      const domainMatch = domain === "all" || item.domain === domain;
      const typeMatch = type === "all" || item.type === type;
      const eraMatch = era === "all" || item.era === era;
      const text = `${item.title} ${item.type} ${item.domain} ${item.era} ${item.year} ${item.principle} ${item.summary} ${item.impact} ${item.tags.join(" ")}`.toLowerCase();
      return domainMatch && typeMatch && eraMatch && (!q || text.includes(q));
    });
  }, [domain, era, query, type]);

  const selected = physicsInnovations.find((item) => item.id === selectedId) ?? filtered[0] ?? physicsInnovations[0];

  const selectInnovation = (item: PhysicsInnovation) => {
    setSelectedId(item.id);
    setSearchParams((params) => {
      params.set("innovation", item.id);
      if (query.trim()) params.set("q", query.trim());
      else params.delete("q");
      if (domain !== "all") params.set("domain", domain);
      else params.delete("domain");
      if (type !== "all") params.set("type", type);
      else params.delete("type");
      if (era !== "all") params.set("era", era);
      else params.delete("era");
      return params;
    });
  };

  const resetFilters = () => {
    setQuery("");
    setDomain("all");
    setType("all");
    setEra("all");
    setSearchParams(selected ? { innovation: selected.id } : {});
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="innovation-page desktop-page">
        <section className="innovation-hero">
          <div className="innovation-hero-copy">
            <p className="ui-label">Explore module</p>
            <h1>Physics Inventions & Discoveries</h1>
            <p>
              A portrait-free interactive explorer of landmark physics ideas, instruments, discoveries, and technologies.
              Search by principle, category, era, or impact.
            </p>
          </div>
          <div className="innovation-metrics" aria-label="Innovation module summary">
            <Metric label="Entries" value={`${innovationStats.total}+`} icon="book" />
            <Metric label="Categories" value={innovationStats.domains} icon="compass" />
            <Metric label="Built tools" value={innovationStats.inventions} icon="spark" />
            <Metric label="Core ideas" value={innovationStats.discoveries} icon="atom" />
          </div>
        </section>

        <section className="innovation-control-bar" aria-label="Innovation filters">
          <label className="innovation-search">
            <span className="ui-label">Search</span>
            <input
              className="search-field"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lasers, gravity, qubits, spectrum, telescope, fission..."
            />
          </label>
          <label>
            <span className="ui-label">Topic</span>
            <select className="select-field" value={domain} onChange={(event) => setDomain(event.target.value)}>
              <option value="all">All topics</option>
              {innovationDomains.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="ui-label">Kind</span>
            <select className="select-field" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="all">All kinds</option>
              {innovationTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="ui-label">Era</span>
            <select className="select-field" value={era} onChange={(event) => setEra(event.target.value)}>
              <option value="all">All eras</option>
              {innovationEras.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <button className="tool-btn innovation-reset" type="button" onClick={resetFilters}>Reset</button>
        </section>

        <section className="innovation-domain-strip" aria-label="Topic shortcuts">
          <button className={domain === "all" ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setDomain("all")}>All</button>
          {innovationDomains.map((item) => (
            <button key={item} className={domain === item ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setDomain(item)}>
              {item}
            </button>
          ))}
        </section>

        <section className="innovation-layout">
          <aside className="innovation-results" aria-label="Physics inventions and discoveries">
            <div className="innovation-results-head">
              <div>
                <p className="ui-label">Results</p>
                <h2>{filtered.length} physics milestones</h2>
              </div>
              <span className="status-chip">{domain === "all" ? "All topics" : domain}</span>
            </div>
            <div className="innovation-card-list">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === selected.id ? "innovation-card innovation-card-active" : "innovation-card"}
                  onClick={() => selectInnovation(item)}
                >
                  <span className="innovation-card-icon"><PhysicsIcon name={item.icon} /></span>
                  <span className="innovation-card-body">
                    <span className="innovation-card-meta">{item.year} - {item.type} - {item.domain}</span>
                    <strong>{item.title}</strong>
                    <small>{item.principle}</small>
                  </span>
                </button>
              ))}
              {!filtered.length && (
                <div className="enhanced-card">
                  <p className="font-bold text-slate-700 dark:text-slate-200">No matching milestone found.</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Try a broader search such as waves, energy, detector, light, gravity, or quantum.</p>
                </div>
              )}
            </div>
          </aside>

          <section className="innovation-stage" aria-label="Selected innovation detail">
            <InnovationVisual item={selected} />
            <div className="innovation-detail-copy">
              <div className="flex flex-wrap items-center gap-2">
                <span className="status-chip">{selected.type}</span>
                <span className="status-chip">{selected.domain}</span>
                <span className="status-chip">{selected.era}</span>
              </div>
              <p className="ui-label mt-4">{selected.year}</p>
              <h2>{selected.title}</h2>
              <div className="innovation-principle">
                <span>Physics principle</span>
                <strong>{selected.principle}</strong>
              </div>
              <p>{selected.summary}</p>
              <div className="innovation-impact">
                <PhysicsIcon name="spark" className="h-5 w-5" />
                <div>
                  <span>Why it changed physics</span>
                  <strong>{selected.impact}</strong>
                </div>
              </div>
              <div className="innovation-tag-row">
                {selected.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </section>

          <aside className="innovation-map" aria-label="Category map">
            <p className="ui-label">Topic map</p>
            <h2>Jump by physics area</h2>
            <div className="innovation-map-grid">
              {innovationDomains.map((item) => {
                const count = physicsInnovations.filter((innovation) => innovation.domain === item).length;
                return (
                  <button key={item} type="button" className={domain === item ? "innovation-map-chip innovation-map-chip-active" : "innovation-map-chip"} onClick={() => setDomain(item)}>
                    <span>{item}</span>
                    <strong>{count}</strong>
                  </button>
                );
              })}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: "atom" | "book" | "compass" | "spark"; label: string; value: string | number }) {
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

function InnovationVisual({ item }: { item: PhysicsInnovation }) {
  return (
    <div className="innovation-visual" data-domain={item.domain}>
      <div className="innovation-orbit innovation-orbit-a" />
      <div className="innovation-orbit innovation-orbit-b" />
      <div className="innovation-wave-line" />
      <div className="innovation-visual-core">
        <PhysicsIcon name={item.icon} className="h-20 w-20" />
      </div>
      <div className="innovation-particle innovation-particle-a" />
      <div className="innovation-particle innovation-particle-b" />
      <div className="innovation-particle innovation-particle-c" />
      <span className="innovation-visual-label">{item.type}</span>
    </div>
  );
}

