import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://govtexampath.com';

const Breadcrumb = ({ items = [] }) => {
  // Build the full breadcrumb list starting with Home
  const allItems = [{ label: 'Home', to: '/' }, ...items];

  // Build JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => {
      const entry = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
      };
      // Include "item" URL for all items that have a link (not the current/last page)
      if (item.to) {
        entry.item = `${BASE_URL}${item.to}`;
      }
      return entry;
    }),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
        {allItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === allItems.length - 1;

          return (
            <li key={item.to || item.label} className="flex items-center gap-1.5">
              {/* Separator before every item except the first */}
              {!isFirst && (
                <FiChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
              )}

              {isLast ? (
                // Current page - not a link
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {isFirst && <FiHome className="inline w-3.5 h-3.5 mr-1" />}
                  {item.label}
                </span>
              ) : (
                // Clickable breadcrumb
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
