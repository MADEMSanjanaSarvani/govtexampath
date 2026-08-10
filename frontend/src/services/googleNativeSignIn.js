import { warmUpBackend } from './api';

// Shared by Login.jsx and Register.jsx so there's exactly one copy of this
// logic instead of two independently-maintained ones drifting apart (which
// is how earlier sign-in bugs went unnoticed in one of the two screens).
//
// On Android, this tries native Google Sign-In first (Credential Manager via
// @capacitor-firebase/authentication) — no browser tab, no redirect, no deep
// link, so the whole class of Custom-Tab/App-Link/cold-start bugs this flow
// went through simply doesn't apply to it. If that fails for any reason
// other than the user cancelling (plugin not configured yet, Play Services
// unavailable, etc.), it falls back to the existing browser-redirect flow as
// a safety net rather than leaving the user stuck.
export async function handleGoogleAuth({ googleLogin, navigate }) {
  const isNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();

  if (isNative) {
    try {
      const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
      const result = await FirebaseAuthentication.signInWithGoogle();
      const idToken = result?.credential?.idToken;
      if (!idToken) throw new Error('Native sign-in returned no ID token');

      await googleLogin(idToken);
      window.gtag?.('event', 'login', { method: 'google' });
      navigate('/dashboard');
      return;
    } catch (err) {
      const code = String(err?.code || err?.message || '');
      // User backed out of the account picker — respect that, don't force a
      // different flow on them for what's just a change of mind.
      if (/cancel/i.test(code) || code.includes('12501')) return;
      console.warn('[GoogleAuth] Native sign-in failed, falling back to browser flow:', code);
      // Falls through to the browser-based flow below.
    }
  }

  // Browser-based OAuth flow — used on the web, and as the native fallback
  // above. This is the flow that was fixed for the App Link interception bug;
  // kept as a safety net in case native sign-in isn't available for some
  // reason (plugin/Console setup not finished yet, older OS, etc.).
  warmUpBackend();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const redirectUri = isNative
    ? 'https://govtexampath.com/auth/google/callback'
    : `${window.location.origin}/auth/google/callback`;

  let state;
  if (isNative) {
    state = 'capacitor';
  } else {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    state = Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('oauth_state', state);
  }

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&prompt=select_account&state=${encodeURIComponent(state)}`;
  if (isNative) {
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url, windowName: '_self', presentationStyle: 'popover' });
    } catch {
      window.location.href = url;
    }
  } else {
    window.location.href = url;
  }
}
