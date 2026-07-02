import React from 'react';
import Head from 'next/head';
import { Link, useLocation } from '@/lib/router';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const safeJsonLd = (obj) => JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>');

const BASE_URL = 'https://govtexampath.com';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();

  // Hide breadcrumb on homepage — it just shows "Home" which is redundant
  if (location.pathname === '/') return null;

  const allItems = [{ label: 'Home', to: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => {
      const entry = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
      };
      if (item.to) {
        entry.item = `${BASE_URL}${item.to}`;
      }
      return entry;
    }),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      </Head>
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
        {allItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === allItems.length - 1;

          return (
            <li key={item.to || item.label} className="flex items-center gap-1.5">
              {!isFirst && (
                <FiChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
              )}

              {isLast ? (
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {isFirst && <FiHome className="inline w-3.5 h-3.5 mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  {isFirst && <FiHome className="w-3.5 h-3.5" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
