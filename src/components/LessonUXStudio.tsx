import { useEffect, useMemo, useState } from "react";
import type { ExperimentDefinition } from "../types";
import { lessonTeachingContent } from "../lib/lessonTeachingContent";
import "./lesson-ux-studio.css";

type UXStage = "predict" | "manipulate" | "observe" | "explain" | "complete";
type UXRecord = { stage: UXStage; prediction: string; observation: string; explanation: string; completed: UXStage[] };

const stages: Array<{ id: UXStage; label: string }> = [
  { id: "predict", label: "1 · Predict" },
  { id: "manipulate", label: "2 · Manipulate" },
  { id: "observe", label: "3 · Observe" },
  { id: "explain", label: "4 · Explain" },
  { id: "complete", label: "5 · Complete" },
];
const blankRecord = (): UXRecord => ({ stage: "predict", prediction: "", observation: "", explanation: "", completed: [] });
const storageKey = (id: string) => `physicslab.lesson-ux.${id}`;

function loadRecord(id: string): UXRecord {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(id)) ?? "null") as Partial<UXRecord> | null;
    if (!parsed) return blankRecord();
    return { ...blankRecord(), ...parsed, completed: Array.isArray(parsed.completed) ? parsed.completed : [] };
  } catch { return blankRecord(); }
}

export function LessonUXStudio({ experiment }: { experiment: ExperimentDefinition }) {
  const teaching = lessonTeachingContent[experiment.id];
  const [record, setRecord] = useState<UXRecord>(() => loadRecord(experiment.id));
  useEffect(() => localStorage.setItem(storageKey(experiment.id), JSON.stringify(record)), [experiment.id, record]);

  const unique = useMemo(() => teaching ? [
    { id: "manipulate" as UXStage, label: "Signature manipulation", title: experiment.apparatus[0] ?? experiment.title, detail: experiment.procedure[0] },
    { id: "manipulate" as UXStage, label: "Concept animation", title: teaching.title, detail: teaching.watchFor },
    { id: "predict" as UXStage, label: "Prediction challenge", title: "Commit before running", detail: teaching.check.question },
    { id: "observe" as UXStage, label: "Authentic measurement", title: experiment.apparatus.slice(0, 3).join(" · "), detail: `Record ${experiment.observationColumns.slice(0, 4).join(", ")}.` },
    { id: "complete" as UXStage, label: "Mastery mission", title: "Prove the relationship", detail: experiment.expectedResult },
  ] : [], [experiment, teaching]);

  if (!teaching) return null;
  const patchRecord = (patch: Partial<UXRecord>) => setRecord((current) => ({ ...current, ...patch }));
  const finishStage = () => {
    const completed = record.completed.includes(record.stage) ? record.completed : [...record.completed, record.stage];
    const index = stages.findIndex((item) => item.id === record.stage);
    patchRecord({ completed, stage: stages[Math.min(index + 1, stages.length - 1)].id });
  };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const progress = Math.round((record.completed.length / stages.length) * 100);

  return (
    <section className="lesson-ux" aria-labelledby={`lesson-ux-title-${experiment.id}`}>
      <header>
        <div><span>INTERACTIVE LEARNING FLIGHT PLAN</span><h2 id={`lesson-ux-title-${experiment.id}`}>{experiment.title}: learn by doing</h2></div>
        <div className="lesson-ux-actions">
          <button type="button" onClick={() => scrollTo(`live-lab-${experiment.id}`)}>Focus live lab</button>
          <button type="button" onClick={() => scrollTo(`lesson-theory-${experiment.id}`)}>Open theory</button>
        </div>
      </header>
      <div className="lesson-ux-progress"><i style={{ width: `${progress}%` }} /><span>{progress}% learning flow</span></div>
      <nav aria-label="Learning stages">{stages.map((stage) => <button type="button" key={stage.id} className={record.stage === stage.id ? "active" : record.completed.includes(stage.id) ? "done" : ""} onClick={() => patchRecord({ stage: stage.id })}>{stage.label}</button>)}</nav>
      <div className="lesson-unique-grid">{unique.map((item, index) => <button type="button" key={`${item.label}-${index}`} onClick={() => patchRecord({ stage: item.id })}><span>UNIQUE {index + 1}</span><small>{item.label}</small><b>{item.title}</b><p>{item.detail}</p></button>)}</div>
      <div className="lesson-workflow">
        <article>
          <span>CURRENT STEP</span>
          <h3>{stages.find((item) => item.id === record.stage)?.label}</h3>
          {record.stage === "predict" && <label>Prediction<textarea value={record.prediction} onChange={(event) => patchRecord({ prediction: event.target.value })} placeholder={teaching.check.question} /></label>}
          {record.stage === "manipulate" && <div className="lesson-stage-copy"><b>Do this in the live apparatus</b><p>{experiment.procedure.slice(0, 2).join(" ")}</p><button type="button" onClick={() => scrollTo(`live-lab-${experiment.id}`)}>Go to apparatus</button></div>}
          {record.stage === "observe" && <label>Observation<textarea value={record.observation} onChange={(event) => patchRecord({ observation: event.target.value })} placeholder={`What changed in ${experiment.observationColumns.slice(0, 3).join(", ")}?`} /></label>}
          {record.stage === "explain" && <label>Physics explanation<textarea value={record.explanation} onChange={(event) => patchRecord({ explanation: event.target.value })} placeholder={`Use ${experiment.formulae[0]?.expression ?? "the lesson relationship"} to explain the result.`} /></label>}
          {record.stage === "complete" && <div className="lesson-stage-copy"><b>Mastery target</b><p>{experiment.expectedResult}</p><p><strong>Self-check:</strong> {teaching.check.question}</p></div>}
          <button className="lesson-stage-done" type="button" onClick={finishStage}>Mark step complete</button>
        </article>
        <aside>
          <span>COMMON UX · ALL LESSONS</span>
          <ul>
            <li><b>Consistent controls</b><small>Play, pause, step, replay and reset stay inside the live lab.</small></li>
            <li><b>Learning sequence</b><small>Predict → manipulate → observe → explain → complete.</small></li>
            <li><b>One source of truth</b><small>Read animation, meters, vectors, equations and graphs together.</small></li>
            <li><b>Accessible input</b><small>Use pointer, touch, keyboard, numeric controls and reduced motion.</small></li>
            <li><b>Persistent workspace</b><small>Your prediction, observation, explanation and progress stay on this device.</small></li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
