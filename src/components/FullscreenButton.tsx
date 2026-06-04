import { MouseEvent, RefObject, useEffect, useState } from "react";
import { PhysicsIcon } from "../lib/icons";

interface FullscreenButtonProps {
  targetRef: RefObject<HTMLElement | null>;
  label?: string;
  compact?: boolean;
}

export function FullscreenButton({ targetRef, label = "Full screen", compact = false }: FullscreenButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const update = () => setActive(Boolean(targetRef.current && document.fullscreenElement === targetRef.current));
    document.addEventListener("fullscreenchange", update);
    update();
    return () => document.removeEventListener("fullscreenchange", update);
  }, [targetRef]);

  const toggle = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const target = targetRef.current;
    if (!target) return;
    if (document.fullscreenElement === target) {
      await document.exitFullscreen();
      return;
    }
    await target.requestFullscreen();
  };

  return (
    <button className={compact ? "fullscreen-btn fullscreen-btn-compact" : "fullscreen-btn"} type="button" onClick={toggle} title={active ? "Exit full screen" : label}>
      <PhysicsIcon name={active ? "download" : "eye"} className="h-4 w-4" />
      <span>{active ? "Exit" : label}</span>
    </button>
  );
}
