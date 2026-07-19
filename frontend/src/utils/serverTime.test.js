import { describe, it, expect } from 'vitest';
import { parseServerTime, resolveCountdownStart } from './serverTime';

describe('parseServerTime', () => {
  it('parses ISO strings with an explicit UTC offset', () => {
    expect(parseServerTime('2026-07-19T21:00:00+00:00')).toBe(
      Date.UTC(2026, 6, 19, 21, 0, 0)
    );
    expect(parseServerTime('2026-07-19T21:00:00Z')).toBe(
      Date.UTC(2026, 6, 19, 21, 0, 0)
    );
  });

  it('treats offset-less strings as UTC, not local time', () => {
    // Legacy backend format: naive UTC timestamp. Browsers would parse this
    // as local time and break the countdown for anyone outside UTC.
    expect(parseServerTime('2026-07-19T21:00:00.123456')).toBe(
      Date.UTC(2026, 6, 19, 21, 0, 0, 123)
    );
  });

  it('parses non-UTC offsets to the correct instant', () => {
    expect(parseServerTime('2026-07-20T00:00:00+03:00')).toBe(
      Date.UTC(2026, 6, 19, 21, 0, 0)
    );
  });

  it('returns null for missing or invalid input', () => {
    expect(parseServerTime(null)).toBeNull();
    expect(parseServerTime(undefined)).toBeNull();
    expect(parseServerTime('')).toBeNull();
    expect(parseServerTime('not-a-date')).toBeNull();
    expect(parseServerTime(12345)).toBeNull();
  });
});

describe('resolveCountdownStart', () => {
  const now = Date.UTC(2026, 6, 19, 21, 0, 0);

  it('uses the server timestamp when it is close to now', () => {
    const start = '2026-07-19T21:00:03+00:00'; // 3s in the future
    expect(resolveCountdownStart(start, now)).toBe(now + 3000);
  });

  it('falls back to now when the timestamp is implausibly far away', () => {
    // A 3-hour discrepancy (e.g. bad clock or mangled timezone) must not
    // produce an instantly-skipped or hours-long countdown.
    const start = '2026-07-19T18:00:00+00:00';
    expect(resolveCountdownStart(start, now)).toBe(now);
  });

  it('falls back to now when the timestamp is missing or invalid', () => {
    expect(resolveCountdownStart(null, now)).toBe(now);
    expect(resolveCountdownStart('garbage', now)).toBe(now);
  });
});
