import { ExperimentDefinition } from "../types";
import { commonMistakesForExperiment } from "../lib/commonMistakes";
import { LearningLevel, learningLevelProfiles } from "../lib/learningLevels";
import { PhysicsIcon } from "../lib/icons";
import { lessonTeachingContent } from "../lib/lessonTeachingContent";
import { lessonUiUpgrades } from "../lib/lessonUiUpgrades";

export function ConceptExplainer({ experiment, level, controls = [] }: { experiment: ExperimentDefinition; level: LearningLevel; controls?: Array<{ label: string; unit?: string }> }) {
  const profile = learningLevelProfiles[level];
  const formula = experiment.formulae[0];
  const variables = formula?.variables ?? [];
  const mistakes = commonMistakesForExperiment(experiment);
  const teaching = lessonTeachingContent[experiment.id];
  const lessonUi = lessonUiUpgrades[experiment.id];
  const sliderCue = controls[0]?.label ?? variables[0]?.name ?? "the first variable";
  const formulaSummary = formula
    ? `${formula.name}: ${formula.expression}. ${variables.length ? `Here ${variables.map((variable) => `${variable.symbol} means ${variable.name}${variable.unit ? ` in ${variable.unit}` : ""}`).join(", ")}.` : "Use the displayed measurements to test this relationship."}`
    : "This lesson is evidence-led: compare the visible change with the measured result and state the pattern in words.";
  const whyItHappens = teaching?.theory ?? experiment.theory;
  const realWorld = teaching ? `${teaching.application.title}: ${teaching.application.explanation}` : realWorldExample(experiment);
  const investigationCue = teaching?.watchFor ?? `${experiment.procedure[0]} Keep the other controls fixed so the cause remains clear.`;

  return (
    <section className="phase4-panel">
      <div className="phase4-panel-head">
        <div>
          <p className="ui-label">{experiment.title} · concept guide</p>
          <h2>{teaching?.title ?? "Understand the physical relationship"}</h2>
          <p className="phase4-summary">Start with the cause, watch the response, then connect the measurement to the equation.</p>
        </div>
        <span className="status-chip status-chip-cyan">{profile.audience}</span>
      </div>
      <div className="phase4-grid">
        <ExplainerCard title="Question this lesson answers" icon="eye" body={experiment.aim} />
        <ExplainerCard title="Why it happens" icon="compass" body={whyItHappens} />
        <ExplainerCard title="Equation and quantities" icon="calculator" body={formulaSummary} />
        <ExplainerCard title="Real-world example" icon="field" body={realWorld} />
        <ExplainerCard title="Common mistake" icon="spark" body={mistakes[0] ?? "Changing too many variables at once hides the cause."} />
        <ExplainerCard title="What to change and watch" icon="ruler" body={`${lessonUi?.mode ? `${lessonUi.mode}: ` : ""}Change ${sliderCue} slowly. ${investigationCue}`} />
      </div>
      {variables.length > 0 && (
        <div className="phase4-variable-table">
          <div className="ui-label">Variables and units</div>
          <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {variables.map((variable) => (
              <div key={`${variable.symbol}-${variable.name}`} className="phase4-variable-chip">
                <strong>{variable.symbol}</strong>
                <span>{variable.name}</span>
                <em>{variable.unit || "unitless"}</em>
              </div>
            ))}
          </div>
        </div>
      )}
      {profile.showAssumptions && (
        <div className="phase4-note">
          <strong>Active assumption:</strong> {(experiment.assumptions ?? [])[0] ?? "Use the stated model limits before treating the result as quantitative."}
        </div>
      )}
    </section>
  );
}

function ExplainerCard({ title, body, icon }: { title: string; body: string; icon: "eye" | "compass" | "calculator" | "field" | "spark" | "ruler" }) {
  return (
    <article className="phase4-card">
      <div className="phase4-card-title"><PhysicsIcon name={icon} className="h-4 w-4" />{title}</div>
      <p>{body}</p>
    </article>
  );
}

function realWorldExample(experiment: ExperimentDefinition) {
  if (experiment.category === "Electricity") return "House wiring, phone chargers, heaters, and circuit protection all depend on the same variables.";
  if (experiment.category === "Optics") return "Cameras, spectacles, microscopes, telescopes, and fiber optics use these ray or wave rules.";
  if (experiment.category === "Waves") return "Sound, water ripples, wireless signals, and musical instruments use wave relationships.";
  if (experiment.category === "Thermodynamics") return "Cooking, engines, weather, refrigerators, and insulation use these heat and gas ideas.";
  if (experiment.category === "Fluid Mechanics") return "Dams, ships, syringes, aircraft wings, and water pipes use pressure and flow ideas.";
  return "Sports motion, transport, machines, structures, and measurement tools use this concept.";
}
