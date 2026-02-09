import React from "react";
import { useNavigate } from 'react-router-dom';

export default function TermsAndServices() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          ← back
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service & GDPR</h1>
          
          <div className="text-sm text-gray-700 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h2>
              <p>We collect only the minimum personal data required to provide the game service, such as your email and username when you sign in with Google. Game progress and scores are stored for gameplay and leaderboard purposes.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies</h2>
              <p>We use cookies or local storage to keep you logged in and to remember your preferences. No tracking cookies are used for advertising.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Third Parties</h2>
              <p>We use Google for authentication. Your data is not sold or shared with third parties except as required for authentication and game operation.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Right to Access & Deletion</h2>
              <p>You may request to see or delete your data at any time by contacting us at <a href="mailto:leinonen.elias@gmail.com" className="underline text-blue-600 hover:text-blue-700">leinonen.elias@gmail.com</a>.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Security</h2>
              <p>We take reasonable measures to protect your data, but no system is 100% secure. Use a strong password for your Google account.</p>
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
              <p>For any privacy or data questions, email <a href="mailto:leinonen.elias@gmail.com" className="underline text-blue-600 hover:text-blue-700">leinonen.elias@gmail.com</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
