import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path }) => {
  const siteName = 'GovtExamPath';
  const baseUrl = 'https://govtexampath.com';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - India's Free Career Guidance Platform for Government Jobs`;
  const fullUrl = path ? `${baseUrl}${path}` : baseUrl;
  const defaultDesc = 'AI-powered career guidance for government exam aspirants. Explore 50+ exams, check eligibility, get personalized recommendations, and access free preparation resources.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
    </Helmet>
  );
};

export default SEO;
