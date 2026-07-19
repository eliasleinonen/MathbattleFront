import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import TermsAndPrivacy from '../components/TermsAndPrivacy';

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [userData, setUserData] = useState({
    name: 'Guest Player',
    elo: 1000,
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
            elo: res.data.elo,
            wins: res.data.wins,
            losses: res.data.losses,
          });

          // Username is now optional - users can play as guests

          // Fetch pending challenges
          const challengesRes = await api.get('/challenges/pending');
          setChallenges(challengesRes.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setIsLoggedIn(false);
        }
      }
    };

    fetchUserData();

    // Poll for new challenges every 5 seconds
    const interval = setInterval(() => {
      if (localStorage.getItem('token')) {
        api.get('/challenges/pending')
          .then(res => setChallenges(res.data))
          .catch(() => { });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const acceptChallenge = async (matchId, matchCode) => {
    try {
      await api.post(`/challenges/accept/${matchId}`);
      navigate(`/game/${matchCode}`);
    } catch (error) {
      console.error('Failed to accept challenge:', error);
      alert('Failed to accept challenge');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <nav className="flex justify-between items-center mb-16">
        <h1
          aria-label="derivative duel"
          className="text-3xl font-medium text-gray-900 select-none"
        >
          &#8706;
        </h1>
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/leaderboard')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            leaderboard
          </button>
          {!isLoggedIn && (
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              login
            </button>
          )}
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">{userData.name}</p>
                <p className="text-sm text-gray-700">{userData.elo}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded px-3 py-1 transition-colors"
              >
                logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto">
        {/* SEO Content Section - Hidden on mobile */}
        <div className="mb-12 hidden md:block">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Competitive derivative battles</h2>
          <p className="text-gray-600 mb-3">
            Derivative Duel is a competitive math game: solve derivatives fast, earn ELO, and climb the <button onClick={() => navigate('/leaderboard')} className="text-gray-900 hover:text-gray-600 underline">leaderboard</button>.
          </p>
          <p className="text-gray-600">
            Play <button onClick={() => navigate('/play/random')} className="text-gray-900 hover:text-gray-600 underline">random matches</button> or <button onClick={() => navigate('/play/friend')} className="text-gray-900 hover:text-gray-600 underline">challenge friends</button>; each duel drills core differentiation rules. Need a refresher? Open the <button onClick={() => navigate('/how-to-derivate')} className="text-gray-900 hover:text-gray-600 underline">derivative guide</button>.
          </p>
        </div>

        {challenges.length > 0 && (
          <div className="bg-white border border-gray-200 rounded p-6 mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">pending challenges</h3>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.match_id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded"
                >
                  <div>
                    <p className="text-sm text-gray-900">{challenge.challenger}</p>
                    <p className="text-xs text-gray-500">wants to challenge you</p>
                  </div>
                  <button
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

        {isLoggedIn && (
          <div className="bg-white border border-gray-200 rounded p-6 mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h2>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-2xl font-light text-gray-900">{userData.elo}</p>
                <p className="text-xs text-gray-500 mt-1">elo</p>
              </div>
              <div>
                <p className="text-2xl font-light text-gray-900">{userData.wins}</p>
                <p className="text-xs text-gray-500 mt-1">wins</p>
              </div>
              <div>
                <p className="text-2xl font-light text-gray-900">{userData.losses}</p>
                <p className="text-xs text-gray-500 mt-1">losses</p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/play/random')}
            className="bg-white border border-gray-300 hover:border-gray-400 p-6 rounded text-left transition-colors"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-1">play random</h3>
            <p className="text-sm text-gray-500">match with opponent</p>
          </button>

          <button
            onClick={() => navigate('/play/friend')}
            className="bg-white border border-gray-300 hover:border-gray-400 p-6 rounded text-left transition-colors"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-1">play friend</h3>
            <p className="text-sm text-gray-500">challenge someone</p>
          </button>

          <button
            onClick={() => navigate('/daily-challenge')}
            className="bg-white border border-gray-300 hover:border-gray-400 p-6 rounded text-left transition-colors md:col-span-2"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-1">daily challenge</h3>
            <p className="text-sm text-gray-500">one derivative puzzle every day - compete for the fastest time</p>
          </button>
        </div>

        <div className="mt-12 bg-white border border-gray-200 rounded p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">rules</h3>
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li>solve derivative problems</li>
            <li>first to 3 rounds wins</li>
            <li>elo changes based on results</li>
            <li>harder questions at higher elo</li>
            <li className="mt-3">
              <button
                onClick={() => navigate('/how-to-derivate')}
                className="text-gray-900 hover:text-gray-600 underline"
              >
                how to derivate →
              </button>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-gray-600">
          <button onClick={() => navigate('/about')} className="underline hover:text-gray-900">About</button>
          <span>•</span>
          <button onClick={() => navigate('/faq')} className="underline hover:text-gray-900">FAQ</button>
          <span>•</span>
          <button onClick={() => navigate('/privacy-policy')} className="underline hover:text-gray-900">Privacy Policy</button>
        </div>
      </div>
      <TermsAndPrivacy />
    </div>
  );
}