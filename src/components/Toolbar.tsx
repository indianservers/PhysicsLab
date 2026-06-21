import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { saveProject } from "../lib/storage";
import { rawStateJson, serializeState } from "../lib/stateSerializer";
import { useLabStore } from "../store/useLabStore";
import { ProjectFile } from "../types";
import { PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { GlobalSearch } from "./GlobalSearch";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

type NavItem = {
  label: string;
  path: string;
  icon: PhysicsIconName;
  accent?: "science" | "quantum" | "warning";
  children?: NavItem[];
};

const primaryNavItems: NavItem[] = [
  { label: "Home", path: "/", icon: "atom" },
  { label: "Experiments", path: "/experiments", icon: "flask" },
  { label: "Solver", path: "/solver", icon: "calculator" },
  { label: "Formulas", path: "/formulas", icon: "book", accent: "warning" },
  { label: "Dictionary", path: "/dictionary", icon: "clipboard" },
  { label: "Quiz", path: "/quiz", icon: "check" },
  { label: "Syllabus", path: "/syllabus", icon: "book" },
  { label: "Concepts", path: "/concepts", icon: "spark" },
  { label: "Lab", path: "/lab", icon: "compass" },
  { label: "Teacher", path: "/teacher", icon: "teacher" },
];

const studyNavItems: NavItem[] = [
  { label: "Roadmap", path: "/roadmap", icon: "compass" },
  { label: "All Topics", path: "/topics", icon: "book" },
  {
    label: "Visual Modules",
    path: "/atmosphere",
    icon: "spark",
    accent: "quantum",
    children: [
      { label: "Inventions", path: "/physics-innovations", icon: "spark", accent: "warning" },
      { label: "String Theory", path: "/string-theory", icon: "wave", accent: "quantum" },
      { label: "Atmosphere", path: "/atmosphere", icon: "orbit", accent: "quantum" },
      { label: "AstroPhysics", path: "/astrophysics", icon: "orbit", accent: "quantum" },
      { label: "Particle", path: "/particle-physics", icon: "atom", accent: "quantum" },
    ],
  },
  { label: "Learning Studio", path: "/learning-studio", icon: "teacher", accent: "science" },
  { label: "Graphs", path: "/graphs", icon: "chart" },
  { label: "Trust", path: "/trust", icon: "check", accent: "warning" },
  { label: "Quantum", path: "/quantum", icon: "atom", accent: "quantum" },
  { label: "Knowledge Graph", path: "/graph", icon: "orbit" },
  { label: "Compare", path: "/comparison", icon: "chart" },
];

const toolNavItems: NavItem[] = [
  { label: "Sandbox", path: "/sandbox", icon: "spark" },
  { label: "Video Analysis", path: "/video", icon: "eye" },
  { label: "Quantum Lab", path: "/quantum", icon: "atom", accent: "quantum" },
  { label: "Quality Audit", path: "/quality-audit", icon: "chart", accent: "warning" },
  { label: "Accuracy Center", path: "/accuracy-center", icon: "check", accent: "science" },
  { label: "Sim Depth", path: "/simulation-depth", icon: "eye", accent: "science" },
  { label: "Deploy", path: "/classroom-deployment", icon: "teacher", accent: "warning" },
  { label: "Access", path: "/accessibility-center", icon: "settings", accent: "science" },
  { label: "Insights", path: "/insights-center", icon: "chart", accent: "warning" },
  { label: "Release", path: "/release-governance", icon: "check", accent: "science" },
  { label: "Excellence", path: "/excellence-benchmark", icon: "gauge", accent: "warning" },
  { label: "Projects", path: "/projects", icon: "folder" },
  { label: "Backup", path: "/backup", icon: "download" },
];

const railNavGroups = [
  { label: "Core", items: primaryNavItems },
  { label: "Study", items: studyNavItems },
  { label: "Tools", items: toolNavItems },
];

export function Toolbar({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const [toast, setToast] = useState("");
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { objects, gravity, timeScale, airResistance, showGrid, showVectors, theme, setTheme, toProject, loadProject } = useLabStore();

  const save = async () => {
    await saveProject(toProject("PhysicsLab 100 Project"));
    setToast(t("toast.saved", "Saved"));
    window.setTimeout(() => setToast(""), 1600);
  };

  const share = async () => {
    const encoded = await serializeState(objects, { gravity, timeScale, airResistance, showGrid, showVectors });
    const url = `${window.location.origin}${window.location.pathname}?lab=${encoded}`;
    await navigator.clipboard.writeText(url);
    setToast(t("toast.linkCopied"));
    window.setTimeout(() => setToast(""), 2000);
  };

  const exportJson = () => {
    const blob = new Blob([rawStateJson(objects, { gravity, timeScale, airResistance, showGrid, showVectors })], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "physicslab-shared-state.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as ProjectFile | { objects?: ProjectFile["objects"]; settings?: { gravity?: number; timeScale?: number; airResistance?: boolean } };
    if ("settings" in parsed && parsed.objects) {
      useLabStore.setState({
        objects: parsed.objects,
        gravity: parsed.settings?.gravity ?? gravity,
        timeScale: parsed.settings?.timeScale ?? timeScale,
        airResistance: parsed.settings?.airResistance ?? airResistance,
        selectedId: undefined,
        running: false,
      });
      return;
    }
    loadProject(parsed as ProjectFile);
  };

  useEffect(() => {
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onInstall);
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.toLowerCase() === "s" && !event.ctrlKey) {
        event.preventDefault();
        void save();
      }
      if (event.key === "?") {
        event.preventDefault();
        setShowShortcuts(true);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
        event.preventDefault();
        exportJson();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "i") {
        event.preventDefault();
        inputRef.current?.click();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        void share();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeinstallprompt", onInstall);
    };
  });

  const navClass = (path: string) => {
    const exactHome = path === "/" && location.pathname === "/";
    const active = exactHome || (path !== "/" && (location.pathname === path || location.pathname.startsWith(`${path}/`)));
    return active ? "nav-chip nav-chip-active" : "nav-chip";
  };

  return (
    <>
      <header className="app-toolbar">
        <RouterLink to="/" className="brand-mark" aria-label="PhysicsLab 100 home">
          <span className="brand-atom-icon"><PhysicsIcon name="atom" className="h-5 w-5" /></span>
          <span className="brand-wordmark">PhysicsLab 100</span>
        </RouterLink>
        {!compact && (
          <button className="command-trigger" title="Open command palette" data-tooltip="Open command palette" onClick={() => setSearchOpen(true)}>
            <PhysicsIcon name="search" className="h-4 w-4" />
            <span>Search physics</span>
            <kbd>Ctrl K</kbd>
          </button>
        )}
        {!compact && installPrompt && (
          <button className="shell-icon-btn" title={t("toolbar.install")} onClick={() => { void installPrompt.prompt(); setInstallPrompt(null); }}>
            <PhysicsIcon name="download" className="h-4 w-4" />
          </button>
        )}
        {!compact && (
          <button
            ref={themeToggleRef}
            className="theme-toggle"
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={(e) => {
              const btn = themeToggleRef.current;
              const nextTheme = theme === "dark" ? "light" : "dark";
              if (btn && !document.getElementById("theme-reveal-overlay")) {
                const rect = btn.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top  + rect.height / 2;
                const overlay = document.createElement("div");
                overlay.id = "theme-reveal-overlay";
                overlay.className = `theme-transition-overlay ${nextTheme === "light" ? "bg-slate-50" : "bg-space-900"}`;
                overlay.style.setProperty("--reveal-x", `${x}px`);
                overlay.style.setProperty("--reveal-y", `${y}px`);
                document.body.appendChild(overlay);
                overlay.addEventListener("animationend", () => overlay.remove(), { once: true });
              }
              setTheme(nextTheme);
            }}
          >
            <span className={theme === "dark" ? "theme-orb dark" : "theme-orb"}>
              <PhysicsIcon name={theme === "dark" ? "moon" : "sun"} className="h-4 w-4" />
            </span>
          </button>
        )}
      </header>
      {!compact && (
        <aside className="app-nav-rail" aria-label="Primary navigation">
          {railNavGroups.map((group) => (
            <div key={group.label} className="rail-nav-group">
              <span className="rail-nav-label">{group.label}</span>
              {group.items.map((item) => (
                <NavLinkItem key={`${group.label}-${item.path}`} item={item} navClass={navClass} />
              ))}
            </div>
          ))}
        </aside>
      )}
      <input ref={inputRef} className="hidden" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importJson(event.target.files[0])} />
      {toast && <div className="fixed right-4 top-20 z-50 rounded bg-science-500 px-3 py-2 text-sm font-semibold text-space-900 shadow-glow">{toast}</div>}
      {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)} />}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function NavLinkItem({ item, navClass }: { item: NavItem; navClass: (path: string) => string }) {
  if (item.children?.length) {
    return (
      <details className="rail-submenu">
        <summary className={navClass(item.path)} data-accent={item.accent ?? "science"} title={item.label}>
          <PhysicsIcon name={item.icon} className="h-4 w-4" />
          <span>{item.label}</span>
        </summary>
        <div className="rail-submenu-panel">
          {item.children.map((child) => (
            <RouterLink key={child.path} to={child.path} className={navClass(child.path)} data-accent={child.accent ?? "science"} title={child.label}>
              <PhysicsIcon name={child.icon} className="h-4 w-4" />
              <span>{child.label}</span>
            </RouterLink>
          ))}
        </div>
      </details>
    );
  }

  return (
    <RouterLink to={item.path} className={navClass(item.path)} data-accent={item.accent ?? "science"} title={item.label}>
      <PhysicsIcon name={item.icon} className="h-4 w-4" />
      <span>{item.label}</span>
    </RouterLink>
  );
}

function ShortcutOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="shortcut-backdrop" onClick={onClose}>
      <div className="shortcut-card" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-science-300">Keyboard shortcuts</h2>
          <button className="tool-btn" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <ShortcutGroup title="Canvas" items={[["Middle drag / Alt drag", "Pan"], ["Wheel / pinch", "Zoom"], ["G", "Toggle grid"], ["V", "Toggle vectors"], ["T", "Toggle trails"]]} />
          <ShortcutGroup title="Simulation" items={[["Ctrl+K", "Search"], ["Space", "Run / pause"], ["R", "Reset"], ["S", "Save"], ["Ctrl+E", "Export JSON"]]} />
          <ShortcutGroup title="Objects" items={[["Delete", "Delete selected"], ["Ctrl+C", "Copy selected"], ["Ctrl+V", "Paste copy"], ["F", "Add force arrow"], ["M", "Add ruler"]]} />
        </div>
      </div>
    </div>
  );
}

function ShortcutGroup({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <h3 className="mb-2 font-bold text-space-100">{title}</h3>
      <div className="space-y-2">
        {items.map(([key, label]) => <div key={key} className="flex items-center justify-between gap-3"><kbd>{key}</kbd><span className="text-space-300">{label}</span></div>)}
      </div>
    </div>
  );
}
