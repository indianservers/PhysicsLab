import { Link } from "react-router-dom";
import { experiments } from "../lib/experiments";
import { Toolbar } from "../components/Toolbar";
import { ReactNode, useEffect, useRef, useState } from "react";
import { listProjects } from "../lib/storage";
import { ProjectFile } from "../types";
import { classOptions, curriculumCoverageStats } from "../lib/curriculum";
import { iconForCategory, iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { useCountUp } from "../hooks/useCountUp";
import { initScrollReveal } from "../hooks/useScrollReveal";
import { getTotalXP, getUnlocked, ACHIEVEMENTS } from "../lib/achievements";
import { useMagnetic } from "../hooks/useMagnetic";
import "./home-premium.css";

const labs = ["Mechanics", "Waves", "Optics", "Electricity", "Magnetism", "Thermodynamics", "Fluid Mechanics", "Modern Physics", "Measurement", "Electronics", "Energy"];

export function HomePage() {
  const [recentProjects, setRecentProjects] = useState<ProjectFile[]>([]);
  const [projectsReady, setProjectsReady] = useState(false);
  const [experimentQuery, setExperimentQuery] = useState("");
  const pageRef = useRef<HTMLElement>(null);
  const stats = curriculumCoverageStats();
  const showcase = experiments.slice(0, 14);
  const totalXp = getTotalXP();
  const unlockedCount = getUnlocked().size;
  const [heroSpeed, setHeroSpeed] = useState(7.7);
  const heroState = heroSpeed < 7.25 ? "Sub-orbital path" : heroSpeed < 10.9 ? "Stable orbit" : "Escape trajectory";
  const heroTone = heroSpeed < 7.25 ? "warning" : heroSpeed < 10.9 ? "stable" : "escape";
  const filteredExperiments = experiments
    .filter((experiment) => {
      const query = experimentQuery.trim().toLowerCase();
      if (!query) return true;
      const formulaText = experiment.formulae.map((formula) => `${formula.name} ${formula.expression}`).join(" ");
      const text = `${experiment.title} ${experiment.aim} ${experiment.category} ${experiment.classLevel} ${experiment.curriculumTags?.domains.join(" ") ?? ""} ${formulaText}`.toLowerCase();
      return text.includes(query);
    })
    .slice(0, 12);

  useEffect(() => {
    listProjects()
      .then((projects) => setRecentProjects(projects.slice(0, 4)))
      .catch(() => setRecentProjects([]))
      .finally(() => setProjectsReady(true));
  }, []);

  useEffect(() => {
    const cleanup = initScrollReveal();
    const t = window.setTimeout(cleanup, 8000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen home-premium-root">
      <Toolbar />
      <main id="content" className="home-bento-page home-premium-page desktop-page">
        <section className="home-premium-hero" aria-labelledby="home-premium-title">
          <div className="home-premium-topline">
            <span><i /> PHYSICS LEARNING OPERATING SYSTEM</span>
            <strong>80 LIVE LESSONS <b>•</b> 581 SCIENTIFIC CHECKS</strong>
          </div>
          <div className="home-premium-grid">
            <div className="home-premium-copy">
              <p className="home-premium-kicker">INTERACTIVE · MEASURABLE · LESSON-SPECIFIC</p>
              <h1 id="home-premium-title">Learn physics by <em>operating it.</em></h1>
              <p className="home-premium-lede">Predict the outcome, manipulate a real model, measure the evidence, and explain what changed. Every lesson is a working scientific studio—not a static slide.</p>
              <div className="home-premium-chips" aria-label="Platform strengths">
                <span>2D-first interactive labs</span><span>Class 6–Undergraduate</span><span>No sound distractions</span>
              </div>
              <div className="home-hero-actions">
                <MagneticWrapper><Link className="home-premium-primary" to="/experiments/satellite-orbit" viewTransition><PhysicsIcon name="orbit" className="h-4 w-4" />Launch first lesson</Link></MagneticWrapper>
                <MagneticWrapper><Link className="home-premium-secondary" to="/experiments" viewTransition><PhysicsIcon name="book" className="h-4 w-4" />Browse all lessons</Link></MagneticWrapper>
              </div>
              <div className="home-premium-proof">
                <HomeMetric icon="teacher" label="Classes" value={stats.classes} />
                <HomeMetric icon="book" label="Units" value={stats.units} />
                <HomeMetric icon="compass" label="Topics" value={stats.topics} />
                <HomeMetric icon="check" label="Validated labs" value={80} />
              </div>
            </div>

            <div className="home-command-deck" aria-label="Interactive satellite lesson preview">
              <header><div><span>LIVE LESSON PREVIEW</span><strong>Satellite Orbit &amp; Escape Speed</strong></div><small><i /> MODEL RUNNING</small></header>
              <div className={`home-orbit-stage ${heroTone}`}>
                <div className="home-stage-legend"><span><i className="sub" />Sub-orbital</span><span><i className="orbit" />Stable orbit</span><span><i className="escape" />Escape</span></div>
                <div className="home-orbit-ring home-orbit-ring-a" />
                <div className="home-orbit-ring home-orbit-ring-b" />
                <img className="home-premium-earth" src="/assets/experiments/satellite-orbit/sprites/earth.png" alt="" />
                <div className="home-satellite-track" style={{ transform: `rotate(${(heroSpeed - 4) * 28}deg)` }}>
                  <img src="/assets/experiments/satellite-orbit/sprites/satellite.png" alt="Animated satellite" />
                  <span className="home-velocity-vector">v</span>
                </div>
                <div className="home-gravity-vector">F<sub>g</sub></div>
                <div className="home-stage-status"><i />{heroState}</div>
              </div>
              <div className="home-command-controls">
                <div className="home-speed-control">
                  <label htmlFor="home-launch-speed"><span>Launch speed <em>v₀</em></span><output>{heroSpeed.toFixed(1)} km/s</output></label>
                  <input id="home-launch-speed" type="range" min="4" max="12" step="0.1" value={heroSpeed} onChange={(event) => setHeroSpeed(Number(event.target.value))} />
                  <small><span>4 km/s</span><span>12 km/s</span></small>
                </div>
                <div className="home-orbit-readings">
                  <span><small>ALTITUDE</small><b>700 km</b></span>
                  <span><small>ORBITAL PERIOD</small><b>{heroSpeed < 7.25 ? "—" : "98.2 min"}</b></span>
                  <span><small>SPECIFIC ENERGY</small><b>{heroTone === "escape" ? "+4.8" : heroTone === "stable" ? "−28.2" : "−34.7"} MJ/kg</b></span>
                </div>
                <div className="home-orbit-presets" aria-label="Launch speed presets">
                  <button type="button" onClick={() => setHeroSpeed(6.2)}>Sub-orbital</button>
                  <button type="button" className={heroTone === "stable" ? "active" : ""} onClick={() => setHeroSpeed(7.7)}>Low Earth orbit</button>
                  <button type="button" onClick={() => setHeroSpeed(11.2)}>Escape</button>
                </div>
              </div>
            </div>
          </div>
          <div className="home-premium-flow" aria-label="Learning workflow"><span><b>01</b> Predict</span><span><b>02</b> Manipulate</span><span><b>03</b> Measure</span><span><b>04</b> Explain</span></div>
        </section>

        <section className="home-continue-strip" aria-label="Continue saved sessions">
          <div className="home-section-heading">
            <div>
              <p className="ui-label">Continue</p>
              <h2 className="section-heading">Resume recent work</h2>
            </div>
            <Link className="tool-btn" to="/projects" viewTransition>Projects</Link>
          </div>
          <div className="home-continue-grid">
            {!projectsReady && [0, 1, 2].map((item) => <div key={item} className="home-continue-card skeleton-card" />)}
            {projectsReady && recentProjects.slice(0, 3).map((project, index) => (
              <Link key={`${project.name}-${project.updatedAt}`} className="home-continue-card" to="/projects" viewTransition>
                <span className="home-continue-thumb"><PhysicsIcon name={index === 0 ? "rocket" : index === 1 ? "wave" : "battery"} /></span>
                <span className="home-continue-copy">
                  <strong>{project.name}</strong>
                  <small>{project.topic || "sandbox"} - {new Date(project.updatedAt).toLocaleDateString()}</small>
                  <span className="mini-progress"><span style={{ width: `${Math.min(94, 42 + (project.objects.length * 7))}%` }} /></span>
                </span>
                <span className="hero-btn-secondary">Resume</span>
              </Link>
            ))}
            {projectsReady && recentProjects.length === 0 && (
              <Link className="home-continue-card" to="/sandbox" viewTransition>
                <span className="home-continue-thumb"><PhysicsIcon name="flask" /></span>
                <span className="home-continue-copy">
                  <strong>No saved sessions yet</strong>
                  <small>Start a sandbox run and it will appear here.</small>
                  <span className="mini-progress"><span style={{ width: "18%" }} /></span>
                </span>
                <span className="hero-btn-secondary">Start</span>
              </Link>
            )}
          </div>
        </section>

        <section className="bento-section" aria-label="PhysicsLab feature grid">
          <div className="bento-section-header scroll-reveal">
            <p className="ui-label">The Complete Physics Suite</p>
            <h2 className="section-heading-gradient">Every tool a physicist needs</h2>
          </div>
          <div className="bento-feature-grid">
            <Link className="bento-card bento-wide scroll-reveal" to="/pro-lab" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="rocket" className="h-8 w-8" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">New · Mission PL-01</span>
                <h2 className="bento-card-title">Pro Lab: Build & Launch</h2>
                <p className="bento-card-body">Integrate a launch vehicle, load real propellants, run flight-safety checks, and fly a simulated mission to orbit.</p>
              </div>
              <span className="bento-card-arrow">→</span>
            </Link>
            <Link className="bento-card bento-hero-large scroll-reveal" to="/experiments" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="orbit" className="h-8 w-8" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">100+ Labs</span>
                <h2 className="bento-card-title">Guided Experiment Library</h2>
                <p className="bento-card-body">Classroom-ready labs mapped to topics, with calculators, explainers, viva questions, and animated previews. Class 6 to PhD level.</p>
              </div>
              <div className="bento-card-preview exp-preview-orbital" aria-hidden="true" />
              <span className="bento-card-arrow">→</span>
            </Link>

            <Link className="bento-card bento-tall scroll-reveal-scale" to="/teacher" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="teacher" className="h-8 w-8" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">For Educators</span>
                <h2 className="bento-card-title">Teacher Mode</h2>
                <p className="bento-card-body">Create assignments, lock variables, build lesson packs, and review student artifacts — fully local.</p>
              </div>
              <div className="bento-card-preview exp-preview-circuit" aria-hidden="true" />
              <span className="bento-card-arrow">→</span>
            </Link>

            <Link className="bento-card bento-wide scroll-reveal-left" to="/sandbox" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="flask" className="h-7 w-7" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">Interactive</span>
                <h2 className="bento-card-title">Matter.js Sandbox</h2>
                <p className="bento-card-body">Drop objects, apply forces, observe collisions in real-time 2D physics. Save & share sessions locally.</p>
              </div>
              <div className="bento-card-preview exp-preview-pendulum" aria-hidden="true" />
              <span className="bento-card-arrow">→</span>
            </Link>

            <Link className="bento-card bento-wide scroll-reveal" to="/graphs" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="chart" className="h-7 w-7" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">Data Studio</span>
                <h2 className="bento-card-title">Graph Studio</h2>
                <p className="bento-card-body">Plot, fit, compare, and export lab data on a dark dot-grid canvas with curve fitting and annotations.</p>
              </div>
              <div className="bento-card-preview exp-preview-wave" aria-hidden="true" />
              <span className="bento-card-arrow">→</span>
            </Link>

            <Link className="bento-card bento-sm scroll-reveal-scale" to="/solver" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="calculator" className="h-6 w-6" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">Formula AI</span>
                <h2 className="bento-card-title">Solver Bank</h2>
                <p className="bento-card-body">Practice formulas by category with full reasoning.</p>
              </div>
              <span className="bento-card-arrow">→</span>
            </Link>

            <Link className="bento-card bento-sm scroll-reveal" to="/quantum" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="spark" className="h-6 w-6" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">Modern Physics</span>
                <h2 className="bento-card-title">Quantum Lab</h2>
                <p className="bento-card-body">Bohr jumps, tunneling, photoelectric emission.</p>
              </div>
              <span className="bento-card-arrow">→</span>
            </Link>

            <Link className="bento-card bento-sm scroll-reveal-left" to="/video" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="eye" className="h-6 w-6" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">Kinematics</span>
                <h2 className="bento-card-title">Video Analysis</h2>
                <p className="bento-card-body">Track motion from uploaded clips with frame-step tools.</p>
              </div>
              <span className="bento-card-arrow">→</span>
            </Link>

            <Link className="bento-card bento-sm scroll-reveal" to="/graph" viewTransition>
              <div className="bento-card-icon"><PhysicsIcon name="orbit" className="h-6 w-6" /></div>
              <div className="bento-card-content">
                <span className="bento-card-tag">AI Map</span>
                <h2 className="bento-card-title">Knowledge Graph</h2>
                <p className="bento-card-body">Interactive force-directed map of all physics experiments.</p>
              </div>
              <span className="bento-card-arrow">→</span>
            </Link>
          </div>
        </section>

        <section className="home-learning-path-section scroll-reveal" aria-label="Your adaptive learning path">
          <div className="bento-section-header">
            <p className="ui-label">Personalized to you</p>
            <h2 className="section-heading-gradient">Your Learning Path</h2>
          </div>
          <div className="learning-path-track">
            {[
              { label: "Measurement & SI Units", tag: "Foundation", to: "/topics/measurement", mastered: true },
              { label: "Kinematics & Motion", tag: "Class 9", to: "/topics/mechanics", mastered: true },
              { label: "Newton's Laws", tag: "Class 9", to: "/experiments/newtons-second-law", mastered: true },
              { label: "Work, Energy & Power", tag: "Class 9", to: "/topics/energy", mastered: false, isNext: true },
              { label: "Waves & Oscillations", tag: "Class 11", to: "/topics/waves", mastered: false },
              { label: "Electrostatics", tag: "Class 12", to: "/topics/electricity", mastered: false },
              { label: "Quantum Physics", tag: "Advanced", to: "/quantum", mastered: false },
            ].map((node) => (
              <Link
                key={node.label}
                className={`learning-path-node${node.mastered ? " mastered" : ""}${node.isNext ? " next" : ""}`}
                to={node.to}
                viewTransition
              >
                <span className="learning-path-node-dot" />
                <span className="learning-path-node-label">{node.label}</span>
                <span className="bento-card-tag">{node.tag}</span>
              </Link>
            ))}
          </div>
          {unlockedCount > 0 && (
            <p className="learning-path-xp-summary">
              <PhysicsIcon name="spark" className="h-4 w-4" />
              {unlockedCount} achievement{unlockedCount !== 1 ? "s" : ""} unlocked · {totalXp} XP earned
            </p>
          )}
        </section>

        <section className="home-showcase-section">
          <div className="home-section-heading">
            <div>
              <p className="ui-label">Living experiment cards</p>
              <h2 className="section-heading-gradient">Search by topic, formula, or keyword</h2>
            </div>
            <Link className="tool-btn" to="/experiments" viewTransition>All experiments</Link>
          </div>
          <label className="home-experiment-search">
            <PhysicsIcon name="search" className="h-4 w-4" />
            <input value={experimentQuery} onChange={(event) => setExperimentQuery(event.target.value)} placeholder="Search momentum, prism, Ohm, SHM, wavelength..." />
            <strong>{filteredExperiments.length}</strong>
          </label>
          <div className="home-living-grid">
            {filteredExperiments.map((experiment) => (
              <Link className="home-living-card" key={experiment.id} to={`/experiments/${experiment.id}`} viewTransition>
                <HomeMiniPreview experiment={experiment} />
                <span className="home-living-overlay">
                  <strong>{experiment.title}</strong>
                  <span>
                    <small>{experiment.classLevel}</small>
                    <small>{experiment.category}</small>
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="home-showcase-strip" aria-label="Featured experiments">
            {showcase.map((experiment) => (
              <Link className="home-showcase-card" key={experiment.id} to={`/experiments/${experiment.id}`} viewTransition>
                <span className="card-icon"><PhysicsIcon name={iconForExperiment(experiment)} /></span>
                <span className="home-showcase-preview" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <strong>{experiment.title}</strong>
                <small>{experiment.classLevel}</small>
                <span className="status-chip status-chip-cyan">{experiment.category}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-bento-footer-grid">
          <div className="panel p-4">
            <p className="ui-label">Browse by domain</p>
            <div className="home-domain-grid">
              {labs.map((lab) => {
                const count = experiments.filter((experiment) => experiment.curriculumTags?.domains.includes(lab) || experiment.category === lab).length;
                return (
                  <Link className="home-domain-chip" key={lab} to={`/topics/${lab.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} viewTransition>
                    <PhysicsIcon name={iconForCategory(lab)} className="h-4 w-4" />
                    <span>{lab}</span>
                    <strong>{count}</strong>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="panel p-4">
            <p className="ui-label">Classes</p>
            <div className="home-class-grid">
              {classOptions.map((klass) => (
                <Link className="home-class-chip" key={klass.id} to={`/experiments?class=${klass.id}`} viewTransition>
                  <span>{klass.label}</span>
                  <span className="mini-progress"><span style={{ width: `${Math.min(100, 40 + klass.grade * 5)}%` }} /></span>
                </Link>
              ))}
            </div>
          </div>
          <div className="panel p-4">
            <p className="ui-label">Recent projects</p>
            <div className="grid gap-2">
              {!projectsReady && (
                <>
                  <div className="skeleton-pill" />
                  <div className="skeleton-pill" />
                  <div className="skeleton-pill" />
                </>
              )}
              {projectsReady && recentProjects.length === 0 && <Link className="home-project-chip" to="/projects" viewTransition>No saved projects yet</Link>}
              {recentProjects.map((project) => <Link className="home-project-chip" key={project.name} to="/projects" viewTransition>{project.name}</Link>)}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function HomeMiniPreview({ experiment }: { experiment: typeof experiments[number] }) {
  const kind = experiment.category.includes("Optics") ? "optics" : experiment.category.includes("Wave") ? "wave" : experiment.category.includes("Electric") ? "circuit" : experiment.category.includes("Thermo") ? "thermal" : "mechanics";
  return (
    <span className={`home-mini-preview home-mini-preview-${kind}`} aria-hidden="true">
      <span className="mini-grid" />
      <span className="mini-orbit" />
      <span className="mini-wave" />
      <span className="mini-ray" />
      <span className="mini-block" />
      <span className="mini-particle" />
    </span>
  );
}

function HomeMetric({ icon, label, value }: { icon: PhysicsIconName; label: string; value: number }) {
  const animated = useCountUp(value);
  return (
    <div className="metric-card">
      <PhysicsIcon name={icon} className="h-5 w-5 text-cyan-500" />
      <div className="mt-2 ui-label">{label}</div>
      <div className="mt-1 text-2xl font-black text-cyan-500 count-up">{animated}</div>
    </div>
  );
}

function MagneticWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useMagnetic(ref);
  return <div ref={ref} style={{ display: "inline-flex" }}>{children}</div>;
}
