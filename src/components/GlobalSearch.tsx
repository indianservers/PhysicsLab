import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { PhysicsIcon } from "../lib/icons";
import { searchAll, SearchResult, searchCounts, searchTokens, suggestedSearches } from "../lib/search";

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

const typeLabels: Record<SearchResult["type"], string> = {
  experiment: "Experiments",
  topic: "Syllabus",
  formula: "Formulae",
  solver: "Solver",
  quiz: "Quiz",
  object: "Lab objects",
};

const typeTint: Record<SearchResult["type"], string> = {
  experiment: "from-cyan-300 to-blue-500",
  topic: "from-emerald-300 to-teal-500",
  formula: "from-amber-200 to-orange-500",
  solver: "from-violet-300 to-fuchsia-500",
  quiz: "from-lime-200 to-emerald-500",
  object: "from-rose-200 to-cyan-400",
};

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => searchAll(query, 42), [query]);
  const tokens = useMemo(() => searchTokens(query), [query]);
  const counts = useMemo(() => searchCounts(), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const grouped = results.reduce<Array<[SearchResult["type"], SearchResult[]]>>((groups, result) => {
    const existing = groups.find(([type]) => type === result.type);
    if (existing) existing[1].push(result);
    else groups.push([result.type, [result]]);
    return groups;
  }, []);

  const runSearch = (nextQuery: string) => {
    setQuery(nextQuery);
    window.setTimeout(() => inputRef.current?.focus(), 20);
  };

  const openResult = (result = results[activeIndex]) => {
    if (!result) return;
    navigate(result.path);
    onClose();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(results.length - 1, index + 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      openResult();
    }
  };

  let globalIndex = -1;

  return createPortal(
    <div className="fixed inset-0 overflow-y-auto bg-slate-950/80 px-3 py-4 text-slate-100 backdrop-blur-xl sm:px-5 sm:py-8" style={{ zIndex: 1000 }} role="dialog" aria-modal="true" aria-label="Search physics content" onMouseDown={onClose}>
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(100deg,rgba(34,211,238,.3),rgba(250,204,21,.16),rgba(236,72,153,.26),rgba(59,130,246,.24))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.09)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
      </div>
      <section className="relative mx-auto min-h-[520px] max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-slate-950/92 shadow-2xl shadow-cyan-950/40" onMouseDown={(event) => event.stopPropagation()}>
        <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,.14),rgba(245,158,11,.12),rgba(217,70,239,.14))] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-200/30 bg-cyan-300/10 text-cyan-200">
              <PhysicsIcon name="search" className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-slate-950/75 px-3 py-2 shadow-inner shadow-black/30">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={onKeyDown}
                  className="min-w-0 flex-1 bg-transparent text-lg font-black text-white outline-none placeholder:text-slate-500"
                  placeholder="Search prism, TIR, Ohm, projectile, formulae..."
                  aria-label="Search"
                />
                <kbd className="hidden rounded border border-white/15 bg-white/10 px-2 py-1 text-xs font-bold text-slate-300 sm:inline">Esc</kbd>
              </div>
            </div>
            <button className="tool-btn shrink-0 border-white/15 bg-white/10 text-white hover:bg-white/20" onClick={onClose} title="Close search">
              Close
            </button>
          </div>
          <div className="mt-4 grid gap-2 text-xs font-bold uppercase tracking-wide text-slate-300 sm:grid-cols-6">
            {Object.entries(counts).map(([type, count]) => (
              <div key={type} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                <span className={`mr-2 inline-block h-2 w-2 rounded-full bg-gradient-to-r ${typeTint[type as SearchResult["type"]]}`} />
                {typeLabels[type as SearchResult["type"]]} {count}
              </div>
            ))}
          </div>
        </div>

        {!query.trim() && (
          <div className="grid gap-5 p-4 sm:grid-cols-[1fr_320px] sm:p-5">
            <div>
              <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-cyan-200">Start with a concept</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestedSearches.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-cyan-200/50 hover:bg-cyan-300/10"
                    onClick={() => runSearch(suggestion)}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-300/10 text-cyan-200 transition group-hover:bg-cyan-300/20">
                      <PhysicsIcon name={suggestion.toLowerCase().includes("ohm") ? "battery" : suggestion.toLowerCase().includes("prism") || suggestion.toLowerCase().includes("critical") ? "prism" : "spark"} className="h-4 w-4" />
                    </span>
                    <span className="font-black text-white">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-sm font-black text-white">Indexed universe</div>
              <div className="mt-3 space-y-3 text-sm text-slate-300">
                <SearchStat label="Experiment demos" value={counts.experiment} />
                <SearchStat label="Physics formulae" value={counts.formula} />
                <SearchStat label="Solver paths" value={counts.solver} />
                <SearchStat label="Lab tools" value={counts.object} />
              </div>
            </div>
          </div>
        )}

        {query.trim() && (
          <div className="max-h-[68vh] overflow-y-auto p-3 sm:p-5">
            {results.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.04] p-8 text-center">
                <div className="text-lg font-black text-white">No matches yet</div>
                <p className="mt-2 text-sm text-slate-400">Try a concept, formula symbol, class topic, experiment name, or lab object.</p>
              </div>
            )}

            {grouped.map(([type, items]) => (
              <div key={type} className="mb-5 last:mb-0">
                <div className="mb-2 flex items-center gap-2 px-1 text-xs font-black uppercase tracking-wide text-slate-400">
                  <span className={`h-2 w-10 rounded-full bg-gradient-to-r ${typeTint[type]}`} />
                  {typeLabels[type]}
                </div>
                <div className="grid gap-2">
                  {items.map((result) => {
                    globalIndex += 1;
                    const itemIndex = globalIndex;
                    const active = itemIndex === activeIndex;
                    return (
                      <button
                        key={result.id}
                        className={active ? "group flex w-full items-start gap-3 rounded-xl border border-cyan-200/50 bg-cyan-300/[0.12] p-3 text-left shadow-lg shadow-cyan-950/30" : "group flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-cyan-200/40 hover:bg-white/[0.075]"}
                        onMouseEnter={() => setActiveIndex(itemIndex)}
                        onClick={() => openResult(result)}
                      >
                        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${typeTint[type]} text-slate-950 shadow-lg shadow-black/20`}>
                          <PhysicsIcon name={result.icon} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-black text-white sm:text-base">{highlight(result.title, tokens)}</span>
                          <span className="mt-1 block text-xs font-bold text-cyan-100/80">{result.subtitle}</span>
                          <span className="mt-1 block text-sm text-slate-300">{highlight(result.snippet, tokens)}</span>
                        </span>
                        <span className="hidden rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs font-bold text-slate-300 sm:inline">
                          Open
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>,
    document.body
  );
}

function SearchStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
      <span>{label}</span>
      <span className="font-black text-cyan-200">{value}</span>
    </div>
  );
}

function highlight(text: string, tokens: string[]) {
  const hits = tokens.filter((token) => token.length > 1).slice(0, 6);
  if (!hits.length) return text;
  const pattern = new RegExp(`(${hits.map(escapeRegExp).join("|")})`, "ig");
  return text.split(pattern).map((part, index) =>
    hits.some((token) => part.toLowerCase() === token.toLowerCase()) ? (
      <mark key={`${part}-${index}`} className="rounded bg-amber-300/25 px-0.5 font-black text-amber-100">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
