import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Component, ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { HomePage } from "./pages/HomePage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { ExperimentsPage } from "./pages/ExperimentsPage";
import { ExperimentDetailPage } from "./pages/ExperimentDetailPage";
import { TopicPage } from "./pages/TopicPage";
import { SyllabusPage } from "./pages/SyllabusPage";
import { ConceptsPage } from "./pages/ConceptsPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { SimplePage } from "./pages/SimplePage";
import { GraphsPage } from "./pages/GraphsPage";
import { VideoAnalysisPage } from "./pages/VideoAnalysisPage";
import { KnowledgeGraphPage } from "./pages/KnowledgeGraphPage";
import { LMSConfigPage } from "./pages/LMSConfigPage";
import { QuantumPage } from "./pages/QuantumPage";
import { TeacherPage } from "./pages/TeacherPage";
import { SolverPage } from "./pages/SolverPage";
import { QuizPage } from "./pages/QuizPage";
import { FormulasPage } from "./pages/FormulasPage";
import { DictionaryPage } from "./pages/DictionaryPage";
import { AstroPhysicsPage } from "./pages/AstroPhysicsPage";
import { ParticlePhysicsPage } from "./pages/ParticlePhysicsPage";
import { AtmospherePage } from "./pages/AtmospherePage";
import { StringTheoryPage } from "./pages/StringTheoryPage";
import { PhysicsInnovationsPage } from "./pages/PhysicsInnovationsPage";
import { PhysicsModulesPage } from "./pages/PhysicsModulesPage";
import { ComparisonPage } from "./pages/ComparisonPage";
import { QualityAuditPage } from "./pages/QualityAuditPage";
import { AccuracyCenterPage } from "./pages/AccuracyCenterPage";
import { LearningStudioPage } from "./pages/LearningStudioPage";
import { SimulationDepthPage } from "./pages/SimulationDepthPage";
import { ClassroomDeploymentPage } from "./pages/ClassroomDeploymentPage";
import { AccessibilityCenterPage } from "./pages/AccessibilityCenterPage";
import { InsightsCenterPage } from "./pages/InsightsCenterPage";
import { ReleaseGovernancePage } from "./pages/ReleaseGovernancePage";
import { ExcellenceBenchmarkPage } from "./pages/ExcellenceBenchmarkPage";
import { useLabStore } from "./store/useLabStore";
import { ScaleOfUniversePage } from "./physics/scale-of-universe/ScaleOfUniversePage";
import { sendStatement, initXAPISync } from "./lib/xapi";
import { ToastProvider } from "./components/ToastSystem";
import { CursorTrail } from "./components/CursorTrail";
import { SplashLoader } from "./components/SplashLoader";
import { AchievementSystem } from "./components/AchievementSystem";
import { ParticleConstellation } from "./components/ParticleConstellation";
import { AmbientAudio } from "./components/AmbientAudio";
import { AppFooter } from "./components/AppFooter";

const topics = [
  "mechanics",
  "waves",
  "optics",
  "electricity",
  "magnetism",
  "thermodynamics",
  "modern-physics",
  "fluid-mechanics",
  "oscillations",
  "astronomy",
  "astrophysics",
  "measurement",
  "electronics",
  "energy",
];

export default function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const [online, setOnline] = useState(navigator.onLine);
  const theme = useLabStore((state) => state.theme);
  const accessibility = useLabStore((state) => state.accessibility);
  const cursorRafRef = useRef<number | null>(null);

  useEffect(() => {
    sendStatement("launched", window.location.pathname);
    initXAPISync();
    localStorage.removeItem("physicslab-theme-preset-v1");
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    root.removeAttribute("data-theme-preset");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#050c18" : "#f8fafc");
  }, [theme]);

  /* Cursor-reactive ambient light — updates CSS custom properties at 60fps */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRafRef.current !== null) return;
      cursorRafRef.current = requestAnimationFrame(() => {
        document.body.style.setProperty("--cursor-x", `${e.clientX}px`);
        document.body.style.setProperty("--cursor-y", `${e.clientY}px`);
        cursorRafRef.current = null;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (cursorRafRef.current !== null) cancelAnimationFrame(cursorRafRef.current);
    };
  }, []);

  const classes = [
    theme === "dark" ? "dark" : "",
    accessibility.highContrast ? "high-contrast" : "",
    accessibility.largeUi ? "large-ui" : "",
    accessibility.colorBlindSafe ? "color-blind-safe" : "",
    accessibility.reducedMotion ? "reduced-motion" : "",
  ].join(" ");

  return (
    <div className={classes}>
      <SplashLoader />
      <ParticleConstellation />
      <CursorTrail />
      <AchievementSystem />
      <AmbientAudio />
      <ToastProvider>
        <a href="#content" className="skip-link">Skip to content</a>
        <main className="app-shell min-h-screen" style={{ position: "relative", zIndex: 1 }}>
          {!online && (
            <div className="bg-warning-500 px-4 py-2 text-center text-sm font-semibold text-space-900">
              {t("offline")}
            </div>
          )}
          <div key={location.pathname} className="route-fade">
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lab" element={<WorkspacePage mode="guided" />} />
              <Route path="/sandbox" element={<WorkspacePage mode="sandbox" />} />
              <Route path="/experiments" element={<ExperimentsPage />} />
              <Route path="/experiments/:id" element={<RouteErrorBoundary><ExperimentDetailPage /></RouteErrorBoundary>} />
              <Route path="/syllabus" element={<SyllabusPage />} />
              <Route path="/concepts" element={<ConceptsPage />} />
              <Route path="/modules" element={<PhysicsModulesPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/solver" element={<SolverPage />} />
              <Route path="/formulas" element={<FormulasPage />} />
              <Route path="/dictionary" element={<DictionaryPage />} />
              <Route path="/astrophysics" element={<AstroPhysicsPage />} />
              <Route path="/particle-physics" element={<ParticlePhysicsPage />} />
              <Route path="/particle-physics/:conceptId" element={<ParticlePhysicsPage />} />
              <Route path="/atmosphere" element={<AtmospherePage />} />
              <Route path="/string-theory" element={<StringTheoryPage />} />
              <Route path="/physics-innovations" element={<PhysicsInnovationsPage />} />
              <Route path="/physics/scale-of-universe" element={<ScaleOfUniversePage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/quality-audit" element={<QualityAuditPage />} />
              <Route path="/accuracy-center" element={<AccuracyCenterPage />} />
              <Route path="/learning-studio" element={<LearningStudioPage />} />
              <Route path="/simulation-depth" element={<SimulationDepthPage />} />
              <Route path="/classroom-deployment" element={<ClassroomDeploymentPage />} />
              <Route path="/accessibility-center" element={<AccessibilityCenterPage />} />
              <Route path="/insights-center" element={<InsightsCenterPage />} />
              <Route path="/release-governance" element={<ReleaseGovernancePage />} />
              <Route path="/excellence-benchmark" element={<ExcellenceBenchmarkPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/video" element={<VideoAnalysisPage />} />
              <Route path="/quantum" element={<QuantumPage />} />
              <Route path="/teacher" element={<TeacherPage />} />
              <Route path="/lms-config" element={<LMSConfigPage />} />
              <Route path="/topics" element={<Navigate to="/topics/mechanics" replace />} />
              {topics.map((topic) => (
                <Route key={topic} path={`/topics/${topic}`} element={<TopicPage topic={topic} />} />
              ))}
              <Route path="/graphs" element={<GraphsPage />} />
              <Route path="/graph" element={<KnowledgeGraphPage />} />
              <Route path="/projects" element={<SimplePage title="Projects" showProjects />} />
              <Route path="/settings" element={<SimplePage title="Settings" />} />
              <Route path="/backup" element={<SimplePage title="Backup" />} />
              <Route path="/help" element={<SimplePage title="Help" />} />
              <Route path="/trust" element={<SimplePage title="Scientific Trust" />} />
              <Route path="/privacy" element={<SimplePage title="Privacy" />} />
              <Route path="/terms" element={<SimplePage title="Terms" />} />
            </Routes>
          </div>
          <AppFooter />
        </main>
      </ToastProvider>
    </div>
  );
}

class RouteErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null };

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : "This lab view could not render." };
  }

  render() {
    if (this.state.message) {
      return (
        <section className="mx-auto max-w-3xl p-6">
          <div className="panel border-warning-400/60 p-5">
            <p className="ui-label text-warning-300">Lab view recovered</p>
            <h1 className="mt-2 text-2xl font-black">This experiment needs a refresh</h1>
            <p className="mt-2 text-sm text-space-200">{this.state.message}</p>
            <a className="hero-btn-secondary mt-4 inline-flex" href="/experiments">Back to experiments</a>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
