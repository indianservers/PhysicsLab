import { Link } from "react-router-dom";
import { experiments } from "../lib/experiments";
import { Toolbar } from "../components/Toolbar";
import { ReactNode, useEffect, useRef, useState } from "react";
import { listProjects } from "../lib/storage";
import { ProjectFile } from "../types";
import { classOptions, curriculumCoverageStats } from "../lib/curriculum";
import { iconForCategory, iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { useCountUp } from "../hooks/useCountUp";
import { WebGLHero } from "../components/WebGLHero";
import { initScrollReveal } from "../hooks/useScrollReveal";
import { getTotalXP, getUnlocked, ACHIEVEMENTS } from "../lib/achievements";
import { useMagnetic } from "../hooks/useMagnetic";

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
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="home-bento-page desktop-page">
        <section className="home-bento-hero mesh-bg" style={{ position: "relative", overflow: "hidden" }}>
          <WebGLHero />
          <LiveHeroPhysics />
          <div className="home-hero-content" style={{ position: "relative", zIndex: 2 }}>
            <p className="hero-display-tagline">Browser-only STEM Lab</p>
            <h1 className="hero-display-title">PhysicsLab 100</h1>
            <p className="hero-sub-text">
              The most cinematic physics workspace for Class 6–PhD. Matter.js sandbox, 3D explainers, guided experiments, live vectors, graphing, quizzes — all running in your browser.
            </p>
            <div className="home-hero-actions">
              <MagneticWrapper><Link className="hero-btn" to="/sandbox" viewTransition><PhysicsIcon name="flask" className="h-4 w-4" />Start simulation</Link></MagneticWrapper>
              <MagneticWrapper><Link className="hero-btn-secondary" to="/experiments/projectile-motion" viewTransition><PhysicsIcon name="rocket" className="h-4 w-4" />Projectile lab</Link></MagneticWrapper>
              <MagneticWrapper><Link className="hero-btn-secondary" to="/quiz" viewTransition><PhysicsIcon name="check" className="h-4 w-4" />Quiz challenge</Link></MagneticWrapper>
            </div>
          </div>
          <div className="home-hero-metrics" style={{ position: "relative", zIndex: 2 }}>
            <HomeMetric icon="teacher" label="Classes" value={stats.classes} />
            <HomeMetric icon="book" label="Units" value={stats.units} />
            <HomeMetric icon="compass" label="Topics" value={stats.topics} />
            {totalXp > 0 && <HomeMetric icon="spark" label="Your XP" value={totalXp} />}
          </div>
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

function LiveHeroPhysics() {
  return (
    <div className="home-live-physics" aria-hidden="true">
      <div className="home-live-orbit" />
      <div className="home-live-wave" />
      <div className="home-live-vector home-live-vector-a" />
      <div className="home-live-vector home-live-vector-b" />
      <div className="home-live-particle home-live-particle-a" />
      <div className="home-live-particle home-live-particle-b" />
    </div>
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
