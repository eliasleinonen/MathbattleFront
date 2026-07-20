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

export function heatmapRangeFromToday(todayStr, monthsBack = 12) {
  const end = dateFromIso(todayStr) || new Date();
  const start = new Date(end.getFullYear(), end.getMonth() - (monthsBack - 1), 1);
  return { startDate: start, endDate: end };
}

/**
 * @param {Array<{ date?: string }>} pastChallenges
 * @param {Record<string, { time?: number, rank?: number }>} userCompletions
 * @param {string} todayStr YYYY-MM-DD from server
 * @param {number} monthsBack
 */
export function buildActivityHeatmapValues(pastChallenges, userCompletions, todayStr, monthsBack = 12) {
  const challengeMap = new Map();
  if (Array.isArray(pastChallenges)) {
    for (const c of pastChallenges) {
      if (c && typeof c.date === 'string') {
        challengeMap.set(c.date, c);
      }
    }
  }

  const completions = userCompletions && typeof userCompletions === 'object' ? userCompletions : {};
  const today = todayStr || new Date().toISOString().split('T')[0];
  const { startDate, endDate } = heatmapRangeFromToday(today, monthsBack);

  const values = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const challenge = challengeMap.get(dateStr) || null;
    const completion = completions[dateStr] || null;
    const isToday = dateStr === today;
    const isWinner = Boolean(completion && completion.rank === 1 && !isToday);
    const isCompleted = Boolean(completion);

    let count = 0;
    if (isWinner) count = 2;
    else if (isCompleted) count = 1;

    values.push({
      date: toHeatmapDate(dateStr),
      count,
      challenge,
      completion,
      status: isWinner ? 'winner' : isCompleted ? 'completed' : 'not-completed',
    });

    current.setDate(current.getDate() + 1);
  }

  return values;
}

export const ACTIVITY_PANEL_COLORS = {
  0: '#f3f4f6',
  1: '#86efac',
  2: '#facc15',
};
