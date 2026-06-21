import { ReactNode, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { ConceptThreeScene } from "../components/ConceptThreeScene";
import { ParticlePhysicsConcept, ParticleVisual, particlePhysicsCategories, particlePhysicsConcepts, particlePhysicsStats } from "../lib/particlePhysics";
import { PhysicsIcon } from "../lib/icons";

const orbitPositions = [
  { x: 50, y: 8 },
  { x: 72, y: 15 },
  { x: 88, y: 34 },
  { x: 88, y: 61 },
  { x: 72, y: 82 },
  { x: 50, y: 91 },
  { x: 27, y: 82 },
  { x: 12, y: 62 },
  { x: 12, y: 36 },
  { x: 28, y: 15 },
  { x: 50, y: 28 },
  { x: 50, y: 72 },
];

export function ParticlePhysicsPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [threeMode, setThreeMode] = useState(0);
  const [interactionEnergy, setInteractionEnergy] = useState(0.58);
  const requestedConcept = searchParams.get("concept");
  const initialConcept = particlePhysicsConcepts.some((concept) => concept.id === requestedConcept) ? requestedConcept ?? "" : particlePhysicsConcepts[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(initialConcept);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return particlePhysicsConcepts.filter((concept) => {
      const categoryMatch = category === "all" || concept.category === category;
      const text = [
        concept.title,
        concept.category,
        concept.summary,
        concept.explanation,
        concept.equation ?? "",
        concept.misconception,
        concept.classroomPrompt,
        ...concept.keyIdeas,
      ].join(" ").toLowerCase();
      return categoryMatch && (!q || text.includes(q));
    });
  }, [category, query]);

  const selected = particlePhysicsConcepts.find((concept) => concept.id === selectedId) ?? filtered[0] ?? particlePhysicsConcepts[0];

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="particle-page desktop-page">
        <section className="particle-hero">
          <div className="particle-hero-copy">
            <p className="ui-label">Particle physics module</p>
            <h1>Powerful Concepts in Particle Physics</h1>
            <p>
              A corrected, visual map of Standard Model ideas with crisp original icons, misconception checks, and classroom prompts.
            </p>
          </div>
          <div className="particle-hero-metrics" aria-label="Particle physics module summary">
            <Metric icon="atom" label="Concepts" value={particlePhysicsStats.concepts} />
            <Metric icon="book" label="Categories" value={particlePhysicsStats.categories} />
            <Metric icon="check" label="Checks" value={particlePhysicsStats.misconceptionChecks} />
          </div>
        </section>

        <section className="particle-three-lab" aria-label="Interactive 3D particle physics blueprint">
          <div className="particle-three-copy">
            <p className="ui-label">Interactive 3D blueprint</p>
            <h2>Matter, forces, Higgs, and collider view</h2>
            <p>Switch scenes to compare fermions, force carriers, hadrons, Higgs excitation, and high-energy collision evidence.</p>
            <div className="particle-three-controls">
              {["All", "Matter", "Forces", "Collider", "Higgs"].map((item, index) => (
                <button key={item} className={threeMode === index ? "string-mode-btn string-mode-btn-active" : "string-mode-btn"} type="button" onClick={() => setThreeMode(index)}>
                  <span>{index + 1}</span>
                  {item}
                </button>
              ))}
            </div>
            <label className="string-slider">
              <span>Interaction energy</span>
              <input type="range" min="0" max="1" step="0.01" value={interactionEnergy} onChange={(event) => setInteractionEnergy(Number(event.target.value))} />
              <strong>{Math.round(interactionEnergy * 100)}%</strong>
            </label>
          </div>
          <ConceptThreeScene variant="particles" mode={threeMode} intensity={interactionEnergy} />
        </section>

        <section className="particle-workspace">
          <aside className="particle-filter-panel" aria-label="Particle physics controls">
            <div>
              <p className="ui-label">Search</p>
              <input
                className="search-field"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Higgs, quarks, neutrinos..."
              />
            </div>
            <div>
              <p className="ui-label">Topic category</p>
              <div className="particle-filter-list">
                <button className={category === "all" ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setCategory("all")}>All</button>
                {particlePhysicsCategories.map((item) => (
                  <button key={item} className={category === item ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setCategory(item)}>{item}</button>
                ))}
              </div>
            </div>
            <div className="particle-note">
              <PhysicsIcon name="check" className="h-4 w-4" />
              Poster-like labels have been corrected to accepted particle-physics terminology.
            </div>
          </aside>

          <section className="particle-map-card" aria-label="Visual particle physics concept map">
            <div className="particle-map-head">
              <div>
                <p className="ui-label">Visual dictionary map</p>
                <h2>Standard Model concept field</h2>
              </div>
              <span className="status-chip">{filtered.length} visible</span>
            </div>
            <div className="particle-orbit-map">
              <svg className="particle-map-lines" viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#facc15" stopOpacity="0.95" />
                    <stop offset="48%" stopColor="#22d3ee" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="18" fill="url(#particleGlow)" />
                {[0, 58, 116].map((angle) => (
                  <ellipse key={angle} cx="50" cy="50" rx="31" ry="11" transform={`rotate(${angle} 50 50)`} />
                ))}
                {particlePhysicsConcepts.map((concept, index) => {
                  const position = orbitPositions[index % orbitPositions.length];
                  return <line key={concept.id} x1="50" y1="50" x2={position.x} y2={position.y} />;
                })}
              </svg>
              <button className="particle-core-node" type="button" onClick={() => setSelectedId("standard-model")}>
                <ParticleConceptIcon visual="standard-model" compact />
                <span>Standard Model</span>
              </button>
              {particlePhysicsConcepts.map((concept, index) => {
                const position = orbitPositions[index % orbitPositions.length];
                const visible = filtered.some((item) => item.id === concept.id);
                return (
                  <button
                    key={concept.id}
                    type="button"
                    className={`particle-map-node${selected.id === concept.id ? " particle-map-node-active" : ""}${visible ? "" : " particle-map-node-muted"}`}
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                    onClick={() => setSelectedId(concept.id)}
                    title={concept.title}
                  >
                    <ParticleConceptIcon visual={concept.visual} compact />
                    <span>{concept.title}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="particle-detail-panel" aria-label="Selected particle physics concept">
            <ParticleConceptIcon visual={selected.visual} />
            <p className="ui-label">{selected.category}</p>
            <h2>{selected.title}</h2>
            <p className="particle-summary">{selected.summary}</p>
            <p>{selected.explanation}</p>
            {selected.equation && (
              <div className="particle-equation">
                <span>Key relation</span>
                <strong>{selected.equation}</strong>
              </div>
            )}
            <div className="particle-chip-row">
              {selected.keyIdeas.map((idea) => <span key={idea} className="status-chip">{idea}</span>)}
            </div>
            <div className="particle-teaching-card">
              <span>Misconception check</span>
              <p>{selected.misconception}</p>
            </div>
            <div className="particle-teaching-card">
              <span>Classroom prompt</span>
              <p>{selected.classroomPrompt}</p>
            </div>
          </aside>
        </section>

        <section className="particle-concept-grid" aria-label="Particle physics concept cards">
          {filtered.map((concept) => (
            <article key={concept.id} className="particle-concept-card" onClick={() => setSelectedId(concept.id)}>
              <div className="particle-card-top">
                <ParticleConceptIcon visual={concept.visual} compact />
                <div>
                  <p className="ui-label">{concept.category}</p>
                  <h2>{concept.title}</h2>
                </div>
              </div>
              <p>{concept.summary}</p>
              <div className="particle-chip-row">
                {concept.keyIdeas.slice(0, 3).map((idea) => <span key={idea} className="status-chip">{idea}</span>)}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: "atom" | "book" | "check"; label: string; value: number }) {
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

function ParticleConceptIcon({ visual, compact = false }: { visual: ParticleVisual; compact?: boolean }) {
  const sizeClass = compact ? "particle-icon particle-icon-compact" : "particle-icon";
  return (
    <span className={sizeClass} data-visual={visual} aria-hidden="true">
      <svg viewBox="0 0 96 96" role="img">
        <defs>
          <radialGradient id={`g-${visual}`} cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#67e8f9" stopOpacity="0.86" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.42" />
          </radialGradient>
        </defs>
        <circle className="icon-bg" cx="48" cy="48" r="43" />
        {iconArtwork[visual]}
      </svg>
    </span>
  );
}

const dot = (cx: number, cy: number, r = 3, cls = "icon-dot") => <circle key={`${cx}-${cy}-${r}-${cls}`} className={cls} cx={cx} cy={cy} r={r} />;

const iconArtwork: Record<ParticleVisual, ReactNode> = {
  "standard-model": (
    <>
      <circle className="icon-core" cx="48" cy="48" r="12" />
      {[0, 45, 90, 135].map((angle) => <ellipse key={angle} className="icon-orbit" cx="48" cy="48" rx="30" ry="10" transform={`rotate(${angle} 48 48)`} />)}
      {[dot(48, 16, 3), dot(75, 48, 3), dot(48, 80, 3), dot(21, 48, 3)]}
    </>
  ),
  qft: (
    <>
      {[18, 30, 42, 54, 66, 78].map((x, index) => <path key={x} className="icon-wave" d={`M${x} 72 C${x + 4} ${30 + index % 2 * 8},${x + 8} ${30 - index % 2 * 8},${x + 12} 72`} />)}
      {[dot(28, 50, 3), dot(48, 34, 4), dot(69, 56, 3)]}
    </>
  ),
  "higgs-field": (
    <>
      <rect className="icon-grid" x="22" y="22" width="52" height="52" rx="12" />
      {[28, 42, 56, 70].map((x) => <path key={x} className="icon-line" d={`M${x} 24V72`} />)}
      {[28, 42, 56, 70].map((y) => <path key={y} className="icon-line" d={`M24 ${y}H72`} />)}
      <circle className="icon-core warm" cx="48" cy="48" r="10" />
    </>
  ),
  "higgs-boson": (
    <>
      <circle className="icon-burst" cx="48" cy="48" r="15" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => <path key={angle} className="icon-ray" d="M48 18V32" transform={`rotate(${angle} 48 48)`} />)}
      {[dot(31, 31, 3, "icon-dot warm"), dot(65, 32, 3), dot(64, 65, 3, "icon-dot warm"), dot(31, 64, 3)]}
    </>
  ),
  quarks: (
    <>
      <path className="icon-triangle" d="M48 20L74 66H22Z" />
      {[dot(48, 28, 7, "icon-dot warm"), dot(64, 60, 7), dot(32, 60, 7)]}
      <path className="icon-line" d="M48 28L64 60L32 60Z" />
    </>
  ),
  leptons: (
    <>
      {[dot(31, 31, 6), dot(65, 31, 6), dot(31, 65, 6, "icon-dot warm"), dot(65, 65, 6, "icon-dot warm")]}
      <path className="icon-line" d="M31 31H65M31 65H65M31 31V65M65 31V65" />
    </>
  ),
  gluons: (
    <>
      <path className="icon-spiral" d="M28 48c0-13 10-23 23-21 10 2 17 11 15 21-2 13-16 19-27 13-8-4-9-15-1-20 7-4 16 0 16 8 0 7-7 11-13 8" />
      {[dot(28, 48, 4, "icon-dot warm"), dot(66, 48, 4), dot(43, 57, 3)]}
    </>
  ),
  "gauge-bosons": (
    <>
      <circle className="icon-core" cx="48" cy="48" r="8" />
      {[18, 30, 42, 54, 66, 78].map((y) => <path key={y} className="icon-carrier" d={`M20 ${y}C35 ${y - 14},61 ${y + 14},76 ${y}`} />)}
    </>
  ),
  neutrinos: (
    <>
      <path className="icon-wave" d="M17 50C28 27,40 73,51 50S74 27,82 50" />
      <path className="icon-wave secondary" d="M17 60C28 37,40 83,51 60S74 37,82 60" />
      {[dot(23, 46, 2.5), dot(49, 52, 3, "icon-dot warm"), dot(75, 48, 2.5)]}
    </>
  ),
  antimatter: (
    <>
      <circle className="icon-core" cx="37" cy="48" r="9" />
      <circle className="icon-core antimatter" cx="59" cy="48" r="9" />
      <path className="icon-ray" d="M24 24L72 72M72 24L24 72" />
      {[dot(37, 48, 2, "icon-hole"), dot(59, 48, 2, "icon-hole")]}
    </>
  ),
  "symmetry-breaking": (
    <>
      <path className="icon-bowl" d="M18 30C28 73,68 73,78 30" />
      <path className="icon-axis" d="M48 18V78M20 58H76" />
      <circle className="icon-core warm" cx="60" cy="58" r="8" />
    </>
  ),
  confinement: (
    <>
      <rect className="icon-grid" x="20" y="28" width="56" height="40" rx="18" />
      <path className="icon-string" d="M34 48C42 34,54 62,62 48" />
      {[dot(32, 48, 7, "icon-dot warm"), dot(64, 48, 7), dot(48, 48, 4)]}
    </>
  ),
};
