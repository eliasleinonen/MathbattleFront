import axios from 'axios';

// Detect production environment and use correct API URL
const getApiUrl = () => {
  // Check if environment variable is set (will work with Vercel if configured)
  if (import.meta.env.VITE_API_URL) {
    let url = import.meta.env.VITE_API_URL;
    // Ensure URL ends with /api
    if (!url.endsWith('/api')) {
      url = url + '/api';
    }
    return url;
  }
  
  // Guard for build-time prerendering, where there is no browser window
  if (typeof window === 'undefined') {
    return '/api';
  }

  // Auto-detect based on current domain
  if (window.location.hostname === 'www.mathbattle.xyz' || window.location.hostname === 'mathbattle.xyz') {
    return 'https://mathbattlebackend-production.up.railway.app/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:8080/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
});

// Guests need a stable, unique identity so the backend can tell two guests
// apart (e.g. so a friend match's creator and joiner aren't the same user).
// We persist a `guest-<uuid>` id per browser and send it when there is no
// real login token. This is intentionally a different storage key than
// `token`, so it never bypasses login-gated features like the daily challenge.
const getOrCreateGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    const uuid =
      (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    guestId = `guest-${uuid}`;
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

// Add auth token to requests: real login token when present, otherwise the
// per-browser guest identity.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token || getOrCreateGuestId()}`;
  return config;
});

export const authAPI = {
  register: (email, password, name) => 
    api.post('/auth/register', { email, password, name }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  getProfile: () => 
    api.get('/user/profile'),
};

export const gameAPI = {
  startMatch: (mode, continueExisting = false) => 
    api.post('/game/start', { mode, continue_existing: continueExisting }),
  
  cancelMatchmaking: () =>
    api.post('/game/cancel'),
  
  cancelChallenge: (matchId) =>
    api.post(`/challenges/cancel/${matchId}`),
  
  getActiveMatch: () =>
    api.get('/game/active'),
  
  getMatchByCode: (matchCode) =>
    api.get(`/game/match/${matchCode}`),
  
  getQuestion: (matchId) => 
    api.get(`/game/question?match_id=${matchId}`),
  
  submitAnswer: (matchId, answer) => 
    api.post('/game/answer', { match_id: matchId, answer }),
  
  giveUpRound: (matchId) =>
    api.post('/game/give-up', null, { params: { match_id: matchId } }),
  
  getStatus: (matchId) =>
    api.get(`/game/status/${matchId}`),
  
  getProfile: () =>
    api.get('/user/profile'),
};

export const leaderboardAPI = {
  getLeaderboard: () => 
    api.get('/leaderboard'),
};

export default api;
