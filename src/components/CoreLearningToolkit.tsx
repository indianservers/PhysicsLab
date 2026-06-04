import { useMemo, useRef, useState } from "react";
import { ExperimentDefinition } from "../types";
import { PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { FullscreenButton } from "./FullscreenButton";

interface ToolkitItem {
  id: string;
  icon: PhysicsIconName;
  title: string;
  body: string;
  action: string;
}

export function CoreLearningToolkit({ experiment, defaultOpen = false }: { experiment: ExperimentDefinition; defaultOpen?: boolean }) {
  const panelRef = useRef<HTMLDetailsElement>(null);
  const [revealedQuiz, setRevealedQuiz] = useState(false);
  const firstFormula = experiment.formulae[0];
  const quiz = experiment.vivaQuestions[0];
  const domain = experiment.curriculumTags?.domains[0] ?? experiment.category;
  const items = useMemo<ToolkitItem[]>(() => [
    {
      id: "prerequisites",
      icon: "book",
      title: "Prerequisite Check",
      body: `Before starting, review the core language of ${domain}: variables, units, graph reading, and proportional reasoning.`,
      action: "Name the input, output, and one controlled variable.",
    },
    {
      id: "concept-map",
      icon: "compass",
      title: "Concept Map",
      body: `${experiment.title} connects observation, formula, visualization, and classroom vocabulary into one loop.`,
      action: "Trace: cause -> measurement -> formula -> conclusion.",
    },
    {
      id: "derivation",
      icon: "calculator",
      title: "Formula Derivation",
      body: firstFormula ? `${firstFormula.name}: ${firstFormula.expression}. Start from the definition, substitute SI units, then compare with the live output.` : "This lab is mostly visual, so build the rule from patterns in repeated trials.",
      action: "Write one line explaining why the formula changes when the first slider changes.",
    },
    {
      id: "unit-check",
      icon: "ruler",
      title: "Unit and Dimension Check",
      body: firstFormula?.variables.length ? `Key unit: ${firstFormula.variables[0].symbol} is measured in ${firstFormula.variables[0].unit || "a pure number"}.` : "Record units for every measured quantity before calculating.",
      action: "Convert every slider value to SI form before using the formula.",
    },
    {
      id: "misconception",
      icon: "spark",
      title: "Misconception Repair",
      body: experiment.commonMistakes[0] ?? "The most common error is changing many variables at once and then misreading the pattern.",
      action: "Change one variable only and describe what stayed fixed.",
    },
    {
      id: "application",
      icon: "field",
      title: "Real-World Link",
      body: `Use ${experiment.title.toLowerCase()} to explain a real device, natural event, sports motion, safety rule, or measurement method.`,
      action: "Write one everyday example in your notebook.",
    },
    {
      id: "safety",
      icon: "check",
      title: "Lab Safety Habit",
      body: "Even in a virtual lab, keep the real-lab habit: identify risk, limit ranges, avoid overload, and reset after extreme values.",
      action: "Mark which slider would be unsafe or impractical in a real lab.",
    },
    {
      id: "prediction",
      icon: "eye",
      title: "Prediction First",
      body: "Predict the trend before touching the slider. Good physics learning comes from comparing expectation with result.",
      action: "Say: increase, decrease, unchanged, or reverses direction.",
    },
    {
      id: "quiz",
      icon: "clipboard",
      title: "Quick Quiz",
      body: quiz ? quiz.prompt : `What is the main relationship tested in ${experiment.title}?`,
      action: revealedQuiz ? (quiz?.answer ?? experiment.expectedResult) : "Reveal answer after making your own attempt.",
    },
    {
      id: "mastery",
      icon: "teacher",
      title: "Mastery Rubric",
      body: "Mastery means you can predict, calculate, graph, explain error, and transfer the idea to a new situation.",
      action: "Score yourself: 1 beginner, 2 guided, 3 independent, 4 can teach it.",
    },
  ], [domain, experiment, firstFormula, quiz, revealedQuiz]);

  return (
    <details ref={panelRef} id="toolkit" className="lab-disclosure my-4 fullscreen-target" open={defaultOpen}>
      <summary title="Open prerequisite checks, concept map, quick quiz, and mastery rubric">
        <span className="inline-flex min-w-0 items-center gap-2">
          <PhysicsIcon name="spark" className="h-4 w-4 text-cyan-500" />
          <span className="truncate">Core learning toolkit</span>
        </span>
        <span className="lab-summary-actions">
          <FullscreenButton targetRef={panelRef} compact />
          <span className="info-dot" title="10 compact learning prompts">10</span>
        </span>
      </summary>
      <div className="lab-disclosure-body">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Core learning toolkit</p>
          <h2 className="panel-title mt-1">10 things every lab now includes</h2>
        </div>
        <button className="tool-btn" onClick={() => setRevealedQuiz((value) => !value)}>
          <PhysicsIcon name="clipboard" className="h-4 w-4" />
          {revealedQuiz ? "Hide quiz answer" : "Reveal quiz answer"}
        </button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {items.map((item, index) => (
          <article key={item.id} className="rounded-lg border border-slate-300/70 bg-slate-100 p-3 dark:border-lab-line dark:bg-slate-900/70">
            <div className="flex items-start gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
                <PhysicsIcon name={item.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Core {index + 1}</div>
                <h3 className="mt-0.5 text-sm font-black">{item.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.body}</p>
            <div className="mt-3 rounded-md border border-cyan-400/25 bg-cyan-400/10 p-2 text-xs font-bold text-cyan-700 dark:text-cyan-200">{item.action}</div>
          </article>
        ))}
      </div>
      </div>
    </details>
  );
}
