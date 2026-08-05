import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Footer from './Footer';

// Lazy-loaded so the ~480KB examsData.js it imports for smart-reply matching
// isn't bundled into every page's initial JS — only fetched once the chat
// widget actually mounts on the client.
const HelpBot = dynamic(() => import('../common/HelpBot'), { ssr: false });

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <HelpBot />
    </div>
  );
};

export default Layout;
