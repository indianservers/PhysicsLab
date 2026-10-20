import { discoverObjects, layoutObjects, physicalScreenSize } from "./scaleUniverseLayout.js";
export const visibleRange = 2.2;

const assetImageCache = new Map();

export function getScaleBand(log) {
  if (log < -12) return "Subatomic";
  if (log < -9) return "Atomic";
  if (log < -6) return "Molecular";
  if (log < -3) return "Cellular / Microscopic";
  if (log < 3) return "Human Scale";
  if (log < 8) return "Planetary";
  if (log < 13) return "Solar System";
  if (log < 18) return "Interstellar";
  if (log < 23) return "Galactic";
  return "Cosmic";
}

export function renderScaleUniverse(ctx, state) {
  const { width, height, currentLog, panX, panY, objects, selectedObjectId } = state;
  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, currentLog);
  drawScaleGrid(ctx, width, height, currentLog);
  const candidates = discoverObjects(objects, currentLog, width, height, selectedObjectId, state.categoryFilters);
  const visible = layoutObjects(candidates, width, height, panX, panY, selectedObjectId);
  state.layoutPositions ??= new Map();
  state.layoutAnimating = false;
  for (const entry of visible) {
    const previous = state.layoutPositions.get(entry.object.id);
    if (previous && !state.prefersReducedMotion) {
      const dx = entry.screenX - previous.x, dy = entry.screenY - previous.y;
      if (Math.abs(dx) + Math.abs(dy) > .5) {
        entry.screenX = previous.x + dx * .22; entry.screenY = previous.y + dy * .22;
        state.layoutAnimating = true;
      }
    }
    state.layoutPositions.set(entry.object.id, { x: entry.screenX, y: entry.screenY });
  }
  const activeIds = new Set(visible.map(entry => entry.object.id));
  for (const id of state.layoutPositions.keys()) if (!activeIds.has(id)) state.layoutPositions.delete(id);
  const labels = [];
  if (!visible.length) {
    ctx.fillStyle = "#a8c6db"; ctx.font = "13px Inter, system-ui"; ctx.textAlign = "center";
    ctx.fillText("No catalog reference at this length. Use the ruler or search to continue.", width / 2, height * .65, width - 32);
  }
  for (const entry of visible) {
    ctx.save(); ctx.globalAlpha = entry.opacity;
    const { screenX: x, screenY: y, boxWidth: w, boxHeight: h, object } = entry;
    const floor = y + h / 2 + 5;
    ctx.strokeStyle = "rgba(102,210,244,.24)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(x, floor, Math.max(14, w * .6), 5, 0, 0, Math.PI * 2); ctx.stroke();
    // Generated cutouts own their appearance. While their PNG loads, retain the
    // measurement bracket instead of briefly showing an unrelated fallback model.
    let useModel;
    if (object.sourceBox) {
      drawAssetSprite(ctx, object, x, y, entry.radius);
      useModel = true;
    } else useModel = state.models?.draw(ctx, object, x, y, w, h);
    if (!useModel) {
      if (object.category === "Astronomical Distance" || object.id === "planck-length" || object.id === "electron" || object.id.includes("quark")) {
        drawLineDistance(ctx, x, y, entry.extent / 3, "#9edaf0");
      } else drawObject(ctx, entry);
    }
    // Honest measurement bracket is exactly extent pixels, independent of artwork.
    ctx.strokeStyle = "rgba(139,211,239,.65)"; ctx.lineWidth = 1;
    if (object.dimensionAxis === "vertical") {
      const axisX = x + w / 2 + 12;
      ctx.beginPath(); ctx.moveTo(axisX, y - entry.extent / 2); ctx.lineTo(axisX, y + entry.extent / 2); ctx.stroke();
      for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(axisX - 4, y + side * entry.extent / 2); ctx.lineTo(axisX + 4, y + side * entry.extent / 2); ctx.stroke(); }
    } else {
      ctx.beginPath(); ctx.moveTo(x - entry.extent / 2, floor + 9); ctx.lineTo(x + entry.extent / 2, floor + 9); ctx.stroke();
      for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + side * entry.extent / 2, floor + 5); ctx.lineTo(x + side * entry.extent / 2, floor + 13); ctx.stroke(); }
    }
    ctx.restore();
    drawLabel(ctx, entry, labels, currentLog, width, object.id === selectedObjectId, height);
  }
  const selected = visible.find(entry => entry.object.id === selectedObjectId);
  if (selected) drawSelection(ctx, selected);
  ctx.font = `${width < 600 ? 9 : 11}px Inter, system-ui`; ctx.fillStyle = "#9bb9cc"; ctx.textAlign = "left";
  ctx.fillText(width < 600 ? `${visible.length} visible / ${objects.length} searchable · shared physical scale` : `${visible.length} visible / ${objects.length} searchable · shared physical scale · illustrative surfaces`, 18, height - 16);
  // One reference length, not the width of the entire view.
  if (width >= 600) { ctx.textAlign = "right"; ctx.fillText(`76 px = ${formatScaleLength(currentLog)}`, width - 18, height - 16); }
  return visible;
}
function formatScaleLength(log) { return `10^${log.toFixed(2)} m`; }

function drawBackground(ctx, width, height, log) {
  ctx.fillStyle = "#030a18"; ctx.fillRect(0, 0, width, height);
  const image = getAssetImage("/assets/scale-universe/cosmic-backdrop-v2.png");
  if (image?.complete && image.naturalWidth) {
    const factor = Math.max(width / image.width, height / image.height);
    ctx.save(); ctx.globalAlpha = log < -3 ? .2 : .65;
    ctx.drawImage(image, (width - image.width * factor) / 2, (height - image.height * factor) / 2, image.width * factor, image.height * factor); ctx.restore();
  }
  const hue = log < -9 ? 255 : log < -3 ? 170 : log < 6 ? 207 : log < 18 ? 225 : 260;
  const glow = ctx.createRadialGradient(width * .5, height * .65, 0, width * .5, height * .65, width * .7);
  glow.addColorStop(0, `hsla(${hue},65%,32%,.22)`); glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(222,240,255,.45)";
  for (let i = 0; i < 110; i++) { ctx.beginPath(); ctx.arc((i * 137.5) % width, (i * 83.7) % height, i % 5 ? .5 : 1, 0, Math.PI * 2); ctx.fill(); }
}
function drawScaleGrid(ctx, width, height, log) {
  const horizon = height * .2;
  ctx.strokeStyle = "rgba(112,194,235,.12)"; ctx.lineWidth = 1;
  for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(width / 2 + i * 18, horizon); ctx.lineTo(width / 2 + i * 150, height); ctx.stroke(); }
  for (let i = 0; i < 14; i++) { const y = horizon + (height - horizon) * (i / 13) ** 2; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
}

function drawObject(ctx, entry) {
  const { object, screenX: x, screenY: y, radius: r } = entry;
  if (object.assetPath && !["Particles", "Atoms", "Cells and Microbes"].includes(object.categoryGroup) && drawAssetSprite(ctx, object, x, y, r)) return;
  if (object.renderStyle === "atom" || (object.renderStyle === "circle" && object.categoryGroup === "Atoms")) return drawAtom(ctx, x, y, r, object.color);
  if (object.renderStyle === "circle" && object.categoryGroup === "Molecules") return drawMolecule(ctx, x, y, r, object.color);
  if (object.renderStyle === "molecule") return drawMolecule(ctx, x, y, r, object.color);
  if (object.renderStyle === "dna") return drawDna(ctx, x, y, r, object.color);
  if (object.renderStyle === "virus") return drawVirus(ctx, x, y, r, object.color);
  if (object.renderStyle === "bacteria") return drawBacteria(ctx, x, y, r, object.color);
  if (object.renderStyle === "redBloodCell") return drawRedBloodCell(ctx, x, y, r, object.color);
  if (object.renderStyle === "whiteBloodCell") return drawWhiteBloodCell(ctx, x, y, r, object.color);
  if (object.renderStyle === "cell") return drawCell(ctx, x, y, r, object.color);
  if (object.renderStyle === "planetRings") return drawPlanetRings(ctx, x, y, r, object.color);
  if (object.renderStyle === "planet") return drawPlanet(ctx, x, y, r, object.color);
  if (object.renderStyle === "star") return drawStar(ctx, x, y, r, object.color);
  if (object.renderStyle === "galaxy") return drawGalaxy(ctx, x, y, r, object.color);
  if (object.renderStyle === "cosmicStructure") return drawCosmicStructure(ctx, x, y, r, object.color);
  if (object.renderStyle === "human") return drawHuman(ctx, x, y, r, object.color);
  if (object.renderStyle === "animal") return drawAnimal(ctx, x, y, r, object.color);
  if (object.renderStyle === "building") return drawBuilding(ctx, x, y, r, object.color);
  if (object.renderStyle === "vehicle") return drawVehicle(ctx, x, y, r, object.color);
  if (object.renderStyle === "mountain") return drawMountain(ctx, x, y, r, object.color);
  if (object.renderStyle === "lineDistance") return drawLineDistance(ctx, x, y, r, object.color);
  if (object.renderStyle === "ellipse") return drawEllipse(ctx, x, y, r, object.color);
  return drawParticle(ctx, x, y, r, object.color);
}

function drawAssetSprite(ctx, object, x, y, r) {
  const image = getAssetImage(object.assetPath);
  if (!image || !image.complete || image.naturalWidth === 0) return false;
  const { width, height } = getAssetSpriteBox(object, image, r);
  ctx.save();
  // Luminous deep-space imagery is composited additively, without an opaque
  // rectangular backing. Everyday reference sprites retain their original art.
  if (["Galaxy", "Nebula", "Supercluster", "Galaxy Group", "Cosmic Horizon", "Cosmic Structure", "Star Cluster"].includes(object.category)) ctx.globalCompositeOperation = "screen";
  ctx.shadowColor = "rgba(0,0,0,0.34)";
  ctx.shadowBlur = Math.max(6, Math.max(width, height) * 0.08);
  ctx.shadowOffsetY = Math.max(2, Math.max(width, height) * 0.04);
  if (object.sourceBox) ctx.drawImage(image, ...object.sourceBox, x - width / 2, y - height / 2, width, height);
  else ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
  ctx.restore();
  return true;
}

function getAssetSpriteBox(object, image, r) {
  const aspect = object.sourceBox ? object.sourceBox[2] / object.sourceBox[3] : image.naturalWidth / image.naturalHeight || 1;
  const extent = r * 2;
  if (object.dimensionAxis === "vertical") return { width: extent * aspect, height: extent };
  return { width: extent, height: extent / aspect };
}

function getAssetImage(src) {
  if (typeof Image === "undefined") return null;
  const cached = assetImageCache.get(src);
  if (cached) return cached;
  const image = new Image();
  image.decoding = "async";
  image.loading = "eager";
  image.onload = () => window.dispatchEvent(new Event("scale-asset-ready"));
  image.src = src;
  assetImageCache.set(src, image);
  if (assetImageCache.size > 48) assetImageCache.delete(assetImageCache.keys().next().value);
  return image;
}

function drawAtom(ctx, x, y, r, color) {
  // Probability-density schematic. No fixed classical orbital tracks.
  const cloud = ctx.createRadialGradient(x, y, 0, x, y, r);
  cloud.addColorStop(0, "rgba(135,191,255,.65)"); cloud.addColorStop(.4, "rgba(100,160,255,.25)"); cloud.addColorStop(1, "rgba(100,160,255,0)");
  ctx.fillStyle = cloud; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  const baseAlpha = ctx.globalAlpha;
  for (let i = 0; i < 170; i++) {
    const fraction = value => value - Math.floor(value);
    const angle = fraction(Math.sin(i * 127.1 + 19.7) * 43758.5453) * Math.PI * 2;
    const distance = r * Math.sqrt(fraction(Math.sin(i * 311.7 + 41.3) * 18342.716));
    ctx.globalAlpha = baseAlpha * (.2 + .5 * (1 - distance / r)); ctx.beginPath(); ctx.arc(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, .7, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = baseAlpha;
}

function drawMolecule(ctx, x, y, r, color) {
  const points = [
    [x - r * 0.55, y + r * 0.08, r * 0.34],
    [x + r * 0.15, y - r * 0.2, r * 0.45],
    [x + r * 0.72, y + r * 0.22, r * 0.28],
  ];
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = Math.max(2, r * 0.08);
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  ctx.lineTo(points[1][0], points[1][1]);
  ctx.lineTo(points[2][0], points[2][1]);
  ctx.stroke();
  for (const [px, py, pr] of points) drawParticle(ctx, px, py, pr, color);
}

function drawVirus(ctx, x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, r * 0.06);
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82);
    ctx.lineTo(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2);
    ctx.stroke();
    drawParticle(ctx, x + Math.cos(a) * r * 1.28, y + Math.sin(a) * r * 1.28, r * 0.12, color);
  }
  drawCell(ctx, x, y, r, color);
}

function drawParticle(ctx, x, y, r, color) {
  const glow = ctx.createRadialGradient(x, y, 1, x, y, r * 2.3);
  glow.addColorStop(0, color);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(4, r * 0.55), 0, Math.PI * 2);
  ctx.fill();
}

function drawEllipse(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.35, r * 0.72, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.stroke();
}

function drawCell(ctx, x, y, r, color) {
  drawEllipse(ctx, x, y, r, color);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.58, r * 0.34, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(x + Math.cos(i * 1.7) * r * 0.52, y + Math.sin(i * 1.4) * r * 0.34, Math.max(2, r * 0.07), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRedBloodCell(ctx, x, y, r, color) {
  drawEllipse(ctx, x, y, r, color);
  const dent = ctx.createRadialGradient(x, y, 1, x, y, r * 0.9);
  dent.addColorStop(0, "rgba(80, 0, 0, 0.45)");
  dent.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = dent;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.7, r * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawWhiteBloodCell(ctx, x, y, r, color) {
  drawCell(ctx, x, y, r, color);
  ctx.fillStyle = "rgba(59, 130, 246, 0.55)";
  ctx.beginPath();
  ctx.arc(x - r * 0.1, y, r * 0.28, 0, Math.PI * 2);
  ctx.arc(x + r * 0.18, y + r * 0.08, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

function drawBacteria(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  roundedCapsule(ctx, x - r, y - r * 0.48, r * 2, r * 0.96, r * 0.48);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.stroke();
  ctx.strokeStyle = color;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x + r * 0.8, y + i * r * 0.16);
    ctx.quadraticCurveTo(x + r * 1.45, y + i * r * 0.4, x + r * 1.9, y + i * r * 0.1);
    ctx.stroke();
  }
}

function drawDna(ctx, x, y, r, color) {
  ctx.lineWidth = Math.max(2, r * 0.07);
  for (const offset of [-0.32, 0.32]) {
    ctx.strokeStyle = offset < 0 ? color : "#38bdf8";
    ctx.beginPath();
    for (let i = -20; i <= 20; i += 1) {
      const px = x + (i / 20) * r * 1.5;
      const py = y + Math.sin(i * 0.75) * r * 0.32 + offset * r;
      if (i === -20) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  for (let i = -16; i <= 16; i += 4) {
    ctx.beginPath();
    ctx.moveTo(x + (i / 20) * r * 1.5, y + Math.sin(i * 0.75) * r * 0.32 - r * 0.22);
    ctx.lineTo(x + (i / 20) * r * 1.5, y + Math.sin(i * 0.75) * r * 0.32 + r * 0.22);
    ctx.stroke();
  }
}

function drawPlanet(ctx, x, y, r, color) {
  const gradient = ctx.createRadialGradient(x - r * 0.35, y - r * 0.38, r * 0.1, x, y, r);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.25, color);
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.stroke();
}

function drawPlanetRings(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = Math.max(2, r * 0.05);
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.65, r * 0.42, -0.25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  drawPlanet(ctx, x, y, r, color);
}

function drawStar(ctx, x, y, r, color) {
  const glow = ctx.createRadialGradient(x, y, r * 0.1, x, y, r * 2.4);
  glow.addColorStop(0, "#ffffff");
  glow.addColorStop(0.35, color);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawGalaxy(ctx, x, y, r, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.35);
  const gradient = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 1.7);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.65, r * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  for (let arm = 0; arm < 2; arm += 1) {
    ctx.beginPath();
    for (let i = 0; i < 70; i += 1) {
      const t = i / 10;
      const a = t + arm * Math.PI;
      const px = Math.cos(a) * t * r * 0.13;
      const py = Math.sin(a) * t * r * 0.05;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawCosmicStructure(ctx, x, y, r, color) {
  ctx.strokeStyle = "rgba(147,197,253,0.45)";
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1, r * 0.025);
  const points = [];
  for (let i = 0; i < 14; i += 1) {
    points.push([x + Math.cos(i * 2.1) * r * (0.25 + (i % 5) * 0.18), y + Math.sin(i * 1.7) * r * (0.25 + (i % 4) * 0.18)]);
  }
  ctx.beginPath();
  for (let i = 0; i < points.length - 1; i += 1) {
    ctx.moveTo(points[i][0], points[i][1]);
    ctx.lineTo(points[i + 1][0], points[i + 1][1]);
  }
  ctx.stroke();
  for (const [px, py] of points) {
    ctx.beginPath();
    ctx.arc(px, py, Math.max(2, r * 0.06), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHuman(ctx, x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2, r * 0.08);
  ctx.beginPath();
  ctx.arc(x, y - r * 0.52, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y - r * 0.32);
  ctx.lineTo(x, y + r * 0.35);
  ctx.moveTo(x - r * 0.38, y - r * 0.02);
  ctx.lineTo(x + r * 0.38, y - r * 0.02);
  ctx.moveTo(x, y + r * 0.35);
  ctx.lineTo(x - r * 0.35, y + r * 0.82);
  ctx.moveTo(x, y + r * 0.35);
  ctx.lineTo(x + r * 0.35, y + r * 0.82);
  ctx.stroke();
}

function drawAnimal(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.15, r * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + r * 0.9, y - r * 0.25, r * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, r * 0.08);
  for (const lx of [-0.45, -0.12, 0.35, 0.68]) {
    ctx.beginPath();
    ctx.moveTo(x + lx * r, y + r * 0.42);
    ctx.lineTo(x + lx * r, y + r * 1.05);
    ctx.stroke();
  }
}

function drawMountain(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - r * 1.4, y + r);
  ctx.lineTo(x - r * 0.3, y - r * 1.25);
  ctx.lineTo(x + r * 0.25, y + r * 0.2);
  ctx.lineTo(x + r * 0.65, y - r * 0.65);
  ctx.lineTo(x + r * 1.45, y + r);
  ctx.closePath();
  ctx.fill();
}

function drawBuilding(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - r * 0.55, y - r, r * 1.1, r * 2);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  const cols = 3;
  const rows = 5;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      ctx.fillRect(x - r * 0.38 + col * r * 0.28, y - r * 0.75 + row * r * 0.3, r * 0.12, r * 0.12);
    }
  }
}

function drawVehicle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  roundedCapsule(ctx, x - r * 1.1, y - r * 0.35, r * 2.2, r * 0.7, r * 0.15);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillRect(x - r * 0.55, y - r * 0.25, r * 0.32, r * 0.22);
  ctx.fillRect(x + r * 0.05, y - r * 0.25, r * 0.32, r * 0.22);
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(x - r * 0.65, y + r * 0.38, r * 0.18, 0, Math.PI * 2);
  ctx.arc(x + r * 0.65, y + r * 0.38, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawLineDistance(ctx, x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(3, r * 0.06);
  ctx.beginPath();
  ctx.moveTo(x - r * 1.5, y);
  ctx.lineTo(x + r * 1.5, y);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - r * 1.5, y, Math.max(4, r * 0.16), 0, Math.PI * 2);
  ctx.arc(x + r * 1.5, y, Math.max(4, r * 0.16), 0, Math.PI * 2);
  ctx.fill();
}

function drawLabel(ctx, entry, labels, log, canvasWidth, isSelected = false, canvasHeight = 600) {
  const { object, screenX: x, screenY: y, radius: r, opacity } = entry;
  const dark = true;
  const maxLabelWidth = Math.max(116, canvasWidth - 24);
  const fontSize = canvasWidth < 480 ? 11 : 12;
  ctx.font = `${object.importance >= 9 || isSelected ? 800 : 650} ${fontSize}px Inter, system-ui, sans-serif`;
  const text = object.name;
  const metrics = ctx.measureText(text);
  const width = Math.min(metrics.width + 14, maxLabelWidth);
  const height = canvasWidth < 480 ? 24 : 26;
  let rect = { x: clamp(x - width / 2, 8, canvasWidth - width - 8), y: clamp(y + entry.boxHeight / 2 + 20, 108, canvasHeight - 54), width, height };
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (!labels.some((other) => overlaps(rect, other))) break;
    rect = { ...rect, y: rect.y + height + 3 };
  }
  if (!isSelected && labels.some((other) => overlaps(rect, other))) return;
  labels.push(rect);
  ctx.globalAlpha = isSelected ? 1 : opacity;
  ctx.fillStyle = dark ? "rgba(5, 8, 22, 0.78)" : "rgba(255,255,255,0.82)";
  roundedCapsule(ctx, rect.x, rect.y, rect.width, rect.height, 9);
  ctx.fill();
  ctx.strokeStyle = "#4d91b7"; ctx.stroke();
  ctx.fillStyle = "#e6f5ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, rect.x + rect.width / 2, rect.y + height / 2 + 1, rect.width - 10);
  ctx.globalAlpha = 1;
}

function drawSelection(ctx, entry) {
  ctx.save();
  ctx.strokeStyle = "#a78bfa";
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 7]);
  ctx.beginPath();
  ctx.arc(entry.screenX, entry.screenY, entry.radius * 1.35 + 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function roundedCapsule(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
