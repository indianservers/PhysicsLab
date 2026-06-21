import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { useCountUp } from "../hooks/useCountUp";
import {
  releaseCategorySummaries,
  releaseGovernanceProfiles,
  releaseGovernanceStats,
  releaseTrackSummaries,
  type ReleaseGovernanceProfile,
} from "../lib/releaseGovernance";
import { experiments } from "../lib/experiments";
import { PhysicsIcon, iconForCategory, iconForExperiment } from "../lib/icons";

const gateOptions = ["All", "Publish ready", "Review required", "Improve before release", "Internal only"];

export function ReleaseGovernancePage() {
  const [params, setParams] = useSearchParams();
  const initialId = params.get("experiment") ?? "";
  const [query, setQuery] = useState("");
  const [gate, setGate] = useState("All");

  const visibleProfiles = useMemo(() => {
    const search = query.trim().toLowerCase();
    return releaseGovernanceProfiles.filter((profile) => {
      const gateMatch = gate === "All" || profile.gate === gate;
      const queryMatch = !search || [profile.title, profile.category, profile.classLevel, profile.gate, profile.reviewTrack].join(" ").toLowerCase().includes(search);
      return gateMatch && queryMatch;
    });
  }, [gate, query]);

  const selected = visibleProfiles.find((profile) => profile.experimentId === initialId) ?? visibleProfiles[0] ?? releaseGovernanceProfiles[0];
  const selectedExperiment = experiments.find((experiment) => experiment.id === selected.experimentId);

  const selectProfile = (profile: ReleaseGovernanceProfile) => {
    const next = new URLSearchParams(params);
    next.set("experiment", profile.experimentId);
    setParams(next);
  };

  return (
    <div className="release-governance-page min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page mx-auto max-w-[1500px] px-3 py-4">
        <section className="release-hero">
          <div>
            <p className="ui-label">Phase 9 / Scientific review and release governance</p>
            <h1>Release Governance</h1>
            <p>
              A publish gate for PhET-level claims: source coverage, validation evidence, learning design, accessibility QA, classroom rollout, and reviewer notes in one queue.
            </p>
          </div>
          <div className="release-orb">
            <span>Release score</span>
            <strong><Count value={releaseGovernanceStats.averageReleaseScore} />%</strong>
            <em>{releaseGovernanceStats.publishReady} publish-ready labs</em>
          </div>
        </section>

        <section className="release-metric-grid">
          <Metric icon="flask" label="Profiles" value={releaseGovernanceStats.profiles} />
          <Metric icon="check" label="Publish ready" value={releaseGovernanceStats.publishReady} />
          <Metric icon="teacher" label="Review" value={releaseGovernanceStats.reviewRequired} />
          <Metric icon="step" label="Improve" value={releaseGovernanceStats.improveBeforeRelease} />
          <Metric icon="gauge" label="Internal" value={releaseGovernanceStats.internalOnly} />
          <Metric icon="book" label="Sources" value={releaseGovernanceStats.sourceFamilies} />
        </section>

        <section className="release-control-board">
          <div>
            <p className="ui-label">Filter release queue</p>
            <div className="release-filter-row">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lab, category, review track" />
              <select value={gate} onChange={(event) => setGate(event.target.value)}>
                {gateOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
          <div className="release-selected-mini">
            <span>Selected gate</span>
            <strong>{selected.gate}</strong>
            <em>{selected.reviewTrack}</em>
          </div>
        </section>

        <section className="release-layout">
          <div className="release-left-column">
            <section className="release-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="ui-label">Review tracks</p>
                  <h2>Owner queue</h2>
                </div>
                <span className="status-chip status-chip-cyan">{releaseGovernanceStats.reviewTracks} tracks</span>
              </div>
              <div className="release-track-list">
                {releaseTrackSummaries.map((summary) => (
                  <div key={summary.track}>
                    <span>{summary.track}</span>
                    <strong>{summary.count}</strong>
                    <em>{summary.topItem}</em>
                    <div className="mini-progress"><span style={{ width: `${summary.averageScore}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="release-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="ui-label">Category release health</p>
                  <h2>Weakest first</h2>
                </div>
                <span className="status-chip">{releaseCategorySummaries.length} categories</span>
              </div>
              <div className="release-category-list">
                {releaseCategorySummaries.slice(0, 8).map((summary) => (
                  <div key={summary.category}>
                    <span><PhysicsIcon name={iconForCategory(summary.category)} />{summary.category}</span>
                    <strong>{summary.averageScore}%</strong>
                    <em>{summary.publishReady} publish ready, {summary.internalOnly} internal</em>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="release-panel release-queue-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="ui-label">{visibleProfiles.length} labs shown</p>
                <h2>Release queue</h2>
              </div>
              <span className="status-chip status-chip-amber">Review before claims</span>
            </div>
            <div className="release-profile-grid">
              {visibleProfiles.slice(0, 50).map((profile) => (
                <button key={profile.experimentId} type="button" className={profile.experimentId === selected.experimentId ? "release-profile-card release-profile-card-active" : "release-profile-card"} onClick={() => selectProfile(profile)}>
                  <span className="release-profile-icon"><PhysicsIcon name={iconForCategory(profile.category)} /></span>
                  <span>
                    <em>{profile.category} - {profile.classLevel}</em>
                    <strong>{profile.title}</strong>
                    <small>{profile.gate} / {profile.reviewTrack}</small>
                  </span>
                  <span className="release-score-meter"><i style={{ width: `${profile.releaseScore}%` }} /></span>
                </button>
              ))}
            </div>
          </section>

          <section className="release-panel release-detail-panel">
            <p className="ui-label">Selected release packet</p>
            <div className="release-detail-title">
              <span className="release-profile-icon">
                <PhysicsIcon name={selectedExperiment ? iconForExperiment(selectedExperiment) : iconForCategory(selected.category)} />
              </span>
              <div>
                <h2>{selected.title}</h2>
                <p>{selected.category} - {selected.classLevel}</p>
              </div>
            </div>
            <div className="release-score-strip">
              <div><span>Score</span><strong>{selected.releaseScore}%</strong></div>
              <div><span>Gate</span><strong>{selected.gate}</strong></div>
              <div><span>Track</span><strong>{selected.reviewTrack}</strong></div>
            </div>
            <ScoreBars profile={selected} />
            <div className="release-checklist">
              {selected.releaseChecklist.map((item) => (
                <div key={item.label} data-status={item.status}>
                  <PhysicsIcon name={item.status === "pass" ? "check" : item.status === "watch" ? "eye" : "gauge"} />
                  <span>
                    <strong>{item.label}</strong>
                    <em>{item.detail}</em>
                  </span>
                </div>
              ))}
            </div>
            <div className="release-action-grid">
              <PlanCard icon="clipboard" title="Reviewer notes" items={selected.reviewerNotes} />
              <PlanCard icon="gauge" title="Release risks" items={selected.releaseRisks.length ? selected.releaseRisks : ["No major release blocker detected."]} />
              <PlanCard icon="book" title="Publish summary" items={[selected.publishSummary]} />
            </div>
            <div className="release-link-row">
              <Link className="tool-btn-primary inline-flex items-center gap-2" to={`/experiments/${selected.experimentId}`}>
                <PhysicsIcon name="flask" className="h-4 w-4" /> Open lab
              </Link>
              <Link className="tool-btn inline-flex items-center gap-2" to={`/insights-center?experiment=${selected.experimentId}`}>
                <PhysicsIcon name="chart" className="h-4 w-4" /> Insights
              </Link>
              <Link className="tool-btn inline-flex items-center gap-2" to="/trust">
                <PhysicsIcon name="check" className="h-4 w-4" /> Trust guide
              </Link>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; value: number }) {
  return (
    <div className="metric-card flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-400/10 text-emerald-500">
        <PhysicsIcon name={icon} />
      </span>
      <span>
        <span className="ui-label">{label}</span>
        <strong className="mt-1 block text-2xl font-black text-emerald-500 count-up"><Count value={value} /></strong>
      </span>
    </div>
  );
}

function Count({ value }: { value: number }) {
  return <>{useCountUp(value)}</>;
}

function ScoreBars({ profile }: { profile: ReleaseGovernanceProfile }) {
  const rows = [
    ["Trust", profile.trustScore],
    ["Accuracy", profile.accuracyScore],
    ["Quality", profile.qualityScore],
    ["Learning", profile.learningScore],
    ["Visual", profile.depthScore],
    ["Deploy", profile.deploymentScore],
    ["Access", profile.accessibilityScore],
    ["Sources", profile.sourceCoverage],
  ] as const;
  return (
    <div className="release-score-bars">
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}%</strong>
          <i><b style={{ width: `${value}%` }} /></i>
        </div>
      ))}
    </div>
  );
}

function PlanCard({ icon, title, items }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; title: string; items: string[] }) {
  return (
    <article>
      <h3><PhysicsIcon name={icon} />{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}
