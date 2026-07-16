import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.govtexampath.app',
  appName: 'GovtExamPath',
  webDir: 'out',
  server: {
    url: 'https://govtexampath.com',
    androidScheme: 'https',
    hostname: 'govtexampath.com',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 3000,
      backgroundColor: '#2563eb',
      showSpinner: true,
      spinnerColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      backgroundColor: '#2563eb',
      style: 'LIGHT',
    },
    // PushNotifications intentionally omitted: native push (FCM) requires a real
    // google-services.json in android/app/, which this project does not have.
    // See src/hooks/usePushNotifications.js for the full explanation and how to
    // re-enable it once Firebase is configured.
  },
};

export default config;
