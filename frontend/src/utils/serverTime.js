// Round-start timestamps come from the backend as ISO strings. Older backend
// versions sent naive UTC strings (no offset); browsers parse those as LOCAL
// time, which broke the round countdown for anyone outside UTC. Treat
// offset-less strings as UTC explicitly.
const HAS_TIMEZONE = /(Z|[+-]\d{2}:?\d{2})$/;

export const parseServerTime = (iso) => {
  if (!iso || typeof iso !== 'string') return null;
  const normalized = HAS_TIMEZONE.test(iso) ? iso : `${iso}Z`;
  const timestamp = new Date(normalized).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

// Maximum plausible distance between the server round start and the local
// clock. Beyond this we assume clock skew or a bad timestamp and fall back to
// local time so the countdown can never get stuck or skip.
const MAX_CLOCK_SKEW_MS = 15000;

export const resolveCountdownStart = (iso, now = Date.now()) => {
  const parsed = parseServerTime(iso);
  if (parsed === null) return now;
  if (Math.abs(parsed - now) > MAX_CLOCK_SKEW_MS) return now;
  return parsed;
};
