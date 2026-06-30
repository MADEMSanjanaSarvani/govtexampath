import React, { useState, useMemo } from 'react';
import { Link } from '@/lib/router';
import { FiSearch, FiX, FiFileText, FiDownload, FiChevronDown, FiInfo, FiCheckCircle, FiClock, FiAlertCircle, FiChevronRight, FiHelpCircle, FiAlertTriangle, FiClipboard } from 'react-icons/fi';
import useExamsData from '../hooks/useExamsData';
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

const getAdmitCardStatus = (importantDates) => {
  if (!importantDates || importantDates.length === 0) {
    return { label: 'Not Yet Released', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
  }

  const now = new Date();
  const admitCardEntry = importantDates.find(
    (d) => /admit card|hall ticket/i.test(d.event)
  );

  if (!admitCardEntry) {
    return { label: 'Not Yet Released', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
  }

  const entryDate = new Date(admitCardEntry.date);
  const diffMs = entryDate - now;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs <= 0) {
    return { label: 'Available', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: FiCheckCircle };
  }
  if (diffDays <= 30) {
    return { label: 'Expected Soon', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: FiClock };
  }
  return { label: 'Not Yet Released', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
};

const getRelevantDate = (importantDates) => {
  if (!importantDates || importantDates.length === 0) return null;
  const admitEntry = importantDates.find((d) => /admit card|hall ticket/i.test(d.event));
  if (admitEntry) return admitEntry.date;
  const sorted = [...importantDates].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted[0]?.date || null;
};

const AdmitCard = () => {
  const { t } = useLanguage();
  const { exams: examsData } = useExamsData();
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
      const dateA = getRelevantDate(a.importantDates);
      const dateB = getRelevantDate(b.importantDates);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB) - new Date(dateA);
    });

    return exams;
  }, [search, category, examsData]);

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
      q: 'What if my photo or signature on the admit card is unclear?',
      a: 'Contact the conducting body immediately through their helpline or email. Most bodies provide a correction window. Carry your original registration confirmation and a valid photo ID as backup. The invigilator may allow you to appear with proper identification.',
    },
    {
      q: 'Can I appear for the exam without an admit card?',
      a: 'No. The admit card is a mandatory document for all government exams. Without it, you will not be allowed entry to the exam centre. Always download and print your admit card well in advance.',
    },
    {
      q: 'What should I do if the admit card has wrong details?',
      a: 'If there are errors in your name, date of birth, category, or other details, report it to the conducting body before the exam. Most portals have a "Correction/Discrepancy" section. Some bodies allow corrections through email. Do not ignore errors — they can affect your candidature.',
    },
    {
      q: 'How many copies of the admit card should I carry?',
      a: 'Carry at least 2 printed copies on A4 paper. One copy may be collected by the invigilator, and the other serves as your record. Also save a digital copy on your phone as an emergency backup.',
    },
    {
      q: 'When are admit cards usually released?',
      a: 'Admit cards are typically released 10-15 days before the exam date. For some exams like UPSC and SSC, they may be released 3 weeks in advance. Defence exams (NDA, CDS) usually release admit cards 2-3 weeks prior.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Latest Admit Cards 2026 - Download Government Exam Hall Tickets"
        path="/admit-cards"
        description="Download latest government exam admit cards and hall tickets for 2026. Find direct links to admit cards for UPSC, SSC, Banking, Railways, Defence, and State PSC exams."
      />
      <Breadcrumb items={[{ label: 'Admit Cards' }]} />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
          <FiFileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('admitCards')} <span className="gradient-text">2026</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('admitCardsDesc')}
        </p>
      </div>

      {/* How to Download Admit Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <FiDownload className="w-6 h-6 text-blue-500" />
          {t('howToDownload')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: 1, title: 'Visit Official Site', desc: 'Go to the official website of the conducting body.' },
            { step: 2, title: 'Find Admit Card Section', desc: 'Look for "Admit Card" or "Hall Ticket" link on the homepage.' },
            { step: 3, title: 'Enter Credentials', desc: 'Use your registration number, date of birth, or roll number to log in.' },
            { step: 4, title: 'Download & Print', desc: 'Save as PDF and print on A4 paper. Keep at least 2 copies.' },
            { step: 5, title: 'Verify All Details', desc: 'Check name, photo, exam centre, date, time, and reporting time.' },
          ].map((item) => (
            <div key={item.step} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Day Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FiClipboard className="w-5 h-5 text-blue-500" />
            {t('examDayChecklist')}
          </h2>
          <ul className="space-y-3">
            {[
              'Printed admit card (2 copies)',
              'Valid photo ID (Aadhaar, PAN, Passport, Voter ID, or Driving License)',
              'Passport-size photographs (2-3 extra)',
              'Black/blue ballpoint pens',
              'Transparent water bottle',
              'Analog watch (smartwatches not allowed)',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5 text-red-500" />
            Items NOT Allowed
          </h2>
          <ul className="space-y-3">
            {[
              'Mobile phones, smartwatches, or electronic devices',
              'Calculators (unless specified by the exam body)',
              'Bags, wallets, or purses inside the exam hall',
              'Bluetooth devices, earphones, or headphones',
              'Books, notes, or any printed/written material',
              'Food items (except transparent water bottle)',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <FiX className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Important Things to Verify */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-8">
        <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
          <FiAlertTriangle className="w-5 h-5" />
          Important: Verify These Details on Your Admit Card
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Personal Details', items: 'Name, Father\'s name, Date of Birth, Category' },
            { label: 'Photo & Signature', items: 'Clear photograph and signature matching your registration' },
            { label: 'Exam Details', items: 'Exam name, date, shift/session, paper code' },
            { label: 'Centre Details', items: 'Centre name, address, city, and centre code' },
            { label: 'Timing', items: 'Reporting time, gate closure time, and exam start time' },
            { label: 'Roll Number', items: 'Your unique roll number / registration number' },
          ].map((item, i) => (
            <div key={i} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">{item.label}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{item.items}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Exam Cards */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Admit Card Status by Exam
      </h2>
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admitCardSearchPlaceholder')}
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
                {cat === 'All' ? t('allCategories') : cat}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('showing')} <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredExams.length}</span> {t('exams').toLowerCase()}
        </p>
      </div>

      {/* Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-16">
          <FiFileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noExamsMatchSearch')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredExams.map((exam) => {
            const status = getAdmitCardStatus(exam.importantDates);
            const StatusIcon = status.icon;
            const admitEntry = exam.importantDates?.find((d) => /admit card|hall ticket/i.test(d.event));
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
                    {admitEntry && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Admit Card:</span>{' '}
                        {formatDate(admitEntry.date)}
                      </p>
                    )}
                    {!admitEntry && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                        Admit card date not yet announced
                      </p>
                    )}
                  </div>

                  <div className="flex-1" />

                  <div className="mt-3">
                    <Link
                      to={`/exams/${exam._id}`}
                      className="w-full flex items-center justify-center gap-1 px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                      {t('viewDetails')}
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
          <FiHelpCircle className="w-6 h-6 text-blue-500" />
          {t('faq')}
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
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex gap-4">
        <FiInfo className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Admit cards are released on official conducting body websites. We track release dates and provide
          comprehensive guides to help you prepare for exam day. Always download from the official source
          and carry your admit card along with a valid photo ID to the examination centre.
        </p>
      </div>
    </div>
  );
};

export default AdmitCard;
