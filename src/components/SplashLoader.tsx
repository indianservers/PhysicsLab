import { useEffect, useState } from "react";

const SPLASH_KEY = "physicslab-splash-v1";

export function SplashLoader() {
  const [phase, setPhase] = useState<"showing" | "done" | "gone">("showing");

  useEffect(() => {
    const seen = sessionStorage.getItem(SPLASH_KEY);
    if (seen) { setPhase("gone"); return; }
    const t = window.setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(SPLASH_KEY, "1");
      window.setTimeout(() => setPhase("gone"), 420);
    }, 1800);
    return () => window.clearTimeout(t);
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`splash-loader ${phase === "done" ? "done" : ""}`} aria-hidden="true">
      <div className="splash-atom">
        <div className="splash-nucleus" />
        <div className="splash-ring splash-ring-1" />
        <div className="splash-ring splash-ring-2" />
        <div className="splash-ring splash-ring-3" />
      </div>
      <div className="splash-title">PhysicsLab 100</div>
      <div className="splash-sub">Interactive Physics Explorer</div>
      <div className="splash-progress">
        <div className="splash-progress-bar" />
      </div>
    </div>
  );
}
