import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import TermsAndPrivacy from '../components/TermsAndPrivacy';
import EloSquiggleGraph from '../components/EloSquiggleGraph';
import Seo, { SITE_URL, SITE_NAME } from '../components/Seo';
import { DEFAULT_ELO } from '../utils/eloSquiggle';

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description:
      'Competitive online math game where players battle by solving calculus derivative problems in real-time 1v1 matches.',
    genre: 'Educational',
    gamePlatform: 'Web browser',
    playMode: 'MultiPlayer',
    applicationCategory: 'Game',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [challengeError, setChallengeError] = useState('');
  const [userData, setUserData] = useState({
    name: 'Guest Player',
    elo: DEFAULT_ELO,
    wins: 0,
    losses: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        try {
          const res = await api.get('/user/profile');
          setUserData({
            name: res.data.username || res.data.name,
            elo: res.data.elo ?? DEFAULT_ELO,
            wins: res.data.wins,
            losses: res.data.losses,
          });

          const challengesRes = await api.get('/challenges/pending');
          setChallenges(challengesRes.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setIsLoggedIn(false);
          setUserData({
            name: 'Guest Player',
            elo: DEFAULT_ELO,
            wins: 0,
            losses: 0,
          });
        }
      }
    };

    fetchUserData();

    const interval = setInterval(() => {
      if (localStorage.getItem('token')) {
        api.get('/challenges/pending')
          .then((res) => setChallenges(res.data))
          .catch(() => {});
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const acceptChallenge = async (matchId, matchCode) => {
    setChallengeError('');
    try {
      await api.post(`/challenges/accept/${matchId}`);
      navigate(`/game/${matchCode}`);
    } catch (error) {
      console.error('Failed to accept challenge:', error);
      setChallengeError('Failed to accept challenge. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData({
      name: 'Guest Player',
      elo: DEFAULT_ELO,
      wins: 0,
      losses: 0,
    });
    setChallenges([]);
    navigate('/login');
  };

  const displayElo = userData.elo ?? DEFAULT_ELO;

  return (
    <div className="home-field min-h-screen text-[#111] font-mono">
      <Seo
        title="Derivative Duel - Competitive Calculus Math Game | Learn Derivatives Through 1v1 Battles"
        description="Battle opponents by solving calculus derivative problems in real-time. Challenge friends, improve your ELO rating, and master differentiation through fast-paced 1v1 matches."
        path="/"
        jsonLd={homeJsonLd}
      />

      <div className="relative min-h-[100svh] flex flex-col">
        <nav className="relative z-20 flex justify-between items-center gap-4 px-5 py-5 sm:px-8">
          <h1
            aria-label="derivative duel"
            className="text-3xl font-medium text-gray-900 select-none leading-none"
          >
            &#8706;
          </h1>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <button
              type="button"
              onClick={() => navigate('/leaderboard')}
              className="hover:text-gray-900"
            >
              leaderboard
            </button>
            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="hover:text-gray-900"
              >
                login
              </button>
            )}
            {isLoggedIn && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 hidden sm:inline">{userData.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded px-3 py-1 transition-colors"
                >
                  logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <EloSquiggleGraph
          elo={displayElo}
          className="pointer-events-none absolute inset-x-0 top-[10%] bottom-[38%] z-0 text-[#1a1a1a] opacity-90 home-elo-graph"
        />

        <div className="relative z-10 mt-auto px-5 pb-10 pt-16 sm:px-8 sm:pb-14 max-w-xl home-hero-copy">
          <h2 className="font-sans font-bold text-[clamp(2.4rem,7vw,3.75rem)] tracking-tight leading-[0.95] text-gray-900 mb-2">
            &#8706; Derivative Duel
          </h2>
          <p className="font-mono text-sm text-gray-700 mb-6 tabular-nums">
            elo {displayElo}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/play/random')}
              className="inline-flex items-center justify-center px-5 py-3 bg-gray-900 hover:bg-black text-white text-sm rounded transition-colors"
            >
              Play random
            </button>
            <button
              type="button"
              onClick={() => navigate('/play/friend')}
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 hover:border-gray-900 text-gray-900 text-sm rounded transition-colors bg-transparent"
            >
              Challenge friend
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-gray-200 bg-gray-50 px-5 py-12 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8 text-sm text-gray-600 leading-relaxed space-y-2">
            <p>
              Derivative Duel is a competitive math game: solve derivatives fast, earn ELO, and climb the{' '}
              <button type="button" onClick={() => navigate('/leaderboard')} className="text-gray-900 font-medium underline hover:text-gray-600">
                leaderboard
              </button>
              .
            </p>
            <p>
              Play{' '}
              <button type="button" onClick={() => navigate('/play/random')} className="text-gray-900 font-medium underline hover:text-gray-600">
                random matches
              </button>{' '}
              or{' '}
              <button type="button" onClick={() => navigate('/play/friend')} className="text-gray-900 font-medium underline hover:text-gray-600">
                challenge friends
              </button>
              ; need a refresher? Open the{' '}
              <button type="button" onClick={() => navigate('/how-to-derivate')} className="text-gray-900 font-medium underline hover:text-gray-600">
                derivative guide
              </button>
              .
            </p>
          </div>

          {challengeError && (
            <p className="text-sm text-red-600 mb-4" role="alert">
              {challengeError}
            </p>
          )}

          {challenges.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Pending Challenges</h3>
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.match_id}
                    className="flex justify-between items-center gap-3 p-3 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{challenge.challenger}</p>
                      <p className="text-xs text-gray-500">wants to challenge you</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => acceptChallenge(challenge.match_id, challenge.match_code)}
                      className="bg-gray-900 hover:bg-black text-white text-sm py-2 px-4 rounded transition-colors"
                    >
                      accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Game Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate('/play/random')}
              className="bg-white border border-gray-200 hover:border-gray-900 p-6 rounded-lg text-left transition-all shadow-sm hover:shadow-md group"
            >
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-black mb-1">Play Random</h3>
              <p className="text-sm text-gray-500">Match instantly with an online opponent</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/play/friend')}
              className="bg-white border border-gray-200 hover:border-gray-900 p-6 rounded-lg text-left transition-all shadow-sm hover:shadow-md group"
            >
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-black mb-1">Play Friend</h3>
              <p className="text-sm text-gray-500">Create room link or challenge by username</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/daily-challenge')}
              className="bg-white border border-gray-200 hover:border-gray-900 p-6 rounded-lg text-left transition-all shadow-sm hover:shadow-md group md:col-span-2"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-black">Daily Challenge</h3>
                <span className="text-[10px] bg-green-100 text-green-800 font-mono px-2 py-0.5 rounded">NEW PUZZLE EVERY DAY</span>
              </div>
              <p className="text-sm text-gray-500">One derivative problem every day — compete on the daily leaderboard for the fastest time</p>
            </button>
          </div>

          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Rules</h3>
            <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                Solve calculus derivative problems as quickly as possible.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                First player to reach 3 round wins takes the match.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                ELO rating adjusts dynamically after every match.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                Higher ELO unlocks more complex derivative functions.
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/how-to-derivate')}
                  className="text-gray-900 font-medium hover:text-gray-600 underline"
                >
                  how to derivate →
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-gray-600 pb-4">
            <button type="button" onClick={() => navigate('/about')} className="underline hover:text-gray-900">About</button>
            <span aria-hidden="true">•</span>
            <button type="button" onClick={() => navigate('/faq')} className="underline hover:text-gray-900">FAQ</button>
            <span aria-hidden="true">•</span>
            <button type="button" onClick={() => navigate('/privacy-policy')} className="underline hover:text-gray-900">Privacy Policy</button>
          </div>
        </div>
      </div>
      <TermsAndPrivacy />
    </div>
  );
}
