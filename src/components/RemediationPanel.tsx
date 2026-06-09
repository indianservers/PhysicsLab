import { Link } from "react-router-dom";
import { buildConceptCards } from "../lib/concepts";
import { experiments } from "../lib/experiments";
import { quizQuestions } from "../lib/quiz";
import { PhysicsIcon, iconForExperiment } from "../lib/icons";

export interface RemediationTag {
  tag: string;
  score: number;
}

export function RemediationPanel({ weakConcepts }: { weakConcepts: RemediationTag[] }) {
  const plans = weakConcepts.slice(0, 5).map((item) => makePlan(item));
  return (
    <section className="remediation-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Phase 4 remediation</p>
          <h2 className="text-xl font-black">Targeted recovery path</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
            Missed concepts become focused review, lab retry, solver practice, and a shorter next quiz.
          </p>
        </div>
        <span className="status-chip status-chip-cyan">
          <PhysicsIcon name="teacher" className="h-3.5 w-3.5" />
          Adaptive
        </span>
      </div>

      {plans.length ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.tag} className="remediation-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="ui-label">Weak tag +{plan.score}</p>
                  <h3 className="text-lg font-black">{plan.tag}</h3>
                </div>
                {plan.lab && (
                  <span className="status-chip">
                    <PhysicsIcon name={iconForExperiment(plan.lab)} className="h-3.5 w-3.5" />
                    {plan.lab.title}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{plan.reason}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Link className="remediation-action" to={plan.conceptPath}>
                  <PhysicsIcon name="book" className="h-4 w-4" />
                  <span>Review concept</span>
                </Link>
                <Link className="remediation-action" to={plan.labPath}>
                  <PhysicsIcon name="flask" className="h-4 w-4" />
                  <span>Retry lab</span>
                </Link>
                <Link className="remediation-action" to={`/solver?tag=${encodeURIComponent(plan.tag)}`}>
                  <PhysicsIcon name="calculator" className="h-4 w-4" />
                  <span>Solve {plan.solverCount || "similar"}</span>
                </Link>
                <Link className="remediation-action" to={`/quiz?focus=${encodeURIComponent(plan.tag)}`}>
                  <PhysicsIcon name="check" className="h-4 w-4" />
                  <span>Focused quiz</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="remediation-empty mt-4">
          <PhysicsIcon name="check" className="h-5 w-5 text-cyan-500" />
          <span>No weak tags yet. Miss one or reveal an explanation, and this area will turn it into a recovery path.</span>
        </div>
      )}
    </section>
  );
}

function makePlan(item: RemediationTag) {
  const concepts = buildConceptCards();
  const normalized = item.tag.toLowerCase();
  const concept = concepts.find((card) => matches(card.title, normalized) || matches(card.domain, normalized) || card.essentials.some((essential) => matches(essential, normalized)) || card.outcomes.some((outcome) => matches(outcome, normalized))) ?? concepts[0];
  const lab = concept.experimentIds.map((id) => experiments.find((experiment) => experiment.id === id)).find(Boolean) ?? experiments.find((experiment) => `${experiment.title} ${experiment.category} ${experiment.theory}`.toLowerCase().includes(normalized));
  const solverCount = quizQuestions.filter((question) => question.conceptTags.some((tag) => tag.toLowerCase() === normalized)).length;
  return {
    tag: item.tag,
    score: item.score,
    conceptPath: concept ? `/concepts?concept=${concept.id}` : "/concepts",
    labPath: lab ? `/experiments/${lab.id}` : "/experiments",
    lab,
    solverCount,
    reason: concept ? `Rebuild ${concept.title} through the concept card, then verify it in a lab before another quiz round.` : "Review the nearest concept, retry the lab, and then take a focused quiz round.",
  };
}

function matches(value: string, normalizedTag: string) {
  const text = value.toLowerCase();
  return text.includes(normalizedTag) || normalizedTag.split(/\s+/).some((part) => part.length > 3 && text.includes(part));
}
