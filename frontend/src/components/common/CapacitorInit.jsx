import { useEffect } from 'react';

// If the app sits backgrounded (switched away from, not force-closed) longer
// than this, reload on resume so the WebView re-fetches from the live site
// instead of showing whatever was loaded when the app was last opened.
const STALE_RESUME_MS = 15 * 60 * 1000; // 15 minutes

export default function CapacitorInit() {
  useEffect(() => {
    const isCapacitorNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (!isCapacitorNative) return;
    let backgroundedAt = null;

    import('@capacitor/app').then(({ App: CapApp }) => {
      CapApp.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          backgroundedAt = Date.now();
          return;
        }
        if (backgroundedAt && Date.now() - backgroundedAt > STALE_RESUME_MS) {
          window.location.reload();
        }
        backgroundedAt = null;
      });

      const handleDeepLink = (raw) => {
        try {
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
      };

      CapApp.addListener('appUrlOpen', (data) => handleDeepLink(data.url));

      // appUrlOpen only fires for a deep link received while the app is already running
      // (onNewIntent). If the deep link is what launched the app in the first place — e.g. the
      // OAuth redirect hands off to the app while it wasn't running, or a user opens a
      // govtexampath.com link from another app when GovtExamPath is fully closed — that event
      // never fires and the link is silently dropped unless we also check the launch URL.
      CapApp.getLaunchUrl().then((result) => {
        if (result?.url) handleDeepLink(result.url);
      }).catch(() => {});
    }).catch(() => {});
  }, []);
  return null;
}
