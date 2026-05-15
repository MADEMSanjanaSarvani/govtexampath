import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from '../common/Breadcrumb';
import HelpBot from '../common/HelpBot';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Breadcrumb />
      <main className="flex-1">{children}</main>
      <Footer />
      <HelpBot />
    </div>
  );
};

export default Layout;
