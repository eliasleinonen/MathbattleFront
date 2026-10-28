import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeatMap from '@uiw/react-heat-map';
import api from '../api';
import Seo, { SITE_URL } from '../components/Seo';
import LoadingSpinner from '../components/LoadingSpinner';
import { buildActivityHeatmapValues, heatmapRangeFromToday, ACTIVITY_PANEL_COLORS } from '../utils/activityHeatmap';

export const dailyChallengeFaqs = [
  {
    question: 'What is the Daily Derivative challenge?',
    answer:
      'The Daily Derivative is a free daily calculus puzzle where players solve a new derivative of the day every day and compete on a global speed leaderboard.',
  },
  {
    question: 'When does the daily derivative reset?',
    answer: 'A new calculus derivative challenge is released every day at 00:00 UTC.',
  },
  {
    question: 'Can I play the Daily Derivative without an account?',
    answer:
      'Yes! Anyone can play and solve today\'s challenge instantly as a guest without creating an account or logging in. You can optionally sign in with Google to save your streak and post your score to the leaderboard.',
  },
  {
    question: 'What types of daily derivative problems are featured?',
    answer:
      'Our daily derivative problems range from Speed Run polynomials on Mondays to Chain Rule and Product Rule challenges later in the week. Practicing daily derivatives helps reinforce calculus differentiation rules through consistent, bite-sized daily calculus practice.',
  },
  {
    question: 'How do I enter mathematical answers?',
    answer:
      'Use standard math notation: ^ for exponents (e.g. 3*x^2), * for multiplication, and common functions like sin(x), cos(x), ln(x), and exp(x).',
  },
];

export const dailyChallengeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Daily Derivative Challenge',
    url: `${SITE_URL}/daily-challenge`,
    applicationCategory: 'EducationalGame',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Play today\'s Daily Derivative! Free daily calculus puzzle with instant feedback, streak tracking, and global speed leaderboard. No sign-in or download required.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dailyChallengeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Daily Derivative',
        item: `${SITE_URL}/daily-challenge`,
      },
    ],
  },
];

const dailyChallengeSeo = (
  <Seo
    title="Daily Derivative — Play Today's Calculus Puzzle Free Online"
    description="Play today's Daily Derivative! Free daily calculus puzzle with instant feedback, streak tracking, and global speed leaderboard. No sign-in or download required."
    path="/daily-challenge"
    jsonLd={dailyChallengeJsonLd}
  />
);

export const getDifficultyMeta = (difficulty, category) => {
  const diff = String(difficulty || 'medium').toLowerCase();
  if (diff === 'easy') {
    return {
      label: 'Easy',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dotClass: 'bg-emerald-500',
      category: category || 'Speed Run',
    };
  }
  if (diff === 'hard') {
    return {
      label: 'Hard',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dotClass: 'bg-rose-500',
      category: category || 'Product Rule',
    };
  }
  return {
    label: 'Medium',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500',
    category: category || 'Chain Rule',
  };
};

export function DifficultyBadge({ difficulty, category, className = '' }) {
  const meta = getDifficultyMeta(difficulty, category);
  return (
    <span
      data-testid="difficulty-badge"
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border ${meta.badgeClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      <span>{meta.label}</span>
      {meta.category && (
        <>
          <span className="opacity-40">•</span>
          <span className="font-normal">{meta.category}</span>
        </>
      )}
    </span>
  );
}

export default function DailyChallenge() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

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
  const [shareCopied, setShareCopied] = useState(false);
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
        if (res.data?.date) {
          setTodayStr(res.data.date);
        }
      } catch (e) {
        console.warn('Failed to fetch server time, using local time:', e.message);
      }
    };
    fetchServerTime();
  }, []);

  // Timer while playing
  useEffect(() => {
    if (phase === 'playing' && startTime) {
      const interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [phase, startTime]);

  // Auto-focus input when entering playing phase
  useEffect(() => {
    if (phase === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

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
      api.get('/daily-challenge/history'),
    ]);

    if (challengeRes.status === 'fulfilled') {
      setTodayChallenge(challengeRes.value.data);
    } else {
      console.error('Failed to load today\'s challenge:', challengeRes.reason);
    }

    if (leaderboardRes.status === 'fulfilled') {
      let leaderboardData = [];
      if (Array.isArray(leaderboardRes.value.data)) {
        leaderboardData = leaderboardRes.value.data;
      } else if (leaderboardRes.value.data && leaderboardRes.value.data.top_times) {
        leaderboardData = leaderboardRes.value.data.top_times;
      }
      setLeaderboard(leaderboardData);
    }

    if (historyRes.status === 'fulfilled') {
      let history = [];
      let userCompletionsData = {};
      if (Array.isArray(historyRes.value.data)) {
        history = historyRes.value.data;
      } else if (historyRes.value.data && typeof historyRes.value.data === 'object') {
        history = historyRes.value.data.challenges || historyRes.value.data.history || [];
        userCompletionsData = historyRes.value.data.user_completions || {};
      }
      setPastChallenges(history);

      const completionMap = {};
      if (userCompletionsData && typeof userCompletionsData === 'object') {
        Object.keys(userCompletionsData).forEach((date) => {
          const completion = userCompletionsData[date];
          completionMap[date] = {
            time: completion.time || completion.your_time,
            rank: completion.rank,
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
    setErrorMessage('');

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

    try {
      const response = await api.post('/daily-challenge/submit', {
        answer: normalizedAnswer,
        time: timeTaken,
      });

      if (response.data.correct) {
        setErrorMessage('');
        setResults({
          ...response.data,
          difficulty: todayChallenge?.difficulty,
          category: todayChallenge?.category,
        });
        setPhase('results');
        loadDailyChallenge();
      } else {
        setErrorMessage('wrong answer');
      }
    } catch (error) {
      setErrorMessage('wrong answer');
    }
  };

  const formatTime = (seconds) => {
    if (seconds == null) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
  };

  const handleShare = (time, rank, difficulty, category) => {
    const t = time ?? results?.time_taken ?? todayChallenge?.user_time;
    const r = rank ?? results?.rank ?? todayChallenge?.user_rank;
    const diff = difficulty ?? results?.difficulty ?? todayChallenge?.difficulty;
    const cat = category ?? results?.category ?? todayChallenge?.category;
    const formattedT = t != null ? formatTime(t) : '';
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let diffLine = '';
    if (diff) {
      const meta = getDifficultyMeta(diff, cat);
      const icon = String(diff).toLowerCase() === 'hard' ? '🔥' : String(diff).toLowerCase() === 'easy' ? '⚡' : '📐';
      diffLine = `${icon} ${meta.label} (${meta.category})`;
    }

    const text = [
      `Daily Derivative — ${dateFormatted} 📐`,
      diffLine,
      formattedT ? `⏱️ Time: ${formattedT}${r ? ` (Rank #${r})` : ''}` : '',
      'Play: https://www.mathbattle.xyz/daily-challenge',
    ]
      .filter(Boolean)
      .join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2500);
        })
        .catch(() => {});
    }
  };

  const handleInsertSymbol = (symbol) => {
    setUserAnswer((prev) => prev + symbol);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const heatMapValue = buildActivityHeatmapValues(pastChallenges, userCompletions, todayStr, 12);
  const { startDate: heatMapStart, endDate: heatMapEnd } = heatmapRangeFromToday(todayStr, 12);

  const renderCalendar = () => {
    // In SSR (Node.js), HeatMap cannot render to string; render static placeholder instead
    if (typeof window === 'undefined') {
      return (
        <div className="bg-white border border-gray-200 rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activity Calendar</h3>
            <span className="text-xs text-gray-500 font-mono">Past 1 Year</span>
          </div>
          <p className="text-sm text-gray-500 font-mono">
            Solve the daily challenge to build your streak and fill your activity calendar.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
          <span className="text-xs text-gray-500 font-mono">Past 1 Year</span>
        </div>
        <div className="activity-heatmap-container overflow-x-auto w-full">
          <HeatMap
            value={heatMapValue}
            startDate={heatMapStart}
            endDate={heatMapEnd}
            rectSize={15}
            space={4}
            legendCellSize={0}
            panelColors={ACTIVITY_PANEL_COLORS}
            weekLabels={false}
            rectProps={{ rx: 2 }}
            rectRender={(props, data) => {
              const status = data.status || 'not-completed';
              const completion = data.completion;
              const isCompleted = data.count === 1;
              const isWinner = data.count === 2;

              const fillColor = isWinner
                ? '#facc15'
                : isCompleted
                ? '#22c55e'
                : '#ebedf0';

              const titleParts = [String(data.date || '').replaceAll('/', '-')];
              if (data.challenge) {
                titleParts.push('challenge available');
              }
              if (completion?.time != null) {
                titleParts.push(`your time ${formatTime(completion.time)}`);
              }
              if (status === 'winner') {
                titleParts.push('you placed #1');
              }
              return (
                <rect {...props} fill={fillColor} data-status={status}>
                  <title>{titleParts.filter(Boolean).join(' · ')}</title>
                </rect>
              );
            }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: ACTIVITY_PANEL_COLORS[0] }} />
            <span>Not completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: ACTIVITY_PANEL_COLORS[1] }} />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: ACTIVITY_PANEL_COLORS[2] }} />
            <span>Winner</span>
          </div>
        </div>
      </div>
    );
  };

  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {dailyChallengeSeo}
        <motion.div
          key={countdown}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="text-gray-900 text-9xl font-light font-mono"
        >
          {countdown}
        </motion.div>
      </div>
    );
  }

  if (phase === 'playing' && todayChallenge) {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
        {dailyChallengeSeo}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-500 font-mono">time</span>
                <span className="text-2xl font-light font-mono text-gray-900 ml-2">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <DifficultyBadge
                  difficulty={todayChallenge.difficulty}
                  category={todayChallenge.category}
                />
                <div>
                  <span className="text-xs text-gray-500 font-mono hidden sm:inline">daily derivative</span>
                  <span className="text-sm font-medium text-gray-900 ml-2 font-mono">
                    {new Date(todayChallenge.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white border border-gray-200 rounded p-6 sm:p-8"
          >
            <div className="mb-6">
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
                Find the derivative
              </p>
              <div
                className="text-3xl sm:text-4xl font-light text-gray-900 mb-2 py-2"
                dangerouslySetInnerHTML={{ __html: todayChallenge.expression }}
              />
              <p className="text-lg text-gray-800 font-mono">f'(x) = ?</p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                  placeholder="e.g. 6*x^2 - 4*sin(x)"
                  className="w-full p-4 border border-gray-300 rounded text-lg font-mono focus:outline-none focus:border-gray-900"
                  autoFocus
                />
                {/* Mobile math quick-key helper toolbar */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['x', '^', '2', 'sin(', 'cos(', 'tan(', 'ln(', 'e^', '+', '-', '*', '/'].map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => handleInsertSymbol(symbol)}
                      className="px-2.5 py-1 text-xs font-mono bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 rounded border border-gray-200 transition-colors"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAnswerSubmit}
                disabled={!userAnswer.trim()}
                className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white py-3.5 rounded font-medium transition-colors text-base"
              >
                Submit Answer
              </button>
              {errorMessage && (
                <p className="text-sm text-red-600 text-center font-mono">{errorMessage}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && results) {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-gray-50 flex items-center justify-center">
        {dailyChallengeSeo}
        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm text-center"
          >
            {results.correct ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-mono font-bold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    CORRECT
                  </div>
                  <DifficultyBadge
                    difficulty={results.difficulty || todayChallenge?.difficulty}
                    category={results.category || todayChallenge?.category}
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-900 tracking-tight mb-6">
                  Great solve!
                </h1>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Time
                    </span>
                    <span className="text-2xl sm:text-3xl font-light font-mono text-gray-900 tabular-nums">
                      {formatTime(results.time_taken)}
                    </span>
                    {results.is_fastest ? (
                      <span className="inline-block mt-1 text-[11px] font-mono text-amber-600 font-medium">
                        ⚡ Fastest today!
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-[11px] font-mono text-gray-400">
                        1st attempt
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Rank
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl sm:text-3xl font-light font-mono text-gray-900">
                        #{results.rank}
                      </span>
                      {results.rank === 1 ? '🥇' : results.rank === 2 ? '🥈' : results.rank === 3 ? '🥉' : null}
                    </div>
                    <span className="inline-block mt-1 text-[11px] font-mono text-gray-500">
                      Your rank today: #{results.rank}
                    </span>
                  </div>
                </div>

                {/* Wordle-style Share Result Button */}
                <button
                  onClick={() => handleShare(results.time_taken, results.rank)}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-mono text-sm font-medium transition-all shadow-sm active:scale-[0.99] mb-6 ${
                    shareCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  {shareCopied ? '✓ Copied to clipboard!' : '📋 Share Result'}
                </button>

                {/* Guest Conversion Card */}
                {!isLoggedIn && (
                  <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl p-5 mb-6 text-left">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-900">
                        Save your streak & claim your username!
                      </span>
                      <span className="text-[11px] font-mono text-orange-600 bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        🔥 Streak
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      You completed today's puzzle as a guest. Sign in with Google to permanently link this solve to your profile and appear on the global leaderboard.
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 text-xs font-medium border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-all font-sans"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>Sign in with Google →</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold tracking-wider uppercase">
                    INCORRECT
                  </div>
                  <DifficultyBadge
                    difficulty={results.difficulty || todayChallenge?.difficulty}
                    category={results.category || todayChallenge?.category}
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-900 tracking-tight mb-4">
                  Not quite today!
                </h1>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">
                    The correct derivative was:
                  </span>
                  <div
                    className="text-xl sm:text-2xl font-light font-mono text-gray-900 py-1"
                    dangerouslySetInnerHTML={{ __html: results.correct_answer }}
                  />
                </div>
              </>
            )}

            <div>
              <button
                onClick={() => setPhase('overview')}
                className="text-xs font-mono text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1 py-1 underline"
              >
                ← Back to Daily Overview
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Overview page (rendered during both client browsing and build-time SSR prerendering)
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 text-gray-900">
      {dailyChallengeSeo}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-mono text-gray-500 hover:text-gray-900 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white shadow-xs transition-all"
            >
              ← <span className="hidden sm:inline">Home</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Daily Derivative Challenge
              </h1>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                New puzzle every day at 00:00 UTC • Compete globally
              </p>
            </div>
          </div>
          <Link
            to="/how-to-derivate"
            className="text-xs font-mono text-gray-500 hover:text-gray-900 underline hidden sm:inline"
          >
            Differentiation Guide →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Challenge Card */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Challenge</h2>

            {typeof window === 'undefined' ? (
              // Build-time SSR content for web crawlers
              <div className="py-2">
                <p className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono inline-block mb-3">
                  New puzzle every day at 00:00 UTC
                </p>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Every day at midnight UTC, a new mathematical function is posted. Everyone receives the same derivative problem.
                  Differentiate f(x) as fast as you can to rank on the global leaderboard.
                </p>
                <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded font-medium text-sm">
                  Start Challenge
                </div>
              </div>
            ) : loading ? (
              <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                <LoadingSpinner size="md" />
                <span className="text-sm mt-3 font-mono">Loading today's derivative...</span>
              </div>
            ) : todayChallenge ? (
              todayChallenge.user_completed ? (
                <div className="text-center py-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold uppercase tracking-wider">
                      ✓ Completed Today
                    </div>
                    <DifficultyBadge
                      difficulty={todayChallenge.difficulty}
                      category={todayChallenge.category}
                    />
                  </div>
                  <p className="text-gray-600 mb-2 text-sm">You've completed today's daily challenge!</p>
                  <p className="text-3xl font-light font-mono text-gray-900 mb-2">
                    {formatTime(todayChallenge.user_time)}
                  </p>
                  <p className="text-sm text-gray-600 font-mono mb-4">Your rank: #{todayChallenge.user_rank}</p>

                  <div className="flex flex-wrap gap-3 justify-center mb-4">
                    <button
                      onClick={() => handleShare(todayChallenge.user_time, todayChallenge.user_rank)}
                      className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 px-5 py-2 rounded text-xs font-mono transition-colors shadow-sm"
                    >
                      {shareCopied ? '✓ Copied to clipboard!' : '📋 Share Result'}
                    </button>
                  </div>

                  {!isLoggedIn && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-left">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Playing as a guest</p>
                      <p className="text-xs text-blue-800 mb-3 leading-relaxed">
                        Sign in to save your daily streak across devices and claim your username on the leaderboard.
                      </p>
                      <button
                        onClick={() => navigate('/login')}
                        className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors"
                      >
                        Sign in to save streak →
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-4 font-mono">A new challenge drops at midnight UTC!</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <p className="text-gray-900 text-sm font-semibold">
                      {new Date(todayChallenge.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      <DifficultyBadge
                        difficulty={todayChallenge.difficulty}
                        category={todayChallenge.category}
                      />
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                        1 attempt per day
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50/80 p-4 rounded-xl mb-5 border border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <span className="text-gray-600">
                      Topic: <strong className="text-gray-900 font-semibold">{getDifficultyMeta(todayChallenge.difficulty, todayChallenge.category).category}</strong>
                    </span>
                    {!isLoggedIn && (
                      <span className="text-blue-600">
                        Playing as guest • Instant play without sign-in
                      </span>
                    )}
                  </div>
                  <button
                    onClick={startChallenge}
                    className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-medium transition-all w-full text-base shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Start Challenge</span>
                    <span className="text-gray-400 font-mono text-sm">→</span>
                  </button>
                </>
              )
            ) : (
              <p className="text-gray-600 py-8 text-center font-mono text-sm">No challenge available today</p>
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
                      <span
                        className={`text-sm font-mono font-medium ${
                          index === 0
                            ? 'text-yellow-600'
                            : index === 1
                            ? 'text-gray-400'
                            : index === 2
                            ? 'text-orange-600'
                            : 'text-gray-600'
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-900 truncate max-w-[140px]">
                        {entry.username || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-mono">{formatTime(entry.time)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4 font-mono">
                {loading && typeof window !== 'undefined' ? 'Loading top times...' : 'No completions yet today'}
              </p>
            )}
          </div>
        </div>

        {/* Activity Calendar */}
        <div key={JSON.stringify(userCompletions)} className="mb-8">
          {renderCalendar()}
        </div>

        {/* How It Works Section */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-8">
          <div className="max-w-3xl mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How the Daily Derivative Works</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              The Daily Derivative is a daily calculus puzzle designed to build rapid differentiation mastery. Solve the derivative of the day every day at 00:00 UTC across various difficulty tiers, build your streak, and climb the daily global speed leaderboard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 border border-gray-100 rounded p-4">
              <span className="text-xs font-mono text-gray-500 font-semibold block mb-1">01 / DAILY FUNCTION</span>
              <p className="font-medium text-gray-900 mb-1">Derivative of the Day</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                A new function f(x) is released every day at 00:00 UTC. Everyone across the world receives the exact same daily derivative problem.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded p-4">
              <span className="text-xs font-mono text-gray-500 font-semibold block mb-1">02 / SPEED & ACCURACY</span>
              <p className="font-medium text-gray-900 mb-1">Beat the Clock</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                Calculate the derivative f'(x) and enter your solution. Your timer starts when you reveal the function.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded p-4">
              <span className="text-xs font-mono text-gray-500 font-semibold block mb-1">03 / GLOBAL RANKINGS</span>
              <p className="font-medium text-gray-900 mb-1">Climb the Leaderboard</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                Compare your solve time with students worldwide. Build your daily streak and master calculus differentiation.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
            <span>Need a refresher on differentiation rules?</span>
            <Link to="/how-to-derivate" className="text-gray-900 font-medium underline hover:text-gray-600">
              Read the Derivative Guide →
            </Link>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white border border-gray-200 rounded p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {dailyChallengeFaqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{faq.question}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
