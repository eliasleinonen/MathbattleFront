import { describe, it, expect } from 'vitest';
import {
  DEFAULT_ELO,
  ELO_DISPLAY_MIN,
  ELO_DISPLAY_MAX,
  normalizeElo,
  eloToEndY,
  buildEloSquigglePath,
} from './eloSquiggle';

describe('normalizeElo', () => {
  it('defaults guests / missing values to 1000', () => {
    expect(normalizeElo(undefined)).toBe(DEFAULT_ELO);
    expect(normalizeElo(null)).toBe(DEFAULT_ELO);
    expect(normalizeElo('')).toBe(DEFAULT_ELO);
    expect(normalizeElo(NaN)).toBe(DEFAULT_ELO);
    expect(normalizeElo(Infinity)).toBe(DEFAULT_ELO);
  });

  it('accepts numeric strings and rounds', () => {
    expect(normalizeElo('1000')).toBe(1000);
    expect(normalizeElo('1420.6')).toBe(1421);
  });

  it('clamps extreme ratings into the display band', () => {
    expect(normalizeElo(0)).toBe(ELO_DISPLAY_MIN);
    expect(normalizeElo(-50)).toBe(ELO_DISPLAY_MIN);
    expect(normalizeElo(5000)).toBe(ELO_DISPLAY_MAX);
  });
});

describe('eloToEndY', () => {
  it('maps higher elo to a smaller Y (higher on screen)', () => {
    const low = eloToEndY(800, { minY: 40, maxY: 260 });
    const mid = eloToEndY(1000, { minY: 40, maxY: 260 });
    const high = eloToEndY(1800, { minY: 40, maxY: 260 });
    expect(high).toBeLessThan(mid);
    expect(mid).toBeLessThan(low);
  });

  it('places guest 1000 inside the drawable band', () => {
    const y = eloToEndY(DEFAULT_ELO, { minY: 40, maxY: 260 });
    expect(y).toBeGreaterThanOrEqual(40);
    expect(y).toBeLessThanOrEqual(260);
  });
});

describe('buildEloSquigglePath', () => {
  it('returns a path ending exactly at the elo tip for a guest', () => {
    const result = buildEloSquigglePath(undefined);
    expect(result.elo).toBe(DEFAULT_ELO);
    expect(result.path.startsWith('M ')).toBe(true);
    expect(result.path.includes(' C ')).toBe(true);
    expect(result.endY).toBe(eloToEndY(DEFAULT_ELO, { minY: 28, maxY: 272 }));
    expect(result.path.endsWith(`${result.endX.toFixed(2)} ${result.endY.toFixed(2)}`)).toBe(true);
  });

  it('is deterministic for the same elo', () => {
    expect(buildEloSquigglePath(1000).path).toBe(buildEloSquigglePath(1000).path);
    expect(buildEloSquigglePath(1555).path).toBe(buildEloSquigglePath(1555).path);
  });

  it('changes tip height when elo changes', () => {
    const guest = buildEloSquigglePath(1000);
    const climbed = buildEloSquigglePath(1600);
    expect(climbed.endY).toBeLessThan(guest.endY);
    expect(climbed.path).not.toBe(guest.path);
  });

  it('stays fun (enough segments) even near band edges', () => {
    for (const elo of [ELO_DISPLAY_MIN, DEFAULT_ELO, ELO_DISPLAY_MAX, null, 'bad']) {
      const { path } = buildEloSquigglePath(elo);
      const curves = path.match(/ C /g) || [];
      expect(curves.length).toBeGreaterThanOrEqual(5);
    }
  });
});
