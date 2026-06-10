import { useMemo, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { Link, useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import { allSolverQuestions, solverCategories, solverStats, SolverDifficulty } from "../lib/solver";
import { FormulaGlossaryPanel, RevisionModePanel, SolverGraphWorkspace, symbolsFromText, UnitConverterPanel } from "../components/LearningTools";
import { experiments } from "../lib/experiments";

const difficultyOptions: Array<"all" | SolverDifficulty> = ["all", "Basic", "Intermediate", "Difficult"];
const classOptions = ["all", "7", "8", "9", "10", "11", "12"];
const formulaSearchEntries = [
  {
    label: "F = ma",
    aliases: ["f=ma", "force=mass*acceleration", "newton second law", "net force", "force mass acceleration"],
    tags: ["force", "mass", "acceleration", "F=ma", "net force", "Newton"],
    labIds: ["newton-s-second-law", "balanced-unbalanced-forces", "friction", "inclined-plane"],
  },
  {
    label: "V = IR",
    aliases: ["v=ir", "ohm", "ohms law", "voltage=current*resistance", "potential difference current resistance"],
    tags: ["voltage", "current", "resistance", "Ohm", "circuit"],
    labIds: ["ohms-law", "series-parallel-resistance", "electric-power", "heating-effect-current"],
  },
  {
    label: "v = fλ",
    aliases: ["v=fλ", "v=flambda", "v=f lambda", "wave speed", "frequency wavelength", "speed frequency wavelength"],
    tags: ["wave", "frequency", "wavelength", "sound", "lambda"],
    labIds: ["sound-wave-anatomy", "wave-speed-string", "young-double-slit", "single-slit-diffraction"],
  },
];

export function SolverPage() {
  const [searchParams] = useSearchParams();
  const initialTag = searchParams.get("tag") ?? "all";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [categoryId, setCategoryId] = useState("all");
  const [difficulty, setDifficulty] = useState<"all" | SolverDifficulty>("all");
  const [classFilter, setClassFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState(initialTag);
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});
  const [stepLevel, setStepLevel] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"practice" | "tools" | "revision">("practice");
  const questions = useMemo(() => allSolverQuestions(), []);
  const tags = useMemo(() => ["all", ...Array.from(new Set(questions.flatMap((question) => question.conceptTags))).sort()], [questions]);
  const activeFormulaSearch = formulaEntryForQuery(query);
  const filtered = questions.filter((question) => {
    const text = `${question.prompt} ${question.answer} ${question.category.title} ${question.subcategory.title} ${question.conceptTags.join(" ")}`.toLowerCase();
    const queryMatch = !query.trim() || text.includes(query.trim().toLowerCase()) || formulaMatchesQuestion(query, question);
    const categoryMatch = categoryId === "all" || question.category.id === categoryId;
    const difficultyMatch = difficulty === "all" || question.difficulty === difficulty;
    const tagMatch = tagFilter === "all" || question.conceptTags.includes(tagFilter);
    const classMatch = classFilter === "all" || question.classRange.includes(classFilter);
    return queryMatch && categoryMatch && difficultyMatch && tagMatch && classMatch;
  });
  const grouped = solverCategories.map((category) => ({
    ...category,
    subcategories: category.subcategories.map((subcategory) => ({
      ...subcategory,
      questions: filtered.filter((question) => question.category.id === category.id && question.subcategory.id === subcategory.id),
    })).filter((subcategory) => subcategory.questions.length > 0),
  })).filter((category) => category.subcategories.length > 0);
  const higherLevelCount = filtered.filter((question) => question.difficulty !== "Basic").length;
  const formulaLabMatches = useMemo(() => formulaMatchesLabs(query), [query]);

  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page solver-page">
        <section className="page-hero solver-hero">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="ui-label">Solver module</p>
              <h1 className="solver-title text-gradient">Physics Solver Bank</h1>
              <p className="solver-subtitle">
                Class 7-12 practice across {solverStats.categories} major physics categories, with every subcategory holding at least {solverStats.minQuestionsPerSubcategory} unique questions, concept tags, difficulty labels, and answer explanations.
              </p>
            </div>
            <div className="solver-metric-grid">
              <Metric label="Categories" value={solverStats.categories} />
              <Metric label="Subcats" value={solverStats.subcategories} />
              <Metric label="Questions" value={solverStats.questions} />
              <Metric label="Min/Subcat" value={solverStats.minQuestionsPerSubcategory} />
            </div>
          </div>
          <div className="solver-chip-row">
            <span className="status-chip status-chip-cyan"><PhysicsIcon name="book" className="h-3.5 w-3.5" />Class 7-12</span>
            <span className="status-chip"><PhysicsIcon name="calculator" className="h-3.5 w-3.5" />With answers</span>
            <span className="status-chip"><PhysicsIcon name="check" className="h-3.5 w-3.5" />10+ per subcategory</span>
            <span className="status-chip"><PhysicsIcon name="spark" className="h-3.5 w-3.5" />+{solverStats.addedExpansionQuestions} new questions</span>
            <span className="status-chip"><PhysicsIcon name="check" className="h-3.5 w-3.5" />{higherLevelCount} intermediate/difficult shown</span>
            <span className="status-chip"><PhysicsIcon name="clipboard" className="h-3.5 w-3.5" />Concept tagged</span>
          </div>
        </section>

        <div className="desktop-tabs mt-3" aria-label="Solver sections">
          {[
            { id: "practice" as const, label: "Practice", icon: "calculator" as const },
            { id: "tools" as const, label: "Tools", icon: "ruler" as const },
            { id: "revision" as const, label: "Revision", icon: "spark" as const },
          ].map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? "tab-active" : "tab-btn"} type="button" onClick={() => setActiveTab(tab.id)}>
              <span className="inline-flex items-center gap-1.5"><PhysicsIcon name={tab.icon} className="h-3.5 w-3.5" />{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="desktop-tab-panel desktop-tab-panel-tall desktop-scroll-panel">
          {activeTab === "tools" && (
            <section className="grid gap-4 xl:grid-cols-3">
              <FormulaGlossaryPanel />
              <UnitConverterPanel />
              <SolverGraphWorkspace />
            </section>
          )}

          {activeTab === "revision" && <RevisionModePanel questions={filtered.slice(0, 80)} />}

          {activeTab === "practice" && (
            <div className="solver-practice-shell">

        <section className="solver-filter-bar">
          <div className="grid gap-2 lg:grid-cols-[minmax(260px,1fr)_minmax(190px,0.5fr)_auto_auto_minmax(180px,0.45fr)]">
            <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search question, concept, formula, category..." />
            <select className="select-field" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} aria-label="Solver category">
              <option value="all">All categories</option>
              {solverCategories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
            </select>
            <select className="select-field" value={classFilter} onChange={(event) => setClassFilter(event.target.value)} aria-label="Solver class">
              {classOptions.map((value) => <option key={value} value={value}>{value === "all" ? "All classes" : `Class ${value}`}</option>)}
            </select>
            <select className="select-field" value={difficulty} onChange={(event) => setDifficulty(event.target.value as "all" | SolverDifficulty)} aria-label="Solver difficulty">
              {difficultyOptions.map((value) => <option key={value} value={value}>{value === "all" ? "All levels" : value}</option>)}
            </select>
            <select className="select-field" value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} aria-label="Concept tag">
              {tags.map((tag) => <option key={tag} value={tag}>{tag === "all" ? "All tags" : tag}</option>)}
            </select>
          </div>
          <div className="solver-filter-footer">
            <span className="ui-label shrink-0">{filtered.length} questions shown</span>
            <div className="segmented-row min-w-0 flex-1">
            {formulaSearchEntries.map((entry) => (
              <button key={entry.label} className={activeFormulaSearch?.label === entry.label ? "segment-chip segment-chip-active" : "segment-chip"} onClick={() => setQuery(entry.label)}>
                <PhysicsIcon name="calculator" className="h-3.5 w-3.5" />
                {entry.label}
              </button>
            ))}
            {difficultyOptions.map((value) => (
              <button key={value} className={difficulty === value ? "segment-chip segment-chip-active" : "segment-chip"} onClick={() => setDifficulty(value)}>
                <PhysicsIcon name={value === "Difficult" ? "spark" : value === "Intermediate" ? "calculator" : "check"} className="h-3.5 w-3.5" />
                {value === "all" ? "All levels" : value}
              </button>
            ))}
            </div>
          </div>
        </section>

        {activeFormulaSearch && (
          <section className="formula-search-panel">
            <div>
              <p className="ui-label">Formula search</p>
              <h2 className="mt-1 text-xl font-black">Matches for {activeFormulaSearch.label}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Showing questions and labs connected to {activeFormulaSearch.tags.slice(0, 4).join(", ")}.</p>
            </div>
            <div className="formula-lab-grid">
              {formulaLabMatches.slice(0, 6).map((experiment) => (
                <Link key={experiment.id} to={`/experiments/${experiment.id}`} className="formula-lab-card">
                  <PhysicsIcon name="flask" className="h-4 w-4 text-cyan-500" />
                  <span>{experiment.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="solver-results-grid">
          <aside className="panel p-3 desktop-sidebar-scroll solver-sidebar">
            <h2 className="panel-title">Categories</h2>
            <div className="mt-3 grid gap-2">
              <button className={categoryId === "all" ? "pill border-cyan-400 text-cyan-500" : "pill"} onClick={() => setCategoryId("all")}>
                All categories
              </button>
              {solverCategories.map((category) => {
                const count = filtered.filter((question) => question.category.id === category.id).length;
                return (
                  <button key={category.id} className={categoryId === category.id ? "pill border-cyan-400 text-cyan-500" : "pill"} onClick={() => setCategoryId(category.id)}>
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-left">{category.title}</span>
                      <span className="badge">{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="grid gap-3 desktop-main-scroll">
            {grouped.map((category) => (
              <section key={category.id} className="panel solver-category-panel">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="ui-label">{category.domain} | {category.classRange}</p>
                    <h2 className="mt-1 text-xl font-black">{category.title}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.conceptTags.slice(0, 4).map((tag) => <span key={tag} className="status-chip">{tag}</span>)}
                  </div>
                </div>
                <div className="mt-3 grid gap-3">
                  {category.subcategories.map((subcategory) => (
                    <article key={subcategory.id} className="solver-subcategory-card">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-black">{subcategory.title}</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subcategory.description}</p>
                        </div>
                        <span className="status-chip status-chip-cyan">{subcategory.questions.length} questions</span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {subcategory.questions.map((question) => (
                          <div key={question.id} className="solver-question-card">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap gap-2">
                                <span className="status-chip status-chip-cyan">{question.classRange}</span>
                                <span className={difficultyClass(question.difficulty)}>{question.difficulty}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button className="tool-btn" onClick={() => setStepLevel((state) => ({ ...state, [question.id]: Math.max(1, state[question.id] ?? 0) }))}>
                                  <PhysicsIcon name="step" className="h-4 w-4" />
                                  Step mode
                                </button>
                                <button className="tool-btn" onClick={() => setOpenAnswers((state) => ({ ...state, [question.id]: !state[question.id] }))}>
                                  <PhysicsIcon name="eye" className="h-4 w-4" />
                                  {openAnswers[question.id] ? "Hide answer" : "Show answer"}
                                </button>
                              </div>
                            </div>
                            <p className="mt-3 text-sm font-semibold leading-relaxed">{question.prompt}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {question.conceptTags.map((tag) => <span key={tag} className="rounded-full bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{tag}</span>)}
                            </div>
                            {openAnswers[question.id] ? (
                              <div className="mt-3 rounded-md border border-emerald-400/35 bg-emerald-400/10 p-3 text-sm text-slate-700 dark:text-slate-200">
                                <div className="font-black text-emerald-600 dark:text-emerald-300">Answer</div>
                                <p className="mt-1 leading-relaxed">{question.answer}</p>
                                <StepSolution
                                  question={question}
                                  level={stepLevel[question.id] ?? 0}
                                  onLevelChange={(nextLevel) => setStepLevel((state) => ({ ...state, [question.id]: nextLevel }))}
                                />
                              </div>
                            ) : (stepLevel[question.id] ?? 0) > 0 && (
                              <StepSolution
                                question={question}
                                level={stepLevel[question.id] ?? 0}
                                onLevelChange={(nextLevel) => setStepLevel((state) => ({ ...state, [question.id]: nextLevel }))}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
            {grouped.length === 0 && (
              <div className="empty-state">
                <PhysicsIcon name="calculator" className="mx-auto h-8 w-8 text-cyan-500" />
                <h2 className="mt-3 text-xl font-black">No solver questions found</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try clearing search, class, difficulty, or tag filters.</p>
                <button className="hero-btn-secondary mt-4" onClick={() => { setQuery(""); setCategoryId("all"); setDifficulty("all"); setClassFilter("all"); setTagFilter("all"); }}>Reset solver filters</button>
              </div>
            )}
          </div>
        </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  const animated = useCountUp(value);
  return (
    <div className="metric-card">
      <div className="ui-label">{label}</div>
      <div className="mt-1 text-2xl font-black text-cyan-500 count-up">{animated}</div>
    </div>
  );
}

function StepSolution({ question, level, onLevelChange }: { question: ReturnType<typeof allSolverQuestions>[number]; level: number; onLevelChange: (level: number) => void }) {
  const steps = buildSolutionSteps(question);
  const visibleSteps = steps.slice(0, level);
  const symbols = symbolsFromText(`${question.prompt} ${question.answer} ${question.conceptTags.join(" ")}`);
  return (
    <div className="step-solution-panel mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-black text-slate-800 dark:text-slate-100">Step-by-step solution mode</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Reveal hint, formula, substitution, and final answer one layer at a time.</div>
        </div>
        <button className="tool-btn" onClick={() => onLevelChange(Math.min(steps.length, level + 1))} disabled={level >= steps.length}>
          <PhysicsIcon name="step" className="h-4 w-4" />
          {level >= steps.length ? "Fully revealed" : `Reveal ${steps[level].label}`}
        </button>
      </div>
      {visibleSteps.length > 0 && (
        <ol className="mt-3 grid gap-2">
          {visibleSteps.map((step) => (
            <li key={step.label} className="step-solution-item">
              <span>{step.label}</span>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      )}
      <FormulaGlossaryPanel compact symbols={symbols} />
    </div>
  );
}

function buildSolutionSteps(question: ReturnType<typeof allSolverQuestions>[number]) {
  const formula = inferFormula(question);
  const answerParts = question.answer.split(".").map((part) => part.trim()).filter(Boolean);
  const finalSentence = answerParts[answerParts.length - 1];
  return [
    {
      label: "Hint",
      text: `Identify the known values and the target quantity. This belongs to ${question.subcategory.title}: ${question.conceptTags.slice(0, 3).join(", ")}.`,
    },
    {
      label: "Formula",
      text: formula,
    },
    {
      label: "Substitution",
      text: question.answer.includes("=") ? question.answer.split(".")[0].trim() : "Substitute the given values using consistent SI units before calculating.",
    },
    {
      label: "Final answer",
      text: finalSentence ? `${finalSentence}.` : question.answer,
    },
  ];
}

function inferFormula(question: ReturnType<typeof allSolverQuestions>[number]) {
  const text = `${question.prompt} ${question.answer} ${question.conceptTags.join(" ")}`.toLowerCase();
  if (text.includes("speed") || text.includes("distance")) return "Use speed = distance / time, or distance = speed x time.";
  if (text.includes("acceleration")) return "Use acceleration = change in velocity / time.";
  if (text.includes("force") && text.includes("mass")) return "Use Newton's second law: F = ma, or net force = ma.";
  if (text.includes("work")) return "Use work = force x displacement in the force direction.";
  if (text.includes("power")) return "Use power = work / time.";
  if (text.includes("potential energy") || text.includes("height")) return "Use gravitational potential energy = mgh.";
  if (text.includes("pressure")) return "Use pressure = force / area, or liquid pressure = rho g h.";
  if (text.includes("buoyant")) return "Use buoyant force = rho g V displaced.";
  if (text.includes("heat") || text.includes("temperature")) return "Use Q = mc DeltaT after checking temperature units.";
  if (text.includes("ohm") || text.includes("current") || text.includes("voltage")) return "Use Ohm's law: V = IR.";
  if (text.includes("wave") || text.includes("frequency") || text.includes("wavelength")) return "Use wave speed v = f lambda.";
  if (text.includes("lens") || text.includes("mirror")) return "Use 1/f = 1/v + 1/u with the correct sign convention.";
  return "Choose the relation that connects the unknown to the given quantities, then keep units consistent.";
}

function formulaEntryForQuery(query: string) {
  const normalized = normalizeFormula(query);
  if (!normalized) return undefined;
  return formulaSearchEntries.find((entry) => {
    const candidates = [entry.label, ...entry.aliases].map(normalizeFormula);
    return candidates.some((candidate) => normalized.includes(candidate) || candidate.includes(normalized));
  });
}

function formulaMatchesQuestion(query: string, question: ReturnType<typeof allSolverQuestions>[number]) {
  const entry = formulaEntryForQuery(query);
  if (!entry) return false;
  const haystack = normalizeFormula(`${question.prompt} ${question.answer} ${question.conceptTags.join(" ")} ${question.subcategory.title} ${question.category.title}`);
  return entry.tags.some((tag) => haystack.includes(normalizeFormula(tag))) || entry.aliases.some((alias) => haystack.includes(normalizeFormula(alias)));
}

function formulaMatchesLabs(query: string) {
  const entry = formulaEntryForQuery(query);
  if (!entry) return [];
  return experiments
    .filter((experiment) => {
      const text = normalizeFormula(`${experiment.title} ${experiment.category} ${experiment.aim} ${experiment.formulae.map((formula) => `${formula.name} ${formula.expression}`).join(" ")} ${experiment.curriculumTags?.domains.join(" ") ?? ""}`);
      return entry.labIds.includes(experiment.id) || entry.tags.some((tag) => text.includes(normalizeFormula(tag))) || entry.aliases.some((alias) => text.includes(normalizeFormula(alias)));
    })
    .sort((left, right) => {
      const leftIndex = entry.labIds.indexOf(left.id);
      const rightIndex = entry.labIds.indexOf(right.id);
      const leftRank = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
      const rightRank = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
      return leftRank - rightRank;
    });
}

function normalizeFormula(value: string) {
  return value
    .toLowerCase()
    .replace(/λ/g, "lambda")
    .replace(/\\lambda/g, "lambda")
    .replace(/×|\*/g, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9=+\-/^]/g, "");
}

function difficultyClass(difficulty: SolverDifficulty) {
  if (difficulty === "Difficult") return "status-chip border-rose-400/45 bg-rose-400/10 text-rose-600 dark:text-rose-300";
  if (difficulty === "Intermediate") return "status-chip border-amber-400/45 bg-amber-400/10 text-amber-600 dark:text-amber-200";
  return "status-chip border-emerald-400/45 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300";
}
