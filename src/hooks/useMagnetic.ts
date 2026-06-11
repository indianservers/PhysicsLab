import { RefObject, useEffect } from "react";

const REACH = 80;
const STRENGTH = 0.35;

export function useMagnetic(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < REACH) {
        const factor = (REACH - dist) / REACH * STRENGTH;
        el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      } else {
        el.style.transform = "";
      }
    };

    const onLeave = () => { el.style.transform = ""; };

    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    el.classList.add("magnetic");

    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
    };
  }, [ref]);
}
