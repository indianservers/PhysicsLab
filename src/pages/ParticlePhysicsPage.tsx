import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { ConceptThreeScene } from "../components/ConceptThreeScene";
import { ParticlePhysicsConcept, ParticleVisual, particleConceptLabs, particlePhysicsCategories, particlePhysicsConcepts, particlePhysicsStats } from "../lib/particlePhysics";
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
  const { conceptId } = useParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [threeMode, setThreeMode] = useState(0);
  const [interactionEnergy, setInteractionEnergy] = useState(0.58);
  const requestedConcept = conceptId ?? searchParams.get("concept");
  const initialConcept = particlePhysicsConcepts.some((concept) => concept.id === requestedConcept) ? requestedConcept ?? "" : particlePhysicsConcepts[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(initialConcept);
  const [labValues, setLabValues] = useState<Record<string, number>>(() => defaultLabValues(particleConceptLabs[initialConcept] ?? particleConceptLabs["standard-model"]));

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
  const selectedLab = particleConceptLabs[selected.id] ?? particleConceptLabs["standard-model"];
  const labReadouts = useMemo(() => computeParticleReadouts(selected.id, labValues), [selected.id, labValues]);

  useEffect(() => {
    if (requestedConcept && particlePhysicsConcepts.some((concept) => concept.id === requestedConcept)) {
      setSelectedId(requestedConcept);
    }
  }, [requestedConcept]);

  useEffect(() => {
    setLabValues(defaultLabValues(selectedLab));
  }, [selectedLab]);

  const updateLabValue = (id: string, value: number) => {
    setLabValues((state) => ({ ...state, [id]: value }));
  };

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

        <section className="particle-lab-panel" aria-label={`${selected.title} interactive knowledge and experiment lab`}>
          <div className="particle-lab-head">
            <div>
              <p className="ui-label">Interactive knowledge explorer</p>
              <h2>{selected.title}: learn, test, explain</h2>
              <p>{selectedLab.knowledgeQuestion}</p>
            </div>
            <span className="status-chip"><PhysicsIcon name="spark" className="h-3.5 w-3.5" />Concept lab active</span>
            <Link className="status-chip" to={`/particle-physics/${selected.id}`}>Open concept page</Link>
          </div>

          <div className="particle-lab-grid">
            <article className="particle-lab-card">
              <p className="ui-label">Know</p>
              <h3>Core idea</h3>
              <p>{selected.explanation}</p>
              <div className="particle-chip-row">
                {selected.keyIdeas.map((idea) => <span key={idea} className="status-chip">{idea}</span>)}
              </div>
              <div className="particle-teaching-card">
                <span>Misconception repair</span>
                <p>{selected.misconception}</p>
              </div>
            </article>

            <article className="particle-lab-card">
              <p className="ui-label">Explore</p>
              <h3>{selectedLab.experimentTitle}</h3>
              <p>{selectedLab.explorerFocus}</p>
              <div className="particle-control-stack">
                {selectedLab.controls.map((control) => (
                  <label key={control.id} className="particle-lab-control">
                    <span>{control.label}</span>
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={labValues[control.id] ?? control.defaultValue}
                      onInput={(event) => updateLabValue(control.id, Number(event.currentTarget.value))}
                      onChange={(event) => updateLabValue(control.id, Number(event.target.value))}
                    />
                    <strong>{formatLabNumber(labValues[control.id] ?? control.defaultValue)} {control.unit}</strong>
                  </label>
                ))}
              </div>
            </article>

            <article className="particle-lab-card particle-experiment-card">
              <p className="ui-label">Experiment</p>
              <h3>Live readouts</h3>
              <p>{selectedLab.experimentPrompt}</p>
              <div className="particle-readout-grid">
                {labReadouts.map((readout) => (
                  <div key={readout.label} className="particle-readout">
                    <span>{readout.label}</span>
                    <strong>{readout.value}</strong>
                    <small>{readout.detail}</small>
                  </div>
                ))}
              </div>
              <div className="particle-evidence-list">
                {selectedLab.evidence.map((item) => (
                  <div key={item}><PhysicsIcon name="check" className="h-3.5 w-3.5" />{item}</div>
                ))}
              </div>
            </article>
          </div>
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
              <Link className="particle-page-link" to={`/particle-physics/${concept.id}`} onClick={(event) => event.stopPropagation()}>
                Open interactive page
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

type ParticleLab = (typeof particleConceptLabs)[string];

interface ParticleReadout {
  label: string;
  value: string;
  detail: string;
}

function defaultLabValues(lab: ParticleLab) {
  return Object.fromEntries(lab.controls.map((control) => [control.id, control.defaultValue]));
}

function computeParticleReadouts(conceptId: string, values: Record<string, number>): ParticleReadout[] {
  const v = (id: string, fallback: number) => values[id] ?? fallback;
  switch (conceptId) {
    case "standard-model": {
      const generations = v("generations", 3);
      const includeHiggs = v("includeHiggs", 1) >= 0.5;
      return [
        readout("Matter flavor groups", generations * 4, "2 quarks + charged lepton + neutrino per generation"),
        readout("Quark flavors", generations * 2, "up/down pairs repeat across generations"),
        readout("Boson sectors", includeHiggs ? 5 : 4, includeHiggs ? "photon, W, Z, gluon, Higgs" : "gauge carriers only"),
      ];
    }
    case "quantum-field-theory": {
      const mass = v("mass", 0.511);
      const momentum = v("momentum", 2);
      const energy = Math.sqrt(momentum * momentum + mass * mass);
      const beta = energy === 0 ? 0 : momentum / energy;
      return [
        readout("Total energy", energy, "GeV"),
        readout("Speed beta", beta, "v/c"),
        readout("Rest-energy share", energy === 0 ? 0 : mass / energy, "mass term fraction"),
      ];
    }
    case "higgs-field": {
      const coupling = v("coupling", 0.01);
      const vev = v("vev", 246);
      const mass = (coupling * vev) / Math.SQRT2;
      return [
        readout("Generated mass", mass, "GeV/c^2"),
        readout("Electron-like scale", mass * 1000, "MeV/c^2"),
        readout("Coupling strength", coupling * 100, "% of y = 1"),
      ];
    }
    case "higgs-boson": {
      const events = v("events", 400);
      const resolution = v("resolution", 2);
      const background = v("background", 55) / 100;
      const signal = events * (1 - background);
      const significance = signal / Math.sqrt(Math.max(events * background, 1));
      return [
        readout("Signal events", signal, "estimated above background"),
        readout("Mass window", resolution * 2, "GeV around 125 GeV"),
        readout("Confidence cue", significance, "sigma-like classroom estimate"),
      ];
    }
    case "quarks": {
      const up = v("up", 2);
      const down = v("down", 1);
      const total = up + down;
      const charge = (2 * up - down) / 3;
      const baryon = total / 3;
      return [
        readout("Net charge", charge, "multiples of e"),
        readout("Baryon number", baryon, total === 3 ? "baryon-like combination" : "not a normal three-quark baryon"),
        readout("Hadron guess", total === 3 ? (charge === 1 ? "proton-like" : charge === 0 ? "neutron-like" : "exotic charge") : "adjust to 3 quarks", "classification"),
      ];
    }
    case "leptons": {
      const energy = v("energy", 5);
      const thickness = v("thickness", 100);
      const relative = energy * thickness / 100000;
      return [
        readout("Neutrino catch cue", relative * 100, "% relative classroom model"),
        readout("Charged-track energy", energy, "GeV visible in detector"),
        readout("Detector scale", thickness, "m of target material"),
      ];
    }
    case "gluons-color-charge": {
      const separation = v("separation", 1);
      const tension = v("tension", 1);
      const energy = separation * tension;
      return [
        readout("Field energy", energy, "GeV"),
        readout("Pair creation cue", energy / 0.7, "threshold units"),
        readout("Confinement state", energy > 0.7 ? "new hadrons likely" : "bound flux tube", "qualitative outcome"),
      ];
    }
    case "gauge-bosons": {
      const mass = Math.max(v("mediatorMass", 80.4), 0.001);
      const coupling = v("coupling", 1);
      const range = 0.1973269804 / mass;
      return [
        readout("Estimated range", range, "fm"),
        readout("Interaction strength", coupling * coupling, "relative coupling squared"),
        readout("Mediator behavior", mass < 0.01 ? "photon-like long range" : "massive short range", "range cue"),
      ];
    }
    case "neutrino-oscillation": {
      const baseline = v("baseline", 295);
      const energy = v("energy", 0.6);
      const theta = (v("theta", 33) * Math.PI) / 180;
      const deltaM = v("deltaM", 2.5);
      const phase = (1.27 * deltaM * baseline) / energy / 1000;
      const probability = (Math.sin(2 * theta) ** 2) * (Math.sin(phase) ** 2);
      return [
        readout("Flavor-change chance", probability * 100, "%"),
        readout("Oscillation phase", phase, "radians"),
        readout("L / E", baseline / energy, "km/GeV"),
      ];
    }
    case "antimatter": {
      const massMicrogram = v("mass", 1);
      const efficiency = v("efficiency", 35) / 100;
      const totalJ = 2 * massMicrogram * 1e-9 * 299792458 ** 2;
      return [
        readout("Total energy", totalJ / 1e6, "MJ"),
        readout("Captured energy", (totalJ * efficiency) / 1e6, "MJ"),
        readout("Equivalent TNT", totalJ / 4.184e6, "kg TNT"),
      ];
    }
    case "symmetry-breaking": {
      const temperature = v("temperature", 0.6);
      const lambda = v("lambda", 1);
      const order = Math.sqrt(Math.max(0, 1 - temperature * temperature));
      const barrier = lambda * (1 - order * order) ** 2;
      return [
        readout("Order parameter", order, "relative field value"),
        readout("Potential cue", barrier, "relative V"),
        readout("Phase", temperature < 1 ? "broken-symmetry state" : "symmetric state", "critical comparison"),
      ];
    }
    case "confinement": {
      const separation = v("separation", 1.5);
      const threshold = v("threshold", 0.7);
      const energy = separation;
      const pairs = Math.floor(energy / threshold);
      return [
        readout("Stored field energy", energy, "GeV"),
        readout("Possible new pairs", pairs, "integer estimate"),
        readout("Detector signature", pairs > 0 ? "hadron jet" : "bound hadron", "qualitative outcome"),
      ];
    }
    default:
      return [readout("Explorer status", "Ready", "select any concept")];
  }
}

function readout(label: string, value: number | string, detail: string): ParticleReadout {
  return { label, value: typeof value === "number" ? formatLabNumber(value) : value, detail };
}

function formatLabNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (Math.abs(value) >= 100) return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  if (Math.abs(value) >= 10) return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (Math.abs(value) >= 1) return value.toLocaleString(undefined, { maximumFractionDigits: 3 });
  return value.toLocaleString(undefined, { maximumFractionDigits: 5 });
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
