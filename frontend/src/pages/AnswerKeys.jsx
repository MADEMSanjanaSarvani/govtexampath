import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCheckCircle, FiClock, FiAlertCircle, FiX, FiChevronDown, FiTarget, FiAlertTriangle, FiHelpCircle, FiChevronRight } from 'react-icons/fi';
import { examsData } from '../data/examsData';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

const allCategories = [
  'All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC',
  'Teaching', 'Police', 'Insurance', 'Regulatory Bodies', 'PSU',
  'Judiciary', 'Agriculture', 'Postal', 'Healthcare', 'Miscellaneous',
];

const categoryBadgeColors = {
  UPSC: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  SSC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Banking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Railways: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Defence: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'State PSC': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Police: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Insurance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Regulatory Bodies': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  PSU: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  Judiciary: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Agriculture: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  Postal: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Healthcare: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Miscellaneous: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const getAnswerKeyStatus = (importantDates) => {
  if (!importantDates || importantDates.length === 0) {
    return { label: 'Not Yet Available', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
  }

  const now = new Date();
  const answerKeyEntry = importantDates.find((d) => /answer key/i.test(d.event));

  if (!answerKeyEntry) {
    return { label: 'Not Yet Available', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
  }

  const entryDate = new Date(answerKeyEntry.date);
  const diffMs = entryDate - now;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs <= 0) {
    return { label: 'Released', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: FiCheckCircle };
  }
  if (diffDays <= 30) {
    return { label: 'Expected Soon', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: FiClock };
  }
  return { label: 'Not Yet Available', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
};

const getAnswerKeyDate = (importantDates) => {
  if (!importantDates || importantDates.length === 0) return null;
  const entry = importantDates.find((d) => /answer key/i.test(d.event));
  if (entry) return entry.date;
  const sorted = [...importantDates].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted[0]?.date || null;
};

const AnswerKeys = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredExams = useMemo(() => {
    let exams = examsData.filter((exam) => exam.isActive);

    if (category !== 'All') {
      exams = exams.filter((exam) => exam.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      exams = exams.filter(
        (exam) =>
          exam.title.toLowerCase().includes(q) ||
          exam.conductingBody.toLowerCase().includes(q)
      );
    }

    exams.sort((a, b) => {
      const dateA = getAnswerKeyDate(a.importantDates);
      const dateB = getAnswerKeyDate(b.importantDates);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB) - new Date(dateA);
    });

    return exams;
  }, [search, category]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const faqs = [
    {
      q: 'What is the difference between a provisional and final answer key?',
      a: 'A provisional (or tentative) answer key is released first, allowing candidates to raise objections against incorrect answers. After reviewing all objections, the conducting body releases the final answer key, which is used for preparing the merit list and results.',
    },
    {
      q: 'How do I raise an objection against an answer key?',
      a: 'Log in to the official website of the conducting body using your registration credentials. Navigate to the answer key section and look for an "Objection" or "Challenge" option. Select the question number, provide your justification with supporting references, and pay the objection fee (if applicable). If your objection is accepted, the fee is usually refunded.',
    },
    {
      q: 'Can my score change between the provisional and final answer key?',
      a: 'Yes. If the conducting body accepts objections and modifies answers, your score may increase or decrease. In some cases, questions are dropped entirely (all candidates get marks), or multiple options are accepted as correct.',
    },
    {
      q: 'How long do I have to raise objections?',
      a: 'The objection window is typically 3 to 7 days after the provisional answer key is released. This varies by exam — SSC usually gives 3-5 days, while UPSC provides about a week. Always check the official notification for exact deadlines.',
    },
    {
      q: 'What is the typical objection fee?',
      a: 'The fee ranges from ₹50 to ₹200 per question depending on the exam. For example, SSC charges ₹100 per question. The fee is refunded if your objection is found valid.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Answer Keys 2026 - Government Exam Answer Keys"
        path="/answer-keys"
        description="Find latest government exam answer keys for 2026. Access official answer keys for UPSC, SSC, Banking, Railways, Defence, State PSC, and other competitive exams."
      />
      <Breadcrumb items={[{ label: 'Answer Keys' }]} />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
          <FiCheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('answerKeysTitle')} <span className="gradient-text">2026</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Track answer key release dates, learn how to estimate your score,
          and know the objection process for all major government exams.
        </p>
      </div>

      {/* How to Use Answer Keys - Score Estimation Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <FiTarget className="w-6 h-6 text-green-500" />
          How to Estimate Your Score Using Answer Keys
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-bold flex items-center justify-center">1</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Download Your Question Paper</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Note down the set/series code from your question paper. Answer keys are set-specific.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-bold flex items-center justify-center">2</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Match Your Answers</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Compare each of your marked responses against the official answer key for your paper set.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-bold flex items-center justify-center">3</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Calculate with Marking Scheme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Apply the exam's marking scheme. Count correct, incorrect, and unattempted separately.</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
            <p className="font-semibold text-green-800 dark:text-green-300 mb-3">Common Marking Schemes</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>SSC CGL / CHSL / MTS</span>
                <span className="font-medium">+2 correct, −0.50 wrong</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>UPSC Prelims (GS)</span>
                <span className="font-medium">+2 correct, −0.66 wrong</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>IBPS PO / Clerk</span>
                <span className="font-medium">+1 correct, −0.25 wrong</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>RRB NTPC / Group D</span>
                <span className="font-medium">+1 correct, −0.33 wrong</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>CTET / State TET</span>
                <span className="font-medium">+1 correct, no negative</span>
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-3">
              Formula: Score = (Correct × marks per correct) − (Wrong × negative marks per wrong)
            </p>
          </div>
        </div>
      </div>

      {/* Objection Process Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <FiAlertTriangle className="w-6 h-6 text-amber-500" />
          Answer Key Objection Process
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Check Provisional Key', desc: 'Compare your answers with the provisional answer key released on the official website.' },
            { step: '2', title: 'Identify Discrepancies', desc: 'Note question numbers where you believe the official answer is incorrect or ambiguous.' },
            { step: '3', title: 'Submit Objection Online', desc: 'Log in to the portal, select questions, provide references (textbooks, official sources), and pay the fee.' },
            { step: '4', title: 'Await Final Key', desc: 'The body reviews all objections and publishes the final answer key. Valid objection fees are refunded.' },
          ].map((item) => (
            <div key={item.step} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-lg font-bold flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Answer Key Status by Exam
      </h2>
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by exam name or conducting body..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none cursor-pointer"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredExams.length}</span> exam{filteredExams.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-16">
          <FiCheckCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No exams found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredExams.map((exam) => {
            const status = getAnswerKeyStatus(exam.importantDates);
            const StatusIcon = status.icon;
            const answerKeyEntry = exam.importantDates?.find((d) => /answer key/i.test(d.event));
            const examDate = exam.importantDates?.find((d) => /exam date|examination/i.test(d.event));

            return (
              <div
                key={exam._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover flex flex-col"
              >
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {exam.category}
                    </span>
                    <span
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium ${status.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <Link
                    to={`/exams/${exam._id}`}
                    className="font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-1 line-clamp-2"
                  >
                    {exam.title}
                  </Link>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {exam.conductingBody}
                  </p>

                  <div className="space-y-1 mb-4">
                    {examDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Exam:</span>{' '}
                        {formatDate(examDate.date)}
                      </p>
                    )}
                    {answerKeyEntry && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Answer Key:</span>{' '}
                        {formatDate(answerKeyEntry.date)}
                      </p>
                    )}
                    {!answerKeyEntry && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                        Answer key date not yet announced
                      </p>
                    )}
                  </div>

                  <div className="flex-1" />

                  <div className="mt-3">
                    <Link
                      to={`/exams/${exam._id}`}
                      className="w-full flex items-center justify-center gap-1 px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                      View Exam Details & Answer Key Info
                      <FiChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAQs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <FiHelpCircle className="w-6 h-6 text-green-500" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm pr-4">{faq.q}</span>
                <FiChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 flex gap-4">
        <FiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-700 dark:text-green-300">
          Answer keys are published on the official conducting body websites. We track release dates and provide
          guides to help you estimate your score accurately. Always verify from the official source and submit
          objections within the deadline if you find discrepancies.
        </p>
      </div>
    </div>
  );
};

export default AnswerKeys;
