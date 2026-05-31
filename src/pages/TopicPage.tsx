import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { experiments } from "../lib/experiments";
import { curriculum, curriculumCoverageStats, findTopicsByDomainSlug } from "../lib/curriculum";
import { iconForExperiment, iconForTool, PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { GuidePanel } from "../components/GuidePanel";
import { guideForTool } from "../lib/guides";

export function TopicPage({ topic }: { topic: string }) {
  const title = topic.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  const matchingTopics = findTopicsByDomainSlug(topic);
  const stats = curriculumCoverageStats();
  const experimentById = new Map(experiments.map((experiment) => [experiment.id, experiment]));
  const classGroups = curriculum.map((klass) => ({
    ...klass,
    topics: matchingTopics.filter((item) => item.classId === klass.id),
  })).filter((klass) => klass.topics.length > 0);
  const labCount = new Set(matchingTopics.flatMap((item) => item.experimentIds)).size;

  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="mx-auto max-w-7xl px-5 py-8">
        <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="ui-label">Syllabus learning path</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
              Topic-wise Class 7-12 map with learning outcomes, browser-based tools, guided labs, and assessment hooks ready for expansion.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/sandbox" className="hero-btn">Open sandbox</Link>
              <Link to="/experiments" className="hero-btn-secondary">Guided experiments</Link>
              <Link to="/graphs" className="hero-btn-secondary">Graphs and data</Link>
            </div>
          </div>
          <div className="panel p-4">
            <h2 className="panel-title">Phase 1 Coverage</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric icon="teacher" label="Classes" value={stats.classes} />
              <Metric icon="book" label="Units" value={stats.units} />
              <Metric icon="compass" label="Topics" value={stats.topics} />
              <Metric icon="flask" label="Mapped Labs" value={labCount} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="panel h-fit p-4">
            <h2 className="panel-title">Classes</h2>
            <div className="mt-3 grid gap-2">
              {curriculum.map((klass) => {
                const count = matchingTopics.filter((item) => item.classId === klass.id).length;
                return (
                  <a key={klass.id} href={`#${klass.id}`} className="pill flex items-center justify-between text-left">
                    <span>{klass.label}</span>
                    <span className="badge">{count}</span>
                  </a>
                );
              })}
            </div>
            <div className="mt-5 rounded-md border border-slate-300/60 p-3 text-xs text-slate-600 dark:border-lab-line dark:text-slate-300">
              Every topic follows the same browser-only flow: concept, visualization, experiment, notebook, quiz.
            </div>
          </aside>

          <div className="grid gap-5">
            {classGroups.length === 0 && (
              <div className="panel p-5">
                <h2 className="panel-title">No mapped topics yet</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  This topic route exists, but Phase 1 has not mapped syllabus topics to it yet.
                </p>
              </div>
            )}

            {classGroups.map((klass) => (
              <section key={klass.id} id={klass.id} className="panel p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="ui-label">{klass.source}</p>
                    <h2 className="mt-1 text-2xl font-black">{klass.label}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{klass.description}</p>
                  </div>
                  <span className="badge">{klass.topics.length} topics</span>
                </div>

                <div className="mt-5 grid gap-3 xl:grid-cols-2">
                  {klass.topics.map((item) => {
                    const mappedExperiments = item.experimentIds.map((id) => experimentById.get(id)).filter(Boolean);
                    return (
                      <article key={item.id} className="rounded-lg border border-slate-300/70 bg-slate-50 p-4 dark:border-lab-line dark:bg-slate-900/70">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-cyan-500">{item.unitTitle}</div>
                            <h3 className="mt-1 text-lg font-black">{item.title}</h3>
                          </div>
                          <span className="badge">{item.stage}</span>
                        </div>
                        <ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                          {item.outcomes.slice(0, 2).map((outcome) => <li key={outcome}>{outcome}</li>)}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tools.slice(0, 4).map((tool) => (
                            <span key={tool} className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              <PhysicsIcon name={iconForTool(tool)} className="h-3.5 w-3.5" />
                              {tool}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 grid gap-2">
                          {item.tools.slice(0, 2).map((tool) => <GuidePanel key={tool} guide={guideForTool(tool)} compact />)}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {mappedExperiments.map((experiment) => experiment && (
                            <Link key={experiment.id} to={`/experiments/${experiment.id}`} className="tool-btn-primary inline-flex items-center gap-2">
                              <PhysicsIcon name={iconForExperiment(experiment)} className="h-4 w-4" />
                              {experiment.title}
                            </Link>
                          ))}
                          <Link to="/lab" className="tool-btn inline-flex items-center gap-2"><PhysicsIcon name="flask" className="h-4 w-4" />Build in lab</Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: PhysicsIconName; label: string; value: number }) {
  return (
    <div className="metric-card">
      <div className="flex items-center gap-2">
        <PhysicsIcon name={icon} className="h-4 w-4 text-cyan-500" />
        <div className="ui-label">{label}</div>
      </div>
      <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
    </div>
  );
}
