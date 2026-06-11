import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "syllabus" | "map">("library");
  const [mapGrade, setMapGrade] = useState(12);
  const navigate = useNavigate();
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
      <div id="content" className="desktop-page experiments-page">
        <div className="page-hero mesh-bg flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ui-label">Interactive guided learning</p>
            <h1 className="mt-2 text-3xl font-black text-gradient">Guided Experiments</h1>
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
            { id: "map" as const, label: "Constellation", icon: "orbit" as const },
          ].map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? "tab-active" : "tab-btn"} type="button" onClick={() => setActiveTab(tab.id)}>
              <span className="inline-flex items-center gap-1.5"><PhysicsIcon name={tab.icon} className="h-3.5 w-3.5" />{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="desktop-tab-panel desktop-tab-panel-tall desktop-scroll-panel experiments-panel">
          {activeTab === "map" && (
            <div className="constellation-shell">
              <div className="constellation-toolbar">
                <div>
                  <p className="ui-label">Experiment constellation map</p>
                  <h2>Prerequisites, clusters, and progress as a physics sky map</h2>
                </div>
                <label>
                  Class ceiling
                  <input type="range" min={6} max={12} value={mapGrade} onChange={(event) => setMapGrade(Number(event.target.value))} />
                  <strong>Class {mapGrade}</strong>
                </label>
              </div>
              <ExperimentConstellation
                experiments={experiments.filter((experiment) => (experiment.curriculumTags?.classes[0] ?? 12) <= mapGrade)}
                onOpen={(id) => navigate(`/experiments/${id}`)}
              />
            </div>
          )}
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
        <div className="filter-bar experiment-filter-bar">
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

        <div className={viewMode === "compact" ? "experiment-card-grid-catalog experiment-card-grid-catalog-compact" : "experiment-card-grid-catalog"}>
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
              <Link key={experiment.id} to={`/experiments/${experiment.id}`} className={viewMode === "compact" ? "experiment-library-card experiment-library-card-compact stagger-item" : "experiment-library-card stagger-item"}>
                {viewMode === "cards" && <ExperimentPreview experiment={experiment} />}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="card-icon">
                      <PhysicsIcon name={iconForExperiment(experiment)} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="experiment-card-title">{experiment.title}</h2>
                      <div className="experiment-card-category">{experiment.category}</div>
                    </div>
                  </div>
                  <span className="status-chip shrink-0">{experiment.difficulty}</span>
                </div>
                <div className="experiment-trust-strip">
                  <span>{experiment.modelClass}</span>
                  <strong>{experiment.trustLevel}% trust</strong>
                </div>
                <p className="experiment-card-aim">{experiment.aim}</p>
                <div className="experiment-learn-box">
                  <span>Learn</span> {primaryOutcome}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <span key={feature.label} className={feature.label === "3D" ? "status-chip status-chip-cyan" : "status-chip"}>
                      <PhysicsIcon name={feature.icon} className="h-3.5 w-3.5" />{feature.label}
                    </span>
                  ))}
                </div>
                <div className="experiment-card-level">{experiment.classLevel}</div>
                {experiment.curriculumTags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {experiment.curriculumTags.classes.map((grade) => <span key={grade} className="status-chip status-chip-cyan">Class {grade}</span>)}
                  </div>
                )}
                {mappedTopics.length > 0 && (
                  <div className="experiment-topic-list">
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

function ExperimentPreview({ experiment }: { experiment: typeof experiments[number] }) {
  const kind = previewKind(experiment);
  return (
    <div className={`experiment-preview experiment-preview-${kind}`} aria-hidden="true">
      <svg className="experiment-preview-svg" viewBox="0 0 240 112" role="img">
        <defs>
          <radialGradient id={`preview-glow-${experiment.id}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.52" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect className="preview-grid" width="240" height="112" rx="14" />
        <path className="preview-wave" d="M8 68 C35 24 58 24 84 68 S132 112 160 68 207 24 232 68" />
        <path className="preview-orbit preview-orbit-a" d="M72 56 C72 27 168 27 168 56 S72 85 72 56" />
        <path className="preview-orbit preview-orbit-b" d="M120 16 C151 16 151 96 120 96 S89 16 120 16" />
        <circle className="preview-core" cx="120" cy="56" r="9" />
        <circle className="preview-particle preview-particle-a" cx="168" cy="56" r="5" />
        <circle className="preview-particle preview-particle-b" cx="84" cy="68" r="4" />
        <path className="preview-trace" d="M24 88 L72 72 L116 36 L158 52 L216 20" />
        <rect className="preview-block preview-block-a" x="32" y="78" width="34" height="12" rx="3" />
        <rect className="preview-block preview-block-b" x="174" y="30" width="34" height="12" rx="3" />
        <circle className="preview-glow" cx="120" cy="56" r="48" fill={`url(#preview-glow-${experiment.id})`} />
      </svg>
    </div>
  );
}

function previewKind(experiment: typeof experiments[number]) {
  if (has3DAnimation(experiment.id)) return "orbit";
  if (experiment.category.includes("Optics")) return "optics";
  if (experiment.category.includes("Electric")) return "circuit";
  if (experiment.category.includes("Wave")) return "wave";
  if (experiment.category.includes("Thermo")) return "thermal";
  if (experiment.category.includes("Modern") || experiment.category.includes("Quantum")) return "quantum";
  return "mechanics";
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

function ExperimentConstellation({ experiments, onOpen }: { experiments: typeof import("../lib/experiments").experiments; onOpen: (id: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<typeof experiments[number] | null>(null);
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const [showProgress, setShowProgress] = useState(true);
  const dragRef = useRef<{ x: number; y: number; view: typeof view } | null>(null);
  const nodes = useMemo(() => makeConstellationNodes(experiments), [experiments]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawConstellation(ctx, rect.width, rect.height, nodes, hovered?.id, view, showProgress);
  }, [nodes, hovered, view, showProgress]);

  const nodeAt = (x: number, y: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return undefined;
    return nodes.find((node) => {
      const p = projectNode(node, rect.width, rect.height, view);
      return Math.hypot(p.x - x, p.y - y) <= node.r + 8;
    });
  };

  return (
    <div className="constellation-canvas-wrap">
      <div className="constellation-map-controls">
        <button onClick={() => setView((state) => ({ ...state, zoom: Math.min(3, state.zoom * 1.2) }))}>Zoom +</button>
        <button onClick={() => setView((state) => ({ ...state, zoom: Math.max(0.55, state.zoom / 1.2) }))}>Zoom -</button>
        <button onClick={() => setView({ zoom: 1, x: 0, y: 0 })}>Reset</button>
        <button className={showProgress ? "active" : ""} onClick={() => setShowProgress((value) => !value)}>Progress</button>
      </div>
      <canvas
        ref={canvasRef}
        className="constellation-canvas"
        onPointerDown={(event) => {
          dragRef.current = { x: event.clientX, y: event.clientY, view };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragRef.current) {
            setView({ ...dragRef.current.view, x: dragRef.current.view.x + event.clientX - dragRef.current.x, y: dragRef.current.view.y + event.clientY - dragRef.current.y });
            return;
          }
          const rect = event.currentTarget.getBoundingClientRect();
          setHovered(nodeAt(event.clientX - rect.left, event.clientY - rect.top)?.experiment ?? null);
        }}
        onPointerUp={(event) => {
          dragRef.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerLeave={() => { dragRef.current = null; setHovered(null); }}
        onWheel={(event) => {
          event.preventDefault();
          setView((state) => ({ ...state, zoom: Math.max(0.55, Math.min(3, state.zoom * (event.deltaY < 0 ? 1.12 : 0.9))) }));
        }}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const node = nodeAt(event.clientX - rect.left, event.clientY - rect.top);
          if (node) onOpen(node.experiment.id);
        }}
        aria-label="Experiment constellation map"
      />
      {hovered && (
        <div className="constellation-preview">
          <span className="card-icon"><PhysicsIcon name={iconForExperiment(hovered)} /></span>
          <strong>{hovered.title}</strong>
          <small>{hovered.category} - {hovered.classLevel}</small>
          <p>{hovered.aim}</p>
        </div>
      )}
    </div>
  );
}

function makeConstellationNodes(items: typeof experiments) {
  const domains = Array.from(new Set(items.map((item) => item.category))).sort();
  return items.map((experiment, index) => {
    const domainIndex = domains.indexOf(experiment.category);
    const angle = (index / Math.max(1, items.length)) * Math.PI * 2 + domainIndex * 0.28;
    const ring = 0.18 + (domainIndex % 5) * 0.08 + (index % 7) * 0.008;
    return {
      experiment,
      x: 0.5 + Math.cos(angle) * ring,
      y: 0.52 + Math.sin(angle) * ring,
      r: 5 + difficultyScore(experiment.difficulty) * 2 + (has3DAnimation(experiment.id) ? 2 : 0),
      color: colorForDomain(experiment.category),
      progress: progressState(experiment.id, index),
      links: items
        .filter((other) => other.id !== experiment.id)
        .filter((other) => sharesConcept(experiment, other))
        .slice(0, 3)
        .map((other) => other.id),
    };
  });
}

function drawConstellation(ctx: CanvasRenderingContext2D, width: number, height: number, nodes: ReturnType<typeof makeConstellationNodes>, hoveredId: string | undefined, view: { zoom: number; x: number; y: number }, showProgress: boolean) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#050c18";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(148,163,184,0.24)";
  for (let i = 0; i < 130; i += 1) {
    const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 53.1) * 0.5 + 0.5) * height;
    ctx.fillRect(x, y, 1, 1);
  }
  const byId = new Map(nodes.map((node) => [node.experiment.id, node]));
  nodes.forEach((node) => {
    node.links.forEach((id) => {
      const target = byId.get(id);
      if (!target) return;
      const active = hoveredId === node.experiment.id || hoveredId === target.experiment.id;
      ctx.strokeStyle = active ? "rgba(0,229,255,0.58)" : "rgba(148,163,184,0.12)";
      ctx.lineWidth = active ? 1.6 : 0.8;
      const a = projectNode(node, width, height, view);
      const b = projectNode(target, width, height, view);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
  });
  nodes.forEach((node) => {
    const active = hoveredId === node.experiment.id;
    const p = projectNode(node, width, height, view);
    const progressColor = node.progress === "mastered" ? "#22c55e" : node.progress === "progress" ? "#f59e0b" : "#64748b";
    const color = showProgress ? progressColor : node.color;
    ctx.shadowColor = color;
    ctx.shadowBlur = active ? 28 : 12;
    ctx.fillStyle = color;
    ctx.globalAlpha = active ? 1 : 0.78;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (active ? node.r + 5 : node.r) * Math.sqrt(view.zoom), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  });
}

function projectNode(node: ReturnType<typeof makeConstellationNodes>[number], width: number, height: number, view: { zoom: number; x: number; y: number }) {
  return {
    x: width / 2 + (node.x - 0.5) * width * view.zoom + view.x,
    y: height / 2 + (node.y - 0.5) * height * view.zoom + view.y,
  };
}

function progressState(id: string, index: number) {
  const saved = localStorage.getItem(`physicslab_mastery_${id}`);
  if (saved === "mastered" || saved === "progress") return saved;
  if (index % 11 === 0) return "mastered";
  if (index % 5 === 0) return "progress";
  return "untouched";
}

function sharesConcept(left: typeof experiments[number], right: typeof experiments[number]) {
  const leftTags = new Set([left.category, ...(left.curriculumTags?.topicIds ?? []), ...(left.curriculumTags?.domains ?? [])]);
  return [right.category, ...(right.curriculumTags?.topicIds ?? []), ...(right.curriculumTags?.domains ?? [])].some((tag) => leftTags.has(tag));
}

function colorForDomain(domain: string) {
  if (domain.includes("Optics")) return "#f59e0b";
  if (domain.includes("Wave")) return "#a78bfa";
  if (domain.includes("Electric")) return "#22c55e";
  if (domain.includes("Modern") || domain.includes("Quantum")) return "#7c3aed";
  if (domain.includes("Thermo")) return "#ef4444";
  return "#00e5ff";
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
