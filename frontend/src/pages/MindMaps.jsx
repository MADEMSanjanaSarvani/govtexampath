import React, { useState } from 'react';
import { FiBookOpen, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

const syllabusData = [
  {
    category: 'UPSC Civil Services',
    color: 'from-purple-500 to-indigo-600',
    nodeColor: '#7c3aed',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    exams: [
      {
        name: 'Prelims - General Studies I',
        topics: [
          { name: 'Indian History', subtopics: ['Ancient India', 'Medieval India', 'Modern India - Freedom Struggle', 'Art & Culture', 'Post-Independence India'] },
          { name: 'Geography', subtopics: ['Physical Geography', 'Indian Geography', 'World Geography', 'Climate & Weather', 'Environmental Geography'] },
          { name: 'Indian Polity', subtopics: ['Constitution', 'Parliament & State Legislatures', 'Judiciary', 'Panchayati Raj & Municipalities', 'Constitutional Bodies', 'Fundamental Rights & Duties'] },
          { name: 'Economics', subtopics: ['Indian Economy', 'Planning & Budget', 'Banking & Finance', 'International Trade', 'Economic Reforms', 'Agriculture'] },
          { name: 'Science & Technology', subtopics: ['Physics Basics', 'Chemistry Basics', 'Biology', 'Space & Defence Technology', 'IT & Computers', 'Biotechnology'] },
          { name: 'Environment & Ecology', subtopics: ['Biodiversity', 'Climate Change', 'Environmental Laws', 'Pollution', 'International Environmental Treaties'] },
          { name: 'Current Affairs', subtopics: ['National Events', 'International Relations', 'Awards & Honours', 'Government Schemes', 'Summits & Conferences'] },
        ]
      },
      {
        name: 'Prelims - CSAT (Paper II)',
        topics: [
          { name: 'Comprehension', subtopics: ['Reading Comprehension', 'Passage Analysis', 'Inference Drawing'] },
          { name: 'Logical Reasoning', subtopics: ['Syllogism', 'Blood Relations', 'Coding-Decoding', 'Seating Arrangement', 'Direction Test'] },
          { name: 'Mathematics', subtopics: ['Number System', 'Percentage', 'Ratio & Proportion', 'Profit & Loss', 'Time & Work', 'Data Interpretation'] },
          { name: 'Decision Making', subtopics: ['Administrative Decision Making', 'Ethical Dilemmas', 'Problem Solving'] },
        ]
      },
      {
        name: 'Mains - General Studies',
        topics: [
          { name: 'GS Paper I', subtopics: ['Indian Heritage & Culture', 'World History', 'Society & Social Issues', 'Physical Geography', 'Resource Distribution'] },
          { name: 'GS Paper II', subtopics: ['Governance & Constitution', 'Social Justice', 'International Relations', 'Indian Foreign Policy'] },
          { name: 'GS Paper III', subtopics: ['Indian Economy & Development', 'Science & Technology', 'Environment & Biodiversity', 'Disaster Management', 'Internal Security'] },
          { name: 'GS Paper IV (Ethics)', subtopics: ['Ethics & Human Interface', 'Attitude', 'Emotional Intelligence', 'Public Administration Ethics', 'Case Studies'] },
          { name: 'Essay Paper', subtopics: ['Philosophical Topics', 'Socio-Economic Topics', 'Political Topics', 'Abstract Topics'] },
        ]
      },
    ]
  },
  {
    category: 'SSC',
    color: 'from-blue-500 to-cyan-600',
    nodeColor: '#3b82f6',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    exams: [
      {
        name: 'SSC CGL - Tier I',
        topics: [
          { name: 'Quantitative Aptitude', subtopics: ['Number System', 'Algebra', 'Geometry & Mensuration', 'Trigonometry', 'Statistics', 'Data Interpretation', 'Profit & Loss', 'Time Speed Distance'] },
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Cloze Test', 'Error Detection', 'Sentence Improvement', 'Synonyms & Antonyms', 'Idioms & Phrases', 'One Word Substitution'] },
          { name: 'General Intelligence & Reasoning', subtopics: ['Analogy', 'Classification', 'Series', 'Coding-Decoding', 'Matrix', 'Word Formation', 'Venn Diagram', 'Blood Relations'] },
          { name: 'General Awareness', subtopics: ['History', 'Geography', 'Polity', 'Economics', 'Science', 'Current Affairs', 'Static GK'] },
        ]
      },
      {
        name: 'SSC CGL - Tier II',
        topics: [
          { name: 'Quantitative Aptitude (Advanced)', subtopics: ['Advanced Algebra', 'Coordinate Geometry', 'Trigonometric Identities', 'Data Sufficiency', 'Probability'] },
          { name: 'English Language (Advanced)', subtopics: ['Para Jumbles', 'Error Correction', 'Vocab in Context', 'Narrative Writing', 'Letter/Application Writing'] },
          { name: 'Statistics', subtopics: ['Collection of Data', 'Frequency Distribution', 'Measures of Central Tendency', 'Correlation & Regression', 'Probability Theory', 'Index Numbers'] },
          { name: 'General Studies (Finance & Economics)', subtopics: ['Accounting Fundamentals', 'Auditing', 'Income Tax', 'Economics & Governance', 'Commerce'] },
        ]
      },
      {
        name: 'SSC CHSL',
        topics: [
          { name: 'English Language', subtopics: ['Spot the Error', 'Fill in the Blanks', 'Synonyms/Antonyms', 'Spelling Check', 'Comprehension', 'Active/Passive Voice'] },
          { name: 'Quantitative Aptitude', subtopics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics'] },
          { name: 'General Intelligence', subtopics: ['Analogies', 'Classification', 'Coding-Decoding', 'Puzzle', 'Matrix', 'Non-Verbal Reasoning'] },
          { name: 'General Awareness', subtopics: ['Current Events', 'Sports', 'History', 'Culture', 'Geography', 'Economics', 'Polity', 'Science'] },
        ]
      },
    ]
  },
  {
    category: 'Banking',
    color: 'from-green-500 to-emerald-600',
    nodeColor: '#22c55e',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    exams: [
      {
        name: 'IBPS PO - Prelims',
        topics: [
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Cloze Test', 'Para Jumbles', 'Error Spotting', 'Fill in the Blanks', 'Sentence Rearrangement'] },
          { name: 'Quantitative Aptitude', subtopics: ['Simplification', 'Number Series', 'Data Interpretation', 'Quadratic Equations', 'Arithmetic Problems', 'Data Sufficiency'] },
          { name: 'Reasoning Ability', subtopics: ['Puzzles & Seating Arrangement', 'Syllogism', 'Inequality', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Order & Ranking'] },
        ]
      },
      {
        name: 'IBPS PO - Mains',
        topics: [
          { name: 'General/Economy/Banking Awareness', subtopics: ['Banking Terms', 'RBI Policies', 'Financial Awareness', 'Budget & Economy', 'Government Schemes', 'International Organizations'] },
          { name: 'Data Analysis & Interpretation', subtopics: ['Bar Graph', 'Pie Chart', 'Line Graph', 'Tabular DI', 'Caselet DI', 'Missing DI'] },
          { name: 'Reasoning & Computer Aptitude', subtopics: ['Puzzles', 'Machine Input-Output', 'Logical Reasoning', 'Data Sufficiency', 'Computer Fundamentals'] },
        ]
      },
      {
        name: 'SBI PO',
        topics: [
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Para Jumbles', 'Error Detection'] },
          { name: 'Data Analysis', subtopics: ['Number Series', 'Data Interpretation', 'Quadratic Equations', 'Quantity Comparison'] },
          { name: 'Reasoning', subtopics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Blood Relations', 'Coding-Decoding'] },
          { name: 'General Awareness', subtopics: ['Banking Awareness', 'Current Affairs', 'Economy', 'Financial Markets'] },
        ]
      },
      {
        name: 'SIDBI Grade A Officer',
        topics: [
          { name: 'Phase I - Online Exam', subtopics: ['English Language', 'Quantitative Aptitude', 'Reasoning Ability', 'General/Economy/Banking Awareness', 'Computer Knowledge'] },
          { name: 'Phase II - Descriptive Test', subtopics: ['Essay Writing (MSME & Economic Topics)', 'Précis Writing', 'Business Letter/Report Writing', 'Comprehension Passage'] },
          { name: 'Finance & MSME Awareness', subtopics: ['MSME Sector Overview', 'Credit & Lending Basics', 'Priority Sector Lending', 'MUDRA & Government MSME Schemes', 'SIDBI Role & Functions', 'Development Finance Institutions'] },
          { name: 'Banking & Economic Awareness', subtopics: ['Indian Banking System', 'RBI Monetary Policy', 'Indian Economy Fundamentals', 'Union Budget & Economic Survey', 'International Trade & Finance', 'Capital Markets & SEBI'] },
          { name: 'Interview & GD', subtopics: ['MSME & Development Finance Knowledge', 'Current Economic Affairs', 'Banking Sector Awareness', 'Personality & Communication Assessment', 'Situational & Behavioural Questions'] },
        ]
      },
      {
        name: 'NABARD Assistant Manager Grade A',
        topics: [
          { name: 'Phase I - Prelims', subtopics: ['Reasoning Ability', 'English Language', 'Computer Knowledge', 'General Awareness', 'Quantitative Aptitude'] },
          { name: 'Phase II - Mains (Economic & Social Issues)', subtopics: ['Economic Growth & Development', 'Indian Agriculture & Rural Economy', 'Financial Inclusion', 'Poverty & Inequality', 'Climate Change & Sustainable Development', 'Social Sector in India'] },
          { name: 'Phase II - Mains (Agriculture & Rural Dev.)', subtopics: ['Crop Husbandry & Management', 'Agricultural Finance & Credit', 'Rural Infrastructure Development', 'Agricultural Marketing', 'Watershed Management', 'Irrigation Systems', 'Agri-Insurance Schemes'] },
          { name: 'Phase II - Mains (General English)', subtopics: ['Essay Writing', 'Précis Writing', 'Comprehension', 'Report Writing'] },
          { name: 'NABARD & Development Finance', subtopics: ['NABARD History & Functions', 'Priority Sector Lending Norms', 'Agricultural & Rural Development Schemes', 'Micro-Finance & SHG-Bank Linkage', 'RIDF & Infrastructure Finance', 'Refinance Operations'] },
        ]
      },
    ]
  },
  {
    category: 'Railways',
    color: 'from-red-500 to-rose-600',
    nodeColor: '#ef4444',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    exams: [
      {
        name: 'RRB NTPC CBT-1',
        topics: [
          { name: 'Mathematics', subtopics: ['Number System', 'BODMAS', 'Decimals & Fractions', 'LCM & HCF', 'Ratio & Proportion', 'Percentage', 'Mensuration', 'Time & Work', 'Simple & Compound Interest', 'Profit & Loss', 'Elementary Algebra', 'Geometry', 'Trigonometry', 'Elementary Statistics'] },
          { name: 'General Intelligence & Reasoning', subtopics: ['Analogies', 'Alphabetical & Number Series', 'Coding-Decoding', 'Mathematical Operations', 'Relationships', 'Syllogism', 'Jumbling', 'Venn Diagrams', 'Data Interpretation', 'Statement-Conclusion', 'Decision Making'] },
          { name: 'General Awareness', subtopics: ['Current Events', 'History of India', 'Indian Polity', 'Indian Geography', 'Indian Economy', 'Physics', 'Chemistry', 'Life Science', 'Computer Basics', 'Sports', 'Inventions', 'United Nations'] },
        ]
      },
      {
        name: 'RRB Group D',
        topics: [
          { name: 'Mathematics', subtopics: ['Number System', 'BODMAS', 'Decimals', 'Fractions', 'Ratio & Proportion', 'Percentage', 'Mensuration', 'Time & Work', 'Profit & Loss', 'Simple Interest', 'Algebra', 'Geometry'] },
          { name: 'General Intelligence', subtopics: ['Analogies', 'Classification', 'Series', 'Coding-Decoding', 'Syllogism', 'Venn Diagrams', 'Blood Relations'] },
          { name: 'General Science', subtopics: ['Physics (10th level)', 'Chemistry (10th level)', 'Life Science (10th level)'] },
          { name: 'General Awareness', subtopics: ['Current Affairs', 'Culture', 'Sports', 'Personalities', 'Economics', 'Polity'] },
        ]
      },
    ]
  },
  {
    category: 'Defence',
    color: 'from-amber-500 to-orange-600',
    nodeColor: '#f59e0b',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    exams: [
      {
        name: 'NDA Written Exam',
        topics: [
          { name: 'Mathematics', subtopics: ['Algebra', 'Matrices & Determinants', 'Trigonometry', 'Analytical Geometry (2D & 3D)', 'Differential Calculus', 'Integral Calculus', 'Vector Algebra', 'Statistics & Probability'] },
          { name: 'General Ability Test', subtopics: ['English', 'Physics', 'Chemistry', 'General Science', 'History', 'Geography', 'Current Events'] },
        ]
      },
      {
        name: 'CDS Exam',
        topics: [
          { name: 'English', subtopics: ['Comprehension', 'Grammar', 'Vocabulary', 'Sentence Correction', 'Ordering of Words'] },
          { name: 'General Knowledge', subtopics: ['History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Current Affairs', 'Defence Related Topics'] },
          { name: 'Elementary Mathematics', subtopics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry', 'Mensuration', 'Statistics'] },
        ]
      },
      {
        name: 'AFCAT',
        topics: [
          { name: 'General Awareness', subtopics: ['History', 'Geography', 'Polity', 'Sports', 'Science', 'Defence & Current Affairs'] },
          { name: 'Verbal Ability', subtopics: ['Comprehension', 'Error Detection', 'Sentence Completion', 'Synonyms & Antonyms', 'Idioms'] },
          { name: 'Numerical Ability', subtopics: ['Decimal & Fractions', 'Ratio & Proportion', 'Percentage', 'Average', 'Profit & Loss', 'Simple & Compound Interest'] },
          { name: 'Reasoning & Military Aptitude', subtopics: ['Spatial Reasoning', 'Verbal & Non-Verbal', 'Series', 'Analogy', 'Classification'] },
        ]
      },
      {
        name: 'Indian Navy AA (Artificer Apprentice)',
        topics: [
          { name: 'Mathematics', subtopics: ['Algebra', 'Trigonometry', 'Calculus (Basics)', 'Coordinate Geometry', 'Probability & Statistics', 'Mensuration', 'Number System'] },
          { name: 'Science (Physics)', subtopics: ['Mechanics (Laws of Motion, Work & Energy)', 'Heat & Thermodynamics', 'Optics (Reflection, Refraction)', 'Electricity & Magnetism', 'Waves & Sound', 'Modern Physics'] },
          { name: 'Science (Chemistry)', subtopics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Chemical Reactions', 'Periodic Table', 'Acids, Bases & Salts'] },
          { name: 'English', subtopics: ['Reading Comprehension', 'Grammar (Tenses, Articles, Prepositions)', 'Vocabulary', 'Verbal Ability', 'Sentence Correction'] },
          { name: 'General Knowledge', subtopics: ['Current Affairs', 'Geography', 'Indian History', 'Indian Polity', 'Sports & Defence', 'Science & Technology', 'Awards & Honours'] },
        ]
      },
      {
        name: 'Indian Navy SSC Officer',
        topics: [
          { name: 'Technical Paper (Engineering)', subtopics: ['Engineering Mathematics', 'Core Engineering (EE/ME/EC/CS)', 'Applied Sciences', 'Technical Aptitude'] },
          { name: 'SSB Interview - Stage I', subtopics: ['OIR Test (Officer Intelligence Rating)', 'Picture Perception & Discussion Test (PPDT)', 'Story Writing & Narration'] },
          { name: 'SSB Interview - Stage II', subtopics: ['Psychology Tests (TAT, WAT, SRT, SDT)', 'Group Tasks (GTO)', 'Personal Interview', 'Conference'] },
          { name: 'Medical Standards', subtopics: ['Vision Standards (6/6 uncorrected)', 'Physical Fitness', 'Height & Weight Norms', 'No colour blindness'] },
        ]
      },
      {
        name: 'BSF Head Constable Ministerial',
        topics: [
          { name: 'General Knowledge & Awareness', subtopics: ['Indian History', 'Geography', 'Indian Polity & Constitution', 'General Science', 'Current Affairs', 'Sports & Awards', 'BSF Related GK'] },
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Fill in the Blanks', 'Error Detection', 'Vocabulary', 'Idioms & Phrases', 'Sentence Improvement'] },
          { name: 'Quantitative Aptitude', subtopics: ['Number System', 'Percentage', 'Ratio & Proportion', 'Average', 'Time & Work', 'Profit & Loss', 'Simple & Compound Interest', 'Mensuration', 'Data Interpretation'] },
          { name: 'General Intelligence & Reasoning', subtopics: ['Analogy', 'Classification', 'Series', 'Coding-Decoding', 'Direction Test', 'Blood Relations', 'Non-Verbal Reasoning'] },
          { name: 'Typing Skill Test', subtopics: ['English Typing (35 wpm)', 'Hindi Typing (30 wpm)', 'Accuracy Standards'] },
        ]
      },
      {
        name: 'ITBP / CRPF Constable (GD)',
        topics: [
          { name: 'General Knowledge', subtopics: ['Indian History', 'Geography', 'Indian Polity', 'Indian Economy', 'Science & Technology', 'Current Affairs', 'Sports'] },
          { name: 'Elementary Mathematics', subtopics: ['Arithmetic Operations', 'LCM & HCF', 'Percentage', 'Ratio & Proportion', 'Time & Work', 'Time & Distance', 'Profit & Loss', 'Simple Interest'] },
          { name: 'General English / Hindi', subtopics: ['Comprehension', 'Fill in the Blanks', 'Error Detection', 'Vocabulary', 'Sentence Correction'] },
          { name: 'Reasoning', subtopics: ['Analogy', 'Classification', 'Series', 'Coding-Decoding', 'Non-Verbal Reasoning', 'Spatial Reasoning'] },
          { name: 'Physical Efficiency Test', subtopics: ['1600m Run (Male) / 800m Run (Female)', 'Long Jump', 'High Jump', 'Medical Standards', 'Height & Weight Norms'] },
        ]
      },
      {
        name: 'Army JAG Entry (Law)',
        topics: [
          { name: 'Shortlisting Criteria', subtopics: ['LLB percentage (55% minimum)', 'Bar Council Enrollment', 'Unmarried status (at entry)', 'Age: 21-27 years'] },
          { name: 'SSB Interview - Stage I', subtopics: ['Officer Intelligence Rating (OIR)', 'Picture Perception & Discussion Test (PPDT)'] },
          { name: 'SSB Interview - Stage II', subtopics: ['Psychological Tests (TAT/WAT/SRT/SDT)', 'Group Testing (GTO)', 'Personal Interview', 'Conference Round'] },
          { name: 'Legal Knowledge (Background)', subtopics: ['Army Act 1950', 'Military Justice System', 'Constitutional Law', 'Criminal Law (CrPC/IPC)', 'Civil Law (CPC)', 'Evidence Act', 'International Humanitarian Law'] },
        ]
      },
    ]
  },
  {
    category: 'Teaching',
    color: 'from-teal-500 to-cyan-600',
    nodeColor: '#14b8a6',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    borderColor: 'border-teal-200 dark:border-teal-800',
    exams: [
      {
        name: 'CTET Paper I (Class 1-5)',
        topics: [
          { name: 'Child Development & Pedagogy', subtopics: ['Growth & Development', 'Piaget & Vygotsky', 'Learning Theories', 'Inclusive Education', 'Assessment & Evaluation'] },
          { name: 'Mathematics', subtopics: ['Number System', 'Geometry', 'Measurement', 'Data Handling', 'Pedagogy of Mathematics'] },
          { name: 'Environmental Studies', subtopics: ['Family & Friends', 'Food & Shelter', 'Water & Travel', 'Nature & Environment', 'Pedagogy of EVS'] },
          { name: 'Language I & II', subtopics: ['Comprehension', 'Grammar', 'Language Pedagogy', 'Teaching Strategies'] },
        ]
      },
      {
        name: 'UGC NET',
        topics: [
          { name: 'Paper I (General)', subtopics: ['Teaching Aptitude', 'Research Aptitude', 'Comprehension', 'Communication', 'Reasoning', 'Data Interpretation', 'ICT', 'Higher Education System', 'Governance & Polity', 'People & Environment'] },
          { name: 'Paper II (Subject)', subtopics: ['Subject-Specific Core Topics', 'Research Methodology', 'Advanced Concepts', 'Applied Knowledge'] },
        ]
      },
      {
        name: 'NVS PRT (Navodaya Vidyalaya Primary Teacher)',
        topics: [
          { name: 'Reasoning Ability', subtopics: ['Analogy', 'Classification', 'Series (Number & Alphabet)', 'Coding-Decoding', 'Blood Relations', 'Puzzles', 'Direction Sense', 'Venn Diagrams'] },
          { name: 'General Awareness', subtopics: ['Indian History', 'Geography', 'Indian Polity', 'Indian Economy', 'General Science', 'Current Affairs', 'Awards & Honours'] },
          { name: 'Hindi & English Language', subtopics: ['Reading Comprehension', 'Grammar (Tenses, Voice, Narration)', 'Vocabulary', 'Error Detection', 'Fill in the Blanks', 'Sentence Improvement'] },
          { name: 'Quantitative Aptitude', subtopics: ['Number System', 'Percentage', 'Ratio & Proportion', 'Profit & Loss', 'Time & Work', 'Mensuration', 'Average', 'Data Interpretation'] },
          { name: 'Subject Knowledge & Pedagogy', subtopics: ['Child Development & Growth', 'Learning Theories (Piaget, Vygotsky, Kohlberg)', 'Teaching Methodologies', 'Classroom Management', 'Assessment & Evaluation Techniques', 'NCF 2005', 'RTE Act 2009', 'Inclusive Education'] },
        ]
      },
    ]
  },
  {
    category: 'State PSC',
    color: 'from-rose-500 to-pink-600',
    nodeColor: '#f43f5e',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    borderColor: 'border-rose-200 dark:border-rose-800',
    exams: [
      {
        name: 'General State PSC Pattern',
        topics: [
          { name: 'General Studies', subtopics: ['Indian History & Culture', 'Indian & World Geography', 'Indian Polity & Governance', 'Indian Economy', 'General Science', 'Current Affairs'] },
          { name: 'State-Specific GK', subtopics: ['State History & Culture', 'State Geography', 'State Economy & Welfare', 'State Governance', 'Local Current Affairs', 'Famous Personalities'] },
          { name: 'Aptitude & Reasoning', subtopics: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'English/Hindi Language'] },
          { name: 'Optional Subject', subtopics: ['Subject chosen by candidate', 'In-depth paper', 'Applied knowledge'] },
        ]
      },
      {
        name: 'BPSC (Bihar PSC) Combined Exam',
        topics: [
          { name: 'Prelims - General Studies', subtopics: ['Indian History (Ancient, Medieval, Modern)', 'Bihar History & Culture', 'Indian & Bihar Geography', 'Indian Polity & Constitution', 'Indian Economy & Bihar Economy', 'General Science', 'Current Affairs (National & Bihar)'] },
          { name: 'Mains - General Hindi', subtopics: ['Comprehension & Précis', 'Grammar & Usage', 'Translation (Hindi-English)', 'Essay Writing in Hindi', 'Letter & Application Writing'] },
          { name: 'Mains - GS Paper I (Indian History & Culture)', subtopics: ['Ancient Indian History', 'Medieval Indian History', 'Modern Indian History & Freedom Struggle', 'Post-Independence India', 'Art, Culture & Heritage', 'World History'] },
          { name: 'Mains - GS Paper II (Indian Polity, Economy & Geography)', subtopics: ['Indian Constitution & Polity', 'Indian Economy & Development', 'Planning & Budget', 'Science & Technology', 'Environment & Ecology', 'Indian & World Geography'] },
          { name: 'Mains - Optional Subject', subtopics: ['Subject-specific in-depth paper', 'Theory & Applied Knowledge', 'Case Studies/Practicals (select subjects)'] },
          { name: 'Interview / Personality Test', subtopics: ['General Awareness (India & Bihar)', 'Current Affairs', 'Personality & Leadership Assessment', 'Communication Skills', 'Ethics & Integrity', 'Bihar-Specific Development Issues'] },
        ]
      },
      {
        name: 'North-East States PSC (Manipur/Meghalaya/Tripura/Nagaland/Mizoram/Sikkim)',
        topics: [
          { name: 'Prelims - General Studies', subtopics: ['Indian History & Culture', 'North-East India History & Culture', 'Indian & NE Geography', 'Indian Polity', 'General Science', 'Current Affairs (National & NE States)', 'Tribal & Ethnic Studies'] },
          { name: 'Mains - General Studies Papers', subtopics: ['History of India & the concerned NE State', 'Geography (India & NE region)', 'Indian Polity, Constitution & Governance', 'Economy (India & NE State)', 'NE India Tribal Culture & Society', 'Science, Technology & Environment', 'Current Affairs'] },
          { name: 'Mains - State-Specific Paper', subtopics: ['State History (Pre-colonial, Colonial, Post-independence)', 'State Governance & Administration', 'State Economy & Industries', 'Indigenous Communities & Tribal Institutions', 'State Acts & Legislation', 'Demographic Profile & Development Indicators'] },
          { name: 'Language Paper', subtopics: ['English Proficiency', 'Regional Language (Manipuri/Khasi/Kokborok/Mizo/Sikkimese etc.)', 'Translation', 'Essay Writing'] },
          { name: 'Interview & Viva-Voce', subtopics: ['State-specific Knowledge', 'General Awareness', 'Personality Assessment', 'Ethics & Public Service Values'] },
        ]
      },
    ]
  },
  {
    category: 'Police',
    color: 'from-slate-600 to-gray-800',
    nodeColor: '#475569',
    bgColor: 'bg-slate-50 dark:bg-slate-900/20',
    borderColor: 'border-slate-200 dark:border-slate-800',
    exams: [
      {
        name: 'SSC CPO Sub-Inspector',
        topics: [
          { name: 'General Intelligence & Reasoning', subtopics: ['Analogy', 'Classification', 'Series', 'Coding-Decoding', 'Matrix', 'Word Formation', 'Venn Diagram', 'Blood Relations', 'Direction Sense'] },
          { name: 'General Knowledge & Awareness', subtopics: ['History', 'Geography', 'Indian Polity', 'Economics', 'General Science', 'Current Affairs', 'Sports', 'Books & Authors'] },
          { name: 'Quantitative Aptitude', subtopics: ['Number System', 'Algebra', 'Geometry', 'Mensuration', 'Trigonometry', 'Statistics', 'Data Interpretation'] },
          { name: 'English Comprehension', subtopics: ['Error Detection', 'Fill in Blanks', 'Synonyms/Antonyms', 'Spelling', 'Idioms', 'One Word Substitution', 'Comprehension'] },
        ]
      },
      {
        name: 'State Police Constable',
        topics: [
          { name: 'General Knowledge', subtopics: ['Indian History', 'Geography', 'Indian Polity', 'Current Affairs', 'State-Specific GK', 'Science'] },
          { name: 'Reasoning', subtopics: ['Analogy', 'Series', 'Coding-Decoding', 'Direction Test', 'Blood Relations', 'Non-Verbal Reasoning'] },
          { name: 'Quantitative Aptitude', subtopics: ['Arithmetic', 'Number System', 'Percentage', 'Time & Distance', 'Profit & Loss'] },
          { name: 'Physical Fitness Test', subtopics: ['Running (1600m/800m)', 'Long Jump', 'High Jump', 'Shot Put', 'Physical Measurements'] },
        ]
      },
      {
        name: 'CAPF (Central Armed Police Forces)',
        topics: [
          { name: 'General Ability & Intelligence', subtopics: ['General Mental Ability', 'Logical Reasoning', 'Quantitative Aptitude', 'Data Interpretation'] },
          { name: 'General Studies, Essay & Comprehension', subtopics: ['Indian Polity', 'Indian Economy', 'History', 'Geography', 'Science & Technology', 'Current Affairs', 'Essay Writing'] },
        ]
      },
      {
        name: 'SSC Head Constable (Delhi Police)',
        topics: [
          { name: 'General Awareness / GK', subtopics: ['Indian History', 'Geography', 'Indian Polity', 'Indian Economy', 'General Science', 'Current Affairs', 'Sports & Awards', 'Delhi Police Related GK'] },
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Error Spotting', 'Fill in the Blanks', 'Vocabulary (Synonyms/Antonyms)', 'Idioms & Phrases', 'One Word Substitution', 'Sentence Improvement'] },
          { name: 'Quantitative Aptitude', subtopics: ['Number System', 'Simplification', 'Percentage', 'Ratio & Proportion', 'Profit & Loss', 'Average', 'Time & Work', 'Time & Distance', 'SI/CI', 'Data Interpretation', 'Mensuration'] },
          { name: 'Computer Fundamentals', subtopics: ['MS Office (Word, Excel, PowerPoint)', 'Internet & Networking Basics', 'Computer Hardware & Software', 'Operating Systems', 'Database Basics', 'Cyber Security Concepts'] },
        ]
      },
      {
        name: 'State Police Sub-Inspector (SI)',
        topics: [
          { name: 'General Knowledge & Current Affairs', subtopics: ['Indian History & Culture', 'Geography (India & World)', 'Indian Polity & Constitution', 'Indian Economy', 'General Science & Technology', 'Current Events (National & International)', 'State-Specific GK', 'Sports & Awards'] },
          { name: 'Quantitative Aptitude & Numerical Ability', subtopics: ['Number System & HCF/LCM', 'Percentage & Ratio-Proportion', 'Profit & Loss', 'SI & CI', 'Average & Ages', 'Time, Speed & Distance', 'Time & Work', 'Mensuration', 'Data Interpretation'] },
          { name: 'General Hindi / English', subtopics: ['Reading Comprehension', 'Grammar (Tenses, Voice, Narration)', 'Vocabulary (Synonyms, Antonyms)', 'Fill in the Blanks', 'Error Detection', 'Sentence Correction', 'Idioms & Phrases'] },
          { name: 'Reasoning Ability', subtopics: ['Analogy', 'Classification', 'Series (Number & Letter)', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Seating Arrangement', 'Ranking & Order', 'Non-Verbal Reasoning'] },
          { name: 'Physical Efficiency & Medical Test', subtopics: ['1600m Run (Male) / 800m Run (Female)', 'Long Jump & High Jump', 'Shot Put', 'Height & Chest Measurement (Male)', 'Vision & Colour Blindness Test', 'Medical Fitness Assessment'] },
          { name: 'Interview / Personality Test (select states)', subtopics: ['General Awareness', 'Personality Assessment', 'Communication Skills', 'Leadership & Integrity', 'Knowledge of Police Act & State Laws'] },
        ]
      },
    ]
  },
  {
    category: 'Insurance',
    color: 'from-sky-500 to-blue-600',
    nodeColor: '#0ea5e9',
    bgColor: 'bg-sky-50 dark:bg-sky-900/20',
    borderColor: 'border-sky-200 dark:border-sky-800',
    exams: [
      {
        name: 'LIC AAO',
        topics: [
          { name: 'Reasoning Ability', subtopics: ['Puzzles & Seating Arrangement', 'Syllogism', 'Inequality', 'Coding-Decoding', 'Blood Relations', 'Data Sufficiency', 'Logical Reasoning'] },
          { name: 'Quantitative Aptitude', subtopics: ['Simplification', 'Number Series', 'Data Interpretation', 'Quadratic Equations', 'Arithmetic', 'Data Sufficiency'] },
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Cloze Test', 'Error Detection', 'Para Jumbles', 'Fill in Blanks'] },
          { name: 'General Knowledge & Current Affairs', subtopics: ['Insurance Awareness', 'Financial Awareness', 'Banking Terms', 'Current Affairs', 'Static GK'] },
          { name: 'Insurance & Financial Market Awareness', subtopics: ['LIC History & Products', 'IRDAI Regulations', 'Insurance Terminology', 'Types of Insurance', 'Financial Markets', 'Mutual Funds & Investments'] },
        ]
      },
      {
        name: 'NIACL/UIIC AO',
        topics: [
          { name: 'Reasoning', subtopics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Input-Output', 'Inequality', 'Data Sufficiency'] },
          { name: 'English Language', subtopics: ['Comprehension', 'Cloze Test', 'Error Correction', 'Vocabulary', 'Sentence Rearrangement'] },
          { name: 'Quantitative Aptitude', subtopics: ['DI', 'Number Series', 'Simplification', 'Arithmetic Problems'] },
          { name: 'General Awareness', subtopics: ['Insurance Awareness', 'Current Affairs', 'Banking & Economy', 'Government Schemes'] },
        ]
      },
    ]
  },
  {
    category: 'PSU',
    color: 'from-indigo-500 to-violet-600',
    nodeColor: '#6366f1',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    exams: [
      {
        name: 'GATE (for PSU Recruitment)',
        topics: [
          { name: 'Engineering Mathematics', subtopics: ['Linear Algebra', 'Calculus', 'Differential Equations', 'Probability & Statistics', 'Numerical Methods', 'Complex Analysis'] },
          { name: 'General Aptitude', subtopics: ['Verbal Ability', 'Numerical Ability', 'Analytical Reasoning', 'Spatial Aptitude'] },
          { name: 'Core Engineering (CS)', subtopics: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Theory of Computation', 'Compiler Design', 'Digital Logic', 'Computer Architecture'] },
          { name: 'Core Engineering (ECE)', subtopics: ['Signals & Systems', 'Electronic Devices', 'Analog Circuits', 'Digital Circuits', 'Control Systems', 'Communications', 'Electromagnetics'] },
          { name: 'Core Engineering (ME)', subtopics: ['Engineering Mechanics', 'Strength of Materials', 'Thermodynamics', 'Fluid Mechanics', 'Heat Transfer', 'Manufacturing', 'Machine Design', 'Industrial Engineering'] },
        ]
      },
      {
        name: 'PSU Through GATE (Interview)',
        topics: [
          { name: 'Technical Interview', subtopics: ['Core Subject Questions', 'Project Discussion', 'Latest Technology Trends', 'Problem-Solving Ability'] },
          { name: 'HR Interview', subtopics: ['Self Introduction', 'Why This PSU', 'Career Goals', 'Strengths & Weaknesses', 'Situational Questions'] },
          { name: 'Group Discussion', subtopics: ['Current Affairs Topics', 'Technical Topics', 'Abstract Topics', 'Case Studies'] },
        ]
      },
      {
        name: 'ISRO Scientist/Engineer SC (Direct Recruitment)',
        topics: [
          { name: 'Written Test - Engineering Mathematics', subtopics: ['Linear Algebra & Matrix Theory', 'Calculus & Differential Equations', 'Probability & Statistics', 'Numerical Methods', 'Discrete Mathematics', 'Complex Variables'] },
          { name: 'Written Test - Core CS/IT', subtopics: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS & SQL', 'Computer Networks (OSI, TCP/IP)', 'Software Engineering', 'Programming (C/C++/Java)', 'Theory of Computation'] },
          { name: 'Written Test - Core ECE', subtopics: ['Analog & Digital Circuits', 'Signals & Systems', 'Control Systems', 'Communications (Analog & Digital)', 'Electromagnetics', 'Microprocessors & Embedded Systems'] },
          { name: 'Written Test - Core ME', subtopics: ['Engineering Mechanics', 'Strength of Materials', 'Thermodynamics & Heat Transfer', 'Fluid Mechanics', 'Manufacturing Processes', 'Machine Design & Dynamics'] },
          { name: 'General Aptitude', subtopics: ['Verbal Ability (English)', 'Numerical & Analytical Ability', 'Logical Reasoning', 'Data Interpretation'] },
          { name: 'Interview', subtopics: ['Technical Depth Questions', 'Domain Knowledge', 'Space & Research Orientation', 'HR & Behavioural Assessment'] },
        ]
      },
      {
        name: 'HAL / NHPC / GAIL Management Trainee',
        topics: [
          { name: 'Written Test - Technical', subtopics: ['Core Engineering Subject (Discipline-specific)', 'Engineering Mathematics', 'Aptitude (Quantitative & Reasoning)', 'English Language'] },
          { name: 'Technical Paper - CS/IT Discipline', subtopics: ['Programming & Data Structures', 'DBMS & SQL', 'OS & Computer Networks', 'Software Engineering', 'Web Technologies', 'Cybersecurity Basics'] },
          { name: 'Technical Paper - Mechanical Discipline', subtopics: ['Strength of Materials', 'Manufacturing Technology', 'Thermodynamics', 'Fluid Mechanics', 'Heat Transfer', 'Industrial Engineering & Operations Research'] },
          { name: 'Technical Paper - Electrical Discipline', subtopics: ['Power Systems', 'Electrical Machines', 'Control Systems', 'Power Electronics', 'Measurement & Instrumentation', 'High Voltage Engineering'] },
          { name: 'Group Discussion & Interview', subtopics: ['Industry/Technical Topics', 'Current Affairs', 'PSU & Company Knowledge', 'Leadership & Team-Building Assessment', 'HR/Personality Assessment'] },
        ]
      },
      {
        name: 'ONGC / HPCL Officer Grade A',
        topics: [
          { name: 'Written Examination - Technical Paper', subtopics: ['Core Discipline Subject (ME/EE/ECE/CS/Civil/Chemical)', 'Engineering Mathematics', 'Petroleum Technology Basics (for E&P roles)', 'HSE (Health, Safety & Environment) Concepts'] },
          { name: 'Written Examination - General Aptitude', subtopics: ['Quantitative Aptitude', 'Logical Reasoning', 'English Language & Comprehension', 'General Awareness (Energy Sector, Current Affairs)'] },
          { name: 'GD & Interview', subtopics: ['Domain & Technical Knowledge', 'Petroleum/Refinery Operations (role-specific)', 'Corporate GK (ONGC/HPCL subsidiaries, projects)', 'Behavioral & Situational Questions', 'Leadership Potential'] },
        ]
      },
    ]
  },
  {
    category: 'Regulatory Bodies',
    color: 'from-emerald-500 to-teal-600',
    nodeColor: '#10b981',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    exams: [
      {
        name: 'RBI Grade B',
        topics: [
          { name: 'Phase I - General Awareness', subtopics: ['Banking & Financial Awareness', 'Current Affairs', 'Economy', 'Government Schemes'] },
          { name: 'Phase I - Quantitative Aptitude', subtopics: ['DI', 'Number Series', 'Quadratic Equations', 'Simplification', 'Arithmetic'] },
          { name: 'Phase I - English Language', subtopics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Cloze Test'] },
          { name: 'Phase I - Reasoning', subtopics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Inequality', 'Coding-Decoding'] },
          { name: 'Phase II - Economic & Social Issues', subtopics: ['Growth & Development', 'Indian Economy', 'Globalization', 'Social Structure', 'Poverty & Inequality', 'Financial Inclusion'] },
          { name: 'Phase II - Finance & Management', subtopics: ['Financial System', 'RBI Functions', 'Risk Management', 'Management Theories', 'HR Management', 'Organizational Behavior'] },
        ]
      },
      {
        name: 'SEBI Grade A',
        topics: [
          { name: 'Phase I', subtopics: ['General Awareness', 'English Language', 'Quantitative Aptitude', 'Reasoning'] },
          { name: 'Phase II - Commerce & Accountancy', subtopics: ['Financial Accounting', 'Cost Accounting', 'Auditing', 'Company Law', 'Securities Market'] },
          { name: 'Phase II - Securities Market', subtopics: ['SEBI Act & Regulations', 'Stock Exchanges', 'Mutual Funds', 'Derivatives', 'Corporate Governance', 'Investor Protection'] },
        ]
      },
      {
        name: 'IBBI Grade A Officer',
        topics: [
          { name: 'Phase I - English Language', subtopics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Cloze Test', 'Error Detection', 'Sentence Rearrangement'] },
          { name: 'Phase I - General Awareness', subtopics: ['Financial Awareness', 'Banking & Insurance', 'Capital Markets', 'Insolvency & Bankruptcy Code Basics', 'Current Affairs', 'Government Schemes'] },
          { name: 'Phase I - Quantitative Aptitude', subtopics: ['Number System', 'Percentage', 'Ratio & Proportion', 'SI/CI', 'Data Interpretation', 'Probability', 'Number Series'] },
          { name: 'Phase I - Reasoning', subtopics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Inequality', 'Coding-Decoding', 'Blood Relations', 'Data Sufficiency'] },
          { name: 'Phase II - Professional Knowledge', subtopics: ['Insolvency & Bankruptcy Code 2016', 'NCLT/NCLAT Procedures', 'Corporate Law (Companies Act)', 'Finance & Accounting', 'Economics & Public Policy', 'Regulation of Financial Markets'] },
          { name: 'Phase II - Descriptive English', subtopics: ['Essay Writing', 'Precis Writing', 'Letter/Report Writing', 'Comprehension & Analysis'] },
        ]
      },
    ]
  },
  {
    category: 'Judiciary',
    color: 'from-yellow-500 to-amber-600',
    nodeColor: '#eab308',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    exams: [
      {
        name: 'Judicial Services Exam',
        topics: [
          { name: 'Civil Law', subtopics: ['Code of Civil Procedure (CPC)', 'Indian Contract Act', 'Specific Relief Act', 'Limitation Act', 'Transfer of Property Act', 'Hindu Marriage Act', 'Muslim Personal Law'] },
          { name: 'Criminal Law', subtopics: ['Indian Penal Code (IPC)', 'Code of Criminal Procedure (CrPC)', 'Indian Evidence Act', 'Juvenile Justice Act', 'NDPS Act', 'SC/ST Prevention of Atrocities Act'] },
          { name: 'Constitutional Law', subtopics: ['Fundamental Rights', 'Directive Principles', 'Constitutional Remedies (Writs)', 'Parliamentary Privileges', 'Judicial Review', 'Emergency Provisions', 'Amendment Process'] },
          { name: 'Language & General Knowledge', subtopics: ['English Language', 'Hindi/Regional Language', 'Legal Maxims', 'Current Legal Affairs', 'Landmark Judgments'] },
        ]
      },
      {
        name: 'CLAT (for Law Admission)',
        topics: [
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Critical Reasoning from Passages'] },
          { name: 'Current Affairs & GK', subtopics: ['National & International Events', 'Awards', 'Sports', 'Legal Current Affairs'] },
          { name: 'Legal Reasoning', subtopics: ['Legal Principles', 'Fact Situations', 'Legal Propositions', 'Passage-Based Legal Questions'] },
          { name: 'Logical Reasoning', subtopics: ['Arguments', 'Assumptions', 'Inference', 'Cause & Effect', 'Strengthening & Weakening'] },
          { name: 'Quantitative Techniques', subtopics: ['Data Interpretation', 'Basic Math', 'Ratio & Proportion', 'Percentage', 'Mensuration'] },
        ]
      },
      {
        name: 'Maharashtra Judicial Services',
        topics: [
          { name: 'Civil Law', subtopics: ['Code of Civil Procedure (CPC)', 'Indian Contract Act', 'Transfer of Property Act', 'Specific Relief Act', 'Limitation Act', 'Hindu Law & Muslim Law'] },
          { name: 'Criminal Law', subtopics: ['Indian Penal Code (IPC)', 'Code of Criminal Procedure (CrPC)', 'Indian Evidence Act', 'NDPS Act', 'POCSO Act'] },
          { name: 'Constitutional Law', subtopics: ['Fundamental Rights', 'Directive Principles (DPSP)', 'Constitutional Remedies (Writs)', 'Emergency Provisions', 'Judicial Review'] },
          { name: 'Maharashtra Local Acts', subtopics: ['Maharashtra Rent Control Act', 'Maharashtra Land Revenue Code', 'MRTP Act', 'Maharashtra Tenancy & Agricultural Lands Act'] },
          { name: 'Language Papers', subtopics: ['English Proficiency', 'Marathi Proficiency', 'Translation', 'Essay Writing'] },
        ]
      },
      {
        name: 'Bihar Judicial Services',
        topics: [
          { name: 'Civil Law', subtopics: ['Code of Civil Procedure (CPC)', 'Indian Contract Act', 'Transfer of Property Act', 'Specific Relief Act', 'Limitation Act', 'Hindu Law', 'Muslim Law'] },
          { name: 'Criminal Law', subtopics: ['Indian Penal Code (IPC)', 'Code of Criminal Procedure (CrPC)', 'Indian Evidence Act', 'NDPS Act', 'Prevention of Corruption Act'] },
          { name: 'Constitutional & Administrative Law', subtopics: ['Fundamental Rights', 'Writs', 'Judicial Review', 'Public Interest Litigation (PIL)', 'Centre-State Relations'] },
          { name: 'Bihar Revenue & Local Laws', subtopics: ['Bihar Land Reforms Act', 'Bihar Tenancy Act', 'Bihar Panchayat Raj Act', 'Bihar Excise Act'] },
          { name: 'Language & General Knowledge', subtopics: ['General English', 'Hindi', 'General Knowledge of India & Bihar', 'Legal Current Affairs'] },
        ]
      },
      {
        name: 'Karnataka Judicial Services',
        topics: [
          { name: 'Civil Law', subtopics: ['Code of Civil Procedure (CPC)', 'Indian Contract Act', 'Transfer of Property Act', 'Specific Relief Act', 'Karnataka Rent Act', 'Hindu Law', 'Muslim Law'] },
          { name: 'Criminal Law', subtopics: ['IPC / Bharatiya Nyaya Sanhita (BNS)', 'CrPC / Bharatiya Nagarik Suraksha Sanhita (BNSS)', 'Indian Evidence Act / Bharatiya Sakshya Adhiniyam (BSA)', 'NDPS Act', 'SC/ST Atrocities Act', 'POCSO Act'] },
          { name: 'Constitutional Law', subtopics: ['Fundamental Rights', 'Directive Principles', 'Constitutional Remedies (Writs)', 'Judicial Review', 'Emergency Provisions'] },
          { name: 'Karnataka State Laws', subtopics: ['Karnataka Land Revenue Act', 'Karnataka Land Reforms Act', 'Karnataka Gram Swaraj & Panchayat Raj Act', 'Karnataka Rent Control Act'] },
          { name: 'Language Papers', subtopics: ['Kannada Proficiency', 'English Proficiency', 'Translation (English-Kannada)', 'Essay Writing'] },
        ]
      },
      {
        name: 'Haryana Judicial Services',
        topics: [
          { name: 'Civil Law', subtopics: ['Code of Civil Procedure (CPC)', 'Indian Contract Act', 'Transfer of Property Act', 'Specific Relief Act', 'Limitation Act', 'Partnership Act', 'Hindu Law', 'Muslim Law'] },
          { name: 'Criminal Law', subtopics: ['Indian Penal Code (IPC)', 'Code of Criminal Procedure (CrPC)', 'Indian Evidence Act', 'Prevention of Corruption Act', 'NDPS Act', 'SC/ST Atrocities Act'] },
          { name: 'Constitutional Law', subtopics: ['Fundamental Rights', 'Directive Principles', 'Writs', 'Emergency Provisions', 'Centre-State Relations', 'Panchayati Raj'] },
          { name: 'Haryana Local Laws', subtopics: ['Haryana Urban Control of Rent & Eviction Act', 'East Punjab Urban Rent Restriction Act', 'Haryana Panchayati Raj Act', 'Punjab Land Revenue Act'] },
          { name: 'Language & General Knowledge', subtopics: ['English', 'Hindi', 'General Knowledge of India & Haryana', 'Legal Maxims', 'Landmark Judgments'] },
        ]
      },
      {
        name: 'MP Judicial Services',
        topics: [
          { name: 'Civil Law', subtopics: ['Code of Civil Procedure (CPC)', 'Indian Contract Act', 'Transfer of Property Act', 'Specific Relief Act', 'Limitation Act', 'MP Accommodation Control Act', 'Hindu Law', 'Muslim Law'] },
          { name: 'Criminal Law', subtopics: ['Indian Penal Code (IPC)', 'Code of Criminal Procedure (CrPC)', 'Indian Evidence Act', 'NDPS Act', 'Juvenile Justice Act', 'Prevention of Corruption Act', 'POCSO Act'] },
          { name: 'Constitutional & Administrative Law', subtopics: ['Fundamental Rights', 'Directive Principles', 'Writs', 'Emergency Provisions', 'Tribunals', 'RTI Act'] },
          { name: 'MP State Laws', subtopics: ['MP Land Revenue Code', 'MP Panchayat Raj Avam Gram Swaraj Adhiniyam', 'MP Excise Act', 'MP Accommodation Control Act'] },
          { name: 'Language Papers', subtopics: ['Hindi Proficiency', 'English Proficiency', 'Essay Writing', 'Translation (Hindi-English)'] },
        ]
      },
    ]
  },
  {
    category: 'Healthcare',
    color: 'from-red-400 to-rose-500',
    nodeColor: '#f87171',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    exams: [
      {
        name: 'NEET PG',
        topics: [
          { name: 'Pre-Clinical Subjects', subtopics: ['Anatomy', 'Physiology', 'Biochemistry'] },
          { name: 'Para-Clinical Subjects', subtopics: ['Pathology', 'Pharmacology', 'Microbiology', 'Forensic Medicine'] },
          { name: 'Clinical Subjects', subtopics: ['General Medicine', 'General Surgery', 'Obstetrics & Gynecology', 'Pediatrics', 'Orthopedics', 'Ophthalmology', 'ENT', 'Dermatology', 'Psychiatry', 'Anesthesia', 'Radiology'] },
          { name: 'Preventive & Social Medicine', subtopics: ['Epidemiology', 'Biostatistics', 'Nutrition', 'National Health Programs', 'Environmental Health', 'Occupational Health'] },
        ]
      },
      {
        name: 'AIIMS Nursing',
        topics: [
          { name: 'General Nursing', subtopics: ['Fundamentals of Nursing', 'Medical-Surgical Nursing', 'Anatomy & Physiology', 'Microbiology', 'Nutrition'] },
          { name: 'Community Health Nursing', subtopics: ['Community Health', 'Environmental Sanitation', 'Epidemiology', 'Health Education', 'Family Welfare'] },
          { name: 'Child Health Nursing', subtopics: ['Growth & Development', 'Neonatal Nursing', 'Pediatric Conditions', 'Immunization'] },
          { name: 'Mental Health Nursing', subtopics: ['Psychiatric Disorders', 'Therapeutic Communication', 'Psychopharmacology', 'Crisis Intervention'] },
        ]
      },
      {
        name: 'NEET MDS (Dental PG Entrance)',
        topics: [
          { name: 'Oral Medicine & Radiology', subtopics: ['Oral Pathology', 'Clinical Diagnosis', 'Radiographic Interpretation', 'Oral Lesions & Conditions', 'Systemic Diseases with Oral Manifestations'] },
          { name: 'Prosthodontics', subtopics: ['Complete Dentures', 'Removable Partial Dentures', 'Fixed Partial Dentures', 'Implantology', 'Dental Materials', 'Maxillofacial Prosthetics'] },
          { name: 'Conservative Dentistry & Endodontics', subtopics: ['Operative Dentistry', 'Dental Materials', 'Pulp Biology & Pathology', 'Root Canal Treatment', 'Endodontic Surgery', 'Tooth Restoration'] },
          { name: 'Orthodontics', subtopics: ['Cephalometrics', 'Biomechanics', 'Fixed & Removable Appliances', 'Growth & Development', 'Malocclusion Classification', 'Treatment Planning'] },
          { name: 'Oral & Maxillofacial Surgery', subtopics: ['Dental Trauma', 'TMJ Disorders', 'Oral Infections', 'Cysts & Tumors', 'Cleft Lip & Palate', 'Local & General Anesthesia'] },
          { name: 'Periodontics & Pedodontics', subtopics: ['Periodontal Diseases', 'Scaling & Root Planing', 'Flap Surgeries', 'Child Dental Behavior', 'Preventive Pediatric Dentistry', 'Pulp Therapy in Children'] },
          { name: 'Public Health Dentistry', subtopics: ['Epidemiology', 'Biostatistics', 'Preventive Dentistry Programs', 'Community Oral Health', 'Water Fluoridation', 'Dental Public Health Research'] },
        ]
      },
    ]
  },
  {
    category: 'Postal',
    color: 'from-orange-400 to-amber-500',
    nodeColor: '#fb923c',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    exams: [
      {
        name: 'India Post GDS',
        topics: [
          { name: 'Mathematics', subtopics: ['Number System', 'Fractions & Decimals', 'Percentage', 'Ratio & Proportion', 'Profit & Loss', 'Simple & Compound Interest', 'Time & Work', 'Time & Distance', 'Average'] },
          { name: 'English Language', subtopics: ['Articles', 'Prepositions', 'Tenses', 'Vocabulary', 'Comprehension', 'Sentence Correction'] },
          { name: 'General Knowledge', subtopics: ['Indian History', 'Geography', 'Indian Polity', 'Current Affairs', 'Science', 'Sports', 'Awards'] },
          { name: 'Reasoning', subtopics: ['Analogies', 'Series', 'Coding-Decoding', 'Classification', 'Direction Test'] },
        ]
      },
      {
        name: 'India Post MTS / Postman',
        topics: [
          { name: 'General Intelligence & Reasoning', subtopics: ['Analogy', 'Classification', 'Number Series', 'Coding-Decoding', 'Distance & Direction', 'Blood Relations', 'Venn Diagrams'] },
          { name: 'Quantitative Aptitude', subtopics: ['Number System', 'Computation', 'Decimals & Fractions', 'Percentage', 'Average', 'Time & Distance', 'Mensuration'] },
          { name: 'English Language', subtopics: ['Spot the Error', 'Fill in Blanks', 'Synonyms/Antonyms', 'Comprehension', 'Spelling'] },
          { name: 'General Awareness', subtopics: ['Current Affairs', 'India & Neighbours', 'History', 'Geography', 'Science', 'Postal Department GK'] },
        ]
      },
      {
        name: 'India Post PA/SA (Postal Assistant / Sorting Assistant)',
        topics: [
          { name: 'General Knowledge', subtopics: ['Current Affairs', 'Indian History', 'Geography', 'Indian Polity', 'Indian Economy', 'General Science', 'Sports & Awards'] },
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Grammar (Tenses, Voice, Narration)', 'Vocabulary (Synonyms/Antonyms)', 'Sentence Correction', 'Fill in the Blanks'] },
          { name: 'Mathematics', subtopics: ['Number System', 'Percentage', 'Ratio & Proportion', 'Average', 'SI/CI', 'Profit & Loss', 'Time & Work', 'Time & Distance', 'Mensuration', 'Data Interpretation'] },
          { name: 'Reasoning & Analytical Ability', subtopics: ['Analogy', 'Classification', 'Series (Number & Alphabet)', 'Coding-Decoding', 'Direction Sense', 'Blood Relations', 'Puzzles', 'Logical Reasoning'] },
        ]
      },
    ]
  },
  {
    category: 'Agriculture',
    color: 'from-lime-500 to-green-600',
    nodeColor: '#84cc16',
    bgColor: 'bg-lime-50 dark:bg-lime-900/20',
    borderColor: 'border-lime-200 dark:border-lime-800',
    exams: [
      {
        name: 'FCI Manager',
        topics: [
          { name: 'General Aptitude', subtopics: ['Quantitative Aptitude', 'English Language', 'General Intelligence & Reasoning'] },
          { name: 'General Knowledge', subtopics: ['Current Affairs', 'Indian Economy', 'Indian Polity', 'History', 'Geography', 'Food & Agriculture Policies'] },
          { name: 'Agriculture & Food Management', subtopics: ['Food Grain Production', 'Procurement', 'Storage', 'Distribution', 'Food Safety Standards', 'PDS & Buffer Stock'] },
        ]
      },
      {
        name: 'ICAR (Agriculture Research)',
        topics: [
          { name: 'Agriculture Science', subtopics: ['Agronomy', 'Soil Science', 'Plant Breeding', 'Plant Pathology', 'Entomology', 'Horticulture', 'Agricultural Economics'] },
          { name: 'Animal Science', subtopics: ['Animal Nutrition', 'Animal Genetics', 'Livestock Production', 'Dairy Technology', 'Veterinary Science'] },
          { name: 'General Studies', subtopics: ['Research Methodology', 'Data Interpretation', 'English Language', 'General Knowledge'] },
        ]
      },
      {
        name: 'ICAR NET (JRF & Lectureship)',
        topics: [
          { name: 'Paper I - Agriculture & General Knowledge', subtopics: ['Agronomy', 'Soil Science', 'Entomology', 'Plant Pathology', 'Genetics & Plant Breeding', 'Agricultural Extension', 'Agricultural Economics', 'General Science'] },
          { name: 'Paper II - Subject-Specific (Crop Sciences)', subtopics: ['Crop Production & Cropping Systems', 'Weed Management', 'Soil Fertility & Nutrient Management', 'Irrigation & Water Management', 'Dryland Agriculture', 'Organic Farming', 'Precision Agriculture'] },
          { name: 'Paper II - Subject-Specific (Horticulture)', subtopics: ['Fruit Science', 'Vegetable Science', 'Floriculture & Landscaping', 'Post-Harvest Technology', 'Plantation Crops', 'Spices & Medicinal Plants'] },
          { name: 'Paper II - Subject-Specific (Animal Sciences)', subtopics: ['Animal Nutrition', 'Animal Genetics & Breeding', 'Livestock Production', 'Dairy Technology', 'Veterinary Pathology', 'Poultry Science'] },
          { name: 'Paper II - Subject-Specific (Other Disciplines)', subtopics: ['Fisheries Science', 'Forestry', 'Home Science', 'Food Technology', 'Agricultural Engineering', 'Agricultural Statistics'] },
        ]
      },
    ]
  },
  {
    category: 'Miscellaneous',
    color: 'from-fuchsia-500 to-purple-600',
    nodeColor: '#d946ef',
    bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
    borderColor: 'border-fuchsia-200 dark:border-fuchsia-800',
    exams: [
      {
        name: 'DRDO CEPTAM',
        topics: [
          { name: 'Tier I - Quantitative Ability', subtopics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics'] },
          { name: 'Tier I - General Intelligence', subtopics: ['Analogies', 'Classification', 'Series', 'Coding-Decoding', 'Puzzle', 'Matrix'] },
          { name: 'Tier I - English', subtopics: ['Comprehension', 'Vocabulary', 'Grammar', 'Sentence Structure'] },
          { name: 'Tier I - General Awareness', subtopics: ['Current Affairs', 'History', 'Geography', 'Science', 'Defence & Space Technology'] },
          { name: 'Tier II - Trade/Subject Specific', subtopics: ['Computer Science', 'Electronics', 'Mechanical', 'Electrical', 'Civil', 'Administration'] },
        ]
      },
      {
        name: 'ISRO Scientist/Engineer',
        topics: [
          { name: 'Core Engineering/Science', subtopics: ['Engineering Mathematics', 'Core Subject (CS/ECE/ME/EE)', 'Numerical Methods', 'Research Aptitude'] },
          { name: 'General Aptitude', subtopics: ['Verbal Ability', 'Numerical Ability', 'Analytical Reasoning'] },
        ]
      },
      {
        name: 'NTA CUET',
        topics: [
          { name: 'Section IA - Language (English)', subtopics: ['Reading Comprehension', 'Verbal Ability', 'Grammar', 'Vocabulary'] },
          { name: 'Section II - Domain Subjects', subtopics: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Accountancy', 'Economics', 'Business Studies', 'History', 'Political Science', 'Geography', 'Computer Science'] },
          { name: 'Section III - General Test', subtopics: ['General Knowledge', 'Current Affairs', 'Quantitative Reasoning', 'Logical & Analytical Reasoning', 'Numerical Ability'] },
        ]
      },
      {
        name: 'EPFO Enforcement Officer / Account Officer',
        topics: [
          { name: 'Phase I - Preliminary Exam', subtopics: ['Reasoning Ability', 'English Language', 'Quantitative Aptitude', 'General Awareness'] },
          { name: 'Phase II - Mains (General/Financial Awareness)', subtopics: ['Indian Economy & Financial System', 'Banking & Financial Awareness', 'Capital Markets & Insurance', 'Budget & Government Schemes', 'Current Affairs (Economy Focus)'] },
          { name: 'Phase II - Mains (Industrial Relations & Labour Laws)', subtopics: ['Employees Provident Fund & Misc. Provisions Act 1952', 'Employees Pension Scheme 1995', 'Employees Deposit Linked Insurance Scheme', 'Payment of Gratuity Act', 'Workmen Compensation Act', 'Industrial Disputes Act', 'Factories Act', 'Trade Unions Act'] },
          { name: 'Phase II - Mains (Accountancy & Law)', subtopics: ['Financial Accounting Fundamentals', 'Partnership & Company Accounts', 'Company Law (Companies Act 2013 Basics)', 'Contract Act', 'Income Tax (Personal & Corporate Basics)', 'GST Basics'] },
          { name: 'Phase II - Mains (English Descriptive)', subtopics: ['Essay Writing', 'Letter/Report Writing', 'Précis Writing', 'Comprehension'] },
          { name: 'Interview', subtopics: ['Labour Law Knowledge', 'EPFO Operations & Scheme Awareness', 'Current Affairs', 'General Personality Assessment'] },
        ]
      },
      {
        name: 'FCI Junior Engineer (JE)',
        topics: [
          { name: 'Paper I - General Aptitude', subtopics: ['English Language', 'Quantitative Aptitude', 'Reasoning Ability', 'General Intelligence', 'Computer Basics'] },
          { name: 'Paper II - Technical (Civil Engineering)', subtopics: ['Structural Engineering', 'Concrete Technology', 'Soil Mechanics & Foundation', 'Fluid Mechanics', 'Environmental Engineering', 'Steel Structures', 'Construction Management'] },
          { name: 'Paper II - Technical (Electrical Engineering)', subtopics: ['Electrical Machines', 'Power Systems', 'Control Systems', 'Measurement & Instrumentation', 'Power Electronics', 'Basic Electronics', 'Electrical Installation Standards'] },
          { name: 'Paper II - Technical (Mechanical Engineering)', subtopics: ['Engineering Mechanics', 'Strength of Materials', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Refrigeration & Air Conditioning', 'Industrial Engineering'] },
          { name: 'Food Corporation Knowledge', subtopics: ['FCI Mandate & Organizational Structure', 'Food Procurement & Storage', 'Warehouse Management', 'Food Safety (FSSAI) Basics', 'Government Food Schemes (PMGKAY, PDS)'] },
        ]
      },
      {
        name: 'DRDO JRF (Junior Research Fellowship)',
        topics: [
          { name: 'RAC Written Test - General Section', subtopics: ['General Aptitude (Quantitative)', 'Logical Reasoning', 'English Language', 'General Awareness (Science & Defence Focus)'] },
          { name: 'RAC Written Test - Domain Section (CS/IT)', subtopics: ['Algorithms & Data Structures', 'Operating Systems', 'Computer Networks', 'DBMS', 'Software Engineering', 'Artificial Intelligence Basics', 'Cryptography & Security'] },
          { name: 'RAC Written Test - Domain Section (Electronics)', subtopics: ['Analog & Digital Electronics', 'Signals & Systems', 'Communication Systems', 'VLSI Design', 'Embedded Systems', 'Microwave Engineering', 'Control Systems'] },
          { name: 'RAC Written Test - Domain Section (Physics/Chemistry)', subtopics: ['Classical & Quantum Mechanics', 'Electrodynamics', 'Material Science', 'Nuclear & Particle Physics', 'Organic & Inorganic Chemistry', 'Physical Chemistry', 'Analytical Techniques'] },
          { name: 'Interview & Research Aptitude', subtopics: ['Research Proposal Presentation', 'Domain Knowledge Depth', 'Problem-Solving & Innovation', 'Defence Application Context', 'Academic Records & Publications', 'Aptitude for R&D'] },
        ]
      },
    ]
  },
];

const FlowNode = ({ label, color, nodeColor, children, level = 0, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = children && children.length > 0;

  const nodeStyles = {
    0: 'px-5 py-3 text-base font-bold rounded-xl shadow-lg',
    1: 'px-4 py-2.5 text-sm font-semibold rounded-lg shadow-md',
    2: 'px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm',
  };

  const nodeColorStyles = {
    0: `bg-gradient-to-r ${color} text-white`,
    1: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-2',
    2: 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border',
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`relative flex items-center gap-2 transition-all duration-300 ${nodeStyles[level] || nodeStyles[2]} ${nodeColorStyles[level] || nodeColorStyles[2]} ${
          hasChildren ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'cursor-default'
        }`}
        style={level === 1 ? { borderColor: nodeColor } : level === 2 ? { borderColor: `${nodeColor}40` } : {}}
      >
        {level === 1 && (
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: nodeColor }} />
        )}
        <span>{label}</span>
        {hasChildren && (
          <span className="ml-1 opacity-70">
            {expanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
          </span>
        )}
        {hasChildren && !expanded && (
          <span className={`text-xs opacity-60 ml-1 ${level === 0 ? 'bg-white/20 px-1.5 py-0.5 rounded-full' : ''}`}>
            {children.length}
          </span>
        )}
      </button>

      {/* Connector line down from node */}
      {hasChildren && expanded && (
        <>
          <div className="w-0.5 h-6" style={{ background: `${nodeColor}60` }} />

          {/* Horizontal connector + children */}
          <div className="relative flex items-start">
            {/* Horizontal line across all children */}
            {children.length > 1 && (
              <div
                className="absolute top-0 h-0.5"
                style={{
                  background: `${nodeColor}40`,
                  left: `${100 / (children.length * 2)}%`,
                  right: `${100 / (children.length * 2)}%`,
                }}
              />
            )}

            <div className={`flex ${level === 0 ? 'flex-wrap justify-center gap-x-3 gap-y-6 max-w-6xl' : 'flex-wrap justify-center gap-x-2 gap-y-4'}`}>
              {children.map((child, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Vertical connector up to horizontal line */}
                  <div className="w-0.5 h-4" style={{ background: `${nodeColor}40` }} />

                  {typeof child === 'string' ? (
                    <div
                      className="px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border transition-all hover:scale-105 hover:shadow-md"
                      style={{ borderColor: `${nodeColor}30` }}
                    >
                      {child}
                    </div>
                  ) : (
                    <FlowNode
                      label={child.name}
                      color={color}
                      nodeColor={nodeColor}
                      level={level + 1}
                      defaultExpanded={false}
                    >
                      {child.subtopics || child.topics}
                    </FlowNode>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MindMaps = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredData = selectedCategory
    ? syllabusData.filter(d => d.category === selectedCategory)
    : syllabusData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Syllabus Mind Maps" path="/mind-maps" description="Interactive syllabus mind maps for UPSC, SSC, Banking, Railways, Defence, Teaching, and State PSC exams. Visual flow-chart style topic breakdowns to plan your government exam preparation." />
      <Breadcrumb items={[{ label: 'Mind Maps' }]} />

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
          <FiBookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('syllabusMindMaps').split(' ')[0]} <span className="gradient-text">{t('syllabusMindMaps').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('mindMapsDesc')}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('clickToExpand')}</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 justify-center flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!selectedCategory ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}
        >
          {t('allCategories')}
        </button>
        {syllabusData.map(d => (
          <button
            key={d.category}
            onClick={() => setSelectedCategory(d.category)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === d.category ? `bg-gradient-to-r ${d.color} text-white shadow-lg` : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}
          >
            {d.category}
          </button>
        ))}
      </div>

      {/* Flow Graph Mind Maps */}
      <div className="space-y-8">
        {filteredData.map((category) => (
          <div key={category.category} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 ${category.borderColor} overflow-hidden`}>
            {/* Category header */}
            <div className={`p-4 ${category.bgColor} border-b ${category.borderColor}`}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                {category.category}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  {category.exams.length} {category.exams.length === 1 ? 'exam' : 'exams'}
                </span>
              </h2>
            </div>

            {/* Flow graphs for each exam */}
            <div className="p-6 space-y-10 overflow-x-auto">
              {category.exams.map((exam, idx) => (
                <div key={idx} className={`${idx > 0 ? 'pt-8 border-t border-gray-100 dark:border-gray-700' : ''}`}>
                  <div className="flex justify-center min-w-fit">
                    <FlowNode
                      label={exam.name}
                      color={category.color}
                      nodeColor={category.nodeColor}
                      level={0}
                      defaultExpanded={true}
                    >
                      {exam.topics}
                    </FlowNode>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info section for SEO & AdSense content value */}
      <div className="mt-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('howToUseMindMaps')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">1. Choose Your Exam</h3>
            <p>Select a category from the filter buttons above to focus on your target exam. We cover UPSC, SSC, Banking, Railways, Defence, Teaching, and State PSC syllabi.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">2. Explore Topics</h3>
            <p>Click on any topic node to expand and see its subtopics. Each branch shows the complete breakdown of what you need to study for that section.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Plan Your Preparation</h3>
            <p>Use the visual overview to identify areas you're strong in and topics that need more attention. Start with high-weightage subjects first for maximum impact.</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Why Visual Syllabus Maps Help</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Government exam syllabi can be overwhelming with hundreds of topics across multiple subjects. Our interactive flow-chart mind maps break down the entire syllabus into a visual hierarchy, making it easier to understand the scope of each exam. Research shows that visual learning aids improve retention by up to 65% compared to reading plain text. Use these maps alongside your study materials to track your preparation progress across all subjects and subtopics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MindMaps;
