import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiHelpCircle, FiSearch, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

const faqSections = [
  {
    title: 'General Questions',
    icon: '\u{1F4CB}',
    key: 'general',
    faqs: [
      {
        q: 'What are government exams in India?',
        a: 'Government exams are competitive examinations conducted by central and state government bodies to recruit candidates for various public sector positions. These exams are held by organizations like UPSC, SSC, IBPS, RRB, and State Public Service Commissions. They cover a wide range of roles from administrative officers (IAS/IPS) to clerks, teachers, police constables, and technical posts. Government exams are considered highly prestigious in India due to the job security, pension benefits, and social status they offer.',
      },
      {
        q: 'Why should I choose a government job over a private job?',
        a: 'Government jobs in India offer several advantages including job security, pension and retirement benefits, fixed working hours, generous leave policies, and housing allowances. Unlike private sector roles, government employees rarely face layoffs and receive regular pay revisions through Pay Commission recommendations. Additionally, government positions come with social prestige, healthcare benefits for the entire family, and opportunities for transfers to different locations. Many government jobs also offer a better work-life balance compared to demanding private sector roles.',
      },
      {
        q: 'How many government exams are conducted in India each year?',
        a: 'India conducts over 200 government exams annually through various central and state agencies. Major national-level exams include UPSC Civil Services, SSC CGL, SSC CHSL, IBPS PO, IBPS Clerk, RRB NTPC, and NDA. Each state also conducts its own PSC exams, police recruitment drives, and teacher eligibility tests. The total number of vacancies across all these exams runs into several lakhs each year, making government recruitment one of the largest employment drives in the world.',
      },
      {
        q: 'What is the difference between central and state government exams?',
        a: 'Central government exams are conducted by national-level bodies like UPSC, SSC, and IBPS for positions that operate across India, such as IAS officers, income tax inspectors, and bank probationary officers. State government exams are conducted by State Public Service Commissions (like APPSC, TSPSC, UPPSC) for positions within a specific state, such as state civil services, state police, and state-level teachers. Central exams typically have a larger applicant pool and may offer postings anywhere in India, while state exams are usually limited to postings within that particular state.',
      },
      {
        q: 'Which government exams are currently accepting applications in 2026?',
        a: 'Several major government exams are open or upcoming in 2026. SSC CGL 2026 applications are open until May 30 with 15,000+ vacancies. UPSC CSE Prelims is on May 24. IBPS PO 2026 notification is expected in June with Prelims in August. RRB NTPC UG Phase 2 is scheduled for June 13-21. SSC Selection Post Phase XIV applications are ongoing until May 15. Visit our Exam Calendar page for a complete month-wise schedule of all upcoming exams and deadlines.',
      },
    ],
  },
  {
    title: 'Eligibility & Age Limits',
    icon: '\u{1F3AF}',
    key: 'eligibility',
    faqs: [
      {
        q: 'What is the minimum educational qualification for government exams?',
        a: 'The minimum qualification varies significantly across different government exams. Some exams like SSC MTS and Railway Group D require only a 10th pass certificate, while SSC CHSL requires 12th pass. Most competitive exams such as SSC CGL, IBPS PO, and State PSC exams require a bachelor\'s degree in any discipline. Higher-level exams like UPSC Civil Services also require graduation, though some technical posts may need specific degrees in engineering, medicine, or law. You can use our Eligibility Checker to find exams matching your qualification.',
      },
      {
        q: 'What are the general age limits for government exams?',
        a: 'Age limits differ by exam and the recruiting organization. For SSC exams, the typical age range is 18-27 years for CGL and 18-25 years for CHSL. UPSC Civil Services allows candidates aged 21-32 years, while banking exams like IBPS PO set the limit at 20-30 years. Railway exams generally have an age range of 18-33 years depending on the post. It is important to note that these are general category limits, and relaxations are provided for reserved categories as defined by the Government of India.',
      },
      {
        q: 'What age relaxation is available for reserved categories?',
        a: 'The Government of India provides age relaxation for various reserved categories across most government exams. OBC (Non-Creamy Layer) candidates typically receive 3 years of relaxation, SC/ST candidates get 5 years, and PwBD (Persons with Benchmark Disabilities) candidates receive 10 years of relaxation. Ex-servicemen usually get additional relaxation as per specific exam rules. Some exams also provide age relaxation for widows, divorced women, and candidates from economically weaker sections. These relaxations are cumulative in some cases, meaning a PwBD candidate from the OBC category may receive combined benefits.',
      },
      {
        q: 'Is there a limit on the number of attempts for government exams?',
        a: 'Attempt limits vary by exam and category. UPSC Civil Services allows 6 attempts for General category, 9 for OBC, and unlimited attempts (within the age limit) for SC/ST candidates. SSC exams generally do not have an attempt limit as long as you meet the age criteria. Banking exams like IBPS also do not restrict the number of attempts within the permissible age range. State PSC exams have their own attempt rules, which vary from state to state. It is always advisable to check the specific exam notification for the latest attempt limit rules.',
      },
      {
        q: 'Can final-year students apply for government exams?',
        a: 'Yes, most government exams allow final-year students to apply provisionally, provided they can produce the required degree certificate by a specified date (usually before the document verification stage). UPSC Civil Services, SSC CGL, IBPS PO, and most State PSC exams permit final-year graduates to appear in the preliminary exam. However, candidates must complete their degree before the final selection process. Some exams may have specific cut-off dates for degree completion, so it is crucial to read the official notification carefully before applying.',
      },
    ],
  },
  {
    title: 'Preparation Strategy',
    icon: '\u{1F4DA}',
    key: 'preparation',
    faqs: [
      {
        q: 'How long should I prepare for competitive government exams?',
        a: 'The preparation duration depends on the exam\'s difficulty level and your existing knowledge base. For exams like UPSC Civil Services, most successful candidates prepare for 12-18 months of dedicated study. SSC CGL and banking exams typically require 6-10 months of focused preparation. Easier exams like SSC MTS or Railway Group D may need 3-4 months. The key is consistency rather than the total number of hours. Creating a structured study plan, practicing previous year papers, and taking regular mock tests can significantly reduce the preparation time needed.',
      },
      {
        q: 'What are the best books for government exam preparation?',
        a: 'Book recommendations depend on the specific exam, but some widely recommended titles include: Lucent\'s General Knowledge for GK, R.S. Aggarwal\'s Quantitative Aptitude for maths, Wren & Martin\'s English Grammar for English sections, and M. Laxmikanth\'s Indian Polity for polity-related questions. For UPSC, Spectrum\'s Modern India and NCERT textbooks (Class 6-12) are considered essential. For banking exams, Arihant\'s Banking Awareness and Kiran\'s publications are popular. Visit our Resources page for curated study material recommendations organized by exam category.',
      },
      {
        q: 'Are free online resources sufficient for government exam preparation?',
        a: 'Yes, with discipline and the right strategy, free online resources can be more than sufficient for clearing most government exams. Platforms like GovtExamPath provide free study materials, mind maps, and current affairs updates. YouTube channels dedicated to exam preparation offer excellent video lectures covering the complete syllabus. Government websites like the Press Information Bureau (PIB) and official exam body websites provide authentic study material. Many toppers have cleared prestigious exams using only free resources, proving that expensive coaching is not always necessary.',
      },
      {
        q: 'Is coaching necessary for clearing government exams?',
        a: 'Coaching is not mandatory for clearing government exams, and thousands of candidates succeed through self-study each year. However, coaching can be beneficial if you need structured guidance, a competitive environment, or help with specific weak areas. The advantage of coaching includes access to curated study materials, regular tests, and doubt-clearing sessions. On the other hand, self-study offers flexibility, cost savings, and the ability to learn at your own pace. Many successful candidates use a hybrid approach, relying on free online resources and using our Career Guide for personalized recommendations while selectively joining test series programs.',
      },
      {
        q: 'How important are mock tests and previous year papers?',
        a: 'Mock tests and previous year papers are absolutely critical for government exam success. Previous year papers help you understand the exam pattern, difficulty level, and frequently asked topics, allowing you to focus your preparation effectively. Regular mock tests build time management skills, improve accuracy under pressure, and help identify weak areas that need more attention. Experts recommend solving at least 20-30 mock tests before the actual exam. Many toppers attribute their success to consistent practice with mock tests rather than just reading textbooks. Most exam coaching platforms offer free test series that you can leverage.',
      },
    ],
  },
  {
    title: 'Application Process',
    icon: '\u{1F4DD}',
    key: 'application',
    faqs: [
      {
        q: 'How do I apply for government exams online?',
        a: 'Most government exams now accept applications exclusively through their official websites. The general process involves visiting the exam conducting body\'s website (e.g., ssc.nic.in, upsc.gov.in, ibps.in), registering with a valid email and phone number, filling in personal and educational details, uploading scanned photographs and signatures in the specified format, and paying the application fee online. It is important to apply before the deadline and save your registration number for future reference. You can track upcoming exam notifications and deadlines on our Exams page.',
      },
      {
        q: 'What is the application fee for government exams?',
        a: 'Application fees vary across exams but are generally very affordable. SSC exams typically charge Rs. 100, while UPSC Civil Services charges Rs. 100 for General/OBC. IBPS banking exams charge around Rs. 175-850 depending on the post. Many exams offer fee exemptions for female candidates, SC/ST candidates, PwBD candidates, and Ex-servicemen. The fees can be paid through debit cards, credit cards, net banking, or UPI. Some exams also accept payment through e-challan at designated bank branches. Always check the official notification for the exact fee structure and available exemptions.',
      },
      {
        q: 'What documents are needed for government exam applications?',
        a: 'For the application stage, you typically need a scanned passport-size photograph (usually 3.5cm x 4.5cm, JPEG format under 100KB), scanned signature (similar specifications), and a valid email ID and mobile number. For the document verification stage after clearing the exam, you will need original certificates including 10th mark sheet (as proof of date of birth), educational qualification certificates, caste/category certificate (if applicable), domicile certificate, identity proof (Aadhaar, PAN, or Voter ID), and experience certificates if required. It is advisable to keep all original documents ready well in advance.',
      },
      {
        q: 'Can I apply for multiple government exams simultaneously?',
        a: 'Yes, you can apply for as many government exams as you are eligible for, and there is no restriction on the number of simultaneous applications. Many aspirants apply for UPSC, SSC, banking, and state PSC exams at the same time to maximize their chances. However, make sure that the exam dates do not clash, as conducting bodies generally do not allow rescheduling. Having overlapping preparation can be beneficial since many exams share common syllabus areas like General Knowledge, Reasoning, Quantitative Aptitude, and English. Strategic multi-exam preparation is a common and recommended approach among successful candidates.',
      },
    ],
  },
  {
    title: 'Specific Exams & Careers',
    icon: '\u{1F3C6}',
    key: 'exams',
    faqs: [
      {
        q: 'What is the difference between UPSC and SSC exams?',
        a: 'UPSC (Union Public Service Commission) and SSC (Staff Selection Commission) are both central government recruiting bodies but cater to different levels of positions. UPSC recruits for Group A and Group B gazetted officer positions like IAS, IPS, IFS, and IRS through the Civil Services Examination, which is considered the toughest exam in India. SSC recruits for Group B (non-gazetted) and Group C posts like tax assistants, auditors, and inspectors through exams like CGL, CHSL, and MTS. While UPSC exams have a success rate below 0.2%, SSC exams are relatively more accessible with a higher selection percentage.',
      },
      {
        q: 'Which are the best banking exams to prepare for?',
        a: 'The most sought-after banking exams include IBPS PO (Probationary Officer), SBI PO, RBI Grade B, and NABARD Grade A. IBPS PO offers positions across 11 nationalized banks with a starting salary of approximately Rs. 52,000-55,000 per month. SBI PO is highly popular due to SBI\'s prestige and similar compensation. RBI Grade B is considered the most lucrative banking exam with a starting salary exceeding Rs. 77,000 per month, along with excellent perks. For those starting out, IBPS Clerk offers a good entry point into the banking sector with a starting salary around Rs. 26,000-28,000 per month.',
      },
      {
        q: 'What are the easiest government exams to crack?',
        a: 'While no government exam is truly "easy" given the competition, some exams are relatively more accessible based on the syllabus depth, competition ratio, and number of vacancies. SSC MTS (Multi-Tasking Staff) requires only 10th pass qualification and has a simpler syllabus. Railway Group D also has a large number of vacancies with a basic syllabus. State-level police constable exams, India Post GDS (Gramin Dak Sevak), and SSC CHSL are also considered comparatively manageable for well-prepared candidates. The key to cracking any exam is consistent preparation and thorough practice of previous year papers.',
      },
      {
        q: 'Which government jobs offer the highest salary?',
        a: 'The highest-paying government positions in India include IAS/IPS officers (UPSC CSE) with 7th Pay Commission salary starting at Rs. 56,100 and reaching Rs. 2,50,000 at the Cabinet Secretary level. RBI Grade B officers start at approximately Rs. 77,208 per month. SEBI Grade A officers earn around Rs. 70,000-75,000 initially. Indian Foreign Service officers receive additional foreign allowances when posted abroad. PSU jobs in companies like ONGC, BHEL, and IOCL offer competitive packages of Rs. 12-20 LPA for entry-level positions. Defence officers, especially in the Indian Navy and Air Force, also receive attractive compensation including special allowances.',
      },
      {
        q: 'How can GovtExamPath help me in my preparation?',
        a: 'GovtExamPath offers a comprehensive suite of free tools designed to streamline your government exam journey. Our Career Guide provides personalized exam recommendations based on your profile and preferences. The Eligibility Checker instantly tells you which exams you qualify for based on your age, education, and category. Interactive Mind Maps help you visualize and understand complex syllabus structures. Our curated Resources section links you to the best free study materials organized by exam. The Current Affairs section keeps you updated with daily news relevant to competitive exams. All features are completely free with no hidden charges.',
      },
    ],
  },
];

const categoryTabs = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'General' },
  { key: 'eligibility', label: 'Eligibility' },
  { key: 'preparation', label: 'Preparation' },
  { key: 'application', label: 'Application' },
  { key: 'exams', label: 'Specific Exams' },
];

const allFaqItems = faqSections.flatMap((section) => section.faqs);
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      className={`border rounded-xl transition-all duration-200 ${
        isOpen
          ? 'border-l-4 border-l-teal-500 border-t-gray-200 border-r-gray-200 border-b-gray-200 dark:border-t-gray-700 dark:border-r-gray-700 dark:border-b-gray-700 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white dark:bg-gray-800 rounded-xl transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
          {question}
        </span>
        <FiChevronDown
          className={`w-5 h-5 text-teal-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        style={{ maxHeight: `${height}px` }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div ref={contentRef} className="px-5 pb-5 bg-white dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredSections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let sections = faqSections;

    if (activeTab !== 'all') {
      sections = sections.filter((s) => s.key === activeTab);
    }

    if (!query) return sections;

    return sections
      .map((section) => ({
        ...section,
        faqs: section.faqs.filter(
          (faq) =>
            faq.q.toLowerCase().includes(query) ||
            faq.a.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.faqs.length > 0);
  }, [searchQuery, activeTab]);

  const filteredTotal = filteredSections.reduce(
    (sum, s) => sum + s.faqs.length,
    0
  );

  const expandAll = () => {
    const allOpen = {};
    faqSections.forEach((section, si) => {
      section.faqs.forEach((_, fi) => {
        allOpen[`${si}-${fi}`] = true;
      });
    });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const totalOpen = Object.values(openItems).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="FAQ - Government Exam Questions"
        path="/faq"
        description="Frequently asked questions about government exams in India. Get answers about UPSC, SSC, Banking, Railways eligibility, preparation, and more."
        jsonLd={faqJsonLd}
      />
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-8 sm:p-10 mb-8">
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white opacity-10" />
        <div className="absolute bottom-[-60px] left-[-30px] w-64 h-64 rounded-full bg-white opacity-10" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white opacity-10" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-5">
            <FiHelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Frequently Asked{' '}
            <span className="bg-white/20 px-3 py-1 rounded-lg">Questions</span>
          </h1>
          <p className="text-teal-100 text-base sm:text-lg max-w-2xl mx-auto mb-7">
            Find answers to common questions about GovtExamPath and government
            exam preparation.
          </p>
          <div className="max-w-lg mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-300 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          {allFaqItems.length} Questions
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          {faqSections.length} Categories
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          Updated May 2026
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {searchQuery || activeTab !== 'all'
            ? `Showing ${filteredTotal} of ${allFaqItems.length} questions`
            : `${allFaqItems.length} questions across ${faqSections.length} categories`}
        </p>
        <button
          onClick={totalOpen > 0 ? collapseAll : expandAll}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {totalOpen > 0 ? (
            <>
              <FiMinimize2 className="w-4 h-4" />
              Collapse All
            </>
          ) : (
            <>
              <FiMaximize2 className="w-4 h-4" />
              Expand All
            </>
          )}
        </button>
      </div>

      <div className="space-y-8">
        {filteredSections.length === 0 && (
          <div className="text-center py-16">
            <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No questions found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try a different search term or category.
            </p>
          </div>
        )}
        {filteredSections.map((section) => (
          <div key={section.key}>
            <div className="flex items-center gap-3 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-5 py-3">
              <span className="text-2xl" role="img" aria-hidden="true">
                {section.icon}
              </span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1">
                {section.title}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                {section.faqs.length}{' '}
                {section.faqs.length === 1 ? 'question' : 'questions'}
              </span>
            </div>
            <div className="space-y-3">
              {section.faqs.map((faq, faqIndex) => {
                const origSectionIdx = faqSections.findIndex(
                  (s) => s.key === section.key
                );
                const origFaqIdx = faqSections[origSectionIdx]?.faqs.findIndex(
                  (f) => f.q === faq.q
                );
                const key = `${origSectionIdx}-${origFaqIdx}`;
                return (
                  <FAQItem
                    key={key}
                    question={faq.q}
                    answer={faq.a}
                    isOpen={!!openItems[key]}
                    onToggle={() => toggleItem(key)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-8 sm:p-10 text-center">
        <div className="absolute top-[-30px] left-[-30px] w-40 h-40 rounded-full bg-white opacity-10" />
        <div className="absolute bottom-[-40px] right-[-20px] w-52 h-52 rounded-full bg-white opacity-10" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            Still Have Questions?
          </h2>
          <p className="text-teal-100 mb-6 max-w-xl mx-auto">
            Use our free tools to explore government exams tailored to your
            profile, or reach out to us directly.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/eligibility-checker"
              className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Check Eligibility
            </Link>
            <Link
              to="/ai-guide"
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              Career Guide
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
