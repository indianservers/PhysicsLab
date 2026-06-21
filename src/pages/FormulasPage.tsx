import { useMemo, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { allPhysicsFormulas, formulaBankStats, formulaCategories, FormulaAccent, PhysicsFormulaCategory, PhysicsFormulaEntry } from "../lib/formulaBank";
import { renderFormula } from "../lib/formulas";
import { PhysicsIcon } from "../lib/icons";

const accentClasses: Record<FormulaAccent, string> = {
  science: "status-chip status-chip-cyan",
  quantum: "status-chip border-quantum-400/45 bg-quantum-400/10 text-quantum-200",
  warning: "status-chip border-warning-400/45 bg-warning-400/10 text-warning-200",
};

type FormulaCategoryGroup = {
  id: string;
  title: string;
  description: string;
  icon: PhysicsFormulaCategory["icon"];
  categoryIds: string[];
};

const formulaCategoryGroups: FormulaCategoryGroup[] = [
  { id: "measurement", title: "Measurement & Data", description: "Units, uncertainty, graphs, density, dimensions, and lab readings.", icon: "ruler", categoryIds: ["measurements-units", "kinematics", "fluid-mechanics", "thermal-physics", "current-electricity"] },
  { id: "motion", title: "Motion & Forces", description: "Linear motion, dynamics, circular motion, friction, impulse, and work.", icon: "rocket", categoryIds: ["kinematics", "dynamics", "mechanical-properties-solids", "momentum-collisions", "rotational-motion", "work-energy-power", "oscillations"] },
  { id: "energy", title: "Energy Systems", description: "Work, power, thermal energy, fields, circuits, radiation, and engines.", icon: "flame", categoryIds: ["work-energy-power", "thermal-physics", "kinetic-theory-gases", "electrostatics", "current-electricity", "nuclear-physics"] },
  { id: "rotation-gravity", title: "Rotation & Gravity", description: "Torque, angular momentum, satellites, Kepler laws, escape speed, and orbits.", icon: "orbit", categoryIds: ["rotational-motion", "gravitation", "oscillations", "momentum-collisions", "relativity-astrophysics"] },
  { id: "waves", title: "Waves & Sound", description: "Wave motion, sound, resonance, beats, Doppler effect, and superposition.", icon: "wave", categoryIds: ["waves", "sound", "oscillations", "wave-optics", "modern-physics"] },
  { id: "fluids-thermal", title: "Fluids & Thermal", description: "Solids, fluids, hydrostatics, flow, heat transfer, gas laws, and thermodynamics.", icon: "thermometer", categoryIds: ["mechanical-properties-solids", "fluid-mechanics", "thermal-physics", "kinetic-theory-gases", "work-energy-power", "measurements-units"] },
  { id: "electricity", title: "Electricity & Circuits", description: "Charge, fields, current, resistance, AC, logic, power, and capacitors.", icon: "battery", categoryIds: ["electrostatics", "current-electricity", "ac-circuits", "electronics-logic", "electromagnetic-induction", "measurements-units"] },
  { id: "magnetism", title: "Magnetism & EMI", description: "Magnetic fields, forces, induction, transformers, generators, and transients.", icon: "magnet", categoryIds: ["magnetism", "electromagnetic-induction", "ac-circuits", "current-electricity", "electrostatics"] },
  { id: "optics", title: "Light & Optics", description: "Ray optics, wave optics, lenses, mirrors, prisms, instruments, and resolution.", icon: "prism", categoryIds: ["ray-optics", "wave-optics", "modern-physics", "measurements-units", "waves"] },
  { id: "modern", title: "Modern & Quantum", description: "Photons, matter waves, atoms, nuclei, relativity, and quantum limits.", icon: "atom", categoryIds: ["modern-physics", "atomic-physics", "nuclear-physics", "relativity-astrophysics", "wave-optics"] },
  { id: "electronics", title: "Electronics & Signals", description: "Logic gates, filters, AC response, circuit laws, sensors, and signal formulas.", icon: "spark", categoryIds: ["electronics-logic", "current-electricity", "ac-circuits", "electromagnetic-induction", "magnetism"] },
  { id: "astro", title: "Astrophysics & Relativity", description: "Gravity, luminosity, redshift, stars, black holes, binaries, and relativistic energy.", icon: "orbit", categoryIds: ["relativity-astrophysics", "gravitation", "modern-physics", "nuclear-physics", "thermal-physics"] },
];

const formulaGroupStats = {
  groups: formulaCategoryGroups.length,
  minSubcategories: Math.min(...formulaCategoryGroups.map((group) => group.categoryIds.length)),
};

type FormulaSheetSection = {
  id: string;
  title: string;
  categoryId: string;
  icon: PhysicsFormulaCategory["icon"];
  formulaIds: string[];
};

const formulaSheetSections: FormulaSheetSection[] = [
  { id: "physical-world-units", title: "Physical World & Units", categoryId: "measurements-units", icon: "ruler", formulaIds: ["average-speed", "average-velocity", "percentage-error", "dimensional-formula-force", "relative-density", "scientific-notation"] },
  { id: "kinematics-sheet", title: "Kinematics", categoryId: "kinematics", icon: "rocket", formulaIds: ["first-equation-motion", "second-equation-motion", "third-equation-motion", "average-velocity", "projectile-range-basic", "projectile-time-flight"] },
  { id: "laws-motion-sheet", title: "Laws of Motion", categoryId: "dynamics", icon: "gauge", formulaIds: ["newton-second-law", "weight", "friction-limiting", "kinetic-friction", "centripetal-force", "normal-incline"] },
  { id: "work-energy-sheet", title: "Work, Energy & Power", categoryId: "work-energy-power", icon: "flame", formulaIds: ["work-done", "kinetic-energy", "potential-energy", "spring-potential-energy", "work-energy-theorem", "conservation-energy", "power", "instantaneous-power"] },
  { id: "rotation-sheet", title: "Rotational Motion", categoryId: "rotational-motion", icon: "orbit", formulaIds: ["angular-velocity", "angular-acceleration", "angular-displacement", "linear-angular-speed", "centripetal-acceleration", "torque", "rotational-second-law", "rotational-ke"] },
  { id: "gravitation-sheet", title: "Gravitation", categoryId: "gravitation", icon: "orbit", formulaIds: ["universal-gravitation", "field-strength", "gravitational-potential", "orbital-speed", "escape-speed", "satellite-period", "kepler-newton-form", "orbital-energy"] },
  { id: "electrostatics-sheet", title: "Electrostatics", categoryId: "electrostatics", icon: "field", formulaIds: ["coulomb-law", "electric-field", "point-charge-field", "electric-potential", "potential-energy-charges", "capacitance", "capacitor-parallel-plate", "capacitor-energy"] },
  { id: "current-sheet", title: "Current Electricity", categoryId: "current-electricity", icon: "battery", formulaIds: ["ohms-law", "electric-current", "resistivity", "series-resistance", "parallel-resistance", "electric-power", "wheatstone-balance", "emf-terminal-voltage"] },
  { id: "magnetism-sheet", title: "Magnetic Effects of Current", categoryId: "magnetism", icon: "magnet", formulaIds: ["field-long-wire", "field-circular-loop", "force-wire", "lorentz-force", "magnetic-force-moving-charge", "torque-current-loop", "magnetic-dipole-moment", "cyclotron-frequency"] },
  { id: "emi-sheet", title: "Electromagnetic Induction", categoryId: "electromagnetic-induction", icon: "magnet", formulaIds: ["faraday-law", "flux-change-emf", "motional-emf", "self-inductance", "inductor-energy", "rotating-coil-emf", "peak-generator-emf", "transformer-ratio"] },
  { id: "ac-sheet", title: "Alternating Current", categoryId: "ac-circuits", icon: "battery", formulaIds: ["rms-current", "rms-voltage", "capacitive-reactance", "inductive-reactance", "impedance-rlc", "phase-angle-rlc", "ac-power", "resonant-frequency"] },
  { id: "waves-oscillations-sheet", title: "Waves & Oscillations", categoryId: "waves", icon: "wave", formulaIds: ["wave-speed", "period-frequency", "angular-frequency", "wave-number", "wave-equation", "shm-displacement", "spring-period", "pendulum-period"] },
  { id: "solids-sheet", title: "Mechanical Properties of Solids", categoryId: "mechanical-properties-solids", icon: "spring", formulaIds: ["stress", "strain", "young-modulus", "bulk-modulus", "shear-modulus", "poisson-ratio", "elastic-energy-density", "spring-elastic-energy"] },
  { id: "fluids-sheet", title: "Mechanical Properties of Fluids", categoryId: "fluid-mechanics", icon: "drop", formulaIds: ["pressure", "liquid-pressure", "pascal-law", "buoyant-force", "continuity", "bernoulli", "viscous-force", "reynolds-number"] },
  { id: "thermo-sheet", title: "Heat & Thermodynamics", categoryId: "thermal-physics", icon: "thermometer", formulaIds: ["heat-capacity", "latent-heat", "first-law-thermodynamics", "ideal-gas", "internal-energy-ideal-gas", "heat-engine-efficiency", "carnot-efficiency", "coefficient-performance-refrigerator"] },
  { id: "heat-transfer-sheet", title: "Transfer of Heat", categoryId: "thermal-physics", icon: "flame", formulaIds: ["thermal-conduction", "radiation-power", "radiation-net", "newton-cooling", "heat-mixture", "linear-expansion", "area-expansion", "volume-expansion"] },
  { id: "ray-optics-sheet", title: "Ray Optics", categoryId: "ray-optics", icon: "prism", formulaIds: ["mirror-formula", "mirror-magnification", "lens-formula", "magnification", "lens-power", "snell-law", "critical-angle", "minimum-deviation-prism"] },
  { id: "optical-instruments-sheet", title: "Optical Instruments", categoryId: "ray-optics", icon: "eye", formulaIds: ["simple-microscope", "compound-microscope", "telescope-magnification", "resolving-power", "rayleigh-criterion", "lens-makers", "combination-lenses", "apparent-depth"] },
  { id: "wave-optics-sheet", title: "Wave Optics", categoryId: "wave-optics", icon: "wave", formulaIds: ["ydse-fringe-width", "ydse-bright-position", "path-difference", "constructive-interference", "destructive-interference", "single-slit-minima", "diffraction-grating", "malus-law"] },
  { id: "modern-sheet", title: "Modern Physics", categoryId: "modern-physics", icon: "atom", formulaIds: ["photon-energy", "photoelectric", "work-function-threshold", "stopping-potential", "de-broglie", "matter-wave-voltage", "mass-energy", "uncertainty"] },
  { id: "semiconductor-sheet", title: "Semiconductor Devices", categoryId: "electronics-logic", icon: "spark", formulaIds: ["pn-junction-diode", "transistor-current-gain-beta", "transistor-current-gain-alpha", "transistor-current-relation", "logic-or", "logic-nand", "logic-nor", "laser-photon-energy"] },
];

const importantConstants = [
  ["Speed of light", "c=3.00\\times10^8\\,m\\,s^{-1}"],
  ["Planck constant", "h=6.626\\times10^{-34}\\,J\\,s"],
  ["Elementary charge", "e=1.602\\times10^{-19}\\,C"],
  ["Vacuum permittivity", "\\epsilon_0=8.854\\times10^{-12}\\,C^2N^{-1}m^{-2}"],
  ["Vacuum permeability", "\\mu_0=4\\pi\\times10^{-7}\\,N\\,A^{-2}"],
  ["Gravitational constant", "G=6.674\\times10^{-11}\\,N\\,m^2kg^{-2}"],
  ["Acceleration due to gravity", "g\\approx9.8\\,m\\,s^{-2}"],
  ["Stefan-Boltzmann constant", "\\sigma=5.67\\times10^{-8}\\,W\\,m^{-2}K^{-4}"],
  ["Boltzmann constant", "k_B=1.381\\times10^{-23}\\,J\\,K^{-1}"],
  ["Avogadro constant", "N_A=6.022\\times10^{23}\\,mol^{-1}"],
];

export function FormulasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [categoryId, setCategoryId] = useState(formulaCategories.some((category) => category.id === initialCategory) ? initialCategory : "all");
  const [domain, setDomain] = useState("all");
  const [expandedFormulaIds, setExpandedFormulaIds] = useState<Set<string>>(() => new Set());
  const [expandedNavGroupIds, setExpandedNavGroupIds] = useState<Set<string>>(() => new Set(initialCategory === "all" ? ["mechanics"] : [groupIdForCategory(initialCategory) ?? "mechanics"]));
  const [expandedResultGroupIds, setExpandedResultGroupIds] = useState<Set<string>>(() => new Set(initialCategory === "all" ? ["mechanics"] : [groupIdForCategory(initialCategory) ?? "mechanics"]));
  const [expandedResultCategoryIds, setExpandedResultCategoryIds] = useState<Set<string>>(() => new Set(initialCategory === "all" ? ["kinematics"] : [initialCategory]));

  const domains = useMemo(() => ["all", ...Array.from(new Set(formulaCategories.map((category) => category.domain))).sort()], []);
  const categoryById = useMemo(() => new Map(formulaCategories.map((category) => [category.id, category])), []);
  const formulaById = useMemo(() => new Map(allPhysicsFormulas.map((formula) => [formula.id, formula])), []);
  const referenceSections = useMemo(() => (
    formulaSheetSections.map((section) => ({
      ...section,
      formulas: section.formulaIds.map((id) => formulaById.get(id)).filter((formula): formula is PhysicsFormulaEntry & { category: PhysicsFormulaCategory } => Boolean(formula)),
    }))
  ), [formulaById]);
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
  const groupedFilteredCategories = useMemo(() => {
    const filteredById = new Map(filteredCategories.map((category) => [category.id, category]));
    return formulaCategoryGroups
      .map((group) => ({
        ...group,
        categories: group.categoryIds.map((id) => filteredById.get(id)).filter((category): category is PhysicsFormulaCategory => Boolean(category)),
      }))
      .filter((group) => group.categories.length > 0);
  }, [filteredCategories]);

  const setCategory = (nextCategory: string) => {
    setCategoryId(nextCategory);
    const nextGroupId = groupIdForCategory(nextCategory);
    if (nextGroupId) {
      setExpandedNavGroupIds((current) => new Set([...current, nextGroupId]));
      setExpandedResultGroupIds((current) => new Set([...current, nextGroupId]));
      setExpandedResultCategoryIds((current) => new Set([...current, nextCategory]));
    }
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

  const toggleFormulaInfo = (formulaId: string) => {
    setExpandedFormulaIds((current) => {
      const next = new Set(current);
      if (next.has(formulaId)) next.delete(formulaId);
      else next.add(formulaId);
      return next;
    });
  };

  const toggleNavGroup = (groupId: string) => {
    setExpandedNavGroupIds((current) => toggleSetValue(current, groupId));
  };

  const toggleResultGroup = (groupId: string) => {
    setExpandedResultGroupIds((current) => toggleSetValue(current, groupId));
  };

  const toggleResultCategory = (nextCategoryId: string) => {
    setExpandedResultCategoryIds((current) => toggleSetValue(current, nextCategoryId));
  };

  const activeGroupId = groupIdForCategory(categoryId);
  const hasSearch = Boolean(query.trim());

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="desktop-page formula-page">
        <section className="formula-hero page-hero mesh-bg">
          <div className="formula-hero-copy">
            <p className="ui-label">Formula module</p>
            <h1 className="text-gradient">Physics Formula Bank</h1>
            <p>
              A searchable reference across {formulaGroupStats.groups} categories and {formulaBankStats.categories} subcategories with {formulaBankStats.formulas} physics formulas. Every category has at least {formulaGroupStats.minSubcategories} subcategories, and every formula includes an explanation panel.
            </p>
          </div>
          <div className="formula-stat-grid">
            <FormulaMetric label="Categories" value={formulaGroupStats.groups} />
            <FormulaMetric label="Subcats" value={formulaBankStats.categories} />
            <FormulaMetric label="Formulas" value={formulaBankStats.formulas} />
            <FormulaMetric label="Min/Cat" value={formulaBankStats.minPerCategory} />
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

        <section className="formula-sheet-panel" aria-label="Complete physics formula sheet">
          <div className="formula-sheet-head">
            <div>
              <p className="ui-label">Complete formula sheet</p>
              <h2>All major concepts in one revision grid</h2>
              <p>Dense topic cards for fast scan and exam practice, powered by the same searchable formula bank below.</p>
            </div>
            <div className="formula-sheet-actions">
              <span className="status-chip status-chip-cyan">{referenceSections.length} concept cards</span>
              <span className="status-chip">{importantConstants.length} constants</span>
            </div>
          </div>
          <div className="formula-sheet-grid">
            {referenceSections.map((section, index) => (
              <article key={section.id} className="formula-sheet-card" data-tone={index % 5}>
                <button className="formula-sheet-title" type="button" onClick={() => setCategory(section.categoryId)}>
                  <span>{index + 1}</span>
                  <PhysicsIcon name={section.icon} className="h-4 w-4" />
                  <strong>{section.title}</strong>
                </button>
                <div className="formula-sheet-list">
                  {section.formulas.slice(0, 8).map((formula) => (
                    <button key={formula.id} className="formula-sheet-row" type="button" onClick={() => setCategory(formula.category.id)}>
                      <span>{formula.name}</span>
                      <b dangerouslySetInnerHTML={{ __html: renderFormula(formula.expression) }} />
                    </button>
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

        <section className="formula-layout">
          <aside className="formula-category-rail desktop-sidebar-scroll">
            <button className={categoryId === "all" ? "formula-category-link active" : "formula-category-link"} onClick={() => setCategory("all")}>
              <PhysicsIcon name="book" className="h-4 w-4" />
              <span>All formula groups</span>
              <strong>{formulaBankStats.formulas}</strong>
            </button>
            <div className="formula-group-nav-list">
              {formulaCategoryGroups.map((group) => {
                const categories = group.categoryIds.map((id) => categoryById.get(id)).filter((category): category is PhysicsFormulaCategory => Boolean(category));
                const groupCount = categories.reduce((sum, category) => sum + category.formulas.length, 0);
                const expanded = expandedNavGroupIds.has(group.id) || activeGroupId === group.id;
                return (
                  <div key={group.id} className={activeGroupId === group.id ? "formula-group-nav active" : "formula-group-nav"}>
                    <button className="formula-group-toggle" type="button" aria-expanded={expanded} onClick={() => toggleNavGroup(group.id)}>
                      <PhysicsIcon name={group.icon} className="h-4 w-4" />
                      <span>{group.title}</span>
                      <strong>{groupCount}</strong>
                      <b aria-hidden="true">{expanded ? "-" : "+"}</b>
                    </button>
                    {expanded && (
                      <div className="formula-subcategory-nav">
                        {categories.map((category) => (
                          <button key={category.id} className={categoryId === category.id ? "formula-category-link active" : "formula-category-link"} data-accent={category.accent} onClick={() => setCategory(category.id)}>
                            <PhysicsIcon name={category.icon} className="h-4 w-4" />
                            <span>{category.title}</span>
                            <strong>{category.formulas.length}</strong>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="formula-results desktop-main-scroll">
            <div className="formula-results-header">
              <div>
                <p className="ui-label">{shownCount} formulas shown</p>
                <h2>{categoryId === "all" ? "Formula groups" : formulaCategories.find((category) => category.id === categoryId)?.title}</h2>
              </div>
              <div className="formula-chip-row">
                <span className="status-chip status-chip-cyan"><PhysicsIcon name="calculator" className="h-3.5 w-3.5" />KaTeX rendered</span>
                <span className="status-chip"><PhysicsIcon name="search" className="h-3.5 w-3.5" />Cmd+K indexed</span>
              </div>
            </div>

            {groupedFilteredCategories.map((group) => {
              const groupExpanded = hasSearch || expandedResultGroupIds.has(group.id) || activeGroupId === group.id;
              const groupFormulaCount = group.categories.reduce((sum, category) => sum + category.formulas.length, 0);
              return (
                <section key={group.id} className="formula-supergroup-section">
                  <button className="formula-supergroup-heading" type="button" aria-expanded={groupExpanded} onClick={() => toggleResultGroup(group.id)}>
                    <span><PhysicsIcon name={group.icon} className="h-5 w-5" /></span>
                    <div>
                      <p className="ui-label">{group.categories.length} subcategories - {groupFormulaCount} formulas</p>
                      <h3>{group.title}</h3>
                      <small>{group.description}</small>
                    </div>
                    <b aria-hidden="true">{groupExpanded ? "-" : "+"}</b>
                  </button>
                  {groupExpanded && (
                    <div className="formula-supergroup-body">
                      {group.categories.map((category) => {
                        const categoryExpanded = hasSearch || expandedResultCategoryIds.has(category.id) || categoryId === category.id;
                        return (
                          <section key={category.id} className="formula-category-section formula-subcategory-section" data-accent={category.accent}>
                            <button className="formula-category-heading formula-subcategory-toggle" type="button" aria-expanded={categoryExpanded} onClick={() => toggleResultCategory(category.id)}>
                              <div className="formula-category-title">
                                <span><PhysicsIcon name={category.icon} className="h-5 w-5" /></span>
                                <div>
                                  <p className="ui-label">{category.domain} - {category.classRange}</p>
                                  <h3>{category.title}</h3>
                                </div>
                              </div>
                              <span className={accentClasses[category.accent]}>{category.formulas.length} formulas</span>
                              <b className="formula-expand-mark" aria-hidden="true">{categoryExpanded ? "-" : "+"}</b>
                            </button>
                            {categoryExpanded && (
                              <div className="formula-card-grid">
                                {category.formulas.map((formula) => (
                                  <FormulaCard
                                    key={formula.id}
                                    category={category}
                                    formula={formula}
                                    expanded={expandedFormulaIds.has(formula.id)}
                                    onToggle={() => toggleFormulaInfo(formula.id)}
                                  />
                                ))}
                              </div>
                            )}
                          </section>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}

            {groupedFilteredCategories.length === 0 && (
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

function toggleSetValue(current: Set<string>, value: string) {
  const next = new Set(current);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function groupIdForCategory(categoryId: string) {
  if (categoryId === "all") return null;
  return formulaCategoryGroups.find((group) => group.categoryIds.includes(categoryId))?.id ?? null;
}

function FormulaCard({ category, formula, expanded, onToggle }: { category: PhysicsFormulaCategory; formula: PhysicsFormulaEntry; expanded: boolean; onToggle: () => void }) {
  const explanation = explainFormula(formula, category);
  const panelId = `formula-info-${formula.id}`;
  return (
    <article className="formula-card" data-accent={category.accent}>
      <div className="formula-card-topline">
        <h4>{formula.name}</h4>
        <span>{category.domain}</span>
      </div>
      <div className="formula-expression-shell">
        <div className="formula-expression-label">Equation</div>
        <div className="formula-expression" dangerouslySetInnerHTML={{ __html: renderFormula(formula.expression) }} />
      </div>
      <div className="formula-explanation-summary">
        <h5>Explanation</h5>
        <p>{explanation.purpose}</p>
      </div>
      <div className="formula-variable-row" aria-label={`${formula.name} variables`}>
        <b>Symbols</b>
        {formula.variables.slice(0, 8).map((variable) => <span key={variable}>{variable}</span>)}
      </div>
      <button className="formula-know-more" type="button" aria-expanded={expanded} aria-controls={panelId} onClick={(event) => { event.preventDefault(); onToggle(); }}>
        <PhysicsIcon name="book" className="h-3.5 w-3.5" />
        {expanded ? "Hide explanation" : "Full explanation"}
      </button>
      {expanded && (
        <div id={panelId} className="formula-info-panel">
          <div>
            <h5>What it tells you</h5>
            <p>{explanation.whatItTells}</p>
          </div>
          <div>
            <h5>Symbols</h5>
            <dl className="formula-symbol-list">
              {formula.variables.slice(0, 8).map((variable) => {
                const detail = describeSymbol(variable, category.domain);
                return (
                  <div key={variable}>
                    <dt>{variable}</dt>
                    <dd>{detail}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <div className="formula-info-grid">
            <InfoBlock title="Use when" text={explanation.useWhen} />
            <InfoBlock title="Remember" text={explanation.remember} />
          </div>
        </div>
      )}
      <div className="formula-tag-row">
        {formula.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </article>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h5>{title}</h5>
      <p>{text}</p>
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

function explainFormula(formula: PhysicsFormulaEntry, category: PhysicsFormulaCategory) {
  const text = normalize(`${formula.id} ${formula.name} ${formula.tags.join(" ")} ${category.title} ${category.domain}`);
  const purpose = purposeForFormula(text, formula, category);
  return {
    purpose,
    whatItTells: whatItTells(text, formula, category),
    useWhen: useWhen(text, category),
    remember: rememberFor(text, category),
  };
}

function purposeForFormula(text: string, formula: PhysicsFormulaEntry, category: PhysicsFormulaCategory) {
  if (text.includes("error") || text.includes("uncertainty")) return "Helps estimate how reliable a measurement or calculated answer is.";
  if (text.includes("motion") || text.includes("speed") || text.includes("velocity") || text.includes("projectile")) return "Connects position, velocity, acceleration, and time so motion can be predicted.";
  if (text.includes("force") || text.includes("friction") || text.includes("weight")) return "Shows how forces change motion or how contact/gravity forces act on an object.";
  if (text.includes("energy") || text.includes("work") || text.includes("power")) return "Tracks how energy is stored, transferred, or used per second.";
  if (text.includes("momentum") || text.includes("collision") || text.includes("impulse")) return "Connects motion with impact, collision, and change in momentum.";
  if (text.includes("rotation") || text.includes("torque") || text.includes("angular")) return "Applies motion ideas to turning objects and circular paths.";
  if (text.includes("gravity") || text.includes("orbit") || text.includes("escape")) return "Describes attraction due to mass and motion around planets or stars.";
  if (text.includes("wave") || text.includes("sound") || text.includes("frequency") || text.includes("resonance")) return "Links wave shape, speed, frequency, wavelength, and sound behavior.";
  if (text.includes("pressure") || text.includes("buoyancy") || text.includes("flow") || text.includes("bernoulli")) return "Explains how fluids push, float, and flow.";
  if (text.includes("heat") || text.includes("temperature") || text.includes("gas") || text.includes("thermal")) return "Relates heat, temperature, gas state, and thermal change.";
  if (text.includes("current") || text.includes("resistance") || text.includes("voltage") || text.includes("capacitor")) return "Connects charge flow, voltage, resistance, and electrical energy.";
  if (text.includes("magnetic") || text.includes("magnet") || text.includes("induction") || text.includes("emf")) return "Explains magnetic force, magnetic fields, and induced voltage.";
  if (text.includes("lens") || text.includes("mirror") || text.includes("refraction") || text.includes("optics")) return "Predicts how light bends, reflects, or forms images.";
  if (text.includes("photon") || text.includes("nuclear") || text.includes("quantum") || text.includes("radioactive")) return "Connects microscopic particles, light energy, and atomic/nuclear behavior.";
  return `A compact rule from ${category.title} used to calculate ${formula.name.toLowerCase()}.`;
}

function whatItTells(text: string, formula: PhysicsFormulaEntry, category: PhysicsFormulaCategory) {
  const output = formula.variables[0] ?? formula.name;
  if (text.includes("propto")) return `It shows the proportional relationship in ${category.title}; compare how one quantity changes when another changes.`;
  if (text.includes("dimensions")) return "It tells the base dimensions of the quantity, useful for checking whether an equation makes physical sense.";
  return `It usually lets you find ${describeSymbol(output, category.domain).toLowerCase()} when the other quantities are known.`;
}

function useWhen(text: string, category: PhysicsFormulaCategory) {
  if (text.includes("constant acceleration")) return "Use it only when acceleration is constant, such as ideal free fall or uniform acceleration problems.";
  if (text.includes("projectile")) return "Use it for ideal projectile motion with no air resistance and launch/landing at the same height unless stated otherwise.";
  if (text.includes("friction")) return "Use it when a surface contact force and coefficient of friction are given.";
  if (text.includes("gas")) return "Use it for ideal gas problems with SI units, especially kelvin for temperature.";
  if (text.includes("lens") || text.includes("mirror")) return "Use it for spherical mirrors or thin lenses with a clear sign convention.";
  if (text.includes("ohm") || text.includes("resistance") || text.includes("current")) return "Use it for simple circuit sections where components behave ideally.";
  if (text.includes("wave") || text.includes("sound")) return "Use it when the wave medium and frequency/wavelength information are known.";
  if (text.includes("quantum") || text.includes("photon") || text.includes("nuclear")) return "Use it for microscopic physics where energy is exchanged in particles or discrete levels.";
  return `Use it in ${category.domain.toLowerCase()} problems when the listed symbols match the given information.`;
}

function rememberFor(text: string, category: PhysicsFormulaCategory) {
  if (text.includes("temperature") || text.includes("gas")) return "Convert temperature to kelvin before calculating.";
  if (text.includes("angle") || text.includes("theta") || text.includes("sin") || text.includes("cos")) return "Check whether your calculator is in degrees or radians.";
  if (text.includes("lens") || text.includes("mirror")) return "Sign convention matters; write known values with signs before substituting.";
  if (text.includes("friction")) return "Static friction adjusts up to a maximum; kinetic friction acts while sliding.";
  if (text.includes("work") || text.includes("energy")) return "Use SI units so energy comes out in joules.";
  if (text.includes("current") || text.includes("voltage") || text.includes("power")) return "Use amperes, volts, ohms, and watts consistently.";
  if (text.includes("momentum") || text.includes("collision")) return "Choose one direction as positive and keep signs consistent.";
  return `Write units beside every value; this prevents most ${category.domain.toLowerCase()} mistakes.`;
}

function describeSymbol(symbol: string, domain: string) {
  const key = symbol.replace(/\\/g, "").trim();
  const normalized = key.toLowerCase();
  const dictionary: Record<string, string> = {
    a: "acceleration, usually in m/s^2",
    alpha: "angular acceleration or expansion coefficient, depends on context",
    b: "magnetic field or constant, depends on context",
    beta: "fringe width, sound level, or angle-dependent quantity",
    c: "specific heat capacity or speed of light, depends on context",
    d: "distance, separation, or slit spacing",
    delta: "change in a quantity",
    "delta p": "change in momentum",
    "delta t": "time interval",
    "delta x": "change in position or path difference",
    "delta y": "change in vertical position",
    "delta z": "change or uncertainty in result",
    e: "coefficient, charge, or efficiency depending on context",
    eta: "efficiency or viscosity, depends on context",
    f: "force, focal length, or frequency depending on context",
    "f_avg": "average force",
    "f_b": "beat frequency",
    "f_c": "centripetal force",
    "f_k": "kinetic friction",
    "f_max": "maximum static friction",
    "f_0": "natural or resonant frequency",
    g: "acceleration due to gravity, about 9.8 m/s^2 near Earth",
    h: "height or Planck constant depending on context",
    "h_i": "image height",
    "h_o": "object height",
    i: "angle of incidence or current, depends on context",
    "i_0": "reference intensity",
    "i_rms": "root mean square current",
    j: "impulse",
    k: "spring constant, wave number, Boltzmann constant, or Coulomb constant",
    "k_avg": "average kinetic energy",
    l: "length",
    lambda: "wavelength",
    m: "mass or magnification depending on context",
    mu: "coefficient, permeability, or mass per unit length depending on context",
    "mu_0": "permeability of free space",
    "mu_k": "coefficient of kinetic friction",
    "mu_s": "coefficient of static friction",
    n: "refractive index, number of turns, mode number, or moles",
    "n_1": "refractive index of first medium",
    "n_2": "refractive index of second medium",
    p: "momentum, pressure, or power depending on context",
    "p_avg": "average power",
    "p_in": "input power",
    "p_out": "output power",
    phi: "phase angle, work function, or magnetic flux context",
    "phi_b": "magnetic flux",
    pi: "the constant pi, about 3.1416",
    q: "charge or heat, depends on context",
    r: "radius, resistance, separation, or gas constant",
    "r_s": "series resistance",
    "r_p": "parallel resistance",
    rho: "density or resistivity depending on context",
    s: "displacement or distance along path",
    sigma: "Stefan-Boltzmann constant",
    t: "time or period depending on context",
    "t_c": "temperature in celsius",
    "t_k": "temperature in kelvin",
    tau: "torque",
    theta: "angle",
    u: "initial velocity, object distance, or potential energy depending on context",
    v: "velocity, speed, image distance, volume, or voltage depending on context",
    "v_0": "peak voltage",
    "v_avg": "average speed or velocity",
    "v_e": "escape speed",
    "v_rms": "root mean square speed or voltage",
    w: "work, weight, or energy transfer depending on context",
    omega: "angular velocity, angular frequency",
    x: "position or extension",
    "x_c": "capacitive reactance",
    "x_l": "inductive reactance",
    y: "displacement of a wave point",
    z: "result quantity or impedance depending on context",
  };

  if (dictionary[normalized]) return dictionary[normalized];
  if (/^m_\d/.test(normalized)) return "mass of one object";
  if (/^u_\d/.test(normalized)) return "initial velocity of one object";
  if (/^v_\d/.test(normalized)) return "final velocity of one object";
  if (/^r_\d/.test(normalized)) return "resistance value";
  if (/^q_\d/.test(normalized)) return "charge value";
  if (normalized === "lc") return "least count, the smallest reading of an instrument";
  if (normalized === "msd") return "one main scale division";
  if (normalized === "vsd") return "one vernier scale division";
  if (normalized === "rd") return "relative density, a unitless comparison of densities";
  if (normalized === "rp") return "resolving power";
  return `${key}, a quantity used in this ${domain.toLowerCase()} formula`;
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
