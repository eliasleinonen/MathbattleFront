import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Seo from '../components/Seo';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        const buttonContainer = document.getElementById('googleSignInButton');
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center',
          // Match the full-width "continue as guest" button below it
          width: buttonContainer.offsetWidth,
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { token: response.credential });
      localStorage.setItem('token', res.data.access_token);

      // Check if there's a pending match code
      const pendingMatchCode = localStorage.getItem('pendingMatchCode');

      // Username is now optional - users can play as guests
      if (pendingMatchCode) {
        // Redirect to play/friend page which will handle the join
        navigate('/play/friend');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Seo
        title="Sign In | Derivative Duel"
        description="Sign in to Derivative Duel with Google to save your ELO rating and match history, or continue as a guest."
        path="/login"
        noindex
      />
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mb-3 text-4xl font-medium text-gray-900 select-none">
            &#8706;
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">derivative duel</h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to save your ELO, match history, and challenge friends.
          </p>
        </div>

        <div id="googleSignInButton" className="flex justify-center min-h-[44px]">
          {loading && <p className="text-sm text-gray-500">Signing you in…</p>}
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          onClick={continueAsGuest}
          className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 text-sm py-2.5 rounded transition-colors"
        >
          continue as guest
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our{' '}
          <button
            onClick={() => navigate('/terms-and-services')}
            className="underline text-gray-500 hover:text-gray-900"
          >
            Terms and Services
          </button>{' '}
          and{' '}
          <button
            onClick={() => navigate('/privacy-policy')}
            className="underline text-gray-500 hover:text-gray-900"
          >
            Privacy Policy
          </button>
          .
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 text-sm text-gray-500 hover:text-gray-900 underline"
      >
        ← back to home
      </button>
    </div>
  );
}
