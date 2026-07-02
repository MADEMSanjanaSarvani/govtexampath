import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SocketProvider } from '@/context/SocketContext';
import { NotificationProvider } from '@/context/NotificationContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Layout from '@/components/layout/Layout';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { warmUpBackend } from '@/services/api';
import '@/index.css';

// Browser-only components loaded without SSR
const CookieConsent = dynamic(() => import('@/components/common/CookieConsent'), { ssr: false });
const PushNotificationInit = dynamic(() => import('@/components/common/PushNotificationInit'), { ssr: false });
const CapacitorInit = dynamic(() => import('@/components/common/CapacitorInit'), { ssr: false });

function ScrollToTop() {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);
  return null;
}

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function App({ Component, pageProps }) {
  useEffect(() => { warmUpBackend(); }, []);

  // Per-page layout: admin pages set Component.getLayout to skip the default Layout
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ErrorBoundary>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SocketProvider>
                <NotificationProvider>
                  <ScrollToTop />
                  <CapacitorInit />
                  <PushNotificationInit />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 3000,
                      style: { borderRadius: '12px', background: '#333', color: '#fff' },
                    }}
                  />
                  {getLayout(<Component {...pageProps} />)}
                  <CookieConsent />
                </NotificationProvider>
              </SocketProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}
