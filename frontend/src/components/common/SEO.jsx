import Head from 'next/head';

// Prevents </script> injection in JSON-LD blocks (XSS via user-sourced field values)
const safeJsonLd = (obj) => JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>');

const SEO = ({ title, description, path, jsonLd, noindex = false, article, breadcrumbs, image, lang = 'en' }) => {
  const siteName = 'GovtExamPath';
  const baseUrl = 'https://govtexampath.com';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - India's Free Career Guidance Platform for Government Jobs`;
  const fullUrl = path ? `${baseUrl}${path}` : baseUrl;
  const defaultDesc = 'Free career guidance for government exam aspirants. Explore 500+ exams, check eligibility, find your best-fit exams, and access free preparation resources.';

  const ogImage = image || `${baseUrl}/og-image.png`;
  const ogImageType = image?.endsWith('.svg') ? 'image/svg+xml' : 'image/png';

  const langMap = { en: 'en_IN', hi: 'hi_IN', te: 'te_IN' };
  const ogLocale = langMap[lang] || 'en_IN';

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
    sameAs: ['https://instagram.com/govtexampath'],
  };

  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title || title,
    description: article.description || description || defaultDesc,
    author: { '@type': 'Organization', name: article.author || siteName },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo512.png` },
    },
    datePublished: article.datePublished,
    ...(article.dateModified && { dateModified: article.dateModified }),
    url: fullUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
    ...(article.image && { image: article.image }),
  } : null;

  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      ...breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.name,
        ...(crumb.url && { item: `${baseUrl}${crumb.url}` }),
      })),
    ],
  } : null;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={fullUrl} />

      <link rel="alternate" hrefLang="en" href={fullUrl} />
      <link rel="alternate" hrefLang="hi" href={fullUrl} />
      <link rel="alternate" hrefLang="te" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content={ogImageType} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />
      <meta property="og:locale:alternate" content="te_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@govtexampath" />
      <meta name="twitter:creator" content="@govtexampath" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={ogImage} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {(!path || path === '/') && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }} />
        </>
      )}
      {jsonLd && (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      ))}
      {articleSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }} />}
      {breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />}

      {article && article.datePublished && <meta property="article:published_time" content={article.datePublished} />}
      {article && article.dateModified && <meta property="article:modified_time" content={article.dateModified} />}
      {article && article.author && <meta property="article:author" content={article.author} />}
    </Head>
  );
};

export default SEO;
