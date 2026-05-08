import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { experiments } from "../lib/experiments";

export function ExperimentsPage() {
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="text-3xl font-bold">Guided Experiments</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Starter library with 10 mechanics labs and metadata ready for the 100-experiment expansion.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {experiments.map((experiment) => (
            <Link key={experiment.id} to={`/experiments/${experiment.id}`} className="panel p-4 transition hover:border-cyan-400">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{experiment.title}</h2>
                <span className="badge">{experiment.difficulty}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{experiment.aim}</p>
              <div className="mt-3 text-xs text-cyan-500">{experiment.category} · {experiment.classLevel}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
