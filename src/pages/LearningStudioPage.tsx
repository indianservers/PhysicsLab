import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import {
  learningStudioProfiles,
  learningStudioStats,
  phase3LessonPacks,
  type LearningStudioProfile,
} from "../lib/learningStudio";

const priorities = ["All", "Concept clarity", "Misconception repair", "Measurement skill", "Transfer practice", "Teacher workflow"];

export function LearningStudioPage() {
  const location = useLocation();
  const lessonFromUrl = new URLSearchParams(location.search).get("lesson");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("All");
  const [selectedId, setSelectedId] = useState(lessonFromUrl ?? learningStudioProfiles[0]?.experimentId ?? "");
  const categories = useMemo(() => ["All", ...Array.from(new Set(learningStudioProfiles.map((item) => item.category))).sort()], []);
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return learningStudioProfiles.filter((profile) => {
      const text = `${profile.title} ${profile.category} ${profile.classLevel} ${profile.priority} ${profile.misconception}`.toLowerCase();
      return (!q || text.includes(q)) && (priority === "All" || profile.priority === priority) && (category === "All" || profile.category === category);
    });
  }, [category, priority, query]);
  const selected = learningStudioProfiles.find((item) => item.experimentId === selectedId) ?? filtered[0] ?? learningStudioProfiles[0];

  return (
    <div className="min-h-screen learning-studio-page">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg learning-hero">
          <div>
            <p className="ui-label">Phase 3 / Ease of learning</p>
            <h1 className="mt-2 text-3xl font-black text-gradient">Learning Studio</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold text-slate-600 dark:text-slate-300">
              A PhET-level learning layer for prediction, misconception repair, measurement evidence, teacher checks, and transfer practice.
            </p>
          </div>
          <div className="learning-readiness-orb">
            <span>{learningStudioStats.averageReadiness}%</span>
            <small>lesson readiness</small>
          </div>
        </section>

        <section className="learning-metric-grid">
          <Metric label="Learning profiles" value={learningStudioStats.profiles} />
          <Metric label="Ready lessons" value={learningStudioStats.readyLessons} />
          <Metric label="Misconception repairs" value={learningStudioStats.misconceptionRepairs} />
          <Metric label="Teacher ready" value={learningStudioStats.teacherReady} />
          <Metric label="Transfer prompts" value={learningStudioStats.transferPrompts} />
          <Metric label="Lesson packs" value={phase3LessonPacks.length} />
        </section>

        <section className="learning-board">
          <div className="learning-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Domain lesson packs</p>
                <h2>Best starting points by category</h2>
              </div>
            </div>
            <div className="lesson-pack-grid">
              {phase3LessonPacks.map((pack) => (
                <article key={pack.category}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong>{pack.category}</strong>
                      <p>{pack.focus}</p>
                    </div>
                    <span className="score-pill score-pill-good">{pack.averageReadiness}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="status-chip">{pack.count} labs</span>
                    {pack.strongest.map((item) => (
                      <button key={item.experimentId} className="status-chip status-chip-cyan" type="button" onClick={() => setSelectedId(item.experimentId)}>
                        {item.title}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="learning-panel learning-principles">
            <p className="ui-label">Phase 3 rules</p>
            <h2>How lessons now behave</h2>
            {[
              "Prediction comes before motion.",
              "One variable changes at a time.",
              "Every result needs measurement evidence.",
              "Misconceptions are repaired with data.",
              "Each lab ends with transfer, not memorization.",
            ].map((item) => (
              <div key={item}><PhysicsIcon name="check" className="h-4 w-4" /><span>{item}</span></div>
            ))}
          </aside>
        </section>

        <section className="learning-board learning-board-wide">
          <div className="learning-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Experiment learning profiles</p>
                <h2>{filtered.length} lessons shown</h2>
              </div>
              <div className="learning-filter-row">
                <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lesson, misconception, class..." />
                <select className="select-field" value={priority} onChange={(event) => setPriority(event.target.value)}>
                  {priorities.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select className="select-field" value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="learning-profile-grid">
              {filtered.map((profile) => (
                <LearningProfileCard key={profile.experimentId} profile={profile} active={selected.experimentId === profile.experimentId} onSelect={() => setSelectedId(profile.experimentId)} />
              ))}
            </div>
          </div>
        </section>

        {selected && (
          <section className="learning-board">
            <div className="learning-panel">
              <div className="quality-section-head">
                <div>
                  <p className="ui-label">Inquiry flow preview</p>
                  <h2>{selected.title}</h2>
                </div>
                <Link className="hero-btn-secondary" to={`/experiments/${selected.experimentId}#guide`}>
                  <PhysicsIcon name="flask" className="h-4 w-4" />
                  Open lab
                </Link>
              </div>
              <div className="learning-flow-timeline">
                {selected.flow.map((step, index) => (
                  <article key={step.stage}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{step.stage}</strong>
                      <p>{step.studentAction}</p>
                      <small>{step.teacherMove}</small>
                      <em>{step.evidence}</em>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="learning-panel learning-selected-panel">
              <p className="ui-label">Misconception repair</p>
              <h2>{selected.priority}</h2>
              <div className="learning-callout">
                <strong>Likely mistake</strong>
                <p>{selected.misconception}</p>
              </div>
              <div className="learning-callout">
                <strong>Repair prompt</strong>
                <p>{selected.repairPrompt}</p>
              </div>
              <div className="learning-checklist">
                <strong>Teacher checks</strong>
                {selected.teacherChecks.map((item) => <div key={item}><PhysicsIcon name="check" className="h-4 w-4" /><span>{item}</span></div>)}
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

function LearningProfileCard({ profile, active, onSelect }: { profile: LearningStudioProfile; active: boolean; onSelect: () => void }) {
  return (
    <article className={active ? "learning-profile-card learning-profile-card-active" : "learning-profile-card"}>
      <button type="button" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-left">
            <p className="ui-label">{profile.category} / {profile.classLevel}</p>
            <strong>{profile.title}</strong>
          </div>
          <span className={profile.readinessScore >= 80 ? "score-pill score-pill-good" : profile.readinessScore >= 68 ? "score-pill score-pill-mid" : "score-pill score-pill-risk"}>{profile.readinessScore}</span>
        </div>
        <div className="quality-score-bar mt-3"><i style={{ width: `${profile.readinessScore}%` }} /></div>
        <p>{profile.lessonQuestion}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="status-chip status-chip-cyan">{profile.priority}</span>
          <span className="status-chip">{profile.difficulty}</span>
        </div>
      </button>
    </article>
  );
}
