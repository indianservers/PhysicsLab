import { useEffect, useMemo, useState } from "react";
import { experiments } from "../lib/experiments";
import { PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { GuidePanel } from "./GuidePanel";
import { guideForLearningStage } from "../lib/guides";
import { completeStage, exportLearningPortfolio, generateQuiz, getLearningRecord, gradeQuiz, GuidedStage, LearningRecord, progressPercent, saveLearningRecord } from "../lib/learning";
import { ExperimentDefinition } from "../types";

const stages: Array<{ id: GuidedStage; label: string; icon: PhysicsIconName }> = [
  { id: "concept", label: "Concept", icon: "book" },
  { id: "predict", label: "Predict", icon: "compass" },
  { id: "experiment", label: "Experiment", icon: "flask" },
  { id: "record", label: "Notebook", icon: "clipboard" },
  { id: "quiz", label: "Quiz", icon: "check" },
  { id: "mastered", label: "Mastered", icon: "spark" },
];

export function LearningPanel({ experiment }: { experiment: ExperimentDefinition }) {
  const [record, setRecord] = useState<LearningRecord>(() => getLearningRecord(experiment.id));
  const quiz = useMemo(() => generateQuiz(experiment), [experiment]);
  const progress = progressPercent(record);

  useEffect(() => {
    setRecord(getLearningRecord(experiment.id));
  }, [experiment.id]);

  const update = (patch: Partial<LearningRecord>) => {
    const next = { ...record, ...patch };
    setRecord(next);
    saveLearningRecord(next);
  };

  const markStage = (stage: GuidedStage) => {
    const next = completeStage(record, stage);
    setRecord(next);
    saveLearningRecord(next);
  };

  const answerQuiz = (id: string, value: string) => {
    const quizAnswers = { ...record.quizAnswers, [id]: value };
    const quizScore = gradeQuiz(quiz, quizAnswers);
    update({ quizAnswers, quizScore });
  };

  const exportPortfolio = () => {
    const blob = new Blob([JSON.stringify(exportLearningPortfolio(experiments), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "physicslab-learning-portfolio.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel mt-5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="ui-label">Guided learning</p>
          <h2 className="mt-1 text-2xl font-black">Learn, experiment, record, assess</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-300">
            This browser-local workflow saves progress, notebook responses, quiz answers, and mastery state on this device.
          </p>
        </div>
        <button className="tool-btn" onClick={exportPortfolio}>Export portfolio</button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-6">
        {stages.map((stage) => {
          const active = record.currentStage === stage.id;
          const done = record.completedStages.includes(stage.id);
          return (
            <button key={stage.id} className={`${active ? "tab-active" : done ? "tab-btn border-cyan-400 text-cyan-500" : "tab-btn"} inline-flex items-center justify-center gap-2`} onClick={() => update({ currentStage: stage.id })}>
              <PhysicsIcon name={stage.icon} className="h-4 w-4" />
              {stage.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="metric-bar"><span style={{ width: `${progress}%` }} /></div>
        <span className="font-mono text-sm text-cyan-500">{progress}%</span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-300/70 bg-slate-50 p-4 dark:border-lab-line dark:bg-slate-900/70">
          <GuidePanel guide={guideForLearningStage(record.currentStage)} compact />
          <div className="mt-4">
          <StageContent experiment={experiment} record={record} quiz={quiz} onUpdate={update} onAnswer={answerQuiz} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-300/70 bg-slate-50 p-4 dark:border-lab-line dark:bg-slate-900/70">
          <h3 className="flex items-center gap-2 font-black"><PhysicsIcon name="clipboard" className="h-5 w-5 text-cyan-500" />Lab Notebook</h3>
          <NotebookField label="Prediction" value={record.prediction} onChange={(prediction) => update({ prediction })} />
          <NotebookField label="Observation" value={record.observation} onChange={(observation) => update({ observation })} />
          <NotebookField label="Conclusion" value={record.conclusion} onChange={(conclusion) => update({ conclusion })} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {record.currentStage !== "mastered" && <button className="tool-btn-primary inline-flex items-center gap-2" onClick={() => markStage(record.currentStage)}><PhysicsIcon name="check" className="h-4 w-4" />Mark current stage done</button>}
        <button className="tool-btn inline-flex items-center gap-2" onClick={() => markStage("mastered")}><PhysicsIcon name="spark" className="h-4 w-4" />Mark mastered</button>
      </div>
    </section>
  );
}

function StageContent({ experiment, record, quiz, onUpdate, onAnswer }: {
  experiment: ExperimentDefinition;
  record: LearningRecord;
  quiz: ReturnType<typeof generateQuiz>;
  onUpdate: (patch: Partial<LearningRecord>) => void;
  onAnswer: (id: string, value: string) => void;
}) {
  if (record.currentStage === "concept") {
    return (
      <div>
        <h3 className="flex items-center gap-2 font-black"><PhysicsIcon name="book" className="h-5 w-5 text-cyan-500" />Concept Focus</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{experiment.theory}</p>
        <div className="mt-4 grid gap-2 text-sm">
          <div><span className="font-bold text-cyan-500">Aim:</span> {experiment.aim}</div>
          <div><span className="font-bold text-cyan-500">Apparatus:</span> {experiment.apparatus.join(", ")}</div>
        </div>
      </div>
    );
  }

  if (record.currentStage === "predict") {
    return (
      <div>
        <h3 className="flex items-center gap-2 font-black"><PhysicsIcon name="compass" className="h-5 w-5 text-cyan-500" />Prediction</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Before changing variables, predict what will increase, decrease, or stay constant.
        </p>
        <textarea className="mt-3 min-h-32 w-full rounded-md border border-slate-300 bg-white p-3 text-sm dark:border-lab-line dark:bg-slate-950" value={record.prediction} onChange={(event) => onUpdate({ prediction: event.target.value })} />
      </div>
    );
  }

  if (record.currentStage === "experiment") {
    return (
      <div>
        <h3 className="flex items-center gap-2 font-black"><PhysicsIcon name="flask" className="h-5 w-5 text-cyan-500" />Experiment Steps</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {experiment.procedure.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </div>
    );
  }

  if (record.currentStage === "record") {
    return (
      <div>
        <h3 className="flex items-center gap-2 font-black"><PhysicsIcon name="chart" className="h-5 w-5 text-cyan-500" />Observation Table</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr>{experiment.observationColumns.map((column) => <th key={column} className="border-b border-slate-300/60 px-2 py-2 dark:border-lab-line">{column}</th>)}</tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row}>{experiment.observationColumns.map((column, index) => <td key={`${row}-${column}`} className="border-b border-slate-300/40 px-2 py-2 dark:border-lab-line">{index === 0 ? `Trial ${row}` : ""}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{experiment.expectedResult}</p>
      </div>
    );
  }

  if (record.currentStage === "quiz") {
    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-black"><PhysicsIcon name="check" className="h-5 w-5 text-cyan-500" />Quick Assessment</h3>
          <span className="badge">{record.quizScore}%</span>
        </div>
        <div className="mt-3 space-y-4">
          {quiz.map((item) => (
            <div key={item.id} className="rounded-md border border-slate-300/60 p-3 dark:border-lab-line">
              <div className="text-sm font-bold">{item.prompt}</div>
              <div className="mt-2 grid gap-2">
                {item.options.map((option) => (
                  <label key={option} className="flex gap-2 text-sm">
                    <input type="radio" name={`${experiment.id}-${item.id}`} checked={record.quizAnswers[item.id] === option} onChange={() => onAnswer(item.id, option)} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 font-black"><PhysicsIcon name="spark" className="h-5 w-5 text-cyan-500" />Mastery Snapshot</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Metric label="Stages done" value={`${record.completedStages.length}/${stages.length}`} />
        <Metric label="Quiz score" value={`${record.quizScore}%`} />
        <Metric label="Updated" value={new Date(record.updatedAt).toLocaleDateString()} />
      </div>
    </div>
  );
}

function NotebookField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block">
      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</div>
      <textarea className="min-h-20 w-full rounded-md border border-slate-300 bg-white p-3 text-sm dark:border-lab-line dark:bg-slate-950" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <div className="ui-label">{label}</div>
      <div className="mt-1 font-mono text-lg text-cyan-500">{value}</div>
    </div>
  );
}
