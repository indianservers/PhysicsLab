import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { dictionaryCategories, dictionaryStats, DictionaryCategory, PhysicsDictionaryTerm, physicsDictionary, normalizeDictionaryText } from "../lib/dictionary";
import { PhysicsIcon } from "../lib/icons";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function DictionaryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<DictionaryCategory | "all">((searchParams.get("category") as DictionaryCategory | null) ?? "all");
  const [letter, setLetter] = useState(searchParams.get("letter") ?? "all");
  const [selectedId, setSelectedId] = useState(searchParams.get("term") ?? physicsDictionary[0]?.id ?? "");

  const categoryCounts = useMemo(() => {
    return dictionaryCategories.reduce<Record<DictionaryCategory, number>>((counts, item) => {
      counts[item] = physicsDictionary.filter((term) => term.category === item).length;
      return counts;
    }, {} as Record<DictionaryCategory, number>);
  }, []);

  const availableLetters = useMemo(() => new Set(physicsDictionary.map((term) => term.term[0]?.toUpperCase()).filter(Boolean)), []);
  const filteredTerms = useMemo(() => {
    const q = normalizeDictionaryText(query);
    return physicsDictionary
      .filter((term) => category === "all" || term.category === category)
      .filter((term) => letter === "all" || term.term.toUpperCase().startsWith(letter))
      .filter((term) => {
        if (!q) return true;
        const text = normalizeDictionaryText(`${term.term} ${term.category} ${term.definition} ${term.example} ${term.formula ?? ""} ${term.tags.join(" ")}`);
        return text.includes(q);
      })
      .sort((left, right) => left.term.localeCompare(right.term));
  }, [category, letter, query]);

  const groupedTerms = useMemo(() => {
    return filteredTerms.reduce<Array<[string, PhysicsDictionaryTerm[]]>>((groups, term) => {
      const groupLetter = term.term[0]?.toUpperCase() ?? "#";
      const existing = groups.find(([item]) => item === groupLetter);
      if (existing) existing[1].push(term);
      else groups.push([groupLetter, [term]]);
      return groups;
    }, []);
  }, [filteredTerms]);

  const selected = filteredTerms.find((term) => term.id === selectedId)
    ?? filteredTerms[0]
    ?? physicsDictionary.find((term) => term.id === selectedId)
    ?? physicsDictionary[0];

  const updateParams = (next: { q?: string; category?: DictionaryCategory | "all"; letter?: string; term?: string }) => {
    const merged = {
      q: next.q ?? query,
      category: next.category ?? category,
      letter: next.letter ?? letter,
      term: next.term ?? selectedId,
    };
    const params = new URLSearchParams();
    if (merged.q.trim()) params.set("q", merged.q.trim());
    if (merged.category !== "all") params.set("category", merged.category);
    if (merged.letter !== "all") params.set("letter", merged.letter);
    if (merged.term) params.set("term", merged.term);
    setSearchParams(params, { replace: true });
  };

  const chooseCategory = (nextCategory: DictionaryCategory | "all") => {
    setCategory(nextCategory);
    updateParams({ category: nextCategory });
  };

  const chooseLetter = (nextLetter: string) => {
    setLetter(nextLetter);
    updateParams({ letter: nextLetter });
  };

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    updateParams({ q: nextQuery });
  };

  const selectTerm = (term: PhysicsDictionaryTerm) => {
    setSelectedId(term.id);
    updateParams({ term: term.id });
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setLetter("all");
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="ui-label">Dictionary module</p>
              <h1 className="text-3xl font-black text-gradient">Dictionary & Visual Dictionary</h1>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Search {dictionaryStats.terms} physics terms by name, formula, example, topic category, or alphabet. Each entry includes a compact visual cue for faster recall.
              </p>
            </div>
            <div className="grid min-w-[280px] gap-2 sm:grid-cols-3">
              <Metric label="Terms" value={dictionaryStats.terms} icon="book" />
              <Metric label="Topics" value={dictionaryStats.categories} icon="compass" />
              <Metric label="Formulas" value={dictionaryStats.formulas} icon="calculator" />
            </div>
          </div>
        </section>

        <section className="topic-lens-panel mt-4">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px_auto]">
            <label className="grid gap-1">
              <span className="ui-label">Search</span>
              <div className="formula-search-wrap">
                <PhysicsIcon name="search" className="h-4 w-4" />
                <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search velocity, TIR, photon, heat, formula..." />
              </div>
            </label>
            <label className="grid gap-1">
              <span className="ui-label">Topic category</span>
              <select className="select-field" value={category} onChange={(event) => chooseCategory(event.target.value as DictionaryCategory | "all")}>
                <option value="all">All categories</option>
                {dictionaryCategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <div className="flex items-end">
              <button className="hero-btn-secondary min-h-[44px]" type="button" onClick={resetFilters}>
                <PhysicsIcon name="step" className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Alphabetical filter">
            <button className={letter === "all" ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => chooseLetter("all")}>All</button>
            {alphabet.map((item) => (
              <button
                key={item}
                className={letter === item ? "focus-pill focus-pill-active" : "focus-pill"}
                type="button"
                disabled={!availableLetters.has(item)}
                onClick={() => chooseLetter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)_390px]">
          <aside className="panel h-fit p-3 xl:sticky xl:top-20">
            <p className="ui-label px-2 pb-2">Topic wise category</p>
            <div className="grid gap-1">
              <button className={category === "all" ? "formula-category-link active" : "formula-category-link"} type="button" onClick={() => chooseCategory("all")}>
                <PhysicsIcon name="book" className="h-4 w-4" />
                <span>All terms</span>
                <strong>{physicsDictionary.length}</strong>
              </button>
              {dictionaryCategories.map((item) => (
                <button key={item} className={category === item ? "formula-category-link active" : "formula-category-link"} type="button" onClick={() => chooseCategory(item)}>
                  <PhysicsIcon name={iconForDictionaryCategory(item)} className="h-4 w-4" />
                  <span>{item}</span>
                  <strong>{categoryCounts[item]}</strong>
                </button>
              ))}
            </div>
          </aside>

          <div className="desktop-main-scroll">
            <div className="formula-results-header mb-3">
              <div>
                <p className="ui-label">{filteredTerms.length} terms shown</p>
                <h2>{category === "all" ? "Alphabetical dictionary" : category}</h2>
              </div>
              <div className="formula-chip-row">
                <span className="status-chip status-chip-cyan"><PhysicsIcon name="search" className="h-3.5 w-3.5" />Searchable</span>
                <span className="status-chip"><PhysicsIcon name="eye" className="h-3.5 w-3.5" />Visual cues</span>
              </div>
            </div>

            {groupedTerms.length === 0 && (
              <div className="empty-state">
                <PhysicsIcon name="book" className="mx-auto h-8 w-8 text-science-300" />
                <h2 className="mt-3 text-xl font-black">No dictionary terms found</h2>
                <p className="mt-2 text-sm text-space-300">Try a broader keyword or clear the alphabet/category filters.</p>
                <button className="hero-btn-secondary mt-4" type="button" onClick={resetFilters}>Clear dictionary filters</button>
              </div>
            )}

            <div className="grid gap-4">
              {groupedTerms.map(([groupLetter, terms]) => (
                <section key={groupLetter} className="panel p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="grid h-10 w-10 place-items-center rounded-md bg-cyan-400/10 text-xl font-black text-cyan-500">{groupLetter}</h2>
                    <span className="status-chip">{terms.length} terms</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                    {terms.map((term) => (
                      <button
                        key={term.id}
                        className={selected?.id === term.id ? "enhanced-card concept-card concept-card-active text-left" : "enhanced-card concept-card text-left"}
                        type="button"
                        onClick={() => selectTerm(term)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-cyan-300/25 bg-cyan-400/10 text-cyan-500">
                            <PhysicsIcon name={term.visual} className="h-6 w-6" />
                          </span>
                          <span className="min-w-0">
                            <span className="ui-label">{term.category}</span>
                            <strong className="mt-1 block text-base font-black text-slate-800 dark:text-slate-100">{term.term}</strong>
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">{term.definition}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {term.tags.slice(0, 3).map((tag) => <span key={tag} className="status-chip">{tag}</span>)}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {selected && (
            <aside className="panel h-fit p-4 xl:sticky xl:top-20">
              <p className="ui-label">Visual dictionary card</p>
              <div className="mt-3 rounded-md border border-cyan-300/25 bg-[radial-gradient(circle_at_35%_25%,rgba(34,211,238,.16),transparent_45%),linear-gradient(135deg,rgba(15,23,42,.08),rgba(14,165,233,.08))] p-5 text-center dark:bg-[radial-gradient(circle_at_35%_25%,rgba(34,211,238,.20),transparent_45%),linear-gradient(135deg,rgba(15,23,42,.92),rgba(14,165,233,.12))]">
                <span className="mx-auto grid h-24 w-24 place-items-center rounded-md border border-cyan-200/30 bg-cyan-300/10 text-cyan-300 shadow-glow">
                  <PhysicsIcon name={selected.visual} className="h-12 w-12" />
                </span>
                <h2 className="mt-4 text-2xl font-black">{selected.term}</h2>
                <p className="mt-1 text-xs font-black uppercase tracking-widest text-cyan-500">{selected.category}</p>
              </div>
              <div className="mt-4 space-y-3">
                <InfoBlock label="Definition" text={selected.definition} />
                <InfoBlock label="Example" text={selected.example} />
                {selected.formula && (
                  <div className="rounded-md border border-amber-400/30 bg-amber-400/10 p-3">
                    <p className="ui-label text-amber-600 dark:text-amber-200">Formula</p>
                    <p className="mt-1 font-mono text-sm font-black text-slate-800 dark:text-amber-100">{selected.formula}</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="ui-label">Tags</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => <span key={tag} className="status-chip">{tag}</span>)}
                </div>
              </div>
            </aside>
          )}
        </section>
      </main>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: "book" | "compass" | "calculator"; label: string; value: number }) {
  return (
    <div className="metric-card flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-cyan-500">
        <PhysicsIcon name={icon} />
      </span>
      <div>
        <div className="ui-label">{label}</div>
        <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
      </div>
    </div>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-md border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="ui-label">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{text}</p>
    </div>
  );
}

function iconForDictionaryCategory(category: DictionaryCategory) {
  switch (category) {
    case "Measurement": return "ruler";
    case "Mechanics": return "gauge";
    case "Waves": return "wave";
    case "Optics": return "prism";
    case "Thermal Physics": return "thermometer";
    case "Electricity": return "battery";
    case "Magnetism": return "magnet";
    case "Modern Physics": return "atom";
    case "Fluids": return "drop";
    case "Astronomy": return "orbit";
  }
}
