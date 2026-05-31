import { Link } from "react-router-dom";
import { experiments } from "../lib/experiments";
import { Toolbar } from "../components/Toolbar";
import { useEffect, useState } from "react";
import { listProjects } from "../lib/storage";
import { ProjectFile } from "../types";
import { classOptions, curriculumCoverageStats } from "../lib/curriculum";
import { iconForCategory, iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";

const labs = ["Mechanics", "Waves", "Optics", "Electricity", "Magnetism", "Thermodynamics", "Fluid Mechanics", "Modern Physics", "Measurement", "Electronics"];

export function HomePage() {
  const [recentProjects, setRecentProjects] = useState<ProjectFile[]>([]);
  const stats = curriculumCoverageStats();
  useEffect(() => {
    listProjects().then((projects) => setRecentProjects(projects.slice(0, 3))).catch(() => setRecentProjects([]));
  }, []);
  return (
    <div className="min-h-screen">
      <Toolbar />
      <section id="content" className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-500">Browser-only STEM lab</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-7xl">PhysicsLab 100</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            A dark-mode virtual physics lab with guided experiments, a Matter.js sandbox, live vectors, measurements, graphs, and browser-local project storage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="hero-btn" to="/sandbox">Start new simulation</Link>
            <Link className="hero-btn-secondary" to="/experiments/projectile-motion">Open projectile lab</Link>
            <Link className="hero-btn-secondary" to="/experiments">Guided experiments</Link>
            <Link className="hero-btn-secondary" to="/teacher">Teacher mode</Link>
            <Link className="hero-btn-secondary" to="/video">Video Analysis</Link>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            <HomeMetric icon="teacher" label="Classes" value={stats.classes} />
            <HomeMetric icon="book" label="Units" value={stats.units} />
            <HomeMetric icon="compass" label="Topics" value={stats.topics} />
          </div>
        </div>
        <div className="panel p-4 shadow-glow">
          <div className="grid h-80 place-items-center rounded bg-slate-950 bg-[linear-gradient(rgba(34,211,238,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.12)_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="relative h-52 w-96 max-w-full">
              <div className="absolute left-8 top-32 h-4 w-72 rotate-[-14deg] rounded bg-amber-300" />
              <div className="absolute left-12 top-20 h-10 w-10 rounded-full bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,.8)]" />
              <div className="absolute left-16 top-24 h-28 w-64 rounded-[50%] border-t-2 border-dashed border-cyan-300" />
              <div className="absolute bottom-2 left-0 right-0 h-6 rounded bg-slate-600" />
              <div className="absolute right-12 top-12 text-sm text-cyan-200">v = 28 m/s</div>
              <div className="absolute right-20 top-32 text-sm text-rose-200">F = ma</div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <h2 className="mb-4 text-2xl font-bold">Classes 7-12</h2>
        <div className="grid gap-3 md:grid-cols-6">
          {classOptions.map((klass) => (
            <Link className="home-card flex items-center justify-center gap-2 text-center" key={klass.id} to="/experiments">
              <PhysicsIcon name="book" className="h-4 w-4 text-cyan-500" />
              {klass.label}
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <h2 className="mb-4 text-2xl font-bold">Labs</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {labs.map((lab) => (
            <Link className="home-card flex items-center gap-3" key={lab} to={`/topics/${lab.toLowerCase().replace(" ", "-")}`}>
              <PhysicsIcon name={iconForCategory(lab)} className="h-5 w-5 text-cyan-500" />
              {lab} lab
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Featured Experiments</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {experiments.slice(0, 10).map((experiment) => (
                <Link className="home-card flex items-center gap-3" key={experiment.id} to={`/experiments/${experiment.id}`}>
                  <PhysicsIcon name={iconForExperiment(experiment)} className="h-5 w-5 shrink-0 text-cyan-500" />
                  {experiment.title}
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
