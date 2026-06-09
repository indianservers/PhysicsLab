import { Link } from "react-router-dom";
import { buildConceptCards, conceptLibraryStats } from "../lib/concepts";
import { curriculum, curriculumCoverageStats, syllabusFrameworkCoverage } from "../lib/curriculum";
import { experiments } from "../lib/experiments";
import { quizStats } from "../lib/quiz";
import { interactionModes } from "./InteractionModePanel";
import { PhysicsIcon, PhysicsIconName } from "../lib/icons";

export function TeacherReadinessPanel() {
  const concepts = buildConceptCards();
  const conceptStats = conceptLibraryStats(concepts);
  const curriculumStats = curriculumCoverageStats();
  const frameworks = syllabusFrameworkCoverage();
  const interactiveModes = experiments.reduce((sum, experiment) => sum + interactionModes(experiment).filter((mode) => mode.active).length, 0);
  const advancedLanes = curriculum.filter((item) => item.grade > 12).map((level) => {
    const topics = level.units.flatMap((unit) => unit.topics);
    const labs = new Set(topics.flatMap((topic) => topic.experimentIds));
    return { ...level, topics: topics.length, labs: labs.size };
  });
  const readiness = [
    { label: "Syllabus", value: curriculumStats.topics, detail: "Class 6 to PhD topic points", icon: "book" as const, href: "/syllabus" },
    { label: "Concepts", value: conceptStats.concepts, detail: "Compact learning cards", icon: "spark" as const, href: "/concepts" },
    { label: "Interactions", value: interactiveModes, detail: "2D, 3D, graph, coach, notebook modes", icon: "orbit" as const, href: "/experiments" },
    { label: "Assessment", value: quizStats.questions, detail: "Tagged quiz questions with remediation", icon: "check" as const, href: "/quiz" },
  ];

  const exportSnapshot = () => {
    const payload = {
      version: "phase-5-readiness",
      exportedAt: new Date().toISOString(),
      curriculum: curriculumStats,
      concepts: conceptStats,
      quiz: quizStats,
      frameworks: frameworks.map((framework) => ({ id: framework.id, label: framework.label, mappedCount: framework.mappedCount, gapCount: framework.gapCount })),
      advancedLanes: advancedLanes.map((lane) => ({ id: lane.id, label: lane.label, topics: lane.topics, labs: lane.labs })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "physicslab-teacher-readiness.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="teacher-readiness-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Phase 5 readiness</p>
          <h2 className="text-2xl font-black">Teacher dashboard and advanced lanes</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-600 dark:text-slate-300">
            One compact overview for planning classes, assigning labs, checking syllabus coverage, and moving advanced learners toward UG, PG, and research tracks.
          </p>
        </div>
        <button className="hero-btn-secondary inline-flex items-center gap-2" type="button" onClick={exportSnapshot}>
          <PhysicsIcon name="download" className="h-4 w-4" />
          Export readiness
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {readiness.map((item) => (
          <ReadinessMetric key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_0.9fr]">
        <div className="teacher-readiness-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="ui-label">Board/pathway coverage</p>
              <h3 className="font-black">Syllabus map health</h3>
            </div>
            <Link className="status-chip status-chip-cyan" to="/syllabus">Open syllabus</Link>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {frameworks.map((framework) => (
              <div key={framework.id} className="teacher-framework-row">
                <span>{framework.label}</span>
                <span className="mini-progress"><span style={{ width: `${Math.round((framework.mappedCount / Math.max(1, framework.mappedCount + framework.gapCount)) * 100)}%` }} /></span>
                <strong>{framework.mappedCount} labs</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="teacher-readiness-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="ui-label">Advanced learning</p>
              <h3 className="font-black">UG to research lanes</h3>
            </div>
            <Link className="status-chip status-chip-cyan" to="/concepts?class=advanced">Open UG+</Link>
          </div>
          <div className="mt-3 grid gap-2">
            {advancedLanes.map((lane) => (
              <Link key={lane.id} className="teacher-advanced-lane" to="/concepts?class=advanced">
                <span>
                  <strong>{lane.label}</strong>
                  <span>{lane.description}</span>
                </span>
                <em>{lane.topics} topics / {lane.labs} labs</em>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link className="hero-btn-secondary inline-flex items-center gap-2" to="/concepts"><PhysicsIcon name="spark" className="h-4 w-4" />Concept library</Link>
        <Link className="hero-btn-secondary inline-flex items-center gap-2" to="/experiments"><PhysicsIcon name="flask" className="h-4 w-4" />Interactive labs</Link>
        <Link className="hero-btn-secondary inline-flex items-center gap-2" to="/quiz"><PhysicsIcon name="check" className="h-4 w-4" />Assessment</Link>
        <Link className="hero-btn-secondary inline-flex items-center gap-2" to="/projects"><PhysicsIcon name="chart" className="h-4 w-4" />Portfolios</Link>
      </div>
    </section>
  );
}

function ReadinessMetric({ label, value, detail, icon, href }: { label: string; value: number; detail: string; icon: PhysicsIconName; href: string }) {
  return (
    <Link className="teacher-readiness-metric" to={href}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
        <PhysicsIcon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="ui-label">{label}</span>
        <strong>{value}</strong>
        <span>{detail}</span>
      </span>
    </Link>
  );
}
