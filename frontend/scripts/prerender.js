const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

// Dynamically extract exam data for individual exam page pre-rendering
function getExamPages() {
  const examsFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'examsData.js'), 'utf8');
  const ids = [...examsFile.matchAll(/_id:\s*'([^']+)'/g)].map(m => m[1]);
  const titles = [...examsFile.matchAll(/title:\s*'([^']+)'/g)].map(m => m[1]);
  const categories = [...examsFile.matchAll(/category:\s*'([^']+)'/g)].map(m => m[1]);

  return ids.map((id, i) => ({
    route: `/exams/${id}`,
    title: `${titles[i]} - Eligibility, Syllabus, Dates | GovtExamPath`,
    description: `${titles[i]} exam details: eligibility, syllabus, exam pattern, important dates, salary, and how to apply. ${categories[i]} exam notification and preparation guide.`,
    content: `<h1>${titles[i]}</h1><p>Complete details for ${titles[i]} including eligibility criteria, syllabus, exam pattern, important dates, salary structure, and step-by-step application guide.</p><p>Category: ${categories[i]}</p><p><a href="/exams">Browse all government exams</a> | <a href="/eligibility-checker">Check your eligibility</a></p>`,
  }));
}

const pages = [
  {
    route: '/exams',
    title: 'Browse Government Exams | GovtExamPath',
    description: 'Browse 200+ government exam notifications including UPSC, SSC, Banking, Railways, Defence, State PSC. Find eligibility, syllabus, dates, and apply online.',
    content: '<h1>Browse Government Exams</h1><p>Explore 200+ government exams across UPSC, SSC, Banking, Railways, Defence, Teaching, Police, Insurance, State PSC, and GATE categories. Get eligibility details, syllabus, exam pattern, salary information, and direct application links.</p><ul><li><a href="/exams?category=UPSC">UPSC Exams</a> - Civil Services, NDA, CDS, ESE</li><li><a href="/exams?category=SSC">SSC Exams</a> - CGL, CHSL, MTS, GD Constable</li><li><a href="/exams?category=Banking">Banking Exams</a> - IBPS PO, SBI PO, RBI Grade B</li><li><a href="/exams?category=Railways">Railway Exams</a> - RRB NTPC, Group D, JE, ALP</li><li><a href="/exams?category=Defence">Defence Exams</a> - NDA, CDS, AFCAT, Indian Army</li><li><a href="/exams?category=State PSC">State PSC Exams</a> - UPPSC, MPPSC, BPSC, RPSC</li></ul>',
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
    description: 'Check your eligibility for 200+ government exams instantly. Enter your age, education, and category to find exams you qualify for.',
    content: '<h1>Eligibility Checker</h1><p>Check your eligibility for 200+ government exams instantly. Enter your age, educational qualification, and category to find all the government exams you are eligible for.</p><h2>Exams Covered</h2><p>UPSC CSE, SSC CGL, SSC CHSL, IBPS PO, SBI PO, RBI Grade B, RRB NTPC, NDA, CDS, AFCAT, CTET, UGC NET, State PSC exams and many more.</p>',
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
    content: '<h1>Current Affairs</h1><p>Stay updated with the latest current affairs relevant to government exams. Covering national, international, economy, science, and sports news.</p><h2>Latest Updates - May 2026</h2><ul><li>UPSC CSE Prelims 2026: May 24 - 933 Vacancies</li><li>RRB NTPC UG CBT-1: May 7-9 &amp; Jun 13-21</li><li>SSC CGL 2026 Notification Released: April 30</li><li>RRB NTPC Graduate CBT-1 Completed: March 2026</li><li>IBPS PO 2026: Prelims Aug 22-23, Mains Oct 4</li><li>NDA I Exam: April 12, NDA II: Sep 13</li><li>8th Pay Commission Approved</li><li>India Becomes 4th Largest Economy</li></ul>',
  },
  {
    route: '/blog',
    title: 'Exam Preparation Tips & Strategy Blog | GovtExamPath',
    description: 'Expert tips, strategies, and guides for government exam preparation. SSC CGL, UPSC, Banking, Railways preparation advice and study plans.',
    content: '<h1>Preparation Blog</h1><p>Expert strategies, tips, and guides for cracking government exams. Read articles on exam preparation, study plans, book recommendations, and career guidance.</p><ul><li><a href="/blog/how-to-prepare-for-ssc-cgl-2026">How to Prepare for SSC CGL 2026</a></li><li><a href="/blog/upsc-vs-state-psc-which-should-you-choose">UPSC vs State PSC Comparison</a></li><li><a href="/blog/best-books-for-upsc-preparation-2026">Best Books for UPSC 2026</a></li><li><a href="/blog/banking-exam-preparation-tips-ibps-sbi">Banking Exam Preparation Guide</a></li><li><a href="/blog/ssc-cgl-vs-chsl-difference-which-is-better">SSC CGL vs CHSL Comparison</a></li><li><a href="/blog/study-timetable-for-working-professionals">Study Plan for Working Professionals</a></li><li><a href="/blog/top-10-highest-paying-government-jobs-india">Top 10 Highest Paying Govt Jobs</a></li><li><a href="/blog/how-to-crack-government-exams-without-coaching">Self-Study Without Coaching</a></li><li><a href="/blog/upsc-csat-paper-2-strategy-qualify-easily">UPSC CSAT Strategy</a></li><li><a href="/blog/rrb-ntpc-vs-group-d-comparison-guide">Railway NTPC vs Group D</a></li><li><a href="/blog/government-exam-preparation-after-12th">Govt Exams After 12th</a></li><li><a href="/blog/common-mistakes-government-exam-preparation">10 Common Preparation Mistakes</a></li><li><a href="/blog/nda-cds-defence-exam-preparation-guide">NDA vs CDS Defence Exam Guide</a></li><li><a href="/blog/ctet-teaching-exam-preparation-guide-2026">CTET Teaching Exam Guide 2026</a></li><li><a href="/blog/lic-insurance-exam-preparation-guide">LIC & Insurance Exam Guide</a></li><li><a href="/blog/government-exam-calendar-2026-complete-schedule">Complete Exam Calendar 2026</a></li></ul>',
  },
  {
    route: '/blog/how-to-prepare-for-ssc-cgl-2026',
    title: 'How to Prepare for SSC CGL 2026: Complete Strategy Guide | GovtExamPath',
    description: 'Step-by-step SSC CGL 2026 preparation strategy covering Tier I and Tier II, subject-wise tips, time management, and book recommendations.',
    content: '<h1>How to Prepare for SSC CGL 2026: Complete Strategy Guide</h1><p>The SSC CGL is one of India\'s most sought-after government exams with 15,000+ vacancies for 2026. Get subject-wise strategy, 3-month study plan, and recommended books.</p>',
  },
  {
    route: '/blog/upsc-vs-state-psc-which-should-you-choose',
    title: 'UPSC vs State PSC: Which Should You Choose? | GovtExamPath',
    description: 'Detailed comparison of UPSC Civil Services and State PSC exams covering difficulty, syllabus, salary, career growth, and preparation strategy.',
    content: '<h1>UPSC vs State PSC: Which Should You Choose?</h1><p>Complete comparison of UPSC Civil Services and State PSC exams. Understand the differences in difficulty, salary, career growth, and the smart strategy to prepare for both.</p>',
  },
  {
    route: '/blog/best-books-for-upsc-preparation-2026',
    title: 'Best Books for UPSC Preparation 2026: Subject-Wise Booklist | GovtExamPath',
    description: 'Curated list of must-read books for UPSC CSE Prelims and Mains 2026. Subject-wise recommendations for History, Polity, Geography, Economy, and more.',
    content: '<h1>Best Books for UPSC Preparation 2026</h1><p>Subject-wise booklist recommended by toppers for UPSC Civil Services preparation including History, Polity, Geography, Economy, and Environment.</p>',
  },
  {
    route: '/blog/banking-exam-preparation-tips-ibps-sbi',
    title: 'Banking Exam Preparation: Complete Guide for IBPS PO & SBI PO 2026 | GovtExamPath',
    description: 'Master banking exam preparation with tips for IBPS PO and SBI PO 2026. Covers Prelims, Mains strategy, section-wise approach, and interview preparation.',
    content: '<h1>Banking Exam Preparation Guide</h1><p>Complete preparation strategy for IBPS PO and SBI PO 2026 covering Prelims, Mains, and interview with a 60-day study plan.</p>',
  },
  {
    route: '/blog/ssc-cgl-vs-chsl-difference-which-is-better',
    title: 'SSC CGL vs CHSL: Complete Difference Guide | GovtExamPath',
    description: 'Key differences between SSC CGL and SSC CHSL exams including eligibility, salary, posts, difficulty, and career growth.',
    content: '<h1>SSC CGL vs CHSL: Which Is Better for You?</h1><p>Comprehensive comparison of SSC CGL and CHSL covering eligibility, salary, exam pattern, difficulty level, and career growth prospects.</p>',
  },
  {
    route: '/blog/study-timetable-for-working-professionals',
    title: 'How to Prepare for Government Exams While Working | GovtExamPath',
    description: 'Realistic study timetable and tips for working professionals preparing for UPSC, SSC, Banking exams.',
    content: '<h1>Study Plan for Working Professionals</h1><p>Practical study timetable and productivity hacks for working professionals preparing for government exams alongside their job.</p>',
  },
  {
    route: '/blog/top-10-highest-paying-government-jobs-india',
    title: 'Top 10 Highest Paying Government Jobs in India 2026 | GovtExamPath',
    description: 'Discover the highest paying government jobs in India with salary details. From IAS to RBI Grade B, know the pay, perks, and selection process.',
    content: '<h1>Top 10 Highest Paying Government Jobs</h1><p>Complete guide to the highest paying government jobs in India including IAS, IPS, IFS, RBI Grade B, SEBI, NABARD, and Defence services with salary breakdowns.</p>',
  },
  {
    route: '/blog/how-to-crack-government-exams-without-coaching',
    title: 'How to Crack Government Exams Without Coaching | GovtExamPath',
    description: 'Complete self-study strategy for UPSC, SSC, Banking exams without coaching. Free resources, online tools, and study plan.',
    content: '<h1>Self-Study Guide for Government Exams</h1><p>Proven strategies to crack government exams without coaching. Free resources, study plans, and self-assessment techniques for self-study candidates.</p>',
  },
  {
    route: '/blog/upsc-csat-paper-2-strategy-qualify-easily',
    title: 'UPSC CSAT Paper 2 Strategy: How to Qualify Easily | GovtExamPath',
    description: 'Complete UPSC CSAT preparation strategy to score 66+ marks in comprehension, logical reasoning, math, and decision making.',
    content: '<h1>UPSC CSAT Paper 2 Strategy</h1><p>Score 66+ marks easily in UPSC CSAT with topic-wise strategy, 30-day preparation plan, and exam-day scoring approach.</p>',
  },
  {
    route: '/blog/rrb-ntpc-vs-group-d-comparison-guide',
    title: 'Railway NTPC vs Group D: Which Exam Should You Choose? | GovtExamPath',
    description: 'Comprehensive comparison of RRB NTPC and Railway Group D exams covering eligibility, salary, exam pattern, and career growth.',
    content: '<h1>Railway NTPC vs Group D Comparison</h1><p>Detailed comparison of RRB NTPC and Railway Group D exams including posts, salary, exam pattern, difficulty, and career growth in Indian Railways.</p>',
  },
  {
    route: '/blog/government-exam-preparation-after-12th',
    title: 'Government Exams After 12th: Complete List and Roadmap | GovtExamPath',
    description: 'Complete list of government exams after 12th pass. Covers SSC CHSL, Railway Group D, NDA, Defence, Police, and more.',
    content: '<h1>Government Exams After 12th</h1><p>Complete list of government exams you can appear for right after 12th including NDA, SSC CHSL, Railway Group D, Indian Army, Police, and India Post.</p>',
  },
  {
    route: '/blog/common-mistakes-government-exam-preparation',
    title: '10 Common Mistakes That Cause Failure in Government Exams | GovtExamPath',
    description: 'Avoid these 10 critical mistakes that most government exam aspirants make. Learn why candidates fail and fix your preparation.',
    content: '<h1>10 Common Preparation Mistakes</h1><p>Avoid these critical mistakes that cause 95% of candidates to fail government exams — from poor planning to ignoring mock tests.</p>',
  },
  {
    route: '/blog/nda-cds-defence-exam-preparation-guide',
    title: 'NDA vs CDS: Defence Exam Comparison & Preparation Guide 2026 | GovtExamPath',
    description: 'Detailed comparison of NDA and CDS exams covering eligibility, SSB interview, and career in Indian Armed Forces.',
    content: '<h1>NDA vs CDS: Defence Exam Guide 2026</h1><p>Complete comparison of NDA and CDS exams with SSB interview tips, career growth in Army, Navy, and Air Force.</p>',
  },
  {
    route: '/blog/ctet-teaching-exam-preparation-guide-2026',
    title: 'CTET & Teaching Exam Preparation Guide 2026 | GovtExamPath',
    description: 'Complete guide for CTET, KVS, NVS, UGC NET preparation. Paper-wise strategy and how to become a government teacher.',
    content: '<h1>Teaching Exam Guide 2026</h1><p>CTET Paper I & II strategy, KVS/NVS recruitment process, UGC NET preparation, and salary details for government teachers.</p>',
  },
  {
    route: '/blog/lic-insurance-exam-preparation-guide',
    title: 'LIC AAO & Insurance Exam Preparation Guide 2026 | GovtExamPath',
    description: 'Complete preparation strategy for LIC AAO, NICL AO, OICL AO insurance exams with insurance awareness tips.',
    content: '<h1>Insurance Exam Guide 2026</h1><p>LIC AAO, NICL AO, OICL AO exam pattern, insurance awareness topics, and career growth in public sector insurance.</p>',
  },
  {
    route: '/blog/government-exam-calendar-2026-complete-schedule',
    title: 'Complete Government Exam Calendar 2026 | GovtExamPath',
    description: 'Month-wise schedule of all major government exams in 2026. UPSC, SSC, Banking, Railways, Defence exam dates.',
    content: '<h1>Government Exam Calendar 2026</h1><p>Complete month-wise schedule of all 200+ government exams in 2026 including UPSC, SSC, Banking, Railways, Defence, Teaching, Police, and Insurance.</p>',
  },
  {
    route: '/about',
    title: 'About Us | GovtExamPath',
    description: 'Learn about GovtExamPath — India\'s free career guidance platform for government exam aspirants. Our mission, team, and how we help lakhs of students.',
    content: '<h1>About GovtExamPath</h1><p>India\'s free career guidance platform helping government exam aspirants find the right path to their dream job.</p><h2>Our Mission</h2><p>Make government exam guidance accessible to every student in India, for free. We provide AI-powered career recommendations, eligibility checking, interactive syllabus mind maps, curated study resources, daily current affairs, and expert preparation guides.</p><h2>What We Offer</h2><ul><li>AI Career Guide — Personalized exam recommendations</li><li>Eligibility Checker — Instant eligibility check for 200+ exams</li><li>Free Study Resources — 24+ study materials and previous year papers</li><li>200+ Exam Coverage — UPSC, SSC, Banking, Railways, Defence, State PSC, Teaching, Police, Insurance, PSU, Regulatory Bodies, Judiciary, Healthcare, Postal, Agriculture, Miscellaneous</li></ul>',
  },
  {
    route: '/contact',
    title: 'Contact Us | GovtExamPath',
    description: 'Get in touch with the GovtExamPath team. We\'re here to help with questions about government exams, eligibility, and platform features.',
    content: '<h1>Contact Us</h1><p>Have a question or feedback? We\'d love to hear from you.</p><ul><li>Email: govtexampath@gmail.com</li><li>Response Time: Within 24 hours</li><li>Location: India</li></ul><p>Use our contact form to send us a message.</p>',
  },
  {
    route: '/privacy-policy',
    title: 'Privacy Policy | GovtExamPath',
    description: 'GovtExamPath privacy policy. Learn how we collect, use, and protect your personal information.',
    content: '<h1>Privacy Policy</h1><p>Last updated: April 16, 2026</p><h2>Information We Collect</h2><p>Account information, usage data, device information, and preferences.</p><h2>How We Use Your Information</h2><p>Personalized recommendations, saved bookmarks, exam notifications, and platform improvement.</p><h2>Data Security</h2><p>Passwords hashed with bcrypt, HTTPS encryption, JWT authentication, and rate limiting.</p><h2>Your Rights</h2><p>Access, update, or delete your data. Opt out of notifications. Disable cookies.</p>',
  },
  {
    route: '/terms-of-service',
    title: 'Terms of Service | GovtExamPath',
    description: 'GovtExamPath terms of service. Read our terms and conditions for using the platform.',
    content: '<h1>Terms of Service</h1><p>Last updated: April 24, 2026. By using GovtExamPath, you agree to these terms.</p>',
  },
  {
    route: '/disclaimer',
    title: 'Disclaimer | GovtExamPath',
    description: 'GovtExamPath disclaimer. Important information about our exam data accuracy and limitations.',
    content: '<h1>Disclaimer</h1><p>The information on GovtExamPath is for general guidance. Always verify exam details from official sources.</p>',
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

// Add dynamically generated exam detail pages
const allPages = [...pages, ...getExamPages()];

let created = 0;

for (const page of allPages) {
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

  // Add canonical URL and robots tag
  html = html.replace(
    '</head>',
    `<link rel="canonical" href="https://govtexampath.com${page.route}" />\n<meta name="robots" content="index, follow" />\n</head>`
  );

  // Set og:url
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="https://govtexampath.com${page.route}"`
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

console.log(`Pre-rendered ${created} pages (${pages.length} static + ${created - pages.length} exam detail pages).`);
