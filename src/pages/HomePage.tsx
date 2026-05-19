import { Link } from "react-router-dom";
import { experiments } from "../lib/experiments";
import { Toolbar } from "../components/Toolbar";
import { useEffect, useState } from "react";
import { listProjects } from "../lib/storage";
import { ProjectFile } from "../types";

const labs = ["Mechanics", "Waves", "Optics", "Electricity", "Magnetism", "Thermodynamics", "Fluid Mechanics", "Modern Physics"];

export function HomePage() {
  const [recentProjects, setRecentProjects] = useState<ProjectFile[]>([]);
  useEffect(() => {
    listProjects().then((projects) => setRecentProjects(projects.slice(0, 3))).catch(() => setRecentProjects([]));
  }, []);
  return (
    <div className="min-h-screen">
      <Toolbar />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr]">
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
        <h2 className="mb-4 text-2xl font-bold">Labs</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {labs.map((lab) => (
            <Link className="home-card" key={lab} to={`/topics/${lab.toLowerCase().replace(" ", "-")}`}>{lab} lab</Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Featured Experiments</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {experiments.slice(0, 10).map((experiment) => (
                <Link className="home-card" key={experiment.id} to={`/experiments/${experiment.id}`}>{experiment.title}</Link>
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
              {["Create assignment", "Lock variables", "Question bank", "Export package"].map((tool) => (
                <Link className="home-card" key={tool} to="/settings">{tool}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
