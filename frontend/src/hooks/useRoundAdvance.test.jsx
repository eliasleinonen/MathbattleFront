import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRoundAdvance } from './useRoundAdvance';
import { gameAPI } from '../api';

vi.mock('../api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
  gameAPI: { getQuestion: vi.fn() },
}));

const question = (overrides = {}) => ({
  data: {
    expression: 'x^2',
    evaluate_at: null,
    ask_for_derivative_only: true,
    round_id: 'round-1',
    ...overrides,
  },
});

describe('useRoundAdvance', () => {
  let state;
  let setGameState;

  beforeEach(() => {
    state = { currentRound: 0, phase: 'waiting', question: null };
    setGameState = vi.fn((updater) => {
      state = typeof updater === 'function' ? updater(state) : updater;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const setup = (options = {}) =>
    renderHook(() => useRoundAdvance({ setGameState, ...options }));

  it('loads the question and enters the countdown phase', async () => {
    gameAPI.getQuestion.mockResolvedValue(question());
    const { result } = setup();

    await act(() => result.current.startCountdown('m1'));

    expect(gameAPI.getQuestion).toHaveBeenCalledWith('m1');
    expect(state.phase).toBe('countdown');
    expect(state.question).toBe('x^2');
    expect(state.currentRound).toBe(1);
    expect(result.current.connectionIssue).toBe(false);
    expect(result.current.roundError).toBe(false);
  });

  it('mirrors the server time limit into state when trackTimeLimit is set', async () => {
    gameAPI.getQuestion.mockResolvedValue(question({ time_limit: 30 }));
    const { result } = setup({ trackTimeLimit: true });

    await act(() => result.current.startCountdown('m1'));

    expect(state.timeLimit).toBe(30);
    expect(state.timeRemaining).toBe(30);
  });

  it('ignores a duplicate advance for the round already on screen', async () => {
    gameAPI.getQuestion.mockResolvedValue(question({ round_id: 'same-round' }));
    const { result } = setup();

    await act(() => result.current.startCountdown('m1'));
    const roundAfterFirst = state.currentRound;
    await act(() => result.current.startCountdown('m1'));

    expect(state.currentRound).toBe(roundAfterFirst);
  });

  it('runs only one advance at a time (single-flight)', async () => {
    let resolveFetch;
    gameAPI.getQuestion.mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));
    const { result } = setup();

    let first;
    act(() => { first = result.current.startCountdown('m1'); });
    await act(() => result.current.startCountdown('m1'));
    await act(async () => {
      resolveFetch(question());
      await first;
    });

    expect(gameAPI.getQuestion).toHaveBeenCalledTimes(1);
  });

  it('retries transient failures with a connection notice instead of ejecting', async () => {
    vi.useFakeTimers();
    gameAPI.getQuestion
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(question());
    const { result } = setup();

    await act(() => result.current.startCountdown('m1'));
    expect(result.current.connectionIssue).toBe(true);
    expect(state.phase).toBe('waiting');

    await act(() => vi.advanceTimersByTimeAsync(2000));

    expect(gameAPI.getQuestion).toHaveBeenCalledTimes(2);
    expect(result.current.connectionIssue).toBe(false);
    expect(state.phase).toBe('countdown');
  });

  it('does not retry when the backend rejects the request as ended (400/403)', async () => {
    vi.useFakeTimers();
    gameAPI.getQuestion.mockRejectedValue({ response: { status: 400 } });
    const { result } = setup();

    await act(() => result.current.startCountdown('m1'));
    await act(() => vi.advanceTimersByTimeAsync(10000));

    expect(gameAPI.getQuestion).toHaveBeenCalledTimes(1);
    expect(result.current.connectionIssue).toBe(false);
    expect(result.current.roundError).toBe(false);
  });

  it('surfaces roundError after the retries are exhausted and recovers via retryRound', async () => {
    vi.useFakeTimers();
    gameAPI.getQuestion.mockRejectedValue(new Error('still down'));
    const { result } = setup();

    await act(() => result.current.startCountdown('m1'));
    // Drain the whole retry schedule
    for (let i = 0; i < 20; i += 1) {
      await act(() => vi.advanceTimersByTimeAsync(2000));
    }

    expect(result.current.roundError).toBe(true);
    expect(result.current.connectionIssue).toBe(false);
    const callsWhenGivenUp = gameAPI.getQuestion.mock.calls.length;
    await act(() => vi.advanceTimersByTimeAsync(60000));
    expect(gameAPI.getQuestion).toHaveBeenCalledTimes(callsWhenGivenUp);

    gameAPI.getQuestion.mockResolvedValue(question());
    await act(() => result.current.retryRound('m1'));

    expect(result.current.roundError).toBe(false);
    expect(state.phase).toBe('countdown');
  });
});
