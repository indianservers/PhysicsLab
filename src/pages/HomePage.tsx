import { Link } from "react-router-dom";
import { experiments } from "../lib/experiments";
import { Toolbar } from "../components/Toolbar";
import { useEffect, useState } from "react";
import { listProjects } from "../lib/storage";
import { ProjectFile } from "../types";
import { classOptions, curriculumCoverageStats } from "../lib/curriculum";
import { iconForCategory, iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";

const labs = ["Mechanics", "Waves", "Optics", "Electricity", "Magnetism", "Thermodynamics", "Fluid Mechanics", "Modern Physics", "Measurement", "Electronics", "Energy"];

export function HomePage() {
  const [recentProjects, setRecentProjects] = useState<ProjectFile[]>([]);
  const [projectsReady, setProjectsReady] = useState(false);
  const [experimentQuery, setExperimentQuery] = useState("");
  const stats = curriculumCoverageStats();
  const showcase = experiments.slice(0, 14);
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

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="home-bento-page desktop-page">
        <section className="home-bento-hero mesh-bg">
          <LiveHeroPhysics />
          <div className="home-hero-content">
            <p className="ui-label">Browser-only STEM lab</p>
            <h1 className="text-gradient">PhysicsLab 100</h1>
            <p>
              A cinematic dark-mode physics workspace with guided labs, a Matter.js sandbox, 3D explainers, live vectors, graphing, quizzes, and project storage that stays in the browser.
            </p>
            <div className="home-hero-actions">
              <Link className="hero-btn" to="/sandbox" viewTransition><PhysicsIcon name="flask" className="h-4 w-4" />Start simulation</Link>
              <Link className="hero-btn-secondary" to="/experiments/projectile-motion" viewTransition><PhysicsIcon name="rocket" className="h-4 w-4" />Projectile lab</Link>
              <Link className="hero-btn-secondary" to="/quiz" viewTransition><PhysicsIcon name="check" className="h-4 w-4" />Quiz challenge</Link>
            </div>
          </div>
          <div className="home-hero-metrics">
            <HomeMetric icon="teacher" label="Classes" value={stats.classes} />
            <HomeMetric icon="book" label="Units" value={stats.units} />
            <HomeMetric icon="compass" label="Topics" value={stats.topics} />
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

        <section className="home-feature-grid" aria-label="PhysicsLab feature grid">
          <FeatureCard className="home-feature-large stagger-item" icon="orbit" to="/experiments" title="Guided Experiment Library" body="Classroom-ready labs mapped to topics, with calculators, explainers, viva questions, and animated previews." />
          <FeatureCard className="stagger-item" icon="calculator" to="/solver" title="Solver Bank" body="Practice formulas by category, reveal reasoning, and jump into the connected experiment." />
          <FeatureCard className="stagger-item" icon="chart" to="/graphs" title="Graph Studio" body="Plot, fit, compare, and export lab data on a dark dot-grid canvas." />
          <FeatureCard className="stagger-item" icon="eye" to="/video" title="Video Analysis" body="Track motion from uploaded clips with calibration and frame-step tools." />
          <FeatureCard className="home-feature-tall stagger-item" icon="teacher" to="/teacher" title="Teacher Mode" body="Create assignments, lock variables, build lesson packs, and review student artifacts locally." />
          <FeatureCard className="stagger-item" icon="spark" to="/quantum" title="Quantum Lab" body="Explore Bohr jumps, tunneling, photoelectric emission, and modern physics bridges." />
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

function FeatureCard({ icon, to, title, body, className = "" }: { icon: PhysicsIconName; to: string; title: string; body: string; className?: string }) {
  return (
    <Link className={`enhanced-card home-feature-card ${className}`} to={to} viewTransition>
      <span className="card-icon"><PhysicsIcon name={icon} /></span>
      <h2>{title}</h2>
      <p>{body}</p>
    </Link>
  );
}

function HomeMetric({ icon, label, value }: { icon: PhysicsIconName; label: string; value: number }) {
  return (
    <div className="metric-card">
      <PhysicsIcon name={icon} className="h-5 w-5 text-cyan-500" />
      <div className="mt-2 ui-label">{label}</div>
      <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
    </div>
  );
}
