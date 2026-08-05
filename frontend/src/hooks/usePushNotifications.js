import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerFCMToken } from '../services/notificationService';
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
        const setup = async () => {
          try {
            // Skip entirely when the native plugin isn't present in this build —
            // registering without it (or without google-services.json/Firebase)
            // can hard-crash the app right after login.
            const cap = window.Capacitor;
            if (cap.isPluginAvailable && !cap.isPluginAvailable('PushNotifications')) {
              console.log('PushNotifications plugin not available in this build — skipping');
              return;
            }

            const { PushNotifications } = await import('@capacitor/push-notifications');

            // Attach listeners BEFORE register() so no event is missed and any
            // registration failure is handled instead of surfacing natively.
            PushNotifications.addListener('registration', async (token) => {
              try {
                await registerFCMToken(token.value, 'android');
                registered.current = true;
              } catch (err) {
                console.error('FCM token registration failed:', err?.response?.data?.error || err?.message);
              }
            });

            PushNotifications.addListener('registrationError', (err) => {
              console.error('Push registration error (non-fatal):', err?.message || String(err));
            });

            PushNotifications.addListener('pushNotificationReceived', () => {});

            PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
              const data = action.notification.data;
              if (data && data.type) {
                window.location.href = '/notifications';
              }
            });

            const permResult = await PushNotifications.requestPermissions();
            if (permResult.receive !== 'granted') return;

            await PushNotifications.register();
          } catch (err) {
            // Missing Firebase config (google-services.json) or plugin errors land
            // here — log and continue; never let push setup take the app down.
            console.log('Push notifications not available:', err && err.message);
          }
        };
        setup();
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
