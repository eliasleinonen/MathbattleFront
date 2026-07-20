/** Default guest / unknown rating used across the app. */
export const DEFAULT_ELO = 1000;

/** Playable band used to place the curve tip on screen. */
export const ELO_DISPLAY_MIN = 600;
export const ELO_DISPLAY_MAX = 2400;

/**
 * Coerce any rating input into a finite display elo.
 * Guests, missing values, and garbage all resolve to 1000.
 */
export function normalizeElo(elo) {
  if (elo === null || elo === undefined || elo === '') return DEFAULT_ELO;
  const n = typeof elo === 'string' ? Number(elo.trim()) : Number(elo);
  if (!Number.isFinite(n)) return DEFAULT_ELO;
  return Math.min(ELO_DISPLAY_MAX, Math.max(ELO_DISPLAY_MIN, Math.round(n)));
}

/**
 * Higher elo → higher on screen (smaller Y).
 */
export function eloToEndY(
  elo,
  { minY = 40, maxY = 260, minElo = ELO_DISPLAY_MIN, maxElo = ELO_DISPLAY_MAX } = {}
) {
  const e = normalizeElo(elo);
  const span = maxElo - minElo || 1;
  const t = (e - minElo) / span;
  return maxY - t * (maxY - minY);
}

function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function catmullRomToBezier(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/**
 * Build a deterministic, always-squiggly path that ends at the rating height.
 * Only geometry — no axes/labels. The tip coordinates are returned so UI can
 * park the readable elo number on the line itself.
 */
export function buildEloSquigglePath(
  elo,
  { width = 800, height = 300, paddingX = 28, paddingY = 28 } = {}
) {
  const rating = normalizeElo(elo);
  const minY = paddingY;
  const maxY = height - paddingY;
  const endX = width - paddingX;
  const endY = eloToEndY(rating, { minY, maxY });
  const startX = paddingX;
  // Start opposite the tip so low and high ratings both get a lively climb/drop.
  const startY = endY > height * 0.5 ? minY + (maxY - minY) * 0.28 : maxY - (maxY - minY) * 0.18;

  const rand = mulberry32(rating * 9973 + 42);
  const segmentCount = 6;
  const points = [{ x: startX, y: startY }];

  for (let i = 1; i < segmentCount; i++) {
    const t = i / segmentCount;
    const x = startX + (endX - startX) * t;
    const baseY = startY + (endY - startY) * t;
    // Keep amplitude high so guest 1000 (mid band) still looks playful.
    const amp = 62 + rand() * 28;
    const wave =
      Math.sin(t * Math.PI * 3.6 + rating * 0.017) * amp +
      Math.sin(t * Math.PI * 7 + rating * 0.031) * (amp * 0.45) +
      Math.cos(t * Math.PI * 2.2 + rating * 0.011) * (amp * 0.25) +
      (rand() - 0.5) * 30;
    const y = Math.min(maxY, Math.max(minY, baseY + wave));
    points.push({ x, y });
  }

  points.push({ x: endX, y: endY });

  return {
    path: catmullRomToBezier(points),
    endX,
    endY,
    elo: rating,
    width,
    height,
  };
}
