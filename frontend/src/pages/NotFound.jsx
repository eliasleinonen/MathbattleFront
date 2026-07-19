import { useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Seo
        title="Page Not Found | Derivative Duel"
        description="This page does not exist. Head back to Derivative Duel to keep practicing derivatives."
        path="/404"
        noindex
      />
      <p className="text-6xl font-light text-gray-900 mb-4">404</p>
      <h1 className="text-xl font-medium text-gray-800 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-8">
        The derivative of this page is zero - there is nothing here.
      </p>
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-600 hover:text-gray-900 underline"
      >
        ← back to home
      </button>
    </div>
  );
}
