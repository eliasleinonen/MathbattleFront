import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

export default function SetUsername() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('username required');
      return;
    }

    if (username.length < 3) {
      setError('username must be at least 3 characters');
      return;
    }

    if (username.length > 20) {
      setError('username must be less than 20 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/user/set-username', { username: username.trim() });

      // Check if there's a pending match code
      const pendingMatchCode = localStorage.getItem('pendingMatchCode');
      if (pendingMatchCode) {
        navigate('/play/friend');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'failed to set username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white border border-gray-300 rounded p-12 max-w-md w-full">
        <h1 className="text-2xl font-medium text-gray-800 mb-2 text-center">
          choose username (optional)
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          set a username to track your stats and appear on the leaderboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
            autoFocus
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm py-3 px-4 rounded transition-colors"
          >
            {loading ? 'saving...' : 'continue'}
          </button>

          <button
            type="button"
            onClick={() => {
              const pendingMatchCode = localStorage.getItem('pendingMatchCode');
              if (pendingMatchCode) {
                navigate('/play/friend');
              } else {
                navigate('/');
              }
            }}
            disabled={loading}
            className="w-full border border-gray-300 hover:border-gray-900 disabled:border-gray-200 text-gray-700 text-sm py-3 px-4 rounded transition-colors"
          >
            skip - play as guest
          </button>
        </form>
      </div>
    </div>
  );
}
