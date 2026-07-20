/** Default guest / unknown rating used across the app. */
export const DEFAULT_ELO = 1000;

/** Playable band used only to seed curve personality. */
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
 * Full-bleed squiggle: always starts at the left edge and ends at the right edge.
 * Elo only seeds the wiggle personality — the UI span is the priority.
 */
export function buildEloSquigglePath(
  elo,
  { width = 800, height = 300, paddingY = 36 } = {}
) {
  const rating = normalizeElo(elo);
  const minY = paddingY;
  const maxY = height - paddingY;
  const midY = (minY + maxY) / 2;
  const startX = 0;
  const endX = width;

  const rand = mulberry32(rating * 9973 + 42);
  // Keep start/end in a clear mid band so the full-bleed stroke stays obvious.
  const startY = midY + (rand() - 0.5) * (maxY - minY) * 0.35;
  const endY = midY + (rand() - 0.5) * (maxY - minY) * 0.3;

  const segmentCount = 8;
  const points = [{ x: startX, y: startY }];

  for (let i = 1; i < segmentCount; i++) {
    const t = i / segmentCount;
    const x = startX + (endX - startX) * t;
    const baseY = startY + (endY - startY) * t;
    const amp = 54 + rand() * 30;
    const wave =
      Math.sin(t * Math.PI * 3.4 + rating * 0.019) * amp +
      Math.sin(t * Math.PI * 6.8 + rating * 0.029) * (amp * 0.42) +
      Math.cos(t * Math.PI * 2.1 + rating * 0.013) * (amp * 0.28) +
      (rand() - 0.5) * 26;
    const y = Math.min(maxY, Math.max(minY, baseY + wave));
    points.push({ x, y });
  }

  points.push({ x: endX, y: Math.min(maxY, Math.max(minY, endY)) });

  return {
    path: catmullRomToBezier(points),
    endX,
    endY: points[points.length - 1].y,
    elo: rating,
    width,
    height,
  };
}
