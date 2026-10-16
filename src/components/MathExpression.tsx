import { renderFormula } from "../lib/formulas";
import { experiments } from "../lib/experiments";

/** Render stored TeX as math rather than exposing its source to students. */
export function MathExpression({ expression }: { expression: string }) {
  return <span className="lesson-math" dangerouslySetInnerHTML={{ __html: renderFormula(expression) }} />;
}

const expressions = [...new Set(experiments.flatMap(experiment => experiment.formulae.flatMap(formula =>
  [formula.expression, ...formula.variables.map(variable => variable.symbol)].filter(text => text.includes("\\") || text.includes("_") || text.includes("^"))
)))].sort((a, b) => b.length - a.length);

/** Preserve prose, rendering only known formula/variable spans. */
export function MathText({ text }: { text: string }) {
  const match = expressions.find(expression => text.includes(expression));
  if (!match) return <>{text}</>;
  const index = text.indexOf(match);
  return <><MathText text={text.slice(0, index)} /><MathExpression expression={match} /><MathText text={text.slice(index + match.length)} /></>;
}
