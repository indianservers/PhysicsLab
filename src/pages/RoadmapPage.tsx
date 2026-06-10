import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { classOptions, curriculum } from "../lib/curriculum";
import { experiments } from "../lib/experiments";
import { buildConceptCards } from "../lib/concepts";
import { PhysicsIcon, iconForExperiment } from "../lib/icons";
import { interactionModes } from "../components/InteractionModePanel";

const schoolClasses = classOptions.filter((item) => item.grade >= 6 && item.grade <= 12);

export function RoadmapPage() {
  const [params, setParams] = useSearchParams();
  const initialClass = params.get("class") ?? schoolClasses[0]?.id ?? "class-6";
  const [classId, setClassId] = useState(initialClass);
  const concepts = useMemo(() => buildConceptCards(), []);
  const selectedClass = curriculum.find((item) => item.id === classId) ?? curriculum[0];
  const topics = selectedClass.units.flatMap((unit) => unit.topics.map((topic) => ({ ...topic, unitId: unit.id, unitTitle: unit.title })));
  const mappedLabs = new Set(topics.flatMap((topic) => topic.experimentIds));
  const completed = topics.filter((topic) => topic.experimentIds.length > 0).length;
  const progress = Math.round((completed / Math.max(1, topics.length)) * 100);

  const changeClass = (nextClassId: string) => {
    setClassId(nextClassId);
    const next = new URLSearchParams(params);
    next.set("class", nextClassId);
    setParams(next);
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="mx-auto max-w-[1500px] px-3 py-4">
        <section className="page-hero">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="ui-label">Phase 7 student roadmap</p>
              <h1 className="text-3xl font-black text-gradient">Class-wise physics path</h1>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                A simple sequence from concept to 2D/3D lab, practice, remediation, and notebook for each class.
              </p>
            </div>
            <div className="grid min-w-[280px] gap-2 sm:grid-cols-3">
              <RoadMetric icon="book" label="Topics" value={topics.length} />
              <RoadMetric icon="flask" label="Labs" value={mappedLabs.size} />
              <RoadMetric icon="gauge" label="Ready" value={progress} suffix="%" />
            </div>
          </div>
        </section>

        <section className="topic-lens-panel mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="ui-label">Choose class</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {schoolClasses.map((item) => (
                  <button key={item.id} className={classId === item.id ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => changeClass(item.id)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-w-[220px]">
              <div className="flex items-center justify-between gap-3 text-sm font-black">
                <span>{selectedClass.label}</span>
                <span>{progress}%</span>
              </div>
              <div className="mini-progress mt-2"><span style={{ width: `${progress}%` }} /></div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4">
          {selectedClass.units.map((unit) => {
            const unitTopics = topics.filter((topic) => topic.unitId === unit.id);
            return (
              <article key={unit.id} className="roadmap-unit">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="ui-label">{selectedClass.source}</p>
                    <h2 className="text-2xl font-black">{unit.title}</h2>
                  </div>
                  <span className="status-chip status-chip-cyan">{unitTopics.length} steps</span>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {unitTopics.map((topic, index) => {
                    const concept = concepts.find((card) => card.id === topic.id);
                    const lab = topic.experimentIds.map((id) => experiments.find((experiment) => experiment.id === id)).find(Boolean);
                    const modes = lab ? interactionModes(lab).filter((mode) => mode.active).slice(0, 4) : [];
                    return (
                      <div key={topic.id} className="roadmap-step">
                        <div className="roadmap-step-number">{index + 1}</div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="ui-label">{topic.domain}</p>
                              <h3 className="text-lg font-black">{topic.title}</h3>
                            </div>
                            <span className={lab ? "status-chip status-chip-cyan" : "status-chip"}>{lab ? "lab ready" : "concept only"}</span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{topic.outcomes[0] ?? concept?.summary}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {modes.map((mode) => <span key={mode.id} className="status-chip">{mode.label}</span>)}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link className="tool-btn inline-flex items-center gap-2" to={`/concepts?concept=${topic.id}`}><PhysicsIcon name="spark" className="h-4 w-4" />Concept</Link>
                            {lab && <Link className="tool-btn-primary inline-flex items-center gap-2" to={`/experiments/${lab.id}`}><PhysicsIcon name={iconForExperiment(lab)} className="h-4 w-4" />Lab</Link>}
                            <Link className="tool-btn inline-flex items-center gap-2" to={`/quiz?focus=${encodeURIComponent(topic.title)}`}><PhysicsIcon name="check" className="h-4 w-4" />Practice</Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}

function RoadMetric({ icon, label, value, suffix = "" }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; value: number; suffix?: string }) {
  return (
    <div className="metric-card flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
        <PhysicsIcon name={icon} />
      </span>
      <span>
        <span className="ui-label">{label}</span>
        <strong className="mt-1 block text-2xl font-black text-cyan-500">{value}{suffix}</strong>
      </span>
    </div>
  );
}
