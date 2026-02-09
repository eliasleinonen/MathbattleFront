import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../api';

export default function Register({ setAuth = () => {} }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(email, password, name);
      localStorage.setItem('token', response.data.access_token);
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-5xl font-bold text-primary mb-2 text-center">Derivative Duel</h1>
        <p className="text-secondary text-center mb-8">Create your account</p>

        <div className="bg-blue-50 border-2 border-primary rounded-lg p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:text-secondary transition-colors mr-3"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-primary">Register</h2>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-secondary font-semibold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-4 text-center text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
