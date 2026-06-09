import { ReactNode, useEffect, useRef, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAudioContext, setAudioEnabled, setMasterVolume } from "../lib/audioEngine";
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
};

const primaryNavItems: NavItem[] = [
  { label: "Experiments", path: "/experiments", icon: "flask" },
  { label: "Solver", path: "/solver", icon: "calculator" },
  { label: "Quiz", path: "/quiz", icon: "check" },
  { label: "Syllabus", path: "/syllabus", icon: "book" },
  { label: "Concepts", path: "/concepts", icon: "spark" },
  { label: "Lab", path: "/lab", icon: "compass" },
  { label: "Teacher", path: "/teacher", icon: "teacher" },
];

const topicNavItems: NavItem[] = [
  { label: "Mechanics", path: "/topics/mechanics", icon: "gauge" },
  { label: "Waves", path: "/topics/waves", icon: "wave" },
  { label: "Optics", path: "/topics/optics", icon: "prism" },
  { label: "Electricity", path: "/topics/electricity", icon: "battery" },
  { label: "Magnetism", path: "/topics/magnetism", icon: "magnet" },
  { label: "Thermodynamics", path: "/topics/thermodynamics", icon: "thermometer" },
  { label: "Modern Physics", path: "/topics/modern-physics", icon: "atom" },
  { label: "Fluid Mechanics", path: "/topics/fluid-mechanics", icon: "drop" },
  { label: "Oscillations", path: "/topics/oscillations", icon: "spring" },
  { label: "Astronomy", path: "/topics/astronomy", icon: "orbit" },
  { label: "Measurement", path: "/topics/measurement", icon: "ruler" },
  { label: "Electronics", path: "/topics/electronics", icon: "spark" },
  { label: "Energy", path: "/topics/energy", icon: "flame" },
];

const toolNavItems: NavItem[] = [
  { label: "Sandbox", path: "/sandbox", icon: "spark" },
  { label: "Video Analysis", path: "/video", icon: "eye" },
  { label: "Quantum Lab", path: "/quantum", icon: "atom" },
  { label: "Graphs", path: "/graphs", icon: "chart" },
  { label: "Projects", path: "/projects", icon: "folder" },
];

const adminNavItems: NavItem[] = [
  { label: "LMS Config", path: "/lms-config", icon: "clipboard" },
  { label: "Settings", path: "/settings", icon: "settings" },
  { label: "Help", path: "/help", icon: "book" },
];

const legalNavItems: NavItem[] = [
  { label: "Privacy", path: "/privacy", icon: "eye" },
  { label: "Terms", path: "/terms", icon: "clipboard" },
];

export function Toolbar({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState("");
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [audioOn, setAudioOn] = useState(localStorage.getItem("audio_enabled") === "true");
  const [volume, setVolume] = useState(Number(localStorage.getItem("audio_volume") ?? 0.25));
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone;
  const {
    objects,
    running,
    toggleRunning,
    resetSandbox,
    stepSimulation,
    gravity,
    setGravity,
    timeScale,
    setTimeScale,
    airResistance,
    setAirResistance,
    showGrid,
    showVectors,
    viewport,
    resetViewport,
    theme,
    setTheme,
    toProject,
    loadProject,
  } = useLabStore();
  const latest = useLabStore((state) => state.graphData[state.graphData.length - 1]);
  const previous = useLabStore((state) => state.graphData[state.graphData.length - 2]);
  const energyGlow = latest?.totalEnergy && previous?.totalEnergy && latest.totalEnergy > previous.totalEnergy * 1.08;

  const exportJson = () => {
    const blob = new Blob([rawStateJson(objects, { gravity, timeScale, airResistance, showGrid, showVectors })], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "physicslab-shared-state.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    const encoded = await serializeState(objects, { gravity, timeScale, airResistance, showGrid, showVectors });
    const url = `${window.location.origin}${window.location.pathname}?lab=${encoded}`;
    await navigator.clipboard.writeText(url);
    setToast(t("toast.linkCopied"));
    window.setTimeout(() => setToast(""), 2000);
  };

  const exportPng = () => {
    const canvas = document.querySelector<HTMLCanvasElement>("[data-physics-canvas='true']");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "physicslab-canvas.png";
    link.click();
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

  const save = async () => {
    await saveProject(toProject("PhysicsLab 100 Project"));
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
        save();
      }
      if (event.key === "?") {
        event.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeinstallprompt", onInstall);
    };
  });

  const toggleAudio = async () => {
    const next = !audioOn;
    setAudioOn(next);
    setAudioEnabled(next);
    const ctx = getAudioContext();
    if (next) await ctx?.resume();
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 1, 2, 4];
    const current = speeds.findIndex((speed) => speed === timeScale);
    setTimeScale(speeds[(current + 1 + speeds.length) % speeds.length]);
  };
  const navClass = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`) ? "nav-chip nav-chip-active" : "nav-chip";

  return (
    <header className="app-toolbar">
      <RouterLink to="/" className="brand-mark" aria-label="PhysicsLab 100 home">
        <PhysicsIcon name="atom" className="h-5 w-5" />
        <span>PhysicsLab 100</span>
      </RouterLink>
      {!compact && (
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {primaryNavItems.map((item) => (
            <NavLinkItem key={item.path} item={item} navClass={navClass} />
          ))}
        </nav>
      )}
      <span className="mx-1 hidden h-7 w-px bg-slate-300 dark:bg-lab-line xl:block" />
      {!compact && (
        <button className="tool-btn hidden min-w-[210px] justify-start sm:inline-flex" title="Search experiments, topics, formulae, solver questions, and lab tools" data-tooltip="Search experiments, topics, formulae, solver questions, and lab tools" onClick={() => setSearchOpen(true)}>
          <PhysicsIcon name="search" className="h-4 w-4" />
          <span className="min-w-0 flex-1 text-left">Search physics</span>
          <kbd className="rounded border border-slate-300/70 px-1.5 py-0.5 text-[10px] font-black dark:border-white/20">Ctrl K</kbd>
        </button>
      )}
      <ToolbarMenu icon="folder" label="File" tooltip="New, open, save, import, export">
        {!compact && <ToolbarAction icon="spark" label={t("toolbar.new")} tooltip="Clear the canvas and start a fresh lab" onClick={resetSandbox} />}
        {!compact && <ToolbarAction icon="folder" label={t("toolbar.open")} tooltip="Open a saved project JSON file" onClick={() => inputRef.current?.click()} />}
        <ToolbarAction icon="save" label={t("toolbar.save")} tooltip="Save this project in browser storage" onClick={save} />
        <ToolbarAction icon="clipboard" label={t("toolbar.share")} tooltip="Copy a shareable lab-state link" onClick={share} />
        <ToolbarAction icon="download" label={t("toolbar.exportJson")} tooltip="Download the current lab as JSON" onClick={exportJson} />
        {!compact && <ToolbarAction icon="upload" label={t("toolbar.importJson")} tooltip="Import a JSON lab file" onClick={() => inputRef.current?.click()} />}
        {!compact && <ToolbarAction icon="download" label={t("toolbar.exportPng")} tooltip="Export the canvas as a PNG image" onClick={exportPng} />}
        {!compact && <ToolbarAction icon="printer" label={t("toolbar.exportPdf")} tooltip="Open browser print or PDF export" onClick={() => window.print()} />}
      </ToolbarMenu>
      <span className="mx-1 h-7 w-px bg-slate-300 dark:bg-lab-line" />
      <button className="play-toggle" onClick={toggleRunning} aria-label={running ? t("toolbar.pause") : t("toolbar.run")}>
        <span className={running ? "play-icon is-running" : "play-icon"} />
        <span>{running ? t("toolbar.pause") : t("toolbar.run")}</span>
      </button>
      <button className="speed-chip" onClick={cycleSpeed} title="Cycle simulation speed">
        <span key={timeScale}>{timeScale}x</span>
      </button>
      <ToolbarMenu icon="settings" label="Sim" tooltip="Simulation controls and environment">
        <ToolbarAction icon="step" label={t("toolbar.step")} tooltip="Advance the simulation one tick" onClick={stepSimulation} />
        <ToolbarAction icon="spark" label={t("toolbar.reset")} tooltip="Reset objects and simulation time" onClick={resetSandbox} />
        {!compact && <ToolbarAction icon="gauge" label={t("toolbar.slowMotion")} tooltip="Set speed to 0.35x for careful observation" onClick={() => setTimeScale(0.35)} />}
        {!compact && <ToolbarAction icon="eye" label={`View ${Math.round(viewport.zoom * 100)}%`} tooltip="Reset zoom and pan to the full canvas" onClick={resetViewport} />}
        <label className="toolbar-field toolbar-field-menu" data-tooltip="Time multiplier for the physics engine">
          {t("toolbar.speed")}
          <input type="range" min="0.1" max="2" step="0.1" value={timeScale} onChange={(event) => setTimeScale(Number(event.target.value))} />
        </label>
        <label className="toolbar-field toolbar-field-menu" data-tooltip="Acceleration due to gravity in m/s^2">
          {t("toolbar.gravity")}
          <input className="w-16 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800" type="number" step="0.1" value={gravity} onChange={(event) => setGravity(Number(event.target.value))} />
        </label>
        {!compact && <label className="toolbar-field toolbar-field-menu" data-tooltip="Adds a simple drag force to moving objects">
          {t("toolbar.air")}
          <input type="checkbox" checked={airResistance} onChange={(event) => setAirResistance(event.target.checked)} />
        </label>}
      </ToolbarMenu>
      {running && latest && (
        <div className={energyGlow ? "live-readout energy-alert" : "live-readout"}>
          <span>t = {latest.t.toFixed(2)} s</span>
          <span>KE = {latest.kineticEnergy.toFixed(1)} J</span>
          <span>PE = {latest.potentialEnergy.toFixed(1)} J</span>
          <span>E = {(latest.totalEnergy ?? latest.kineticEnergy + latest.potentialEnergy).toFixed(1)} J</span>
        </div>
      )}
      <button className={compact ? "tool-btn ml-auto" : "tool-btn ml-auto"} title={t("toolbar.audio")} data-tooltip={t("toolbar.audio")} onClick={toggleAudio}><PhysicsIcon name="volume" className="h-4 w-4" />{audioOn ? "Sound On" : "Sound Off"}</button>
      <label className="toolbar-field" title={t("toolbar.volume")} data-tooltip={t("toolbar.volume")}>
        <input className="w-20" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => { const next = Number(event.target.value); setVolume(next); setMasterVolume(next); }} />
      </label>
      {!standalone && installPrompt && <ToolbarAction icon="download" label={t("toolbar.install")} tooltip="Install the app for offline browser use" onClick={() => { void installPrompt.prompt(); setInstallPrompt(null); }} />}
      {!compact && <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={t("toolbar.theme")}>
        <span className={theme === "dark" ? "theme-orb dark" : "theme-orb"}><PhysicsIcon name={theme === "dark" ? "moon" : "sun"} className="h-4 w-4" /></span>
      </button>}
      {!compact && (
        <ToolbarMenu icon="menu" label="Menu" tooltip="Simple navigation with all pages and nested sections">
          <div className="toolbar-menu-section">
            <span className="toolbar-menu-label">Main</span>
            {primaryNavItems.map((item) => (
              <NavLinkItem key={item.path} item={item} navClass={navClass} />
            ))}
          </div>
          <ToolbarSubMenu icon="book" label="Learn" tooltip="Topics, quiz, and guided study">
            <NavLinkItem item={{ label: "Physics Syllabus", path: "/syllabus", icon: "book" }} navClass={navClass} />
            <NavLinkItem item={{ label: "Concept Library", path: "/concepts", icon: "spark" }} navClass={navClass} />
            <NavLinkItem item={{ label: "Student Roadmap", path: "/roadmap", icon: "compass" }} navClass={navClass} />
            <NavLinkItem item={{ label: "All Topics", path: "/topics", icon: "book" }} navClass={navClass} />
            <NavLinkItem item={{ label: "Quiz", path: "/quiz", icon: "check" }} navClass={navClass} />
            <ToolbarSubMenu icon="book" label="Topic Chapters" tooltip="Open a specific physics topic">
              {topicNavItems.map((item) => (
                <NavLinkItem key={item.path} item={item} navClass={navClass} />
              ))}
            </ToolbarSubMenu>
          </ToolbarSubMenu>
          <ToolbarSubMenu icon="compass" label="Lab Tools" tooltip="Simulator, analysis, quantum, graphs, and projects">
            {toolNavItems.map((item) => (
              <NavLinkItem key={item.path} item={item} navClass={navClass} />
            ))}
          </ToolbarSubMenu>
          <ToolbarSubMenu icon="settings" label="Admin" tooltip="Configuration, help, and app documents">
            {adminNavItems.map((item) => (
              <NavLinkItem key={item.path} item={item} navClass={navClass} />
            ))}
            <ToolbarSubMenu icon="clipboard" label="Documents" tooltip="Privacy and terms">
              {legalNavItems.map((item) => (
                <NavLinkItem key={item.path} item={item} navClass={navClass} />
              ))}
            </ToolbarSubMenu>
          </ToolbarSubMenu>
        </ToolbarMenu>
      )}
      <input ref={inputRef} className="hidden" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importJson(event.target.files[0])} />
      {toast && <div className="fixed right-4 top-16 z-50 rounded bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg">{toast}</div>}
      {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)} />}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function NavLinkItem({ item, navClass }: { item: NavItem; navClass: (path: string) => string }) {
  return (
    <RouterLink to={item.path} className={navClass(item.path)} title={item.label}>
      <PhysicsIcon name={item.icon} className="h-4 w-4" />
      <span>{item.label}</span>
    </RouterLink>
  );
}

function ToolbarAction({ icon, label, tooltip, onClick }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; tooltip: string; onClick: () => void }) {
  return (
    <button className="tool-btn" title={tooltip} data-tooltip={tooltip} onClick={onClick}>
      <PhysicsIcon name={icon} className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function ToolbarMenu({ icon, label, tooltip, children }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; tooltip: string; children: ReactNode }) {
  return (
    <details className="toolbar-menu">
      <summary title={tooltip} data-tooltip={tooltip}>
        <PhysicsIcon name={icon} className="h-4 w-4" />
        <span>{label}</span>
      </summary>
      <div className="toolbar-menu-panel">
        {children}
      </div>
    </details>
  );
}

function ToolbarSubMenu({ icon, label, tooltip, children }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; tooltip: string; children: ReactNode }) {
  return (
    <details className="toolbar-submenu">
      <summary title={tooltip}>
        <PhysicsIcon name={icon} className="h-4 w-4" />
        <span>{label}</span>
      </summary>
      <div className="toolbar-submenu-panel">
        {children}
      </div>
    </details>
  );
}

function ShortcutOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="shortcut-backdrop" onClick={onClose}>
      <div className="shortcut-card" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-cyan-300">Keyboard shortcuts</h2>
          <button className="tool-btn" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <ShortcutGroup title="Canvas" items={[["Middle drag / Alt drag", "Pan"], ["Wheel / pinch", "Zoom"], ["G", "Toggle grid"], ["V", "Toggle vectors"], ["T", "Toggle trails"]]} />
          <ShortcutGroup title="Simulation" items={[["Ctrl+K", "Search"], ["Space", "Run / pause"], ["R", "Reset"], ["S", "Save"], ["+ / -", "Zoom in / out"]]} />
          <ShortcutGroup title="Objects" items={[["Delete", "Delete selected"], ["Ctrl+C", "Copy selected"], ["Ctrl+V", "Paste copy"], ["F", "Add force arrow"], ["M", "Add ruler"]]} />
        </div>
      </div>
    </div>
  );
}

function ShortcutGroup({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <h3 className="mb-2 font-bold text-slate-100">{title}</h3>
      <div className="space-y-2">
        {items.map(([key, label]) => <div key={key} className="flex items-center justify-between gap-3"><kbd>{key}</kbd><span className="text-slate-300">{label}</span></div>)}
      </div>
    </div>
  );
}
