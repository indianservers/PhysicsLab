import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAudioContext, setAudioEnabled, setMasterVolume } from "../lib/audioEngine";
import { saveProject } from "../lib/storage";
import { rawStateJson, serializeState } from "../lib/stateSerializer";
import { useLabStore } from "../store/useLabStore";
import { ProjectFile } from "../types";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export function Toolbar({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState("");
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [audioOn, setAudioOn] = useState(localStorage.getItem("audio_enabled") === "true");
  const [volume, setVolume] = useState(Number(localStorage.getItem("audio_volume") ?? 0.25));
  const [showShortcuts, setShowShortcuts] = useState(false);
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
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
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

  return (
    <header className="flex min-h-14 items-center gap-2 border-b border-slate-300/60 bg-white/80 px-3 backdrop-blur dark:border-lab-line dark:bg-slate-950/70">
      <RouterLink to="/" className="mr-2 whitespace-nowrap text-lg font-bold text-cyan-500">
        PhysicsLab 100
      </RouterLink>
      {!compact && <button className="tool-btn" title={t("toolbar.new")} onClick={resetSandbox}>{t("toolbar.new")}</button>}
      {!compact && <button className="tool-btn" onClick={() => inputRef.current?.click()}>{t("toolbar.open")}</button>}
      <button className="tool-btn" onClick={save}>{t("toolbar.save")}</button>
      <button className="tool-btn" title="Copy share link" onClick={share}>{t("toolbar.share")}</button>
      <button className="tool-btn" onClick={exportJson}>{t("toolbar.exportJson")}</button>
      {!compact && <button className="tool-btn" onClick={() => inputRef.current?.click()}>{t("toolbar.importJson")}</button>}
      {!compact && <button className="tool-btn" onClick={exportPng}>{t("toolbar.exportPng")}</button>}
      {!compact && <button className="tool-btn" onClick={() => window.print()}>{t("toolbar.exportPdf")}</button>}
      <span className="mx-1 h-7 w-px bg-slate-300 dark:bg-lab-line" />
      <button className="play-toggle" onClick={toggleRunning} aria-label={running ? t("toolbar.pause") : t("toolbar.run")}>
        <span className={running ? "play-icon is-running" : "play-icon"} />
        <span>{running ? t("toolbar.pause") : t("toolbar.run")}</span>
      </button>
      <button className="speed-chip" onClick={cycleSpeed} title="Cycle simulation speed">
        <span key={timeScale}>{timeScale}x</span>
      </button>
      <button className="tool-btn" onClick={stepSimulation}>{t("toolbar.step")}</button>
      <button className="tool-btn" onClick={resetSandbox}>{t("toolbar.reset")}</button>
      {!compact && <button className="tool-btn" onClick={() => setTimeScale(0.35)}>{t("toolbar.slowMotion")}</button>}
      <label className="toolbar-field">
        {t("toolbar.speed")}
        <input type="range" min="0.1" max="2" step="0.1" value={timeScale} onChange={(event) => setTimeScale(Number(event.target.value))} />
      </label>
      <label className="toolbar-field">
        {t("toolbar.gravity")}
        <input className="w-16 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800" type="number" step="0.1" value={gravity} onChange={(event) => setGravity(Number(event.target.value))} />
      </label>
      {!compact && <label className="toolbar-field">
        {t("toolbar.air")}
        <input type="checkbox" checked={airResistance} onChange={(event) => setAirResistance(event.target.checked)} />
      </label>}
      {!compact && <button className="tool-btn" onClick={resetViewport}>View {Math.round(viewport.zoom * 100)}%</button>}
      {running && latest && (
        <div className={energyGlow ? "live-readout energy-alert" : "live-readout"}>
          <span>t = {latest.t.toFixed(2)} s</span>
          <span>KE = {latest.kineticEnergy.toFixed(1)} J</span>
          <span>PE = {latest.potentialEnergy.toFixed(1)} J</span>
          <span>E = {(latest.totalEnergy ?? latest.kineticEnergy + latest.potentialEnergy).toFixed(1)} J</span>
        </div>
      )}
      <button className={compact ? "tool-btn ml-auto" : "tool-btn ml-auto"} title={t("toolbar.audio")} onClick={toggleAudio}>{audioOn ? "Sound On" : "Sound Off"}</button>
      <label className="toolbar-field" title={t("toolbar.volume")}>
        <input className="w-20" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => { const next = Number(event.target.value); setVolume(next); setMasterVolume(next); }} />
      </label>
      {!standalone && installPrompt && <button className="tool-btn" onClick={() => { void installPrompt.prompt(); setInstallPrompt(null); }}>{t("toolbar.install")}</button>}
      {!compact && <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={t("toolbar.theme")}>
        <span className={theme === "dark" ? "theme-orb dark" : "theme-orb"}>{theme === "dark" ? "Moon" : "Sun"}</span>
      </button>}
      {!compact && <RouterLink to="/video" className="tool-btn">{t("toolbar.video")}</RouterLink>}
      {!compact && <RouterLink to="/quantum" className="tool-btn">{t("toolbar.quantum")}</RouterLink>}
      {!compact && <RouterLink to="/lms-config" className="tool-btn">{t("toolbar.lms")}</RouterLink>}
      {!compact && <RouterLink to="/help" className="tool-btn">{t("toolbar.help")}</RouterLink>}
      <input ref={inputRef} className="hidden" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importJson(event.target.files[0])} />
      {toast && <div className="fixed right-4 top-16 z-50 rounded bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg">{toast}</div>}
      {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)} />}
    </header>
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
          <ShortcutGroup title="Simulation" items={[["Space", "Run / pause"], ["R", "Reset"], ["S", "Save"], ["+ / -", "Zoom in / out"]]} />
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
