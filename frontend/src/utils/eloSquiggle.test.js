import { describe, it, expect } from 'vitest';
import {
  DEFAULT_ELO,
  ELO_DISPLAY_MIN,
  ELO_DISPLAY_MAX,
  normalizeElo,
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

describe('buildEloSquigglePath', () => {
  it('always runs near the right edge for every elo including guest 1000', () => {
    for (const elo of [undefined, 1000, 1642, 2100, ELO_DISPLAY_MIN, ELO_DISPLAY_MAX]) {
      const result = buildEloSquigglePath(elo, { width: 800, height: 300, tipInset: 56 });
      expect(result.endX).toBe(800 - 56);
      expect(result.path.startsWith('M 0.00 ')).toBe(true);
      expect(result.path.endsWith(`${result.endX.toFixed(2)} ${result.endY.toFixed(2)}`)).toBe(true);
    }
  });

  it('defaults missing elo to guest rating metadata', () => {
    expect(buildEloSquigglePath(null).elo).toBe(DEFAULT_ELO);
  });

  it('is deterministic for the same elo', () => {
    expect(buildEloSquigglePath(1000).path).toBe(buildEloSquigglePath(1000).path);
    expect(buildEloSquigglePath(2100).path).toBe(buildEloSquigglePath(2100).path);
  });

  it('keeps a near-full-width path while still varying shape with elo', () => {
    const guest = buildEloSquigglePath(1000);
    const climbed = buildEloSquigglePath(2100);
    expect(guest.endX).toBe(climbed.endX);
    expect(climbed.path).not.toBe(guest.path);
  });
});
