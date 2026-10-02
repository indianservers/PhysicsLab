import { CSSProperties, ReactNode, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { AtmosphereVisual, atmosphereLayers, atmosphereStats } from "../lib/atmosphere";
import { PhysicsIcon } from "../lib/icons";
import "./atmosphere-premium.css";

const layerStageY: Record<string, number> = {
  exosphere: 12,
  thermosphere: 30,
  mesosphere: 48,
  stratosphere: 66,
  troposphere: 84,
};

const layerPressure: Record<string, string> = {
  troposphere: "101.3 to 19.4 kPa",
  stratosphere: "19.4 to 0.08 kPa",
  mesosphere: "80 to 0.4 Pa",
  thermosphere: "0.4 to 10⁻⁷ Pa",
  exosphere: "Below 10⁻⁷ Pa",
};

const graphPoint: Record<string, [number, number]> = {
  troposphere: [224, 137],
  stratosphere: [76, 111],
  mesosphere: [38, 83],
  thermosphere: [206, 45],
  exosphere: [240, 22],
};

export function AtmospherePage() {
  const [searchParams] = useSearchParams();
  const requestedLayer = searchParams.get("layer");
  const [selectedId, setSelectedId] = useState(
    atmosphereLayers.some((layer) => layer.id === requestedLayer) ? requestedLayer ?? "troposphere" : "troposphere"
  );
  const [showLabels, setShowLabels] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const selected = atmosphereLayers.find((layer) => layer.id === selectedId) ?? atmosphereLayers[0];

  return (
    <div className="min-h-screen atmosphere-premium-root">
      <Toolbar hideRail />
      <main id="content" className="atmosphere-page atmosphere-premium-page desktop-page">
        <section className="atmosphere-compact-hero">
          <div className="atmosphere-title-lockup">
            <span className="atmosphere-title-icon"><PhysicsIcon name="orbit" /></span>
            <h1>Layers of Earth's Atmosphere</h1>
          </div>
          <p>Explore how temperature, pressure and atmospheric phenomena change with altitude.</p>
          <div className="atmosphere-header-stats">
            <HeaderMetric icon="orbit" value={atmosphereStats.layers} label="layers" />
            <HeaderMetric icon="rocket" value={`${atmosphereStats.maxAltitudeKm}+`} label="km" />
            <HeaderMetric icon="spark" value={atmosphereStats.examples} label="objects" />
          </div>
        </section>

        <section className="atmosphere-explorer-layout">
          <aside className="atmosphere-layer-panel">
            <p className="atmosphere-panel-kicker">SELECT LAYER</p>
            <div className="atmosphere-layer-list">
              {atmosphereLayers.map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  className={layer.id === selected.id ? "atmosphere-layer-choice active" : "atmosphere-layer-choice"}
                  onClick={() => setSelectedId(layer.id)}
                  style={{ "--layer-color": layer.color } as CSSProperties}
                  aria-pressed={layer.id === selected.id}
                >
                  <AtmosphereLayerThumb id={layer.id} />
                  <span><b>{layer.name}</b><small>{layer.altitude}</small></span>
                  {layer.id === selected.id && <i aria-hidden="true">✓</i>}
                </button>
              ))}
            </div>
            <div className="atmosphere-view-toggles">
              <Toggle icon="book" label="Show labels" checked={showLabels} onChange={setShowLabels} />
              <Toggle icon="chart" label="Temperature profile" checked={showTemperature} onChange={setShowTemperature} />
            </div>
          </aside>

          <section className="atmosphere-image-stage" aria-label="Interactive atmosphere layer visualization">
            <div className={`atmosphere-layer-focus focus-${selected.id}`} aria-hidden="true" />
            {[...atmosphereLayers].reverse().map((layer) => (
              <button
                key={layer.id}
                type="button"
                className={layer.id === selected.id ? "atmosphere-stage-label active" : "atmosphere-stage-label"}
                style={{ "--layer-y": `${layerStageY[layer.id]}%`, "--layer-color": layer.color } as CSSProperties}
                onClick={() => setSelectedId(layer.id)}
                aria-label={`Select ${layer.name}, ${layer.altitude}`}
              >
                {showLabels && <span><b>{layer.name}</b><small>{layer.altitude}</small></span>}
              </button>
            ))}
            <StageObject visual="satellite" label="Satellite" className="object-satellite" showLabel={showLabels} />
            <StageObject visual="aurora" label="Aurora" className="object-aurora" showLabel={showLabels} />
            <StageObject visual="meteor" label="Meteor" className="object-meteor" showLabel={showLabels} />
            <StageObject visual="balloon" label="Weather balloon" className="object-balloon" showLabel={showLabels} />
            <StageObject visual="plane" label="Passenger plane" className="object-plane" showLabel={showLabels} />
          </section>

          <aside className="atmosphere-science-panel">
            <div className="atmosphere-detail-heading">
              <AtmosphereLayerThumb id={selected.id} round />
              <div><p>{selected.altitude}</p><h2>{selected.name}</h2></div>
            </div>
            <p className="atmosphere-detail-copy">{selected.summary} {selected.science}</p>
            <div className="atmosphere-reading-grid">
              <div className="temperature"><span><PhysicsIcon name="thermometer" />Temperature</span><b>{selected.temperature}</b></div>
              <div className="pressure"><span><PhysicsIcon name="gauge" />Air pressure</span><b>{layerPressure[selected.id]}</b></div>
            </div>
            <div className="atmosphere-feature-list">
              {selected.features.map((feature) => <span key={feature}>{feature}</span>)}
            </div>
            {showTemperature && <TemperatureProfile selectedId={selected.id} />}
          </aside>
        </section>
      </main>
    </div>
  );
}

function HeaderMetric({ icon, value, label }: { icon: "orbit" | "rocket" | "spark"; value: string | number; label: string }) {
  return <div><PhysicsIcon name={icon} /><b>{value}</b><span>{label}</span></div>;
}

function Toggle({ icon, label, checked, onChange }: { icon: "book" | "chart"; label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="atmosphere-switch-row">
      <PhysicsIcon name={icon} /><span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

function AtmosphereLayerThumb({ id, round = false }: { id: string; round?: boolean }) {
  return <span className={`atmosphere-photo-thumb thumb-${id}${round ? " round" : ""}`} aria-hidden="true" />;
}

function StageObject({ visual, label, className, showLabel }: { visual: AtmosphereVisual; label: string; className: string; showLabel: boolean }) {
  return (
    <span className={`atmosphere-stage-object ${className}`} aria-hidden="true">
      <svg viewBox="-48 -48 96 96">{iconArt[visual]}</svg>
      {showLabel && <small>{label}</small>}
    </span>
  );
}

function TemperatureProfile({ selectedId }: { selectedId: string }) {
  const [x, y] = graphPoint[selectedId];
  return (
    <div className="atmosphere-temperature-chart">
      <p>TEMPERATURE VS ALTITUDE</p>
      <svg viewBox="0 0 280 170" role="img" aria-label="Temperature variation with atmospheric altitude">
        <g className="chart-grid"><path d="M34 12V142H268M34 38H268M34 64H268M34 90H268M34 116H268M80 12V142M126 12V142M172 12V142M218 12V142" /></g>
        <polyline points="224,137 150,125 76,111 122,96 38,83 92,66 206,45 240,22" />
        <circle cx={x} cy={y} r="5" />
        <g className="chart-labels"><text x="20" y="146">0</text><text x="8" y="94">50</text><text x="2" y="42">100</text><text x="32" y="160">−80</text><text x="116" y="160">−40</text><text x="210" y="160">0</text><text x="256" y="160">20</text></g>
      </svg>
      <span>Temperature (°C)</span>
    </div>
  );
}

const iconArt: Record<AtmosphereVisual, ReactNode> = {
  balloon: <><ellipse cx="0" cy="-14" rx="18" ry="25" fill="#f8fafc" /><path d="M-8 6H8L4 22H-4Z" fill="#bf7b35" /><path d="M-10 4L-4 22M10 4L4 22" stroke="#dbeafe" strokeWidth="2" /></>,
  plane: <><path d="M-42 4L34-15L44-7L10 10L24 30L13 34L-8 16L-35 24L-42 18L-20 6Z" fill="#eef6ff" stroke="#7c9bb7" strokeWidth="2" /><path d="M-10 4L16-3" stroke="#2d83d6" strokeWidth="3" /></>,
  rocket: <><path d="M0-42C18-22 16 8 0 34C-16 8-18-22 0-42Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" /><circle cx="0" cy="-16" r="7" fill="#38bdf8" /><path d="M-8 34L0 48L8 34" fill="#f97316" /></>,
  meteor: <><path d="M-42 24C-18 8 10-10 42-32" stroke="#fb923c" strokeWidth="9" strokeLinecap="round" /><path d="M-34 32C-10 16 14-2 38-16" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" /><circle cx="-42" cy="24" r="9" fill="#f97316" /></>,
  aurora: <><path d="M-44 8C-24-20-6 28 16-4S34-24 46 6" fill="none" stroke="#86efac" strokeWidth="8" strokeLinecap="round" /><path d="M-44 20C-24-8-6 40 16 8S34-12 46 18" fill="none" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" /></>,
  satellite: <><rect x="-10" y="-10" width="20" height="20" rx="4" fill="#dbe6ef" stroke="#71869a" strokeWidth="2" /><rect x="-44" y="-14" width="28" height="28" fill="#285c9d" /><rect x="16" y="-14" width="28" height="28" fill="#285c9d" /><path d="M-16 0H16M0 10V32M0 32L15 42" stroke="#e2e8f0" strokeWidth="3" /></>,
  shuttle: <><path d="M-42 4L28-30C38-20 42-2 34 16L-10 28Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" /></>,
  radiosonde: <><circle cx="0" cy="-20" r="22" fill="#f8fafc" /><path d="M0 2V25" stroke="#e2e8f0" strokeWidth="2" /><rect x="-10" y="25" width="20" height="15" rx="3" fill="#f97316" /></>,
};
