import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";
import { useLabStore } from "../store/useLabStore";
import {
  accessibilityNeedGaps,
  accessibilityProfiles,
  accessibilityStats,
  type AccessibilityProfile,
} from "../lib/accessibilityAudit";

const tiers = ["All", "Inclusive ready", "Supported with notes", "Needs accessibility pass", "High barrier"];

export function AccessibilityCenterPage() {
  const location = useLocation();
  const selectedFromUrl = new URLSearchParams(location.search).get("experiment");
  const { accessibility, setAccessibility } = useLabStore();
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("All");
  const [selectedId, setSelectedId] = useState(selectedFromUrl ?? accessibilityProfiles[0]?.experimentId ?? "");
  const categories = useMemo(() => ["All", ...Array.from(new Set(accessibilityProfiles.map((item) => item.category))).sort()], []);
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accessibilityProfiles.filter((profile) => {
      const text = `${profile.title} ${profile.category} ${profile.classLevel} ${profile.tier} ${profile.inclusiveSummary}`.toLowerCase();
      return (!q || text.includes(q)) && (tier === "All" || profile.tier === tier) && (category === "All" || profile.category === category);
    });
  }, [category, query, tier]);
  const selected = accessibilityProfiles.find((item) => item.experimentId === selectedId) ?? filtered[0] ?? accessibilityProfiles[0];

  return (
    <div className="min-h-screen accessibility-center-page">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg accessibility-hero">
          <div>
            <p className="ui-label">Phase 6 / Accessibility and inclusive UX</p>
            <h1 className="mt-2 text-3xl font-black text-gradient">Accessibility Center</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold text-slate-600 dark:text-slate-300">
              Inclusive simulation readiness for keyboard flow, text state, non-color cues, reduced motion, large targets, screen-reader labels, and unit clarity.
            </p>
          </div>
          <div className="accessibility-score-orb">
            <span>{accessibilityStats.averageAccessibility}%</span>
            <small>inclusive ready</small>
          </div>
        </section>

        <section className="accessibility-metric-grid">
          <Metric label="Profiles" value={accessibilityStats.profiles} />
          <Metric label="Inclusive" value={accessibilityStats.inclusiveReady} />
          <Metric label="Supported" value={accessibilityStats.supportedWithNotes} />
          <Metric label="Needs pass" value={accessibilityStats.needsPass} />
          <Metric label="High barrier" value={accessibilityStats.highBarrier} />
          <Metric label="Needs tracked" value={accessibilityStats.needsTracked} />
        </section>

        <section className="accessibility-board">
          <div className="accessibility-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Global accessibility switches</p>
                <h2>Current browser preferences</h2>
              </div>
              <Link className="hero-btn-secondary" to="/settings">
                <PhysicsIcon name="settings" className="h-4 w-4" />
                Settings
              </Link>
            </div>
            <div className="accessibility-toggle-grid">
              {[
                ["highContrast", "High contrast"],
                ["largeUi", "Large UI"],
                ["colorBlindSafe", "Color-blind safe"],
                ["reducedMotion", "Reduced motion"],
              ].map(([key, label]) => (
                <label key={key}>
                  <span>{label}</span>
                  <input type="checkbox" checked={Boolean(accessibility[key as keyof typeof accessibility])} onChange={(event) => setAccessibility({ [key]: event.target.checked })} />
                </label>
              ))}
            </div>
          </div>

          <aside className="accessibility-panel accessibility-need-panel">
            <p className="ui-label">Need coverage</p>
            <h2>What must be perceivable</h2>
            {accessibilityNeedGaps.map((gap) => (
              <div key={gap.need}>
                <div className="flex items-center justify-between gap-3">
                  <strong>{gap.need}</strong>
                  <span>{gap.ready}/{accessibilityStats.profiles}</span>
                </div>
                <div className="quality-score-bar mt-2"><i style={{ width: `${Math.max(4, (gap.ready / accessibilityStats.profiles) * 100)}%` }} /></div>
              </div>
            ))}
          </aside>
        </section>

        <section className="accessibility-board accessibility-board-wide">
          <div className="accessibility-panel">
            <div className="quality-section-head">
              <div>
                <p className="ui-label">Experiment accessibility profiles</p>
                <h2>{filtered.length} experiments shown</h2>
              </div>
              <div className="accessibility-filter-row">
                <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search experiment, barrier, category..." />
                <select className="select-field" value={tier} onChange={(event) => setTier(event.target.value)}>
                  {tiers.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select className="select-field" value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="accessibility-profile-grid">
              {filtered.map((profile) => (
                <AccessibilityProfileCard key={profile.experimentId} profile={profile} active={selected.experimentId === profile.experimentId} onSelect={() => setSelectedId(profile.experimentId)} />
              ))}
            </div>
          </div>
        </section>

        {selected && (
          <section className="accessibility-board">
            <div className="accessibility-panel">
              <div className="quality-section-head">
                <div>
                  <p className="ui-label">Inclusive repair plan</p>
                  <h2>{selected.title}</h2>
                </div>
                <Link className="hero-btn-secondary" to={`/experiments/${selected.experimentId}`}>
                  <PhysicsIcon name="flask" className="h-4 w-4" />
                  Open lab
                </Link>
              </div>
              <div className="accessibility-repair-grid">
                <RepairCard icon="keyboard" title="Keyboard path" text={selected.keyboardAction} />
                <RepairCard icon="clipboard" title="Text state" text={selected.textStateAction} />
                <RepairCard icon="eye" title="Non-color cues" text={selected.contrastAction} />
                <RepairCard icon="play" title="Reduced motion" text={selected.reducedMotionAction} />
                <RepairCard icon="check" title="Assessment" text={selected.assessmentAction} />
              </div>
            </div>

            <aside className="accessibility-panel accessibility-selected-panel">
              <p className="ui-label">Need checklist</p>
              <h2>{selected.tier}</h2>
              <div className="accessibility-supported-list">
                {selected.supportedNeeds.map((need) => <div key={need}><PhysicsIcon name="check" className="h-4 w-4" /><span>{need}</span></div>)}
              </div>
              {selected.missingNeeds.length > 0 && (
                <div className="accessibility-missing-list">
                  <strong>Missing next</strong>
                  {selected.missingNeeds.map((need) => <span key={need}>{need}</span>)}
                </div>
              )}
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

function AccessibilityProfileCard({ profile, active, onSelect }: { profile: AccessibilityProfile; active: boolean; onSelect: () => void }) {
  return (
    <article className={active ? "accessibility-profile-card accessibility-profile-card-active" : "accessibility-profile-card"}>
      <button type="button" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-left">
            <p className="ui-label">{profile.category} / {profile.classLevel}</p>
            <strong>{profile.title}</strong>
          </div>
          <span className={profile.accessibilityScore >= 82 ? "score-pill score-pill-good" : profile.accessibilityScore >= 68 ? "score-pill score-pill-mid" : "score-pill score-pill-risk"}>{profile.accessibilityScore}</span>
        </div>
        <div className="quality-score-bar mt-3"><i style={{ width: `${profile.accessibilityScore}%` }} /></div>
        <p>{profile.inclusiveSummary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="status-chip status-chip-cyan">{profile.tier}</span>
          <span className="status-chip">{profile.supportedNeeds.length} supports</span>
        </div>
      </button>
    </article>
  );
}

function RepairCard({ icon, title, text }: { icon: "keyboard" | "clipboard" | "eye" | "play" | "check"; title: string; text: string }) {
  return (
    <article>
      <PhysicsIcon name={icon === "keyboard" ? "settings" : icon} className="h-4 w-4" />
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}
