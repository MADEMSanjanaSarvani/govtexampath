import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMap, FiCalendar, FiClock, FiBookOpen, FiCheckCircle, FiChevronDown, FiChevronUp, FiPrinter, FiTarget, FiAward, FiTrendingUp, FiZap } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

// ─── Exam syllabus data ───────────────────────────────────────────────────────
const EXAM_DATA = {
  'UPSC CSE': {
    subjects: ['History', 'Geography', 'Polity', 'Economics', 'Environment', 'Science', 'Ethics', 'Essay', 'Optional'],
    phases: {
      foundation: {
        title: 'Foundation — Core Subjects',
        topics: [
          'Ancient Indian History (Indus Valley, Vedic Age, Mauryas, Guptas)',
          'Medieval Indian History (Delhi Sultanate, Mughal Empire, Bhakti & Sufi)',
          'Modern Indian History (British Rule, Freedom Struggle, Post-Independence)',
          'Indian Geography (Physical, Climate, Rivers, Soils, Natural Vegetation)',
          'Indian Polity (Constitution, Fundamental Rights, DPSP, Parliament)',
          'Indian Polity (Judiciary, Federal Structure, Local Governance)',
        ],
        resources: [
          { name: 'NCERT Class 6-12 (History, Geography, Polity)', url: 'https://ncert.nic.in/' },
          { name: 'Laxmikanth — Indian Polity', url: '#' },
          { name: 'Spectrum — Modern History', url: '#' },
        ],
      },
      advanced: {
        title: 'Advanced — Specialized Topics',
        topics: [
          'Indian Economy (Growth, Development, Planning, Budgeting)',
          'Environment & Ecology (Biodiversity, Climate Change, Environmental Laws)',
          'Science & Technology (Space, Biotech, IT, Defence Technology)',
          'Current Affairs (National & International Events)',
          'Art & Culture (Indian Architecture, Music, Dance, Paintings)',
          'Ethics, Integrity & Aptitude (Case Studies, Thinkers)',
        ],
        resources: [
          { name: 'Ramesh Singh — Indian Economy', url: '#' },
          { name: 'Shankar IAS — Environment', url: '#' },
          { name: 'The Hindu / Indian Express — Daily Current Affairs', url: 'https://www.thehindu.com/' },
        ],
      },
      revision: {
        title: 'Revision & Mock Tests',
        topics: [
          'Previous Year Prelims Paper Analysis (Last 10 years)',
          'Answer Writing Practice (GS Mains — 10 answers/day)',
          'Essay Writing Practice (Weekly essays)',
          'Sectional Revision of all subjects',
          'Current Affairs Compilation (Monthly digest)',
        ],
        resources: [
          { name: 'Vision IAS / Forum IAS Test Series', url: '#' },
          { name: 'UPSC Previous Year Papers', url: 'https://upsc.gov.in/' },
          { name: 'Mrunal.org — Free resources', url: 'https://mrunal.org/' },
        ],
      },
      sprint: {
        title: 'Final Sprint — Weak Areas & Current Affairs',
        topics: [
          'Full-length Mock Tests (Prelims + Mains simulation)',
          'CSAT Practice (Comprehension, Logic, Maths)',
          'Current Affairs Compilation (Last 12 months)',
          'Revision of weak areas identified in mocks',
          'Optional Subject — Final revision',
        ],
        resources: [
          { name: 'Insights on India — Secure Initiative', url: 'https://www.insightsonindia.com/' },
          { name: 'PRS Legislative Research', url: 'https://prsindia.org/' },
        ],
      },
    },
  },
  'SSC CGL': {
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Knowledge'],
    phases: {
      foundation: {
        title: 'Foundation — Core Concepts',
        topics: [
          'Number System (HCF, LCM, Divisibility, Remainders)',
          'Algebra (Linear Equations, Quadratic Equations, Surds)',
          'Geometry (Triangles, Circles, Quadrilaterals, Coordinate Geometry)',
          'Basic Reasoning (Analogy, Classification, Series, Coding-Decoding)',
          'English Grammar (Tenses, Active-Passive, Direct-Indirect)',
          'Static GK (History, Geography, Polity basics)',
        ],
        resources: [
          { name: 'Rakesh Yadav — Arithmetic', url: '#' },
          { name: 'Kiran Prakashan — SSC Maths', url: '#' },
          { name: 'Lucent GK', url: '#' },
        ],
      },
      advanced: {
        title: 'Advanced — Higher Level Topics',
        topics: [
          'Trigonometry (Identities, Heights & Distances)',
          'Mensuration (Area, Volume, Surface Area)',
          'Data Interpretation (Tables, Bar/Pie/Line Charts)',
          'Advanced Reasoning (Syllogisms, Statement-Conclusion, Matrix)',
          'Reading Comprehension (Passages, Cloze Test, Para Jumbles)',
          'Advanced GK (Science, Economics, Current Affairs)',
        ],
        resources: [
          { name: 'Abhinay Maths — YouTube Channel', url: 'https://www.youtube.com/@abhinaymaths' },
          { name: 'SP Bakshi — English', url: '#' },
          { name: 'GK Today — Current Affairs', url: 'https://www.gktoday.in/' },
        ],
      },
      revision: {
        title: 'Revision & Practice',
        topics: [
          'Previous Year Papers (Last 5 years — Tier 1 & Tier 2)',
          'Sectional Tests (Timed 25-question sets)',
          'Error Log Review (Revise all incorrect questions)',
          'Formula & Shortcut Revision',
        ],
        resources: [
          { name: 'SSC Official Previous Papers', url: 'https://ssc.nic.in/' },
          { name: 'Testbook / Oliveboard Mock Tests', url: '#' },
        ],
      },
      sprint: {
        title: 'Final Sprint — Speed Building',
        topics: [
          'Full Mock Tests (Tier 1 pattern — 60 min timed)',
          'Speed Drills (20 questions in 15 min per subject)',
          'Weak Topic Targeted Practice',
          'Current Affairs — Last 6 months rapid revision',
        ],
        resources: [
          { name: 'Adda247 — Free Mocks', url: '#' },
          { name: 'Gradeup — SSC Mock Tests', url: '#' },
        ],
      },
    },
  },
  'SSC CHSL': {
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness'],
    phases: {
      foundation: {
        title: 'Foundation — Building Basics',
        topics: [
          'Arithmetic (Percentage, Profit-Loss, SI/CI, Ratio)',
          'Number System & Simplification',
          'Coding-Decoding, Analogy, Classification',
          'English Vocabulary & Grammar Basics',
          'Indian History & Geography fundamentals',
        ],
        resources: [
          { name: 'RS Aggarwal — Quantitative Aptitude', url: '#' },
          { name: 'Lucent GK', url: '#' },
        ],
      },
      advanced: {
        title: 'Advanced — Exam-Level Topics',
        topics: [
          'Geometry & Mensuration',
          'Trigonometry Basics',
          'Advanced Reasoning (Matrix, Figure, Mirror/Water Image)',
          'Reading Comprehension & Cloze Test',
          'Science & Computer Awareness',
        ],
        resources: [
          { name: 'Kiran SSC CHSL Previous Papers', url: '#' },
          { name: 'Wren & Martin — English Grammar', url: '#' },
        ],
      },
      revision: {
        title: 'Revision & Sectional Tests',
        topics: [
          'Previous Year Paper solving (Last 5 years)',
          'Subject-wise revision notes',
          'Timed sectional practice',
          'Descriptive Writing Practice (Tier 2 — Essay/Letter)',
        ],
        resources: [
          { name: 'SSC CHSL Previous Year Papers', url: 'https://ssc.nic.in/' },
          { name: 'Descriptive English by SP Bakshi', url: '#' },
        ],
      },
      sprint: {
        title: 'Final Sprint',
        topics: [
          'Full-length mocks (Tier 1 pattern)',
          'Speed improvement drills',
          'Current Affairs rapid revision',
          'Weak area identification & targeted practice',
        ],
        resources: [
          { name: 'Testbook — CHSL Mocks', url: '#' },
        ],
      },
    },
  },
  'IBPS PO': {
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Computer Knowledge'],
    phases: {
      foundation: {
        title: 'Foundation — Core Banking Prep',
        topics: [
          'Simplification & Approximation',
          'Number Series (Missing, Wrong Number)',
          'Syllogisms (Coded, Reverse)',
          'English Grammar (Error Spotting, Fill in the Blanks)',
          'Banking Awareness (RBI, SEBI, Types of Banks)',
          'Basic Computer Knowledge (OS, Networking, MS Office)',
        ],
        resources: [
          { name: 'Arun Sharma — Quantitative Aptitude', url: '#' },
          { name: 'Banking Awareness by Arihant', url: '#' },
          { name: 'Bankersadda — Daily Quizzes', url: 'https://www.adda247.com/banking/' },
        ],
      },
      advanced: {
        title: 'Advanced — Mains Level',
        topics: [
          'Data Interpretation (Caselet, Mixed Charts)',
          'Puzzles & Seating Arrangement (Linear, Circular, Floor)',
          'Machine Input-Output, Blood Relations',
          'Reading Comprehension (Banking/Economy themes)',
          'Financial & Economic Awareness (Budget, Policies)',
        ],
        resources: [
          { name: 'Oliveboard — Banking Mocks', url: '#' },
          { name: 'The Hindu Business Line', url: 'https://www.thehindubusinessline.com/' },
        ],
      },
      revision: {
        title: 'Revision & Sectional Tests',
        topics: [
          'Sectional Tests (Timed — Prelims & Mains pattern)',
          'Previous Year Paper Analysis (Last 5 years)',
          'Error Log & Concept Revision',
          'Banking & Financial Awareness Capsule',
        ],
        resources: [
          { name: 'IBPS Official Previous Papers', url: 'https://www.ibps.in/' },
          { name: 'Gradeup — Sectional Tests', url: '#' },
        ],
      },
      sprint: {
        title: 'Final Sprint — Full Mocks & Interview',
        topics: [
          'Full-length Mock Tests (Prelims + Mains)',
          'Interview Preparation (Banking knowledge, current affairs)',
          'Group Discussion Practice',
          'Current Affairs — Last 6 months compilation',
        ],
        resources: [
          { name: 'MockBank — Free Banking Mocks', url: '#' },
          { name: 'Interview Tips by Career Power', url: '#' },
        ],
      },
    },
  },
  'IBPS Clerk': {
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Computer Knowledge'],
    phases: {
      foundation: {
        title: 'Foundation — Basics',
        topics: [
          'Simplification, Percentage, Average, Ratio',
          'Number Series, Inequality, Syllogism',
          'Grammar (Spotting Errors, Sentence Correction)',
          'Static GK & Banking Terms',
          'Computer Fundamentals',
        ],
        resources: [
          { name: 'RS Aggarwal — Quantitative Aptitude', url: '#' },
          { name: 'Lucent Computer Knowledge', url: '#' },
        ],
      },
      advanced: {
        title: 'Advanced — Mains Focus',
        topics: [
          'Data Interpretation (Bar, Line, Pie, Caselet)',
          'Puzzles, Seating, Blood Relations',
          'Reading Comprehension & Cloze Test',
          'Financial Awareness & Current Banking Affairs',
        ],
        resources: [
          { name: 'Adda247 — Banking Awareness', url: '#' },
          { name: 'Oliveboard — Free Mocks', url: '#' },
        ],
      },
      revision: {
        title: 'Revision & Practice',
        topics: [
          'Previous Year Papers (Last 3 years)',
          'Sectional timed tests',
          'Quick revision notes',
        ],
        resources: [
          { name: 'IBPS Official Papers', url: 'https://www.ibps.in/' },
        ],
      },
      sprint: {
        title: 'Final Sprint',
        topics: [
          'Full mocks (Prelims + Mains pattern)',
          'Speed drills (per section)',
          'Current Affairs quick capsule',
        ],
        resources: [
          { name: 'Testbook — Clerk Mocks', url: '#' },
        ],
      },
    },
  },
  'SBI PO': {
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness'],
    phases: {
      foundation: {
        title: 'Foundation — Core Concepts',
        topics: [
          'Arithmetic (Percentage, Ratio, Average, SI/CI)',
          'Number Series, Quadratic Equations',
          'Syllogisms, Inequalities, Direction Sense',
          'Grammar & Vocabulary Building',
          'Banking Awareness (SBI History, Products, RBI)',
        ],
        resources: [
          { name: 'Arun Sharma — Quant & Reasoning', url: '#' },
          { name: 'SBI Official — Banking Awareness', url: 'https://www.sbi.co.in/' },
        ],
      },
      advanced: {
        title: 'Advanced — Mains Level',
        topics: [
          'DI (Caselet, Mixed, Missing DI)',
          'Puzzles, Seating Arrangement (Complex)',
          'RC (Inference, Vocab-based), Para Jumbles',
          'Economy & Financial Awareness',
        ],
        resources: [
          { name: 'Oliveboard SBI PO Mocks', url: '#' },
          { name: 'Economic Survey Summary', url: '#' },
        ],
      },
      revision: {
        title: 'Revision & Sectional Tests',
        topics: [
          'Previous Year Paper Analysis',
          'Sectional Tests (Timed)',
          'Concept Revision Cards',
        ],
        resources: [
          { name: 'SBI PO Previous Papers', url: '#' },
        ],
      },
      sprint: {
        title: 'Final Sprint — Mocks & GD/PI',
        topics: [
          'Full Mock Tests (Prelims + Mains)',
          'GD/PI Preparation',
          'Current Affairs — Last 6 months',
          'Descriptive Paper Practice (Letter/Essay)',
        ],
        resources: [
          { name: 'Adda247 — SBI PO Mocks', url: '#' },
        ],
      },
    },
  },
  'RBI Grade B': {
    subjects: ['Economic & Social Issues', 'Finance & Management', 'English', 'Quantitative Aptitude', 'Reasoning'],
    phases: {
      foundation: {
        title: 'Foundation — Phase 1 Prep',
        topics: [
          'General Awareness (Economy, Banking, Finance)',
          'Quantitative Aptitude (Arithmetic, DI)',
          'English (RC, Grammar, Vocabulary)',
          'Reasoning (Puzzles, Syllogisms, Coding)',
        ],
        resources: [
          { name: 'RBI Official — Publications', url: 'https://www.rbi.org.in/' },
          { name: 'Mrunal — Economy lectures', url: 'https://mrunal.org/' },
        ],
      },
      advanced: {
        title: 'Advanced — Phase 2 Descriptive',
        topics: [
          'Economic & Social Issues (Indian Economy, Growth, Poverty)',
          'Finance & Management (Financial Markets, Corporate Governance)',
          'RBI Functions, Monetary Policy, Banking Regulation',
          'Essay Writing on Economic Topics',
        ],
        resources: [
          { name: 'Economic Survey of India', url: '#' },
          { name: 'RBI Annual Report', url: 'https://www.rbi.org.in/' },
        ],
      },
      revision: {
        title: 'Revision & Writing Practice',
        topics: [
          'Previous Year Paper Analysis (Phase 1 & 2)',
          'Descriptive Answer Writing Practice',
          'Current Economy & Banking Affairs Revision',
        ],
        resources: [
          { name: 'EduTap — RBI Grade B Mocks', url: '#' },
        ],
      },
      sprint: {
        title: 'Final Sprint — Interview Prep',
        topics: [
          'Full Mock Tests (Phase 1 + Phase 2)',
          'Interview Preparation (RBI-specific knowledge)',
          'Current Affairs Compilation',
          'Weak area revision',
        ],
        resources: [
          { name: 'RBI Grade B Interview Guides', url: '#' },
        ],
      },
    },
  },
  'RRB NTPC': {
    subjects: ['Mathematics', 'General Intelligence & Reasoning', 'General Awareness'],
    phases: {
      foundation: {
        title: 'Foundation — Basic Concepts',
        topics: [
          'Basic Maths (Number System, BODMAS, Fractions, Decimals)',
          'Percentage, Average, Ratio & Proportion',
          'Analogies, Classification, Series Completion',
          'Static GK (Indian History, Geography, Polity)',
          'General Science (Physics, Chemistry, Biology basics)',
        ],
        resources: [
          { name: 'RS Aggarwal — Maths', url: '#' },
          { name: 'Lucent General Knowledge', url: '#' },
          { name: 'RRB Official — Syllabus', url: 'https://www.rrbcdg.gov.in/' },
        ],
      },
      advanced: {
        title: 'Advanced — Higher Topics',
        topics: [
          'Advanced Maths (Profit-Loss, SI/CI, Time-Work-Distance)',
          'Coding-Decoding, Blood Relations, Direction Sense',
          'Current Affairs (National & International)',
          'Computer Awareness Basics',
          'Indian Railways — General Knowledge',
        ],
        resources: [
          { name: 'Kiran Prakashan — Railway Maths', url: '#' },
          { name: 'GK Today — Current Affairs', url: 'https://www.gktoday.in/' },
        ],
      },
      revision: {
        title: 'Revision — PYQs & Sectional Tests',
        topics: [
          'Previous Year Questions (CBT 1 & CBT 2)',
          'Sectional Tests — Timed practice',
          'Static GK Rapid Revision',
          'Science Formulas & Facts Revision',
        ],
        resources: [
          { name: 'RRB NTPC Previous Papers', url: '#' },
          { name: 'Testbook — Railway Mocks', url: '#' },
        ],
      },
      sprint: {
        title: 'Final Sprint — Speed Tests',
        topics: [
          'Full Mock Tests (CBT 1 pattern — 90 min)',
          'Speed Tests (30 questions in 20 min)',
          'Current Affairs — Last 6 months capsule',
          'Weak area targeted revision',
        ],
        resources: [
          { name: 'Adda247 — RRB Mocks', url: '#' },
        ],
      },
    },
  },
  'NDA': {
    subjects: ['Mathematics', 'General Ability (English, GK, Science)'],
    phases: {
      foundation: {
        title: 'Foundation — Core Subjects',
        topics: [
          'Maths (Algebra, Trigonometry, Matrices & Determinants)',
          'English Grammar & Vocabulary',
          'Indian History & Geography',
          'Physics & Chemistry fundamentals',
        ],
        resources: [
          { name: 'NCERT Maths Class 11-12', url: 'https://ncert.nic.in/' },
          { name: 'Pathfinder — NDA Arihant', url: '#' },
        ],
      },
      advanced: {
        title: 'Advanced — Higher Maths & GA',
        topics: [
          'Calculus, Analytical Geometry, Statistics',
          'Current Affairs & Defence Knowledge',
          'General Science (Advanced Physics, Chemistry)',
          'English Comprehension & Usage',
        ],
        resources: [
          { name: 'RS Aggarwal — NDA Maths', url: '#' },
          { name: 'Defence Current Affairs — monthly', url: '#' },
        ],
      },
      revision: {
        title: 'Revision & Paper Practice',
        topics: [
          'Previous Year Papers (Last 10 years)',
          'Subject-wise revision notes',
          'Time management practice',
        ],
        resources: [
          { name: 'NDA Previous Year Papers — UPSC', url: 'https://upsc.gov.in/' },
        ],
      },
      sprint: {
        title: 'Final Sprint — Mocks & SSB',
        topics: [
          'Full Mock Tests (NDA pattern)',
          'SSB Interview Preparation basics',
          'Physical Fitness Assessment prep',
          'Current Affairs rapid revision',
        ],
        resources: [
          { name: 'SSB Crack — Interview Prep', url: '#' },
        ],
      },
    },
  },
  'CDS': {
    subjects: ['English', 'General Knowledge', 'Elementary Mathematics'],
    phases: {
      foundation: {
        title: 'Foundation — Core Areas',
        topics: [
          'English Grammar, Vocabulary, Comprehension',
          'Indian History (Ancient, Medieval, Modern)',
          'Geography (India & World)',
          'Elementary Maths (Arithmetic, Algebra, Geometry)',
        ],
        resources: [
          { name: 'Pathfinder CDS — Arihant', url: '#' },
          { name: 'Wren & Martin — English', url: '#' },
        ],
      },
      advanced: {
        title: 'Advanced — In-Depth Topics',
        topics: [
          'Polity, Economics, General Science',
          'Trigonometry, Mensuration, Statistics',
          'Defence & Current Affairs',
          'Advanced English Usage',
        ],
        resources: [
          { name: 'Lucent GK', url: '#' },
          { name: 'RS Aggarwal — Maths', url: '#' },
        ],
      },
      revision: {
        title: 'Revision & Practice',
        topics: [
          'Previous Year Papers (Last 5 years)',
          'Subject-wise quick revision',
          'Timed practice sessions',
        ],
        resources: [
          { name: 'CDS Previous Papers — UPSC', url: 'https://upsc.gov.in/' },
        ],
      },
      sprint: {
        title: 'Final Sprint — SSB + Mocks',
        topics: [
          'Full-length mocks (CDS pattern)',
          'SSB Interview Preparation',
          'Physical fitness planning',
          'Current Affairs capsule',
        ],
        resources: [
          { name: 'SSB Interview Guide', url: '#' },
        ],
      },
    },
  },
  'CTET': {
    subjects: ['Child Development & Pedagogy', 'Language 1 & 2', 'Mathematics', 'Environmental Studies / Subject-specific'],
    phases: {
      foundation: {
        title: 'Foundation — Pedagogy & Basics',
        topics: [
          'Child Development (Piaget, Vygotsky, Kohlberg)',
          'Inclusive Education & Special Needs',
          'Teaching-Learning Process & NCF 2005',
          'Language 1 Pedagogy & Comprehension',
          'Mathematics Pedagogy & Content (for Paper 1)',
        ],
        resources: [
          { name: 'Arihant — CTET Paper 1 & 2', url: '#' },
          { name: 'NCERT — Pedagogy Books', url: 'https://ncert.nic.in/' },
        ],
      },
      advanced: {
        title: 'Advanced — Content Mastery',
        topics: [
          'Environmental Studies (Paper 1) / Subject Content (Paper 2)',
          'Language 2 Pedagogy & Comprehension',
          'Assessment & Evaluation Methods',
          'National Education Policy 2020',
        ],
        resources: [
          { name: 'NCERT Textbooks — Class 1-8', url: 'https://ncert.nic.in/' },
          { name: 'Previous CTET Papers', url: '#' },
        ],
      },
      revision: {
        title: 'Revision — PYQs & Practice',
        topics: [
          'Previous Year Papers (Last 5 sessions)',
          'Subject-wise revision notes',
          'CDP Key theories & concepts revision',
        ],
        resources: [
          { name: 'CTET Official — Previous Papers', url: 'https://ctet.nic.in/' },
        ],
      },
      sprint: {
        title: 'Final Sprint',
        topics: [
          'Full Mock Tests (150 questions — 2.5 hrs)',
          'Weak area targeted practice',
          'CDP quick revision sheet',
          'Current education policy updates',
        ],
        resources: [
          { name: 'Testbook — CTET Mocks', url: '#' },
        ],
      },
    },
  },
  'UGC NET': {
    subjects: ['General Paper 1 (Teaching & Research Aptitude)', 'Subject-specific Paper 2'],
    phases: {
      foundation: {
        title: 'Foundation — Paper 1 & Basics',
        topics: [
          'Teaching Aptitude & Research Methodology',
          'Communication & ICT',
          'Reading Comprehension & Logical Reasoning',
          'Data Interpretation & Mathematical Reasoning',
          'People & Environment, Higher Education System',
          'Paper 2 — Subject fundamentals',
        ],
        resources: [
          { name: 'Trueman UGC NET — Paper 1', url: '#' },
          { name: 'NTA UGC NET Official', url: 'https://ugcnet.nta.nic.in/' },
        ],
      },
      advanced: {
        title: 'Advanced — Paper 2 Mastery',
        topics: [
          'Subject-specific advanced topics (Paper 2)',
          'Information & Communication Technology (Advanced)',
          'Higher Education Governance & Policies',
          'Research Ethics & Methodology (Advanced)',
        ],
        resources: [
          { name: 'Subject-specific standard textbooks', url: '#' },
          { name: 'UGC NET Previous Papers', url: 'https://ugcnet.nta.nic.in/' },
        ],
      },
      revision: {
        title: 'Revision & Practice',
        topics: [
          'Previous Year Papers (Last 5 years — Paper 1 & 2)',
          'Subject-wise concept mapping',
          'Paper 1 formula & fact sheet revision',
        ],
        resources: [
          { name: 'NTA Official — Previous Papers', url: 'https://ugcnet.nta.nic.in/' },
        ],
      },
      sprint: {
        title: 'Final Sprint',
        topics: [
          'Full Mock Tests (Paper 1 + Paper 2 combined)',
          'Quick revision of key concepts',
          'Weak area focused practice',
          'Time management drills',
        ],
        resources: [
          { name: 'Testbook — UGC NET Mocks', url: '#' },
        ],
      },
    },
  },
  'State PSC (General)': {
    subjects: ['GS Paper 1', 'GS Paper 2', 'Aptitude', 'Language', 'State-specific'],
    phases: {
      foundation: {
        title: 'Foundation — National + State Basics',
        topics: [
          'Indian History (Ancient, Medieval, Modern + Freedom Movement)',
          'Indian & State Geography (Physical, Economic, Human)',
          'Indian Polity & Governance (Constitution, State Legislature)',
          'State-specific History & Culture',
          'State Geography, Demographics & Economy',
        ],
        resources: [
          { name: 'NCERT Class 6-12 (History, Geography, Polity)', url: 'https://ncert.nic.in/' },
          { name: 'State-specific GK Books', url: '#' },
          { name: 'State PSC Official Syllabus', url: '#' },
        ],
      },
      advanced: {
        title: 'Advanced — Economy, Science & State Focus',
        topics: [
          'Indian Economy & State Economy (Planning, Budget)',
          'General Science (Physics, Chemistry, Biology)',
          'State History & Culture (Art, Literature, Festivals)',
          'Current Affairs (National + State-level)',
          'Environmental Studies & Disaster Management',
        ],
        resources: [
          { name: 'Ramesh Singh — Indian Economy', url: '#' },
          { name: 'State Govt Websites — Schemes & Policies', url: '#' },
        ],
      },
      revision: {
        title: 'Revision & Answer Writing',
        topics: [
          'Previous Year Papers (State PSC — Last 10 years)',
          'Answer Writing Practice (200/250 word answers)',
          'State-specific Current Affairs Compilation',
          'Subject-wise Rapid Revision Notes',
        ],
        resources: [
          { name: 'State PSC Previous Papers — Official', url: '#' },
          { name: 'Drishti IAS — State PSC material', url: 'https://www.drishtiias.com/' },
        ],
      },
      sprint: {
        title: 'Final Sprint — Mocks & Current Affairs',
        topics: [
          'Full Mock Tests (Prelims + Mains pattern)',
          'Current Affairs — Last 12 months (National + State)',
          'Essay Writing Practice',
          'Interview/Personality Test Preparation',
        ],
        resources: [
          { name: 'Vision IAS — State PSC Test Series', url: '#' },
        ],
      },
    },
  },
};

const EXAM_OPTIONS = Object.keys(EXAM_DATA);
const MONTHS_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 18, 24];
const HOURS_OPTIONS = [2, 4, 6, 8, 10];

// Phase meta — percentage of total time and visual config
const PHASE_META = [
  { key: 'foundation', percent: 40, label: 'Phase 1 — Foundation', color: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: FiBookOpen },
  { key: 'advanced', percent: 30, label: 'Phase 2 — Advanced', color: 'border-green-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', icon: FiTrendingUp },
  { key: 'revision', percent: 20, label: 'Phase 3 — Revision & Mocks', color: 'border-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', icon: FiAward },
  { key: 'sprint', percent: 10, label: 'Phase 4 — Final Sprint', color: 'border-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: FiZap },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateRoadmap(exam, months, hoursPerDay) {
  const data = EXAM_DATA[exam];
  if (!data) return null;

  const totalWeeks = Math.round(months * 4.33);
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  // Start from next Monday
  const dayOfWeek = startDate.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
  startDate.setDate(startDate.getDate() + daysUntilMonday);

  const phases = [];

  PHASE_META.forEach((meta) => {
    const phaseData = data.phases[meta.key];
    const phaseWeeks = Math.max(1, Math.round((meta.percent / 100) * totalWeeks));
    const topics = phaseData.topics;
    const weeks = [];

    for (let w = 0; w < phaseWeeks; w++) {
      // Distribute topics across weeks (cycle if more weeks than topics)
      const topicIndex = w % topics.length;
      // Show 1-2 topics per week
      const weekTopics = [topics[topicIndex]];
      if (topics.length > 1 && phaseWeeks <= topics.length) {
        // If weeks roughly match topics, 1 topic per week
      } else if (w * 2 + 1 < topics.length * 2) {
        const secondIdx = (topicIndex + Math.ceil(topics.length / 2)) % topics.length;
        if (secondIdx !== topicIndex) {
          weekTopics.push(topics[secondIdx]);
        }
      }

      // Calculate date range for this week
      const globalWeekIndex = phases.reduce((sum, p) => sum + p.weeks.length, 0) + w;
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + globalWeekIndex * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Distribute study hours across subjects for the phase
      const subjects = data.subjects;
      const subjectHours = {};
      const primarySubjects = weekTopics.length;
      const remainingHours = hoursPerDay;
      // Give 60% to focus topics, distribute rest
      const focusHours = Math.round((remainingHours * 0.6) * 10) / 10;
      const otherHours = Math.round((remainingHours * 0.4 / Math.max(1, subjects.length - 1)) * 10) / 10;

      subjects.forEach((sub, i) => {
        if (i < primarySubjects) {
          subjectHours[sub] = Math.round((focusHours / primarySubjects) * 10) / 10;
        } else {
          subjectHours[sub] = otherHours;
        }
      });

      weeks.push({
        weekNumber: globalWeekIndex + 1,
        dateRange: `${formatDate(weekStart)} - ${formatDate(weekEnd)}`,
        topics: weekTopics,
        subjectHours,
        resources: phaseData.resources,
      });
    }

    phases.push({
      ...meta,
      title: phaseData.title,
      weeks,
      totalWeeks: phaseWeeks,
    });
  });

  return { exam, months, hoursPerDay, subjects: data.subjects, phases, totalWeeks: phases.reduce((s, p) => s + p.weeks.length, 0) };
}

function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getStorageKey(exam) {
  return `prep-roadmap-${exam.replace(/\s+/g, '-').toLowerCase()}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PrepRoadmap = () => {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedMonths, setSelectedMonths] = useState('');
  const [selectedHours, setSelectedHours] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [completedWeeks, setCompletedWeeks] = useState({});
  const [expandedPhases, setExpandedPhases] = useState({});

  // Load completed weeks from localStorage when roadmap changes
  useEffect(() => {
    if (roadmap) {
      const key = getStorageKey(roadmap.exam);
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          setCompletedWeeks(JSON.parse(saved));
        } else {
          setCompletedWeeks({});
        }
      } catch {
        setCompletedWeeks({});
      }
    }
  }, [roadmap]);

  // Save completed weeks to localStorage
  const toggleWeekComplete = useCallback((weekNumber) => {
    setCompletedWeeks((prev) => {
      const next = { ...prev, [weekNumber]: !prev[weekNumber] };
      if (roadmap) {
        localStorage.setItem(getStorageKey(roadmap.exam), JSON.stringify(next));
      }
      return next;
    });
  }, [roadmap]);

  // Compute progress
  const progress = useMemo(() => {
    if (!roadmap) return 0;
    const total = roadmap.totalWeeks;
    const done = Object.values(completedWeeks).filter(Boolean).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [roadmap, completedWeeks]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!selectedExam || !selectedMonths || !selectedHours) return;
    const result = generateRoadmap(selectedExam, parseInt(selectedMonths), parseInt(selectedHours));
    setRoadmap(result);
    // Expand all phases by default
    const expanded = {};
    PHASE_META.forEach((p) => { expanded[p.key] = true; });
    setExpandedPhases(expanded);
  };

  const togglePhase = (key) => {
    setExpandedPhases((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Preparation Roadmap Generator"
        path="/prep-roadmap"
        description="Generate a personalized week-by-week study plan for UPSC, SSC, Banking, Railways, Defence, and other government exams. Track your progress and stay on schedule."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print:hidden">
          <Breadcrumb items={[{ label: 'Preparation Roadmap' }]} />
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 print:hidden"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <FiMap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
            Preparation <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Roadmap Generator</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            Get a personalized week-by-week study plan tailored to your exam, available time, and daily study hours
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto mb-12 print:hidden"
        >
          <form onSubmit={handleGenerate} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg">
            <div className="space-y-5">
              {/* Target Exam */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <FiTarget className="inline w-4 h-4 mr-1.5 -mt-0.5" />
                  Target Exam
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base"
                >
                  <option value="">Select your target exam</option>
                  {EXAM_OPTIONS.map((exam) => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>

              {/* Months Available */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <FiCalendar className="inline w-4 h-4 mr-1.5 -mt-0.5" />
                  Months Available
                </label>
                <select
                  value={selectedMonths}
                  onChange={(e) => setSelectedMonths(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base"
                >
                  <option value="">Select preparation duration</option>
                  {MONTHS_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m} {m === 1 ? 'month' : 'months'}</option>
                  ))}
                </select>
              </div>

              {/* Study Hours Per Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <FiClock className="inline w-4 h-4 mr-1.5 -mt-0.5" />
                  Study Hours Per Day
                </label>
                <select
                  value={selectedHours}
                  onChange={(e) => setSelectedHours(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base"
                >
                  <option value="">Select daily study hours</option>
                  {HOURS_OPTIONS.map((h) => (
                    <option key={h} value={h}>{h} hours</option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={!selectedExam || !selectedMonths || !selectedHours}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                <FiMap className="w-5 h-5" /> Generate Roadmap
              </button>
            </div>
          </form>
        </motion.div>

        {/* Roadmap Output */}
        <AnimatePresence>
          {roadmap && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Progress Bar & Header */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {roadmap.exam} — {roadmap.months}-Month Roadmap
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {roadmap.totalWeeks} weeks &middot; {roadmap.hoursPerDay} hours/day &middot; {roadmap.subjects.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium print:hidden"
                    >
                      <FiPrinter className="w-4 h-4" /> Print / Download
                    </button>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[3rem] text-right">
                      {progress}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {Object.values(completedWeeks).filter(Boolean).length} of {roadmap.totalWeeks} weeks completed
                  </p>
                </div>
              </div>

              {/* Phase Timeline */}
              <div className="max-w-4xl mx-auto space-y-6 print:space-y-4">
                {roadmap.phases.map((phase, phaseIndex) => {
                  const PhaseIcon = phase.icon;
                  const isExpanded = expandedPhases[phase.key] !== false;

                  return (
                    <motion.div
                      key={phase.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: phaseIndex * 0.1 }}
                      className={`bg-white dark:bg-gray-800 rounded-2xl border-l-4 ${phase.color} border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden`}
                    >
                      {/* Phase Header */}
                      <button
                        onClick={() => togglePhase(phase.key)}
                        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors print:hover:bg-transparent"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${phase.bg} flex items-center justify-center`}>
                            <PhaseIcon className={`w-5 h-5 ${phase.text}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {phase.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {phase.totalWeeks} {phase.totalWeeks === 1 ? 'week' : 'weeks'} &middot; {phase.percent}% of total time
                            </p>
                          </div>
                        </div>
                        <div className="print:hidden">
                          {isExpanded ? (
                            <FiChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Phase Content — Weekly Breakdown */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden print:force-show"
                          >
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                              {/* Timeline */}
                              <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 print:bg-gray-300" />

                                <div className="space-y-4">
                                  {phase.weeks.map((week, weekIdx) => {
                                    const isCompleted = !!completedWeeks[week.weekNumber];
                                    return (
                                      <motion.div
                                        key={week.weekNumber}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: weekIdx * 0.05 }}
                                        className="relative pl-10"
                                      >
                                        {/* Timeline dot */}
                                        <div className={`absolute left-[8px] top-3 w-[15px] h-[15px] rounded-full border-2 ${
                                          isCompleted
                                            ? `${phase.dot} border-white dark:border-gray-800`
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                        } z-10`}>
                                          {isCompleted && (
                                            <FiCheckCircle className="w-full h-full text-white p-[1px]" />
                                          )}
                                        </div>

                                        {/* Week Card */}
                                        <div className={`rounded-xl border p-4 transition-all ${
                                          isCompleted
                                            ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                                        }`}>
                                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                            <div>
                                              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${phase.badge} mb-1`}>
                                                Week {week.weekNumber}
                                              </span>
                                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" />
                                                {week.dateRange}
                                              </p>
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer print:hidden shrink-0">
                                              <input
                                                type="checkbox"
                                                checked={isCompleted}
                                                onChange={() => toggleWeekComplete(week.weekNumber)}
                                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                              />
                                              <span className={`text-xs font-medium ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {isCompleted ? 'Completed' : 'Mark Complete'}
                                              </span>
                                            </label>
                                          </div>

                                          {/* Topics */}
                                          <div className="mb-3">
                                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Topics</h4>
                                            <ul className="space-y-1">
                                              {week.topics.map((topic, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                  <FiCheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCompleted ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`} />
                                                  <span className={isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}>{topic}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>

                                          {/* Daily Hour Allocation */}
                                          <div className="mb-3">
                                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Daily Hours</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                              {Object.entries(week.subjectHours).map(([subject, hours]) => (
                                                <span
                                                  key={subject}
                                                  className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg"
                                                >
                                                  <FiClock className="w-3 h-3 text-gray-400" />
                                                  {subject}: {hours}h
                                                </span>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Resources */}
                                          {weekIdx === 0 && (
                                            <div>
                                              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Resources</h4>
                                              <div className="flex flex-wrap gap-1.5">
                                                {week.resources.map((res, i) => (
                                                  <a
                                                    key={i}
                                                    href={res.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-2 py-1 rounded-lg transition-colors"
                                                  >
                                                    <FiBookOpen className="w-3 h-3" />
                                                    {res.name}
                                                  </a>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  <FiPrinter className="w-5 h-5" /> Print Roadmap
                </button>
                <button
                  onClick={() => {
                    setRoadmap(null);
                    setCompletedWeeks({});
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 font-medium"
                >
                  <FiMap className="w-5 h-5" /> Generate New Roadmap
                </button>
              </div>

              {/* Disclaimer */}
              <div className="max-w-4xl mx-auto mt-8 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  * This roadmap is generated as a guideline. Adjust the plan based on your strengths, weaknesses, and coaching guidance.
                  Progress is saved locally in your browser.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info section when no roadmap yet */}
        {!roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto print:hidden"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
              How It <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: FiTarget, title: 'Select Exam', desc: 'Choose from 13+ government exams with detailed syllabus data', color: 'from-blue-500 to-blue-600' },
                { icon: FiCalendar, title: 'Set Duration', desc: 'Pick your available preparation time from 1 to 24 months', color: 'from-green-500 to-green-600' },
                { icon: FiClock, title: 'Daily Hours', desc: 'Tell us how many hours you can dedicate each day', color: 'from-orange-500 to-orange-600' },
                { icon: FiMap, title: 'Get Roadmap', desc: 'Receive a week-by-week plan with topics, resources & tracking', color: 'from-purple-500 to-purple-600' },
              ].map((step, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Supported Exams */}
            <div className="mt-10 text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Supported Exams
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {EXAM_OPTIONS.map((exam) => (
                  <span
                    key={exam}
                    className="inline-block text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600"
                  >
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PrepRoadmap;
