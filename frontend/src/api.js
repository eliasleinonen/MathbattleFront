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
    console.log('[API] Using VITE_API_URL from environment:', url);
    return url;
  }
  
  // Auto-detect based on current domain
  if (window.location.hostname === 'www.mathbattle.xyz' || window.location.hostname === 'mathbattle.xyz') {
    console.log('[API] Auto-detected production domain, using Railway backend');
    return 'https://mathbattlebackend-production.up.railway.app/api';
  }
  
  // Default to localhost for development
  console.log('[API] Using localhost default');
  return 'http://localhost:8080/api';
};

const API_URL = getApiUrl();
console.log('[API] Final API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
