import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DailyChallenge, {
  dailyChallengeFaqs,
  dailyChallengeJsonLd,
  getDifficultyMeta,
  DifficultyBadge,
} from './DailyChallenge';
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
          <Route path="/" element={<div>home page</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );

describe('DailyChallenge page and guest access', () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders overview with heading and SEO sections without redirecting guests to login', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: { date: '2026-10-12', expression: '3*x^2', user_completed: false },
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Daily Derivative Challenge')).toBeDefined();
    });

    expect(screen.getByText('How the Daily Derivative Works')).toBeDefined();
    expect(screen.getByText('Frequently Asked Questions')).toBeDefined();
    expect(screen.queryByText('login page')).toBeNull();
  });

  it('allows guests to start the challenge immediately', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: { date: '2026-10-12', expression: '3*x^2', user_completed: false },
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start Challenge')).toBeDefined();
    });

    expect(screen.getByText(/Playing as guest • Instant play without sign-in/i)).toBeDefined();
  });

  it('shows public leaderboard entries and formatted times', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/leaderboard') {
        return Promise.resolve({
          data: [
            { username: 'euler_fan', time: 14.25 },
            { username: 'gauss_speed', time: 18.5 },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('euler_fan')).toBeDefined();
      expect(screen.getByText('14.25s')).toBeDefined();
      expect(screen.getByText('gauss_speed')).toBeDefined();
      expect(screen.getByText('18.50s')).toBeDefined();
    });
  });

  it('transitions through countdown to playing phase when Start Challenge is clicked', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: { date: '2026-10-12', expression: 'sin(x) + x^3', user_completed: false },
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start Challenge')).toBeDefined();
    });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Start Challenge'));

    expect(screen.getByText('3')).toBeDefined();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('2')).toBeDefined();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('1')).toBeDefined();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    vi.useRealTimers();

    // Playing phase
    expect(screen.getByText(/Find the derivative/i)).toBeDefined();
    expect(screen.getByText("f'(x) = ?")).toBeDefined();
    expect(screen.getByPlaceholderText('e.g. 6*x^2 - 4*sin(x)')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Submit Answer' })).toBeDefined();
  });

  it('allows typing and using mobile math quick keys', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: { date: '2026-10-12', expression: 'x^2', user_completed: false },
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start Challenge')).toBeDefined();
    });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Start Challenge'));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    vi.useRealTimers();

    const input = screen.getByPlaceholderText('e.g. 6*x^2 - 4*sin(x)');
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '*' }));
    fireEvent.click(screen.getByRole('button', { name: 'x' }));

    expect(input.value).toBe('2*x');
  });

  it('submits answer, shows results, Wordle share button, and guest sign-in banner', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: { date: '2026-10-12', expression: 'x^2', user_completed: false },
        });
      }
      return Promise.resolve({ data: [] });
    });

    api.post.mockResolvedValue({
      data: {
        correct: true,
        correct_answer: '2*x',
        time_taken: 9.87,
        rank: 2,
        is_fastest: false,
      },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start Challenge')).toBeDefined();
    });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Start Challenge'));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    vi.useRealTimers();

    const input = screen.getByPlaceholderText('e.g. 6*x^2 - 4*sin(x)');
    fireEvent.change(input, { target: { value: '2*x' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit Answer' }));
    });

    await waitFor(() => {
      expect(screen.getByText('CORRECT')).toBeDefined();
    });

    expect(screen.getByText('9.87s')).toBeDefined();
    expect(screen.getByText('Your rank today: #2')).toBeDefined();
    expect(screen.getByText('📋 Share Result')).toBeDefined();
    expect(screen.getByText(/Save your streak & claim your username!/i)).toBeDefined();
  });

  it('copies formatted score to clipboard when Share Result is clicked', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: { date: '2026-10-12', expression: 'x^2', user_completed: false },
        });
      }
      return Promise.resolve({ data: [] });
    });

    api.post.mockResolvedValue({
      data: {
        correct: true,
        correct_answer: '2*x',
        time_taken: 12.34,
        rank: 1,
        is_fastest: true,
      },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start Challenge')).toBeDefined();
    });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Start Challenge'));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    vi.useRealTimers();

    const input = screen.getByPlaceholderText('e.g. 6*x^2 - 4*sin(x)');
    fireEvent.change(input, { target: { value: '2*x' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit Answer' }));
    });

    await waitFor(() => {
      expect(screen.getByText('📋 Share Result')).toBeDefined();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('📋 Share Result'));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    const clipboardText = navigator.clipboard.writeText.mock.calls[0][0];
    expect(clipboardText).toContain('Daily Derivative');
    expect(clipboardText).toContain('12.34s');
    expect(clipboardText).toContain('https://www.mathbattle.xyz/daily-challenge');
    expect(screen.getByText('✓ Copied to clipboard!')).toBeDefined();
  });

  it('handles wrong answer without clearing user input', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: { date: '2026-10-12', expression: 'x^2', user_completed: false },
        });
      }
      return Promise.resolve({ data: [] });
    });

    api.post.mockResolvedValue({
      data: { correct: false },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start Challenge')).toBeDefined();
    });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Start Challenge'));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    vi.useRealTimers();

    const input = screen.getByPlaceholderText('e.g. 6*x^2 - 4*sin(x)');
    fireEvent.change(input, { target: { value: 'wrong_guess' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit Answer' }));
    });

    await waitFor(() => {
      expect(screen.getByText('wrong answer')).toBeDefined();
    });
    expect(input.value).toBe('wrong_guess');
  });

  it('shows Completed Today state when user has already completed', async () => {
    window.localStorage.setItem('token', 'real-user-token');
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: {
            date: '2026-10-12',
            user_completed: true,
            user_time: 15.67,
            user_rank: 4,
          },
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('✓ Completed Today')).toBeDefined();
      expect(screen.getByText('15.67s')).toBeDefined();
      expect(screen.getByText('Your rank: #4')).toBeDefined();
    });
    expect(screen.queryByText('Playing as a guest')).toBeNull();
  });

  it('exports valid FAQ and Schema.org structured data', () => {
    expect(dailyChallengeFaqs.length).toBeGreaterThan(2);
    expect(dailyChallengeJsonLd).toHaveLength(3);
    const webAppSchema = dailyChallengeJsonLd[0];
    const faqSchema = dailyChallengeJsonLd[1];
    const breadcrumbSchema = dailyChallengeJsonLd[2];
    expect(webAppSchema['@type']).toBe('WebApplication');
    expect(faqSchema['@type']).toBe('FAQPage');
    expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
    expect(faqSchema.mainEntity).toHaveLength(dailyChallengeFaqs.length);
  });

  it('correctly maps easy, medium, and hard difficulties with getDifficultyMeta', () => {
    expect(getDifficultyMeta('easy', 'Speed Run')).toMatchObject({
      label: 'Easy',
      category: 'Speed Run',
    });
    expect(getDifficultyMeta('medium', 'Chain Rule')).toMatchObject({
      label: 'Medium',
      category: 'Chain Rule',
    });
    expect(getDifficultyMeta('hard', 'Product Rule')).toMatchObject({
      label: 'Hard',
      category: 'Product Rule',
    });
  });

  it('renders difficulty badge with correct styling on overview and in playing phase', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: {
            date: '2026-10-15',
            expression: '3·x·cos(2·x)',
            difficulty: 'hard',
            category: 'Product Rule',
            user_completed: false,
          },
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText('Hard').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Product Rule').length).toBeGreaterThan(0);
    });

    const badge = screen.getByTestId('difficulty-badge');
    expect(badge.className).toContain('text-rose-700');

    // Click start and check playing screen has difficulty badge too
    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Start Challenge'));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    vi.useRealTimers();

    const playingBadges = screen.getAllByTestId('difficulty-badge');
    expect(playingBadges.length).toBeGreaterThan(0);
  });

  it('includes difficulty and category in clipboard share text', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/daily-challenge/today') {
        return Promise.resolve({
          data: {
            date: '2026-10-15',
            expression: '3·x·cos(2·x)',
            difficulty: 'hard',
            category: 'Product Rule',
            user_completed: true,
            user_time: 4.82,
            user_rank: 1,
          },
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('📋 Share Result')).toBeDefined();
    });

    fireEvent.click(screen.getByText('📋 Share Result'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    const sharedText = navigator.clipboard.writeText.mock.calls[0][0];
    expect(sharedText).toContain('Daily Derivative');
    expect(sharedText).toContain('Hard (Product Rule)');
    expect(sharedText).toContain('4.82s (Rank #1)');
  });
});
