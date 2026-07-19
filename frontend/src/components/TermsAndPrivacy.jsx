import React from "react";
import { useNavigate } from 'react-router-dom';

export default function TermsAndPrivacy() {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-0 w-full flex flex-col items-center z-50">
      <div className="flex flex-row gap-6 mb-2">
        <button
          className="text-xs text-gray-500 underline hover:text-gray-900 bg-white/80 px-2 py-1 rounded"
          onClick={() => navigate('/terms-and-services')}
        >
          Terms and Services / GDPR
        </button>
      </div>
    </div>
  );
}
