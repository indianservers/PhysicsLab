import { GuideContent } from "../lib/guides";
import { PhysicsIcon } from "../lib/icons";

export function GuidePanel({ guide, defaultOpen = false, compact = false }: { guide: GuideContent; defaultOpen?: boolean; compact?: boolean }) {
  return (
    <details className={compact ? "guide-panel guide-panel-compact" : "guide-panel"} open={defaultOpen}>
      <summary>
        <span className="inline-flex items-center gap-2">
          <PhysicsIcon name="book" className="h-4 w-4" />
          Guide
        </span>
        <span className="guide-title">{guide.title}</span>
      </summary>
      <div className={compact ? "mt-3 grid gap-3" : "mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"}>
        <div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{guide.intent}</div>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {guide.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className="grid gap-3">
          {guide.checks && guide.checks.length > 0 && (
            <div className="rounded-md border border-cyan-400/30 bg-cyan-400/10 p-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-500"><PhysicsIcon name="check" className="h-4 w-4" />Checkpoints</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                {guide.checks.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
          {guide.tips && guide.tips.length > 0 && (
            <div className="rounded-md border border-amber-400/35 bg-amber-400/10 p-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-500"><PhysicsIcon name="spark" className="h-4 w-4" />Avoid</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                {guide.tips.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </details>
  );
}
