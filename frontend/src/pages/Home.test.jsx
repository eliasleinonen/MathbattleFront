import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';
import api from '../api';
import { DEFAULT_ELO } from '../utils/eloSquiggle';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const renderHome = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );

describe('Home elo squiggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows guest elo on the tip and under the brand', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/user/profile') {
        return Promise.resolve({
          data: { username: 'Guest Player', elo: DEFAULT_ELO, wins: 0, losses: 0, is_guest: true },
        });
      }
      return Promise.reject(new Error(`unexpected ${url}`));
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByRole('img', { name: `Rating curve at ${DEFAULT_ELO} elo` })).toBeDefined();
    });
    expect(screen.getByText(`elo ${DEFAULT_ELO}`)).toBeDefined();
    expect(screen.getAllByText(String(DEFAULT_ELO)).length).toBeGreaterThanOrEqual(1);
    expect(api.get).toHaveBeenCalledWith('/user/profile');
  });

  it('shows profile elo on the tip and under the brand when logged in', async () => {
    window.localStorage.setItem('token', 'test-token');
    api.get.mockImplementation((url) => {
      if (url === '/user/profile') {
        return Promise.resolve({
          data: { username: 'chainruler', elo: 2100, wins: 12, losses: 4 },
        });
      }
      if (url === '/challenges/pending') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error(`unexpected ${url}`));
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Rating curve at 2100 elo' })).toBeDefined();
    });
    expect(screen.getByText('elo 2100')).toBeDefined();
    expect(screen.queryByText('Your Stats')).toBeNull();
  });

  it('falls back to guest elo when profile elo is missing', async () => {
    window.localStorage.setItem('token', 'test-token');
    api.get.mockImplementation((url) => {
      if (url === '/user/profile') {
        return Promise.resolve({
          data: { username: 'newplayer', wins: 0, losses: 0 },
        });
      }
      if (url === '/challenges/pending') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error(`unexpected ${url}`));
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText(`elo ${DEFAULT_ELO}`)).toBeDefined();
    });
  });

  it('shows green dot on Daily challenge button when challenge is not completed today', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/user/profile') {
        return Promise.resolve({
          data: { username: 'testuser', elo: 1200, wins: 5, losses: 2, is_guest: false },
        });
      }
      if (url === '/challenges/pending') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/daily-challenge/today') {
        return Promise.resolve({ data: { user_completed: false } });
      }
      return Promise.reject(new Error(`unexpected ${url}`));
    });

    renderHome();

    await waitFor(() => {
      const dailyBtn = screen.getAllByRole('button', { name: /Daily challenge/i })[0];
      expect(dailyBtn.querySelector('.bg-green-500')).not.toBeNull();
    });
  });

  it('hides green dot on Daily challenge button when challenge is completed today', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/user/profile') {
        return Promise.resolve({
          data: { username: 'testuser', elo: 1200, wins: 5, losses: 2, is_guest: false },
        });
      }
      if (url === '/challenges/pending') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/daily-challenge/today') {
        return Promise.resolve({ data: { user_completed: true } });
      }
      return Promise.reject(new Error(`unexpected ${url}`));
    });

    renderHome();

    await waitFor(() => {
      const dailyBtn = screen.getAllByRole('button', { name: /Daily challenge/i })[0];
      expect(dailyBtn.querySelector('.bg-green-500')).toBeNull();
    });
  });
});
