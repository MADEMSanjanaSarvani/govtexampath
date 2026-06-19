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
  const rawData = window.atob(base64);
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
            const { PushNotifications } = await import('@capacitor/push-notifications');

            const permResult = await PushNotifications.requestPermissions();
            if (permResult.receive !== 'granted') return;

            await PushNotifications.register();

            PushNotifications.addListener('registration', async (token) => {
              try {
                await registerFCMToken(token.value, 'android');
                registered.current = true;
              } catch (err) {
                console.error('FCM token registration failed:', err);
              }
            });

            PushNotifications.addListener('registrationError', (err) => {
              console.error('Push registration error:', err);
            });

            PushNotifications.addListener('pushNotificationReceived', () => {});

            PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
              const data = action.notification.data;
              if (data && data.type) {
                window.location.href = '/notifications';
              }
            });
          } catch (err) {
            console.log('Push notifications not available:', err.message);
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
