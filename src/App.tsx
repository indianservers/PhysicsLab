import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { ExperimentsPage } from "./pages/ExperimentsPage";
import { ExperimentDetailPage } from "./pages/ExperimentDetailPage";
import { TopicPage } from "./pages/TopicPage";
import { SimplePage } from "./pages/SimplePage";
import { useLabStore } from "./store/useLabStore";

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
];

export default function App() {
  const theme = useLabStore((state) => state.theme);
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-lab-ink dark:text-slate-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lab" element={<WorkspacePage mode="guided" />} />
          <Route path="/sandbox" element={<WorkspacePage mode="sandbox" />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/experiments/:id" element={<ExperimentDetailPage />} />
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
