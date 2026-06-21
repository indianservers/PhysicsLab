import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AstroThreeScene, type AstroThreeMode } from "../components/AstroThreeScene";
import { Toolbar } from "../components/Toolbar";
import { astroCategories, astroQuickLinks, astrophysicsConcepts, astroScales, astroVisualAssets, cosmicTimeline, solarSystemBodies, type AstroConcept } from "../lib/astrophysics";
import { PhysicsIcon } from "../lib/icons";

const G = 6.6743e-11;
const C = 299792458;
const SOLAR_MASS = 1.98847e30;
const SOLAR_RADIUS = 6.957e8;
const SIGMA = 5.670374419e-8;
const SOLAR_LUMINOSITY = 3.828e26;

const formatNumber = (value: number, digits = 3) => {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 100000 || Math.abs(value) < 0.01 && value !== 0) return value.toExponential(2);
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
};

export function AstroPhysicsPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [scale, setScale] = useState("all");
  const [selectedId, setSelectedId] = useState(params.get("concept") ?? "black-holes");
  const [starRadius, setStarRadius] = useState(1);
  const [starTemp, setStarTemp] = useState(5778);
  const [blackHoleMass, setBlackHoleMass] = useState(4.3e6);
  const [orbitMass, setOrbitMass] = useState(1);
  const [orbitRadius, setOrbitRadius] = useState(1);
  const [hubbleDistance, setHubbleDistance] = useState(100);
  const [selectedAssetId, setSelectedAssetId] = useState("black-hole-lensing");
  const [threeMode, setThreeMode] = useState<AstroThreeMode>("black-hole");

  useEffect(() => {
    const concept = params.get("concept");
    const match = astrophysicsConcepts.find((item) => item.id === concept);
    if (match) {
      setSelectedId(match.id);
      setThreeMode(modeForConcept(match));
      const asset = astroVisualAssets.find((item) => item.conceptIds.includes(match.id));
      if (asset) setSelectedAssetId(asset.id);
    }
  }, [params]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return astrophysicsConcepts.filter((concept) => {
      const categoryMatch = category === "all" || concept.category === category;
      const scaleMatch = scale === "all" || concept.scale === scale;
      const text = `${concept.title} ${concept.category} ${concept.scale} ${concept.summary} ${concept.explanation} ${concept.keyIdeas.join(" ")} ${concept.formula ?? ""}`.toLowerCase();
      return categoryMatch && scaleMatch && (!q || text.includes(q));
    });
  }, [category, query, scale]);

  const selected = astrophysicsConcepts.find((concept) => concept.id === selectedId) ?? astrophysicsConcepts[0];
  const relatedAsset = astroVisualAssets.find((asset) => asset.conceptIds.includes(selected.id)) ?? astroVisualAssets[0];
  const selectedAsset = astroVisualAssets.find((asset) => asset.id === selectedAssetId) ?? relatedAsset;
  const luminosity = 4 * Math.PI * (starRadius * SOLAR_RADIUS) ** 2 * SIGMA * starTemp ** 4;
  const luminositySolar = luminosity / SOLAR_LUMINOSITY;
  const schwarzschildKm = (2 * G * blackHoleMass * SOLAR_MASS) / (C * C) / 1000;
  const orbitRadiusMeters = orbitRadius * 1.496e11;
  const centralMassKg = orbitMass * SOLAR_MASS;
  const orbitSpeed = Math.sqrt((G * centralMassKg) / orbitRadiusMeters) / 1000;
  const orbitPeriodYears = (2 * Math.PI * Math.sqrt(orbitRadiusMeters ** 3 / (G * centralMassKg))) / (3600 * 24 * 365.25);
  const hubbleSpeed = 70 * hubbleDistance;
  const hubbleRedshift = hubbleSpeed / 299792;

  const chooseConcept = (id: string) => {
    setSelectedId(id);
    setParams({ concept: id });
    const concept = astrophysicsConcepts.find((item) => item.id === id);
    const asset = astroVisualAssets.find((item) => item.conceptIds.includes(id));
    if (asset) setSelectedAssetId(asset.id);
    if (concept) setThreeMode(modeForConcept(concept));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toolbar />
      <main id="content" className="mx-auto grid w-full max-w-[1680px] gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside className="rounded-md border border-cyan-300/20 bg-slate-900/90 p-3 shadow-2xl shadow-cyan-950/20 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="ui-label text-cyan-200">AstroPhysics</p>
              <h1 className="text-xl font-black text-white">Universe Explorer</h1>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-md border border-amber-300/30 bg-amber-300/10 text-amber-200">
              <PhysicsIcon name="orbit" className="h-5 w-5" />
            </span>
          </div>

          <label className="mt-4 grid gap-1">
            <span className="ui-label text-slate-300">Search concepts</span>
            <input className="w-full rounded-md border border-cyan-300/20 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="black holes, CMB, Milky Way..." />
          </label>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            <label className="grid gap-1">
              <span className="ui-label text-slate-300">Category</span>
              <select className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-black text-white" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {astroCategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="ui-label text-slate-300">Scale</span>
              <select className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-black text-white" value={scale} onChange={(event) => setScale(event.target.value)}>
                <option value="all">All scales</option>
                {astroScales.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-2">
            {filtered.map((concept) => (
              <button key={concept.id} type="button" onClick={() => chooseConcept(concept.id)} className={`rounded-md border p-3 text-left transition ${selected.id === concept.id ? "border-cyan-300 bg-cyan-300/15 shadow-lg shadow-cyan-500/10" : "border-slate-800 bg-slate-950/70 hover:border-cyan-500/50"}`}>
                <span className="flex items-start gap-2">
                  <PhysicsIcon name={concept.icon} className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-white">{concept.title}</span>
                    <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{concept.category}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="grid min-w-0 gap-4">
          <section className="overflow-hidden rounded-md border border-cyan-300/20 bg-slate-900 shadow-2xl shadow-cyan-950/30">
            <div className="relative min-h-[360px] overflow-hidden p-5 sm:p-7">
              <StarField />
              <div className="relative z-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div>
                  <p className="ui-label text-amber-200">Astrophysics & Cosmology</p>
                  <h2 className="mt-2 max-w-4xl text-4xl font-black leading-none text-white sm:text-6xl">Explore the universe from planets to black holes</h2>
                  <p className="mt-4 max-w-2xl text-base font-semibold text-slate-300">
                    Interactive formulas, visual concept cards, cosmic scales, and observation tools for gravity, stars, galaxies, dark matter, and expansion.
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-4">
                    <Metric label="Concepts" value={astrophysicsConcepts.length} />
                    <Metric label="Categories" value={astroCategories.length} />
                    <Metric label="Scales" value={astroScales.length} />
                    <Metric label="Calculators" value={4} />
                  </div>
                </div>
                <CosmicStage selected={selected} />
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <ConceptDetail concept={selected} />
            <FormulaLab
              starRadius={starRadius}
              setStarRadius={setStarRadius}
              starTemp={starTemp}
              setStarTemp={setStarTemp}
              blackHoleMass={blackHoleMass}
              setBlackHoleMass={setBlackHoleMass}
              orbitMass={orbitMass}
              setOrbitMass={setOrbitMass}
              orbitRadius={orbitRadius}
              setOrbitRadius={setOrbitRadius}
              hubbleDistance={hubbleDistance}
              setHubbleDistance={setHubbleDistance}
              luminositySolar={luminositySolar}
              schwarzschildKm={schwarzschildKm}
              orbitSpeed={orbitSpeed}
              orbitPeriodYears={orbitPeriodYears}
              hubbleSpeed={hubbleSpeed}
              hubbleRedshift={hubbleRedshift}
            />
          </section>

          <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
            <AstroVisualGallery selectedAssetId={selectedAsset.id} onSelectAsset={setSelectedAssetId} />
            <section className="rounded-md border border-cyan-300/20 bg-slate-900 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="ui-label text-cyan-200">Interactive 3D</p>
                  <h2 className="mt-1 text-2xl font-black text-white">Orbit, galaxy, lensing, waves</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["black-hole", "galaxy", "orbits", "waves"] as AstroThreeMode[]).map((mode) => (
                    <button key={mode} type="button" onClick={() => setThreeMode(mode)} className={threeMode === mode ? "rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950" : "rounded-full border border-slate-700 px-3 py-1 text-xs font-black text-slate-200 hover:border-cyan-300"}>
                      {mode.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <AstroThreeScene mode={threeMode} intensity={Math.max(0.6, Math.min(2.2, starRadius / 4 + hubbleDistance / 1000))} />
              </div>
            </section>
          </section>

          <SolarSystemPanel />
          <CosmicTimeline />

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {astrophysicsConcepts.slice(0, 12).map((concept) => (
              <button key={concept.id} type="button" onClick={() => chooseConcept(concept.id)} className="group rounded-md border border-slate-800 bg-slate-900/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-slate-900">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                    <PhysicsIcon name={concept.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="ui-label text-slate-400">{concept.scale}</p>
                    <h3 className="text-base font-black text-white">{concept.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-300">{concept.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {concept.keyIdeas.slice(0, 3).map((idea) => <span key={idea} className="rounded-full border border-slate-700 px-2 py-1 text-[11px] font-black text-slate-300">{idea}</span>)}
                </div>
              </button>
            ))}
          </section>
        </section>

        <aside className="rounded-md border border-cyan-300/20 bg-slate-900/90 p-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <p className="ui-label text-cyan-200">Direct tools</p>
          <div className="mt-3 grid gap-2">
            {astroQuickLinks.map((link) => (
              <Link key={link.path} to={link.path} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/80 px-3 py-3 text-sm font-black text-white hover:border-cyan-300/60">
                {link.label}
                <PhysicsIcon name="play" className="h-4 w-4 text-cyan-300" />
              </Link>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/10 p-3">
            <p className="ui-label text-amber-100">Accuracy notes</p>
            <ul className="mt-2 grid gap-2 text-sm font-semibold text-amber-50/90">
              <li>Hubble calculator uses H0 = 70 km/s/Mpc for classroom estimation.</li>
              <li>Orbit calculator assumes circular orbit around a point-mass star.</li>
              <li>Black-hole radius uses the non-rotating Schwarzschild relation.</li>
              <li>Luminosity assumes ideal blackbody emission.</li>
            </ul>
          </div>

          <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/80 p-3">
            <p className="ui-label text-slate-400">Learning path</p>
            <ol className="mt-2 grid gap-2 text-sm font-semibold text-slate-300">
              <li>1. Start with gravity and orbits.</li>
              <li>2. Explore stars and stellar evolution.</li>
              <li>3. Move to compact objects and relativity.</li>
              <li>4. Finish with galaxies, CMB, and expansion.</li>
            </ol>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-cyan-300/20 bg-slate-950/60 p-3">
      <p className="ui-label text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-cyan-200">{value}</p>
    </div>
  );
}

function AstroVisualGallery({ selectedAssetId, onSelectAsset }: { selectedAssetId: string; onSelectAsset: (id: string) => void }) {
  const selectedAsset = astroVisualAssets.find((asset) => asset.id === selectedAssetId) ?? astroVisualAssets[0];
  return (
    <section className="rounded-md border border-cyan-300/20 bg-slate-900 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="ui-label text-cyan-200">Rich image assets</p>
          <h2 className="text-2xl font-black text-white">{selectedAsset.title}</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-300">{selectedAsset.summary}</p>
        </div>
        <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-100">{selectedAsset.category}</span>
      </div>
      <div className="mt-4 overflow-hidden rounded-md border border-slate-700 bg-slate-950">
        <img src={selectedAsset.path} alt={`${selectedAsset.title} astrophysics visual`} className="aspect-[16/9] w-full object-cover" loading="lazy" />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {astroVisualAssets.map((asset) => (
          <button key={asset.id} type="button" onClick={() => onSelectAsset(asset.id)} className={`overflow-hidden rounded-md border text-left transition ${selectedAssetId === asset.id ? "border-cyan-300 bg-cyan-300/10" : "border-slate-800 bg-slate-950/80 hover:border-cyan-300/60"}`}>
            <img src={asset.path} alt="" className="h-24 w-full object-cover" loading="lazy" />
            <span className="block p-2">
              <span className="block text-sm font-black text-white">{asset.title}</span>
              <span className="mt-1 block text-xs font-semibold text-slate-400">{asset.category}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function modeForConcept(concept: AstroConcept): AstroThreeMode {
  if (concept.visual === "black-hole" || concept.category === "Relativity") return "black-hole";
  if (concept.visual === "galaxy" || concept.category === "Galaxies" || concept.id === "dark-matter" || concept.id === "dark-energy") return "galaxy";
  if (concept.visual === "wave" || concept.id.includes("wave") || concept.id.includes("cmb") || concept.id.includes("redshift")) return "waves";
  return "orbits";
}

function StarField() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_24%),radial-gradient(circle_at_78%_10%,rgba(245,158,11,0.24),transparent_22%),linear-gradient(135deg,#020617,#0f172a_46%,#111827)]" />
      {Array.from({ length: 42 }).map((_, index) => (
        <span key={index} className="absolute h-1 w-1 rounded-full bg-white/80" style={{ left: `${(index * 37) % 100}%`, top: `${(index * 53) % 100}%`, opacity: 0.25 + (index % 5) * 0.13 }} />
      ))}
    </div>
  );
}

function CosmicStage({ selected }: { selected: AstroConcept }) {
  const isBlackHole = selected.visual === "black-hole";
  const isGalaxy = selected.visual === "galaxy";
  const isWave = selected.visual === "wave" || selected.visual === "spectrum";
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-md border border-white/10 bg-slate-950/80 p-5">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      </div>
      <div className="relative z-10 flex h-full min-h-[260px] items-center justify-center">
        {isBlackHole && <BlackHoleVisual />}
        {isGalaxy && <GalaxyVisual />}
        {isWave && <WaveVisual />}
        {!isBlackHole && !isGalaxy && !isWave && <OrbitVisual />}
      </div>
      <div className="relative z-10 rounded-md border border-slate-700 bg-slate-950/80 p-3">
        <p className="ui-label text-cyan-200">{selected.category}</p>
        <h3 className="mt-1 text-xl font-black text-white">{selected.title}</h3>
      </div>
    </div>
  );
}

function BlackHoleVisual() {
  return (
    <div className="relative h-56 w-56">
      <div className="absolute inset-6 rounded-full bg-[conic-gradient(from_20deg,#f97316,#fde68a,#f43f5e,#7c2d12,#f97316)] blur-sm" />
      <div className="absolute inset-10 rounded-full bg-slate-950 shadow-[0_0_45px_rgba(0,0,0,1)]" />
      <div className="absolute left-6 right-6 top-1/2 h-8 -translate-y-1/2 rotate-[-12deg] rounded-full bg-[linear-gradient(90deg,transparent,#fb923c,#fde68a,#fb923c,transparent)] blur-[1px]" />
    </div>
  );
}

function GalaxyVisual() {
  return (
    <div className="relative h-60 w-60 animate-[spin_28s_linear_infinite] rounded-full bg-[radial-gradient(circle,#fef3c7_0_4%,#f59e0b_7%,transparent_11%),conic-gradient(from_30deg,transparent,#60a5fa,transparent,#c084fc,transparent,#fef3c7,transparent)] blur-[0.2px]">
      <div className="absolute inset-10 rounded-full bg-slate-950/40" />
    </div>
  );
}

function WaveVisual() {
  return (
    <svg viewBox="0 0 360 180" className="h-56 w-full max-w-sm">
      <path d="M20 90 C60 20 100 160 140 90 S220 20 260 90 320 160 340 90" fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round" />
      <path d="M20 115 C60 45 100 185 140 115 S220 45 260 115 320 185 340 115" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <circle cx="88" cy="68" r="10" fill="#fde047" />
      <circle cx="260" cy="116" r="10" fill="#38bdf8" />
    </svg>
  );
}

function OrbitVisual() {
  return (
    <div className="relative h-60 w-60">
      <div className="absolute inset-20 rounded-full bg-amber-300 shadow-[0_0_60px_rgba(251,191,36,0.85)]" />
      {[0, 1, 2, 3].map((orbit) => (
        <div key={orbit} className="absolute rounded-full border border-cyan-300/25" style={{ inset: 26 + orbit * 21 }} />
      ))}
      <div className="absolute left-14 top-20 h-6 w-6 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.9)]" />
      <div className="absolute bottom-10 right-12 h-8 w-8 rounded-full bg-red-400" />
    </div>
  );
}

function ConceptDetail({ concept }: { concept: AstroConcept }) {
  return (
    <article className="rounded-md border border-cyan-300/20 bg-slate-900 p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          <PhysicsIcon name={concept.icon} className="h-7 w-7" />
        </span>
        <div>
          <p className="ui-label text-cyan-200">{concept.category} / {concept.scale}</p>
          <h2 className="mt-1 text-3xl font-black text-white">{concept.title}</h2>
          <p className="mt-2 text-base font-semibold text-slate-300">{concept.summary}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{concept.explanation}</p>
      {concept.formula && (
        <div className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/10 p-3">
          <p className="ui-label text-amber-100">Key relation</p>
          <p className="mt-1 font-mono text-lg font-black text-amber-50">{concept.formula}</p>
        </div>
      )}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <InfoBox title="Observe" text={concept.observe} />
        <InfoBox title="Misconception" text={concept.misconception} />
        <InfoBox title="Try this" text={concept.tryThis} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {concept.keyIdeas.map((idea) => <span key={idea} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">{idea}</span>)}
      </div>
    </article>
  );
}

function InfoBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/80 p-3">
      <p className="ui-label text-slate-400">{title}</p>
      <p className="mt-2 text-sm font-semibold text-slate-300">{text}</p>
    </div>
  );
}

function FormulaLab(props: {
  starRadius: number;
  setStarRadius: (value: number) => void;
  starTemp: number;
  setStarTemp: (value: number) => void;
  blackHoleMass: number;
  setBlackHoleMass: (value: number) => void;
  orbitMass: number;
  setOrbitMass: (value: number) => void;
  orbitRadius: number;
  setOrbitRadius: (value: number) => void;
  hubbleDistance: number;
  setHubbleDistance: (value: number) => void;
  luminositySolar: number;
  schwarzschildKm: number;
  orbitSpeed: number;
  orbitPeriodYears: number;
  hubbleSpeed: number;
  hubbleRedshift: number;
}) {
  return (
    <section className="rounded-md border border-cyan-300/20 bg-slate-900 p-4">
      <p className="ui-label text-cyan-200">Interactive formula lab</p>
      <h2 className="mt-1 text-2xl font-black text-white">Change values, read the universe</h2>
      <div className="mt-4 grid gap-3">
        <SliderCard label="Star radius" unit="solar radii" min={0.1} max={20} step={0.1} value={props.starRadius} onChange={props.setStarRadius} output={`${formatNumber(props.luminositySolar, 2)} L_sun`} formula="L = 4 pi R^2 sigma T^4" />
        <SliderCard label="Star temperature" unit="K" min={2500} max={25000} step={100} value={props.starTemp} onChange={props.setStarTemp} output={`${formatNumber(props.luminositySolar, 2)} L_sun`} formula="Temperature enters as T^4" />
        <SliderCard label="Black-hole mass" unit="solar masses" min={1} max={10000000} step={1000} value={props.blackHoleMass} onChange={props.setBlackHoleMass} output={`${formatNumber(props.schwarzschildKm, 1)} km`} formula="R_s = 2GM / c^2" />
        <SliderCard label="Central star mass" unit="solar masses" min={0.1} max={5} step={0.1} value={props.orbitMass} onChange={props.setOrbitMass} output={`${formatNumber(props.orbitSpeed, 2)} km/s`} formula="v = sqrt(GM / r)" />
        <SliderCard label="Orbit radius" unit="AU" min={0.2} max={30} step={0.1} value={props.orbitRadius} onChange={props.setOrbitRadius} output={`${formatNumber(props.orbitPeriodYears, 2)} yr`} formula="T = 2 pi sqrt(r^3 / GM)" />
        <SliderCard label="Galaxy distance" unit="Mpc" min={1} max={1000} step={1} value={props.hubbleDistance} onChange={props.setHubbleDistance} output={`${formatNumber(props.hubbleSpeed, 0)} km/s, z ~ ${formatNumber(props.hubbleRedshift, 3)}`} formula="v = H0 d, H0 = 70 km/s/Mpc" />
      </div>
    </section>
  );
}

function SliderCard({ label, unit, value, min, max, step, output, formula, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; output: string; formula: string; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 rounded-md border border-slate-800 bg-slate-950/80 p-3">
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span>
          <span className="block text-sm font-black text-white">{label}</span>
          <span className="text-xs font-bold text-slate-400">{formatNumber(value, 2)} {unit}</span>
        </span>
        <span className="rounded-md bg-cyan-300/10 px-3 py-1 text-sm font-black text-cyan-100">{output}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="accent-cyan-300" />
      <span className="font-mono text-xs font-bold text-amber-100">{formula}</span>
    </label>
  );
}

function SolarSystemPanel() {
  return (
    <section className="rounded-md border border-cyan-300/20 bg-slate-900 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="ui-label text-cyan-200">Solar System</p>
          <h2 className="text-2xl font-black text-white">Order from the Sun</h2>
        </div>
        <p className="max-w-xl text-sm font-semibold text-slate-300">Distances are compressed for learning. The AU labels preserve the accurate order and approximate orbital scale.</p>
      </div>
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="grid min-w-[920px] grid-cols-9 gap-2">
          {solarSystemBodies.map((body) => (
            <div key={body.name} className="rounded-md border border-slate-800 bg-slate-950/80 p-3 text-center">
              <div className="mx-auto rounded-full shadow-lg" style={{ width: body.name === "Sun" ? 54 : Math.max(18, Math.min(46, body.radiusKm / 1800)), height: body.name === "Sun" ? 54 : Math.max(18, Math.min(46, body.radiusKm / 1800)), background: body.color, boxShadow: `0 0 28px ${body.color}66` }} />
              <h3 className="mt-3 text-sm font-black text-white">{body.name}</h3>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">{body.type}</p>
              <p className="mt-2 text-xs font-bold text-cyan-100">{body.distanceAu} AU</p>
              <p className="mt-2 text-xs text-slate-400">{body.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CosmicTimeline() {
  return (
    <section className="rounded-md border border-cyan-300/20 bg-slate-900 p-4">
      <p className="ui-label text-cyan-200">Cosmic timeline</p>
      <h2 className="mt-1 text-2xl font-black text-white">From hot early universe to today</h2>
      <div className="mt-4 grid gap-2 md:grid-cols-7">
        {cosmicTimeline.map((event, index) => (
          <div key={event.label} className="relative rounded-md border border-slate-800 bg-slate-950/80 p-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-300 text-sm font-black text-slate-950">{index + 1}</span>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-amber-100">{event.age}</p>
            <h3 className="mt-1 text-sm font-black text-white">{event.label}</h3>
            <p className="mt-2 text-xs font-semibold text-slate-400">{event.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
