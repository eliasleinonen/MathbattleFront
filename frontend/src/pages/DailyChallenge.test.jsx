import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DailyChallenge from './DailyChallenge';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/daily-challenge']}>
        <Routes>
          <Route path="/daily-challenge" element={<DailyChallenge />} />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );

describe('DailyChallenge guest access', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows the overview with a sign-in prompt instead of redirecting guests', async () => {
    // Auth-gated endpoints reject guests; the page should still render
    api.get.mockRejectedValue({ response: { status: 401 } });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Daily Challenge')).toBeDefined();
    });
    expect(screen.getByText('Sign in to play')).toBeDefined();
    expect(screen.queryByText('login page')).toBeNull();
  });

  it('shows the public leaderboard to guests when the endpoint allows it', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/leaderboard') {
        return Promise.resolve({ data: [{ username: 'fastmathguy', time: 12.34 }] });
      }
      return Promise.reject({ response: { status: 401 } });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('fastmathguy')).toBeDefined();
    });
    expect(screen.getByText('Sign in to play')).toBeDefined();
  });

  it('shows the start button for logged-in users', async () => {
    window.localStorage.setItem('token', 'real-user-token');
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({ data: { date: '2026-07-20', user_completed: false } });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start Challenge')).toBeDefined();
    });
    expect(screen.queryByText('Sign in to play')).toBeNull();
  });
});
