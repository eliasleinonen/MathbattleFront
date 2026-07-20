/**
 * Build @uiw/react-heat-map values from daily-challenge history.
 * Dates use YYYY/MM/DD (Safari-safe). Counts are categorical:
 * 0 = not completed, 1 = completed, 2 = winner (rank 1, not today).
 */

export function toHeatmapDate(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  return isoDate.includes('/') ? isoDate : isoDate.replaceAll('-', '/');
}

export function parseIsoDateParts(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return null;
  const normalized = isoDate.includes('/') ? isoDate.replaceAll('/', '-') : isoDate;
  const [year, month, day] = normalized.split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

export function dateFromIso(isoDate) {
  const parts = parseIsoDateParts(isoDate);
  if (!parts) return null;
  return new Date(parts.year, parts.month - 1, parts.day);
}

/**
 * @param {Array<{ date?: string }>} pastChallenges
 * @param {Record<string, { time?: number, rank?: number }>} userCompletions
 * @param {string} todayStr YYYY-MM-DD from server
 */
export function buildActivityHeatmapValues(pastChallenges, userCompletions, todayStr) {
  const challenges = Array.isArray(pastChallenges) ? pastChallenges : [];
  const completions = userCompletions && typeof userCompletions === 'object' ? userCompletions : {};
  const today = todayStr || '';

  return challenges
    .filter((challenge) => challenge && typeof challenge.date === 'string')
    .map((challenge) => {
      const completion = completions[challenge.date];
      const isToday = challenge.date === today;
      const isWinner = Boolean(completion && completion.rank === 1 && !isToday);
      const isCompleted = Boolean(completion);

      let count = 0;
      if (isWinner) count = 2;
      else if (isCompleted) count = 1;

      return {
        date: toHeatmapDate(challenge.date),
        count,
        challenge,
        completion: completion || null,
        status: isWinner ? 'winner' : isCompleted ? 'completed' : 'not-completed',
      };
    });
}

export function heatmapRangeFromToday(todayStr, monthsBack = 12) {
  const end = dateFromIso(todayStr) || new Date();
  const start = new Date(end.getFullYear(), end.getMonth() - (monthsBack - 1), 1);
  return { startDate: start, endDate: end };
}

export const ACTIVITY_PANEL_COLORS = {
  0: '#f3f4f6',
  1: '#86efac',
  2: '#facc15',
};
