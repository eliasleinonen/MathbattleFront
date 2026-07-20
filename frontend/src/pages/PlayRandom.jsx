import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gameAPI } from '../api';
import Seo from '../components/Seo';
import { useRoundAdvance } from '../hooks/useRoundAdvance';

const playRandomSeo = (
  <Seo
    title="Play Random Match - 1v1 Derivative Battle | Derivative Duel"
    description="Get matched with an opponent at your skill level and race to solve calculus derivatives. Win rounds, climb the ELO ladder - free and no download."
    path="/play/random"
  />
);

const createInitialGameState = () => ({
  matchId: '',
  currentRound: 0,
  player1Score: 0,
  player2Score: 0,
  question: null,
  countdown: 3,
  phase: 'searching',
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
  timeLimit: null,
  timeRemaining: null,
});

export default function PlayRandom() {
  const navigate = useNavigate();
  const { matchCode } = useParams();

  // Load existing match if matchCode is in URL, otherwise start searching
  useEffect(() => {
    if (matchCode) {
      // Load existing match by code
      loadMatchByCode(matchCode);
      isSearchingRef.current = false;
      setIsSearching(false);
    } else if (isSearching) {
      // Start new matchmaking
      searchForMatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  
  // Anonymous play is now supported - no login required
  
  const searchTimeoutRef = useRef(null);
  const isSearchingRef = useRef(true);
  const [isSearching, setIsSearching] = useState(true);
  const [searchTime, setSearchTime] = useState(10);
  const [opponent, setOpponent] = useState('');
  const [username, setUsername] = useState('You');
  const [opponentName, setOpponentName] = useState('Opponent');
  const [userId, setUserId] = useState('');
  const [userElo, setUserElo] = useState(1000);
  const [oldElo, setOldElo] = useState(1000); // ELO before match started
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [isBot, setIsBot] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const elapsedTimerRef = useRef(null);
  const [gameState, setGameState] = useState(createInitialGameState());

  const { startCountdown, retryRound, resetRound, connectionIssue, roundError } = useRoundAdvance({
    setGameState,
    trackTimeLimit: true,
    onRoundStart: () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      setElapsedTime(0);
    },
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

  // Smooth countdown timer for searching phase
  useEffect(() => {
    if (!isSearching || searchTime <= 0) return;
    const timer = setInterval(() => {
      setSearchTime(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSearching, searchTime]);

  const loadMatchByCode = async (code) => {
    try {
      const res = await gameAPI.getMatchByCode(code);
      const { match_id, is_player1, opponent_name, is_opponent_bot, player1_score, player2_score, current_round } = res.data;
      
      setGameState(prev => ({
        ...prev,
        matchId: match_id,
        player1Score: player1_score,
        player2Score: player2_score,
        currentRound: current_round
      }));
      
      setOpponent(opponent_name);
      setOpponentName(opponent_name);
      setIsPlayer1(is_player1);
      setIsBot(is_opponent_bot);
      
      // Load user ID if not already set
      if (!userId) {
        const profile = await gameAPI.getProfile();
        setUserId(profile.data.id);
      }
      
      // Start countdown for the match
      startCountdown(match_id);
    } catch (error) {
      // Invalid or expired match code: nothing to resume, go home
      console.error('Failed to load match by code:', error);
      navigate('/');
    }
  };

  const fetchGameStatus = async (matchId, currentUserId) => {
    try {
      const res = await gameAPI.getStatus(matchId);
      // Determine if current user is player1 or player2
      const isPlayer1 = currentUserId === res.data.player1_id;
      const opponent = isPlayer1 ? res.data.player2_name : res.data.player1_name;
      // Detect bot by id or name ending
      const isAgainstBot = (isPlayer1 ? res.data.player2_id : res.data.player1_id) === 'bot-opponent' || (opponent && opponent.endsWith('(bot)'));
      setIsBot(isAgainstBot);
      setOpponent(opponent);
      setOpponentName(opponent);
    } catch (error) {
      console.error('Failed to fetch game status:', error);
    }
  };

  const searchForMatch = async () => {
    if (!isSearchingRef.current) return; // Stop if cancelled
    
    try {
      // Pass false for continue_existing to ensure we never resume old matches
      const res = await gameAPI.startMatch('random', false);
      
      // Check if user cancelled before processing response
      if (!isSearchingRef.current) {
        console.log('Cancelled during request, ignoring response');
        return;
      }
      
      if (res.data.status === 'cancelled') {
        // Matchmaking was cancelled
        isSearchingRef.current = false;
        setIsSearching(false);
        return;
      } else if (res.data.status === 'searching') {
        // Still searching, poll again
        // Update server time_remaining but don't rely on it for smooth countdown
        if (res.data.time_remaining !== undefined) {
          setSearchTime(res.data.time_remaining);
        }
        searchTimeoutRef.current = setTimeout(searchForMatch, 1000);
      } else if (res.data.status === 'matched') {
        // Double-check user hasn't cancelled during the async call
        if (!isSearchingRef.current) {
          console.log('User cancelled, not joining match');
          return;
        }
        
        // Match found!
        isSearchingRef.current = false;
        setIsSearching(false);
        setOpponent(res.data.opponent);
        const matchId = res.data.match_id;
        const code = res.data.match_code;
        setGameState(prev => ({ ...prev, matchId, currentRound: 0, player1Score: 0, player2Score: 0 }));
        
        // Get userId directly to ensure it's available
        const currentUserId = userId || (await gameAPI.getProfile()).data.id;
        setUserId(currentUserId);
        await fetchGameStatus(matchId, currentUserId);
        // Always set opponent from backend
        if (res.data.opponent) setOpponent(res.data.opponent);
        
        // Navigate to match code URL only if code exists
        if (code) {
          navigate(`/play/random/${code}`, { replace: true });
        }
        
        startCountdown(matchId);
      }
    } catch (error) {
      console.error('Failed to start match:', error);
    }
  };

  const cancelSearch = async () => {
    isSearchingRef.current = false;
    setIsSearching(false);
    // Clear any pending timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    try {
      await gameAPI.cancelMatchmaking();
      navigate('/');
    } catch (error) {
      console.error('Failed to cancel:', error);
      navigate('/');
    }
  };

  const resetTimers = () => {
    resetRound();
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  const handlePlayAgain = () => {
    resetTimers();
    isSearchingRef.current = true;
    setIsSearching(true);
    setSearchTime(10);
    setElapsedTime(0);
    setIsBot(false);
    setOpponent('');
    setOpponentName('Opponent');
    setGameState(createInitialGameState());
    navigate('/play/random', { replace: true });
    searchForMatch();
  };

  // Stopwatch timer for question phase (excluding bot matches which have their own timer)
  useEffect(() => {
    if (gameState.phase === 'question' && !isBot) {
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
  }, [gameState.phase, isBot]);

  // Clean up timers on unmount (round timers are owned by useRoundAdvance)
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
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
        // Opponent beat us to it or time ran out!
        setGameState(prev => ({
          ...prev,
          opponentWon: true,
          isCorrect: null,
        }));
        
        setTimeout(async () => {
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
          
          // If match is finished, fetch updated ELO
          if (res.data.player1_score >= 3 || res.data.player2_score >= 3) {
            try {
              const profileRes = await gameAPI.getProfile();
              if (profileRes.data.elo) {
                setUserElo(profileRes.data.elo);
              }
            } catch (err) {
              console.error('Failed to fetch updated profile:', err);
            }
          }
          
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
          setTimeout(async () => {
            setGameState(prev => ({
              ...prev,
              phase: 'finished',
              matchWinner: res.data.match_winner,
              eloChange: res.data.elo_change || 0,
            }));
            
            // Fetch updated ELO after match finishes
            try {
              const profileRes = await gameAPI.getProfile();
              if (profileRes.data.elo) {
                setUserElo(profileRes.data.elo);
              }
            } catch (err) {
              console.error('Failed to fetch updated profile:', err);
            }
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

  // Timer countdown for bot matches
  useEffect(() => {
    if (gameState.phase !== 'question' || !isBot || gameState.timeLimit === null) return;
    
    const timerInterval = setInterval(async () => {
      setGameState(prev => {
        if (prev.timeRemaining === null || prev.timeRemaining <= 0) {
          return prev;
        }
        const newTime = prev.timeRemaining - 0.1;
        if (newTime <= 0) {
          // Time's up! User loses the round - submit empty answer to record timeout
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 100);
    
    return () => {
      clearInterval(timerInterval);
    };
  }, [gameState.phase, gameState.timeLimit, isBot]);

  // Auto-submit empty answer when time runs out (for bot matches)
  useEffect(() => {
    if (gameState.timeRemaining !== 0 || gameState.phase !== 'question' || !isBot || gameState.submitting) return;
    
    let submitted = false;
    
    // Submit with empty answer to record the timeout in backend
    const autoSubmitTimeout = async () => {
      if (submitted) return;
      submitted = true;
      
      setGameState(prev => ({ ...prev, submitting: true }));
      try {
        const res = await gameAPI.submitAnswer(gameState.matchId, '');
        
        // Update scores
        setGameState(prev => ({
          ...prev,
          player1Score: res.data.player1_score,
          player2Score: res.data.player2_score,
          submitting: false,
        }));
        
        // Bot won
        if (res.data.already_won) {
          setGameState(prev => ({
            ...prev,
            opponentWon: true,
            isCorrect: null,
          }));
          
          // Schedule next round after delay
          setTimeout(async () => {
            setGameState(prev => {
              if (prev.player1Score >= 3 || prev.player2Score >= 3) {
                return { ...prev, phase: 'finished', matchWinner: res.data.match_winner, eloChange: res.data.elo_change || 0 };
              }
              return {
                ...prev,
                userAnswer: '',
                isCorrect: null,
                opponentWon: false,
                gaveUp: false,
                opponentGaveUp: false,
                timeRemaining: prev.timeLimit,
              };
            });
            
            // If match is finished, fetch updated ELO
            if (res.data.player1_score >= 3 || res.data.player2_score >= 3) {
              try {
                const profileRes = await gameAPI.getProfile();
                if (profileRes.data.elo) {
                  setUserElo(profileRes.data.elo);
                }
              } catch (err) {
                console.error('Failed to fetch updated profile:', err);
              }
            }
            
            // Start next round
            if (res.data.player1_score < 3 && res.data.player2_score < 3) {
              startCountdown(gameState.matchId);
            }
          }, 1500);
        }
      } catch (error) {
        console.error('Failed to submit timeout answer:', error);
        setGameState(prev => ({ ...prev, submitting: false }));
      }
    };
    
    autoSubmitTimeout();
  }, [gameState.timeRemaining, gameState.phase, isBot]);

  // When opponent wins (timer or other reason), auto-advance after delay
  useEffect(() => {
    if (!gameState.opponentWon || gameState.phase !== 'question') return;
    
    const timeoutId = setTimeout(() => {
      setGameState(prev => {
        // Don't start new round if match is finished
        if (prev.player1Score >= 3 || prev.player2Score >= 3) {
          return { ...prev, phase: 'finished', matchWinner: prev.player1Score >= 3 ? (isPlayer1 ? userId : 'opponent') : (isPlayer1 ? 'opponent' : userId), opponentWon: false };
        }
        return {
          ...prev,
          userAnswer: '',
          isCorrect: null,
          opponentWon: false,
          gaveUp: false,
          opponentGaveUp: false,
          timeRemaining: prev.timeLimit, // Reset timer for next round
        };
      });
      // Start countdown for next round
      startCountdown(gameState.matchId);
    }, 1500);
    
    return () => clearTimeout(timeoutId);
  }, [gameState.opponentWon, gameState.phase, gameState.matchId, gameState.player1Score, gameState.player2Score, isPlayer1, userId]);


  // Poll for game status updates
  useEffect(() => {
    if (!gameState.matchId || gameState.phase === 'finished' || isSearching) return;

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
        // console.error('Polling error:', err);
      }
    };

    // Poll immediately and then at interval
    checkStatus();
    const poll = setInterval(checkStatus, 500);
    return () => clearInterval(poll);
  }, [gameState.matchId, gameState.phase, isSearching, userId, oldElo, userElo, gameState.opponentWon, gameState.isCorrect, gameState.submitting, gameState.player1Score, gameState.player2Score]);

  if (gameState.phase === 'countdown') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {playRandomSeo}
        <div className="text-8xl font-light text-gray-900">
          {gameState.countdown}
        </div>
      </div>
    );
  }

  if (gameState.phase === 'finished') {
    const userScore = isPlayer1 ? gameState.player1Score : gameState.player2Score;
    const opponentScore = isPlayer1 ? gameState.player2Score : gameState.player1Score;
    const won = gameState.matchWinner ? gameState.matchWinner === userId : userScore > opponentScore;
    const eloSign = won ? '+' : '-';
    // oldElo is stored before match, userElo is updated after
    const displayOldElo = oldElo;
    const displayNewElo = userElo;
    const absoluteEloChange = Math.abs(gameState.eloChange);
    
    console.log('Match finished - oldElo:', oldElo, 'userElo:', userElo, 'eloChange:', gameState.eloChange, 'won:', won);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        {playRandomSeo}
        <div className="bg-white border border-gray-300 rounded p-12 text-center max-w-md">
          <h1 className="text-2xl font-light text-gray-900 mb-6">
            {won ? 'you won' : 'you lost'}
          </h1>
          <div className="text-4xl font-light mb-2 text-gray-900">
            {userScore} - {opponentScore}
          </div>
          {absoluteEloChange > 0 && (
            <>
              <div className="text-sm text-gray-500 mb-2">
                {displayOldElo} {eloSign}{absoluteEloChange}
              </div>
              <div className="text-xs text-gray-400 mb-8">
                ({displayNewElo})
              </div>
            </>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePlayAgain}
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

  if (isSearching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {playRandomSeo}
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm max-w-md w-full">
          <div className="text-sm text-gray-500 mb-2">searching for an opponent</div>
          <div className="text-6xl font-light text-gray-900 mb-4">{searchTime}s</div>
          <div className="text-sm text-gray-600 mb-6">
            if no one joins in time, we will match you with a bot
          </div>
          <button
            onClick={cancelSearch}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-6 py-3 rounded transition-colors w-full"
          >
            cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {playRandomSeo}
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

          {connectionIssue && (
            <div className="mb-4 text-center text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded p-3">
              connection hiccup – reconnecting...
            </div>
          )}

          {roundError && (
            <div className="mb-4 text-center text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded p-3">
              couldn't load the next round.{' '}
              <button
                onClick={() => retryRound(gameState.matchId)}
                className="underline hover:text-gray-900"
              >
                try again
              </button>{' '}
              or{' '}
              <button onClick={() => navigate('/')} className="underline hover:text-gray-900">
                return home
              </button>
            </div>
          )}

          {gameState.question && (
            <div className="bg-white border border-gray-300 rounded p-8 mb-8">
              {isBot && gameState.timeRemaining !== null && gameState.phase === 'question' && (
                <div className="text-center mb-6">
                  <div className={`text-6xl font-light ${gameState.timeRemaining <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                    {Math.ceil(gameState.timeRemaining)}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">seconds remaining</div>
                </div>
              )}
              {!isBot && gameState.phase === 'question' && (
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
                    onKeyDown={(e) => e.key === 'Enter' && !gameState.submitting && gameState.question && gameState.phase === 'question' && submitAnswer()}
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