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

  it('keeps guest elo on the curve metadata without a permanent tip label', async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByRole('img', { name: `Rating curve at ${DEFAULT_ELO} elo` })).toBeDefined();
    });
    expect(screen.queryByText(String(DEFAULT_ELO))).toBeNull();
    expect(api.get).not.toHaveBeenCalled();
  });

  it('uses profile elo for the hoverable curve when logged in', async () => {
    window.localStorage.setItem('token', 'test-token');
    api.get.mockImplementation((url) => {
      if (url === '/user/profile') {
        return Promise.resolve({
          data: { username: 'chainruler', elo: 1642, wins: 12, losses: 4 },
        });
      }
      if (url === '/challenges/pending') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error(`unexpected ${url}`));
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Rating curve at 1642 elo' })).toBeDefined();
    });
    expect(screen.queryByText('1642')).toBeNull();
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
      expect(screen.getByRole('img', { name: `Rating curve at ${DEFAULT_ELO} elo` })).toBeDefined();
    });
  });
});
