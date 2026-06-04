import { useMemo, useState } from "react";
import { PhysicsIcon } from "../lib/icons";
import { coreFormulae, renderFormula } from "../lib/formulas";

interface SymbolInfo {
  symbol: string;
  name: string;
  unit: string;
  mistake: string;
}

interface UnitOption {
  unit: string;
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

interface UnitCategory {
  id: string;
  title: string;
  baseUnit: string;
  options: UnitOption[];
}

interface PlotPoint {
  x: number;
  y: number;
}

interface RevisionQuestion {
  id: string;
  prompt: string;
  answer: string;
  conceptTags: string[];
  difficulty: string;
  classRange: string;
  category?: { title: string };
  subcategory?: { title: string };
}

const symbolMistakes: Record<string, string> = {
  v: "Do not mix final velocity with average velocity.",
  u: "Keep initial velocity separate from final velocity.",
  a: "Acceleration uses m/s^2, not m/s.",
  t: "Convert minutes or hours into seconds before substituting.",
  s: "Displacement has direction; distance does not.",
  F: "Use net force, not just one applied force.",
  m: "Mass is kg; weight is mg in newtons.",
  E: "Energy units must be joules when SI quantities are used.",
  g: "Use local gravitational field strength, usually 9.8 m/s^2 on Earth.",
  h: "Height must be vertical height for mgh.",
  "\\theta": "Calculator trig functions may need degrees or radians; check the mode.",
  k: "Spring constant is N/m; do not use mass in place of k.",
  x: "Extension is change in length, not total spring length.",
  V: "Voltage is potential difference, not volume in circuit questions.",
  I: "Current is charge per second; do not confuse it with intensity.",
  R: "Resistance is in ohms and can change with temperature.",
  P: "Pressure, power, and momentum can all use P/p; read the context.",
  T: "Gas law temperature must be kelvin.",
  n: "Amount of gas is in moles.",
  Q: "Heat is energy transfer; temperature is not heat.",
  W: "Work is force times displacement in the force direction.",
  f: "Frequency is cycles per second, not time period.",
  "\\lambda": "Wavelength must use the same length unit as wave speed.",
  "\\rho": "Density is mass per volume; watch cm^3 versus m^3.",
};

const extraSymbols: SymbolInfo[] = [
  { symbol: "Q", name: "Heat transferred", unit: "J", mistake: symbolMistakes.Q },
  { symbol: "W", name: "Work done", unit: "J", mistake: symbolMistakes.W },
  { symbol: "f", name: "Frequency", unit: "Hz", mistake: symbolMistakes.f },
  { symbol: "\\lambda", name: "Wavelength", unit: "m", mistake: symbolMistakes["\\lambda"] },
  { symbol: "\\rho", name: "Density", unit: "kg/m^3", mistake: symbolMistakes["\\rho"] },
];

const unitCategories: UnitCategory[] = [
  {
    id: "length",
    title: "Length",
    baseUnit: "m",
    options: [
      unit("m", "metre", 1),
      unit("cm", "centimetre", 0.01),
      unit("mm", "millimetre", 0.001),
      unit("km", "kilometre", 1000),
      unit("inch", "inch", 0.0254),
      unit("ft", "foot", 0.3048),
    ],
  },
  {
    id: "mass",
    title: "Mass",
    baseUnit: "kg",
    options: [unit("kg", "kilogram", 1), unit("g", "gram", 0.001), unit("tonne", "tonne", 1000), unit("lb", "pound", 0.45359237)],
  },
  {
    id: "time",
    title: "Time",
    baseUnit: "s",
    options: [unit("s", "second", 1), unit("ms", "millisecond", 0.001), unit("min", "minute", 60), unit("h", "hour", 3600)],
  },
  {
    id: "speed",
    title: "Speed",
    baseUnit: "m/s",
    options: [unit("m/s", "metre per second", 1), unit("km/h", "kilometre per hour", 1 / 3.6), unit("cm/s", "centimetre per second", 0.01), unit("mph", "mile per hour", 0.44704)],
  },
  {
    id: "force",
    title: "Force",
    baseUnit: "N",
    options: [unit("N", "newton", 1), unit("dyn", "dyne", 0.00001), unit("kgf", "kilogram-force", 9.80665)],
  },
  {
    id: "energy",
    title: "Energy",
    baseUnit: "J",
    options: [unit("J", "joule", 1), unit("kJ", "kilojoule", 1000), unit("cal", "calorie", 4.184), unit("eV", "electron volt", 1.602176634e-19)],
  },
  {
    id: "pressure",
    title: "Pressure",
    baseUnit: "Pa",
    options: [unit("Pa", "pascal", 1), unit("kPa", "kilopascal", 1000), unit("bar", "bar", 100000), unit("atm", "atmosphere", 101325)],
  },
  {
    id: "temperature",
    title: "Temperature",
    baseUnit: "K",
    options: [
      { unit: "K", label: "kelvin", toBase: (value) => value, fromBase: (value) => value },
      { unit: "C", label: "celsius", toBase: (value) => value + 273.15, fromBase: (value) => value - 273.15 },
      { unit: "F", label: "fahrenheit", toBase: (value) => ((value - 32) * 5) / 9 + 273.15, fromBase: (value) => ((value - 273.15) * 9) / 5 + 32 },
    ],
  },
];

const graphModels = [
  {
    id: "newton",
    title: "Newton's second law",
    output: "Force (N)",
    input: "Mass (kg)",
    unit: "kg",
    fixed: "Acceleration fixed at 5 m/s^2",
    min: 1,
    max: 20,
    compute: (x: number) => 5 * x,
  },
  {
    id: "ohm",
    title: "Ohm's law",
    output: "Voltage (V)",
    input: "Current (A)",
    unit: "A",
    fixed: "Resistance fixed at 10 ohm",
    min: 0,
    max: 10,
    compute: (x: number) => 10 * x,
  },
  {
    id: "motion",
    title: "Uniform motion",
    output: "Distance (m)",
    input: "Time (s)",
    unit: "s",
    fixed: "Speed fixed at 8 m/s",
    min: 0,
    max: 20,
    compute: (x: number) => 8 * x,
  },
  {
    id: "spring",
    title: "Hooke's law",
    output: "Spring force (N)",
    input: "Extension (m)",
    unit: "m",
    fixed: "Spring constant fixed at 40 N/m",
    min: 0,
    max: 1,
    compute: (x: number) => 40 * x,
  },
];

export function FormulaGlossaryPanel({ compact = false, symbols }: { compact?: boolean; symbols?: string[] }) {
  const symbolList = useMemo(() => {
    const items = buildSymbolList();
    if (!symbols?.length) return items;
    const wanted = new Set(symbols.map(normalizeSymbol));
    const filtered = items.filter((item) => wanted.has(normalizeSymbol(item.symbol)) || wanted.has(normalizeSymbol(item.name)));
    return filtered.length > 0 ? filtered : items.slice(0, compact ? 8 : 14);
  }, [compact, symbols]);
  const [selectedSymbol, setSelectedSymbol] = useState(symbolList[0]?.symbol ?? "F");
  const selected = symbolList.find((item) => item.symbol === selectedSymbol) ?? symbolList[0];

  return (
    <section className={compact ? "learning-tool-card learning-tool-card-compact" : "panel learning-tool-card p-4"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Formula glossary</p>
          <h2 className="mt-1 text-xl font-black">Tap a symbol</h2>
        </div>
        <PhysicsIcon name="book" className="h-5 w-5 text-cyan-500" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {symbolList.map((item) => (
          <button key={item.symbol} className={selected?.symbol === item.symbol ? "symbol-chip symbol-chip-active" : "symbol-chip"} onClick={() => setSelectedSymbol(item.symbol)}>
            <span dangerouslySetInnerHTML={{ __html: renderFormula(item.symbol) }} />
          </button>
        ))}
      </div>
      {selected && (
        <div className="symbol-detail mt-3">
          <div className="text-2xl font-black text-cyan-500" dangerouslySetInnerHTML={{ __html: renderFormula(selected.symbol) }} />
          <div>
            <div className="font-black">{selected.name}</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Unit: <strong>{selected.unit}</strong></div>
            <div className="mt-1 text-sm text-amber-700 dark:text-amber-200">Common mistake: {selected.mistake}</div>
          </div>
        </div>
      )}
    </section>
  );
}

export function UnitConverterPanel({ compact = false }: { compact?: boolean }) {
  const [categoryId, setCategoryId] = useState("length");
  const category = unitCategories.find((item) => item.id === categoryId) ?? unitCategories[0];
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState(category.options[0].unit);
  const [toUnit, setToUnit] = useState(category.options[1].unit);

  const normalizedFrom = category.options.some((option) => option.unit === fromUnit) ? fromUnit : category.options[0].unit;
  const normalizedTo = category.options.some((option) => option.unit === toUnit) ? toUnit : category.options[1]?.unit ?? category.options[0].unit;
  const from = category.options.find((option) => option.unit === normalizedFrom) ?? category.options[0];
  const to = category.options.find((option) => option.unit === normalizedTo) ?? category.options[0];
  const converted = to.fromBase(from.toBase(value));

  const switchCategory = (nextId: string) => {
    const next = unitCategories.find((item) => item.id === nextId) ?? unitCategories[0];
    setCategoryId(next.id);
    setFromUnit(next.options[0].unit);
    setToUnit(next.options[1]?.unit ?? next.options[0].unit);
  };

  return (
    <section className={compact ? "learning-tool-card learning-tool-card-compact" : "panel learning-tool-card p-4"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Unit converter</p>
          <h2 className="mt-1 text-xl font-black">Convert before substituting</h2>
        </div>
        <PhysicsIcon name="ruler" className="h-5 w-5 text-cyan-500" />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        <select className="select-field" value={category.id} onChange={(event) => switchCategory(event.target.value)} aria-label="Unit category">
          {unitCategories.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <input className="search-field" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} aria-label="Unit value" />
        <select className="select-field" value={normalizedFrom} onChange={(event) => setFromUnit(event.target.value)} aria-label="From unit">
          {category.options.map((option) => <option key={option.unit} value={option.unit}>{option.unit}</option>)}
        </select>
        <select className="select-field" value={normalizedTo} onChange={(event) => setToUnit(event.target.value)} aria-label="To unit">
          {category.options.map((option) => <option key={option.unit} value={option.unit}>{option.unit}</option>)}
        </select>
      </div>
      <div className="conversion-result mt-3">
        <span>{formatNumber(value)} {from.unit}</span>
        <PhysicsIcon name="spark" className="h-4 w-4 text-cyan-500" />
        <strong>{formatNumber(converted)} {to.unit}</strong>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        Base unit: {category.baseUnit}. {from.label} to {to.label}.
      </p>
    </section>
  );
}

export function SolverGraphWorkspace() {
  const [modelId, setModelId] = useState(graphModels[0].id);
  const model = graphModels.find((item) => item.id === modelId) ?? graphModels[0];
  const points = useMemo(() => makePlotPoints(model.min, model.max, model.compute), [model]);
  return (
    <section className="panel learning-tool-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Graphing workspace</p>
          <h2 className="mt-1 text-xl font-black">Plot output vs input</h2>
        </div>
        <select className="select-field" value={modelId} onChange={(event) => setModelId(event.target.value)} aria-label="Graph model">
          {graphModels.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </div>
      <PlotSvg points={points} xLabel={model.input} yLabel={model.output} />
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="status-chip status-chip-cyan">{model.input}</span>
        <span className="status-chip">{model.output}</span>
        <span className="status-chip">{model.fixed}</span>
      </div>
    </section>
  );
}

export function RevisionModePanel({ questions }: { questions: RevisionQuestion[] }) {
  const [mode, setMode] = useState<"flashcards" | "formula" | "checks">("flashcards");
  const [cardIndex, setCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [formulaIndex, setFormulaIndex] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const revisionQuestions = questions.length > 0 ? questions : [];
  const currentCard = revisionQuestions[cardIndex % Math.max(1, revisionQuestions.length)];
  const currentFormula = coreFormulae[formulaIndex % coreFormulae.length];
  const conceptCheck = currentCard ? makeConceptCheck(currentCard, revisionQuestions) : undefined;

  const nextCard = () => {
    setCardIndex((value) => (value + 1) % Math.max(1, revisionQuestions.length));
    setShowBack(false);
    setSelectedOption("");
  };

  const nextFormula = () => {
    setFormulaIndex((value) => (value + 1) % coreFormulae.length);
    setShowFormula(false);
  };

  return (
    <section className="panel revision-panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Revision mode</p>
          <h2 className="mt-1 text-2xl font-black">Flashcards, formula recall, quick checks</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Uses the currently filtered Solver set, so students can revise one chapter or one difficulty level at a time.</p>
        </div>
        <PhysicsIcon name="clipboard" className="h-6 w-6 text-cyan-500" />
      </div>
      <div className="segmented-row mt-4">
        <button className={mode === "flashcards" ? "segment-chip segment-chip-active" : "segment-chip"} onClick={() => setMode("flashcards")}><PhysicsIcon name="book" className="h-3.5 w-3.5" />Flashcards</button>
        <button className={mode === "formula" ? "segment-chip segment-chip-active" : "segment-chip"} onClick={() => setMode("formula")}><PhysicsIcon name="calculator" className="h-3.5 w-3.5" />Formula recall</button>
        <button className={mode === "checks" ? "segment-chip segment-chip-active" : "segment-chip"} onClick={() => setMode("checks")}><PhysicsIcon name="check" className="h-3.5 w-3.5" />Concept checks</button>
      </div>

      {mode === "flashcards" && currentCard && (
        <div className="revision-card mt-4">
          <div className="flex flex-wrap gap-2">
            <span className="status-chip status-chip-cyan">{currentCard.classRange}</span>
            <span className="status-chip">{currentCard.difficulty}</span>
            {currentCard.subcategory?.title && <span className="status-chip">{currentCard.subcategory.title}</span>}
          </div>
          <h3 className="mt-3 text-lg font-black">{currentCard.prompt}</h3>
          {showBack ? (
            <div className="revision-answer mt-4">
              <div className="ui-label">Answer</div>
              <p>{currentCard.answer}</p>
            </div>
          ) : (
            <button className="hero-btn-secondary mt-4" onClick={() => setShowBack(true)}><PhysicsIcon name="eye" className="h-4 w-4" />Reveal answer</button>
          )}
          <div className="mt-4 flex flex-wrap justify-between gap-2">
            <button className="tool-btn" onClick={nextCard}><PhysicsIcon name="step" className="h-4 w-4" />Next card</button>
            <div className="flex flex-wrap gap-2">
              {currentCard.conceptTags.slice(0, 4).map((tag) => <span key={tag} className="status-chip">{tag}</span>)}
            </div>
          </div>
        </div>
      )}

      {mode === "formula" && (
        <div className="revision-card mt-4">
          <div className="ui-label">Recall formula</div>
          <h3 className="mt-2 text-xl font-black">{currentFormula.name}</h3>
          {showFormula ? (
            <div className="revision-answer mt-4">
              <div className="text-2xl font-black text-cyan-500" dangerouslySetInnerHTML={{ __html: renderFormula(currentFormula.expression) }} />
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {currentFormula.variables.map((variable) => (
                  <div key={`${currentFormula.id}-${variable.symbol}`} className="rounded-md border border-slate-300/70 bg-white p-2 dark:border-lab-line dark:bg-slate-950/55">
                    <span className="font-black" dangerouslySetInnerHTML={{ __html: renderFormula(variable.symbol) }} /> = {variable.name}
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{variable.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button className="hero-btn-secondary mt-4" onClick={() => setShowFormula(true)}><PhysicsIcon name="eye" className="h-4 w-4" />Show formula</button>
          )}
          <button className="tool-btn mt-4" onClick={nextFormula}><PhysicsIcon name="step" className="h-4 w-4" />Next formula</button>
        </div>
      )}

      {mode === "checks" && conceptCheck && (
        <div className="revision-card mt-4">
          <div className="ui-label">Quick concept check</div>
          <h3 className="mt-2 text-lg font-black">{conceptCheck.prompt}</h3>
          <div className="mt-4 grid gap-2">
            {conceptCheck.options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === conceptCheck.correct;
              const className = selectedOption && isCorrect ? "quiz-option quiz-option-correct" : selectedOption && isSelected ? "quiz-option quiz-option-wrong" : "quiz-option";
              return (
                <button key={option} className={className} onClick={() => setSelectedOption(option)}>
                  <span className="quiz-option-letter">{option.slice(0, 1)}</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
          {selectedOption && (
            <div className={selectedOption === conceptCheck.correct ? "quiz-feedback quiz-feedback-correct" : "quiz-feedback quiz-feedback-wrong"}>
              {selectedOption === conceptCheck.correct ? "Correct. " : "Review: "}{currentCard.answer}
            </div>
          )}
          <button className="tool-btn mt-4" onClick={nextCard}><PhysicsIcon name="step" className="h-4 w-4" />Next check</button>
        </div>
      )}
    </section>
  );
}

export function PlotSvg({ points, xLabel, yLabel }: { points: PlotPoint[]; xLabel: string; yLabel: string }) {
  const width = 520;
  const height = 240;
  const padding = 34;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);
  const toX = (x: number) => padding + ((x - minX) / Math.max(1e-9, maxX - minX)) * (width - padding * 1.5);
  const toY = (y: number) => height - padding - ((y - minY) / Math.max(1e-9, maxY - minY)) * (height - padding * 1.4);
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${toX(point.x).toFixed(1)} ${toY(point.y).toFixed(1)}`).join(" ");

  return (
    <div className="graph-frame mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${yLabel} versus ${xLabel}`}>
        <line x1={padding} y1={height - padding} x2={width - padding / 2} y2={height - padding} className="graph-axis" />
        <line x1={padding} y1={padding / 2} x2={padding} y2={height - padding} className="graph-axis" />
        {[0.25, 0.5, 0.75].map((mark) => (
          <line key={mark} x1={padding} x2={width - padding / 2} y1={padding + mark * (height - padding * 2)} y2={padding + mark * (height - padding * 2)} className="graph-grid-line" />
        ))}
        <path d={path} className="graph-line" />
        {points.filter((_, index) => index % 6 === 0).map((point) => <circle key={`${point.x}-${point.y}`} cx={toX(point.x)} cy={toY(point.y)} r="3" className="graph-point" />)}
        <text x={width / 2} y={height - 6} className="graph-label">{xLabel}</text>
        <text x="12" y="18" className="graph-label">{yLabel}</text>
      </svg>
    </div>
  );
}

function makeConceptCheck(question: RevisionQuestion, questions: RevisionQuestion[]) {
  const correct = compactAnswer(question.answer);
  const distractors = questions
    .filter((item) => item.id !== question.id)
    .map((item) => compactAnswer(item.answer))
    .filter((item) => item !== correct);
  return {
    prompt: question.prompt,
    correct,
    options: stableShuffle(uniqueText([correct, ...distractors, "Use a formula without checking units.", "Ignore the sign convention and direction."]).slice(0, 4), question.id),
  };
}

function compactAnswer(answer: string) {
  const cleaned = answer.replace(/\s+/g, " ").trim();
  const firstSentence = cleaned.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? cleaned;
  return firstSentence.length > 150 ? `${firstSentence.slice(0, 147).trim()}...` : firstSentence;
}

function uniqueText(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key) || item.length < 8) return false;
    seen.add(key);
    return true;
  });
}

function stableShuffle<T>(items: T[], seed: string) {
  return [...items].sort((left, right) => hash(`${seed}-${String(left)}`) - hash(`${seed}-${String(right)}`));
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function symbolsFromText(text: string) {
  const items = buildSymbolList();
  const lower = text.toLowerCase();
  return items
    .filter((item) => lower.includes(item.symbol.toLowerCase().replace("\\", "")) || lower.includes(item.name.toLowerCase().split(" ")[0]))
    .slice(0, 10)
    .map((item) => item.symbol);
}

function buildSymbolList(): SymbolInfo[] {
  const fromFormulae = coreFormulae.flatMap((formula) =>
    formula.variables.map((variable) => ({
      symbol: variable.symbol,
      name: variable.name,
      unit: variable.unit,
      mistake: symbolMistakes[variable.symbol] ?? `Check whether ${variable.symbol} is known, unknown, or held constant.`,
    }))
  );
  return uniqueSymbols([...fromFormulae, ...extraSymbols]);
}

function uniqueSymbols(items: SymbolInfo[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeSymbol(item.symbol);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeSymbol(value: string) {
  return value.replace("\\", "").toLowerCase();
}

function unit(unitName: string, label: string, factorToBase: number): UnitOption {
  return {
    unit: unitName,
    label,
    toBase: (value) => value * factorToBase,
    fromBase: (value) => value / factorToBase,
  };
}

function makePlotPoints(min: number, max: number, compute: (x: number) => number) {
  return Array.from({ length: 31 }, (_, index) => {
    const x = min + ((max - min) * index) / 30;
    return { x, y: compute(x) };
  });
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "NaN";
  if (Math.abs(value) >= 100000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(3);
  return Number(value.toPrecision(6)).toString();
}
