import { useEffect, useState } from "react";
import { Toolbar } from "../components/Toolbar";
import { listProjects } from "../lib/storage";
import { ProjectFile } from "../types";

export function SimplePage({ title, showProjects = false }: { title: string; showProjects?: boolean }) {
  const [projects, setProjects] = useState<ProjectFile[]>([]);
  useEffect(() => {
    if (showProjects) listProjects().then(setProjects).catch(() => setProjects([]));
  }, [showProjects]);
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">PhysicsLab 100 module page.</p>
        {showProjects && (
          <div className="mt-6 grid gap-3">
            {projects.length === 0 && <div className="panel p-4">No local projects saved yet.</div>}
            {projects.map((project) => (
              <div key={project.name} className="panel p-4">
                <div className="font-bold">{project.name}</div>
                <div className="text-sm text-slate-500">Updated {new Date(project.updatedAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
