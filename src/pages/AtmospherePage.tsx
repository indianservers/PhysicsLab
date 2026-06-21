import { CSSProperties, ReactNode, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { AtmosphereLayer, AtmosphereVisual, atmosphereLayers, atmosphereStats } from "../lib/atmosphere";
import { PhysicsIcon } from "../lib/icons";

const objectPositions: Record<string, { x: number; y: number; label: string; visual: AtmosphereVisual }> = {
  troposphere: { x: 35, y: 74, label: "Passenger plane", visual: "plane" },
  stratosphere: { x: 22, y: 57, label: "Weather rocket", visual: "rocket" },
  mesosphere: { x: 76, y: 46, label: "Meteors", visual: "meteor" },
  thermosphere: { x: 68, y: 29, label: "Aurora", visual: "aurora" },
  exosphere: { x: 82, y: 16, label: "Satellite", visual: "satellite" },
};

export function AtmospherePage() {
  const [searchParams] = useSearchParams();
  const initialLayer = searchParams.get("layer");
  const [selectedId, setSelectedId] = useState(
    atmosphereLayers.some((layer) => layer.id === initialLayer) ? initialLayer ?? "troposphere" : "troposphere"
  );
  const [showLabels, setShowLabels] = useState(true);
  const [scale, setScale] = useState(1);
  const selected = atmosphereLayers.find((layer) => layer.id === selectedId) ?? atmosphereLayers[0];

  const relativeAltitude = useMemo(() => {
    const value = Math.round((selected.rangeKm[1] / atmosphereStats.maxAltitudeKm) * 100);
    return Math.max(1, value);
  }, [selected]);

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="atmosphere-page desktop-page">
        <section className="atmosphere-hero">
          <div>
            <p className="ui-label">Interactive visual module</p>
            <h1>Layers of Earth's Atmosphere</h1>
            <p>Explore each layer with realistic SVG vehicles, aurora, meteor trails, altitude ranges, and temperature behavior.</p>
          </div>
          <div className="atmosphere-metrics">
            <Metric icon="orbit" label="Layers" value={atmosphereStats.layers} />
            <Metric icon="rocket" label="Altitude" value={`${atmosphereStats.maxAltitudeKm}+ km`} />
            <Metric icon="spark" label="Objects" value={atmosphereStats.examples} />
          </div>
        </section>

        <section className="atmosphere-layout">
          <aside className="atmosphere-controls">
            <div>
              <p className="ui-label">Select layer</p>
              <div className="atmosphere-layer-buttons">
                {atmosphereLayers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    className={layer.id === selected.id ? "atmosphere-layer-btn atmosphere-layer-btn-active" : "atmosphere-layer-btn"}
                    onClick={() => setSelectedId(layer.id)}
                    style={{ "--layer-color": layer.color } as CSSProperties}
                  >
                    <AtmosphereIcon visual={layer.visual} compact />
                    <span>{layer.name}</span>
                    <small>{layer.altitude}</small>
                  </button>
                ))}
              </div>
            </div>
            <label className="atmosphere-toggle">
              <input type="checkbox" checked={showLabels} onChange={(event) => setShowLabels(event.target.checked)} />
              <span>Show labels</span>
            </label>
            <label className="atmosphere-range">
              <span>Vertical exaggeration</span>
              <input type="range" min="0.8" max="1.25" step="0.05" value={scale} onChange={(event) => setScale(Number(event.target.value))} />
              <strong>{scale.toFixed(2)}x</strong>
            </label>
          </aside>

          <section className="atmosphere-stage-card" aria-label="Interactive atmosphere layer visualization">
            <AtmospherePoster selected={selected} showLabels={showLabels} scale={scale} onSelect={setSelectedId} />
          </section>

          <aside className="atmosphere-detail">
            <AtmosphereIcon visual={selected.visual} />
            <p className="ui-label">{selected.altitude}</p>
            <h2>{selected.name}</h2>
            <p className="atmosphere-summary">{selected.summary}</p>
            <p>{selected.science}</p>
            <div className="atmosphere-reading">
              <span>Temperature</span>
              <strong>{selected.temperature}</strong>
            </div>
            <div className="atmosphere-reading">
              <span>Upper altitude scale</span>
              <strong>{relativeAltitude}% of module scale</strong>
            </div>
            <div className="atmosphere-chip-row">
              {selected.features.map((feature) => <span key={feature} className="status-chip">{feature}</span>)}
            </div>
            <div className="atmosphere-object-list">
              {selected.examples.map((example) => <span key={example}>{example}</span>)}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function AtmospherePoster({ selected, showLabels, scale, onSelect }: { selected: AtmosphereLayer; showLabels: boolean; scale: number; onSelect: (id: string) => void }) {
  return (
    <div className="atmosphere-poster" style={{ "--atmos-scale": scale } as CSSProperties}>
      <svg className="atmosphere-scene" viewBox="0 0 1000 760" role="img" aria-label="Layered atmosphere over Earth">
        <defs>
          <radialGradient id="earthGlow" cx="50%" cy="58%" r="48%">
            <stop offset="0%" stopColor="#dff8ff" />
            <stop offset="38%" stopColor="#2dd4bf" />
            <stop offset="74%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#082f49" />
          </radialGradient>
          <linearGradient id="nightSky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="62%" stopColor="#0b1535" />
            <stop offset="100%" stopColor="#08111f" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="1000" height="760" fill="url(#nightSky)" />
        {Array.from({ length: 80 }, (_, index) => (
          <circle key={index} cx={(index * 79) % 1000} cy={(index * 47) % 420} r={index % 9 === 0 ? 1.9 : 1.1} fill="#e0f2fe" opacity={0.35 + (index % 5) * 0.09} />
        ))}
        <g className="atmosphere-shells">
          {atmosphereLayers.map((layer, index) => {
            const radius = 310 + index * 72 * scale;
            const y = 720;
            return (
              <g key={layer.id} className={layer.id === selected.id ? "atmos-shell atmos-shell-active" : "atmos-shell"} onClick={() => onSelect(layer.id)}>
                <path d={`M${500 - radius} ${y} A${radius} ${radius * 0.58} 0 0 1 ${500 + radius} ${y}`} stroke={layer.color} />
                <path d={`M${500 - radius + 8} ${y} A${radius - 8} ${(radius - 8) * 0.58} 0 0 1 ${500 + radius - 8} ${y}`} stroke={layer.color} opacity="0.16" />
              </g>
            );
          })}
        </g>
        <g filter="url(#softGlow)">
          <path className="aurora-ribbon aurora-a" d="M130 270C230 220 300 325 390 255S560 220 650 260S790 315 890 245" />
          <path className="aurora-ribbon aurora-b" d="M95 320C210 260 315 365 420 295S595 270 705 310S820 355 930 285" />
        </g>
        <g className="earth-group">
          <circle cx="500" cy="760" r="240" fill="url(#earthGlow)" />
          <path d="M318 622C390 590 426 626 470 608C530 584 557 618 616 599C674 579 712 614 760 596" fill="none" stroke="#ecfeff" strokeWidth="10" opacity="0.58" />
          <path d="M342 688C414 656 438 700 505 674C575 647 614 704 698 666" fill="none" stroke="#f8fafc" strokeWidth="8" opacity="0.34" />
          <circle cx="500" cy="760" r="246" fill="none" stroke="#67e8f9" strokeWidth="3" opacity="0.55" />
        </g>
        {atmosphereLayers.map((layer) => {
          const object = objectPositions[layer.id];
          return (
            <g key={layer.id} className={layer.id === selected.id ? "atmos-object atmos-object-active" : "atmos-object"} transform={`translate(${object.x * 10} ${object.y * 7.2})`} onClick={() => onSelect(layer.id)}>
              <AtmosphereSvgIcon visual={object.visual} />
              {showLabels && <text x="0" y="56">{object.label}</text>}
            </g>
          );
        })}
        {showLabels && atmosphereLayers.map((layer, index) => (
          <g key={layer.id} className={layer.id === selected.id ? "atmos-label atmos-label-active" : "atmos-label"} onClick={() => onSelect(layer.id)}>
            <text x="500" y={626 - index * 89} textAnchor="middle">{layer.name}</text>
            <text x="500" y={651 - index * 89} textAnchor="middle" className="atmos-label-small">{layer.altitude}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: "orbit" | "rocket" | "spark"; label: string; value: string | number }) {
  return (
    <div className="metric-card">
      <div className="flex items-center gap-2">
        <PhysicsIcon name={icon} className="h-4 w-4 text-cyan-500" />
        <div className="ui-label">{label}</div>
      </div>
      <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
    </div>
  );
}

function AtmosphereIcon({ visual, compact = false }: { visual: AtmosphereVisual; compact?: boolean }) {
  return (
    <span className={compact ? "atmosphere-icon atmosphere-icon-compact" : "atmosphere-icon"} aria-hidden="true">
      <svg viewBox="-48 -48 96 96">{iconArt[visual]}</svg>
    </span>
  );
}

function AtmosphereSvgIcon({ visual }: { visual: AtmosphereVisual }) {
  return <g>{iconArt[visual]}</g>;
}

const iconArt: Record<AtmosphereVisual, ReactNode> = {
  balloon: <><circle cx="0" cy="-16" r="20" fill="#f8fafc" /><path d="M-8 4H8L4 22H-4Z" fill="#f97316" /><path d="M-10 5L-4 22M10 5L4 22" stroke="#e2e8f0" strokeWidth="2" /></>,
  plane: <><path d="M-42 4L34-15L44-7L10 10L24 30L13 34L-8 16L-35 24L-42 18L-20 6Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" /><path d="M-10 4L16-3" stroke="#0ea5e9" strokeWidth="3" /></>,
  rocket: <><path d="M0-42C18-22 16 8 0 34C-16 8-18-22 0-42Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" /><path d="M-12 16L-28 32L-8 28M12 16L28 32L8 28" fill="#cbd5e1" /><circle cx="0" cy="-16" r="7" fill="#38bdf8" /><path d="M-8 34L0 48L8 34" fill="#f97316" /></>,
  meteor: <><path d="M-42 24C-18 8 10-10 42-32" stroke="#fb923c" strokeWidth="9" strokeLinecap="round" /><path d="M-34 32C-10 16 14-2 38-16" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" /><circle cx="-42" cy="24" r="9" fill="#f97316" /></>,
  aurora: <><path d="M-44 8C-24-20-6 28 16-4S34-24 46 6" fill="none" stroke="#86efac" strokeWidth="8" strokeLinecap="round" /><path d="M-44 20C-24-8-6 40 16 8S34-12 46 18" fill="none" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" /></>,
  satellite: <><rect x="-10" y="-10" width="20" height="20" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" /><rect x="-44" y="-14" width="28" height="28" fill="#67e8f9" opacity="0.9" /><rect x="16" y="-14" width="28" height="28" fill="#67e8f9" opacity="0.9" /><path d="M-16 0H16M0 10L0 32M0 32L15 42" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" /></>,
  shuttle: <><path d="M-42 4L28-30C38-20 42-2 34 16L-10 28Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" /><path d="M-16 26L-34 40L-28 16" fill="#cbd5e1" /><path d="M12-12L30-2" stroke="#38bdf8" strokeWidth="4" /></>,
  radiosonde: <><circle cx="0" cy="-20" r="22" fill="#f8fafc" /><path d="M0 2V25" stroke="#e2e8f0" strokeWidth="2" /><rect x="-10" y="25" width="20" height="15" rx="3" fill="#f97316" /></>,
};
