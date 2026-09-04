import { useEffect, useMemo, useState } from "react";
import type { ExperimentDefinition } from "../types";
import { lessonTeachingContent } from "../lib/lessonTeachingContent";
import { lessonUiUpgrades } from "../lib/lessonUiUpgrades";
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
const isUXStage = (value: unknown): value is UXStage => stages.some((stage) => stage.id === value);

function loadRecord(id: string): UXRecord {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(id)) ?? "null") as Partial<UXRecord> | null;
    if (!parsed) return blankRecord();
    const completed = Array.isArray(parsed.completed)
      ? [...new Set(parsed.completed.filter(isUXStage))]
      : [];
    return {
      ...blankRecord(),
      ...parsed,
      stage: isUXStage(parsed.stage) ? parsed.stage : "predict",
      prediction: typeof parsed.prediction === "string" ? parsed.prediction : "",
      observation: typeof parsed.observation === "string" ? parsed.observation : "",
      explanation: typeof parsed.explanation === "string" ? parsed.explanation : "",
      completed,
    };
  } catch { return blankRecord(); }
}

export function LessonUXStudio({ experiment }: { experiment: ExperimentDefinition }) {
  const teaching = lessonTeachingContent[experiment.id];
  const premium = lessonUiUpgrades[experiment.id];
  const [record, setRecord] = useState<UXRecord>(() => loadRecord(experiment.id));
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(experiment.id), JSON.stringify(record));
    } catch {
      // The lesson remains usable when storage is blocked or the browser quota is full.
    }
  }, [experiment.id, record]);

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
    const nextStage = stages[Math.min(Math.max(index, 0) + 1, stages.length - 1)].id;
    patchRecord({ completed, stage: nextStage });
  };
  const scrollTo = (id: string) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };
  const progress = Math.round((record.completed.length / stages.length) * 100);

  return (
    <section className="lesson-ux" aria-labelledby={`lesson-ux-title-${experiment.id}`}>
      <header>
        <div><span>PREMIUM INTERACTIVE LEARNING STUDIO</span><h2 id={`lesson-ux-title-${experiment.id}`}>{experiment.title}: learn by doing</h2>{premium && <p className="lesson-premium-identity"><b>{premium.mode}</b><small>{premium.causal.join(" → ")}</small></p>}</div>
        <div className="lesson-ux-actions">
          <button type="button" onClick={() => scrollTo(`live-lab-${experiment.id}`)}>Focus live lab</button>
          <button type="button" onClick={() => scrollTo(`lesson-theory-${experiment.id}`)}>Open theory</button>
        </div>
      </header>
      <div className="lesson-premium-rail" aria-label="Premium lesson capabilities"><span><b>LIVE</b> scientific model</span><span><b>A/B</b> trial comparison</span><span><b>80/80</b> lesson-specific UI</span><span><b>{experiment.trustLevel}%</b> trust</span></div>
      <div className="lesson-ux-progress" role="progressbar" aria-label="Learning flow progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><i style={{ width: `${progress}%` }} /><span>{progress}% learning flow</span></div>
      <nav aria-label="Learning stages">{stages.map((stage) => <button type="button" key={stage.id} aria-current={record.stage === stage.id ? "step" : undefined} className={record.stage === stage.id ? "active" : record.completed.includes(stage.id) ? "done" : ""} onClick={() => patchRecord({ stage: stage.id })}>{stage.label}</button>)}</nav>
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
          <button className="lesson-stage-done" type="button" onClick={finishStage} disabled={record.stage === "complete" && record.completed.includes("complete")}>{record.stage === "complete" && record.completed.includes("complete") ? "Lesson complete" : "Mark step complete"}</button>
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
