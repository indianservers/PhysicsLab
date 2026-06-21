import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCountUp } from "../hooks/useCountUp";
import { Toolbar } from "../components/Toolbar";
import { classOptions } from "../lib/curriculum";
import {
  masteryClassSummaries,
  masteryDomainSummaries,
  masteryRoadmapProfiles,
  masteryRoadmapStats,
  type MasteryRoadmapProfile,
} from "../lib/masteryRoadmap";
import { PhysicsIcon, iconForCategory, iconForExperiment } from "../lib/icons";
import { experiments } from "../lib/experiments";

const schoolClasses = classOptions.filter((item) => item.grade >= 6 && item.grade <= 12);
const tierOrder = ["All", "Mastery ready", "Guided practice", "Needs support", "Build prerequisite"];

export function RoadmapPage() {
  const [params, setParams] = useSearchParams();
  const initialClass = params.get("class") ?? schoolClasses[0]?.id ?? "class-6";
  const initialTopic = params.get("topic") ?? "";
  const [classId, setClassId] = useState(initialClass);
  const [tier, setTier] = useState("All");
  const [query, setQuery] = useState("");

  const classProfiles = useMemo(
    () => masteryRoadmapProfiles.filter((profile) => profile.classId === classId),
    [classId],
  );
  const visibleProfiles = useMemo(() => {
    const search = query.trim().toLowerCase();
    return classProfiles.filter((profile) => {
      const tierMatch = tier === "All" || profile.tier === tier;
      const queryMatch = !search || [profile.title, profile.domain, profile.unitTitle, profile.priority, ...profile.labTitles].join(" ").toLowerCase().includes(search);
      return tierMatch && queryMatch;
    });
  }, [classProfiles, query, tier]);
  const selectedProfile = visibleProfiles.find((profile) => profile.topicId === initialTopic) ?? visibleProfiles[0] ?? classProfiles[0] ?? masteryRoadmapProfiles[0];
  const classSummary = masteryClassSummaries.find((item) => item.classId === classId) ?? masteryClassSummaries[0];
  const classDomains = masteryDomainSummaries.filter((summary) => classProfiles.some((profile) => profile.domain === summary.domain)).slice(0, 6);
  const units = Array.from(new Set(visibleProfiles.map((profile) => profile.unitId))).map((unitId) => ({
    id: unitId,
    title: visibleProfiles.find((profile) => profile.unitId === unitId)?.unitTitle ?? unitId,
    profiles: visibleProfiles.filter((profile) => profile.unitId === unitId),
  }));

  const changeClass = (nextClassId: string) => {
    setClassId(nextClassId);
    const next = new URLSearchParams(params);
    next.set("class", nextClassId);
    next.delete("topic");
    setParams(next);
  };

  const selectProfile = (profile: MasteryRoadmapProfile) => {
    const next = new URLSearchParams(params);
    next.set("class", profile.classId);
    next.set("topic", profile.topicId);
    setParams(next);
  };

  return (
    <div className="roadmap-page min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page mx-auto max-w-[1500px] px-3 py-4">
        <section className="roadmap-hero">
          <div className="max-w-3xl">
            <p className="ui-label">Phase 7 / Adaptive mastery roadmap</p>
            <h1>Student Mastery Roadmap</h1>
            <p>
              A class-wise path that connects curriculum topics to validated labs, evidence tasks, accessibility readiness, and the next best learning action.
            </p>
          </div>
          <div className="roadmap-score-card">
            <span>Average readiness</span>
            <strong><Count value={masteryRoadmapStats.averageReadiness} />%</strong>
            <em>{masteryRoadmapStats.masteryReady} mastery-ready topics</em>
          </div>
        </section>

        <section className="roadmap-metric-grid">
          <RoadMetric icon="book" label="Topics mapped" value={masteryRoadmapStats.topics} />
          <RoadMetric icon="flask" label="Lab mapped" value={masteryRoadmapStats.labMappedTopics} />
          <RoadMetric icon="check" label="Mastery ready" value={masteryRoadmapStats.masteryReady} />
          <RoadMetric icon="teacher" label="Guided practice" value={masteryRoadmapStats.guidedPractice} />
          <RoadMetric icon="gauge" label="Needs support" value={masteryRoadmapStats.needsSupport} />
          <RoadMetric icon="orbit" label="Domains" value={masteryRoadmapStats.domains} />
        </section>

        <section className="roadmap-board">
          <div>
            <p className="ui-label">Class lane</p>
            <div className="roadmap-class-strip">
              {schoolClasses.map((item) => (
                <button key={item.id} className={classId === item.id ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => changeClass(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="roadmap-class-health">
            <span>{classSummary.classLabel}</span>
            <strong>{classSummary.averageReadiness}% ready</strong>
            <div className="mini-progress"><span style={{ width: `${classSummary.averageReadiness}%` }} /></div>
          </div>
          <div className="roadmap-filter-row">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topic, domain, lab" />
            <select value={tier} onChange={(event) => setTier(event.target.value)}>
              {tierOrder.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </section>

        <section className="roadmap-layout">
          <div className="roadmap-left-column">
            <section className="roadmap-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="ui-label">Weakest domains first</p>
                  <h2>Domain repair queue</h2>
                </div>
                <span className="status-chip status-chip-cyan">{classDomains.length} domains</span>
              </div>
              <div className="roadmap-domain-list">
                {classDomains.map((domain) => (
                  <div key={domain.domain}>
                    <span><PhysicsIcon name={iconForCategory(domain.domain)} />{domain.domain}</span>
                    <strong>{domain.averageReadiness}%</strong>
                    <em>Repair: {domain.weakestTopic}</em>
                    <div className="mini-progress"><span style={{ width: `${domain.averageReadiness}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="roadmap-panel roadmap-selected-panel">
              <p className="ui-label">Selected mastery plan</p>
              <h2>{selectedProfile.title}</h2>
              <div className="roadmap-selected-score">
                <strong>{selectedProfile.readinessScore}%</strong>
                <span>{selectedProfile.tier}</span>
                <em>{selectedProfile.priority}</em>
              </div>
              <ScoreBars profile={selectedProfile} />
              <div className="roadmap-action-grid">
                <PlanList title="Mastery evidence" icon="clipboard" items={selectedProfile.masteryEvidence} />
                <PlanList title="Next actions" icon="step" items={selectedProfile.nextActions} />
                <PlanList title="Practice prompts" icon="spark" items={selectedProfile.practicePrompts} />
                <PlanList title="Blockers" icon="gauge" items={selectedProfile.blockers.length ? selectedProfile.blockers : ["No major blocker for this topic."]} />
              </div>
              <div className="roadmap-link-row">
                <Link className="tool-btn inline-flex items-center gap-2" to={`/concepts?concept=${selectedProfile.topicId}`}>
                  <PhysicsIcon name="book" className="h-4 w-4" /> Concept
                </Link>
                <Link className="tool-btn inline-flex items-center gap-2" to={`/quiz?focus=${encodeURIComponent(selectedProfile.title)}`}>
                  <PhysicsIcon name="check" className="h-4 w-4" /> Practice
                </Link>
                {selectedProfile.experimentIds.map((id) => {
                  const experiment = experiments.find((item) => item.id === id);
                  if (!experiment) return null;
                  return (
                    <Link key={id} className="tool-btn-primary inline-flex items-center gap-2" to={`/experiments/${id}`}>
                      <PhysicsIcon name={iconForExperiment(experiment)} className="h-4 w-4" /> {experiment.title}
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="roadmap-panel roadmap-topic-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="ui-label">{visibleProfiles.length} topics shown</p>
                <h2>Learning path</h2>
              </div>
              <span className="status-chip status-chip-cyan">{classSummary.labs} lab links</span>
            </div>
            <div className="roadmap-unit-stack">
              {units.map((unit) => (
                <article key={unit.id} className="roadmap-unit-v2">
                  <div className="roadmap-unit-header">
                    <h3>{unit.title}</h3>
                    <span>{unit.profiles.length} steps</span>
                  </div>
                  <div className="roadmap-profile-grid">
                    {unit.profiles.map((profile) => (
                      <button key={profile.topicId} type="button" className={profile.topicId === selectedProfile.topicId ? "roadmap-profile-card roadmap-profile-card-active" : "roadmap-profile-card"} onClick={() => selectProfile(profile)}>
                        <span className="roadmap-profile-icon"><PhysicsIcon name={iconForCategory(profile.domain)} /></span>
                        <span>
                          <em>{profile.domain}</em>
                          <strong>{profile.title}</strong>
                          <small>{profile.tier} - {profile.readinessScore}%</small>
                        </span>
                        <span className="roadmap-profile-meter"><i style={{ width: `${profile.readinessScore}%` }} /></span>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function RoadMetric({ icon, label, value }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; value: number }) {
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

function ScoreBars({ profile }: { profile: MasteryRoadmapProfile }) {
  const rows = [
    ["Concept", profile.conceptScore],
    ["Simulation", profile.simulationScore],
    ["Validation", profile.validationScore],
    ["Evidence", profile.evidenceScore],
    ["Access", profile.accessibilityScore],
  ] as const;
  return (
    <div className="roadmap-score-bars">
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

function PlanList({ title, icon, items }: { title: string; icon: Parameters<typeof PhysicsIcon>[0]["name"]; items: string[] }) {
  return (
    <article>
      <h3><PhysicsIcon name={icon} />{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}
