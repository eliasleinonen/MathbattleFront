import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function DailyChallenge() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('overview'); // overview, countdown, playing, results
  const [countdown, setCountdown] = useState(3);
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [results, setResults] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [userCompletions, setUserCompletions] = useState({});

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
    try {
      const [challengeRes, leaderboardRes, historyRes] = await Promise.all([
        api.get('/daily-challenge/today'),
        api.get('/daily-challenge/leaderboard'),
        api.get('/daily-challenge/history')
      ]);
      
      setTodayChallenge(challengeRes.data);
      setLeaderboard(leaderboardRes.data.top_times || []);
      setPastChallenges(historyRes.data.challenges || []);
      setUserCompletions(historyRes.data.user_completions || {});
    } catch (error) {
      console.error('Failed to load daily challenge:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const startChallenge = () => {
    setPhase('countdown');
    setUserAnswer('');
    
    // Countdown
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

    try {
      const response = await api.post('/daily-challenge/submit', {
        date: todayChallenge.date,
        answer: userAnswer,
        time_taken: timeTaken
      });
      
      setResults(response.data);
      setPhase('results');
      
      // Reload leaderboard and history
      loadDailyChallenge();
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
  };

  const renderCalendar = () => {
    if (!pastChallenges.length) return null;

    // Group challenges by month
    const challengesByMonth = {};
    pastChallenges.forEach(challenge => {
      const date = new Date(challenge.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!challengesByMonth[monthKey]) {
        challengesByMonth[monthKey] = [];
      }
      challengesByMonth[monthKey].push(challenge);
    });

    return (
      <div className="space-y-8">
        {Object.entries(challengesByMonth).reverse().map(([monthKey, challenges]) => {
          const [year, month] = monthKey.split('-');
          const monthName = new Date(year, parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          
          return (
            <div key={monthKey}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{monthName}</h3>
              <div className="grid grid-cols-7 gap-2">
                {challenges.map(challenge => {
                  const date = new Date(challenge.date);
                  const dateStr = challenge.date;
                  const userCompletion = userCompletions[dateStr];
                  const isCompleted = !!userCompletion;
                  const isWinner = challenge.winner_username && userCompletion && userCompletion.rank === 1;
                  
                  return (
                    <div
                      key={dateStr}
                      className={`aspect-square p-2 rounded border ${
                        isWinner ? 'bg-yellow-100 border-yellow-400' :
                        isCompleted ? 'bg-green-100 border-green-400' :
                        'bg-gray-50 border-gray-200'
                      } hover:shadow-md transition-shadow cursor-pointer group relative`}
                      title={`${date.toLocaleDateString()}\n${challenge.expression}\nWinner: ${challenge.winner_username || 'None'} (${challenge.best_time ? formatTime(challenge.best_time) : 'N/A'})`}
                    >
                      <div className="text-xs font-medium text-gray-700">{date.getDate()}</div>
                      {isCompleted && (
                        <div className="text-xs text-gray-600 mt-1">
                          {formatTime(userCompletion.time)}
                        </div>
                      )}
                      
                      {/* Tooltip */}
                      <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-3 z-10">
                        <p className="font-semibold mb-1">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <p className="mb-2">f(x) = {challenge.expression}</p>
                        {challenge.winner_username && (
                          <p className="text-yellow-400">🏆 {challenge.winner_username}: {formatTime(challenge.best_time)}</p>
                        )}
                        {isCompleted && (
                          <p className="text-green-400 mt-1">Your time: {formatTime(userCompletion.time)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const startTrial = async () => {
    try {
      const response = await api.post('/time-trial/start');
      setTrialId(response.data.trial_id);
      setQuestions(response.data.questions);
      setCurrentQuestion(0);
      setAnswers({});
      setPhase('countdown');
      
      // Countdown
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
    } catch (error) {
      console.error('Failed to start time trial:', error);
      if (error.response?.status === 401) {
        // User not logged in
        navigate('/login');
      }
    }
  };

  const handleAnswerSubmit = () => {
    if (!userAnswer) return;

    const question = questions[currentQuestion];
    
    // Save answer - keep as string for derivatives, parse as number for evaluated answers
    const newAnswers = {
      ...answers,
      [`answer_${currentQuestion}`]: question.ask_for_derivative_only ? userAnswer : parseFloat(userAnswer)
    };
    setAnswers(newAnswers);
    setUserAnswer('');

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTrial(newAnswers);
    }
  };

  const submitTrial = async (finalAnswers) => {
    try {
      const response = await api.post(`/time-trial/${trialId}/submit`, finalAnswers);
      setResults(response.data);
      setPhase('results');
    } catch (error) {
      console.error('Failed to submit time trial:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 1) return 'text-green-600';
    if (difficulty === 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyLabel = (difficulty) => {
    if (difficulty === 1) return 'easy';
    if (difficulty === 2) return 'medium';
    return 'hard';
  };

  if (phase === 'ready') {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            ← back
          </button>

          <div className="bg-white border border-gray-200 rounded p-8 text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">time trial</h1>
            <p className="text-lg text-gray-500 mb-8">
              coming soon
            </p>
            
            <p className="text-sm text-gray-600 mb-8">
              solve 5 derivative questions as fast as you can
            </p>
            
            <div className="space-y-2 mb-8 text-sm text-left max-w-xs mx-auto">
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-green-600">●</span>
                <span>question 1: easy</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-yellow-600">●</span>
                <span>question 2: medium</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-yellow-600">●</span>
                <span>question 3: medium</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-red-600">●</span>
                <span>question 4: hard</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-red-600">●</span>
                <span>question 5: hard</span>
              </div>
            </div>

            <button
              disabled
              className="bg-gray-300 text-gray-500 px-6 py-3 rounded text-sm font-medium w-full cursor-not-allowed"
            >
              coming soon
            </button>
          </div>
        </div>
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

  if (phase === 'playing' && questions[currentQuestion]) {
    const question = questions[currentQuestion];
    
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {/* Timer and Progress */}
          <div className="bg-white border border-gray-200 rounded p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-500">time</span>
                <span className="text-2xl font-light text-gray-900 ml-2">{formatTime(elapsedTime)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500">question</span>
                <span className="text-2xl font-light text-gray-900 ml-2">{currentQuestion + 1}/5</span>
              </div>
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white border border-gray-200 rounded p-8"
          >
            <div className="mb-6">
              <span className={`${getDifficultyColor(question.difficulty)} text-xs font-medium`}>
                {getDifficultyLabel(question.difficulty)}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">
                {question.ask_for_derivative_only ? (
                  <>f(x) = </>
                ) : (
                  <>find the derivative of:</>
                )}
              </p>
              <div 
                className="text-4xl font-light text-gray-900 mb-4 derivative-display"
                dangerouslySetInnerHTML={{ __html: question.expression }}
              />
              {question.ask_for_derivative_only ? (
                <p className="text-lg text-gray-900 mt-4">f'(x) = ?</p>
              ) : (
                <p className="text-sm text-gray-600">f'({question.evaluate_at}) = ?</p>
              )}
            </div>

            <div className="space-y-3">
              {question.ask_for_derivative_only ? (
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                  placeholder="enter derivative (e.g., 2·x + 3)"
                  className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:border-gray-500"
                  autoFocus
                />
              ) : (
                <input
                  type="number"
                  step="0.01"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                  placeholder="your answer"
                  className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:border-gray-500"
                  autoFocus
                />
              )}

              <button
                onClick={handleAnswerSubmit}
                disabled={!userAnswer}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'next question' : 'finish'}
              </button>
            </div>
          </motion.div>
        </div>

        <style>{`
          .derivative-display .fraction {
            display: inline-flex;
            flex-direction: column;
            vertical-align: middle;
            text-align: center;
            margin: 0 0.2em;
          }
          .derivative-display .numerator {
            border-bottom: 1px solid #111827;
            padding: 0 0.5em 0.1em;
          }
          .derivative-display .denominator {
            padding: 0.1em 0.5em 0;
          }
        `}</style>
      </div>
    );
  }

  if (phase === 'results' && results) {
    const allCorrect = results.correct_count === 5;
    
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            ← back
          </button>

          <div className="bg-white border border-gray-200 rounded p-8">
            <h1 className="text-2xl font-medium text-gray-900 mb-6">
              {allCorrect ? 'perfect score!' : 'time trial complete'}
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-500 mb-1">time</p>
                <p className="text-3xl font-light text-gray-900">{formatTime(results.time_taken)}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-500 mb-1">correct</p>
                <p className="text-3xl font-light text-gray-900">
                  {results.correct_count}/5
                </p>
              </div>
            </div>

            {allCorrect && results.is_new_record && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
                <p className="text-sm text-yellow-900 font-medium">new personal record!</p>
              </div>
            )}

            {allCorrect && !results.is_new_record && results.previous_best && (
              <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">personal best</p>
                <p className="text-lg font-light text-gray-900">{formatTime(results.previous_best)}</p>
              </div>
            )}

            {!allCorrect && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                <p className="text-sm text-red-900">
                  answer all questions correctly to save your time
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => {
                  setPhase('ready');
                  setResults(null);
                  setUserAnswer('');
                  setElapsedTime(0);
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded text-sm font-medium w-full transition-colors"
              >
                try again
              </button>

              <button
                onClick={() => navigate('/leaderboard')}
                className="bg-white border border-gray-300 hover:border-gray-400 text-gray-900 px-6 py-3 rounded text-sm font-medium w-full transition-colors"
              >
                view leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
