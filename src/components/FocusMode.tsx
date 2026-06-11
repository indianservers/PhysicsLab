import { useEffect, useState } from "react";
import { PhysicsIcon } from "../lib/icons";

export function FocusMode() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && active) { setActive(false); return; }
      if (e.key === "F" && !e.ctrlKey && !e.metaKey && !e.shiftKey
          && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) {
        e.preventDefault();
        setActive((a) => !a);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    document.body.classList.toggle("focus-mode-active", active);
    return () => document.body.classList.remove("focus-mode-active");
  }, [active]);

  if (!active) {
    return (
      <button
        className="focus-mode-btn no-print"
        onClick={() => setActive(true)}
        title="Enter Focus Mode (F)"
        style={{ position: "fixed", bottom: "1.25rem", right: "1.25rem", zIndex: 50 }}
      >
        <PhysicsIcon name="eye" className="h-4 w-4" />
        <span>Focus</span>
      </button>
    );
  }

  return (
    <div className="focus-mode-overlay">
      <div className="focus-mode-strip visible">
        <span>Focus Mode · Press Esc to exit</span>
        <button className="focus-mode-exit" onClick={() => setActive(false)} title="Exit focus mode (Esc)">
          <PhysicsIcon name="eye" className="h-3.5 w-3.5" />
          <span>Exit</span>
        </button>
      </div>
    </div>
  );
}
