import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { allPhysicsFormulas, PhysicsFormulaCategory, PhysicsFormulaEntry } from "../lib/formulaBank";
import { renderFormula } from "../lib/formulas";
import { PhysicsIcon } from "../lib/icons";
import { formulaSheetSections, importantConstants } from "./FormulasPage";

export function FormulaRevisionGridPage() {
  const formulaById = new Map(allPhysicsFormulas.map((formula) => [formula.id, formula]));
  const referenceSections = formulaSheetSections.map((section) => ({
    ...section,
    formulas: section.formulaIds
      .map((id) => formulaById.get(id))
      .filter((formula): formula is PhysicsFormulaEntry & { category: PhysicsFormulaCategory } => Boolean(formula)),
  }));

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="desktop-page formula-page formula-revision-page">
        <section className="formula-hero page-hero mesh-bg">
          <div className="formula-hero-copy">
            <p className="ui-label">Formula revision subpage</p>
            <h1 className="text-gradient">Categorized Physics Formula Grid</h1>
            <p>
              A focused revision board for quick scanning. Choose any concept card to jump back into the interactive formula bank with that topic selected.
            </p>
          </div>
          <div className="formula-stat-grid">
            <div className="metric-card">
              <div className="ui-label">Concept Cards</div>
              <div className="mt-1 font-mono text-2xl font-black text-science-300">{referenceSections.length}</div>
            </div>
            <div className="metric-card">
              <div className="ui-label">Constants</div>
              <div className="mt-1 font-mono text-2xl font-black text-science-300">{importantConstants.length}</div>
            </div>
          </div>
        </section>

        <div className="formula-revision-topbar">
          <Link className="hero-btn-secondary" to="/formulas">
            <PhysicsIcon name="book" className="h-4 w-4" />
            Back to formula explorer
          </Link>
          <span className="status-chip status-chip-cyan">No horizontal scrolling</span>
          <span className="status-chip">Mobile stacked cards</span>
        </div>

        <section className="formula-sheet-panel" aria-label="Categorized physics formula revision grid">
          <div className="formula-sheet-head">
            <div>
              <p className="ui-label">Revision grid</p>
              <h2>Major concepts by category</h2>
              <p>Each card keeps formulas grouped by topic, with larger wrapped equation blocks for clear reading.</p>
            </div>
            <div className="formula-sheet-actions">
              <span className="status-chip status-chip-cyan">{referenceSections.length} concept cards</span>
              <span className="status-chip">{importantConstants.length} constants</span>
            </div>
          </div>

          <div className="formula-sheet-grid">
            {referenceSections.map((section, index) => (
              <article key={section.id} className="formula-sheet-card" data-tone={index % 5}>
                <Link className="formula-sheet-title" to={`/formulas?category=${section.categoryId}`}>
                  <span>{index + 1}</span>
                  <PhysicsIcon name={section.icon} className="h-4 w-4" />
                  <strong>{section.title}</strong>
                </Link>
                <div className="formula-sheet-list">
                  {section.formulas.slice(0, 8).map((formula) => (
                    <Link key={formula.id} className="formula-sheet-row" to={`/formulas?category=${formula.category.id}&q=${encodeURIComponent(formula.name)}`}>
                      <span>{formula.name}</span>
                      <b dangerouslySetInnerHTML={{ __html: renderFormula(formula.expression) }} />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
            <article className="formula-sheet-card formula-constants-card" data-tone="constants">
              <div className="formula-sheet-title">
                <span>{referenceSections.length + 1}</span>
                <PhysicsIcon name="ruler" className="h-4 w-4" />
                <strong>Important Constants</strong>
              </div>
              <div className="formula-sheet-list">
                {importantConstants.map(([name, expression]) => (
                  <div key={name} className="formula-sheet-row formula-constant-row">
                    <span>{name}</span>
                    <b dangerouslySetInnerHTML={{ __html: renderFormula(expression) }} />
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
