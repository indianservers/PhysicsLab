import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { experiments } from "../lib/experiments";
import { allCurriculumTopics, classOptions, curriculum } from "../lib/curriculum";
import { iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { has3DAnimation } from "../components/Experiment3DAnimation";
import { interactionModes } from "../components/InteractionModePanel";

export function ExperimentsPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(searchParams.get("class") ?? "all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("interactive");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("compact");
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "syllabus">("library");
  const topics = useMemo(() => allCurriculumTopics(), []);
  const selectedGrade = selectedClass === "all" ? null : Number(selectedClass.replace("class-", ""));
  const selectedGradeExperimentIds = useMemo(() => new Set(
    selectedGrade === null
      ? []
      : topics.filter((topic) => topic.grade === selectedGrade).flatMap((topic) => topic.experimentIds)
  ), [selectedGrade, topics]);
  const categories = useMemo(() => ["all", ...Array.from(new Set(experiments.map((experiment) => experiment.category))).sort()], []);
  const difficulties = useMemo(() => ["all", "Beginner", "Intermediate", "Advanced"], []);
  const classTopicHighlights = useMemo(() => {
    return topics
      .filter((topic) => topic.experimentIds.length > 0)
      .filter((topic) => selectedGrade === null || topic.grade === selectedGrade)
      .slice(0, 8);
  }, [selectedGrade, topics]);
  const filteredBase = experiments.filter((experiment) => {
    const classMatch = selectedGrade === null || experiment.curriculumTags?.classes.includes(selectedGrade) || selectedGradeExperimentIds.has(experiment.id);
    const categoryMatch = selectedCategory === "all" || experiment.category === selectedCategory;
    const difficultyMatch = (selectedDifficulty === "all" || experiment.difficulty === selectedDifficulty) && (!beginnerMode || experiment.difficulty !== "Advanced");
    const topicText = topics.filter((topic) => experiment.curriculumTags?.topicIds.includes(topic.id)).map((topic) => `${topic.title} ${topic.domain} ${topic.outcomes.join(" ")}`).join(" ");
    const formulaText = experiment.formulae.map((formula) => `${formula.name} ${formula.expression}`).join(" ");
    const searchText = `${experiment.title} ${experiment.aim} ${experiment.category} ${experiment.classLevel} ${experiment.curriculumTags?.domains.join(" ") ?? ""} ${topicText} ${formulaText}`.toLowerCase();
    const queryMatch = !query.trim() || searchText.includes(query.trim().toLowerCase());
    return classMatch && categoryMatch && difficultyMatch && queryMatch;
  });
  const filtered = [...filteredBase].sort((left, right) => sortExperiments(left, right, sortBy));
  const activeFilters = [
    selectedClass !== "all" ? classOptions.find((item) => item.id === selectedClass)?.label ?? selectedClass : null,
    selectedCategory !== "all" ? selectedCategory : null,
    selectedDifficulty !== "all" ? selectedDifficulty : null,
    beginnerMode ? "Beginner focus" : null,
    query.trim() ? `Search: ${query.trim()}` : null,
  ].filter(Boolean) as string[];
  const mappedTopicCount = topics.filter((topic) => topic.experimentIds.length > 0).length;
  const coveragePercent = Math.round((mappedTopicCount / Math.max(1, topics.length)) * 100);
  const interactiveCount = experiments.filter((item) => has3DAnimation(item.id)).length;
  const syllabusSpine = curriculum.map((level) => ({
    label: level.label,
    expected: level.units.flatMap((unit) => unit.topics.map((topic) => topic.title)).slice(0, 5),
    count: countClassLabs(level.grade),
    topicCount: level.units.reduce((sum, unit) => sum + unit.topics.length, 0),
  }));

  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page">
        <div className="page-hero flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ui-label">Interactive guided learning</p>
            <h1 className="mt-2 text-3xl font-black">Guided Experiments</h1>
            <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">
              Browser-only experiment library mapped from Class 6 to PhD lanes, with compact gaps, guided calculators, 3D views, and notebook-ready observations.
            </p>
          </div>
          <div className="min-w-52">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="ui-label">Topic coverage</span>
              <span className="ui-value">{coveragePercent}%</span>
            </div>
            <div className="mini-progress"><span style={{ width: `${coveragePercent}%` }} /></div>
          </div>
        </div>

        <div className="desktop-tabs mt-3" aria-label="Experiment library sections">
          {[
            { id: "library" as const, label: "Library", icon: "flask" as const },
            { id: "syllabus" as const, label: "Syllabus", icon: "book" as const },
          ].map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? "tab-active" : "tab-btn"} type="button" onClick={() => setActiveTab(tab.id)}>
              <span className="inline-flex items-center gap-1.5"><PhysicsIcon name={tab.icon} className="h-3.5 w-3.5" />{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="desktop-tab-panel desktop-tab-panel-tall desktop-scroll-panel">
          {activeTab === "syllabus" && (
            <div className="grid gap-4">
        <div className="class-progress-panel">
          {classOptions.map((klass) => {
            const count = countClassLabs(klass.grade);
            const width = Math.min(100, Math.round((count / Math.max(1, experiments.length)) * 360));
            return (
              <Link key={klass.id} to={`/experiments?class=${klass.id}`} className="class-progress-item" onClick={() => setSelectedClass(klass.id)} title={`${klass.label}: ${count} mapped labs`}>
                <span>{klass.label}</span>
                <span className="mini-progress"><span style={{ width: `${width}%` }} /></span>
                <strong>{count}</strong>
              </Link>
            );
          })}
        </div>

        <div className="topic-lens-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="ui-label">Topic lens</p>
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Start from a school topic, not a tool name</h2>
            </div>
            <button
              className={beginnerMode ? "focus-toggle focus-toggle-active" : "focus-toggle"}
              type="button"
              onClick={() => setBeginnerMode((value) => !value)}
              title="Beginner focus hides advanced labs and keeps the list easier to scan"
            >
              <PhysicsIcon name="eye" className="h-4 w-4" />
              Beginner focus
            </button>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {classTopicHighlights.map((topic) => (
              <button
                key={`${topic.classId}-${topic.id}`}
                className="topic-lens-card"
                type="button"
                onClick={() => {
                  setQuery(topic.title);
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
                title={`Search labs for ${topic.title}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
                  <PhysicsIcon name={topicIcon(topic.domain)} className="h-4 w-4" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block truncate text-sm font-black text-slate-800 dark:text-slate-100">{topic.title}</span>
                  <span className="mt-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{topic.classLabel} - {topic.experimentIds.length} labs</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <details className="lab-disclosure">
          <summary title="Compare the app topic map from Class 6 through research level">
            <span className="inline-flex items-center gap-2"><PhysicsIcon name="chart" className="h-4 w-4 text-cyan-500" />Simple Syllabus Map</span>
            <span className="info-dot" title="Open only when you want the compact level-by-level map.">i</span>
          </summary>
          <div className="lab-disclosure-body grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {syllabusSpine.map((row) => (
              <div key={row.label} className="rounded-md border border-slate-300/70 bg-slate-100 p-3 dark:border-lab-line dark:bg-slate-900/70">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-slate-800 dark:text-slate-100">{row.label}</div>
                  <span className={row.count > 0 ? "status-chip status-chip-cyan" : "status-chip"}>{row.count} labs</span>
                </div>
                <div className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{row.topicCount} syllabus points</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {row.expected.map((item) => <span key={item} className="status-chip">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </details>
            </div>
          )}

          {activeTab === "library" && (
            <div className="grid min-h-0 gap-3">
        <div className="filter-bar">
          <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto_auto_auto]">
            <label>
              <span className="sr-only">Search experiments</span>
              <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic, class, formula, domain..." />
            </label>
            <select className="select-field" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} aria-label="Filter by class">
              <option value="all">All classes</option>
              {classOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <select className="select-field" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} aria-label="Filter by category">
              {categories.map((category) => <option key={category} value={category}>{category === "all" ? "All categories" : category}</option>)}
            </select>
            <select className="select-field" value={selectedDifficulty} onChange={(event) => setSelectedDifficulty(event.target.value)} aria-label="Filter by difficulty">
              {difficulties.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty === "all" ? "All levels" : difficulty}</option>)}
            </select>
            <select className="select-field" value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort experiments">
              <option value="interactive">Most interactive</option>
              <option value="title">Title A-Z</option>
              <option value="class">Class level</option>
              <option value="difficulty">Difficulty</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="segmented-row min-w-0 flex-1">
              <button className={selectedClass === "all" ? "segment-chip segment-chip-active" : "segment-chip"} onClick={() => setSelectedClass("all")}>All</button>
            {classOptions.map((klass) => (
              <button key={klass.id} className={selectedClass === klass.id ? "segment-chip segment-chip-active" : "segment-chip"} onClick={() => setSelectedClass(klass.id)}>
                <PhysicsIcon name="book" className="h-3.5 w-3.5" />{klass.label}
              </button>
            ))}
            </div>
            <div className="inline-flex rounded-md border border-slate-300/70 bg-white p-1 dark:border-lab-line dark:bg-slate-900">
              <button className={viewMode === "cards" ? "view-toggle-active" : "view-toggle"} onClick={() => setViewMode("cards")} title="Rich card view"><PhysicsIcon name="flask" className="h-4 w-4" />Cards</button>
              <button className={viewMode === "compact" ? "view-toggle-active" : "view-toggle"} onClick={() => setViewMode("compact")} title="Compact scan view"><PhysicsIcon name="menu" className="h-4 w-4" />Compact</button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="ui-label">Showing {filtered.length} of {experiments.length}</span>
            <span className="status-chip status-chip-cyan"><PhysicsIcon name="orbit" className="h-3.5 w-3.5" />{interactiveCount} 3D labs</span>
            {activeFilters.map((filter) => <span key={filter} className="active-filter-chip">{filter}</span>)}
            {activeFilters.length > 0 && (
              <button className="segment-chip" onClick={() => { setQuery(""); setSelectedClass("all"); setSelectedCategory("all"); setSelectedDifficulty("all"); setBeginnerMode(false); }}>
                <PhysicsIcon name="settings" className="h-3.5 w-3.5" />Clear
              </button>
            )}
          </div>
        </div>

        <div className={viewMode === "compact" ? "grid gap-2" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
          {filtered.map((experiment) => {
            const mappedTopics = topics.filter((topic) => experiment.curriculumTags?.topicIds.includes(topic.id));
            const primaryOutcome = mappedTopics[0]?.outcomes[0] ?? experiment.expectedResult;
            const features = [
              { label: "Guide", icon: "clipboard" as const, active: true },
              { label: "Calc", icon: "calculator" as const, active: true },
              { label: "3D", icon: "orbit" as const, active: has3DAnimation(experiment.id) },
              { label: "Coach", icon: "teacher" as const, active: true },
            ].filter((feature) => feature.active);
            return (
              <Link key={experiment.id} to={`/experiments/${experiment.id}`} className={viewMode === "compact" ? "enhanced-card enhanced-card-compact" : "enhanced-card"}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="card-icon">
                      <PhysicsIcon name={iconForExperiment(experiment)} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black">{experiment.title}</h2>
                      <div className="mt-1 text-xs font-bold text-cyan-500">{experiment.category}</div>
                    </div>
                  </div>
                  <span className="status-chip shrink-0">{experiment.difficulty}</span>
                </div>
                <p className={viewMode === "compact" ? "mt-2 line-clamp-1 text-sm text-slate-500 dark:text-slate-400" : "mt-2 text-sm text-slate-500 dark:text-slate-400"}>{experiment.aim}</p>
                <div className="mt-3 rounded-md border border-cyan-300/25 bg-cyan-400/5 p-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="font-black text-cyan-600 dark:text-cyan-300">Learn:</span> {primaryOutcome}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <span key={feature.label} className={feature.label === "3D" ? "status-chip status-chip-cyan" : "status-chip"}>
                      <PhysicsIcon name={feature.icon} className="h-3.5 w-3.5" />{feature.label}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{experiment.classLevel}</div>
                {experiment.curriculumTags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {experiment.curriculumTags.classes.map((grade) => <span key={grade} className="status-chip status-chip-cyan">Class {grade}</span>)}
                  </div>
                )}
                {mappedTopics.length > 0 && (
                  <div className="mt-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    {mappedTopics.slice(0, 3).map((topic) => (
                      <div key={`${topic.classId}-${topic.id}`}>{topic.classLabel}: {topic.title}</div>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <PhysicsIcon name="compass" className="mx-auto h-8 w-8 text-cyan-500" />
            <h2 className="mt-3 text-xl font-black">No matching experiments</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Clear the search or choose a broader class/category filter.</p>
            <button className="hero-btn-secondary mt-4" onClick={() => { setQuery(""); setSelectedClass("all"); setSelectedCategory("all"); setSelectedDifficulty("all"); setBeginnerMode(false); }}>Reset filters</button>
          </div>
        )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function topicIcon(domain: string): PhysicsIconName {
  if (domain.includes("Optics")) return "prism";
  if (domain.includes("Electric")) return "battery";
  if (domain.includes("Magnet")) return "magnet";
  if (domain.includes("Wave")) return "wave";
  if (domain.includes("Thermo")) return "thermometer";
  if (domain.includes("Fluid")) return "drop";
  if (domain.includes("Modern")) return "atom";
  if (domain.includes("Measurement")) return "ruler";
  if (domain.includes("Astronomy")) return "orbit";
  if (domain.includes("Energy")) return "flame";
  return "gauge";
}

function countClassLabs(grade: number) {
  const topicLabIds = new Set(allCurriculumTopics().filter((topic) => topic.grade === grade).flatMap((topic) => topic.experimentIds));
  return experiments.filter((item) => item.curriculumTags?.classes.includes(grade) || topicLabIds.has(item.id)).length;
}

function sortExperiments(left: typeof experiments[number], right: typeof experiments[number], sortBy: string) {
  if (sortBy === "title") return left.title.localeCompare(right.title);
  if (sortBy === "category") return left.category.localeCompare(right.category) || left.title.localeCompare(right.title);
  if (sortBy === "class") return firstClass(left) - firstClass(right) || left.title.localeCompare(right.title);
  if (sortBy === "difficulty") return difficultyScore(left.difficulty) - difficultyScore(right.difficulty) || left.title.localeCompare(right.title);
  return interactivityScore(right) - interactivityScore(left) || left.title.localeCompare(right.title);
}

function firstClass(experiment: typeof experiments[number]) {
  return experiment.curriculumTags?.classes[0] ?? 99;
}

function difficultyScore(difficulty: string) {
  if (difficulty === "Beginner") return 1;
  if (difficulty === "Intermediate") return 2;
  return 3;
}

function interactivityScore(experiment: typeof experiments[number]) {
  const modeScore = interactionModes(experiment).filter((mode) => mode.active).length;
  return (has3DAnimation(experiment.id) ? 4 : 0) + modeScore + (experiment.vivaQuestions.length > 0 ? 1 : 0);
}

function Metric({ icon, label, value }: { icon: PhysicsIconName; label: string; value: number }) {
  return (
    <div className="metric-card flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
        <PhysicsIcon name={icon} />
      </span>
      <div>
        <div className="ui-label">{label}</div>
        <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
      </div>
    </div>
  );
}
