import { useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';

export default function TermsAndServices() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Seo
        title="Terms of Service & GDPR | Derivative Duel"
        description="Terms of service for Derivative Duel, including data collection, GDPR rights, and fair play rules."
        path="/terms-and-services"
      />
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          ← back to home
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service & GDPR</h1>
          <p className="text-xs text-gray-500 mb-6">Last updated: July 20, 2026</p>
          
          <div className="text-sm text-gray-700 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h2>
              <p>We collect only the minimum personal data required to provide the game service, such as your email and username when you sign in. Game progress and scores are stored for gameplay and leaderboard purposes.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies & Analytics</h2>
              <p>We use essential cookies and local storage to keep you logged in and remember your preferences. Third-party services such as Google AdSense and Google Analytics may also use cookies to serve ads and analyze traffic.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Third Parties</h2>
              <p>We use Google for authentication. Your data is not sold or shared with third parties except as required for authentication, advertising, and game operation.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Right to Access & Deletion</h2>
              <p>You may request to see or delete your data at any time by contacting us at <a href="mailto:support@mathbattle.xyz" className="underline text-blue-600 hover:text-blue-700">support@mathbattle.xyz</a>.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Security</h2>
              <p>We take reasonable measures to protect your data, but no system is 100% secure.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Children</h2>
              <p>This service is not intended for children under 13. If you are under 13, do not use this service.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Changes</h2>
              <p>We may update these terms. Continued use of the service means you accept the latest version.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
              <p>For any privacy or data questions, email <a href="mailto:support@mathbattle.xyz" className="underline text-blue-600 hover:text-blue-700">support@mathbattle.xyz</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
