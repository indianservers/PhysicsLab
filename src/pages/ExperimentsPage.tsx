import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { experiments } from "../lib/experiments";
import { allCurriculumTopics, classOptions } from "../lib/curriculum";
import { iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";

export function ExperimentsPage() {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const topics = useMemo(() => allCurriculumTopics(), []);
  const categories = useMemo(() => ["all", ...Array.from(new Set(experiments.map((experiment) => experiment.category))).sort()], []);
  const filtered = experiments.filter((experiment) => {
    const classMatch = selectedClass === "all" || experiment.curriculumTags?.classes.includes(Number(selectedClass.replace("class-", "")));
    const categoryMatch = selectedCategory === "all" || experiment.category === selectedCategory;
    return classMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ui-label">Interactive guided learning</p>
            <h1 className="mt-2 text-3xl font-black">Guided Experiments</h1>
            <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">
              Browser-only experiment library mapped to Class 7-12 topics. Phase 1 makes the library searchable by syllabus; later phases fill every gap with interactive labs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="tool-btn" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              <option value="all">All classes</option>
              {classOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <select className="tool-btn" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
              {categories.map((category) => <option key={category} value={category}>{category === "all" ? "All categories" : category}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Metric icon="flask" label="Shown labs" value={filtered.length} />
          <Metric icon="clipboard" label="Tagged labs" value={experiments.filter((item) => item.curriculumTags).length} />
          <Metric icon="book" label="Mapped topics" value={topics.filter((topic) => topic.experimentIds.length > 0).length} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((experiment) => {
            const mappedTopics = topics.filter((topic) => experiment.curriculumTags?.topicIds.includes(topic.id));
            return (
              <Link key={experiment.id} to={`/experiments/${experiment.id}`} className="panel p-4 transition hover:border-cyan-400">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-cyan-400/40 bg-cyan-400/10 text-cyan-500">
                      <PhysicsIcon name={iconForExperiment(experiment)} />
                    </span>
                    <h2 className="text-lg font-black">{experiment.title}</h2>
                  </div>
                  <span className="badge shrink-0">{experiment.difficulty}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{experiment.aim}</p>
                <div className="mt-3 text-xs font-semibold text-cyan-500">{experiment.category} | {experiment.classLevel}</div>
                {experiment.curriculumTags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {experiment.curriculumTags.classes.map((grade) => <span key={grade} className="rounded-full bg-cyan-400/10 px-2 py-1 text-xs font-bold text-cyan-500">Class {grade}</span>)}
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
      </div>
    </div>
  );
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
