import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { useCountUp } from "../hooks/useCountUp";
import {
  excellenceBenchmarkPillars,
  excellenceCompetitorTargets,
  excellenceSprintItems,
  excellenceStats,
  type ExcellenceBenchmarkPillar,
} from "../lib/excellenceBenchmark";
import { PhysicsIcon } from "../lib/icons";

export function ExcellenceBenchmarkPage() {
  return (
    <div className="excellence-page min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page mx-auto max-w-[1500px] px-3 py-4">
        <section className="excellence-hero">
          <div>
            <p className="ui-label">Phase 10 / PhET-level excellence benchmark</p>
            <h1>Excellence Benchmark Center</h1>
            <p>
              The final command board for beating top physics tools: aggregate accuracy, simulation depth, learning flow, classroom workflow, accessibility, mastery, and release governance into one execution target.
            </p>
          </div>
          <div className="excellence-orb">
            <span>Overall</span>
            <strong><Count value={excellenceStats.overall} />%</strong>
            <em>{excellenceStats.remainingGap} pts to PhET target</em>
          </div>
        </section>

        <section className="excellence-metric-grid">
          <Metric icon="flask" label="Experiments" value={excellenceStats.totalExperiments} />
          <Metric icon="check" label="Publish ready" value={excellenceStats.publishReady} />
          <Metric icon="gauge" label="Interventions" value={excellenceStats.immediateInterventions} />
          <Metric icon="calculator" label="Validated" value={excellenceStats.validatedProfiles} />
          <Metric icon="teacher" label="Ready lessons" value={excellenceStats.readyLessons} />
          <Metric icon="settings" label="Inclusive" value={excellenceStats.accessibleProfiles} />
        </section>

        <section className="excellence-layout">
          <section className="excellence-panel excellence-pillar-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="ui-label">Capstone pillars</p>
                <h2>Target gap by capability</h2>
              </div>
              <span className="status-chip status-chip-cyan">{excellenceBenchmarkPillars.length} pillars</span>
            </div>
            <div className="excellence-pillar-grid">
              {excellenceBenchmarkPillars.map((pillar) => <PillarCard key={pillar.id} pillar={pillar} />)}
            </div>
          </section>

          <section className="excellence-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="ui-label">Competitive target</p>
                <h2>Where PhysicsLab stands</h2>
              </div>
              <Link className="tool-btn inline-flex items-center gap-2" to="/comparison"><PhysicsIcon name="chart" className="h-4 w-4" />Compare</Link>
            </div>
            <div className="excellence-competitor-list">
              {excellenceCompetitorTargets.map((target) => (
                <div key={target.competitor}>
                  <div>
                    <strong>{target.competitor}</strong>
                    <span>{target.note}</span>
                  </div>
                  <em>{target.gap === 0 ? "Ahead" : `${target.gap} pt gap`}</em>
                  <div className="mini-progress"><span style={{ width: `${Math.min(100, excellenceStats.overall)}%` }} /></div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="excellence-panel mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="ui-label">Final sprint queue</p>
              <h2>{excellenceSprintItems.length} actions that most improve the benchmark</h2>
            </div>
            <span className="status-chip status-chip-amber">Lowest score first</span>
          </div>
          <div className="excellence-sprint-grid">
            {excellenceSprintItems.map((item, index) => (
              <article key={item.id} className="excellence-sprint-card">
                <span className="excellence-rank">{index + 1}</span>
                <div>
                  <p className="ui-label">{item.category} / {item.pillar}</p>
                  <h3>{item.title}</h3>
                  <p>{item.reason}</p>
                  <strong>{item.action}</strong>
                  <Link className="tool-btn-primary inline-flex items-center gap-2" to={item.path}>
                    <PhysicsIcon name="step" className="h-4 w-4" /> Open action
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="excellence-panel mt-4">
          <p className="ui-label">Phase 10 definition of done</p>
          <h2>One command board now connects all improvement phases</h2>
          <div className="excellence-dod-grid">
            {[
              "Quality, accuracy, depth, learning, classroom, accessibility, mastery, insights, and release gates are aggregated.",
              "PhET target gap is visible as a single operating metric.",
              "Competitor targets are ranked against the current internal benchmark.",
              "Sprint queue points directly to the phase module that can fix each weakness.",
              "Publish-ready and intervention counts are visible before external claims.",
              "The page is responsive and wired into search, route, and toolbar navigation.",
            ].map((item) => (
              <div key={item}><PhysicsIcon name="check" className="h-4 w-4" /><span>{item}</span></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; value: number }) {
  return (
    <div className="metric-card flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-fuchsia-400/10 text-fuchsia-500">
        <PhysicsIcon name={icon} />
      </span>
      <span>
        <span className="ui-label">{label}</span>
        <strong className="mt-1 block text-2xl font-black text-fuchsia-500 count-up"><Count value={value} /></strong>
      </span>
    </div>
  );
}

function Count({ value }: { value: number }) {
  return <>{useCountUp(value)}</>;
}

function PillarCard({ pillar }: { pillar: ExcellenceBenchmarkPillar }) {
  return (
    <article className="excellence-pillar-card" data-status={pillar.status}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ui-label">{pillar.status}</p>
          <h3>{pillar.pillar}</h3>
        </div>
        <strong>{pillar.current}%</strong>
      </div>
      <div className="excellence-target-row">
        <span>Target {pillar.target}%</span>
        <span>{pillar.gap} gap</span>
      </div>
      <div className="mini-progress"><span style={{ width: `${pillar.current}%` }} /></div>
      <p>{pillar.evidence}</p>
      <em>{pillar.action}</em>
    </article>
  );
}
