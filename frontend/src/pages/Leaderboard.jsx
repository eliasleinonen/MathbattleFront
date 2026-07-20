import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardAPI } from '../api';
import Seo from '../components/Seo';

const leaderboardSeo = (
  <Seo
    title="Leaderboard - Top Players | Derivative Duel"
    description="See the top-rated Derivative Duel players ranked by ELO and the fastest daily challenge solvers. Play matches to climb the leaderboard."
    path="/leaderboard"
  />
);

export default function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('elo'); // 'elo' or 'time-trial'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardAPI.getLeaderboard();
        setPlayers(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const formatTime = (seconds) => {
    if (seconds == null) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
  };

  const timeTrialPlayers = players
    .filter(p => p.time_trial_best !== null && p.time_trial_best !== undefined)
    .sort((a, b) => a.time_trial_best - b.time_trial_best);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {leaderboardSeo}
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {leaderboardSeo}
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          ← back
        </button>

        <h1 className="text-2xl font-medium text-gray-800 mb-8">
          leaderboard
        </h1>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('elo')}
            className={`px-6 py-2 rounded-t text-sm font-medium transition-colors ${
              activeTab === 'elo'
                ? 'bg-white border-t border-l border-r border-gray-200 text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            ELO Ranking
          </button>
          <button
            onClick={() => setActiveTab('time-trial')}
            className={`px-6 py-2 rounded-t text-sm font-medium transition-colors ${
              activeTab === 'time-trial'
                ? 'bg-white border-t border-l border-r border-gray-200 text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            time trial
          </button>
        </div>

        {activeTab === 'elo' && (
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">rank</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">player</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500">elo</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500">wins</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500">losses</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500">rate</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => {
                  const total = player.wins + player.losses;
                  const winRate = total > 0 ? ((player.wins / total) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <tr
                      key={player.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {player.username || 'Anonymous'}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-900">
                        {player.elo}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-900">
                        {player.wins}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-900">
                        {player.losses}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {winRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'time-trial' && (
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">rank</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">player</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500">time</th>
                </tr>
              </thead>
              <tbody>
                {timeTrialPlayers.map((player, index) => {
                  return (
                    <tr
                      key={player.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {player.username || 'Anonymous'}
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-mono text-gray-900">
                        {formatTime(player.time_trial_best)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {timeTrialPlayers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">no time trial records yet</p>
                <button
                  onClick={() => navigate('/daily-challenge')}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-900"
                >
                  play daily challenge →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'elo' && players.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">no players yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
