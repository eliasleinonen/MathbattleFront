import { Link } from 'react-router-dom';

export default function TermsAndPrivacy() {
  return (
    <footer className="w-full py-6 bg-gray-50 border-t border-gray-200 text-center font-mono">
      <div className="flex flex-row justify-center gap-6">
        <Link
          to="/terms-and-services"
          className="text-xs text-gray-500 underline hover:text-gray-900 transition-colors"
        >
          Terms and Services / GDPR
        </Link>
      </div>
    </footer>
  );
}
