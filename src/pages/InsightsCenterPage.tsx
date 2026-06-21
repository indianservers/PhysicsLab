import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { useCountUp } from "../hooks/useCountUp";
import {
  insightCategorySummaries,
  insightFocusSummaries,
  insightProfiles,
  insightStats,
  type InsightProfile,
} from "../lib/insightAnalytics";
import { experiments } from "../lib/experiments";
import { PhysicsIcon, iconForCategory, iconForExperiment } from "../lib/icons";

const urgencies = ["All", "Immediate intervention", "Teacher guided", "Monitor", "Scale ready"];
const focusAreas = ["All", "Accuracy", "Learning", "Visual depth", "Classroom rollout", "Accessibility", "Curriculum mastery"];

export function InsightsCenterPage() {
  const [params, setParams] = useSearchParams();
  const initialId = params.get("experiment") ?? "";
  const [query, setQuery] = useState("");
  const [urgency, setUrgency] = useState("All");
  const [focus, setFocus] = useState("All");

  const visibleProfiles = useMemo(() => {
    const search = query.trim().toLowerCase();
    return insightProfiles.filter((profile) => {
      const urgencyMatch = urgency === "All" || profile.urgency === urgency;
      const focusMatch = focus === "All" || profile.focus === focus;
      const queryMatch = !search || [profile.title, profile.category, profile.classLevel, profile.focus, profile.urgency, ...profile.affectedTopics].join(" ").toLowerCase().includes(search);
      return urgencyMatch && focusMatch && queryMatch;
    });
  }, [focus, query, urgency]);

  const selected = visibleProfiles.find((profile) => profile.experimentId === initialId) ?? visibleProfiles[0] ?? insightProfiles[0];
  const selectedExperiment = experiments.find((experiment) => experiment.id === selected.experimentId);

  const selectProfile = (profile: InsightProfile) => {
    const next = new URLSearchParams(params);
    next.set("experiment", profile.experimentId);
    setParams(next);
  };

  return (
    <div className="insights-center-page min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page mx-auto max-w-[1500px] px-3 py-4">
        <section className="insights-hero">
          <div>
            <p className="ui-label">Phase 8 / Insights and intervention analytics</p>
            <h1>Insights Center</h1>
            <p>
              A decision layer that turns accuracy, simulation depth, learning, classroom rollout, accessibility, and mastery data into teacher-ready intervention priorities.
            </p>
          </div>
          <div className="insights-orb">
            <span>Readiness</span>
            <strong><Count value={insightStats.averageReadiness} />%</strong>
            <em>{insightStats.immediate} immediate interventions</em>
          </div>
        </section>

        <section className="insights-metric-grid">
          <InsightMetric icon="flask" label="Profiles" value={insightStats.profiles} />
          <InsightMetric icon="gauge" label="Immediate" value={insightStats.immediate} />
          <InsightMetric icon="teacher" label="Guided" value={insightStats.guided} />
          <InsightMetric icon="eye" label="Monitor" value={insightStats.monitor} />
          <InsightMetric icon="check" label="Scale ready" value={insightStats.scaleReady} />
          <InsightMetric icon="book" label="Focus areas" value={insightStats.focusAreas} />
        </section>

        <section className="insights-control-board">
          <div>
            <p className="ui-label">Filter intervention queue</p>
            <div className="insights-filter-row">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search experiment, class, topic" />
              <select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
                {urgencies.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select value={focus} onChange={(event) => setFocus(event.target.value)}>
                {focusAreas.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
          <div className="insights-selected-mini">
            <span>Current focus</span>
            <strong>{selected.focus}</strong>
            <em>{selected.urgency}</em>
          </div>
        </section>

        <section className="insights-layout">
          <div className="insights-left-column">
            <section className="insights-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="ui-label">Focus load</p>
                  <h2>Where support is needed</h2>
                </div>
                <span className="status-chip status-chip-cyan">{insightFocusSummaries.length} areas</span>
              </div>
              <div className="insights-focus-list">
                {insightFocusSummaries.map((summary) => (
                  <div key={summary.focus}>
                    <span>{summary.focus}</span>
                    <strong>{summary.count}</strong>
                    <em>{summary.topExperiment}</em>
                    <div className="mini-progress"><span style={{ width: `${summary.averageIntervention}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="insights-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="ui-label">Category risk</p>
                  <h2>Intervention load</h2>
                </div>
                <span className="status-chip">{insightCategorySummaries.length} categories</span>
              </div>
              <div className="insights-category-list">
                {insightCategorySummaries.slice(0, 8).map((summary) => (
                  <div key={summary.category}>
                    <span><PhysicsIcon name={iconForCategory(summary.category)} />{summary.category}</span>
                    <strong>{summary.interventionLoad}%</strong>
                    <em>{summary.profiles} labs, {summary.immediate} immediate</em>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="insights-panel insights-queue-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="ui-label">{visibleProfiles.length} profiles shown</p>
                <h2>Intervention queue</h2>
              </div>
              <span className="status-chip status-chip-cyan">Highest need first</span>
            </div>
            <div className="insights-profile-grid">
              {visibleProfiles.slice(0, 40).map((profile) => (
                <button key={profile.experimentId} type="button" className={profile.experimentId === selected.experimentId ? "insights-profile-card insights-profile-card-active" : "insights-profile-card"} onClick={() => selectProfile(profile)}>
                  <span className="insights-profile-icon">
                    <PhysicsIcon name={iconForCategory(profile.category)} />
                  </span>
                  <span>
                    <em>{profile.category} - {profile.classLevel}</em>
                    <strong>{profile.title}</strong>
                    <small>{profile.urgency} / {profile.focus}</small>
                  </span>
                  <span className="insights-intervention-meter"><i style={{ width: `${profile.interventionScore}%` }} /></span>
                </button>
              ))}
            </div>
          </section>

          <section className="insights-panel insights-detail-panel">
            <p className="ui-label">Selected action plan</p>
            <div className="insights-detail-title">
              <span className="insights-profile-icon">
                <PhysicsIcon name={selectedExperiment ? iconForExperiment(selectedExperiment) : iconForCategory(selected.category)} />
              </span>
              <div>
                <h2>{selected.title}</h2>
                <p>{selected.category} - {selected.classLevel}</p>
              </div>
            </div>
            <div className="insights-score-strip">
              <div><span>Readiness</span><strong>{selected.overallReadiness}%</strong></div>
              <div><span>Intervention</span><strong>{selected.interventionScore}%</strong></div>
              <div><span>Urgency</span><strong>{selected.urgency}</strong></div>
            </div>
            <ScoreBars profile={selected} />
            <div className="insights-action-grid">
              <PlanCard icon="clipboard" title="Evidence signals" items={selected.evidenceSignals} />
              <PlanCard icon="step" title="Intervention plan" items={selected.interventionPlan} />
              <PlanCard icon="teacher" title="Teacher move" items={[selected.teacherMove]} />
              <PlanCard icon="spark" title="Student move" items={[selected.studentMove]} />
              <PlanCard icon="book" title="Affected topics" items={selected.affectedTopics.length ? selected.affectedTopics : ["No mapped topic yet."]} />
            </div>
            <div className="insights-link-row">
              <Link className="tool-btn-primary inline-flex items-center gap-2" to={`/experiments/${selected.experimentId}`}>
                <PhysicsIcon name="flask" className="h-4 w-4" /> Open lab
              </Link>
              <Link className="tool-btn inline-flex items-center gap-2" to={`/accuracy-center?experiment=${selected.experimentId}`}>
                <PhysicsIcon name="check" className="h-4 w-4" /> Accuracy
              </Link>
              <Link className="tool-btn inline-flex items-center gap-2" to={`/learning-studio?lesson=${selected.experimentId}`}>
                <PhysicsIcon name="teacher" className="h-4 w-4" /> Lesson
              </Link>
              <Link className="tool-btn inline-flex items-center gap-2" to={`/accessibility-center?experiment=${selected.experimentId}`}>
                <PhysicsIcon name="settings" className="h-4 w-4" /> Access
              </Link>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function InsightMetric({ icon, label, value }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; value: number }) {
  return (
    <div className="metric-card flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
        <PhysicsIcon name={icon} />
      </span>
      <span>
        <span className="ui-label">{label}</span>
        <strong className="mt-1 block text-2xl font-black text-cyan-500 count-up"><Count value={value} /></strong>
      </span>
    </div>
  );
}

function Count({ value }: { value: number }) {
  return <>{useCountUp(value)}</>;
}

function ScoreBars({ profile }: { profile: InsightProfile }) {
  const rows = [
    ["Quality", profile.qualityScore],
    ["Accuracy", profile.accuracyScore],
    ["Learning", profile.learningScore],
    ["Visual", profile.depthScore],
    ["Deploy", profile.deploymentScore],
    ["Access", profile.accessibilityScore],
    ["Mastery", profile.masteryScore],
  ] as const;
  return (
    <div className="insights-score-bars">
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
