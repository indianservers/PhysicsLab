import { useEffect, useRef, useState } from "react";
import { Achievement, setAchievementCallback } from "../lib/achievements";

interface PendingAchievement {
  achievement: Achievement;
  totalXp: number;
  id: string;
}

const CONFETTI_COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#fb923c", "#f43f5e", "#facc15"];

function Confetti({ x, y }: { x: number; y: number }) {
  return (
    <div aria-hidden="true" style={{ position: "fixed", left: x, top: y, pointerEvents: "none", zIndex: 10001 }}>
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * 360;
        const dist = 40 + Math.random() * 60;
        const cx = Math.cos((angle * Math.PI) / 180) * dist;
        const cy = Math.sin((angle * Math.PI) / 180) * dist;
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              "--cx": `${cx}px`,
              "--cy": `${cy}px`,
              animationDelay: `${i * 20}ms`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

function AchievementToast({ item, onDone }: { item: PendingAchievement; onDone: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [confettiPos] = useState(() => ({ x: 100, y: window.innerHeight - 120 }));

  useEffect(() => {
    const t = window.setTimeout(() => {
      setExiting(true);
      window.setTimeout(onDone, 420);
    }, 3800);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <Confetti x={confettiPos.x} y={confettiPos.y} />
      <div className={`achievement-toast ${exiting ? "exiting" : ""}`} role="alert" aria-live="polite">
        <div className="achievement-badge-icon">{item.achievement.icon}</div>
        <div>
          <div className="achievement-toast-label">Achievement Unlocked!</div>
          <div className="achievement-toast-name">{item.achievement.name}</div>
          <div className="achievement-toast-xp">+{item.achievement.xp} XP · {item.totalXp} total</div>
        </div>
      </div>
    </>
  );
}

export function AchievementSystem() {
  const [queue, setQueue] = useState<PendingAchievement[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    setAchievementCallback((achievement, totalXp) => {
      const id = `ach-${counterRef.current++}`;
      setQueue((q) => [...q, { achievement, totalXp, id }]);
    });
    return () => setAchievementCallback(() => undefined);
  }, []);

  if (queue.length === 0) return null;

  const current = queue[0];
  return (
    <AchievementToast
      key={current.id}
      item={current}
      onDone={() => setQueue((q) => q.slice(1))}
    />
  );
}
