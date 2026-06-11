import { ExperimentDefinition } from "../types";
import { commonMistakesForExperiment } from "../lib/commonMistakes";
import { LearningLevel, learningLevelProfiles } from "../lib/learningLevels";
import { PhysicsIcon } from "../lib/icons";

export function ConceptExplainer({ experiment, level, controls = [] }: { experiment: ExperimentDefinition; level: LearningLevel; controls?: Array<{ label: string; unit?: string }> }) {
  const profile = learningLevelProfiles[level];
  const formula = experiment.formulae[0];
  const variables = formula?.variables ?? [];
  const mistakes = commonMistakesForExperiment(experiment);
  const realWorld = realWorldExample(experiment);
  const sliderCue = controls[0]?.label ?? variables[0]?.name ?? "the first variable";

  return (
    <section className="phase4-panel">
      <div className="phase4-panel-head">
        <div>
          <p className="ui-label">Concept explainer</p>
          <h2>Learn the idea before the math</h2>
        </div>
        <span className="status-chip status-chip-cyan">{profile.audience}</span>
      </div>
      <div className="phase4-grid">
        <ExplainerCard title="What is happening?" icon="eye" body={experiment.aim} />
        <ExplainerCard title="Why does it happen?" icon="compass" body={explainWhy(experiment, profile.explanationDepth)} />
        <ExplainerCard title="Formula involved" icon="calculator" body={formula ? `${formula.name}: ${formula.expression}` : "This experiment is mainly visual; use observations to infer the rule."} />
        <ExplainerCard title="Real-world example" icon="field" body={realWorld} />
        <ExplainerCard title="Common mistake" icon="spark" body={mistakes[0] ?? "Changing too many variables at once hides the cause."} />
        <ExplainerCard title="Try changing this" icon="ruler" body={`Change ${sliderCue} slowly, keep other variables fixed, and predict the graph trend before reading values.`} />
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

function explainWhy(experiment: ExperimentDefinition, depth: number) {
  if (depth <= 1) return `${experiment.title} shows how one change causes another physical change.`;
  if (depth <= 3) return experiment.theory;
  return `${experiment.theory} The key is to connect the measurable variable, its SI unit, the formula assumptions, and the graph shape into one causal model.`;
}

function realWorldExample(experiment: ExperimentDefinition) {
  if (experiment.category === "Electricity") return "House wiring, phone chargers, heaters, and circuit protection all depend on the same variables.";
  if (experiment.category === "Optics") return "Cameras, spectacles, microscopes, telescopes, and fiber optics use these ray or wave rules.";
  if (experiment.category === "Waves") return "Sound, water ripples, wireless signals, and musical instruments use wave relationships.";
  if (experiment.category === "Thermodynamics") return "Cooking, engines, weather, refrigerators, and insulation use these heat and gas ideas.";
  if (experiment.category === "Fluid Mechanics") return "Dams, ships, syringes, aircraft wings, and water pipes use pressure and flow ideas.";
  return "Sports motion, transport, machines, structures, and measurement tools use this concept.";
}
