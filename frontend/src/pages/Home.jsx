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
      setChallengeError('Failed to accept challenge');
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

      <div className="relative z-10 border-t border-gray-200/80 bg-[#f2f3f0]/90 px-5 py-12 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-sm text-gray-600 leading-relaxed space-y-2">
            <p>
              Derivative Duel is a competitive math game: solve derivatives fast, earn ELO, and climb the{' '}
              <button type="button" onClick={() => navigate('/leaderboard')} className="text-gray-900 underline hover:text-gray-600">
                leaderboard
              </button>
              .
            </p>
            <p>
              Play{' '}
              <button type="button" onClick={() => navigate('/play/random')} className="text-gray-900 underline hover:text-gray-600">
                random matches
              </button>{' '}
              or{' '}
              <button type="button" onClick={() => navigate('/play/friend')} className="text-gray-900 underline hover:text-gray-600">
                challenge friends
              </button>
              ; need a refresher? Open the{' '}
              <button type="button" onClick={() => navigate('/how-to-derivate')} className="text-gray-900 underline hover:text-gray-600">
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
            <div className="border border-gray-300 bg-white/70 p-5 mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">pending challenges</h3>
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.match_id}
                    className="flex justify-between items-center gap-3 p-3 border border-gray-200"
                  >
                    <div>
                      <p className="text-sm text-gray-900">{challenge.challenger}</p>
                      <p className="text-xs text-gray-500">wants to challenge you</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => acceptChallenge(challenge.match_id, challenge.match_code)}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-sm py-2 px-4 rounded transition-colors"
                    >
                      accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="font-sans text-xl font-bold text-gray-900 mb-4">Game Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/play/random')}
              className="bg-white/80 border border-gray-300 hover:border-gray-500 p-5 text-left transition-colors"
            >
              <h3 className="font-sans text-lg font-medium text-gray-900 mb-1">play random</h3>
              <p className="text-sm text-gray-500">match with opponent</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/play/friend')}
              className="bg-white/80 border border-gray-300 hover:border-gray-500 p-5 text-left transition-colors"
            >
              <h3 className="font-sans text-lg font-medium text-gray-900 mb-1">play friend</h3>
              <p className="text-sm text-gray-500">challenge someone</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/daily-challenge')}
              className="bg-white/80 border border-gray-300 hover:border-gray-500 p-5 text-left transition-colors md:col-span-2"
            >
              <h3 className="font-sans text-lg font-medium text-gray-900 mb-1">daily challenge</h3>
              <p className="text-sm text-gray-500">one derivative puzzle every day - compete for the fastest time</p>
            </button>
          </div>

          <div className="mt-10 border-t border-gray-300 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">rules</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>solve derivative problems</li>
              <li>first to 3 rounds wins</li>
              <li>elo changes based on results</li>
              <li>harder questions at higher elo</li>
              <li className="mt-3">
                <button
                  type="button"
                  onClick={() => navigate('/how-to-derivate')}
                  className="text-gray-900 hover:text-gray-600 underline"
                >
                  how to derivate →
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-gray-600 pb-8">
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
