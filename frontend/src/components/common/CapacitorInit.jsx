import { useEffect } from 'react';

export default function CapacitorInit() {
  useEffect(() => {
    const isCapacitorNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (!isCapacitorNative) return;
    import('@capacitor/app').then(({ App: CapApp }) => {
      CapApp.addListener('appUrlOpen', (data) => {
        try {
          const raw = data.url;
          if (raw.startsWith('com.govtexampath.app://auth-success')) {
            const parsed = new URL(raw.replace('com.govtexampath.app://', 'https://x.com/'));
            const token = parsed.searchParams.get('token');
            if (token) {
              localStorage.setItem('token', decodeURIComponent(token));
              window.location.href = '/dashboard';
            }
            return;
          }
          let path;
          if (raw.startsWith('com.govtexampath.app://')) {
            path = '/' + raw.split('://')[1];
          } else {
            const url = new URL(raw);
            path = url.pathname + url.search;
          }
          if (path.startsWith('/auth/google/callback') || path.startsWith('/reset-password')) {
            window.location.href = path;
          }
        } catch {}
      });
    }).catch(() => {});
  }, []);
  return null;
}
