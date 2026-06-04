import { PhysicsIcon } from "../lib/icons";
import { uiEnhancements } from "../lib/uiEnhancements";

interface UIEnhancementPanelProps {
  compact?: boolean;
}

export function UIEnhancementPanel({ compact = false }: UIEnhancementPanelProps) {
  const categories = Array.from(new Set(uiEnhancements.map((item) => item.category)));
  const shown = compact ? uiEnhancements.slice(0, 12) : uiEnhancements;

  return (
    <details className={compact ? "ui-enhancement-panel lab-disclosure mt-4" : "ui-enhancement-panel lab-disclosure mt-6"} open={!compact}>
      <summary title="Review the 50 UI enhancements now applied across browsing, learning, visualization, controls, and accessibility.">
        <span className="inline-flex min-w-0 items-center gap-2">
          <PhysicsIcon name="spark" className="h-4 w-4 text-cyan-500" />
          <span className="truncate">50 UI enhancements applied</span>
        </span>
        <span className="status-chip status-chip-cyan shrink-0">{uiEnhancements.length} upgrades</span>
      </summary>
      <div className="lab-disclosure-body">
        {!compact && (
          <div className="ui-category-strip">
            {categories.map((category) => (
              <span key={category} className="status-chip">
                {category}
              </span>
            ))}
          </div>
        )}
        <div className={compact ? "ui-enhancement-grid ui-enhancement-grid-compact mt-3" : "ui-enhancement-grid mt-3"}>
          {shown.map((item) => (
            <article key={item.id} className="ui-enhancement-item" title={item.detail}>
              <span className="ui-enhancement-index">{item.id}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
                <PhysicsIcon name={item.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-black">{item.title}</h3>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.category}</span>
                </div>
                {!compact && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.detail}</p>}
              </div>
            </article>
          ))}
        </div>
        {compact && <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">Open the experiments library to review all 50 enhancements.</p>}
      </div>
    </details>
  );
}
