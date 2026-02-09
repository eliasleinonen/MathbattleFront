import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TermsAndPrivacy from '../components/TermsAndPrivacy';

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

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
          }
        );
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white border border-gray-300 rounded p-12 max-w-md w-full">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-secondary transition-colors mr-3"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-medium text-gray-800 text-center w-full">
            derivative duel
          </h1>
        </div>

        <div className="space-y-4">
          <div id="googleSignInButton" className="flex justify-center"></div>
        </div>
      </div>
      <TermsAndPrivacy />
    </div>
  );
}
