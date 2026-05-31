import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HomePage } from "./pages/HomePage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { ExperimentsPage } from "./pages/ExperimentsPage";
import { ExperimentDetailPage } from "./pages/ExperimentDetailPage";
import { TopicPage } from "./pages/TopicPage";
import { SimplePage } from "./pages/SimplePage";
import { VideoAnalysisPage } from "./pages/VideoAnalysisPage";
import { LMSConfigPage } from "./pages/LMSConfigPage";
import { QuantumPage } from "./pages/QuantumPage";
import { TeacherPage } from "./pages/TeacherPage";
import { useLabStore } from "./store/useLabStore";
import { sendStatement } from "./lib/xapi";

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
  "measurement",
  "electronics",
];

export default function App() {
  const { t } = useTranslation();
  const [online, setOnline] = useState(navigator.onLine);
  const theme = useLabStore((state) => state.theme);
  const accessibility = useLabStore((state) => state.accessibility);
  useEffect(() => {
    sendStatement("launched", window.location.pathname);
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
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
      <a href="#content" className="skip-link">Skip to content</a>
      <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-lab-ink dark:text-slate-100">
        {!online && <div className="bg-amber-300 px-4 py-2 text-center text-sm font-semibold text-slate-950">{t("offline")}</div>}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lab" element={<WorkspacePage mode="guided" />} />
          <Route path="/sandbox" element={<WorkspacePage mode="sandbox" />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/experiments/:id" element={<ExperimentDetailPage />} />
          <Route path="/video" element={<VideoAnalysisPage />} />
          <Route path="/quantum" element={<QuantumPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/lms-config" element={<LMSConfigPage />} />
          <Route path="/topics" element={<Navigate to="/topics/mechanics" replace />} />
          {topics.map((topic) => (
            <Route key={topic} path={`/topics/${topic}`} element={<TopicPage topic={topic} />} />
          ))}
          <Route path="/graphs" element={<SimplePage title="Graphs" />} />
          <Route path="/projects" element={<SimplePage title="Projects" showProjects />} />
          <Route path="/settings" element={<SimplePage title="Settings" />} />
          <Route path="/help" element={<SimplePage title="Help" />} />
        </Routes>
      </main>
    </div>
  );
}
