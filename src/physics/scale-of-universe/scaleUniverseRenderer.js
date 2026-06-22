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
  const labels = [];
  const selectedObject = objects.find((object) => object.id === selectedObjectId);
  const responsiveRange = getResponsiveVisibleRange(width);
  const displayPool = state.displayObjects ?? objects;
  const objectLimit = Math.round(clamp(state.objectDisplayLimit ?? displayPool.length, 30, displayPool.length));
  const viewportLimit = getResponsiveObjectLimit(width);
  const displayObjects = displayPool.slice(0, objectLimit);
  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, currentLog);
  drawScaleGrid(ctx, width, height, currentLog);

  const filters = state.categoryFilters ?? new Set();
  let visible = displayObjects
    .filter((object) => filters.size === 0 || filters.has(object.categoryGroup) || object.id === selectedObjectId)
    .map((object) => {
      const distance = Math.abs(object.logSize - currentLog);
      const opacity = clamp(1 - distance / responsiveRange, 0, 1);
      const radius = clamp(28 * Math.pow(10, (object.logSize - currentLog) * 0.32), 8, 180);
      const screenX = width / 2 + panX + object.x * 1.05;
      const screenY = height / 2 + panY + object.y * 1.05;
      return { object, distance, opacity, radius, screenX, screenY };
    })
    .filter((entry) => entry.distance < responsiveRange);

  const selectedEntry = selectedObject
    ? visible.find((entry) => entry.object.id === selectedObject.id) ??
      makeEntryForSelected(selectedObject, state, responsiveRange)
    : null;

  visible = visible
    .sort((a, b) => b.opacity + b.object.importance / 10 - (a.opacity + a.object.importance / 10))
    .slice(0, viewportLimit);

  if (selectedEntry && !visible.some((entry) => entry.object.id === selectedEntry.object.id)) {
    visible.push(selectedEntry);
  }

  visible.sort((a, b) => a.radius - b.radius);

  for (const entry of visible) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.08, entry.opacity);
    drawObject(ctx, entry);
    ctx.restore();
  }

  for (const entry of visible.sort((a, b) => b.object.importance - a.object.importance)) {
    const isSelected = entry.object.id === selectedObjectId;
    if (!isSelected && width < 480 && entry.object.importance < 9) continue;
    if (!isSelected && entry.object.importance < 8 && entry.opacity <= 0.55) continue;
    drawLabel(ctx, entry, labels, currentLog, width, isSelected);
  }

  const selected = visible.find((entry) => entry.object.id === selectedObjectId);
  if (selected) drawSelection(ctx, selected);
  return visible;
}

function getResponsiveVisibleRange(width) {
  if (width < 480) return 1.28;
  if (width < 768) return 1.45;
  return 1.6;
}

function getResponsiveObjectLimit(width) {
  if (width < 480) return 5;
  if (width < 768) return 6;
  return 7;
}

function makeEntryForSelected(object, state, responsiveRange) {
  const distance = Math.abs(object.logSize - state.currentLog);
  return {
    object,
    distance,
    opacity: Math.max(0.82, clamp(1 - distance / responsiveRange, 0, 1)),
    radius: clamp(28 * Math.pow(10, (object.logSize - state.currentLog) * 0.32), 8, 180),
    screenX: state.width / 2 + state.panX + object.x * 1.05,
    screenY: state.height / 2 + state.panY + object.y * 1.05,
  };
}

function drawBackground(ctx, width, height, log) {
  const band = getScaleBand(log);
  const palette = {
    Subatomic: ["#050816", "#20164a", "#090b16"],
    Atomic: ["#07111f", "#12304a", "#07111f"],
    Molecular: ["#081d1f", "#164e63", "#092224"],
    "Cellular / Microscopic": ["#102318", "#3f6f4a", "#dce7df"],
    "Human Scale": ["#dfe8e2", "#eef5f1", "#d0dbd5"],
    Planetary: ["#07152f", "#123a6b", "#030712"],
    "Solar System": ["#020617", "#11194a", "#050816"],
    Interstellar: ["#030712", "#0f172a", "#020617"],
    Galactic: ["#020617", "#111827", "#000000"],
    Cosmic: ["#000006", "#040012", "#000000"],
  }[band];
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.55, palette[1]);
  gradient.addColorStop(1, palette[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (log > 7) {
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    for (let i = 0; i < 95; i += 1) {
      const x = (i * 137.5) % width;
      const y = (i * 83.7) % height;
      const r = 0.6 + ((i * 11) % 24) / 18;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawScaleGrid(ctx, width, height, log) {
  const dark = log < -3 || log > 3;
  ctx.strokeStyle = dark ? "rgba(148, 163, 184, 0.08)" : "rgba(15, 23, 42, 0.08)";
  ctx.lineWidth = 1;
  const spacing = 82;
  for (let x = (width / 2) % spacing; x < width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = (height / 2) % spacing; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawObject(ctx, entry) {
  const { object, screenX: x, screenY: y, radius: r } = entry;
  if (object.assetPath && drawAssetSprite(ctx, object, x, y, r)) return;
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
  ctx.shadowColor = "rgba(0,0,0,0.34)";
  ctx.shadowBlur = Math.max(6, Math.max(width, height) * 0.08);
  ctx.shadowOffsetY = Math.max(2, Math.max(width, height) * 0.04);
  ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
  ctx.restore();
  return true;
}

function getAssetSpriteBox(object, image, r) {
  const aspect = object.assetAspect || image.naturalWidth / image.naturalHeight || 1;
  const base = clamp(r * (object.assetScale ?? 2.55), 26, 190);
  if (aspect >= 1) {
    const width = base;
    return { width, height: clamp(base / aspect, 18, 180) };
  }
  const height = base;
  return { width: clamp(base * aspect, 18, 180), height };
}

function getAssetImage(src) {
  if (typeof Image === "undefined") return null;
  const cached = assetImageCache.get(src);
  if (cached) return cached;
  const image = new Image();
  image.decoding = "async";
  image.loading = "eager";
  image.src = src;
  assetImageCache.set(src, image);
  return image;
}

function drawAtom(ctx, x, y, r, color) {
  drawParticle(ctx, x, y, r * 0.72, color);
  ctx.strokeStyle = "rgba(255,255,255,0.52)";
  ctx.lineWidth = Math.max(1.5, r * 0.035);
  for (const rotation of [0, Math.PI / 3, -Math.PI / 3]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.25, r * 0.48, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
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

function drawLabel(ctx, entry, labels, log, canvasWidth, isSelected = false) {
  const { object, screenX: x, screenY: y, radius: r, opacity } = entry;
  const dark = log < -3 || log > 3;
  const maxLabelWidth = Math.max(116, canvasWidth - 24);
  const fontSize = canvasWidth < 480 ? clamp(10 + object.importance * 0.45, 12, 16) : clamp(12 + object.importance, 14, 22);
  ctx.font = `${object.importance >= 9 || isSelected ? 800 : 650} ${fontSize}px Inter, system-ui, sans-serif`;
  const text = object.name;
  const metrics = ctx.measureText(text);
  const width = Math.min(metrics.width + 14, maxLabelWidth);
  const height = canvasWidth < 480 ? 24 : 26;
  let rect = { x: clamp(x - width / 2, 8, canvasWidth - width - 8), y: y + r + 8, width, height };
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
  ctx.fillStyle = dark ? "#f8fafc" : "#0f172a";
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
