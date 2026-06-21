import { CSSProperties, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { dictionaryCategories, dictionaryStats, DictionaryCategory, PhysicsDictionaryTerm, physicsDictionary, normalizeDictionaryText } from "../lib/dictionary";
import { PhysicsIcon, PhysicsIconName } from "../lib/icons";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const visualSpotlightIds = [
  "standard-model-particle-physics",
  "quantum-field-theory",
  "atom",
  "nuclear-fission",
  "photoelectric-effect",
  "de-broglie-wave",
  "blackbody-radiation",
  "compton-effect",
  "schrodinger-equation",
  "total-internal-reflection",
  "electromagnetic-induction",
  "black-hole",
];

const categoryTone: Record<DictionaryCategory, { accent: string; soft: string; scene: VisualSceneKind }> = {
  Measurement: { accent: "#2563eb", soft: "rgba(37, 99, 235, 0.12)", scene: "measurement" },
  Mechanics: { accent: "#ea580c", soft: "rgba(234, 88, 12, 0.13)", scene: "mechanics" },
  Waves: { accent: "#0891b2", soft: "rgba(8, 145, 178, 0.14)", scene: "waves" },
  Optics: { accent: "#7c3aed", soft: "rgba(124, 58, 237, 0.13)", scene: "optics" },
  "Thermal Physics": { accent: "#dc2626", soft: "rgba(220, 38, 38, 0.12)", scene: "thermal" },
  Electricity: { accent: "#ca8a04", soft: "rgba(202, 138, 4, 0.15)", scene: "electricity" },
  Magnetism: { accent: "#0d9488", soft: "rgba(13, 148, 136, 0.13)", scene: "magnetism" },
  "Modern Physics": { accent: "#9333ea", soft: "rgba(147, 51, 234, 0.13)", scene: "modern" },
  Fluids: { accent: "#0284c7", soft: "rgba(2, 132, 199, 0.13)", scene: "fluids" },
  Astronomy: { accent: "#4f46e5", soft: "rgba(79, 70, 229, 0.14)", scene: "astronomy" },
};

type VisualSceneKind =
  | "measurement"
  | "mechanics"
  | "waves"
  | "optics"
  | "thermal"
  | "electricity"
  | "magnetism"
  | "modern"
  | "fluids"
  | "astronomy";

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

  const spotlightTerms = useMemo(() => {
    const preferred = visualSpotlightIds
      .map((id) => physicsDictionary.find((term) => term.id === id || term.id.includes(id)))
      .filter(Boolean) as PhysicsDictionaryTerm[];
    const fallback = physicsDictionary.filter((term) => term.category === "Modern Physics").slice(0, 12);
    return uniqueTerms([...preferred, ...fallback]).slice(0, 12);
  }, []);

  const topicPanels = useMemo(() => {
    return dictionaryCategories.map((item) => {
      const terms = physicsDictionary.filter((term) => term.category === item);
      return {
        category: item,
        count: terms.length,
        formulas: terms.filter((term) => term.formula).length,
        sample: terms.slice(0, 4),
      };
    });
  }, []);

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
    updateParams({ category: nextCategory, letter: "all" });
    setLetter("all");
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
      <main id="content" className="desktop-page visual-dictionary-page">
        <section className="visual-dictionary-hero">
          <div className="visual-hero-copy">
            <p className="ui-label">Visual dictionary module</p>
            <h1>Physics Visual Dictionary</h1>
            <p>
              A searchable illustrated atlas of physics terms, grouped by topic and alphabet, with formulas,
              memory cues, examples, and strong visual anchors for fast recall.
            </p>
            <div className="visual-hero-actions">
              <a className="hero-btn-primary" href="#visual-dictionary-search">
                <PhysicsIcon name="search" className="h-4 w-4" />
                Explore terms
              </a>
              <a className="hero-btn-secondary" href="#visual-dictionary-atlas">
                <PhysicsIcon name="eye" className="h-4 w-4" />
                View atlas
              </a>
            </div>
          </div>
          <div className="visual-hero-board" aria-hidden="true">
            <div className="visual-hero-orbit visual-hero-orbit-a" />
            <div className="visual-hero-orbit visual-hero-orbit-b" />
            <div className="visual-hero-core">
              <PhysicsIcon name="atom" className="h-16 w-16" />
            </div>
            <div className="visual-hero-badge visual-hero-badge-a">Quantum</div>
            <div className="visual-hero-badge visual-hero-badge-b">Forces</div>
            <div className="visual-hero-badge visual-hero-badge-c">Fields</div>
          </div>
          <div className="visual-hero-stats">
            <Metric label="Terms" value={dictionaryStats.terms} icon="book" />
            <Metric label="Topics" value={dictionaryStats.categories} icon="compass" />
            <Metric label="Formulas" value={dictionaryStats.formulas} icon="calculator" />
          </div>
        </section>

        <section id="visual-dictionary-atlas" className="visual-atlas-panel">
          <div className="visual-section-head">
            <div>
              <p className="ui-label">Illustrated concept atlas</p>
              <h2>High-memory visual cards</h2>
            </div>
            <div className="formula-chip-row">
              <span className="status-chip status-chip-cyan"><PhysicsIcon name="eye" className="h-3.5 w-3.5" />Diagram cues</span>
              <span className="status-chip"><PhysicsIcon name="search" className="h-3.5 w-3.5" />Search linked</span>
            </div>
          </div>
          <div className="visual-spotlight-grid">
            {spotlightTerms.map((term, index) => (
              <button
                key={term.id}
                className={selected?.id === term.id ? "visual-poster-card visual-poster-card-active" : "visual-poster-card"}
                type="button"
                style={{ "--term-accent": categoryTone[term.category].accent, "--term-soft": categoryTone[term.category].soft } as CSSProperties}
                onClick={() => selectTerm(term)}
              >
                <span className="visual-poster-number">{String(index + 1).padStart(2, "0")}</span>
                <VisualScene kind={categoryTone[term.category].scene} icon={term.visual} />
                <span className="visual-poster-topic">{term.category}</span>
                <strong>{term.term}</strong>
                <span>{term.definition}</span>
                {term.formula && <code>{term.formula}</code>}
              </button>
            ))}
          </div>
        </section>

        <section className="visual-topic-panel">
          <div className="visual-section-head">
            <div>
              <p className="ui-label">Topic wise category</p>
              <h2>Physics domains at a glance</h2>
            </div>
          </div>
          <div className="visual-topic-grid">
            <button
              className={category === "all" ? "visual-topic-card visual-topic-card-active" : "visual-topic-card"}
              type="button"
              onClick={() => chooseCategory("all")}
            >
              <span className="visual-topic-icon"><PhysicsIcon name="book" /></span>
              <strong>All terms</strong>
              <small>{physicsDictionary.length} entries across every topic</small>
            </button>
            {topicPanels.map((panel) => (
              <button
                key={panel.category}
                className={category === panel.category ? "visual-topic-card visual-topic-card-active" : "visual-topic-card"}
                type="button"
                style={{ "--term-accent": categoryTone[panel.category].accent, "--term-soft": categoryTone[panel.category].soft } as CSSProperties}
                onClick={() => chooseCategory(panel.category)}
              >
                <span className="visual-topic-icon"><PhysicsIcon name={iconForDictionaryCategory(panel.category)} /></span>
                <strong>{panel.category}</strong>
                <small>{panel.count} terms, {panel.formulas} formulas</small>
                <span className="visual-topic-samples">{panel.sample.map((term) => term.term).join(" / ")}</span>
              </button>
            ))}
          </div>
        </section>

        <section id="visual-dictionary-search" className="visual-search-panel">
          <div className="visual-search-row">
            <label className="visual-search-box">
              <span className="ui-label">Search visual dictionary</span>
              <span className="visual-search-input">
                <PhysicsIcon name="search" className="h-5 w-5" />
                <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search velocity, photon, TIR, heat, black hole..." />
              </span>
            </label>
            <label className="visual-filter-box">
              <span className="ui-label">Topic category</span>
              <select className="select-field" value={category} onChange={(event) => chooseCategory(event.target.value as DictionaryCategory | "all")}>
                <option value="all">All categories</option>
                {dictionaryCategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <button className="hero-btn-secondary" type="button" onClick={resetFilters}>
              <PhysicsIcon name="step" className="h-4 w-4" />
              Reset
            </button>
          </div>
          <div className="visual-alphabet-row" aria-label="Alphabetical filter">
            <button className={letter === "all" ? "visual-letter active" : "visual-letter"} type="button" onClick={() => chooseLetter("all")}>All</button>
            {alphabet.map((item) => (
              <button
                key={item}
                className={letter === item ? "visual-letter active" : "visual-letter"}
                type="button"
                disabled={!availableLetters.has(item)}
                onClick={() => chooseLetter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="visual-dictionary-workspace">
          <div className="visual-term-wall">
            <div className="formula-results-header mb-3">
              <div>
                <p className="ui-label">{filteredTerms.length} terms shown</p>
                <h2>{category === "all" ? "Alphabetical visual dictionary" : category}</h2>
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

            <div className="visual-letter-groups">
              {groupedTerms.map(([groupLetter, terms]) => (
                <section key={groupLetter} className="visual-letter-section">
                  <div className="visual-letter-head">
                    <h2>{groupLetter}</h2>
                    <span>{terms.length} terms</span>
                  </div>
                  <div className="visual-term-grid">
                    {terms.map((term) => (
                      <button
                        key={term.id}
                        className={selected?.id === term.id ? "visual-term-card visual-term-card-active" : "visual-term-card"}
                        type="button"
                        style={{ "--term-accent": categoryTone[term.category].accent, "--term-soft": categoryTone[term.category].soft } as CSSProperties}
                        onClick={() => selectTerm(term)}
                      >
                        <VisualScene kind={categoryTone[term.category].scene} icon={term.visual} compact />
                        <span className="visual-card-category">{term.category}</span>
                        <strong>{term.term}</strong>
                        <p>{term.definition}</p>
                        <span className="visual-tag-row">
                          {term.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {selected && (
            <aside className="visual-detail-panel">
              <div className="visual-detail-stage" style={{ "--term-accent": categoryTone[selected.category].accent, "--term-soft": categoryTone[selected.category].soft } as CSSProperties}>
                <VisualScene kind={categoryTone[selected.category].scene} icon={selected.visual} large />
                <p className="ui-label">Selected visual card</p>
                <h2>{selected.term}</h2>
                <span>{selected.category}</span>
              </div>
              <div className="visual-detail-copy">
                <InfoBlock label="Definition" text={selected.definition} />
                <InfoBlock label="Example" text={selected.example} />
                {selected.formula && (
                  <div className="visual-formula-box">
                    <p className="ui-label">Formula</p>
                    <code>{selected.formula}</code>
                  </div>
                )}
                <div>
                  <p className="ui-label">Tags</p>
                  <div className="visual-detail-tags">
                    {selected.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
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
    <div className="visual-metric-card">
      <span><PhysicsIcon name={icon} /></span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="visual-info-block">
      <p className="ui-label">{label}</p>
      <p>{text}</p>
    </div>
  );
}

function VisualScene({ kind, icon, compact = false, large = false }: { kind: VisualSceneKind; icon: PhysicsIconName; compact?: boolean; large?: boolean }) {
  return (
    <span className={large ? `visual-scene visual-scene-${kind} visual-scene-large` : compact ? `visual-scene visual-scene-${kind} visual-scene-compact` : `visual-scene visual-scene-${kind}`}>
      <span className="visual-scene-grid" />
      <span className="visual-scene-orbit visual-scene-orbit-a" />
      <span className="visual-scene-orbit visual-scene-orbit-b" />
      <span className="visual-scene-wave" />
      <span className="visual-scene-ray visual-scene-ray-a" />
      <span className="visual-scene-ray visual-scene-ray-b" />
      <span className="visual-scene-dot visual-scene-dot-a" />
      <span className="visual-scene-dot visual-scene-dot-b" />
      <span className="visual-scene-dot visual-scene-dot-c" />
      <span className="visual-scene-icon"><PhysicsIcon name={icon} /></span>
    </span>
  );
}

function uniqueTerms(terms: PhysicsDictionaryTerm[]) {
  const seen = new Set<string>();
  return terms.filter((term) => {
    if (seen.has(term.id)) return false;
    seen.add(term.id);
    return true;
  });
}

function iconForDictionaryCategory(category: DictionaryCategory): PhysicsIconName {
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
