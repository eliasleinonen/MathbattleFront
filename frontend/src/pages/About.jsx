import { useNavigate, Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Seo
        title="About Derivative Duel - Competitive Calculus Learning"
        description="Derivative Duel makes learning calculus fun through competitive 1v1 derivative battles, an ELO rating system, and daily challenges. Learn about our mission."
        path="/about"
      />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Derivative Duel</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is Derivative Duel?</h2>
            <p className="text-gray-700 leading-relaxed">
              Derivative Duel is a competitive online math game where players battle each other by solving calculus derivative problems. 
              Our mission is to make learning derivatives fun and engaging through competitive gameplay.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Players compete in real-time 1v1 matches, solving derivative problems as quickly and accurately as possible. 
              Each correct answer brings you closer to victory, while wrong answers give your opponent the advantage.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Ranked Matches:</strong> Compete against random opponents and climb the ELO leaderboard</li>
              <li><strong>Challenge Friends:</strong> Create private matches and challenge your classmates</li>
              <li><strong>Daily Challenge:</strong> Solve the daily derivative problem and compete for the fastest time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Derivative Duel?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Traditional calculus practice can be tedious. We believe that learning should be exciting and competitive. 
              By gamifying derivative practice, we help students:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Master differentiation rules through repetition</li>
              <li>Improve speed and accuracy under pressure</li>
              <li>Stay motivated through competitive gameplay</li>
              <li>Track progress with ELO ratings and statistics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Derivative Duel was created by students who struggled to stay motivated while learning calculus. 
              We realized that the competitive element of gaming could transform boring practice into an addictive challenge. 
              Today, students use Derivative Duel to master derivatives while having fun.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Have questions, feedback, or suggestions? We'd love to hear from you!
            </p>
            <p className="text-gray-700 mt-2">
              Email: <a href="mailto:support@mathbattle.xyz" className="text-blue-600 hover:underline">support@mathbattle.xyz</a>
            </p>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              © 2025–2026 Derivative Duel. All rights reserved. | 
              <Link to="/privacy-policy" className="text-blue-600 hover:underline ml-2">Privacy Policy</Link> | 
              <Link to="/faq" className="text-blue-600 hover:underline ml-2">FAQ</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
