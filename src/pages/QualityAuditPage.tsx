import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import {
  qualityAuditStats,
  qualityGaps,
  qualityTopPriorities,
  simulationQualityScores,
  qualityWeights,
  SimulationQualityScore,
} from "../lib/simulationQuality";

const dimensions = [
  ["accuracy", "Accuracy", "Validated models, assumptions, ranges, and sources."],
  ["visuals", "Visuals", "2D/3D clarity, overlays, spatial explanation, and polish."],
  ["interaction", "Interaction", "Controls, probes, measurement, replay, and compare depth."],
  ["learning", "Learning", "Predict, explore, explain, misconceptions, and formula links."],
  ["classroom", "Classroom", "Syllabus mapping, teacher flow, observations, and worksheets."],
  ["accessibility", "Accessibility", "Keyboard, narration, contrast, and non-color state cues."],
] as const;

const riskOptions = ["All", "Critical", "High", "Medium", "Low"];

export function QualityAuditPage() {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(simulationQualityScores.map((item) => item.category))).sort()], []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return simulationQualityScores.filter((item) => {
      const text = `${item.title} ${item.category} ${item.classLevel} ${item.riskLevel} ${item.readinessTier}`.toLowerCase();
      return (!q || text.includes(q)) && (risk === "All" || item.riskLevel === risk) && (category === "All" || item.category === category);
    });
  }, [category, query, risk]);

  return (
    <div className="min-h-screen quality-audit-page">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg quality-hero">
          <div>
            <p className="ui-label">Phase 1 / Quality baseline</p>
            <h1 className="mt-2 text-3xl font-black text-gradient">Simulation Quality Audit</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold text-slate-600 dark:text-slate-300">
              A PhET-beating baseline for every experiment: accuracy, visual depth, interaction, learning flow, classroom readiness, and accessibility.
            </p>
          </div>
          <div className="quality-score-orb">
            <span>{qualityAuditStats.overall}</span>
            <small>baseline</small>
          </div>
        </section>

        <section className="quality-metric-grid">
          <Metric label="Experiments" value={qualityAuditStats.total} />
          <Metric label="Accuracy" value={qualityAuditStats.accuracy} suffix="%" />
          <Metric label="Visuals" value={qualityAuditStats.visuals} suffix="%" />
          <Metric label="Learning" value={qualityAuditStats.learning} suffix="%" />
          <Metric label="Flagship" value={qualityAuditStats.flagshipCandidates} />
          <Metric label="High risk" value={qualityAuditStats.highRisk} />
        </section>

        <section className="quality-board">
          <div className="quality-main-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Top 25 upgrade queue</p>
                <h2>Priority simulations to make great first</h2>
              </div>
              <Link className="hero-btn-secondary" to="/comparison">
                <PhysicsIcon name="chart" className="h-4 w-4" />
                Benchmark
              </Link>
            </div>
            <div className="quality-priority-list">
              {qualityTopPriorities.map((item, index) => (
                <PriorityRow key={item.id} item={item} rank={index + 1} />
              ))}
            </div>
          </div>

          <aside className="quality-side-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Phase 1 scorecard</p>
                <h2>What gets measured</h2>
              </div>
            </div>
            <div className="quality-dimension-list">
              {dimensions.map(([id, label, description]) => (
                <div key={id}>
                  <div className="flex items-center justify-between gap-3">
                    <strong>{label}</strong>
                    <span>{Math.round(qualityWeights[id] * 100)}%</span>
                  </div>
                  <p>{description}</p>
                  <ScoreBar value={qualityAuditStats[id]} />
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="quality-board quality-board-secondary">
          <div className="quality-main-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Full quality matrix</p>
                <h2>{filtered.length} simulations shown</h2>
              </div>
              <div className="quality-filter-row">
                <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search simulation, risk, class..." />
                <select className="select-field" value={risk} onChange={(event) => setRisk(event.target.value)}>
                  {riskOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                <select className="select-field" value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
            </div>
            <div className="quality-table-shell">
              <table className="quality-table">
                <thead>
                  <tr>
                    <th>Simulation</th>
                    <th>Score</th>
                    <th>Risk</th>
                    <th>Accuracy</th>
                    <th>Visual</th>
                    <th>Learning</th>
                    <th>Next action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link to={`/experiments/${item.id}`}>{item.title}</Link>
                        <span>{item.category} / {item.classLevel}</span>
                      </td>
                      <td><ScorePill value={item.overall} /></td>
                      <td><RiskChip risk={item.riskLevel} /></td>
                      <td>{item.dimensions.accuracy}</td>
                      <td>{item.dimensions.visuals}</td>
                      <td>{item.dimensions.learning}</td>
                      <td>{item.nextActions[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="quality-side-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Quality gaps</p>
                <h2>UI, learning, and accuracy risks</h2>
              </div>
            </div>
            <div className="quality-gap-list">
              {qualityGaps.map((gap) => (
                <article key={gap.id}>
                  <div className="flex items-center justify-between gap-3">
                    <strong>{gap.label}</strong>
                    <RiskChip risk={gap.severity} />
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <span>{gap.count}</span>
                    <p>{gap.action}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="quality-definition panel">
          <p className="ui-label">Phase 1 definition of done</p>
          <h2>Baseline now exists; Phase 2 can target real weaknesses</h2>
          <div className="quality-dod-grid">
            {[
              "Every experiment has a multi-dimension score.",
              "Top 25 upgrade priorities are automatically ranked.",
              "Accuracy, visual, learning, classroom, and accessibility gaps are visible.",
              "Each simulation has concrete next actions.",
              "Quality filters support category, risk, and search review.",
              "The benchmark is wired into navigation and search.",
            ].map((item) => (
              <div key={item}>
                <PhysicsIcon name="check" className="h-4 w-4" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="metric-card">
      <p className="ui-label">{label}</p>
      <div className="mt-1 text-2xl font-black">{value}{suffix}</div>
    </div>
  );
}

function PriorityRow({ item, rank }: { item: SimulationQualityScore; rank: number }) {
  return (
    <article className="quality-priority-row">
      <div className="quality-rank">{rank}</div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/experiments/${item.id}`}>{item.title}</Link>
          <RiskChip risk={item.riskLevel} />
          <span className="status-chip">{item.readinessTier}</span>
        </div>
        <p>{item.nextActions[0]}</p>
        <div className="quality-mini-bars">
          <MiniScore label="Accuracy" value={item.dimensions.accuracy} />
          <MiniScore label="Visuals" value={item.dimensions.visuals} />
          <MiniScore label="Learning" value={item.dimensions.learning} />
        </div>
      </div>
      <ScorePill value={item.overall} />
    </article>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <b>{label}</b>
      <ScoreBar value={value} />
    </span>
  );
}

function ScorePill({ value }: { value: number }) {
  return <span className={value >= 80 ? "score-pill score-pill-good" : value >= 65 ? "score-pill score-pill-mid" : "score-pill score-pill-risk"}>{value}</span>;
}

function RiskChip({ risk }: { risk: string }) {
  return <span className={`risk-chip risk-${risk.toLowerCase()}`}>{risk}</span>;
}

function ScoreBar({ value }: { value: number }) {
  return <span className="quality-score-bar"><i style={{ width: `${Math.max(4, Math.min(100, value))}%` }} /></span>;
}
