import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import {
  accuracyAuditStats,
  accuracyDomainSummaries,
  accuracyValidationResults,
  experimentAccuracyProfiles,
  ExperimentAccuracyProfile,
} from "../lib/accuracyValidation";

const modes = ["All", "Validated solver", "Formula calculator", "Visual illustration", "Sandbox starter"];

export function AccuracyCenterPage() {
  const [mode, setMode] = useState("All");
  const [query, setQuery] = useState("");
  const filteredProfiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return experimentAccuracyProfiles.filter((profile) => {
      const text = `${profile.title} ${profile.category} ${profile.mode}`.toLowerCase();
      return (mode === "All" || profile.mode === mode) && (!q || text.includes(q));
    });
  }, [mode, query]);

  return (
    <div className="min-h-screen accuracy-center-page">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg accuracy-hero">
          <div>
            <p className="ui-label">Phase 2 / Simulation engine accuracy</p>
            <h1 className="mt-2 text-3xl font-black text-gradient">Accuracy Center</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold text-slate-600 dark:text-slate-300">
              Numeric benchmark cases, graph expectations, unit guardrails, model assumptions, and solver-vs-visual separation for every experiment.
            </p>
          </div>
          <div className="accuracy-pass-orb">
            <span>{accuracyAuditStats.passing}/{accuracyAuditStats.cases}</span>
            <small>benchmarks pass</small>
          </div>
        </section>

        <section className="accuracy-metric-grid">
          <Metric label="Benchmarks" value={accuracyAuditStats.cases} />
          <Metric label="Passing" value={accuracyAuditStats.passing} />
          <Metric label="Domains" value={accuracyAuditStats.domains} />
          <Metric label="Flagship models" value={accuracyAuditStats.flagshipModels} />
          <Metric label="Validated solvers" value={accuracyAuditStats.validatedProfiles} />
          <Metric label="Metadata profiles" value={accuracyAuditStats.metadataProfiles} />
          <Metric label="Avg grade" value={accuracyAuditStats.averageGrade} suffix="%" />
        </section>

        <section className="accuracy-board">
          <div className="accuracy-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Domain validation</p>
                <h2>Benchmark coverage and pass rates</h2>
              </div>
            </div>
            <div className="accuracy-domain-grid">
              {accuracyDomainSummaries.map((domain) => (
                <article key={domain.domain}>
                  <div className="flex items-center justify-between gap-3">
                    <strong>{domain.domain}</strong>
                    <span>{domain.passRate}%</span>
                  </div>
                  <div className="quality-score-bar mt-3"><i style={{ width: `${domain.passRate}%` }} /></div>
                  <p>{domain.passing}/{domain.cases} reference cases passing</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="accuracy-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Model separation</p>
                <h2>What each label means</h2>
              </div>
            </div>
            <div className="accuracy-contract-list">
              <Contract label="Validated solver" text="Has executable benchmark cases, unit labels, assumptions, and graph expectations passing inside stated ranges." />
              <Contract label="Formula calculator" text="Formula is shown, but validation is pending until executable benchmark cases pass." />
              <Contract label="Visual illustration" text="Visuals teach intuition. They must not be labelled as validated calculators." />
              <Contract label="Sandbox starter" text="Exploration workspace only. Do not market it as a validated simulation until promoted." />
            </div>
          </aside>
        </section>

        <section className="accuracy-board accuracy-board-wide">
          <div className="accuracy-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Experiment model profiles</p>
                <h2>{filteredProfiles.length} accuracy profiles</h2>
              </div>
              <div className="quality-filter-row">
                <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search experiment or category..." />
                <select className="select-field" value={mode} onChange={(event) => setMode(event.target.value)}>
                  {modes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="accuracy-profile-grid">
              {filteredProfiles.map((profile) => <AccuracyProfileCard key={profile.experimentId} profile={profile} />)}
            </div>
          </div>
        </section>

        <section className="accuracy-board">
          <div className="accuracy-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Reference case ledger</p>
                <h2>Exact expected outputs and tolerances</h2>
              </div>
            </div>
            <div className="accuracy-table-shell">
              <table className="quality-table">
                <thead>
                  <tr>
                    <th>Case</th>
                    <th>Domain</th>
                    <th>Expected</th>
                    <th>Actual</th>
                    <th>Error</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {accuracyValidationResults.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link to={`/experiments/${item.experimentId}`}>{item.name}</Link>
                        <span>{item.inputSummary}</span>
                      </td>
                      <td>{item.domain}</td>
                      <td>{formatNumber(item.expected)}</td>
                      <td>{formatNumber(item.actual)}</td>
                      <td>{formatNumber(item.absError)}</td>
                      <td>{item.sourceRef}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="accuracy-panel">
            <p className="ui-label">Phase 2 definition of done</p>
            <h2>Accuracy is now inspectable</h2>
            <div className="accuracy-dod-list">
              {[
                "Core domains have executable reference cases.",
                "Each benchmark stores expected value, actual value, tolerance, and source family.",
                "Experiments are separated into validated solver, formula calculator, visual illustration, or sandbox starter.",
                "Guardrails expose assumptions, valid ranges, and failure conditions.",
                "Next accuracy actions are generated per experiment.",
              ].map((item) => (
                <div key={item}><PhysicsIcon name="check" className="h-4 w-4" /><span>{item}</span></div>
              ))}
            </div>
          </aside>
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

function Contract({ label, text }: { label: string; text: string }) {
  return (
    <article>
      <strong>{label}</strong>
      <p>{text}</p>
    </article>
  );
}

function AccuracyProfileCard({ profile }: { profile: ExperimentAccuracyProfile }) {
  return (
    <article className="accuracy-profile-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="ui-label">{profile.category}</p>
          <Link to={`/experiments/${profile.experimentId}`}>{profile.title}</Link>
        </div>
        <span className={profile.modelGrade >= 80 ? "score-pill score-pill-good" : profile.modelGrade >= 65 ? "score-pill score-pill-mid" : "score-pill score-pill-risk"}>{profile.modelGrade}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="status-chip status-chip-cyan">{profile.mode}</span>
        <span className={profile.validationStatus === "validated" ? "status-chip status-chip-cyan" : "status-chip status-chip-amber"}>{profile.validationStatus}</span>
        <span className="status-chip">{profile.passedCases}/{profile.validationCases} cases</span>
      </div>
      <div className="quality-score-bar mt-3"><i style={{ width: `${profile.modelGrade}%` }} /></div>
      <div className="accuracy-card-section">
        <strong>Guardrails</strong>
        {profile.guardrails.length ? profile.guardrails.map((item) => <p key={item}>{item}</p>) : <p>No explicit guardrails yet.</p>}
      </div>
      <div className="accuracy-card-section">
        <strong>Units and graph</strong>
        <p>{profile.inputUnits[0] ?? "Input units not registered yet."}</p>
        <p>{profile.graphExpectations[0] ?? "Graph expectation not registered yet."}</p>
      </div>
      <div className="accuracy-card-section">
        <strong>Next action</strong>
        <p>{profile.nextAccuracyActions[0]}</p>
      </div>
    </article>
  );
}

function formatNumber(value: number) {
  if (Math.abs(value) >= 100000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(3);
  return Number(value.toFixed(6)).toString();
}
