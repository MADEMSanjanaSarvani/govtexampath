import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SETUP_DELAY_MS = 5000;

const isCapacitor = () => {
  return typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform();
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = (typeof window !== 'undefined' ? window.atob : atob)(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const setupWebPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'denied') return;
  if (Notification.permission === 'granted') {
    await subscribeWebPush();
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    await subscribeWebPush();
  } catch (err) {
    console.log('Web push permission error:', err.message);
  }
};

const subscribeWebPush = async () => {
  try {
    const swReady = Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('SW timeout')), 10000)),
    ]);
    const registration = await swReady;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const response = await api.get('/notifications/vapid-key', { _skipAuthRedirect: true });
      const vapidPublicKey = response.data?.data?.vapidPublicKey;
      if (!vapidPublicKey) return;

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    await api.post('/notifications/web-push/subscribe', {
      subscription: subscription.toJSON(),
    }, { _skipAuthRedirect: true });
  } catch (err) {
    console.log('Web push subscription skipped:', err.message);
  }
};

const usePushNotifications = () => {
  const { isAuthenticated } = useAuth();
  const registered = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || registered.current) return;

    const timer = setTimeout(() => {
      if (registered.current) return;

      if (isCapacitor()) {
        // Native push (FCM via @capacitor/push-notifications) is intentionally
        // NOT wired up: it requires a real google-services.json (Firebase project
        // config) to be present in android/app/, which this project does not have.
        // Calling PushNotifications.register() without it throws a native
        // IllegalStateException ("Default FirebaseApp is not initialized") INSIDE
        // the plugin's Java code, on a background thread, before any Promise
        // settles — so it crashes the whole app and cannot be caught from JS,
        // no matter how the call is wrapped. Skipping it here is not a
        // workaround for a JS bug; it's the correct behavior for a feature whose
        // required native configuration doesn't exist yet.
        //
        // To enable native push properly: get google-services.json from the
        // Firebase console (project matching appId com.govtexampath.app) and
        // place it at frontend/android/app/google-services.json, then re-add
        // the @capacitor/push-notifications registration logic here.
        console.log('Native push notifications disabled: no Firebase config (google-services.json) for this build.');
      } else {
        setupWebPush()
          .then(() => { registered.current = true; })
          .catch(() => {});
      }
    }, SETUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);
};

export default usePushNotifications;
