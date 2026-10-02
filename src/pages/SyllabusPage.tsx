import { useMemo, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { experiments } from "../lib/experiments";
import {
  upcomingLabContent,
  upcomingPhysicsContent,
  upcomingTheoryContent,
} from "../data/upcomingPhysicsContent.generated";
import {
  allCurriculumTopics,
  classOptions,
  curriculum,
  syllabusFrameworkCoverage,
  syllabusFrameworks,
  SyllabusFrameworkBand,
} from "../lib/curriculum";

type BandStatus = SyllabusFrameworkBand["status"];

const classFilters = classOptions.filter((item) => item.grade >= 6 && item.grade <= 12);
const statusLabels: Record<BandStatus, string> = {
  covered: "Interactive",
  partial: "Needs depth",
  "needs-lab": "Needs lab",
  upcoming: "Upcoming",
};

const upcomingStages = ["Middle", "Secondary", "Senior Secondary", "Undergraduate", "Postgraduate", "Doctoral / Research"];

export function SyllabusPage() {
  const [frameworkId, setFrameworkId] = useState(syllabusFrameworks[0]?.id ?? "");
  const [grade, setGrade] = useState<number | "all">("all");
  const [onlyGaps, setOnlyGaps] = useState(false);
  const [activeTab, setActiveTab] = useState<"coverage" | "advanced" | "upcoming">("coverage");
  const [upcomingStage, setUpcomingStage] = useState("all");
  const [upcomingKind, setUpcomingKind] = useState<"all" | "theory" | "lab">("all");
  const [upcomingQuery, setUpcomingQuery] = useState("");
  const topics = useMemo(() => allCurriculumTopics(), []);
  const coverage = useMemo(() => syllabusFrameworkCoverage(), []);
  const selectedFramework = coverage.find((item) => item.id === frameworkId) ?? coverage[0];
  const topicById = useMemo(() => new Map(topics.map((topic) => [topic.id, topic])), [topics]);
  const experimentById = useMemo(() => new Map(experiments.map((experiment) => [experiment.id, experiment])), []);
  const classCards = curriculum.filter((item) => item.grade >= 6 && item.grade <= 12);
  const filteredBands = selectedFramework.bands.filter((band) => {
    const gradeMatch = grade === "all" || band.grades.includes(grade);
    const gapMatch = !onlyGaps || band.status !== "covered";
    return gradeMatch && gapMatch;
  });
  const selectedMapped = selectedFramework.bands.reduce((sum, band) => sum + band.mappedCount, 0);
  const selectedGap = selectedFramework.bands.reduce((sum, band) => sum + band.gapCount, 0);
  const filteredUpcoming = useMemo(() => {
    const query = upcomingQuery.trim().toLowerCase();
    return upcomingPhysicsContent.filter((item) => {
      const stageMatch = upcomingStage === "all" || item.stage === upcomingStage;
      const kindMatch = upcomingKind === "all" || item.kind === upcomingKind;
      const queryMatch = !query || [item.title, item.domain, item.subdomain, item.scope, item.frameworks, item.nearestContent]
        .some((value) => value.toLowerCase().includes(query));
      return stageMatch && kindMatch && queryMatch;
    });
  }, [upcomingKind, upcomingQuery, upcomingStage]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-lab-ink dark:text-slate-100">
      <Toolbar />
      <div id="content" className="desktop-page">
        <section className="page-hero mesh-bg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="ui-label">Phase 1 syllabus spine</p>
              <h1 className="text-3xl font-black text-gradient">Physics syllabus map</h1>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Current and upcoming Physics theory and labs for AP State, CBSE/NCERT, representative state boards, and advanced study through PhD.
              </p>
            </div>
            <div className="grid min-w-[360px] gap-2 sm:grid-cols-4">
              <Metric icon="book" label="Levels" value={curriculum.length} />
              <Metric icon="flask" label="Labs" value={selectedMapped} />
              <Metric icon="spark" label="Gaps" value={selectedGap} />
              <Metric icon="spark" label="Upcoming" value={upcomingPhysicsContent.length} />
            </div>
          </div>
        </section>

        <div className="desktop-tabs mt-3" aria-label="Syllabus sections">
          {[
            { id: "coverage" as const, label: "School Coverage", icon: "book" as const },
            { id: "advanced" as const, label: "Advanced Lanes", icon: "spark" as const },
            { id: "upcoming" as const, label: `Upcoming (${upcomingPhysicsContent.length})`, icon: "flask" as const },
          ].map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? "tab-active" : "tab-btn"} type="button" onClick={() => setActiveTab(tab.id)}>
              <span className="inline-flex items-center gap-1.5"><PhysicsIcon name={tab.icon} className="h-3.5 w-3.5" />{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="desktop-tab-panel desktop-tab-panel-tall desktop-scroll-panel">
          {activeTab === "coverage" && (
            <div className="grid gap-3">
        <section className="topic-lens-panel mt-4">
          <div className="grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="ui-label">Boards and pathways</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {coverage.map((framework) => (
                  <button
                    key={framework.id}
                    className={framework.id === selectedFramework.id ? "focus-pill focus-pill-active" : "focus-pill"}
                    type="button"
                    onClick={() => setFrameworkId(framework.id)}
                  >
                    {framework.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="ui-label">Class filter</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className={grade === "all" ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setGrade("all")}>All</button>
                {classFilters.map((item) => (
                  <button key={item.id} className={grade === item.grade ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setGrade(item.grade)}>
                    {item.label.replace("Class ", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">{selectedFramework.label}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">{selectedFramework.note}</p>
            </div>
            <label className="toolbar-field toolbar-field-menu">
              Only gaps
              <input type="checkbox" checked={onlyGaps} onChange={(event) => setOnlyGaps(event.target.checked)} />
            </label>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {classCards.map((level) => {
            const levelTopics = level.units.flatMap((unit) => unit.topics);
            const mapped = levelTopics.filter((topic) => topic.experimentIds.length > 0).length;
            return (
              <Link key={level.id} className="class-progress-item" to={`/experiments?class=${level.id}`}>
                <span>{level.label}</span>
                <span className="mini-progress"><span style={{ width: `${Math.round((mapped / Math.max(1, levelTopics.length)) * 100)}%` }} /></span>
                <strong>{mapped}/{levelTopics.length}</strong>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-3 xl:grid-cols-2">
          {filteredBands.map((band) => {
            const bandTopics = band.topicIds.flatMap((id) => {
              const topic = topicById.get(id);
              return topic ? [topic] : [];
            });
            const bandExperiments = band.experimentIds.flatMap((id) => {
              const experiment = experimentById.get(id);
              return experiment ? [experiment] : [];
            });
            return (
              <article key={band.id} className="enhanced-card syllabus-band-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="ui-label">{band.grades.map((item) => `Class ${item}`).join(", ")}</p>
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{band.label}</h3>
                  </div>
                  <span className={statusClass(band.status)}>{statusLabels[band.status]}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {band.focus.map((item) => (
                    <span key={item} className="status-chip">{item}</span>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div>
                    <p className="ui-label">Concepts</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {bandTopics.map((topic) => (
                        <Link key={topic.id} className="status-chip" to={`/concepts?concept=${topic.id}`}>
                          {topic.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="ui-label">Interactive labs</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {bandExperiments.map((experiment) => (
                        <Link key={experiment.id} className="status-chip status-chip-cyan" to={`/experiments/${experiment.id}`}>
                          {experiment.title}
                        </Link>
                      ))}
                      {!bandExperiments.length && <span className="status-chip">Use concept journey</span>}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link className="hero-btn-secondary inline-flex items-center gap-2" to={`/concepts?concept=${band.topicIds[0] ?? ""}`}>
                    <PhysicsIcon name="spark" className="h-4 w-4" />Concept journey
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
            </div>
          )}

          {activeTab === "advanced" && (
          <div className="grid gap-3 lg:grid-cols-3">
            {curriculum.filter((item) => item.grade > 12).map((level) => {
              const levelTopics = level.units.flatMap((unit) => unit.topics);
              const levelLabs = levelTopics.flatMap((topic) => topic.experimentIds).flatMap((id) => {
                const experiment = experimentById.get(id);
                return experiment ? [experiment] : [];
              });
              return (
              <div key={level.id} className="rounded-md border border-slate-300/70 bg-slate-100 p-3 dark:border-lab-line dark:bg-slate-900/70">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-black">{level.label}</h3>
                  <span className="status-chip status-chip-cyan">{levelLabs.length} labs</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">{level.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {levelTopics.map((topic) => (
                    <Link key={topic.id} className="status-chip" to={`/concepts?concept=${topic.id}`}>
                      {topic.title}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {levelLabs.slice(0, 6).map((experiment) => (
                    <Link key={experiment.id} className="status-chip status-chip-cyan" to={`/experiments/${experiment.id}`}>
                      {experiment.title}
                    </Link>
                  ))}
                </div>
              </div>
            );})}
          </div>
          )}

          {activeTab === "upcoming" && (
            <div className="grid gap-4">
              <section className="topic-lens-panel mt-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <p className="ui-label">Audited development catalogue</p>
                    <h2 className="mt-1 text-xl font-black">All missing content is listed as Upcoming</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                      These records describe relevant theory, prescribed or representative practical work, and the nearest current lesson. They do not count as interactive or covered until implementation and review are complete.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="status-chip status-chip-amber">{upcomingTheoryContent.length} theory</span>
                    <span className="status-chip status-chip-amber">{upcomingLabContent.length} labs</span>
                    <span className="status-chip">Upcoming</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Search upcoming content
                    <input
                      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-cyan-500 dark:border-lab-line dark:bg-slate-950 dark:text-slate-100"
                      type="search"
                      value={upcomingQuery}
                      onChange={(event) => setUpcomingQuery(event.target.value)}
                      placeholder="Topic, domain, framework, or lab"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Level
                    <select
                      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-900 dark:border-lab-line dark:bg-slate-950 dark:text-slate-100"
                      value={upcomingStage}
                      onChange={(event) => setUpcomingStage(event.target.value)}
                    >
                      <option value="all">All levels</option>
                      {upcomingStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Content type
                    <select
                      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-900 dark:border-lab-line dark:bg-slate-950 dark:text-slate-100"
                      value={upcomingKind}
                      onChange={(event) => setUpcomingKind(event.target.value as "all" | "theory" | "lab")}
                    >
                      <option value="all">Theory and labs</option>
                      <option value="theory">Theory</option>
                      <option value="lab">Labs</option>
                    </select>
                  </label>
                </div>
                <p className="mt-3 text-sm font-bold text-cyan-600 dark:text-cyan-300">Showing {filteredUpcoming.length} upcoming items</p>
              </section>

              <section className="grid gap-3 xl:grid-cols-2">
                {filteredUpcoming.map((item) => {
                  const sourceUrl = item.sourceUrls.split(" • ").find((value) => value.startsWith("http"));
                  return (
                    <article key={item.id} className="enhanced-card border-amber-300/70 dark:border-amber-400/30">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="ui-label">{item.stage} · {item.level}</p>
                          <h3 className="mt-1 text-lg font-black text-slate-800 dark:text-slate-100">{item.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="status-chip status-chip-amber">Upcoming</span>
                          <span className="status-chip">{item.kind === "lab" ? "Lab" : "Theory"}</span>
                          <span className="status-chip">{item.priority}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="status-chip">{item.domain}</span>
                        <span className="status-chip">{item.subdomain}</span>
                        <span className="status-chip">{item.coverage}</span>
                      </div>
                      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="ui-label">Relevant content to add</dt>
                          <dd className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{item.scope}</dd>
                        </div>
                        <div>
                          <dt className="ui-label">Planned practical / simulation</dt>
                          <dd className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{item.plannedLab}</dd>
                        </div>
                        <div>
                          <dt className="ui-label">Nearest current content</dt>
                          <dd className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{item.nearestContent || "No close current lesson"}</dd>
                        </div>
                        <div>
                          <dt className="ui-label">Target syllabus</dt>
                          <dd className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{item.frameworks}</dd>
                        </div>
                      </dl>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-lab-line">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.sourceNames}</p>
                        {sourceUrl && (
                          <a className="text-xs font-black text-cyan-600 hover:underline dark:text-cyan-300" href={sourceUrl} target="_blank" rel="noreferrer">
                            Syllabus source
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
                {!filteredUpcoming.length && (
                  <div className="enhanced-card xl:col-span-2">
                    <h3 className="font-black">No matching upcoming content</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">Clear the search or change the level and content-type filters.</p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function statusClass(status: BandStatus) {
  if (status === "covered") return "status-chip status-chip-cyan";
  if (status === "partial" || status === "upcoming") return "status-chip status-chip-amber";
  return "status-chip";
}

function Metric({ icon, label, value }: { icon: PhysicsIconName; label: string; value: number }) {
  const animated = useCountUp(value);
  return (
    <div className="metric-card flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
        <PhysicsIcon name={icon} />
      </span>
      <div>
        <div className="ui-label">{label}</div>
        <div className="mt-1 text-2xl font-black text-cyan-500 count-up">{animated}</div>
      </div>
    </div>
  );
}
