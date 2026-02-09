import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { gameAPI } from '../api';

export default function PlayFriend() {
  const navigate = useNavigate();
  const { matchCode: urlMatchCode } = useParams();
  const [mode, setMode] = useState(urlMatchCode ? 'join' : null); // null, 'create', 'search', 'join'
  const [matchCode, setMatchCode] = useState(urlMatchCode || '');
  const [generatedCode, setGeneratedCode] = useState('');
  const [createdMatchId, setCreatedMatchId] = useState('');
  const [pendingChallengeId, setPendingChallengeId] = useState(''); // Track pending challenges to cancel
  const [shareLink, setShareLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Cleanup: cancel pending challenge when component unmounts
  useEffect(() => {
    return () => {
      if (pendingChallengeId) {
        gameAPI.cancelChallenge(pendingChallengeId).catch(() => { });
      }
    };
  }, [pendingChallengeId]);

  useEffect(() => {
    // Anonymous play is now supported - no login required
    // If URL has a match code, auto-fill it
    if (urlMatchCode) {
      setMatchCode(urlMatchCode.toUpperCase());
      setMode('join');
    }
  }, [urlMatchCode]);

  // Poll for match status when waiting for opponent
  useEffect(() => {
    if (!generatedCode || !createdMatchId) return;

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/game/friend/status/${generatedCode}`);
        if (response.data.status === 'active') {
          // Match is ready, navigate to game
          navigate(`/game/${generatedCode}`);
        }
      } catch (error) {
        console.error('Failed to check match status:', error);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [generatedCode, createdMatchId, navigate]);

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get(`/users/search?username=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const createMatchWithLink = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/game/friend/create', {
        opponent_username: null
      });
      setGeneratedCode(response.data.match_code);
      setCreatedMatchId(response.data.match_id);
      // Always use production URL for share link
      setShareLink(`https://www.mathbattle.xyz/game/${response.data.match_code}`);
      setMode('create');
    } catch (error) {
      console.error('Failed to create match:', error);
      alert('Failed to create match. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const challengeUser = async (username) => {
    setIsLoading(true);
    try {
      const response = await api.post('/game/friend/create', {
        opponent_username: username
      });
      // Store the challenge ID to cancel if user navigates away
      setPendingChallengeId(response.data.match_id);
      setCreatedMatchId(response.data.match_id);
      setGeneratedCode(response.data.match_code);
      // Navigate directly to game since opponent is specified
      navigate(`/game/${response.data.match_code}`);
    } catch (error) {
      console.error('Failed to create match:', error);
      alert('Failed to challenge user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const joinMatchByCode = async (code) => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/game/friend/join', {
        match_code: code.toUpperCase()
      });
      navigate(`/game/${code.toUpperCase()}`);
    } catch (error) {
      console.error('Failed to join match:', error);
      alert(error.response?.data?.detail || 'Failed to join match. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const joinMatch = async () => {
    await joinMatchByCode(matchCode);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          ← back
        </button>

        <h1 className="text-2xl font-medium text-gray-800 mb-8">
          play with friend
        </h1>

        {!mode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={createMatchWithLink}
              disabled={isLoading}
              className="bg-white border border-gray-300 hover:border-gray-400 p-6 rounded text-left transition-colors"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-1">create match link</h2>
              <p className="text-sm text-gray-500">share link with anyone</p>
            </button>

            <button
              onClick={() => setMode('search')}
              className="bg-white border border-gray-300 hover:border-gray-400 p-6 rounded text-left transition-colors"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-1">challenge player</h2>
              <p className="text-sm text-gray-500">search by username</p>
            </button>

            <button
              onClick={() => setMode('join')}
              className="bg-white border border-gray-300 hover:border-gray-400 p-6 rounded text-left transition-colors md:col-span-2"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-1">join with code</h2>
              <p className="text-sm text-gray-500">enter match code</p>
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">match created</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">match code</p>
                <div className="bg-gray-50 border border-gray-300 rounded p-4 flex justify-between items-center">
                  <p className="text-2xl font-light text-gray-900 tracking-wider">
                    {generatedCode}
                  </p>
                  <button
                    onClick={() => copyToClipboard(generatedCode, 'code')}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {copiedCode ? 'copied' : 'copy'}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">share link</p>
                <div className="bg-gray-50 border border-gray-300 rounded p-3 flex justify-between items-center">
                  <p className="text-sm text-gray-700 truncate mr-2">
                    {shareLink}
                  </p>
                  <button
                    onClick={() => copyToClipboard(shareLink, 'link')}
                    className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
                  >
                    {copiedLink ? 'copied' : 'copy'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate(`/game/${generatedCode}`);
                }}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm py-3 rounded transition-colors"
              >
                waiting for opponent...
              </button>
            </div>
          </div>
        )}

        {mode === 'search' && (
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">search player</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded mb-4 text-gray-900 focus:outline-none focus:border-gray-900"
              placeholder="enter username..."
              autoFocus
            />

            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <button
                    key={user.username}
                    onClick={() => challengeUser(user.username)}
                    disabled={isLoading}
                    className="w-full flex justify-between items-center p-3 border border-gray-200 rounded hover:border-gray-400 transition-colors text-left"
                  >
                    <span className="text-sm text-gray-900">{user.username}</span>
                    <span className="text-sm text-gray-500">{user.elo} elo</span>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <p className="text-sm text-gray-500 text-center py-4">no players found</p>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">type to search</p>
            )}
          </div>
        )}

        {mode === 'join' && (
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">join match</h2>
            <input
              type="text"
              value={matchCode}
              onChange={(e) => setMatchCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && joinMatch()}
              className="w-full px-4 py-3 border border-gray-300 rounded mb-4 text-center text-lg text-gray-900 focus:outline-none focus:border-gray-900"
              placeholder="enter code"
              maxLength={6}
              autoFocus
            />
            <button
              onClick={joinMatch}
              disabled={!matchCode.trim() || isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm py-3 rounded transition-colors"
            >
              {isLoading ? 'joining...' : 'join match'}
            </button>
          </div>
        )}

        {mode && (
          <button
            onClick={() => {
              setMode(null);
              setMatchCode('');
              setSearchQuery('');
              setGeneratedCode('');
              setShareLink('');
            }}
            className="mt-4 text-sm text-gray-600 hover:text-gray-900"
          >
            ← back to options
          </button>
        )}

        <div className="mt-8 bg-white border border-gray-200 rounded p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">how it works</h3>
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li>create match link and share with anyone</li>
            <li>search and challenge players by username</li>
            <li>or join with a friend's code</li>
            <li>login optional - play as guest or sign in to track stats</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
