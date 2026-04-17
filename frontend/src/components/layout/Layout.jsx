import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from '../common/Breadcrumb';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Breadcrumb />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
