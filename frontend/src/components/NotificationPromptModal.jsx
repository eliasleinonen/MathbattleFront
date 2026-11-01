import { useState } from 'react';
import { subscribeToPushNotifications } from '../utils/notifications';

export default function NotificationPromptModal({ isOpen, onClose }) {
  const [subscribing, setSubscribing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleEnable = async () => {
    setSubscribing(true);
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        onClose();
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeToPushNotifications();
        setSuccess(true);
        setTimeout(() => onClose(), 900);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Failed to enable push notifications:', err);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-xs w-full p-6 text-center transform transition-all">
        {success ? (
          <div className="py-2 text-center">
            <div className="text-2xl mb-1 text-gray-900">✓</div>
            <div className="text-sm font-medium text-gray-900">Notifications enabled</div>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="text-base font-medium text-gray-900 mb-1.5">
              1v1 Challenge Alerts
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Get pinged when a real player is waiting in queue to duel you.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                disabled={subscribing}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-600 text-xs py-2 px-3 rounded-lg border border-gray-300 transition-colors"
              >
                maybe later
              </button>
              <button
                onClick={handleEnable}
                disabled={subscribing}
                className="flex-1 bg-gray-900 hover:bg-black text-white text-xs py-2 px-3 rounded-lg font-medium transition-colors disabled:bg-gray-400"
              >
                {subscribing ? 'enabling...' : 'enable'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
