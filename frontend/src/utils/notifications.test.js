import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  urlBase64ToUint8Array,
  getMatchesPlayedCount,
  incrementMatchesPlayedCount,
  shouldPromptForNotifications,
} from './notifications';

describe('notification utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('converts base64 url-safe string to Uint8Array', () => {
    const b64 = 'BOlUMEx7gk1ojzLldfcOmTnz-NI7gm3tNEqMCucDhPTDx9mPBtziOGLEiCwC1VqLIfR9GLzYt7iXwIrFtU6gIeo';
    const arr = urlBase64ToUint8Array(b64);
    expect(arr).toBeInstanceOf(Uint8Array);
    expect(arr.length).toBe(65);
  });

  it('tracks and increments matches played count', () => {
    expect(getMatchesPlayedCount()).toBe(0);
    expect(incrementMatchesPlayedCount()).toBe(1);
    expect(getMatchesPlayedCount()).toBe(1);
    expect(incrementMatchesPlayedCount()).toBe(2);
    expect(getMatchesPlayedCount()).toBe(2);
  });

  it('triggers prompt on match 1, match 5, match 10, but not on match 2, 3, 4', () => {
    // Stub browser Notification object
    global.window.Notification = {
      permission: 'default',
    };
    global.navigator.serviceWorker = {};
    global.window.PushManager = {};

    // 0 matches: false
    expect(shouldPromptForNotifications()).toBe(false);

    // 1st match: TRUE
    incrementMatchesPlayedCount();
    expect(shouldPromptForNotifications()).toBe(true);

    // 2nd match: false
    incrementMatchesPlayedCount();
    expect(shouldPromptForNotifications()).toBe(false);

    // 3rd match: false
    incrementMatchesPlayedCount();
    expect(shouldPromptForNotifications()).toBe(false);

    // 4th match: false
    incrementMatchesPlayedCount();
    expect(shouldPromptForNotifications()).toBe(false);

    // 5th match: TRUE
    incrementMatchesPlayedCount();
    expect(shouldPromptForNotifications()).toBe(true);

    // 6th match: false
    incrementMatchesPlayedCount();
    expect(shouldPromptForNotifications()).toBe(false);
  });

  it('does not prompt if notification permission is already granted or denied', () => {
    global.navigator.serviceWorker = {};
    global.window.PushManager = {};
    incrementMatchesPlayedCount(); // count = 1

    global.window.Notification = { permission: 'granted' };
    expect(shouldPromptForNotifications()).toBe(false);

    global.window.Notification = { permission: 'denied' };
    expect(shouldPromptForNotifications()).toBe(false);
  });
});
