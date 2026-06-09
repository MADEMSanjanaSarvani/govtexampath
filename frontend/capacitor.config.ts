import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.govtexampath.app',
  appName: 'GovtExamPath',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    url: 'https://govtexampath.com',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#2563eb',
      showSpinner: true,
      spinnerColor: '#ffffff',
    },
    StatusBar: {
      backgroundColor: '#2563eb',
      style: 'LIGHT',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
