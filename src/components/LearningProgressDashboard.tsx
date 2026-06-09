import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { experiments } from "../lib/experiments";
import { listLearningRecords, progressPercent } from "../lib/learning";
import { listProjects } from "../lib/storage";
import { PhysicsIcon, iconForExperiment } from "../lib/icons";
import { ProjectFile } from "../types";

type WeakConceptMap = Record<string, number>;

const weakConceptKey = "physicslab-quiz-weak-concepts-v1";

export function LearningProgressDashboard({ compact = false }: { compact?: boolean }) {
  const [projects, setProjects] = useState<ProjectFile[]>([]);
  const records = useMemo(() => listLearningRecords(), []);
  const weakConcepts = useMemo(() => readWeakConcepts(), []);
  const recentRecord = records[0];
  const recentExperiment = recentRecord ? experiments.find((experiment) => experiment.id === recentRecord.experimentId) : undefined;
  const topWeak = weakConcepts[0];
  const mastered = records.filter((record) => record.currentStage === "mastered" || progressPercent(record) >= 100).length;
  const averageProgress = records.length ? Math.round(records.reduce((sum, record) => sum + progressPercent(record), 0) / records.length) : 0;

  useEffect(() => {
    listProjects().then((items) => setProjects(items.slice(0, 2))).catch(() => setProjects([]));
  }, []);

  return (
    <section className={compact ? "learning-progress-dashboard learning-progress-dashboard-compact" : "learning-progress-dashboard"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Phase 6 progress</p>
          <h2 className="text-2xl font-black">Continue learning</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Resume the next useful action from labs, quiz remediation, portfolio, or saved projects.
          </p>
        </div>
        <Link className="status-chip status-chip-cyan" to="/projects">
          <PhysicsIcon name="chart" className="h-3.5 w-3.5" />
          Portfolio
        </Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ProgressTile icon="clipboard" label="Records" value={records.length} detail={`${mastered} mastered`} to="/projects" />
        <ProgressTile icon="gauge" label="Average" value={averageProgress} detail="Portfolio progress" to="/projects" suffix="%" />
        <ProgressTile icon="spark" label="Weak Tags" value={weakConcepts.length} detail={topWeak?.tag ?? "None yet"} to={topWeak ? `/quiz?focus=${encodeURIComponent(topWeak.tag)}` : "/quiz"} />
        <ProgressTile icon="folder" label="Projects" value={projects.length} detail="Recent saved work" to="/projects" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="progress-next-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="ui-label">Next lab</p>
              <h3 className="text-lg font-black">{recentExperiment?.title ?? "Start a guided experiment"}</h3>
            </div>
            {recentExperiment && <PhysicsIcon name={iconForExperiment(recentExperiment)} className="h-6 w-6 text-cyan-500" />}
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {recentRecord ? `Current stage: ${recentRecord.currentStage}. Progress ${progressPercent(recentRecord)}%.` : "Pick one lab and complete concept, prediction, experiment, notebook, and quiz."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link className="hero-btn-secondary inline-flex items-center gap-2" to={recentExperiment ? `/experiments/${recentExperiment.id}` : "/experiments"}>
              <PhysicsIcon name="flask" className="h-4 w-4" />
              {recentExperiment ? "Resume lab" : "Choose lab"}
            </Link>
            <Link className="hero-btn-secondary inline-flex items-center gap-2" to="/concepts">
              <PhysicsIcon name="spark" className="h-4 w-4" />
              Concepts
            </Link>
          </div>
        </div>

        <div className="progress-next-card">
          <div>
            <p className="ui-label">Remediation</p>
            <h3 className="text-lg font-black">{topWeak ? topWeak.tag : "No weak concept tracked"}</h3>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {topWeak ? `Priority score ${topWeak.score}. Review, solve, and retake a focused quiz.` : "Quiz mistakes will create a recovery path here."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link className="hero-btn-secondary inline-flex items-center gap-2" to={topWeak ? `/quiz?focus=${encodeURIComponent(topWeak.tag)}` : "/quiz"}>
              <PhysicsIcon name="check" className="h-4 w-4" />
              Focus quiz
            </Link>
            <Link className="hero-btn-secondary inline-flex items-center gap-2" to={topWeak ? `/solver?tag=${encodeURIComponent(topWeak.tag)}` : "/solver"}>
              <PhysicsIcon name="calculator" className="h-4 w-4" />
              Solver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressTile({ icon, label, value, suffix = "", detail, to }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; value: number; suffix?: string; detail: string; to: string }) {
  return (
    <Link className="progress-tile" to={to}>
      <PhysicsIcon name={icon} className="h-5 w-5 text-cyan-500" />
      <span>
        <span className="ui-label">{label}</span>
        <strong>{value}{suffix}</strong>
        <em>{detail}</em>
      </span>
    </Link>
  );
}

function readWeakConcepts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(weakConceptKey) ?? "{}") as WeakConceptMap;
    return Object.entries(parsed)
      .filter(([, score]) => Number.isFinite(score) && score > 0)
      .map(([tag, score]) => ({ tag, score }))
      .sort((left, right) => right.score - left.score || left.tag.localeCompare(right.tag));
  } catch {
    return [];
  }
}
