import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path, jsonLd }) => {
  const siteName = 'GovtExamPath';
  const baseUrl = 'https://govtexampath.com';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - India's Free Career Guidance Platform for Government Jobs`;
  const fullUrl = path ? `${baseUrl}${path}` : baseUrl;
  const defaultDesc = 'AI-powered career guidance for government exam aspirants. Explore 85+ exams, check eligibility, get personalized recommendations, and access free preparation resources.';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    description: defaultDesc,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/exams?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo512.png`,
    sameAs: [
      'https://twitter.com/govtexampath',
      'https://facebook.com/govtexampath',
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      {!path || path === '/' ? (
        <>
          <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
          <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        </>
      ) : null}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default SEO;
