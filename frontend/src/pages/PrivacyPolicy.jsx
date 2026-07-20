import { useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Seo
        title="Privacy Policy | Derivative Duel"
        description="How Derivative Duel collects, uses, and protects your personal data, including account information, gameplay statistics, and cookies."
        path="/privacy-policy"
      />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: July 20, 2026</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Derivative Duel ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>Account Information:</strong> Username and email address when you sign in</li>
              <li><strong>Profile Data:</strong> Optional profile information you choose to provide</li>
              <li><strong>Game Data:</strong> Match results, scores, ELO ratings, and gameplay statistics</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
              <li><strong>Device Information:</strong> Browser type, IP address, operating system</li>
              <li><strong>Cookies:</strong> We use cookies to maintain your session and improve user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide and maintain our game services</li>
              <li>Create and manage your account</li>
              <li>Match you with opponents of similar skill level</li>
              <li>Display leaderboards and statistics</li>
              <li>Send important service updates and notifications</li>
              <li>Improve our services and develop new features</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your data in the following limited circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Public Information:</strong> Your username and game statistics are visible to other players</li>
              <li><strong>Service Providers:</strong> We may share data with trusted third-party services (hosting, analytics) who help us operate</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Google AdSense</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use Google AdSense to display advertisements. Google may use cookies and web beacons to collect information about your visits to this and other websites 
              to provide advertisements about goods and services of interest to you.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google Ad Settings
              </a>
              . For more information, see Google's{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction. 
              However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to certain types of data processing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:support@mathbattle.xyz" className="text-blue-600 hover:underline">
                support@mathbattle.xyz
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. 
              If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies to maintain your login session and improve user experience. You can configure your browser to reject cookies, 
              but this may limit your ability to use certain features of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on our website. 
              Your continued use of our service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <p className="text-gray-700 mt-4">
              Email:{' '}
              <a href="mailto:support@mathbattle.xyz" className="text-blue-600 hover:underline">
                support@mathbattle.xyz
              </a>
            </p>
            <p className="text-gray-700 mt-2">
              Website:{' '}
              <a href="https://www.mathbattle.xyz" className="text-blue-600 hover:underline">
                www.mathbattle.xyz
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
