import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import Seo from '../components/Seo';

const dailyChallengeSeo = (
  <Seo
    title="Daily Derivative Challenge - New Calculus Problem Every Day | Derivative Duel"
    description="Solve today's derivative problem and compete for the fastest time. One new calculus challenge every day with a global leaderboard."
    path="/daily-challenge"
  />
);

export default function DailyChallenge() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('overview'); // overview, countdown, playing, results
  const [countdown, setCountdown] = useState(3);
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [results, setResults] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [userCompletions, setUserCompletions] = useState({});
  const [loading, setLoading] = useState(true);
  const [todayStr, setTodayStr] = useState(() => new Date().toISOString().split('T')[0]);
  // SSR-safe: window does not exist during build-time prerendering
  const [isLoggedIn] = useState(
    () => typeof window !== 'undefined' && !!window.localStorage.getItem('token')
  );

  // Fetch server time on mount to sync with backend
  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const res = await api.get('/server-time');
        setTodayStr(res.data.date);
        console.log('[DEBUG] Server date:', res.data.date);
      } catch (e) {
        console.warn('Failed to fetch server time, using local time:', e.message);
        // Fall back to local time if API fails
      }
    };
    fetchServerTime();
  }, []);

  // Timer
  useEffect(() => {
    if (phase === 'playing' && startTime) {
      const interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [phase, startTime]);

  // Load today's challenge and past data
  useEffect(() => {
    loadDailyChallenge();
  }, []);

  const loadDailyChallenge = async () => {
    // allSettled so guests still see whatever public data the backend
    // returns even when auth-gated endpoints reject the request
    const [challengeRes, leaderboardRes, historyRes] = await Promise.allSettled([
      api.get('/daily-challenge/today'),
      api.get('/daily-challenge/leaderboard'),
      api.get('/daily-challenge/history')
    ]);

    if (challengeRes.status === 'fulfilled') {
      setTodayChallenge(challengeRes.value.data);
    } else {
      console.error('Failed to load today\'s challenge:', challengeRes.reason);
    }

    if (leaderboardRes.status === 'fulfilled') {
      // Handle leaderboard - can be direct array or wrapped in object
      let leaderboardData = [];
      if (Array.isArray(leaderboardRes.value.data)) {
        leaderboardData = leaderboardRes.value.data;
      } else if (leaderboardRes.value.data && leaderboardRes.value.data.top_times) {
        leaderboardData = leaderboardRes.value.data.top_times;
      }
      setLeaderboard(leaderboardData);
    }

    if (historyRes.status === 'fulfilled') {
      // Convert history to array - handle both array and object responses
      let history = [];
      let userCompletionsData = {};
      if (Array.isArray(historyRes.value.data)) {
        history = historyRes.value.data;
      } else if (historyRes.value.data && typeof historyRes.value.data === 'object') {
        // New API structure: {challenges: Array, user_completions: Object}
        history = historyRes.value.data.challenges || historyRes.value.data.history || [];
        userCompletionsData = historyRes.value.data.user_completions || {};
      }
      setPastChallenges(history);

      // Create user completions map from the dedicated user_completions object
      const completionMap = {};
      if (userCompletionsData && typeof userCompletionsData === 'object') {
        Object.keys(userCompletionsData).forEach(date => {
          const completion = userCompletionsData[date];
          completionMap[date] = {
            time: completion.time || completion.your_time,
            rank: completion.rank
          };
        });
      }
      setUserCompletions(completionMap);
    }

    setLoading(false);
  };

  const startChallenge = () => {
    setPhase('countdown');
    setUserAnswer('');
    
    setCountdown(3);
    setTimeout(() => {
      setCountdown(2);
      setTimeout(() => {
        setCountdown(1);
        setTimeout(() => {
          setPhase('playing');
          setStartTime(Date.now());
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return;

    const timeTaken = (Date.now() - startTime) / 1000;
    // Normalize caret to exponent for backend parsing
    const normalizedAnswer = userAnswer.replace(/\^/g, '**').trim();
    
    console.log('[DEBUG] Submitting answer:', normalizedAnswer);
    console.log('[DEBUG] Time taken:', timeTaken);

    try {
      const response = await api.post('/daily-challenge/submit', {
        answer: normalizedAnswer,
        time: timeTaken
      });
      
      console.log('[DEBUG] Submit response:', response.data);
      
      if (response.data.correct) {
        console.log('[DEBUG] Answer correct! Clearing error.');
        setErrorMessage('');
        setResults(response.data);
        setPhase('results');
        // Reload leaderboard and history
        loadDailyChallenge();
      } else {
        // Wrong answer - keep input and show inline message
        console.log('[DEBUG] Answer wrong! Showing error, keeping input.');
        setErrorMessage('wrong answer');
        // DON'T clear userAnswer here
      }
    } catch (error) {
      console.error('[DEBUG] Failed to submit answer:', error);
      setErrorMessage('wrong answer');
      // DON'T clear userAnswer here either
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    // Use state todayStr instead of computing here
    
    // Generate last 12 months including current
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      months.push({
        month: monthDate.getMonth(),
        year: monthDate.getFullYear(),
        name: monthDate.toLocaleDateString('en-US', { month: 'short' })
      });
    }

    return (
      <div className="bg-white border border-gray-200 rounded p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {months.reverse().map(({ month, year, name }) => {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay();
            
            const days = [];
            
            // Add empty cells for days before month starts
            for (let i = 0; i < startDayOfWeek; i++) {
              days.push(null);
            }
            
            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
              const dateObj = new Date(year, month, day);
              const dateStr = dateObj.toISOString().split('T')[0];
              // Compare by date string to avoid time-of-day or timezone marking today as future
              const isFuture = dateStr > todayStr;
              
              const challenge = Array.isArray(pastChallenges) ? pastChallenges.find(c => c && c.date === dateStr) : null;
              const userCompletion = userCompletions[dateStr];
              
              days.push({
                day,
                date: dateStr,
                dateObj,
                challenge,
                userCompletion,
                isFuture
              });
            }
            
            return (
              <div key={`${year}-${month}`} className="flex justify-center">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2 text-center">{name}</h4>
                  <div className="grid grid-cols-7 gap-1" style={{width: 'fit-content'}}>
                    {days.map((dayData, idx) => {
                    if (!dayData) {
                      return <div key={`empty-${idx}`} className="w-4 h-4"></div>;
                    }
                    
                    const { date, dateObj, challenge, userCompletion, isFuture } = dayData;
                    const isCompleted = !!userCompletion;
                    const isWinner = userCompletion && userCompletion.rank === 1;
                    const isToday = date === todayStr;

                    // Show green immediately today, even if rank is #1; gold only after the day passes
                    const showWinner = isWinner && !isToday;
                    const showCompleted = isCompleted && !showWinner;

                    // Inline colors to avoid any Tailwind purge issues
                    const bgColor = showWinner
                      ? '#facc15' // yellow-300
                      : showCompleted
                      ? '#86efac' // green-300
                      : challenge
                      ? '#f3f4f6' // gray-100
                      : '#f9fafb'; // gray-50
                    const borderColor = showWinner
                      ? '#eab308' // yellow-500
                      : showCompleted
                      ? '#22c55e' // green-500
                      : challenge
                      ? '#d1d5db' // gray-300
                      : '#e5e7eb'; // gray-200
                    const colorClass = showWinner
                      ? 'bg-[#facc15] border-[#eab308]'
                      : showCompleted
                      ? 'bg-[#86efac] border-[#22c55e]'
                      : challenge
                      ? 'bg-gray-100 border-gray-300'
                      : 'bg-gray-50 border-gray-200';
                    
                    if (isToday) {
                      console.log('[DEBUG] Today cell:', date, 'userCompletion:', userCompletion, 'isCompleted:', isCompleted, 'isWinner:', isWinner, 'showWinner:', showWinner, 'showCompleted:', showCompleted);
                    }
                    
                    if (isFuture) {
                      return (
                        <div
                          key={date}
                          className="w-4 h-4 rounded-sm border border-gray-200 bg-gray-50"
                        />
                      );
                    }
                    
                    return (
                      <div
                        key={date}
                        className={`w-4 h-4 rounded-sm border transition-all hover:shadow-md transition-shadow cursor-pointer group relative ${colorClass}`}
                        style={{
                          backgroundColor: bgColor,
                          borderColor: borderColor,
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}
                        data-bgcolor={bgColor}
                        data-bordercolor={borderColor}
                        data-showwinner={showWinner}
                        data-showcompleted={showCompleted}
                        title={challenge ? `${dateObj.toLocaleDateString()}\n${challenge.expression}` : dateObj.toLocaleDateString()}
                      >
                        {/* Tooltip */}
                        {challenge && (
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-3 z-10 shadow-lg whitespace-normal">
                            <p className="font-semibold mb-1">{dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            <p className="mb-2">f(x) = <span dangerouslySetInnerHTML={{ __html: challenge.expression }} /></p>
                            {challenge.winner_username && (
                              <p className="text-yellow-400">Winner: {challenge.winner_username} - {formatTime(challenge.best_time)}</p>
                            )}
                            {isCompleted && (
                              <p className="text-green-400 mt-1">Your time: {formatTime(userCompletion.time)}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded-sm"></div>
            <span>Not completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 border border-green-500 rounded-sm"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 border border-yellow-500 rounded-sm"></div>
            <span>Winner</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        {dailyChallengeSeo}
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          key={countdown}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="text-gray-900 text-9xl font-light"
        >
          {countdown}
        </motion.div>
      </div>
    );
  }

  if (phase === 'playing' && todayChallenge) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-500">time</span>
                <span className="text-2xl font-light text-gray-900 ml-2">{formatTime(elapsedTime)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500">daily challenge</span>
                <span className="text-sm font-medium text-gray-900 ml-2">{new Date(todayChallenge.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white border border-gray-200 rounded p-8"
          >
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">Find the derivative of:</p>
              <div 
                className="text-4xl font-light text-gray-900 mb-4"
                dangerouslySetInnerHTML={{ __html: todayChallenge.expression }}
              />
              <p className="text-lg text-gray-900 mt-4">f'(x) = ?</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                placeholder="Enter your answer..."
                className="w-full p-4 border border-gray-300 rounded text-lg focus:outline-none focus:border-blue-500"
                autoFocus
              />
              
              <button
                onClick={handleAnswerSubmit}
                disabled={!userAnswer.trim()}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white py-4 rounded font-medium transition-colors"
              >
                Submit Answer
              </button>
              {errorMessage && (
                <p className="text-sm text-red-600 text-center">{errorMessage}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && results) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-gray-200 rounded p-8 text-center"
          >
            {results.correct ? (
              <>
                <div className="text-4xl font-bold text-green-600 mb-4">CORRECT</div>
                <p className="text-2xl text-gray-900 mb-6">{formatTime(results.time_taken)}</p>
                {results.is_fastest && (
                  <p className="text-lg text-gray-900 font-semibold mb-4">New Best Time!</p>
                )}
                <p className="text-gray-600 mb-8">Your rank today: #{results.rank}</p>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold text-red-600 mb-4">INCORRECT</div>
                <p className="text-gray-600 mb-4">The correct answer was:</p>
                <p className="text-xl text-gray-900 mb-8" dangerouslySetInnerHTML={{ __html: results.correct_answer }} />
              </>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setPhase('overview')}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded font-medium transition-colors"
              >
                Back to Overview
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Overview page
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {dailyChallengeSeo}
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          ← back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Daily Challenge</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Challenge */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Challenge</h2>
            {!isLoggedIn ? (
              <div className="py-4">
                <p className="text-gray-600 mb-4">
                  Every day there is one new derivative problem. Everyone gets the same
                  function, and the leaderboard ranks players by solve time - one attempt per day.
                </p>
                <div className="bg-gray-50 p-6 rounded mb-6">
                  <p className="text-sm text-gray-600 mb-2">Sign in to see today's function and post your time.</p>
                  <p className="text-gray-700">Your streak and results are saved to your account.</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded font-medium transition-colors w-full"
                >
                  Sign in to play
                </button>
              </div>
            ) : todayChallenge ? (
              <>
                {todayChallenge.user_completed ? (
                  <div className="text-center py-8">
                    <div className="text-2xl font-bold text-green-600 mb-3">COMPLETED</div>
                    <p className="text-gray-600 mb-2">You've completed today's challenge!</p>
                    <p className="text-2xl font-light text-gray-900 mb-4">{formatTime(todayChallenge.user_time)}</p>
                    <p className="text-sm text-gray-600 mb-4">Your rank: #{todayChallenge.user_rank}</p>
                    <p className="text-xs text-gray-500 mb-6">Come back tomorrow for a new challenge!</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">{new Date(todayChallenge.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <div className="bg-gray-50 p-6 rounded mb-6">
                      <p className="text-sm text-gray-600 mb-4">Ready to find today's derivative?</p>
                      <p className="text-gray-700">Start the challenge to see the function.</p>
                    </div>
                    <button
                      onClick={startChallenge}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded font-medium transition-colors w-full"
                    >
                      Start Challenge
                    </button>
                  </>
                )}
              </>
            ) : (
              <p className="text-gray-600 py-8 text-center">No challenge available today</p>
            )}
          </div>

          {/* Today's Leaderboard */}
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Top 10</h2>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-600'}`}>
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-900">{entry.username || 'Anonymous'}</span>
                    </div>
                    <span className="text-sm text-gray-600">{formatTime(entry.time)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No completions yet</p>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div key={JSON.stringify(userCompletions)}>
          {renderCalendar()}
          {/* Debug helper to force Tailwind to keep these classes */}
          <div className="hidden">
            <span className="bg-green-300 border-green-500"></span>
            <span className="bg-yellow-300 border-yellow-500"></span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <div>Build marker: calendar-inline-v3</div>
            <div>Today status: {userCompletions[new Date().toISOString().split('T')[0]] ? 'completed' : 'not completed'}</div>
            <div>Today data: {JSON.stringify(userCompletions[new Date().toISOString().split('T')[0]])}</div>
            <div>Rendered color (today): {userCompletions[new Date().toISOString().split('T')[0]] ? 'green inline style' : 'gray'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
