import { useEffect, useRef } from "react";

interface TrailDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const DOT_COUNT = 8;
const SPRING = 0.18;
const DAMPING = 0.72;

export function CursorTrail() {
  const dotsRef = useRef<TrailDot[]>(
    Array.from({ length: DOT_COUNT }, () => ({ x: -100, y: -100, vx: 0, vy: 0 }))
  );
  const targetRef = useRef({ x: -100, y: -100 });
  const elemsRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      const dots = dotsRef.current;
      const elems = elemsRef.current;
      let leader = targetRef.current;

      for (let i = 0; i < DOT_COUNT; i++) {
        const dot = dots[i];
        const dx = leader.x - dot.x;
        const dy = leader.y - dot.y;
        dot.vx = (dot.vx + dx * SPRING) * DAMPING;
        dot.vy = (dot.vy + dy * SPRING) * DAMPING;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const elem = elems[i];
        if (elem) {
          const scale = 1 - i * 0.09;
          const alpha = (1 - i / DOT_COUNT) * 0.75;
          elem.style.left = `${dot.x}px`;
          elem.style.top = `${dot.y}px`;
          elem.style.transform = `translate(-50%, -50%) scale(${scale})`;
          elem.style.opacity = String(alpha);
        }
        leader = dot;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true">
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <div
          key={i}
          className="cursor-trail-dot"
          ref={(el) => { if (el) elemsRef.current[i] = el; }}
          style={{
            width: `${8 - i * 0.6}px`,
            height: `${8 - i * 0.6}px`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
