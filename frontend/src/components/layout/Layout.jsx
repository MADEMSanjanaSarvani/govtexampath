import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import useIsNativeApp from '../../hooks/useIsNativeApp';

// Lazy-loaded so the ~480KB examsData.js it imports for smart-reply matching
// isn't bundled into every page's initial JS — only fetched once the chat
// widget actually mounts on the client.
const HelpBot = dynamic(() => import('../common/HelpBot'), { ssr: false });

const Layout = ({ children }) => {
  // The website and the Android app are the same build, so the app was showing
  // the site's chrome — top navbar, hamburger, footer full of policy links —
  // which is what made it read as a web page rather than an app. Only the shell
  // gets the tab bar; the website keeps the layout it has.
  const isNativeApp = useIsNativeApp();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <Navbar />
      {/* The tab bar is fixed, so it overlays the end of the page. Without this
          padding the last card on every screen sits underneath it and cannot be
          reached. 4.5rem covers the 56px row, and the inset keeps it clear of the
          gesture bar as well. */}
      <main
        id="main-content"
        className="flex-1"
        style={isNativeApp ? { paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' } : undefined}
      >
        {children}
      </main>

      {/* A footer of About / Privacy / Terms links is a website convention and
          reads as one. Those routes are still reachable from Profile. */}
      {!isNativeApp && <Footer />}

      {/* The chat widget floats bottom-right, exactly where the tab bar now is.
          Leaving both would put a button on top of the navigation. */}
      {!isNativeApp && <HelpBot />}

      {isNativeApp && <BottomNav />}
    </div>
  );
};

export default Layout;
