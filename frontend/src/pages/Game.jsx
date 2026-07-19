import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameAPI } from '../api';
import api from '../api';

export default function Game() {
  const countdownIntervalRef = useRef(null);
  const joinAttemptedRef = useRef(false);
  const navigate = useNavigate();
  const { matchCode } = useParams();
  
  const [opponent, setOpponent] = useState('');
  const [username, setUsername] = useState('You');
  const [opponentName, setOpponentName] = useState('Opponent');
  const [userId, setUserId] = useState('');
  const [userElo, setUserElo] = useState(1000);
  const [oldElo, setOldElo] = useState(1000);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [isWaiting, setIsWaiting] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const elapsedTimerRef = useRef(null);
  const [gameState, setGameState] = useState({
    matchId: '',
    currentRound: 0,
    player1Score: 0,
    player2Score: 0,
    question: null,
    countdown: 3,
    phase: 'waiting',
    userAnswer: '',
    isCorrect: null,
    opponentWon: false,
    roundWinner: null,
    matchWinner: null,
    evaluateAt: 0,
    askForDerivativeOnly: true,
    eloChange: 0,
    submitting: false,
    gaveUp: false,
    opponentGaveUp: false,
  });

  // Load user profile once so we know our id/elo for winner detection and names
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await gameAPI.getProfile();
        const id = profile.data.id;
        setUserId(id);
        if (profile.data.elo) {
          setUserElo(profile.data.elo);
          setOldElo(profile.data.elo);
        }
        if (profile.data.username || profile.data.name) {
          setUsername(profile.data.username || profile.data.name);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    loadProfile();
  }, []);

  // Check if match is ready and get match ID
  useEffect(() => {
    const checkMatchStatus = async () => {
      try {
        const response = await api.get(`/game/friend/status/${matchCode}`);
        if (response.data.status === 'waiting') {
          // Reaching the game via a shared link means we still need to join.
          // Attempt it once; the match creator is rejected ("Cannot join your
          // own match"), which is expected and safe to ignore while they wait.
          if (!joinAttemptedRef.current) {
            joinAttemptedRef.current = true;
            try {
              await api.post('/game/friend/join', { match_code: matchCode });
            } catch (joinError) {
              console.debug('Join attempt skipped:', joinError?.response?.data?.detail);
            }
          }
          return;
        }
        if (response.data.status === 'active') {
          setGameState(prev => ({ ...prev, matchId: response.data.match_id }));
          setIsWaiting(false);
          
          // Get userId directly to ensure it's available
          const currentUserId = userId || (await gameAPI.getProfile()).data.id;
          setUserId(currentUserId);
          await fetchGameStatus(response.data.match_id, currentUserId);
          
          startCountdown(response.data.match_id);
        }
      } catch (error) {
        console.error('Failed to check match status:', error);
      }
    };

    if (matchCode && isWaiting) {
      checkMatchStatus();
      const interval = setInterval(checkMatchStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [matchCode, isWaiting, userId]);

  const fetchGameStatus = async (matchId, currentUserId) => {
    try {
      const res = await gameAPI.getStatus(matchId);
      const isPlayer1 = currentUserId === res.data.player1_id;
      const opponent = isPlayer1 ? res.data.player2_name : res.data.player1_name;
      setOpponent(opponent);
      setOpponentName(opponent);
    } catch (error) {
      console.error('Failed to fetch game status:', error);
    }
  };

  const startCountdown = async (matchId) => {
    // Clear any previous countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    // Clear elapsed timer
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    setElapsedTime(0);
    
    // Load question first, THEN set countdown phase
    try {
      const res = await Promise.race([
        gameAPI.getQuestion(matchId),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Question fetch timeout')), 10000)
        )
      ]);
      
      console.log('Question data:', res.data);
      console.log('ask_for_derivative_only:', res.data.ask_for_derivative_only);
      
      // Now set countdown phase after question is loaded
      setGameState(prev => ({ 
        ...prev, 
        countdown: 3, 
        phase: 'countdown',
        currentRound: prev.currentRound + 1,
        question: res.data.expression,
        evaluateAt: res.data.evaluate_at,
        askForDerivativeOnly: res.data.ask_for_derivative_only ?? true,
      }));
      
      // Use server timestamp if available for better sync
      const serverTime = res.data.round_start_time ? new Date(res.data.round_start_time).getTime() : null;
      const countdownStart = serverTime || Date.now();
      const durationMs = 3000;

      const updateCountdown = () => {
        const elapsed = Date.now() - countdownStart;
        const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
        if (remaining <= 0) {
          setGameState(prev => ({ ...prev, countdown: 0, phase: 'question' }));
          return false;
        }
        setGameState(prev => ({ ...prev, countdown: remaining }));
        return true;
      };

      if (updateCountdown()) {
        countdownIntervalRef.current = setInterval(() => {
          if (!updateCountdown()) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Failed to load question:', error);
      alert('Failed to load question. Returning to home...');
      navigate('/');
    }
  };

  // Stopwatch timer for question phase
  useEffect(() => {
    if (gameState.phase === 'question') {
      const startTime = Date.now();
      elapsedTimerRef.current = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    } else {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
    }
    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, [gameState.phase]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, []);

  const submitAnswer = async () => {
    console.log('submitAnswer called. userAnswer:', gameState.userAnswer, 'askForDerivativeOnly:', gameState.askForDerivativeOnly, 'phase:', gameState.phase, 'question:', gameState.question);
    if (!gameState.userAnswer.trim() || gameState.submitting || !gameState.question || gameState.phase !== 'question') return;

    console.log('Submitting answer:', gameState.userAnswer);
    console.log('askForDerivativeOnly:', gameState.askForDerivativeOnly);

    setGameState(prev => ({ ...prev, submitting: true }));

    try {
      // Always send answer as string for this game mode
      const answer = gameState.userAnswer.trim();
      console.log('Processed answer:', answer, 'type:', typeof answer);
      const res = await gameAPI.submitAnswer(gameState.matchId, answer);
      
      // Update scores immediately
      setGameState(prev => ({
        ...prev,
        player1Score: res.data.player1_score,
        player2Score: res.data.player2_score,
        submitting: false,
      }));
      
      // Check if opponent already won this round
      if (res.data.already_won) {
        // Opponent beat us to it!
        setGameState(prev => ({
          ...prev,
          opponentWon: true,
          isCorrect: null,
        }));
        
        setTimeout(() => {
          setGameState(prev => {
            // Don't start new round if match is finished
            if (prev.player1Score >= 3 || prev.player2Score >= 3) {
              return { ...prev, phase: 'finished', matchWinner: res.data.match_winner, eloChange: res.data.elo_change || 0 };
            }
            return {
              ...prev,
              userAnswer: '',
              isCorrect: null,
              opponentWon: false,
            };
          });
          // Only start countdown if match not finished
          if (res.data.player1_score < 3 && res.data.player2_score < 3) {
            startCountdown(gameState.matchId);
          }
        }, 1500);
      } else if (res.data.correct) {
        // Correct answer! Show result and move to next round
        setGameState(prev => ({
          ...prev,
          isCorrect: true,
          roundWinner: res.data.round_winner,
          opponentWon: false,
        }));

        if (res.data.player1_score >= 3 || res.data.player2_score >= 3) {
          setTimeout(() => {
            setGameState(prev => ({
              ...prev,
              phase: 'finished',
              matchWinner: res.data.match_winner,
              eloChange: res.data.elo_change || 0,
            }));
          }, 2000);
        } else {
          setTimeout(() => {
            setGameState(prev => ({
              ...prev,
              userAnswer: '',
              isCorrect: null,
              roundWinner: null,
            }));
            startCountdown(gameState.matchId);
          }, 1500);
        }
      } else {
        // Wrong answer - just show it's wrong
        setGameState(prev => ({
          ...prev,
          isCorrect: false,
          submitting: false
        }));
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      setGameState(prev => ({ ...prev, submitting: false }));
    }
  };

  const giveUpRound = async () => {
    if (gameState.gaveUp || !gameState.matchId) return;
    try {
      await gameAPI.giveUpRound(gameState.matchId);
      setGameState(prev => ({ ...prev, gaveUp: true }));
    } catch (error) {
      console.error('Failed to give up:', error);
    }
  };

  // Poll for game status updates
  useEffect(() => {
    if (!gameState.matchId || gameState.phase === 'finished' || isWaiting) return;

    let stopped = false;
    const checkStatus = async () => {
      try {
        const res = await gameAPI.getStatus(gameState.matchId);

        // Determine if current user is player1
        if (userId && res.data.player1_id && res.data.player2_id) {
          setIsPlayer1(userId === res.data.player1_id);
        }

        // Update player names
        if (res.data.player1_name) setPlayer1Name(res.data.player1_name);
        if (res.data.player2_name) setPlayer2Name(res.data.player2_name);

        // Update scores if they changed
        if (
          res.data.player1_score !== gameState.player1Score ||
          res.data.player2_score !== gameState.player2Score
        ) {
          setGameState(prev => ({
            ...prev,
            player1Score: res.data.player1_score,
            player2Score: res.data.player2_score,
          }));

          // Check if match is over
          if (res.data.player1_score >= 3 || res.data.player2_score >= 3) {
            const profileRes = await gameAPI.getProfile();
            if (profileRes.data.elo) setUserElo(profileRes.data.elo);
            setGameState(prev => ({
              ...prev,
              phase: 'finished',
              matchWinner: res.data.winner_id,
              eloChange: res.data.elo_change || 0,
            }));
            return;
          }
        }

        // If both gave up and round_winner is tie, always advance to next round
        if (
          res.data.round_winner === 'tie' &&
          res.data.player1_gave_up &&
          res.data.player2_gave_up
        ) {
          setGameState(prev => {
            if (prev.phase !== 'countdown') {
              setTimeout(() => startCountdown(gameState.matchId), 100);
            }
            return {
              ...prev,
              gaveUp: false,
              opponentGaveUp: false,
              userAnswer: '',
              isCorrect: null,
              opponentWon: false,
            };
          });
        }

        // Check if opponent gave up
        const opponentGaveUp = userId === res.data.player1_id ? res.data.player2_gave_up : res.data.player1_gave_up;
        if (opponentGaveUp && !gameState.opponentGaveUp) {
          setGameState(prev => ({ ...prev, opponentGaveUp: true }));
        }

        // If in question phase and round_winner is not user, stop user instantly
        if (
          gameState.phase === 'question' &&
          res.data.round_winner &&
          res.data.round_winner !== userId &&
          !gameState.opponentWon &&
          !gameState.isCorrect &&
          !gameState.submitting &&
          !stopped
        ) {
          stopped = true;
          setGameState(prev => ({ ...prev, opponentWon: true, isCorrect: null }));
          setTimeout(() => {
            setGameState(prev => {
              // Don't start new round if match is finished
              if (prev.player1Score >= 3 || prev.player2Score >= 3) {
                return { ...prev, phase: 'finished', matchWinner: res.winner_id, eloChange: res.elo_change || 0 };
              }
              return {
                ...prev,
                userAnswer: '',
                isCorrect: null,
                opponentWon: false,
                gaveUp: false,
                opponentGaveUp: false,
              };
            });
            // Only start countdown if match not finished
            if (res.data.player1_score < 3 && res.data.player2_score < 3) {
              startCountdown(gameState.matchId);
            }
          }, 1500);
        }
      } catch (err) {
        // Ignore polling errors
      }
    };

    // Poll immediately and then at interval
    checkStatus();
    const poll = setInterval(checkStatus, 500);
    return () => clearInterval(poll);
  }, [gameState.matchId, gameState.phase, isWaiting, userId, oldElo, userElo, gameState.opponentWon, gameState.isCorrect, gameState.submitting, gameState.player1Score, gameState.player2Score]);

  if (isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-light text-gray-800 mb-4">
            waiting for opponent...
          </div>
          <div className="text-sm text-gray-500 mb-8">
            match code: {matchCode?.toUpperCase()}
          </div>
          <button
            onClick={() => navigate('/play/friend')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← cancel
          </button>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'countdown') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-8xl font-light text-gray-900">
          {gameState.countdown}
        </div>
      </div>
    );
  }

  if (gameState.phase === 'finished') {
    const won = gameState.matchWinner === userId;
    const eloSign = won ? '+' : '-';
    const displayOldElo = oldElo;
    const displayNewElo = userElo;
    
    console.log('Match finished - oldElo:', oldElo, 'userElo:', userElo, 'eloChange:', gameState.eloChange);
    
    // Show current user's score first
    const userScore = isPlayer1 ? gameState.player1Score : gameState.player2Score;
    const opponentScore = isPlayer1 ? gameState.player2Score : gameState.player1Score;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white border border-gray-300 rounded p-12 text-center max-w-md">
          <h1 className="text-2xl font-light text-gray-900 mb-6">
            {won ? 'you won' : 'you lost'}
          </h1>
          <div className="text-4xl font-light mb-2 text-gray-900">
            {userScore} - {opponentScore}
          </div>
          {gameState.eloChange > 0 && (
            <>
              <div className="text-sm text-gray-500 mb-2">
                {displayOldElo} {eloSign}{gameState.eloChange}
              </div>
              <div className="text-xs text-gray-400 mb-8">
                ({displayNewElo})
              </div>
            </>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate('/play/friend')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded transition-colors"
            >
              play again
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm px-6 py-2 rounded transition-colors"
            >
              home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate current round based on total score
  const currentRound = gameState.player1Score + gameState.player2Score + 1;
  // Use opponent from state everywhere
  const displayOpponentName = opponent || opponentName || 'Opponent';

  return (
    <>
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="text-sm text-gray-600">
              round {currentRound}
            </div>
            <div className="flex gap-8 text-sm">
              <span className="text-gray-900">{isPlayer1 ? player1Name : player2Name}: {isPlayer1 ? gameState.player1Score : gameState.player2Score}</span>
              <span className="text-gray-600">{isPlayer1 ? player2Name : player1Name}: {isPlayer1 ? gameState.player2Score : gameState.player1Score}</span>
            </div>
          </div>

          {gameState.question && (
            <div className="bg-white border border-gray-300 rounded p-8 mb-8">
              {gameState.phase === 'question' && (
                <div className="text-center mb-4">
                  <div className="text-3xl font-light text-gray-900">
                    {elapsedTime.toFixed(1)}s
                  </div>
                </div>
              )}
              <h2 className="text-xl font-light text-gray-900 text-center mb-8">
                f(x) = <span dangerouslySetInnerHTML={{ __html: gameState.question }} />, find f'(x)
              </h2>

              {gameState.phase === 'question' && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={gameState.userAnswer}
                    onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && !gameState.submitting && gameState.question && gameState.phase === 'question' && submitAnswer()}
                    className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                    placeholder="e.g., 2*x or 2·x"
                    autoFocus
                    disabled={!gameState.question || gameState.phase !== 'question' || gameState.submitting || gameState.opponentWon}
                  />
                  <button
                    onClick={submitAnswer}
                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-6 py-3 rounded transition-colors"
                    disabled={!gameState.question || gameState.phase !== 'question' || gameState.submitting || !gameState.userAnswer.trim() || gameState.opponentWon}
                  >
                    submit
                  </button>
                  <button
                    onClick={giveUpRound}
                    disabled={gameState.gaveUp && !gameState.opponentGaveUp || gameState.opponentWon}
                    className={
                      `text-white text-sm px-6 py-3 rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed ` +
                      (gameState.opponentGaveUp && !gameState.gaveUp
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-600 hover:bg-gray-700')
                    }
                  >
                    {gameState.gaveUp
                      ? (gameState.opponentGaveUp
                          ? 'both gave up! advancing...'
                          : 'waiting for opponent...')
                      : (gameState.opponentGaveUp
                          ? 'opponent gave up – click to advance'
                          : 'give up this round')}
                  </button>
                </div>
              )}

              {gameState.isCorrect !== null && (
                <div className="text-center p-8 bg-white border border-gray-300 rounded">
                  <h3 className="text-lg font-light text-gray-900">
                    {gameState.isCorrect ? 'you got it right' : 'wrong answer'}
                  </h3>
                </div>
              )}

              {gameState.opponentWon && (
                <div className="text-center p-8 bg-white border border-gray-300 rounded">
                  <h3 className="text-lg font-light text-gray-900">
                    {displayOpponentName} got it right
                  </h3>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
	</>
  );
}
