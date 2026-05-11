import React, { useState } from 'react';
import { FiSearch, FiDownload, FiBook, FiFileText, FiCheckCircle } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import toast from 'react-hot-toast';

const resourcesData = [
  { id: 1, title: 'UPSC CSE Prelims Syllabus & Study Guide', type: 'Notes', exam: 'UPSC CSE', category: 'UPSC', description: 'Official UPSC Civil Services Preliminary exam syllabus with comprehensive topic-wise study guide covering History, Geography, Polity, Economics, Environment, and Science.', pages: '450+ pages', fileUrl: 'https://www.upsc.gov.in/' },
  { id: 2, title: 'UPSC Previous Year Question Papers', type: 'PYQ', exam: 'UPSC CSE', category: 'UPSC', description: 'Official previous year question papers from UPSC for Civil Services Prelims and Mains with detailed topic-wise analysis.', pages: '300+ questions', fileUrl: 'https://www.upsc.gov.in/' },
  { id: 3, title: 'Indian Polity by M. Laxmikanth - Key Points', type: 'Notes', exam: 'UPSC / State PSC', category: 'UPSC', description: 'Chapter-wise summary notes from the most important book for Indian Polity preparation. Covers Constitution, governance, and political system.', pages: '120 pages', fileUrl: 'https://www.upsc.gov.in/' },
  { id: 4, title: 'UPSC Mains Essay & Answer Writing Guide', type: 'Notes', exam: 'UPSC CSE', category: 'UPSC', description: 'Proven frameworks for essay writing and GS answer structuring. Includes sample essays, model answers, and scoring techniques used by toppers.', pages: '200 pages', fileUrl: 'https://www.upsc.gov.in/' },
  { id: 5, title: 'NCERT Summary Notes (Class 6-12)', type: 'Notes', exam: 'UPSC / State PSC', category: 'UPSC', description: 'Concise chapter-wise summaries of all NCERT textbooks for History, Geography, Polity, Economics, and Science — the foundation of UPSC preparation.', pages: '350 pages', fileUrl: 'https://ncert.nic.in/' },
  { id: 6, title: 'SSC CGL Exam Pattern & Syllabus Guide', type: 'Notes', exam: 'SSC CGL', category: 'SSC', description: 'All-in-one study material covering Quantitative Aptitude, English, Reasoning, and General Awareness for SSC CGL Tier I and Tier II.', pages: '500+ pages', fileUrl: 'https://ssc.gov.in/' },
  { id: 7, title: 'SSC CGL Previous Year Papers & Answer Keys', type: 'PYQ', exam: 'SSC CGL', category: 'SSC', description: 'Shift-wise previous year question papers with official answer keys and detailed solutions. Includes all shifts from recent years.', pages: '200+ papers', fileUrl: 'https://ssc.gov.in/' },
  { id: 8, title: 'Quantitative Aptitude for Competitive Exams', type: 'Books', exam: 'SSC / Banking', category: 'SSC', description: 'Recommended quantitative aptitude books and resources with shortcuts, tricks, and practice problems covering all topics for SSC and Banking exams.', pages: '600+ pages', fileUrl: 'https://ssc.gov.in/' },
  { id: 9, title: 'SSC CHSL Syllabus & Preparation Guide', type: 'Notes', exam: 'SSC CHSL', category: 'SSC', description: 'Complete syllabus breakdown for SSC CHSL Tier I and descriptive paper. Includes section-wise weightage analysis and 60-day study plan.', pages: '250 pages', fileUrl: 'https://ssc.gov.in/' },
  { id: 10, title: 'SSC MTS & GD Constable Combined Guide', type: 'Notes', exam: 'SSC MTS / GD', category: 'SSC', description: 'Joint preparation strategy for SSC MTS and GD Constable exams. Covers common syllabus areas, physical standards for GD, and previous year trends.', pages: '300 pages', fileUrl: 'https://ssc.gov.in/' },
  { id: 11, title: 'English Grammar & Vocabulary Master Guide', type: 'Notes', exam: 'All Exams', category: 'SSC', description: 'Complete English grammar and vocabulary guide with rules, examples, and practice questions for all competitive exams.', pages: '300 pages', fileUrl: 'https://ssc.gov.in/' },
  { id: 12, title: 'Logical Reasoning & Analytical Ability', type: 'Notes', exam: 'All Exams', category: 'SSC', description: 'Master guide for reasoning section covering verbal, non-verbal, and analytical reasoning with shortcut methods.', pages: '350 pages', fileUrl: 'https://ssc.gov.in/' },
  { id: 13, title: 'IBPS PO Exam Pattern & Syllabus', type: 'Notes', exam: 'IBPS PO', category: 'Banking', description: 'Detailed preparation guide for IBPS PO covering all three sections - English, Quant, and Reasoning with banking awareness topics.', pages: '350 pages', fileUrl: 'https://www.ibps.in/' },
  { id: 14, title: 'Banking Awareness Complete Capsule 2026', type: 'Notes', exam: 'Banking Exams', category: 'Banking', description: 'Everything you need for banking awareness - RBI policies, banking terms, financial news, government schemes, and economic surveys.', pages: '150 pages', fileUrl: 'https://www.rbi.org.in/' },
  { id: 15, title: 'IBPS/SBI PO Previous Year Papers Collection', type: 'PYQ', exam: 'IBPS PO / SBI PO', category: 'Banking', description: 'Previous year IBPS PO and SBI PO prelims and mains papers with solutions. Memory-based and official papers included.', pages: '400+ questions', fileUrl: 'https://www.ibps.in/' },
  { id: 16, title: 'IBPS Clerk Prelims & Mains Guide', type: 'Notes', exam: 'IBPS Clerk', category: 'Banking', description: 'Section-wise preparation guide for IBPS Clerk covering English Language, Numerical Ability, and Reasoning with speed-building techniques.', pages: '280 pages', fileUrl: 'https://www.ibps.in/' },
  { id: 17, title: 'SBI PO Descriptive Paper Writing Guide', type: 'Notes', exam: 'SBI PO', category: 'Banking', description: 'Essay and letter writing templates for SBI PO Mains descriptive paper. Covers formal letters, essays on banking topics, and scoring patterns.', pages: '100 pages', fileUrl: 'https://www.sbi.co.in/' },
  { id: 18, title: 'RRB NTPC Complete Preparation Kit', type: 'Notes', exam: 'RRB NTPC', category: 'Railways', description: 'Full preparation material for RRB NTPC CBT-1 and CBT-2 covering Math, Reasoning, and General Awareness with railway-specific GK.', pages: '400 pages', fileUrl: 'https://www.rrbcdg.gov.in/' },
  { id: 19, title: 'Railway Group D Previous Year Papers', type: 'PYQ', exam: 'Railway Group D', category: 'Railways', description: 'Collection of Railway Group D exam papers with phase-wise solutions and answer keys from previous recruitment cycles.', pages: '150+ papers', fileUrl: 'https://www.rrbcdg.gov.in/' },
  { id: 20, title: 'RRB JE & ALP Technical Guide', type: 'Notes', exam: 'RRB JE / ALP', category: 'Railways', description: 'Technical subject notes for Junior Engineer and Assistant Loco Pilot exams covering Electrical, Mechanical, Electronics, and Civil Engineering basics.', pages: '450 pages', fileUrl: 'https://www.rrbcdg.gov.in/' },
  { id: 21, title: 'Railway General Science & GK Capsule', type: 'Notes', exam: 'Railway Exams', category: 'Railways', description: 'Quick revision capsule covering General Science (Physics, Chemistry, Biology) and Static GK frequently asked in all Railway exams.', pages: '180 pages', fileUrl: 'https://www.rrbcdg.gov.in/' },
  { id: 22, title: 'NDA Exam Syllabus & Preparation Guide', type: 'Notes', exam: 'NDA', category: 'Defence', description: 'Comprehensive guide for NDA written exam covering Mathematics and General Ability Test with SSB interview preparation tips.', pages: '500 pages', fileUrl: 'https://www.upsc.gov.in/' },
  { id: 23, title: 'CDS Previous Year Papers with Solutions', type: 'PYQ', exam: 'CDS', category: 'Defence', description: 'Previous year CDS exam papers with detailed solutions for English, GK, and Mathematics sections from UPSC official archives.', pages: '250+ questions', fileUrl: 'https://www.upsc.gov.in/' },
  { id: 24, title: 'AFCAT Exam Guide & Practice Papers', type: 'Notes', exam: 'AFCAT', category: 'Defence', description: 'Complete guide for Air Force Common Admission Test covering General Awareness, Verbal Ability, Numerical Ability, and Reasoning with military aptitude tips.', pages: '300 pages', fileUrl: 'https://indianairforce.nic.in/' },
  { id: 25, title: 'SSB Interview Complete Preparation', type: 'Notes', exam: 'NDA / CDS / AFCAT', category: 'Defence', description: 'Detailed guide for Services Selection Board interview process covering OIR, PPDT, TAT, WAT, SRT, GD, and personal interview techniques.', pages: '200 pages', fileUrl: 'https://www.joinindianarmy.nic.in/' },
  { id: 26, title: 'Agniveer (Army/Navy/Air Force) Guide', type: 'Notes', exam: 'Agniveer', category: 'Defence', description: 'Complete preparation material for Agnipath scheme exams. Covers written test syllabus, physical fitness standards, and medical requirements for all three forces.', pages: '250 pages', fileUrl: 'https://www.joinindianarmy.nic.in/' },
  { id: 27, title: 'State PSC General Studies Notes', type: 'Notes', exam: 'State PSC', category: 'State PSC', description: 'General studies notes tailored for state PSC exams covering state-specific history, geography, and administration.', pages: '400 pages', fileUrl: 'https://www.uppsc.up.nic.in/' },
  { id: 28, title: 'UPPSC PCS Previous Year Papers', type: 'PYQ', exam: 'UPPSC PCS', category: 'State PSC', description: 'Previous year Prelims and Mains question papers for UP PSC Provincial Civil Services with answer keys and detailed solutions.', pages: '200+ questions', fileUrl: 'https://www.uppsc.up.nic.in/' },
  { id: 29, title: 'BPSC Complete Preparation Guide', type: 'Notes', exam: 'BPSC', category: 'State PSC', description: 'Comprehensive guide for Bihar Public Service Commission exam covering GS, Optional subjects, and Bihar-specific General Knowledge topics.', pages: '350 pages', fileUrl: 'https://www.bpsc.bih.nic.in/' },
  { id: 30, title: 'APPSC & TSPSC Group 1/2 Study Material', type: 'Notes', exam: 'APPSC / TSPSC', category: 'State PSC', description: 'Preparation material for Andhra Pradesh and Telangana PSC exams covering state history, geography, economy, and governance with Telugu medium reference.', pages: '400 pages', fileUrl: 'https://psc.ap.gov.in/' },
  { id: 31, title: 'CTET Complete Study Material', type: 'Notes', exam: 'CTET', category: 'Teaching', description: 'Full preparation guide for CTET Paper I and Paper II covering Child Development, Pedagogy, and subject-specific topics.', pages: '350 pages', fileUrl: 'https://ctet.nic.in/' },
  { id: 32, title: 'UGC NET Paper 1 Complete Notes', type: 'Notes', exam: 'UGC NET', category: 'Teaching', description: 'Comprehensive notes for UGC NET Paper 1 covering Teaching Aptitude, Research Methodology, ICT, Higher Education, and Reasoning.', pages: '300 pages', fileUrl: 'https://ugcnet.nta.ac.in/' },
  { id: 33, title: 'KVS & NVS Teacher Recruitment Guide', type: 'Notes', exam: 'KVS / NVS', category: 'Teaching', description: 'Subject-wise preparation material for KVS PRT/TGT/PGT and NVS TGT/PGT recruitment covering pedagogy, subject knowledge, and general awareness.', pages: '400 pages', fileUrl: 'https://kvsangathan.nic.in/' },
  { id: 34, title: 'State TET Previous Year Papers', type: 'PYQ', exam: 'State TET', category: 'Teaching', description: 'Collection of previous year papers for UPTET, CTET, HTET, REET, MPTET, and other state Teacher Eligibility Tests with solutions.', pages: '300+ questions', fileUrl: 'https://ctet.nic.in/' },
  { id: 35, title: 'SSC CPO Sub-Inspector Exam Guide', type: 'Notes', exam: 'SSC CPO', category: 'Police', description: 'Complete guide for SSC CPO Sub-Inspector exam covering Paper I syllabus, Paper II English, physical test standards, and medical norms.', pages: '350 pages', fileUrl: 'https://ssc.gov.in/' },
  { id: 36, title: 'SSC GD Constable Complete Guide', type: 'Notes', exam: 'SSC GD', category: 'Police', description: 'Complete preparation guide for SSC GD Constable covering all subjects, physical fitness standards, and medical requirements.', pages: '250 pages', fileUrl: 'https://ssc.gov.in/' },
  { id: 37, title: 'Delhi Police SI & Constable Study Material', type: 'Notes', exam: 'Delhi Police', category: 'Police', description: 'Preparation notes for Delhi Police recruitment covering Reasoning, Quant, English, General Awareness, and Delhi-specific current affairs.', pages: '280 pages', fileUrl: 'https://www.delhipolice.gov.in/' },
  { id: 38, title: 'CAPF AC Previous Year Papers', type: 'PYQ', exam: 'UPSC CAPF', category: 'Police', description: 'Previous year question papers for UPSC CAPF Assistant Commandant exam with solutions for General Ability, Intelligence, and Essay papers.', pages: '150+ questions', fileUrl: 'https://www.upsc.gov.in/' },
  { id: 39, title: 'LIC AAO Complete Preparation Material', type: 'Notes', exam: 'LIC AAO', category: 'Insurance', description: 'Comprehensive study material for LIC AAO exam covering Reasoning, Quant, English, GK, and Insurance Awareness.', pages: '300 pages', fileUrl: 'https://www.licindia.in/' },
  { id: 40, title: 'Insurance Awareness Complete Guide', type: 'Notes', exam: 'Insurance Exams', category: 'Insurance', description: 'Covers all insurance concepts — IRDAI regulations, types of insurance, LIC/GIC products, reinsurance, actuarial basics, and recent policy changes.', pages: '150 pages', fileUrl: 'https://www.irdai.gov.in/' },
  { id: 41, title: 'NIACL/UIIC AO Previous Year Papers', type: 'PYQ', exam: 'NIACL / UIIC AO', category: 'Insurance', description: 'Previous year papers for NIACL AO and UIIC AO exams with detailed solutions for Prelims and Mains stages.', pages: '200+ questions', fileUrl: 'https://www.newindia.co.in/' },
  { id: 42, title: 'GATE Complete Notes (CS/ECE/ME)', type: 'Notes', exam: 'GATE', category: 'PSU', description: 'Subject-wise notes for GATE covering Data Structures, Algorithms, OS, DBMS, Networks, Signals & Systems, Thermodynamics, and more with previous year solutions.', pages: '600+ pages', fileUrl: 'https://gate2026.iitr.ac.in/' },
  { id: 43, title: 'GATE Previous Year Papers (All Branches)', type: 'PYQ', exam: 'GATE', category: 'PSU', description: 'Official GATE previous year question papers with answer keys for CS, ECE, ME, EE, CE, and other branches from IIT archives.', pages: '500+ questions', fileUrl: 'https://gate2026.iitr.ac.in/' },
  { id: 44, title: 'PSU Recruitment Through GATE Guide', type: 'Notes', exam: 'PSU via GATE', category: 'PSU', description: 'Complete guide for PSU recruitment through GATE — covers application process, cutoffs, interview preparation, and profiles of top PSUs like ONGC, IOCL, NTPC, BHEL, and GAIL.', pages: '200 pages', fileUrl: 'https://gate2026.iitr.ac.in/' },
  { id: 45, title: 'DRDO CEPTAM & ISRO Preparation Guide', type: 'Notes', exam: 'DRDO / ISRO', category: 'PSU', description: 'Preparation material for DRDO CEPTAM and ISRO Scientist/Engineer exams covering technical subjects, general aptitude, and interview tips.', pages: '350 pages', fileUrl: 'https://www.drdo.gov.in/' },
  { id: 46, title: 'RBI Grade B Phase I & II Guide', type: 'Notes', exam: 'RBI Grade B', category: 'Regulatory Bodies', description: 'Complete preparation guide for RBI Grade B covering Phase I (GA, Quant, English, Reasoning) and Phase II (Economic & Social Issues, Finance & Management).', pages: '500 pages', fileUrl: 'https://www.rbi.org.in/' },
  { id: 47, title: 'SEBI Grade A Exam Material', type: 'Notes', exam: 'SEBI Grade A', category: 'Regulatory Bodies', description: 'Study material for SEBI Grade A exam covering Securities Market regulations, SEBI Act, Company Law, Financial Markets, and General stream subjects.', pages: '400 pages', fileUrl: 'https://www.sebi.gov.in/' },
  { id: 48, title: 'NABARD Grade A & B Study Guide', type: 'Notes', exam: 'NABARD', category: 'Regulatory Bodies', description: 'Preparation notes for NABARD exams covering Agriculture & Rural Development, Economic & Social Issues, and Development Finance with ESI paper strategy.', pages: '350 pages', fileUrl: 'https://www.nabard.org/' },
  { id: 49, title: 'Regulatory Bodies Previous Year Papers', type: 'PYQ', exam: 'RBI / SEBI / NABARD', category: 'Regulatory Bodies', description: 'Previous year question papers for RBI Grade B, SEBI Grade A, and NABARD Grade A Phase I and Phase II with detailed solutions.', pages: '300+ questions', fileUrl: 'https://www.rbi.org.in/' },
  { id: 50, title: 'Judicial Services Exam Preparation Guide', type: 'Notes', exam: 'Judiciary', category: 'Judiciary', description: 'Comprehensive guide for state Judicial Services exams covering IPC, CrPC, CPC, Indian Evidence Act, Constitutional Law, and legal maxims.', pages: '500 pages', fileUrl: 'https://doj.gov.in/' },
  { id: 51, title: 'Bare Acts Summary Notes (IPC, CrPC, CPC)', type: 'Notes', exam: 'Judiciary / CLAT', category: 'Judiciary', description: 'Section-wise summary of major bare acts with important case laws, amendments, and frequently tested provisions for judicial services preparation.', pages: '400 pages', fileUrl: 'https://www.indiacode.nic.in/' },
  { id: 52, title: 'CLAT Previous Year Papers', type: 'PYQ', exam: 'CLAT', category: 'Judiciary', description: 'Previous year CLAT papers with solutions covering English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.', pages: '200+ questions', fileUrl: 'https://consortiumofnlus.ac.in/' },
  { id: 53, title: 'NEET PG Subject-Wise Notes', type: 'Notes', exam: 'NEET PG', category: 'Healthcare', description: 'High-yield notes for NEET PG covering all 19 subjects — Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, Medicine, Surgery, OBG, Pediatrics, and more.', pages: '700+ pages', fileUrl: 'https://natboard.edu.in/' },
  { id: 54, title: 'FMGE/MCI Screening Test Guide', type: 'Notes', exam: 'FMGE', category: 'Healthcare', description: 'Preparation guide for Foreign Medical Graduate Examination covering all clinical and pre-clinical subjects with previous year analysis.', pages: '400 pages', fileUrl: 'https://natboard.edu.in/' },
  { id: 55, title: 'AIIMS & Hospital Nursing Exam Guide', type: 'Notes', exam: 'Nursing Exams', category: 'Healthcare', description: 'Study material for AIIMS, ESIC, and Railway Staff Nurse exams covering General Nursing, Community Health, Child Health, Mental Health, and Medical-Surgical Nursing.', pages: '350 pages', fileUrl: 'https://www.aiims.edu/' },
  { id: 56, title: 'India Post GDS & MTS Exam Guide', type: 'Notes', exam: 'India Post', category: 'Postal', description: 'Complete preparation guide for India Post GDS, MTS, and Postman/Mail Guard exams covering Math, English, GK, and Reasoning with postal department awareness.', pages: '250 pages', fileUrl: 'https://www.indiapost.gov.in/' },
  { id: 57, title: 'India Post Previous Year Papers', type: 'PYQ', exam: 'India Post', category: 'Postal', description: 'Previous year papers for India Post GDS, Postman, and MTS exams with answer keys and detailed solutions.', pages: '150+ questions', fileUrl: 'https://www.indiapost.gov.in/' },
  { id: 58, title: 'FCI Manager & Agriculture Exam Guide', type: 'Notes', exam: 'FCI / ICAR', category: 'Agriculture', description: 'Study material for FCI Manager and ICAR exams covering Agriculture Science, Food Management, Procurement, Storage, PDS, and General Aptitude.', pages: '350 pages', fileUrl: 'https://fci.gov.in/' },
  { id: 59, title: 'Agriculture & Rural Development Notes', type: 'Notes', exam: 'NABARD / FCI', category: 'Agriculture', description: 'Notes on Indian Agriculture, Rural Economy, Crop Science, Agronomy, Soil Science, and Agricultural policies for FCI, NABARD, and ICAR exams.', pages: '250 pages', fileUrl: 'https://agricoop.nic.in/' },
  { id: 60, title: 'Best Books for Government Exams 2026', type: 'Books', exam: 'All Exams', category: 'UPSC', description: 'Curated list of must-read books for UPSC, SSC, Banking, and Railways with expert reviews and reading strategies.', pages: 'Book list', fileUrl: 'https://www.upsc.gov.in/' },
  { id: 61, title: 'Current Affairs Yearly Compilation 2026', type: 'Notes', exam: 'All Exams', category: 'UPSC', description: 'Month-wise current affairs compilation covering national, international, economy, science, sports, and awards for all competitive exams.', pages: '500+ pages', fileUrl: '/current-affairs' },
  { id: 62, title: 'Static GK & General Awareness Capsule', type: 'Notes', exam: 'All Exams', category: 'SSC', description: 'Quick revision capsule for Static GK covering important dams, rivers, national parks, first in India, headquarters, currencies, capital cities, and awards.', pages: '200 pages', fileUrl: '/current-affairs' },
  { id: 63, title: 'Indian Economy & Budget Notes 2026', type: 'Notes', exam: 'All Exams', category: 'Banking', description: 'Comprehensive notes on Indian Economy covering Union Budget 2026-27, Economic Survey highlights, GDP, inflation, fiscal policy, and key economic indicators.', pages: '180 pages', fileUrl: 'https://www.indiabudget.gov.in/' },
  { id: 64, title: 'Computer Awareness for Competitive Exams', type: 'Notes', exam: 'Banking / SSC', category: 'Banking', description: 'Complete computer awareness guide covering hardware, software, networking, MS Office, internet, databases, and cyber security for banking and SSC exams.', pages: '150 pages', fileUrl: 'https://www.ibps.in/' },
];

const categories = ['All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC', 'Teaching', 'Police', 'Insurance', 'PSU', 'Regulatory Bodies', 'Judiciary', 'Healthcare', 'Postal', 'Agriculture', 'Miscellaneous'];
const types = ['All', 'Notes', 'PYQ', 'Books'];

const typeBadgeColors = {
  Notes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PYQ: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Books: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState(null);

  const filtered = resourcesData.filter(r => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchType = selectedType === 'All' || r.type === selectedType;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.exam.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  const handleDownload = async (resource) => {
    setDownloading(resource.id);

    try {
      if (resource.fileUrl) {
        if (resource.fileUrl.startsWith('/')) {
          window.location.href = resource.fileUrl;
        } else {
          window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
        }
        toast.success(`Opening: ${resource.title}`, { duration: 3000 });
      } else {
        toast.error('This resource is temporarily unavailable. Please try again later.', { duration: 3000 });
      }
    } catch (err) {
      console.error('[GovtExamPath] Download error:', err);
      toast.error('Failed to open resource. Please try again later.');
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Free Study Resources" path="/resources" description="Download free study materials, previous year papers, syllabus PDFs and preparation guides for UPSC, SSC, Banking, Railways and other government exams." />
      <Breadcrumb items={[{ label: 'Resources' }]} />
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
          <FiBook className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Study <span className="gradient-text">Resources</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Free study notes, previous year papers, and book recommendations for all exams</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by title, exam, or keyword..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 justify-center flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 justify-center mb-8">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === type ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            {type === 'All' ? 'All Types' : type}
          </button>
        ))}
      </div>

      {/* Resources grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiFileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No resources found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(resource => (
            <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 card-hover group">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeBadgeColors[resource.type]}`}>
                  {resource.type}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{resource.pages}</span>
                  {resource.fileUrl && (
                    <span className="w-2 h-2 bg-green-500 rounded-full" title="Available for download" />
                  )}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {resource.title}
              </h3>

              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2">{resource.exam}</p>

              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{resource.description}</p>

              <button
                onClick={() => handleDownload(resource)}
                disabled={downloading === resource.id}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-md ${
                  downloading === resource.id
                    ? 'bg-green-500 text-white shadow-green-500/20'
                    : resource.fileUrl
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-gray-500/20'
                }`}
              >
                {downloading === resource.id ? (
                  <><FiCheckCircle className="w-4 h-4" /> Opening...</>
                ) : (
                  <><FiDownload className="w-4 h-4" /> {resource.fileUrl ? (resource.fileUrl.startsWith('/') ? 'View Resource' : 'Visit Official Site') : 'Unavailable'}</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Informative content section for SEO & AdSense */}
      <div className="mt-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">How to Use Study Resources Effectively</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Study Notes</h3>
            <p>Start with official syllabi and standard textbooks. Create your own short notes while reading — this helps retention. Focus on understanding concepts rather than memorizing. Revise your notes at least 3 times before the exam. Use these curated notes as supplements to your primary study material.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Previous Year Papers (PYQ)</h3>
            <p>Solving previous year papers is the single most effective strategy for government exams. Start solving PYQs at least 2-3 months before your exam. Analyze the pattern — identify frequently asked topics and allocate more time to them. Attempt papers in exam-like conditions with strict time limits for realistic practice.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Book Recommendations</h3>
            <p>Don't collect too many books — stick to 1-2 standard books per subject. For UPSC, NCERTs are the foundation. For SSC/Banking, RS Aggarwal and Arihant publications are popular choices. Finish one book completely before moving to another. Quality of reading matters more than quantity of books.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Preparation Strategy by Exam Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">UPSC & State PSC</p>
              <p>Start with NCERTs (Class 6-12), then move to standard reference books. Read one newspaper daily for current affairs. Practice answer writing for Mains from day one. Allocate 6-12 months for serious preparation.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">SSC CGL/CHSL</p>
              <p>Focus on speed and accuracy — these exams reward quick problem-solving. Practice 50+ questions daily in Quant and Reasoning. Take at least 30 full-length mock tests. Learn shortcut methods for calculations.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Banking (IBPS/SBI)</p>
              <p>Sectional time management is critical in banking exams. Practice Data Interpretation and Puzzles extensively. Build banking and financial awareness by reading Economic Times or Mint. Take sectional tests before full mocks.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Railways & Defence</p>
              <p>For Railways, focus on General Science and Math basics. For Defence exams (NDA/CDS), English and GK carry significant weightage. Physical fitness preparation should run parallel to written exam prep for defence aspirants.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
