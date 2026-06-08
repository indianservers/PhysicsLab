import { Link } from "react-router-dom";
import { experiments } from "../lib/experiments";
import { Toolbar } from "../components/Toolbar";
import { useEffect, useState } from "react";
import { listProjects } from "../lib/storage";
import { ProjectFile } from "../types";
import { classOptions, curriculumCoverageStats } from "../lib/curriculum";
import { iconForCategory, iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";

const labs = ["Mechanics", "Waves", "Optics", "Electricity", "Magnetism", "Thermodynamics", "Fluid Mechanics", "Modern Physics", "Measurement", "Electronics", "Energy"];

export function HomePage() {
  const [recentProjects, setRecentProjects] = useState<ProjectFile[]>([]);
  const stats = curriculumCoverageStats();
  useEffect(() => {
    listProjects().then((projects) => setRecentProjects(projects.slice(0, 3))).catch(() => setRecentProjects([]));
  }, []);
  return (
    <div className="min-h-screen">
      <Toolbar />
      <section id="content" className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="page-hero">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-500">Browser-only STEM lab</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-7xl">PhysicsLab 100</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            A dark-mode virtual physics lab with guided experiments, a Matter.js sandbox, live vectors, measurements, graphs, and browser-local project storage.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="status-chip status-chip-cyan"><PhysicsIcon name="check" className="h-3.5 w-3.5" />Pure browser</span>
            <span className="status-chip"><PhysicsIcon name="book" className="h-3.5 w-3.5" />Class 7-12</span>
            <span className="status-chip"><PhysicsIcon name="wave" className="h-3.5 w-3.5" />Animated</span>
            <span className="status-chip"><PhysicsIcon name="clipboard" className="h-3.5 w-3.5" />Guided</span>
            <span className="status-chip"><PhysicsIcon name="teacher" className="h-3.5 w-3.5" />10-core toolkit</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="hero-btn" to="/sandbox"><PhysicsIcon name="flask" className="h-4 w-4" />Start new simulation</Link>
            <Link className="hero-btn-secondary" to="/experiments/projectile-motion"><PhysicsIcon name="rocket" className="h-4 w-4" />Projectile lab</Link>
            <Link className="hero-btn-secondary" to="/experiments"><PhysicsIcon name="compass" className="h-4 w-4" />Guided experiments</Link>
            <Link className="hero-btn-secondary" to="/solver"><PhysicsIcon name="calculator" className="h-4 w-4" />Solver bank</Link>
            <Link className="hero-btn-secondary" to="/teacher"><PhysicsIcon name="teacher" className="h-4 w-4" />Teacher mode</Link>
            <Link className="hero-btn-secondary" to="/video"><PhysicsIcon name="eye" className="h-4 w-4" />Video analysis</Link>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            <HomeMetric icon="teacher" label="Classes" value={stats.classes} />
            <HomeMetric icon="book" label="Units" value={stats.units} />
            <HomeMetric icon="compass" label="Topics" value={stats.topics} />
          </div>
        </div>
        <div className="panel p-4 shadow-glow">
          <div className="lab-scene grid place-items-center">
            <div className="relative h-52 w-96 max-w-full">
              <div className="absolute left-8 top-32 h-4 w-72 rotate-[-14deg] rounded bg-amber-300" />
              <div className="lab-anim-glow absolute left-12 top-20 h-10 w-10 rounded-full bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,.8)]" />
              <div className="absolute left-16 top-24 h-28 w-64 rounded-[50%] border-t-2 border-dashed border-cyan-300" />
              <div className="absolute bottom-2 left-0 right-0 h-6 rounded bg-slate-600" />
              <div className="floating-badge absolute right-12 top-12">v = 28 m/s</div>
              <div className="floating-badge absolute right-20 top-32 border-rose-300/40 text-rose-100">F = ma</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <StatusPill label="Live graphs" value="On" />
            <StatusPill label="Vectors" value="Ready" />
            <StatusPill label="Storage" value="Local" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <div className="page-hero">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="ui-label">New learning layer</p>
              <h2 className="mt-1 text-2xl font-black">Every experiment now has a 10-core learning toolkit</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                Prerequisites, concept map, derivation, unit check, misconception repair, real-world link, safety habit, prediction prompt, quick quiz, and mastery rubric.
              </p>
            </div>
            <Link className="hero-btn-secondary" to="/experiments/human-eye-defects">
              <PhysicsIcon name="eye" className="h-4 w-4" />Try a toolkit lab
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Link className="enhanced-card" to="/solver">
            <span className="card-icon"><PhysicsIcon name="calculator" /></span>
            <h2 className="mt-3 text-xl font-black">Solver Module</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">15 physics categories, subcategories, medium/hard practice, concept tags, and answer reveal.</p>
          </Link>
          <Link className="enhanced-card" to="/experiments">
            <span className="card-icon"><PhysicsIcon name="flask" /></span>
            <h2 className="mt-3 text-xl font-black">Experiment Library</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Interactive visual labs mapped to Class 7-12 syllabus topics.</p>
          </Link>
          <Link className="enhanced-card" to="/topics">
            <span className="card-icon"><PhysicsIcon name="book" /></span>
            <h2 className="mt-3 text-xl font-black">Syllabus Map</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Browse learning paths by domain, class, tools, and mapped labs.</p>
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <h2 className="mb-4 text-2xl font-bold">Classes 7-12</h2>
        <div className="grid gap-3 md:grid-cols-6">
          {classOptions.map((klass) => (
            <Link className="home-card flex flex-col items-center justify-center gap-2 text-center" key={klass.id} to={`/experiments?class=${klass.id}`}>
              <PhysicsIcon name="book" className="h-4 w-4 text-cyan-500" />
              <span>{klass.label}</span>
              <span className="mini-progress w-full"><span style={{ width: `${Math.min(100, 40 + klass.grade * 5)}%` }} /></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <h2 className="mb-4 text-2xl font-bold">Labs</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {labs.map((lab) => {
            const count = experiments.filter((experiment) => experiment.curriculumTags?.domains.includes(lab) || experiment.category === lab).length;
            return (
            <Link className="home-card flex items-center justify-between gap-3" key={lab} to={`/topics/${lab.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              <span className="flex items-center gap-3">
              <PhysicsIcon name={iconForCategory(lab)} className="h-5 w-5 text-cyan-500" />
              {lab} lab
              </span>
              <span className="status-chip status-chip-cyan">{count}</span>
            </Link>
          );})}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Featured Experiments</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {experiments.slice(0, 12).map((experiment) => (
                <Link className="home-card flex items-center gap-3" key={experiment.id} to={`/experiments/${experiment.id}`}>
                  <PhysicsIcon name={iconForExperiment(experiment)} className="h-5 w-5 shrink-0 text-cyan-500" />
                  <span className="min-w-0">
                    <span className="block truncate">{experiment.title}</span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{experiment.classLevel}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">Recent Projects</h2>
            <div className="grid gap-3">
              {recentProjects.length === 0 && <Link className="home-card" to="/projects">No saved projects yet</Link>}
              {recentProjects.map((project) => <Link className="home-card" key={project.name} to="/projects">{project.name}</Link>)}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">Teacher Tools</h2>
            <div className="grid gap-3">
              <ToolLink icon="teacher" to="/teacher" label="Create assignment" />
              <ToolLink icon="gauge" to="/teacher" label="Lock variables" />
              <ToolLink icon="clipboard" to="/teacher" label="Export assignment pack" />
              <ToolLink icon="chart" to="/projects" label="Review portfolios" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Pure browser mode: projects, assignments, quiz progress, and learning records stay on this device unless exported or shared by link/file.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link className="tool-btn" to="/privacy">Privacy</Link>
            <Link className="tool-btn" to="/terms">Terms</Link>
            <Link className="tool-btn" to="/help">Help</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-300/70 bg-slate-100 p-2 dark:border-lab-line dark:bg-slate-900/70">
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 font-mono text-cyan-500">{value}</div>
    </div>
  );
}

function HomeMetric({ icon, label, value }: { icon: PhysicsIconName; label: string; value: number }) {
  return (
    <div className="metric-card">
      <PhysicsIcon name={icon} className="h-5 w-5 text-cyan-500" />
      <div className="mt-2 ui-label">{label}</div>
      <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
    </div>
  );
}

function ToolLink({ icon, to, label }: { icon: PhysicsIconName; to: string; label: string }) {
  return (
    <Link className="home-card flex items-center gap-3" to={to}>
      <PhysicsIcon name={icon} className="h-5 w-5 text-cyan-500" />
      {label}
    </Link>
  );
}
