import { useCallback, useEffect, useRef, useState } from 'react';
import { gameAPI } from '../api';
import { resolveCountdownStart } from '../utils/serverTime';

const COUNTDOWN_MS = 3000;
const QUESTION_FETCH_TIMEOUT_MS = 10000;
const QUESTION_RETRY_DELAY_MS = 2000;
// ~30s of retrying before giving up and surfacing a persistent error state
const MAX_QUESTION_RETRIES = 15;

// Shared round-advance machinery for both game modes (friend matches in
// Game.jsx, random/bot matches in PlayRandom.jsx). Owns the tricky parts that
// previously diverged between the two pages:
//
// - single-flight guard: several code paths (answer submitted, opponent won,
//   tie advance, refresh resume) can trigger the next round; only one may run
// - the question is fetched BEFORE timers and visible state are reset, so a
//   slow or failed request can never freeze the screen on a blank 0.0s timer
// - transient fetch failures retry with a "connection issue" signal instead of
//   ejecting the player from an active match; a retry cap turns persistent
//   failure into `roundError`
// - duplicate advance triggers for the round already on screen are detected
//   via the server round_id and ignored
// - the 3s countdown is synced to the server round start when available
//
// `trackTimeLimit` additionally mirrors the server time limit into gameState
// (timeLimit/timeRemaining), which bot matches use for their answer timer.
export function useRoundAdvance({ setGameState, onRoundStart, trackTimeLimit = false }) {
  const advancingRef = useRef(false);
  const currentRoundIdRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const [connectionIssue, setConnectionIssue] = useState(false);
  const [roundError, setRoundError] = useState(false);

  // Keep the latest callback without making startCountdown's identity unstable
  const onRoundStartRef = useRef(onRoundStart);
  onRoundStartRef.current = onRoundStart;

  const clearCountdownInterval = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const startCountdown = useCallback(async (matchId) => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    // Load the question FIRST; only reset timers and visible state after the
    // fetch succeeds.
    let res;
    try {
      res = await Promise.race([
        gameAPI.getQuestion(matchId),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Question fetch timeout')), QUESTION_FETCH_TIMEOUT_MS)
        ),
      ]);
    } catch (error) {
      console.error('Failed to load question:', error);
      advancingRef.current = false;
      // Never eject the player from an active match. If the match actually
      // ended, the status poll moves us to the finished screen; anything else
      // is treated as transient and retried.
      if (error?.response?.status === 400 || error?.response?.status === 403) {
        return;
      }
      retryCountRef.current += 1;
      if (retryCountRef.current > MAX_QUESTION_RETRIES) {
        setConnectionIssue(false);
        setRoundError(true);
        return;
      }
      setConnectionIssue(true);
      retryTimeoutRef.current = setTimeout(() => startCountdown(matchId), QUESTION_RETRY_DELAY_MS);
      return;
    }

    retryCountRef.current = 0;
    setConnectionIssue(false);
    setRoundError(false);

    // Same round we are already showing (e.g. a duplicate advance trigger or
    // a poll race): keep the running timer instead of resetting the round.
    if (res.data.round_id && res.data.round_id === currentRoundIdRef.current) {
      advancingRef.current = false;
      return;
    }
    currentRoundIdRef.current = res.data.round_id || null;

    clearCountdownInterval();
    onRoundStartRef.current?.();

    const timeLimit = res.data.time_limit || null;
    setGameState(prev => ({
      ...prev,
      countdown: 3,
      phase: 'countdown',
      currentRound: prev.currentRound + 1,
      question: res.data.expression,
      evaluateAt: res.data.evaluate_at,
      askForDerivativeOnly: res.data.ask_for_derivative_only ?? true,
      ...(trackTimeLimit ? { timeLimit, timeRemaining: timeLimit } : {}),
    }));

    // Without a round_id we cannot dedupe duplicate triggers, so hold the
    // single-flight lock through the whole countdown instead.
    const releaseLockAfterCountdown = !res.data.round_id;

    const countdownStart = resolveCountdownStart(res.data.round_start_time);
    const updateCountdown = () => {
      const elapsed = Date.now() - countdownStart;
      const remaining = Math.max(0, Math.ceil((COUNTDOWN_MS - elapsed) / 1000));
      if (remaining <= 0) {
        setGameState(prev => ({
          ...prev,
          countdown: 0,
          phase: 'question',
          ...(trackTimeLimit ? { timeRemaining: prev.timeLimit } : {}),
        }));
        if (releaseLockAfterCountdown) {
          advancingRef.current = false;
        }
        return false;
      }
      setGameState(prev => ({ ...prev, countdown: remaining }));
      return true;
    };

    if (updateCountdown()) {
      countdownIntervalRef.current = setInterval(() => {
        if (!updateCountdown()) {
          clearCountdownInterval();
        }
      }, 100);
    }
    if (!releaseLockAfterCountdown) {
      advancingRef.current = false;
    }
  }, [setGameState, trackTimeLimit]);

  // Manual retry after the automatic retries were exhausted
  const retryRound = useCallback((matchId) => {
    retryCountRef.current = 0;
    setRoundError(false);
    startCountdown(matchId);
  }, [startCountdown]);

  // For "play again" flows that reuse the component for a fresh match
  const resetRound = useCallback(() => {
    advancingRef.current = false;
    currentRoundIdRef.current = null;
    retryCountRef.current = 0;
    clearCountdownInterval();
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    setConnectionIssue(false);
    setRoundError(false);
  }, []);

  useEffect(() => {
    return () => {
      clearCountdownInterval();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return { startCountdown, retryRound, resetRound, connectionIssue, roundError };
}
