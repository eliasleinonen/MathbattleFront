import { useState } from 'react';
import { subscribeToPushNotifications } from '../utils/notifications';

export default function NotificationPromptModal({ isOpen, onClose }) {
  const [subscribing, setSubscribing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleEnable = async () => {
    setSubscribing(true);
    setErrorMessage('');

    try {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        onClose();
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeToPushNotifications();
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Failed to enable push notifications:', err);
      setErrorMessage('Could not activate notifications. You can try again later.');
      setSubscribing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-md w-full p-6 text-center transform transition-all">
        {success ? (
          <div className="py-6">
            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">You're all set!</h3>
            <p className="text-sm text-gray-600">
              We'll send you a quick ping whenever a challenger enters the matchmaking queue.
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔔
            </div>

            <h3 className="text-xl font-light text-gray-900 mb-2">
              Never Miss a Live 1v1 Duel
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Real opponents aren't always queueing at the exact same minute. Enable notifications to get a quick ping when someone is waiting for a challenger.
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3.5 mb-6 text-left space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">⚔️ Real players only:</span>
                <span>Only alerted when an opponent queues</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">🛡️ Zero spam:</span>
                <span>At most 1 notification every 30 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">⚙️ Total control:</span>
                <span>Turn it off anytime in browser settings</span>
              </div>
            </div>

            {errorMessage && (
              <div className="text-xs text-red-600 mb-4 bg-red-50 p-2 rounded">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEnable}
                disabled={subscribing}
                className="flex-1 bg-gray-900 hover:bg-black text-white text-sm py-2.5 px-4 rounded font-medium transition-colors disabled:bg-gray-400"
              >
                {subscribing ? 'Enabling...' : 'Enable Notifications'}
              </button>
              <button
                onClick={onClose}
                disabled={subscribing}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 text-sm py-2.5 px-4 rounded border border-gray-300 hover:border-gray-900 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
