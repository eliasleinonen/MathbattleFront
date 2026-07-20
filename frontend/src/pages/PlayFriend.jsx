import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { gameAPI } from '../api';
import Seo from '../components/Seo';

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
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cleanup: cancel pending challenge when component unmounts
  useEffect(() => {
    return () => {
      if (pendingChallengeId) {
        gameAPI.cancelChallenge(pendingChallengeId).catch(() => { });
      }
    };
  }, [pendingChallengeId]);

  useEffect(() => {
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
    setErrorMsg('');
    try {
      const response = await api.post('/game/friend/create', {
        opponent_username: null
      });
      setGeneratedCode(response.data.match_code);
      setCreatedMatchId(response.data.match_id);
      const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://www.mathbattle.xyz';
      setShareLink(`${origin}/game/${response.data.match_code}`);
      setMode('create');
    } catch (error) {
      console.error('Failed to create match:', error);
      setErrorMsg('Failed to create match. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const challengeUser = async (username) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/game/friend/create', {
        opponent_username: username
      });
      setGeneratedCode(response.data.match_code);
      setCreatedMatchId(response.data.match_id);
      setPendingChallengeId(response.data.match_id);
      setMode('create');
    } catch (error) {
      console.error('Failed to challenge user:', error);
      setErrorMsg(error.response?.data?.detail || 'Failed to challenge user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const joinMatchByCode = async (code) => {
    if (!code || !code.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    const cleanCode = code.trim().toUpperCase();

    try {
      const response = await api.post('/game/friend/join', {
        match_code: cleanCode
      });
      navigate(`/game/${cleanCode}`);
    } catch (error) {
      console.error('Failed to join match:', error);
      if (error.response?.data?.detail === 'Cannot join your own match') {
        navigate(`/game/${cleanCode}`);
      } else {
        setErrorMsg(error.response?.data?.detail || 'Failed to join match. Please check the code.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const joinMatch = async () => {
    await joinMatchByCode(matchCode);
  };

  const copyToClipboard = (text, type) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <Seo
        title="Challenge a Friend - Private Derivative Duel | Derivative Duel"
        description="Create a private match and challenge a friend to a calculus derivative battle. Share a link or match code and see who differentiates faster."
        path="/play/friend"
      />
      <div className="max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-1 transition-colors"
        >
          ← back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">
            Play with Friend
          </h1>
          <p className="text-sm text-gray-600">
            Create a private 1v1 calculus battle or join with a room code.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm text-center">
            {errorMsg}
          </div>
        )}

        {!mode && (
          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={createMatchWithLink}
              disabled={isLoading}
              className="bg-white border border-gray-200 hover:border-gray-900 p-6 rounded-lg text-left transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-medium text-gray-900 group-hover:text-black">Create Match Link</h2>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">LINK</span>
              </div>
              <p className="text-sm text-gray-500">Generate a unique invite link and share with anyone</p>
            </button>

            <button
              type="button"
              onClick={() => setMode('search')}
              className="bg-white border border-gray-200 hover:border-gray-900 p-6 rounded-lg text-left transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-medium text-gray-900 group-hover:text-black">Challenge Player</h2>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">DIRECT</span>
              </div>
              <p className="text-sm text-gray-500">Search registered players by username</p>
            </button>

            <button
              type="button"
              onClick={() => setMode('join')}
              className="bg-white border border-gray-200 hover:border-gray-900 p-6 rounded-lg text-left transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-medium text-gray-900 group-hover:text-black">Join with Code</h2>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">ROOM CODE</span>
              </div>
              <p className="text-sm text-gray-500">Enter a 6-character match code from a friend</p>
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Match Created</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">MATCH CODE</p>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 flex justify-between items-center">
                  <p className="text-2xl font-mono text-gray-900 tracking-widest font-semibold">
                    {generatedCode}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedCode, 'code')}
                    className="text-xs font-mono bg-white border border-gray-300 hover:border-gray-900 text-gray-900 px-3 py-1.5 rounded transition-colors"
                  >
                    {copiedCode ? '✓ COPIED' : 'COPY CODE'}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">SHARE LINK</p>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex justify-between items-center gap-2">
                  <p className="text-xs font-mono text-gray-700 truncate">
                    {shareLink}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(shareLink, 'link')}
                    className="text-xs font-mono bg-white border border-gray-300 hover:border-gray-900 text-gray-900 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
                  >
                    {copiedLink ? '✓ COPIED' : 'COPY LINK'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/game/${generatedCode}`)}
                className="w-full bg-gray-900 hover:bg-black text-white text-sm font-mono py-3 rounded-md transition-colors mt-2"
              >
                Waiting for opponent... (Enter match)
              </button>
            </div>
          </div>
        )}

        {mode === 'search' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Search Player</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md mb-4 text-gray-900 font-mono text-sm focus:outline-none focus:border-gray-900"
              placeholder="Enter username..."
              autoFocus
            />

            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <button
                    key={user.username}
                    type="button"
                    onClick={() => challengeUser(user.username)}
                    disabled={isLoading}
                    className="w-full flex justify-between items-center p-3 border border-gray-200 rounded-md hover:border-gray-900 transition-colors text-left bg-gray-50/50 hover:bg-white"
                  >
                    <span className="text-sm font-medium text-gray-900">{user.username}</span>
                    <span className="text-xs text-gray-500 font-mono">{user.elo} ELO</span>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <p className="text-sm text-gray-500 text-center py-4">No players found</p>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Type to search players</p>
            )}
          </div>
        )}

        {mode === 'join' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Join Match</h2>
            <input
              type="text"
              value={matchCode}
              onChange={(e) => setMatchCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && joinMatch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-md mb-4 text-center font-mono text-xl tracking-widest text-gray-900 focus:outline-none focus:border-gray-900 uppercase"
              placeholder="ENTER CODE"
              maxLength={6}
              autoFocus
            />
            <button
              type="button"
              onClick={joinMatch}
              disabled={!matchCode.trim() || isLoading}
              className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white text-sm font-mono py-3 rounded-md transition-colors"
            >
              {isLoading ? 'Joining...' : 'Join Match'}
            </button>
          </div>
        )}

        {mode && (
          <button
            type="button"
            onClick={() => {
              setMode(null);
              setMatchCode('');
              setSearchQuery('');
              setGeneratedCode('');
              setShareLink('');
              setErrorMsg('');
            }}
            className="mt-4 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to options
          </button>
        )}

        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900 mb-3">How Private Duels Work</h3>
          <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              Create a match link and send it directly to a friend.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              Search and challenge registered players by username.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              Join directly with a 6-character room code.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              Guest friendly — no account or login required to play.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
