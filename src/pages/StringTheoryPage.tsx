import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { ConceptThreeScene } from "../components/ConceptThreeScene";
import { PhysicsIcon } from "../lib/icons";
import { stringTheoryConcepts, stringTheoryStats } from "../lib/stringTheory";

const modes = ["Electron-like", "Quark-like", "Photon-like", "Graviton-like"];

export function StringTheoryPage() {
  const [searchParams] = useSearchParams();
  const requestedConcept = searchParams.get("concept");
  const [mode, setMode] = useState(1);
  const [intensity, setIntensity] = useState(0.55);
  const [dimensions, setDimensions] = useState(10);
  const [selectedId, setSelectedId] = useState(stringTheoryConcepts.some((concept) => concept.id === requestedConcept) ? requestedConcept ?? stringTheoryConcepts[0].id : stringTheoryConcepts[0].id);
  const selected = useMemo(() => stringTheoryConcepts.find((concept) => concept.id === selectedId) ?? stringTheoryConcepts[0], [selectedId]);

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="string-theory-page desktop-page">
        <section className="string-hero">
          <div>
            <p className="ui-label">Interactive theoretical physics concept</p>
            <h1>String Theory Lab</h1>
            <p>Explore vibrating strings, particle modes, hidden dimensions, and the quantum-gravity bridge in a live 3D scene.</p>
          </div>
          <div className="string-metrics">
            <Metric icon="wave" label="Concepts" value={stringTheoryStats.concepts} />
            <Metric icon="orbit" label="Dimensions" value={`${dimensions}D`} />
            <Metric icon="check" label="Status" value="Theoretical" />
          </div>
        </section>

        <section className="string-lab-layout">
          <aside className="string-control-panel">
            <div>
              <p className="ui-label">Vibration mode</p>
              <div className="string-mode-grid">
                {modes.map((item, index) => (
                  <button key={item} className={mode === index ? "string-mode-btn string-mode-btn-active" : "string-mode-btn"} type="button" onClick={() => setMode(index)}>
                    <span>{index + 1}</span>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <label className="string-slider">
              <span>Vibration energy</span>
              <input type="range" min="0" max="1" step="0.01" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
              <strong>{Math.round(intensity * 100)}%</strong>
            </label>
            <label className="string-slider">
              <span>Dimension count</span>
              <input type="range" min="4" max="11" step="1" value={dimensions} onChange={(event) => setDimensions(Number(event.target.value))} />
              <strong>{dimensions} dimensions</strong>
            </label>
          </aside>

          <section className="string-three-wrap" aria-label="Interactive 3D string theory scene">
            <ConceptThreeScene variant="strings" mode={mode} intensity={intensity} dimensions={dimensions} />
          </section>

          <aside className="string-detail-panel">
            <p className="ui-label">{selected.status}</p>
            <h2>{selected.title}</h2>
            <p className="string-summary">{selected.summary}</p>
            <p>{selected.explanation}</p>
            <div className="string-cue">
              <span>Try this</span>
              <p>{selected.interactiveCue}</p>
            </div>
            <div className="string-status-note">
              <PhysicsIcon name="check" className="h-4 w-4" />
              String theory remains theoretical; this module separates model intuition from confirmed experimental evidence.
            </div>
          </aside>
        </section>

        <section className="string-concept-grid" aria-label="String theory concepts">
          {stringTheoryConcepts.map((concept) => (
            <button key={concept.id} className={concept.id === selected.id ? "string-concept-card string-concept-card-active" : "string-concept-card"} type="button" onClick={() => setSelectedId(concept.id)}>
              <span>{concept.status}</span>
              <strong>{concept.title}</strong>
              <small>{concept.summary}</small>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: "wave" | "orbit" | "check"; label: string; value: string | number }) {
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
