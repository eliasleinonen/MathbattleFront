import { useState, useEffect } from 'react';
import { authAPI } from '../api';
import LoadingSpinner from './LoadingSpinner';

export default function SaveProgressModal({ isOpen, onClose, onUpgradeSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const initGoogleButton = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim(),
          callback: handleCredentialResponse,
        });

        const buttonContainer = document.getElementById('modalGoogleSignInButton');
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'center',
            width: 280,
          });
        }
      }
    };

    if (window.google) {
      // Short timeout to ensure the DOM element with ID is rendered
      const timer = setTimeout(initGoogleButton, 100);
      return () => clearTimeout(timer);
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(initGoogleButton, 100);
      };
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      const guestId = localStorage.getItem('guestId');
      const res = await authAPI.loginGoogle(response.credential, guestId);
      localStorage.setItem('token', res.data.access_token);
      onUpgradeSuccess();
    } catch (err) {
      console.error('Failed to save guest progress:', err);
      setError('Failed to save progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-mono">
      <div className="bg-white border border-gray-300 rounded p-8 max-w-sm w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
          aria-label="Close modal"
        >
          ✕
        </button>
        <div className="mb-4 text-3xl text-gray-900 select-none">
          &#8706;
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Save your progress</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Sign in with Google to link your guest match history and ELO rating to a permanent account.
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center justify-center min-h-[44px]">
          {loading ? (
            <div className="flex items-center text-sm text-gray-500">
              <LoadingSpinner size="sm" className="mr-2" />
              <span>Saving progress…</span>
            </div>
          ) : (
            <div id="modalGoogleSignInButton"></div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
