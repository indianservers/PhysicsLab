import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import {
  simulationDepthProfiles,
  simulationDepthStats,
  visualDepthGaps,
  type SimulationDepthProfile,
} from "../lib/simulationDepth";

const tiers = ["All", "Flagship cinematic", "Interactive model", "Guided visual", "Needs depth pass"];

export function SimulationDepthPage() {
  const location = useLocation();
  const selectedFromUrl = new URLSearchParams(location.search).get("simulation");
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("All");
  const [selectedId, setSelectedId] = useState(selectedFromUrl ?? simulationDepthProfiles[0]?.experimentId ?? "");
  const categories = useMemo(() => ["All", ...Array.from(new Set(simulationDepthProfiles.map((item) => item.category))).sort()], []);
  const pendingProfiles = useMemo(
    () =>
      simulationDepthProfiles
        .filter((profile) => profile.missingLayers.length > 0)
        .sort((a, b) => b.missingLayers.length - a.missingLayers.length || a.depthScore - b.depthScore),
    [],
  );
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return simulationDepthProfiles.filter((profile) => {
      const text = `${profile.title} ${profile.category} ${profile.tier} ${profile.visualPromise}`.toLowerCase();
      return (!q || text.includes(q)) && (tier === "All" || profile.tier === tier) && (category === "All" || profile.category === category);
    });
  }, [category, query, tier]);
  const selected = simulationDepthProfiles.find((item) => item.experimentId === selectedId) ?? filtered[0] ?? simulationDepthProfiles[0];

  return (
    <div className="min-h-screen simulation-depth-page">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg depth-hero">
          <div>
            <p className="ui-label">Phase 4 / Simulation depth</p>
            <h1 className="mt-2 text-3xl font-black text-gradient">Simulation Depth Studio</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold text-slate-600 dark:text-slate-300">
              Visual production rules for PhET-beating simulations: separated 2D/3D views, synchronized graphs, probes, replay checkpoints, and non-color cues.
            </p>
          </div>
          <div className="depth-score-orb">
            <span>{simulationDepthStats.averageDepth}%</span>
            <small>visual depth</small>
          </div>
        </section>

        <section className="depth-metric-grid">
          <Metric label="Simulations" value={simulationDepthStats.profiles} />
          <Metric label="Flagship cinematic" value={simulationDepthStats.flagship} />
          <Metric label="Interactive models" value={simulationDepthStats.interactive} />
          <Metric label="Pending depth items" value={pendingProfiles.length} />
          <Metric label="Probe gaps" value={simulationDepthStats.probesNeeded} />
          <Metric label="Visual layers" value={visualDepthGaps.length} />
        </section>

        {pendingProfiles.length > 0 && (
          <section className="depth-board depth-board-wide">
            <div className="depth-panel depth-pending-panel">
              <div className="quality-section-head">
                <div>
                  <p className="ui-label">Pending items</p>
                  <h2>{pendingProfiles.length} simulations need a depth pass</h2>
                </div>
                <Link className="hero-btn-primary depth-launch-button" to={`/experiments/${pendingProfiles[0].experimentId}`} target="_blank" rel="noreferrer">
                  <PhysicsIcon name="play" className="h-4 w-4" />
                  Launch first pending
                </Link>
              </div>
              <div className="depth-pending-grid">
                {pendingProfiles.slice(0, 8).map((profile) => (
                  <article key={profile.experimentId} className="depth-pending-card">
                    <div>
                      <p className="ui-label">{profile.category} / {profile.classLevel}</p>
                      <strong>{profile.title}</strong>
                      <p>{profile.missingLayers.length > 0 ? `Needs ${profile.missingLayers.join(", ")}.` : profile.visualPromise}</p>
                    </div>
                    <div className="depth-card-actions">
                      <button type="button" className="depth-detail-button" onClick={() => setSelectedId(profile.experimentId)}>
                        Review plan
                      </button>
                      <Link className="depth-launch-mini" to={`/experiments/${profile.experimentId}`} target="_blank" rel="noreferrer">
                        <PhysicsIcon name="play" className="h-4 w-4" />
                        Launch
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="depth-board">
          <div className="depth-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Layer coverage</p>
                <h2>What makes a simulation feel deep</h2>
              </div>
            </div>
            <div className="depth-layer-grid">
              {visualDepthGaps.map((gap) => (
                <article key={gap.layer}>
                  <div className="flex items-center justify-between gap-3">
                    <strong>{gap.layer}</strong>
                    <span>{gap.ready}/{simulationDepthStats.profiles}</span>
                  </div>
                  <div className="quality-score-bar mt-3"><i style={{ width: `${Math.max(4, (gap.ready / simulationDepthStats.profiles) * 100)}%` }} /></div>
                  <p>{gap.missing} simulations still need this layer.</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="depth-panel depth-rules">
            <p className="ui-label">Phase 4 rules</p>
            <h2>Visual depth contract</h2>
            {[
              "2D explains exact geometry.",
              "3D explains spatial intuition.",
              "Graphs update with the scene.",
              "Probes make measurement visible.",
              "Replay freezes the teachable moment.",
              "Labels and patterns support accessibility.",
            ].map((item) => (
              <div key={item}><PhysicsIcon name="check" className="h-4 w-4" /><span>{item}</span></div>
            ))}
          </aside>
        </section>

        <section className="depth-board depth-board-wide">
          <div className="depth-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Simulation depth profiles</p>
                <h2>{filtered.length} simulations shown</h2>
              </div>
              <div className="depth-filter-row">
                <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search simulation, layer, category..." />
                <select className="select-field" value={tier} onChange={(event) => setTier(event.target.value)}>
                  {tiers.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select className="select-field" value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="depth-profile-grid">
              {filtered.map((profile) => (
                <DepthProfileCard key={profile.experimentId} profile={profile} active={selected.experimentId === profile.experimentId} onSelect={() => setSelectedId(profile.experimentId)} />
              ))}
            </div>
          </div>
        </section>

        {selected && (
          <section className="depth-board">
            <div className="depth-panel">
              <div className="quality-section-head">
                <div>
                  <p className="ui-label">Selected simulation upgrade</p>
                  <h2>{selected.title}</h2>
                </div>
                <Link className="hero-btn-primary depth-launch-button" to={`/experiments/${selected.experimentId}`} target="_blank" rel="noreferrer">
                  <PhysicsIcon name="play" className="h-4 w-4" />
                  Launch simulator
                </Link>
              </div>
              <div className="depth-upgrade-grid">
                <UpgradeCard icon="eye" title="Visual promise" text={selected.visualPromise} />
                <UpgradeCard icon="orbit" title="Scene upgrade" text={selected.sceneUpgrade} />
                <UpgradeCard icon="ruler" title="Probe upgrade" text={selected.probeUpgrade} />
                <UpgradeCard icon="play" title="Replay upgrade" text={selected.replayUpgrade} />
                <UpgradeCard icon="check" title="Accessibility upgrade" text={selected.accessibilityUpgrade} />
              </div>
            </div>

            <aside className="depth-panel depth-selected-panel">
              <p className="ui-label">Layer checklist</p>
              <h2>{selected.tier}</h2>
              <div className="depth-layer-list">
                {selected.layers.map((layer) => <div key={layer}><PhysicsIcon name="check" className="h-4 w-4" /><span>{layer}</span></div>)}
              </div>
              {selected.missingLayers.length > 0 && (
                <div className="depth-missing-list">
                  <strong>Missing next</strong>
                  {selected.missingLayers.map((layer) => <span key={layer}>{layer}</span>)}
                  <Link className="depth-launch-mini" to={`/experiments/${selected.experimentId}`} target="_blank" rel="noreferrer">
                    <PhysicsIcon name="play" className="h-4 w-4" />
                    Launch this simulator
                  </Link>
                </div>
              )}
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric-card">
      <p className="ui-label">{label}</p>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}

function DepthProfileCard({ profile, active, onSelect }: { profile: SimulationDepthProfile; active: boolean; onSelect: () => void }) {
  return (
    <article className={active ? "depth-profile-card depth-profile-card-active" : "depth-profile-card"}>
      <button type="button" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-left">
            <p className="ui-label">{profile.category} / {profile.classLevel}</p>
            <strong>{profile.title}</strong>
          </div>
          <span className={profile.depthScore >= 82 ? "score-pill score-pill-good" : profile.depthScore >= 68 ? "score-pill score-pill-mid" : "score-pill score-pill-risk"}>{profile.depthScore}</span>
        </div>
        <div className="quality-score-bar mt-3"><i style={{ width: `${profile.depthScore}%` }} /></div>
        <p>{profile.visualPromise}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="status-chip status-chip-cyan">{profile.tier}</span>
          <span className="status-chip">{profile.layers.length} layers</span>
          {profile.missingLayers.length > 0 && <span className="status-chip status-chip-warning">{profile.missingLayers.length} pending</span>}
        </div>
      </button>
      <div className="depth-card-actions">
        <button type="button" className="depth-detail-button" onClick={onSelect}>
          Details
        </button>
        <Link className="depth-launch-mini" to={`/experiments/${profile.experimentId}`} target="_blank" rel="noreferrer">
          <PhysicsIcon name="play" className="h-4 w-4" />
          Launch
        </Link>
      </div>
    </article>
  );
}

function UpgradeCard({ icon, title, text }: { icon: "eye" | "orbit" | "ruler" | "play" | "check"; title: string; text: string }) {
  return (
    <article>
      <PhysicsIcon name={icon} className="h-4 w-4" />
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}
