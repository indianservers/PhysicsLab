import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import {
  classroomDeploymentGaps,
  classroomDeploymentProfiles,
  classroomDeploymentStats,
  classroomPackPlans,
  type ClassroomDeploymentProfile,
} from "../lib/classroomDeployment";

const tiers = ["All", "Ready to assign", "Guided teacher review", "Needs classroom pass", "Do not assign yet"];

export function ClassroomDeploymentPage() {
  const location = useLocation();
  const selectedFromUrl = new URLSearchParams(location.search).get("assignment");
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("All");
  const [selectedId, setSelectedId] = useState(selectedFromUrl ?? classroomDeploymentProfiles[0]?.experimentId ?? "");
  const categories = useMemo(() => ["All", ...Array.from(new Set(classroomDeploymentProfiles.map((item) => item.category))).sort()], []);
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classroomDeploymentProfiles.filter((profile) => {
      const text = `${profile.title} ${profile.category} ${profile.classLevel} ${profile.tier} ${profile.rolloutRisk}`.toLowerCase();
      return (!q || text.includes(q)) && (tier === "All" || profile.tier === tier) && (category === "All" || profile.category === category);
    });
  }, [category, query, tier]);
  const selected = classroomDeploymentProfiles.find((item) => item.experimentId === selectedId) ?? filtered[0] ?? classroomDeploymentProfiles[0];

  return (
    <div className="min-h-screen classroom-deployment-page">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg classroom-hero">
          <div>
            <p className="ui-label">Phase 5 / Classroom deployment</p>
            <h1 className="mt-2 text-3xl font-black text-gradient">Classroom Deployment Center</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold text-slate-600 dark:text-slate-300">
              Teacher-ready rollout planning for assignments, evidence, rubrics, class packs, snapshots, and browser-local student submissions.
            </p>
          </div>
          <div className="classroom-score-orb">
            <span>{classroomDeploymentStats.averageDeployment}%</span>
            <small>deployment ready</small>
          </div>
        </section>

        <section className="classroom-metric-grid">
          <Metric label="Profiles" value={classroomDeploymentStats.profiles} />
          <Metric label="Ready" value={classroomDeploymentStats.readyToAssign} />
          <Metric label="Teacher review" value={classroomDeploymentStats.reviewRequired} />
          <Metric label="Needs pass" value={classroomDeploymentStats.needsPass} />
          <Metric label="Blocked" value={classroomDeploymentStats.blocked} />
          <Metric label="Evidence types" value={classroomDeploymentStats.evidenceItems} />
        </section>

        <section className="classroom-board">
          <div className="classroom-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Class pack plans</p>
                <h2>Domain packs ready for teachers</h2>
              </div>
              <Link className="hero-btn-secondary" to="/teacher">
                <PhysicsIcon name="teacher" className="h-4 w-4" />
                Teacher mode
              </Link>
            </div>
            <div className="class-pack-grid">
              {classroomPackPlans.map((pack) => (
                <article key={pack.category}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong>{pack.category}</strong>
                      <p>{pack.focus}</p>
                    </div>
                    <span className="score-pill score-pill-good">{pack.averageDeployment}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="status-chip">{pack.count} labs</span>
                    <span className="status-chip status-chip-cyan">{pack.ready} ready</span>
                    <span className="status-chip">{pack.review} review</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pack.starters.map((item) => (
                      <button key={item.experimentId} className="status-chip status-chip-cyan" type="button" onClick={() => setSelectedId(item.experimentId)}>
                        {item.title}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="classroom-panel classroom-evidence-panel">
            <p className="ui-label">Evidence coverage</p>
            <h2>What students must submit</h2>
            {classroomDeploymentGaps.map((gap) => (
              <div key={gap.requirement}>
                <div className="flex items-center justify-between gap-3">
                  <strong>{gap.requirement}</strong>
                  <span>{gap.ready}/{classroomDeploymentStats.profiles}</span>
                </div>
                <div className="quality-score-bar mt-2"><i style={{ width: `${Math.max(4, (gap.ready / classroomDeploymentStats.profiles) * 100)}%` }} /></div>
              </div>
            ))}
          </aside>
        </section>

        <section className="classroom-board classroom-board-wide">
          <div className="classroom-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Assignment readiness</p>
                <h2>{filtered.length} activities shown</h2>
              </div>
              <div className="classroom-filter-row">
                <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assignment, class, risk..." />
                <select className="select-field" value={tier} onChange={(event) => setTier(event.target.value)}>
                  {tiers.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select className="select-field" value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="classroom-profile-grid">
              {filtered.map((profile) => (
                <ClassroomProfileCard key={profile.experimentId} profile={profile} active={selected.experimentId === profile.experimentId} onSelect={() => setSelectedId(profile.experimentId)} />
              ))}
            </div>
          </div>
        </section>

        {selected && (
          <section className="classroom-board">
            <div className="classroom-panel">
              <div className="quality-section-head">
                <div>
                  <p className="ui-label">Deployment recipe</p>
                  <h2>{selected.title}</h2>
                </div>
                <Link className="hero-btn-secondary" to={`/experiments/${selected.experimentId}`}>
                  <PhysicsIcon name="flask" className="h-4 w-4" />
                  Open lab
                </Link>
              </div>
              <div className="deployment-recipe-grid">
                <RecipeCard icon="teacher" title="Teacher setup" text={selected.teacherSetup} />
                <RecipeCard icon="clipboard" title="Student submission" text={selected.studentSubmission} />
                <RecipeCard icon="check" title="Rollout risk" text={selected.rolloutRisk} />
                <RecipeCard icon="spark" title="Next action" text={selected.nextDeploymentAction} />
              </div>
            </div>

            <aside className="classroom-panel classroom-selected-panel">
              <p className="ui-label">Assignment defaults</p>
              <h2>{selected.tier}</h2>
              <div className="classroom-default-list">
                <div><span>Lock variables</span><strong>{selected.assignmentDefaults.lockVariables ? "Yes" : "No"}</strong></div>
                <div><span>Notebook</span><strong>{selected.assignmentDefaults.requireNotebook ? "Required" : "Optional"}</strong></div>
                <div><span>Quiz</span><strong>{selected.assignmentDefaults.requireQuiz ? "Required" : "Optional"}</strong></div>
                <div><span>Time</span><strong>{selected.assignmentDefaults.suggestedMinutes} min</strong></div>
              </div>
              <div className="classroom-rubric-list">
                <strong>Review rubric</strong>
                {selected.reviewRubric.map((item) => <div key={item}><PhysicsIcon name="check" className="h-4 w-4" /><span>{item}</span></div>)}
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric-card">
      <p className="ui-label">{label}</p>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}

function ClassroomProfileCard({ profile, active, onSelect }: { profile: ClassroomDeploymentProfile; active: boolean; onSelect: () => void }) {
  return (
    <article className={active ? "classroom-profile-card classroom-profile-card-active" : "classroom-profile-card"}>
      <button type="button" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-left">
            <p className="ui-label">{profile.category} / {profile.classLevel}</p>
            <strong>{profile.title}</strong>
          </div>
          <span className={profile.deploymentScore >= 82 ? "score-pill score-pill-good" : profile.deploymentScore >= 68 ? "score-pill score-pill-mid" : "score-pill score-pill-risk"}>{profile.deploymentScore}</span>
        </div>
        <div className="quality-score-bar mt-3"><i style={{ width: `${profile.deploymentScore}%` }} /></div>
        <p>{profile.rolloutRisk}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="status-chip status-chip-cyan">{profile.tier}</span>
          <span className="status-chip">{profile.evidenceRequirements.length} evidence</span>
        </div>
      </button>
    </article>
  );
}

function RecipeCard({ icon, title, text }: { icon: "teacher" | "clipboard" | "check" | "spark"; title: string; text: string }) {
  return (
    <article>
      <PhysicsIcon name={icon} className="h-4 w-4" />
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}
