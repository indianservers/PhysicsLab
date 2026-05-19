import katex from "katex";
import "katex/dist/katex.min.css";
import { FormulaDefinition } from "../types";

export interface FormulaEvaluation {
  id: string;
  html: string;
  substituted: string;
  value: number;
  unit: string;
}

export const coreFormulae: FormulaDefinition[] = [
  {
    id: "kinematics-v",
    name: "Velocity under constant acceleration",
    expression: "v = u + at",
    variables: [
      { symbol: "u", name: "Initial velocity", unit: "m/s" },
      { symbol: "a", name: "Acceleration", unit: "m/s^2" },
      { symbol: "t", name: "Time", unit: "s" },
    ],
  },
  {
    id: "kinematics-s",
    name: "Displacement under constant acceleration",
    expression: "s = ut + \\frac{1}{2}at^2",
    variables: [
      { symbol: "s", name: "Displacement", unit: "m" },
      { symbol: "t", name: "Time", unit: "s" },
    ],
  },
  {
    id: "newton-2",
    name: "Newton's second law",
    expression: "F = ma",
    variables: [
      { symbol: "F", name: "Force", unit: "N" },
      { symbol: "m", name: "Mass", unit: "kg" },
      { symbol: "a", name: "Acceleration", unit: "m/s^2" },
    ],
  },
  {
    id: "energy",
    name: "Mechanical energy",
    expression: "E = \\frac{1}{2}mv^2 + mgh",
    variables: [
      { symbol: "m", name: "Mass", unit: "kg" },
      { symbol: "v", name: "Speed", unit: "m/s" },
      { symbol: "h", name: "Height", unit: "m" },
    ],
  },
  {
    id: "projectile-range",
    name: "Projectile range",
    expression: "R = \\frac{u^2\\sin(2\\theta)}{g}",
    variables: [
      { symbol: "u", name: "Initial speed", unit: "m/s" },
      { symbol: "\\theta", name: "Launch angle", unit: "degree" },
      { symbol: "g", name: "Gravity", unit: "m/s^2" },
    ],
  },
  {
    id: "hooke",
    name: "Hooke's law",
    expression: "F = -kx",
    variables: [
      { symbol: "k", name: "Spring constant", unit: "N/m" },
      { symbol: "x", name: "Extension", unit: "m" },
    ],
  },
  {
    id: "ohm",
    name: "Ohm's law",
    expression: "V = IR",
    variables: [
      { symbol: "V", name: "Voltage", unit: "V" },
      { symbol: "I", name: "Current", unit: "A" },
      { symbol: "R", name: "Resistance", unit: "ohm" },
    ],
  },
  {
    id: "ideal-gas",
    name: "Ideal gas law",
    expression: "PV = nRT",
    variables: [
      { symbol: "P", name: "Pressure", unit: "Pa" },
      { symbol: "V", name: "Volume", unit: "m^3" },
      { symbol: "T", name: "Temperature", unit: "K" },
    ],
  },
];

export function renderFormula(expression: string) {
  return katex.renderToString(expression, { throwOnError: false, displayMode: false });
}

export function evaluateFormula(id: string, values: Record<string, number>): FormulaEvaluation | undefined {
  const formula = coreFormulae.find((item) => item.id === id);
  if (!formula) return undefined;
  if (id === "projectile-range") {
    const u = values.u ?? 20;
    const theta = ((values.theta ?? 45) * Math.PI) / 180;
    const g = values.g ?? 9.81;
    const value = (u * u * Math.sin(2 * theta)) / g;
    return makeEvaluation(formula, `${u}^2 sin(${2 * (values.theta ?? 45)} deg) / ${g}`, value, "m");
  }
  if (id === "newton-2") return makeEvaluation(formula, `${values.m ?? 1} x ${values.a ?? 9.81}`, (values.m ?? 1) * (values.a ?? 9.81), "N");
  if (id === "ohm") return makeEvaluation(formula, `${values.I ?? 1} x ${values.R ?? 10}`, (values.I ?? 1) * (values.R ?? 10), "V");
  if (id === "ideal-gas") return makeEvaluation(formula, `nRT / V`, ((values.n ?? 1) * 8.314 * (values.T ?? 300)) / (values.V ?? 1), "Pa");
  if (id === "hooke") return makeEvaluation(formula, `-${values.k ?? 10} x ${values.x ?? 0.2}`, -(values.k ?? 10) * (values.x ?? 0.2), "N");
  return makeEvaluation(formula, "live substitution ready", 0, "");
}

function makeEvaluation(formula: FormulaDefinition, substituted: string, value: number, unit: string): FormulaEvaluation {
  return {
    id: formula.id,
    html: renderFormula(formula.expression),
    substituted,
    value,
    unit,
  };
}
