import { useNavigate } from 'react-router-dom';

export default function TermsAndPrivacy() {
  const navigate = useNavigate();
  return (
    <footer className="w-full py-6 bg-gray-50 border-t border-gray-200 text-center font-mono">
      <div className="flex flex-row justify-center gap-6">
        <button
          type="button"
          className="text-xs text-gray-500 underline hover:text-gray-900 transition-colors"
          onClick={() => navigate('/terms-and-services')}
        >
          Terms and Services / GDPR
        </button>
      </div>
    </footer>
  );
}
