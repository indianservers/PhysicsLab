import { useEffect, useMemo, useRef, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import { makeQuizSession, quizCategoryOptions, quizStats, QuizDifficulty } from "../lib/quiz";
import { RemediationPanel } from "../components/RemediationPanel";
import { trackQuizComplete, trackQuizStreak } from "../lib/achievements";

const difficultyOptions: Array<"all" | QuizDifficulty> = ["all", "Basic", "Intermediate", "Difficult"];
const classOptions = ["all", "6", "7", "8", "9", "10", "11", "12"];
const bestScoreKey = "physicslab-quiz-best-v1";
const weakConceptKey = "physicslab-quiz-weak-concepts-v1";
type WeakConceptMap = Record<string, number>;

export function QuizPage() {
  const [searchParams] = useSearchParams();
  const focusTag = searchParams.get("focus")?.trim() ?? "";
  const [categoryId, setCategoryId] = useState("all");
  const [subcategoryId, setSubcategoryId] = useState("all");
  const [difficulty, setDifficulty] = useState<"all" | QuizDifficulty>("all");
  const [classFilter, setClassFilter] = useState("all");
  const [runSeed, setRunSeed] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [animatingOption, setAnimatingOption] = useState<{ option: string; type: "correct" | "wrong" } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem(bestScoreKey) ?? 0));
  const [weakConcepts, setWeakConcepts] = useState<WeakConceptMap>(() => readWeakConcepts());

  const subcategoryOptions = useMemo(() => {
    if (categoryId === "all") return quizCategoryOptions.flatMap((category) => category.subcategories);
    return quizCategoryOptions.find((category) => category.id === categoryId)?.subcategories ?? [];
  }, [categoryId]);

  const weakConceptList = useMemo(() => mergeFocusTag(topWeakConcepts(weakConcepts), focusTag), [focusTag, weakConcepts]);
  const session = useMemo(() => makeQuizSession({ categoryId, subcategoryId, difficulty, classFilter, seed: runSeed, weakConcepts: weakConceptList.map((item) => item.tag) }), [categoryId, subcategoryId, difficulty, classFilter, runSeed, weakConceptList]);
  const currentQuestion = session[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const score = session.filter((question) => answers[question.id] === question.correctOption).length;
  const isComplete = answeredCount === session.length;
  const progress = Math.round((answeredCount / quizStats.sessionSize) * 100);
  const correctCount = session.reduce((count, question) => count + (answers[question.id] === question.correctOption ? 1 : 0), 0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    setAnswers({});
    setCurrentIndex(0);
    setElapsed(0);
  }, [categoryId, subcategoryId, difficulty, classFilter, runSeed]);

  useEffect(() => {
    if (isComplete) return undefined;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isComplete, runSeed, categoryId, subcategoryId, difficulty, classFilter]);

  useEffect(() => {
    if (!isComplete || score <= bestScore) return;
    setBestScore(score);
    localStorage.setItem(bestScoreKey, String(score));
  }, [bestScore, isComplete, score]);

  useEffect(() => {
    if (!isComplete) return;
    trackQuizComplete(score, session.length);
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const startFreshQuiz = () => {
    setRunSeed((value) => value + 1);
  };

  const quizStreakRef = useRef(0);
  const chooseOption = (option: string, trackConcept = true) => {
    if (!currentQuestion || answers[currentQuestion.id]) return;
    const correct = option === currentQuestion.correctOption;
    quizStreakRef.current = correct ? quizStreakRef.current + 1 : 0;
    trackQuizStreak(quizStreakRef.current);
    setAnimatingOption({ option, type: correct ? "correct" : "wrong" });
    window.setTimeout(() => setAnimatingOption(null), 600);
    setAnswers((state) => ({ ...state, [currentQuestion.id]: option }));
    if (!trackConcept) return;
    setWeakConcepts((state) => {
      const next = { ...state };
      currentQuestion.conceptTags.forEach((tag) => {
        const current = next[tag] ?? 0;
        const adjusted = correct ? Math.max(0, current - 1) : current + 2;
        if (adjusted <= 0) delete next[tag];
        else next[tag] = adjusted;
      });
      localStorage.setItem(weakConceptKey, JSON.stringify(next));
      return next;
    });
  };

  const resetFilters = () => {
    setCategoryId("all");
    setSubcategoryId("all");
    setDifficulty("all");
    setClassFilter("all");
    setRunSeed((value) => value + 1);
  };

  const clearWeakConcepts = () => {
    setWeakConcepts({});
    localStorage.removeItem(weakConceptKey);
    setRunSeed((value) => value + 1);
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page">
        <section className="page-hero quiz-hero mesh-bg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="ui-label">Interactive quiz</p>
              <h1 className="mt-2 text-3xl font-black md:text-5xl text-gradient">Physics MCQ Challenge</h1>
              <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
                A {quizStats.questions}-question browser-only quiz bank for Class 7-12 physics. Pick category, subcategory, class, and level, then play a fast 12-question round with instant feedback and explanations.
              </p>
            </div>
            <div className="grid min-w-72 grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric label="MCQs" value={quizStats.questions} />
              <Metric label="Round" value={quizStats.sessionSize} />
              <Metric label="Categories" value={quizStats.categories} />
              <Metric label="Subcats" value={quizStats.subcategories} />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="status-chip status-chip-cyan"><PhysicsIcon name="check" className="h-3.5 w-3.5" />4 options each</span>
            <span className="status-chip"><PhysicsIcon name="book" className="h-3.5 w-3.5" />Class 7-12</span>
            <span className="status-chip"><PhysicsIcon name="spark" className="h-3.5 w-3.5" />Basic to difficult</span>
            <span className="status-chip"><PhysicsIcon name="clipboard" className="h-3.5 w-3.5" />Concept tagged</span>
            <span className="status-chip"><PhysicsIcon name="gauge" className="h-3.5 w-3.5" />Best {bestScore}/12</span>
            <span className="status-chip"><PhysicsIcon name="spark" className="h-3.5 w-3.5" />Adaptive weak-concept practice</span>
            {focusTag && <span className="status-chip status-chip-cyan"><PhysicsIcon name="search" className="h-3.5 w-3.5" />Focused: {focusTag}</span>}
          </div>
        </section>

        <section className="filter-bar quiz-filter-bar mt-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto_auto]">
            <select className="select-field" value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setSubcategoryId("all"); }} aria-label="Quiz category">
              <option value="all">All categories</option>
              {quizCategoryOptions.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
            </select>
            <select className="select-field" value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)} aria-label="Quiz subcategory">
              <option value="all">All subcategories</option>
              {subcategoryOptions.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.title}</option>)}
            </select>
            <select className="select-field" value={classFilter} onChange={(event) => setClassFilter(event.target.value)} aria-label="Quiz class">
              {classOptions.map((value) => <option key={value} value={value}>{value === "all" ? "All classes" : `Class ${value}`}</option>)}
            </select>
            <select className="select-field" value={difficulty} onChange={(event) => setDifficulty(event.target.value as "all" | QuizDifficulty)} aria-label="Quiz difficulty">
              {difficultyOptions.map((value) => <option key={value} value={value}>{value === "all" ? "All levels" : value}</option>)}
            </select>
            <button className="hero-btn-secondary justify-center" onClick={startFreshQuiz}>
              <PhysicsIcon name="spark" className="h-4 w-4" />
              New quiz
            </button>
          </div>
          <div className="segmented-row mt-3">
            {difficultyOptions.map((value) => (
              <button key={value} className={difficulty === value ? "segment-chip segment-chip-active" : "segment-chip"} onClick={() => setDifficulty(value)}>
                <PhysicsIcon name={value === "Difficult" ? "spark" : value === "Intermediate" ? "calculator" : "check"} className="h-3.5 w-3.5" />
                {value === "all" ? "All levels" : value}
              </button>
            ))}
            <button className="segment-chip" onClick={resetFilters}><PhysicsIcon name="settings" className="h-3.5 w-3.5" />Reset</button>
          </div>
        </section>

        <section className="desktop-tab-panel desktop-two-pane">
          <aside className="panel p-4 desktop-sidebar-scroll">
            <h2 className="panel-title">Quiz dashboard</h2>
            <div className="mt-4 grid gap-3">
              <DashboardStat icon="check" label="Score" value={`${score}/${quizStats.sessionSize}`} />
              <DashboardStat icon="gauge" label="Progress" value={`${answeredCount}/${quizStats.sessionSize}`} />
              <DashboardStat icon="spark" label="Correct count" value={String(correctCount)} />
              <DashboardStat icon="gauge" label="Time" value={formatTime(elapsed)} />
            </div>
            <div className="mt-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-6 gap-1.5">
              {session.map((question, index) => {
                const answered = answers[question.id];
                const correct = answered === question.correctOption;
                return (
                  <button
                    key={question.id}
                    className={index === currentIndex ? "quiz-dot quiz-dot-active" : answered ? correct ? "quiz-dot quiz-dot-correct" : "quiz-dot quiz-dot-wrong" : "quiz-dot"}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to quiz question ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <button className="tool-btn mt-4 w-full justify-center" onClick={startFreshQuiz}>
              <PhysicsIcon name="play" className="h-4 w-4" />
              Replay 12 questions
            </button>
            <div className="weak-concept-panel mt-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black">Weak concepts</h3>
                {weakConceptList.length > 0 && <button className="text-xs font-black text-cyan-600 dark:text-cyan-300" onClick={clearWeakConcepts}>Reset</button>}
              </div>
              {weakConceptList.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {weakConceptList.slice(0, 6).map((item) => <span key={item.tag} className="weak-concept-chip">{item.tag}<strong>{item.score}</strong></span>)}
                </div>
              ) : (
                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Missed answers will appear here. New rounds will add more questions from those tags.</p>
              )}
            </div>
          </aside>

          <div className="grid gap-5 desktop-main-scroll">
            <RemediationPanel weakConcepts={weakConceptList} />
            {currentQuestion && (
              <article className="panel quiz-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="card-icon"><PhysicsIcon name="check" className="h-5 w-5" /></div>
                    <div>
                      <p className="ui-label">Question {currentIndex + 1} of {quizStats.sessionSize}</p>
                      <h2 className="mt-1 text-2xl font-black">{currentQuestion.subcategoryTitle}</h2>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="status-chip status-chip-cyan">{currentQuestion.classRange}</span>
                    <span className={difficultyClass(currentQuestion.difficulty)}>{currentQuestion.difficulty}</span>
                  </div>
                </div>

                <p className="mt-5 rounded-lg border border-slate-300/70 bg-slate-50 p-4 text-lg font-black leading-relaxed dark:border-lab-line dark:bg-slate-950/50">
                  {currentQuestion.prompt}
                </p>

                <div className="mt-5 grid gap-3">
                  {currentQuestion.options.map((option, optionIndex) => {
                    const selected = answers[currentQuestion.id] === option;
                    const answered = Boolean(answers[currentQuestion.id]);
                    const correct = option === currentQuestion.correctOption;
                    const isAnimating = animatingOption?.option === option;
                    const animClass = isAnimating ? (animatingOption?.type === "correct" ? " quiz-option-animating-correct" : " quiz-option-animating-wrong") : "";
                    const className = (answered && correct ? "quiz-option quiz-option-correct" : answered && selected ? "quiz-option quiz-option-wrong" : selected ? "quiz-option quiz-option-selected" : "quiz-option") + animClass;
                    return (
                      <button key={option} className={className} onClick={() => chooseOption(option)}>
                        <span className="quiz-option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {answers[currentQuestion.id] && (
                  <div className={answers[currentQuestion.id] === currentQuestion.correctOption ? "quiz-feedback quiz-feedback-correct" : "quiz-feedback quiz-feedback-wrong"}>
                    <div className="flex items-center gap-2 font-black">
                      <PhysicsIcon name={answers[currentQuestion.id] === currentQuestion.correctOption ? "check" : "spark"} className="h-4 w-4" />
                      {answers[currentQuestion.id] === currentQuestion.correctOption ? "Correct" : "Review this idea"}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{currentQuestion.answer}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentQuestion.conceptTags.map((tag) => <span key={tag} className="status-chip">{tag}</span>)}
                    </div>
                    {answers[currentQuestion.id] !== currentQuestion.correctOption && (
                      <div className="mt-3 rounded-md border border-amber-400/35 bg-amber-400/10 p-3 text-xs font-bold text-amber-700 dark:text-amber-200">
                        Added to weak-concept practice: {currentQuestion.conceptTags.join(", ")}.
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap justify-between gap-3">
                  <button className="tool-btn" onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} disabled={currentIndex === 0}>
                    Previous
                  </button>
                  <div className="flex gap-2">
                    <button className="tool-btn" onClick={() => chooseOption(currentQuestion.correctOption, false)} disabled={Boolean(answers[currentQuestion.id])}>
                      <PhysicsIcon name="eye" className="h-4 w-4" />
                      Reveal
                    </button>
                    <button className="hero-btn-secondary" onClick={() => setCurrentIndex((value) => Math.min(session.length - 1, value + 1))} disabled={currentIndex === session.length - 1}>
                      Next
                    </button>
                  </div>
                </div>
              </article>
            )}

            {isComplete && (
              <section className="panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="ui-label">Quiz complete</p>
                    <h2 className="mt-1 text-3xl font-black">Score {score}/{quizStats.sessionSize}</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{score >= 10 ? "Excellent. You are ready for tougher mixed practice." : score >= 7 ? "Good progress. Review the missed explanations and replay." : "Slow it down: one concept, one formula, one unit check."}</p>
                    {weakConceptList.length > 0 && <p className="mt-2 text-sm font-bold text-amber-600 dark:text-amber-200">Next round will prioritize: {weakConceptList.slice(0, 4).map((item) => item.tag).join(", ")}.</p>}
                  </div>
                  <button className="hero-btn-secondary" onClick={startFreshQuiz}><PhysicsIcon name="spark" className="h-4 w-4" />Try another round</button>
                </div>
                <RemediationPanel weakConcepts={weakConceptList} />
                <div className="quiz-review-grid mt-5">
                  {session.map((question, index) => {
                    const correct = answers[question.id] === question.correctOption;
                    return (
                      <button key={question.id} className={correct ? "quiz-review-item quiz-review-correct" : "quiz-review-item quiz-review-wrong"} onClick={() => setCurrentIndex(index)}>
                        <span className="font-black">Q{index + 1}</span>
                        <span>{question.subcategoryTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </section>
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

function DashboardStat({ icon, label, value }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; value: string }) {
  return (
    <div className="quiz-dashboard-stat">
      <PhysicsIcon name={icon} className="h-4 w-4 text-cyan-500" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function difficultyClass(difficulty: QuizDifficulty) {
  if (difficulty === "Difficult") return "status-chip border-rose-400/45 bg-rose-400/10 text-rose-600 dark:text-rose-300";
  if (difficulty === "Intermediate") return "status-chip border-amber-400/45 bg-amber-400/10 text-amber-600 dark:text-amber-200";
  return "status-chip border-emerald-400/45 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300";
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function readWeakConcepts(): WeakConceptMap {
  try {
    const parsed = JSON.parse(localStorage.getItem(weakConceptKey) ?? "{}") as WeakConceptMap;
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => Number.isFinite(value) && value > 0));
  } catch {
    return {};
  }
}

function topWeakConcepts(concepts: WeakConceptMap) {
  return Object.entries(concepts)
    .map(([tag, score]) => ({ tag, score }))
    .sort((left, right) => right.score - left.score || left.tag.localeCompare(right.tag))
    .slice(0, 8);
}

function mergeFocusTag(items: ReturnType<typeof topWeakConcepts>, focusTag: string) {
  if (!focusTag) return items;
  const existing = items.find((item) => item.tag.toLowerCase() === focusTag.toLowerCase());
  if (existing) return items;
  return [{ tag: focusTag, score: 1 }, ...items].slice(0, 8);
}
