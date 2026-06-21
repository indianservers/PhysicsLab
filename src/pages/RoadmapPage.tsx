import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCountUp } from "../hooks/useCountUp";
import { Toolbar } from "../components/Toolbar";
import { classOptions } from "../lib/curriculum";
import {
  masteryClassSummaries,
  masteryRoadmapProfiles,
  masteryRoadmapStats,
  type MasteryRoadmapProfile,
} from "../lib/masteryRoadmap";
import { PhysicsIcon, iconForCategory } from "../lib/icons";

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

  return (
    <div className="roadmap-page min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page mx-auto max-w-[1500px] px-3 py-4">
        <section className="roadmap-hero">
          <div className="max-w-3xl">
            <p className="ui-label">Phase 7 / Adaptive mastery roadmap</p>
            <h1>Student Mastery Roadmap</h1>
            <p>
              Pick a topic and open the validated interactive lab or concept explorer directly.
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

        <section className="roadmap-launch-strip">
          <div>
            <p className="ui-label">Selected launch</p>
            <h2>{selectedProfile.title}</h2>
            <p>{launchDescription(selectedProfile)}</p>
          </div>
          <Link className="tool-btn-primary inline-flex items-center justify-center gap-2" to={interactivePath(selectedProfile)}>
            <PhysicsIcon name={selectedProfile.experimentIds[0] ? "flask" : "book"} className="h-4 w-4" />
            Launch interactive tool
          </Link>
        </section>

        <section className="roadmap-layout roadmap-layout-compact">
          <section className="roadmap-panel roadmap-topic-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="ui-label">{visibleProfiles.length} topics shown</p>
                <h2>Choose a topic to launch</h2>
              </div>
              <span className="status-chip status-chip-cyan">{classSummary.labs} direct lab links</span>
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
                      <Link key={profile.topicId} className={profile.topicId === selectedProfile.topicId ? "roadmap-profile-card roadmap-profile-card-active" : "roadmap-profile-card"} to={interactivePath(profile)}>
                        <span className="roadmap-profile-icon"><PhysicsIcon name={iconForCategory(profile.domain)} /></span>
                        <span>
                          <em>{profile.domain}</em>
                          <strong>{profile.title}</strong>
                          <small>{cardLaunchLabel(profile)}</small>
                        </span>
                        <span className="roadmap-profile-meter"><i style={{ width: `${profile.readinessScore}%` }} /></span>
                      </Link>
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

function interactivePath(profile: MasteryRoadmapProfile) {
  return profile.experimentIds[0] ? `/experiments/${profile.experimentIds[0]}` : `/concepts?concept=${profile.topicId}`;
}

function launchDescription(profile: MasteryRoadmapProfile) {
  return profile.labTitles[0]
    ? `Opens ${profile.labTitles[0]} as a full interactive workspace.`
    : "Opens the concept explorer for this topic.";
}

function cardLaunchLabel(profile: MasteryRoadmapProfile) {
  return profile.labTitles[0]
    ? `Launch lab - ${profile.readinessScore}% ready`
    : `Open concept - ${profile.readinessScore}% ready`;
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
