/**
 * Pre-render script: generates unique HTML files per route at build time.
 * Each page gets its own <title>, <meta description>, and static content
 * so crawlers that don't execute JS still see unique content per URL.
 */
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

const pages = [
  {
    route: '/exams',
    title: 'Browse Government Exams | GovtExamPath',
    description: 'Browse 85+ government exam notifications including UPSC, SSC, Banking, Railways, Defence, State PSC. Find eligibility, syllabus, dates, and apply online.',
    content: '<h1>Browse Government Exams</h1><p>Explore 85+ government exams across UPSC, SSC, Banking, Railways, Defence, Teaching, Police, Insurance, State PSC, and GATE categories. Get eligibility details, syllabus, exam pattern, salary information, and direct application links.</p><ul><li><a href="/exams?category=UPSC">UPSC Exams</a> - Civil Services, NDA, CDS, ESE</li><li><a href="/exams?category=SSC">SSC Exams</a> - CGL, CHSL, MTS, GD Constable</li><li><a href="/exams?category=Banking">Banking Exams</a> - IBPS PO, SBI PO, RBI Grade B</li><li><a href="/exams?category=Railways">Railway Exams</a> - RRB NTPC, Group D, JE, ALP</li><li><a href="/exams?category=Defence">Defence Exams</a> - NDA, CDS, AFCAT, Indian Army</li><li><a href="/exams?category=State PSC">State PSC Exams</a> - UPPSC, MPPSC, BPSC, RPSC</li></ul>',
  },
  {
    route: '/ai-guide',
    title: 'AI Career Guide for Government Exams | GovtExamPath',
    description: 'Get personalized government exam recommendations based on your education, age, and interests. AI-powered career guidance for UPSC, SSC, Banking, and more.',
    content: '<h1>AI Career Guide</h1><p>Get personalized government exam recommendations using our AI-powered career guide. Answer a few questions about your education, age, and career preferences to discover the best government exams for you.</p><h2>How It Works</h2><ol><li>Enter your educational qualification</li><li>Provide your age and preferences</li><li>Get personalized exam recommendations</li><li>View detailed exam information and apply</li></ol>',
  },
  {
    route: '/eligibility-checker',
    title: 'Government Exam Eligibility Checker | GovtExamPath',
    description: 'Check your eligibility for 85+ government exams instantly. Enter your age, education, and category to find exams you qualify for.',
    content: '<h1>Eligibility Checker</h1><p>Check your eligibility for 85+ government exams instantly. Enter your age, educational qualification, and category to find all the government exams you are eligible for.</p><h2>Exams Covered</h2><p>UPSC CSE, SSC CGL, SSC CHSL, IBPS PO, SBI PO, RBI Grade B, RRB NTPC, NDA, CDS, AFCAT, CTET, UGC NET, State PSC exams and many more.</p>',
  },
  {
    route: '/mind-maps',
    title: 'Syllabus Mind Maps for Government Exams | GovtExamPath',
    description: 'Interactive syllabus mind maps for UPSC, SSC, Banking, Railways, and Defence exams. Visual topic breakdowns to plan your preparation effectively.',
    content: '<h1>Syllabus Mind Maps</h1><p>Interactive, expandable syllabus mind maps for all major government exams. Visualize the complete syllabus structure and plan your preparation effectively.</p><h2>Available Mind Maps</h2><ul><li>UPSC Civil Services - Prelims &amp; Mains</li><li>SSC CGL - Tier I &amp; Tier II</li><li>Banking - IBPS PO, SBI PO</li><li>Railways - RRB NTPC, Group D</li><li>Defence - NDA, CDS, AFCAT</li></ul>',
  },
  {
    route: '/resources',
    title: 'Free Study Resources for Government Exams | GovtExamPath',
    description: 'Download free study materials, previous year papers, syllabus PDFs and preparation guides for UPSC, SSC, Banking, Railways and other government exams.',
    content: '<h1>Free Study Resources</h1><p>Access 24+ free study resources including notes, previous year question papers, and book recommendations for government exam preparation.</p><h2>Resource Categories</h2><ul><li>UPSC - Prelims notes, previous year papers, booklist</li><li>SSC - CGL study material, quantitative aptitude guides</li><li>Banking - IBPS PO guides, banking awareness capsules</li><li>Railways - RRB NTPC preparation kit, Group D papers</li><li>Defence - NDA guide, CDS previous papers</li><li>Teaching - CTET material, UGC NET notes</li></ul>',
  },
  {
    route: '/current-affairs',
    title: 'Current Affairs for Government Exams | GovtExamPath',
    description: 'Daily current affairs for government exam preparation. National, international, economy, science, and sports updates for UPSC, SSC, Banking exams.',
    content: '<h1>Current Affairs</h1><p>Stay updated with the latest current affairs relevant to government exams. Covering national, international, economy, science, and sports news.</p><h2>Latest Updates - April 2026</h2><ul><li>SSC CGL 2026 Notification: 15,000+ Vacancies</li><li>RBI Cuts Repo Rate to 5.75%</li><li>UPSC CSE Prelims 2026: June 1 Confirmed</li><li>India-EU Free Trade Agreement Signed</li><li>ISRO Gaganyaan G2 Mission in May 2026</li><li>IBPS PO 2026 Prelims Results Declared</li><li>8th Pay Commission Approved</li><li>India Becomes 4th Largest Economy</li></ul>',
  },
  {
    route: '/blog',
    title: 'Exam Preparation Tips & Strategy Blog | GovtExamPath',
    description: 'Expert tips, strategies, and guides for government exam preparation. SSC CGL, UPSC, Banking, Railways preparation advice and study plans.',
    content: '<h1>Preparation Blog</h1><p>Expert strategies, tips, and guides for cracking government exams. Read articles on exam preparation, study plans, book recommendations, and career guidance.</p>',
  },
  {
    route: '/login',
    title: 'Login | GovtExamPath',
    description: 'Login to your GovtExamPath account to access bookmarks, personalized recommendations, and exam notifications.',
    content: '<h1>Login to GovtExamPath</h1><p>Sign in to access your bookmarked exams, personalized recommendations, and notification preferences.</p>',
  },
  {
    route: '/register',
    title: 'Create Account | GovtExamPath',
    description: 'Create a free GovtExamPath account. Get personalized exam recommendations, bookmark exams, and receive notification alerts.',
    content: '<h1>Create Your Free Account</h1><p>Join GovtExamPath to get personalized exam recommendations, bookmark your favorite exams, and receive timely notification alerts. Completely free.</p>',
  },
];

let created = 0;

for (const page of pages) {
  // Replace title
  let html = indexHtml.replace(
    /<title>[^<]*<\/title>/,
    `<title>${page.title}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${page.description}"`
  );

  // Replace og:title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${page.title}"`
  );

  // Replace og:description
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${page.description}"`
  );

  // Add canonical URL
  html = html.replace(
    '</head>',
    `<link rel="canonical" href="https://govtexampath.com${page.route}" />\n</head>`
  );

  // Add static content inside the root div for crawlers
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><div style="max-width:800px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">${page.content}</div></div>`
  );

  // Create directory and write file
  const dir = path.join(buildDir, page.route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  created++;
}

console.log(`Pre-rendered ${created} pages with unique meta tags and content.`);
