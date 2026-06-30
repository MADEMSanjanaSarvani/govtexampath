/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/statepsc', destination: '/exams?category=State+PSC', permanent: true },
      { source: '/state-psc', destination: '/exams?category=State+PSC', permanent: true },
      { source: '/teaching', destination: '/exams?category=Teaching', permanent: true },
      { source: '/police', destination: '/exams?category=Police', permanent: true },
      { source: '/insurance', destination: '/exams?category=Insurance', permanent: true },
      { source: '/upsc', destination: '/exams?category=UPSC', permanent: true },
      { source: '/ssc', destination: '/exams?category=SSC', permanent: true },
      { source: '/banking', destination: '/exams?category=Banking', permanent: true },
      { source: '/railways', destination: '/exams?category=Railways', permanent: true },
      { source: '/defence', destination: '/exams?category=Defence', permanent: true },
      { source: '/gate', destination: '/exams?category=Miscellaneous', permanent: true },
      { source: '/appsc', destination: '/exams?category=State+PSC', permanent: true },
      { source: '/tspsc', destination: '/exams?category=State+PSC', permanent: true },
      { source: '/psu', destination: '/exams?category=PSU', permanent: true },
      { source: '/regulatory-bodies', destination: '/exams?category=Regulatory+Bodies', permanent: true },
      { source: '/judiciary', destination: '/exams?category=Judiciary', permanent: true },
      { source: '/agriculture', destination: '/exams?category=Agriculture', permanent: true },
      { source: '/postal', destination: '/exams?category=Postal', permanent: true },
      { source: '/healthcare', destination: '/exams?category=Healthcare', permanent: true },
      { source: '/other-exams', destination: '/exams', permanent: true },
      { source: '/other', destination: '/exams', permanent: true },
    ];
  },
};

module.exports = nextConfig;
