import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I start playing?",
      answer: "Simply create a free account and you can immediately start playing! Choose 'Play Random' to be matched with an opponent of similar skill level, or 'Challenge Friend' to play against someone specific."
    },
    {
      question: "What is ELO rating?",
      answer: "ELO is a rating system that measures your skill level. You start at 1000 ELO. When you win matches, your ELO goes up; when you lose, it goes down. The amount of change depends on the skill difference between you and your opponent."
    },
    {
      question: "How does the Daily Challenge work?",
      answer: "Every day, a new derivative problem is posted. All players solve the same problem, and the leaderboard ranks players by completion time. You only get one attempt per day, so make it count!"
    },
    {
      question: "What derivative rules do I need to know?",
      answer: "You should be familiar with: Power Rule, Product Rule, Quotient Rule, Chain Rule, and derivatives of basic functions (sin, cos, e^x, ln x). Check our 'How to Derivate' guide for a full review."
    },
    {
      question: "Can I practice without competing?",
      answer: "Yes! Use Practice Mode to solve derivative problems at your own pace without affecting your ELO rating. This is great for learning new rules or warming up before ranked matches."
    },
    {
      question: "How is match difficulty determined?",
      answer: "The difficulty of derivative problems adapts to your ELO rating. Higher-rated players receive more complex problems involving chain rule, product rule, and special functions."
    },
    {
      question: "What happens if I don't answer in time?",
      answer: "In competitive matches, you have 60 seconds per question. If time runs out, it counts as an incorrect answer and your opponent gets the point. In Practice Mode, there's no time limit."
    },
    {
      question: "How do I challenge a specific friend?",
      answer: "Click 'Challenge Friend', search for their username, and send them a challenge. They'll receive a notification and can accept to start the match. You can also share your match code directly."
    },
    {
      question: "Can I play on mobile?",
      answer: "Yes! Derivative Duel works on all devices. The interface is fully responsive and optimized for both desktop and mobile play."
    },
    {
      question: "Is Derivative Duel free?",
      answer: "Yes, Derivative Duel is completely free to play. We display ads to keep the service free for everyone. No premium features or pay-to-win mechanics."
    },
    {
      question: "How do I improve my derivative skills?",
      answer: "Practice regularly! Start with our 'How to Derivate' tutorial, use Practice Mode to drill specific rules, and play Daily Challenges to compete against others. Consistent practice is key."
    },
    {
      question: "What if I find a bug or have a suggestion?",
      answer: "We'd love to hear from you! Email us at support@mathbattle.xyz with bug reports, feature requests, or general feedback."
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">Find answers to common questions about Derivative Duel</p>

        <div className="bg-white rounded-lg shadow-sm">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</h3>
                  <span className="text-2xl text-gray-400 flex-shrink-0">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-gray-700 mb-4">
            Can't find what you're looking for? Contact us and we'll be happy to help!
          </p>
          <a
            href="mailto:support@mathbattle.xyz"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            support@mathbattle.xyz
          </a>
        </div>
      </div>
    </div>
  );
}
