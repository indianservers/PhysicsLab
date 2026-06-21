import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import { physicsModuleGroups, physicsModuleStats } from "../lib/physicsModules";

export function PhysicsModulesPage() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const groups = useMemo(() => {
    if (!search) return physicsModuleGroups;
    return physicsModuleGroups
      .map((group) => ({
        ...group,
        modules: group.modules.filter((module) =>
          [group.title, group.summary, module.title, module.description, ...module.keywords]
            .join(" ")
            .toLowerCase()
            .includes(search),
        ),
      }))
      .filter((group) => group.modules.length > 0);
  }, [search]);

  const shownModules = groups.reduce((sum, group) => sum + group.modules.length, 0);

  return (
    <div className="modules-page min-h-screen">
      <Toolbar />
      <main id="content" className="desktop-page mx-auto max-w-[1600px] px-3 py-4">
        <section className="modules-hero">
          <div>
            <p className="ui-label">Physics module directory</p>
            <h1>All Physics Modules</h1>
            <p>Search every major physics area, then open the formula page, visual concept, lab, graph, solver, or classroom tool directly.</p>
          </div>
          <div className="modules-hero-stats">
            <span><strong>{physicsModuleStats.groups}</strong> domains</span>
            <span><strong>{physicsModuleStats.modules}</strong> launch modules</span>
          </div>
        </section>

        <section className="modules-search-panel">
          <label>
            <span className="ui-label">Search all physics</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try quantum, formulas, optics, entropy, dark matter, circuits..." />
          </label>
          <p>{shownModules} modules shown</p>
        </section>

        <section className="modules-group-stack">
          {groups.map((group) => (
            <details key={group.id} className="modules-group" open>
              <summary>
                <span><PhysicsIcon name={group.icon} />{group.title}</span>
                <small>{group.modules.length} modules</small>
              </summary>
              <p>{group.summary}</p>
              <div className="modules-card-grid">
                {group.modules.map((module) => (
                  <Link key={module.id} className="modules-card" data-accent={module.accent ?? group.accent ?? "science"} to={module.path}>
                    <span className="modules-card-icon"><PhysicsIcon name={module.icon} /></span>
                    <span>
                      <strong>{module.title}</strong>
                      <small>{module.description}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </section>
      </main>
    </div>
  );
}
