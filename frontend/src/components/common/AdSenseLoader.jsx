import { useEffect } from 'react';

// Public AdSense client ID (appears in page source — not a secret).
const ADSENSE_CLIENT = 'ca-pub-6646740696712454';

/**
 * Loads the Google AdSense Auto ads script on the public website only.
 *
 * AdSense is a *website* ad product. Our Android app is a Capacitor WebView that
 * loads the same site, so without this guard AdSense would also run inside the
 * app — which Google's policies discourage (apps should use AdMob). This
 * component injects the loader at runtime and skips it when running inside the
 * native app, so ads serve on the web only.
 */
export default function AdSenseLoader() {
  useEffect(() => {
    const isNativeApp =
      window.Capacitor &&
      window.Capacitor.isNativePlatform &&
      window.Capacitor.isNativePlatform();
    if (isNativeApp) return;

    // Avoid injecting twice (e.g. across client-side navigations / fast refresh).
    if (document.querySelector('script[data-adsense-loader="true"]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-adsense-loader', 'true');
    document.head.appendChild(script);
  }, []);

  return null;
}
