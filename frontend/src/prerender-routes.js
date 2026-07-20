// Single source of truth for the routes rendered to static HTML at build time
// (scripts/prerender.mjs) and asserted in tests. Only routes whose initial
// render is meaningful for crawlers belong here; game/session routes do not.
export const PRERENDER_ROUTES = [
  '/',
  '/login',
  '/leaderboard',
  '/daily-challenge',
  '/play/friend',
  '/how-to-derivate',
  '/faq',
  '/about',
  '/privacy-policy',
  '/terms-and-services',
];
