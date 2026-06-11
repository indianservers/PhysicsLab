import { useMemo, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { allPhysicsFormulas, formulaBankStats, formulaCategories, FormulaAccent } from "../lib/formulaBank";
import { renderFormula } from "../lib/formulas";
import { PhysicsIcon } from "../lib/icons";

const accentClasses: Record<FormulaAccent, string> = {
  science: "status-chip status-chip-cyan",
  quantum: "status-chip border-quantum-400/45 bg-quantum-400/10 text-quantum-200",
  warning: "status-chip border-warning-400/45 bg-warning-400/10 text-warning-200",
};

export function FormulasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [categoryId, setCategoryId] = useState(formulaCategories.some((category) => category.id === initialCategory) ? initialCategory : "all");
  const [domain, setDomain] = useState("all");

  const domains = useMemo(() => ["all", ...Array.from(new Set(formulaCategories.map((category) => category.domain))).sort()], []);
  const filteredCategories = useMemo(() => {
    const q = normalize(query);
    return formulaCategories
      .filter((category) => categoryId === "all" || category.id === categoryId)
      .filter((category) => domain === "all" || category.domain === domain)
      .map((category) => ({
        ...category,
        formulas: category.formulas.filter((formula) => {
          if (!q) return true;
          const text = normalize(`${formula.name} ${formula.expression} ${formula.variables.join(" ")} ${formula.tags.join(" ")} ${category.title} ${category.domain}`);
          return text.includes(q);
        }),
      }))
      .filter((category) => category.formulas.length > 0);
  }, [categoryId, domain, query]);

  const shownCount = filteredCategories.reduce((sum, category) => sum + category.formulas.length, 0);

  const setCategory = (nextCategory: string) => {
    setCategoryId(nextCategory);
    const next = new URLSearchParams(searchParams);
    if (nextCategory === "all") next.delete("category");
    else next.set("category", nextCategory);
    if (query.trim()) next.set("q", query.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    const next = new URLSearchParams(searchParams);
    if (nextQuery.trim()) next.set("q", nextQuery.trim());
    else next.delete("q");
    if (categoryId !== "all") next.set("category", categoryId);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="desktop-page formula-page">
        <section className="formula-hero page-hero mesh-bg">
          <div className="formula-hero-copy">
            <p className="ui-label">Formula module</p>
            <h1 className="text-gradient">Physics Formula Bank</h1>
            <p>
              A searchable reference across {formulaBankStats.categories} categories with {formulaBankStats.formulas} core formulas. Every category starts with {formulaBankStats.minPerCategory} formulas and can scale up to deeper revision packs.
            </p>
          </div>
          <div className="formula-stat-grid">
            <FormulaMetric label="Categories" value={formulaBankStats.categories} />
            <FormulaMetric label="Formulas" value={formulaBankStats.formulas} />
            <FormulaMetric label="Min/Cat" value={formulaBankStats.minPerCategory} />
            <FormulaMetric label="Max/Cat" value={formulaBankStats.maxPerCategory} />
          </div>
        </section>

        <section className="formula-filter-bar">
          <label className="formula-search-wrap">
            <PhysicsIcon name="search" className="h-4 w-4" />
            <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search name, symbol, topic, or equation..." />
          </label>
          <select className="select-field" value={domain} onChange={(event) => setDomain(event.target.value)} aria-label="Formula domain">
            {domains.map((item) => <option key={item} value={item}>{item === "all" ? "All domains" : item}</option>)}
          </select>
          <button className="hero-btn-secondary" type="button" onClick={() => { updateQuery(""); setDomain("all"); setCategory("all"); }}>
            <PhysicsIcon name="step" className="h-4 w-4" />
            Reset
          </button>
        </section>

        <section className="formula-layout">
          <aside className="formula-category-rail desktop-sidebar-scroll">
            <button className={categoryId === "all" ? "formula-category-link active" : "formula-category-link"} onClick={() => setCategory("all")}>
              <PhysicsIcon name="book" className="h-4 w-4" />
              <span>All categories</span>
              <strong>{formulaBankStats.formulas}</strong>
            </button>
            {formulaCategories.map((category) => (
              <button key={category.id} className={categoryId === category.id ? "formula-category-link active" : "formula-category-link"} data-accent={category.accent} onClick={() => setCategory(category.id)}>
                <PhysicsIcon name={category.icon} className="h-4 w-4" />
                <span>{category.title}</span>
                <strong>{category.formulas.length}</strong>
              </button>
            ))}
          </aside>

          <div className="formula-results desktop-main-scroll">
            <div className="formula-results-header">
              <div>
                <p className="ui-label">{shownCount} formulas shown</p>
                <h2>{categoryId === "all" ? "All formula categories" : formulaCategories.find((category) => category.id === categoryId)?.title}</h2>
              </div>
              <div className="formula-chip-row">
                <span className="status-chip status-chip-cyan"><PhysicsIcon name="calculator" className="h-3.5 w-3.5" />KaTeX rendered</span>
                <span className="status-chip"><PhysicsIcon name="search" className="h-3.5 w-3.5" />Cmd+K indexed</span>
              </div>
            </div>

            {filteredCategories.map((category) => (
              <section key={category.id} className="formula-category-section" data-accent={category.accent}>
                <div className="formula-category-heading">
                  <div className="formula-category-title">
                    <span><PhysicsIcon name={category.icon} className="h-5 w-5" /></span>
                    <div>
                      <p className="ui-label">{category.domain} - {category.classRange}</p>
                      <h3>{category.title}</h3>
                    </div>
                  </div>
                  <span className={accentClasses[category.accent]}>{category.formulas.length} formulas</span>
                </div>
                <div className="formula-card-grid">
                  {category.formulas.map((formula) => (
                    <article key={formula.id} className="formula-card" data-accent={category.accent}>
                      <div className="formula-card-topline">
                        <h4>{formula.name}</h4>
                        <span>{category.domain}</span>
                      </div>
                      <div className="formula-expression-shell">
                        <div className="formula-expression-label">Equation</div>
                        <div className="formula-expression" dangerouslySetInnerHTML={{ __html: renderFormula(formula.expression) }} />
                      </div>
                      <div className="formula-variable-row" aria-label={`${formula.name} variables`}>
                        <b>Symbols</b>
                        {formula.variables.slice(0, 8).map((variable) => <span key={variable}>{variable}</span>)}
                      </div>
                      <div className="formula-tag-row">
                        {formula.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            {filteredCategories.length === 0 && (
              <div className="empty-state">
                <PhysicsIcon name="calculator" className="mx-auto h-8 w-8 text-science-300" />
                <h2 className="mt-3 text-xl font-black">No formulas found</h2>
                <p className="mt-2 text-sm text-space-300">Try a broader symbol, formula name, or domain filter.</p>
                <button className="hero-btn-secondary mt-4" onClick={() => { updateQuery(""); setDomain("all"); setCategory("all"); }}>Clear formula filters</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function FormulaMetric({ label, value }: { label: string; value: number }) {
  const animated = useCountUp(value);
  return (
    <div className="metric-card">
      <div className="ui-label">{label}</div>
      <div className="mt-1 font-mono text-2xl font-black text-science-300 count-up">{animated}</div>
    </div>
  );
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\\theta/g, "theta")
    .replace(/\\lambda/g, "lambda")
    .replace(/\\rho/g, "rho")
    .replace(/\\omega/g, "omega")
    .replace(/\\pi/g, "pi")
    .replace(/[^\w\s.+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
