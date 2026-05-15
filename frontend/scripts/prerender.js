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
    description: 'Interactive flow-chart syllabus mind maps for UPSC, SSC, Banking, Railways, Defence, Teaching, and State PSC exams. Visual topic breakdowns for effective preparation.',
    content: '<h1>Syllabus Mind Maps</h1><p>Interactive flow-chart style syllabus mind maps for all major government exams. Visualize the complete syllabus structure with expandable nodes and plan your preparation effectively.</p><h2>Available Mind Maps</h2><ul><li>UPSC Civil Services - Prelims (GS I &amp; CSAT) &amp; Mains (GS I-IV, Ethics, Essay)</li><li>SSC - CGL Tier I &amp; II, CHSL</li><li>Banking - IBPS PO Prelims &amp; Mains, SBI PO</li><li>Railways - RRB NTPC CBT-1, Group D</li><li>Defence - NDA, CDS, AFCAT</li><li>Teaching - CTET Paper I, UGC NET</li><li>State PSC - General Pattern with State-Specific GK</li></ul><h2>How to Use</h2><p>Click on any exam node to expand its syllabus topics. Each topic further breaks down into subtopics for detailed study planning. Use the category filters to focus on your target exam.</p>',
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
    route: '/faq',
    title: 'FAQ - Government Exam Questions Answered | GovtExamPath',
    description: 'Frequently asked questions about government exams in India. Get answers about UPSC, SSC, Banking, Railways eligibility, preparation, age relaxation, and more.',
    content: '<h1>Frequently Asked Questions</h1><h2>General Questions</h2><p><strong>What are government exams?</strong> Government exams are competitive examinations conducted by central and state bodies like UPSC, SSC, IBPS, and RRB to recruit candidates for public sector positions.</p><p><strong>Why choose a government job?</strong> Government jobs offer job security, pension, fixed working hours, housing allowances, healthcare benefits, and social prestige.</p><h2>Eligibility & Age</h2><p><strong>What is the minimum qualification?</strong> It varies — SSC MTS requires 10th pass, SSC CHSL requires 12th, while UPSC and Banking exams require graduation.</p><p><strong>Age relaxation rules:</strong> SC/ST get 5 years, OBC gets 3 years, PwD gets 10 years relaxation over the general category upper age limit.</p><h2>Preparation</h2><p><strong>How long to prepare?</strong> 3-6 months for SSC/Banking exams, 12-18 months for UPSC. Use our <a href="/eligibility-checker">Eligibility Checker</a> and <a href="/ai-guide">AI Career Guide</a> to plan your journey.</p>',
  },
  {
    route: '/blog/top-10-government-exams-after-12th-class-india-2026',
    title: 'Top 10 Government Exams After 12th Class in India 2026 | GovtExamPath',
    description: 'Complete guide to the best government exams after 12th class including SSC CHSL, NDA, Railway NTPC, Police, and more.',
    content: '<h1>Top 10 Government Exams After 12th Class</h1><p>Best government exams for 12th pass candidates including SSC CHSL, NDA, SSC GD, Agniveer, Railway NTPC, Indian Navy, India Post GDS, State Police, and DSSSB.</p>',
  },
  {
    route: '/blog/ibps-po-vs-sbi-po-complete-comparison-guide',
    title: 'IBPS PO vs SBI PO: Complete Comparison Guide 2026 | GovtExamPath',
    description: 'Detailed comparison of IBPS PO and SBI PO covering eligibility, salary, exam pattern, difficulty, and career growth.',
    content: '<h1>IBPS PO vs SBI PO Comparison</h1><p>Complete comparison of IBPS PO and SBI PO exams covering salary, exam pattern, difficulty level, career growth, and preparation strategy.</p>',
  },
  {
    route: '/blog/how-to-create-study-timetable-government-exam-preparation',
    title: 'How to Create a Study Timetable for Government Exams | GovtExamPath',
    description: 'Step-by-step guide to creating an effective study timetable with sample schedules for full-time aspirants and working professionals.',
    content: '<h1>Study Timetable Guide</h1><p>Create an effective study timetable using the 60-20-20 rule. Includes sample timetables for full-time aspirants and working professionals.</p>',
  },
  {
    route: '/blog/best-free-online-resources-government-exam-preparation-2026',
    title: 'Best Free Online Resources for Government Exam Preparation 2026 | GovtExamPath',
    description: 'Curated list of best free websites, apps, YouTube channels for UPSC, SSC, Banking, Railways exam preparation.',
    content: '<h1>Best Free Resources for Government Exams</h1><p>Curated list of free official websites, YouTube channels, apps, and mock test platforms for government exam preparation.</p>',
  },
  {
    route: '/blog/government-exam-age-relaxation-rules-sc-st-obc-pwd',
    title: 'Government Exam Age Relaxation Rules for SC/ST/OBC/PwD | GovtExamPath',
    description: 'Complete guide to age relaxation rules in government exams for SC, ST, OBC, PwD, and ex-servicemen with exam-wise details.',
    content: '<h1>Age Relaxation Rules</h1><p>Complete guide to age relaxation for SC (5 years), ST (5 years), OBC (3 years), PwD (10 years), and ex-servicemen in all major government exams.</p>',
  },
  {
    route: '/blog/monthly-current-affairs-revision-strategy-competitive-exams',
    title: 'Monthly Current Affairs Revision Strategy for Competitive Exams | GovtExamPath',
    description: 'Proven strategy to revise and retain current affairs for UPSC, SSC, Banking exams with categorization method and memory techniques.',
    content: '<h1>Current Affairs Revision Strategy</h1><p>Proven 4-step monthly revision system for current affairs covering daily collection, weekly compilation, monthly revision, and quarterly deep review.</p>',
  },
  {
    route: '/exam-calendar',
    title: 'Exam Calendar 2026 - Upcoming Government Exam Dates | GovtExamPath',
    description: 'Complete government exam calendar 2026 with month-wise exam dates for UPSC, SSC, Banking, Railways, Defence and more.',
    content: '<h1>Exam Calendar 2026</h1><p>Month-by-month schedule of upcoming government exam dates including application deadlines, exam dates, and result dates for all major exams.</p>',
  },
  {
    route: '/admit-card',
    title: 'Latest Admit Cards 2026 - Download Government Exam Hall Tickets | GovtExamPath',
    description: 'Download latest government exam admit cards and hall tickets. Direct links to official admit card portals for UPSC, SSC, Banking, Railways.',
    content: '<h1>Latest Admit Cards 2026</h1><p>Download admit cards for all major government exams. Direct links to official conducting body websites for UPSC, SSC, IBPS, RRB, and more.</p>',
  },
  {
    route: '/results',
    title: 'Latest Government Exam Results 2026 - Check Your Score | GovtExamPath',
    description: 'Check latest government exam results. Direct links to official result portals for UPSC, SSC, Banking, Railways, Defence exams.',
    content: '<h1>Latest Government Exam Results 2026</h1><p>Check results for all major government exams. Direct links to official result pages for UPSC, SSC, IBPS, RRB, and more.</p>',
  },
  {
    route: '/compare',
    title: 'Compare Government Exams Side by Side | GovtExamPath',
    description: 'Compare any two government exams side by side - salary, eligibility, difficulty, exam pattern, vacancies, and more. UPSC vs SSC, Banking vs Railways.',
    content: '<h1>Compare Government Exams</h1><p>Select any two government exams and compare them side by side across salary, eligibility, age limit, vacancies, exam pattern, and difficulty level. Popular comparisons: SSC CGL vs IBPS PO, UPSC vs State PSC, NDA vs CDS.</p>',
  },
  {
    route: '/prep-time-estimator',
    title: 'Preparation Time Estimator for Government Exams | GovtExamPath',
    description: 'Calculate how much time you need to prepare for any government exam based on your education, background, and available study hours.',
    content: '<h1>Preparation Time Estimator</h1><p>Get a personalized preparation timeline for any government exam. Our estimator considers your education level, prior preparation, daily study hours, and working status to give you a realistic preparation plan.</p>',
  },
  {
    route: '/blog/how-to-crack-ssc-cgl-first-attempt',
    title: 'How to Crack SSC CGL in First Attempt | GovtExamPath',
    description: 'Complete strategy guide to crack SSC CGL in your first attempt with subject-wise tips, study plan, and mock test strategy.',
    content: '<h1>How to Crack SSC CGL in First Attempt</h1><p>Comprehensive strategy covering exam pattern, subject-wise preparation, 6-month study plan, best books, and time management tips.</p>',
  },
  {
    route: '/blog/upsc-cse-preparation-strategy-beginners-2026',
    title: 'UPSC CSE Preparation Strategy for Beginners 2026 | GovtExamPath',
    description: 'Complete UPSC Civil Services preparation strategy for beginners covering Prelims, Mains, and Interview.',
    content: '<h1>UPSC CSE Preparation Strategy</h1><p>Step-by-step guide for UPSC beginners covering optional subject selection, NCERT foundation, answer writing, and 12-month study plan.</p>',
  },
  {
    route: '/blog/bank-po-interview-preparation-tips-questions',
    title: 'Bank PO Interview Preparation Tips and Questions | GovtExamPath',
    description: 'Bank PO interview preparation guide with common questions, body language tips, and document checklist.',
    content: '<h1>Bank PO Interview Preparation</h1><p>Complete interview guide covering common questions, dress code, body language tips, and mock interview practice strategies.</p>',
  },
  {
    route: '/blog/rrb-ntpc-complete-guide-2026',
    title: 'RRB NTPC Complete Guide 2026 | GovtExamPath',
    description: 'Complete RRB NTPC exam guide covering eligibility, syllabus, exam pattern, preparation strategy, and salary details.',
    content: '<h1>RRB NTPC Complete Guide</h1><p>Everything about RRB NTPC including posts, eligibility, CBT 1 and 2 patterns, subject-wise strategy, and career growth.</p>',
  },
  {
    route: '/blog/nda-exam-preparation-strategy-12th-pass',
    title: 'NDA Exam Preparation Strategy for 12th Pass | GovtExamPath',
    description: 'NDA exam preparation guide for 12th pass students covering exam pattern, SSB interview, and physical fitness.',
    content: '<h1>NDA Exam Preparation</h1><p>Complete NDA guide covering eligibility, Maths and GAT preparation, SSB interview tips, and physical fitness requirements.</p>',
  },
  {
    route: '/blog/state-psc-vs-upsc-which-should-you-choose',
    title: 'State PSC vs UPSC Comparison Guide | GovtExamPath',
    description: 'Detailed comparison of State PSC and UPSC exams covering difficulty, salary, preparation, and career growth.',
    content: '<h1>State PSC vs UPSC</h1><p>Complete comparison of difficulty level, salary structure, posting locations, and dual preparation strategy.</p>',
  },
  {
    route: '/blog/ssc-mts-complete-guide-10th-pass-2026',
    title: 'SSC MTS Complete Guide for 10th Pass 2026 | GovtExamPath',
    description: 'SSC MTS complete guide for 10th pass candidates with exam pattern, syllabus, and preparation strategy.',
    content: '<h1>SSC MTS Guide</h1><p>Everything about SSC MTS including posts, eligibility, exam pattern, preparation strategy, and 7th CPC salary details.</p>',
  },
  {
    route: '/blog/prepare-government-exams-while-working',
    title: 'How to Prepare for Government Exams While Working | GovtExamPath',
    description: 'Practical tips for working professionals preparing for government exams with time management strategies.',
    content: '<h1>Prepare While Working</h1><p>Time management strategies, weekend study plans, and realistic goal setting for working professionals.</p>',
  },
  {
    route: '/blog/top-5-mistakes-government-exam-aspirants',
    title: 'Top 5 Mistakes Government Exam Aspirants Make | GovtExamPath',
    description: 'Common mistakes government exam aspirants make and how to avoid them for better preparation.',
    content: '<h1>Top 5 Mistakes</h1><p>Avoid these common pitfalls: no study plan, skipping mock tests, over-relying on coaching, neglecting revision, and poor health.</p>',
  },
  {
    route: '/blog/ibps-clerk-vs-sbi-clerk-comparison-2026',
    title: 'IBPS Clerk vs SBI Clerk Comparison 2026 | GovtExamPath',
    description: 'Complete comparison of IBPS Clerk and SBI Clerk covering salary, exam pattern, and career growth.',
    content: '<h1>IBPS Clerk vs SBI Clerk</h1><p>Detailed comparison of eligibility, exam pattern, salary structure, posting locations, and career growth paths.</p>',
  },
  {
    route: '/blog/physical-fitness-test-guide-defence-police',
    title: 'Physical Fitness Test Guide for Defence and Police Exams | GovtExamPath',
    description: 'Complete PET/PST guide for defence and police exams with training plans and fitness requirements.',
    content: '<h1>Physical Fitness Test Guide</h1><p>PET requirements for NDA, CDS, CAPF, State Police, SSC GD with training plans and diet tips.</p>',
  },
  {
    route: '/blog/indian-railway-exams-complete-career-path',
    title: 'Indian Railway Exams Career Path Guide | GovtExamPath',
    description: 'Complete guide to Indian Railway recruitment exams covering all groups, salary, and career progression.',
    content: '<h1>Railway Exams Career Path</h1><p>Overview of Group A/B/C/D recruitment, RRB NTPC, Group D, ALP, JE, RPF with salary and benefits.</p>',
  },
  {
    route: '/blog/best-books-government-exam-preparation-subject-wise',
    title: 'Best Books for Government Exam Preparation Subject-Wise | GovtExamPath',
    description: 'Subject-wise best books for government exam preparation including Maths, Reasoning, English, and GK.',
    content: '<h1>Best Books Subject-Wise</h1><p>Recommended books for Maths, Reasoning, English, GK, Polity, History, Geography, and Economy.</p>',
  },
  {
    route: '/blog/how-to-stay-motivated-government-exam-preparation',
    title: 'How to Stay Motivated During Government Exam Preparation | GovtExamPath',
    description: 'Tips to stay motivated during long government exam preparation journey.',
    content: '<h1>Staying Motivated</h1><p>Dealing with failure, setting goals, study groups, exercise, social media detox, and celebrating small wins.</p>',
  },
  {
    route: '/blog/post-graduation-government-jobs-top-exams',
    title: 'Post-Graduation Government Jobs: Top Exams for PG Holders | GovtExamPath',
    description: 'Top government exams for post-graduation holders including UGC NET, RBI Grade B, SEBI Grade A.',
    content: '<h1>PG Government Jobs</h1><p>Top exams for PG holders: UGC NET, RBI Grade B, SEBI Grade A, NABARD, UPSC CSE, and university lecturer positions.</p>',
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
