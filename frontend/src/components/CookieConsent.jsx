import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_SETTINGS_KEY = 'cookie_settings';

const DEFAULT_SETTINGS = {
  necessary: true,     // Always on — session, auth
  analytics: false,    // Usage analytics
  advertising: false,  // Google AdSense & ad personalization
};

function getStoredConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return null;
  }
}

function getStoredSettings() {
  try {
    const raw = localStorage.getItem(COOKIE_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Update Google Analytics / AdSense consent mode
function applyGoogleConsent(settings) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: settings.analytics ? 'granted' : 'denied',
      ad_storage: settings.advertising ? 'granted' : 'denied',
      ad_user_data: settings.advertising ? 'granted' : 'denied',
      ad_personalization: settings.advertising ? 'granted' : 'denied',
    });
  }
}

export default function CookieConsent() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    const storedSettings = getStoredSettings();

    if (storedSettings) {
      setSettings(storedSettings);
      applyGoogleConsent(storedSettings);
    }

    if (!consent) {
      // Small delay so the banner slides in after page paint
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 350);
  };

  const handleAcceptAll = () => {
    const all = { necessary: true, analytics: true, advertising: true };
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(all));
    setSettings(all);
    applyGoogleConsent(all);
    dismiss();
  };

  const handleSaveSettings = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'custom');
    localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(settings));
    applyGoogleConsent(settings);
    setShowSettings(false);
    dismiss();
  };

  const handleRejectOptional = () => {
    const minimal = { necessary: true, analytics: false, advertising: false };
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(minimal));
    setSettings(minimal);
    applyGoogleConsent(minimal);
    dismiss();
  };

  const toggleSetting = (key) => {
    if (key === 'necessary') return; // Cannot disable
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay when settings modal is open */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Banner */}
      <div
        className={`fixed bottom-4 right-4 z-[9999] max-w-sm sm:max-w-md w-[calc(100%-2rem)] transition-all duration-300 ease-out ${
          closing
            ? 'translate-y-4 opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
        role="dialog"
        aria-label="Cookie consent"
      >
        <div className="bg-white border border-gray-300 rounded shadow-xl p-5">
          {/* Main banner content */}
          {!showSettings && (
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 font-mono mb-1.5">
                  We use cookies
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed font-mono">
                  We use cookies to improve your browsing experience and analyze site traffic. Read our{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/privacy-policy')}
                    className="text-gray-700 underline hover:text-gray-900 transition-colors"
                  >
                    Privacy Policy
                  </button>{' '}
                  for details.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const stored = getStoredSettings();
                    if (stored) setSettings(stored);
                    setShowSettings(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:border-gray-900 hover:text-gray-900 transition-colors font-mono"
                >
                  Edit settings
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-gray-900 rounded hover:bg-black transition-colors font-mono"
                >
                  Accept
                </button>
              </div>
            </div>
          )}

          {/* Settings panel */}
          {showSettings && (
            <div className="animate-[fadeIn_200ms_ease]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900 font-mono">
                  Cookie settings
                </h2>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-900 transition-colors text-lg leading-none"
                  aria-label="Close settings"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 mb-5">
                {/* Necessary */}
                <CookieCategory
                  label="Necessary"
                  description="Essential cookies required for the site to function properly."
                  checked={settings.necessary}
                  disabled
                />
                {/* Analytics */}
                <CookieCategory
                  label="Analytics"
                  description="Help us measure and understand how visitors interact with the site."
                  checked={settings.analytics}
                  onChange={() => toggleSetting('analytics')}
                />
                {/* Advertising */}
                <CookieCategory
                  label="Advertising"
                  description="Used to deliver relevant content and personalized ads."
                  checked={settings.advertising}
                  onChange={() => toggleSetting('advertising')}
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors font-mono"
                >
                  Reject optional
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2 text-xs font-medium text-white bg-gray-900 rounded hover:bg-black transition-colors font-mono"
                >
                  Save settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---- Toggle row for a single cookie category ---- */
function CookieCategory({ label, description, checked, disabled, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded bg-gray-50 border border-gray-200">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-900 font-mono">{label}</p>
        <p className="text-[11px] text-gray-500 leading-relaxed font-mono mt-0.5">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label} cookies`}
        disabled={disabled}
        onClick={onChange}
        className={`relative shrink-0 inline-flex h-5 w-9 items-center rounded-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${
          checked ? 'bg-gray-900' : 'bg-gray-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-sm bg-white shadow transform transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </button>
    </div>
  );
}
