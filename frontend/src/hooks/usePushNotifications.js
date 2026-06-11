import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerFCMToken } from '../services/notificationService';

const isCapacitor = () => {
  return typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform();
};

const usePushNotifications = () => {
  const { isAuthenticated } = useAuth();
  const registered = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !isCapacitor() || registered.current) return;

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

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received:', notification);
        });

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
  }, [isAuthenticated]);
};

export default usePushNotifications;
