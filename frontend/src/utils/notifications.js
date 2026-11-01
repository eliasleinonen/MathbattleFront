import { notificationAPI } from '../api';

const MATCHES_PLAYED_KEY = 'derivative_duel_matches_played';

/**
 * Convert a base64 string to a Uint8Array for PushManager subscription.
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if the current browser environment supports Web Push.
 */
export function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Get current browser notification permission ('default', 'granted', 'denied').
 */
export function getNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Get the total number of finished matches stored locally.
 */
export function getMatchesPlayedCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(MATCHES_PLAYED_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * Increment the finished matches count and return the new count.
 */
export function incrementMatchesPlayedCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const nextCount = getMatchesPlayedCount() + 1;
    localStorage.setItem(MATCHES_PLAYED_KEY, nextCount.toString());
    return nextCount;
  } catch {
    return 0;
  }
}

/**
 * Determine whether to show the pre-permission notification screen.
 * Triggers after the 1st completed match, and then every 5th match (5, 10, 15...).
 */
export function shouldPromptForNotifications() {
  if (!isPushSupported()) return false;
  if (Notification.permission !== 'default') return false;

  const count = getMatchesPlayedCount();
  return count === 1 || (count > 1 && count % 5 === 0);
}

/**
 * Register service worker and subscribe to push notifications.
 */
export async function subscribeToPushNotifications() {
  if (!isPushSupported()) {
    throw new Error('Push notifications not supported in this browser');
  }

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const keyRes = await notificationAPI.getVapidPublicKey();
  const publicKey = keyRes.data.public_key;
  if (!publicKey) {
    throw new Error('No VAPID public key received from server');
  }

  const applicationServerKey = urlBase64ToUint8Array(publicKey);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  await notificationAPI.subscribe(subscription.toJSON());
  return subscription;
}
