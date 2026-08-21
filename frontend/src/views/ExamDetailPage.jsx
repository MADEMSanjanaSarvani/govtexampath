import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from '@/lib/router';
import { FiArrowLeft, FiBookmark, FiShare2, FiExternalLink, FiCalendar, FiUsers, FiChevronRight, FiPrinter, FiAlertCircle, FiMapPin, FiFileText, FiHelpCircle, FiPhone, FiMail, FiDownload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getExamById, getExams, bookmarkExam } from '../services/examService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import ShareButtons from '../components/common/ShareButtons';
import { generateICSFile, addToGoogleCalendar } from '../utils/calendarExport';
import { useLanguage } from '../context/LanguageContext';

// applicationLink is not guaranteed to be a URL. Some records carry prose
// instead ("Varies by state"), and the live catalogue has values with
// explanatory text appended, like "https://nhm.gov.in (state-specific portals)".
// Those are truthy, so they satisfied every `exam.applicationLink && ...` guard
// and every `exam.applicationLink || fallback` — rendering an Apply button that
// resolves to a relative path, and putting the prose into the URL field of the
// Google Calendar event and .ics file instead of the fallback link. Checking the
// value actually parses as http(s) makes the existing guards mean what they were
// written to mean.
const asHttpUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const u = new URL(value.trim());
    return (u.protocol === 'http:' || u.protocol === 'https:') ? value.trim() : null;
  } catch {
    return null;
  }
};

const tabs = ['Overview', 'Eligibility', 'Syllabus', 'Exam Pattern', 'Previous Year Papers', 'Salary & Career', 'How to Apply'];

const categoryHeroGradients = {
  UPSC: 'from-purple-600 via-indigo-600 to-violet-700',
  SSC: 'from-blue-600 via-cyan-600 to-blue-700',
  Banking: 'from-green-600 via-emerald-600 to-teal-700',
  Railways: 'from-red-600 via-rose-600 to-red-700',
  Defence: 'from-amber-600 via-orange-600 to-amber-700',
  'State PSC': 'from-orange-600 via-red-500 to-orange-700',
  Teaching: 'from-pink-600 via-rose-600 to-pink-700',
  Police: 'from-indigo-600 via-blue-600 to-indigo-700',
  Insurance: 'from-teal-600 via-cyan-600 to-teal-700',
  'Regulatory Bodies': 'from-emerald-600 via-teal-600 to-emerald-700',
  PSU: 'from-slate-600 via-gray-600 to-slate-700',
  Judiciary: 'from-yellow-600 via-amber-600 to-yellow-700',
  Agriculture: 'from-lime-600 via-green-600 to-lime-700',
  Postal: 'from-red-500 via-orange-500 to-red-600',
  Healthcare: 'from-pink-500 via-rose-500 to-pink-600',
};

const ExamDetailPage = ({ initialExam, examId: examIdProp }) => {
  const { t } = useLanguage();
  const tabLabels = {
    'Overview': t('examTabOverview'),
    'Eligibility': t('examTabEligibility'),
    'Syllabus': t('examTabSyllabus'),
    'Exam Pattern': t('examTabPattern'),
    'Previous Year Papers': t('examTabPYQ'),
    'Salary & Career': t('examTabSalary'),
    'How to Apply': t('examTabApply'),
  };
  const { id: routerId } = useParams();
  const id = examIdProp || routerId;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [exam, setExam] = useState(initialExam || null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(!initialExam);
  const [activeTab, setActiveTab] = useState('Overview');
  const [bookmarked, setBookmarked] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchExam = async () => {
      if (!initialExam) setLoading(true);
      try {
        const data = await getExamById(id);
        if (!data) { setLoading(false); return; }
        const examData = data.exam || data;
        setExam(examData);
        setBookmarked(examData.isBookmarked || false);

        if (examData.category) {
          try {
            const relatedData = await getExams({ category: examData.category, limit: 4 });
            const all = relatedData.exams || relatedData.data || relatedData;
            const arr = Array.isArray(all) ? all : [];
            setRelated(arr.filter((e) => e._id !== id).slice(0, 3));
          } catch {
            setRelated([]);
          }
        }
      } catch {
        toast.error('Failed to load exam details');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try { return format(new Date(dateStr), 'dd MMMM yyyy'); } catch { return dateStr; }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) { toast.error('Please login to bookmark exams'); return; }
    try {
      await bookmarkExam(exam._id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Bookmark removed' : t('bookmarkedReminderConfirm'), { duration: 4000 });
    } catch { toast.error('Failed to update bookmark'); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: exam.title, url }); } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;
  }

  if (!exam) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('examNotFound')}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t('examNotFoundDesc')}</p>
        <Link to="/exams" className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:underline"><FiArrowLeft /> {t('examBackToExams')}</Link>
      </div>
    );
  }

  // ── SEO structured data: Course + FAQPage + Breadcrumb (rich results) ─────
  const examSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: exam.title,
      description: exam.description || `${exam.title} - eligibility, syllabus, exam pattern, salary and how to apply.`,
      provider: {
        '@type': 'Organization',
        name: exam.conductingBody || 'Government of India',
        url: asHttpUrl(exam.officialWebsite) || 'https://govtexampath.com',
      },
      url: `https://govtexampath.com/exams/${id}`,
      ...(exam.category && { about: exam.category }),
      ...(exam.lastDate && { endDate: exam.lastDate }),
      ...(exam.eligibility && { educationalLevel: exam.eligibility }),
    },
    ...((exam.faqs && exam.faqs.length > 0) ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: exam.faqs
        .filter((f) => f.question && f.answer)
        .map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
    }] : []),
  ];
  const examCrumbs = [{ name: 'Exams', url: '/exams' }, { name: exam.title }];
  // CTR-optimised meta description: leads with this specific exam's real numbers
  // (vacancies/salary) instead of a generic sentence identical across every exam page.
  const examHighlights = [
    exam.vacancies && !/to be announced|tbd/i.test(exam.vacancies) ? `${exam.vacancies} vacancies` : null,
    exam.salary ? `salary ${exam.salary}` : null,
  ].filter(Boolean).join(', ');
  const examDescription = examHighlights
    ? `${exam.title} — ${examHighlights}. Eligibility, syllabus, exam pattern, important dates & free preparation guide.`
    : `${exam.title}: eligibility, syllabus, exam pattern, vacancies, salary, important dates, admit card & result. Free preparation guide — check eligibility & apply online.`;

  // Renders ALL tab panels into the DOM at once (rather than only the active one), toggling
  // visibility with a CSS `hidden` class instead of conditional rendering. Googlebot indexes
  // the rendered DOM but doesn't click UI controls, so a switch-statement that only returned the
  // active tab's JSX left 6 of 7 content sections per exam — syllabus, exam pattern, eligibility,
  // salary, career growth, how to apply — completely invisible to the crawler, leaving only the
  // ~20-40 word Overview description as indexable text. This was the root cause of AdSense's
  // "low value content" rejection for the 220 exam pages in the sitemap.
  const renderTabContent = () => {
    return (
      <>
        <div className={activeTab === 'Overview' ? '' : 'hidden'}>
          <div className="space-y-6">
            {exam.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('aboutThisExam')}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.description}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exam.conductingBody && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('conductingBody')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.conductingBody}</p>
                </div>
              )}
              {exam.vacancies && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalVacancies')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.vacancies}</p>
                </div>
              )}
              {exam.examMode && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('examMode')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{exam.examMode}</p>
                </div>
              )}
              {exam.examDuration && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('duration')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.examDuration}</p>
                </div>
              )}
            </div>

            {exam.categoryWiseVacancies && exam.categoryWiseVacancies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('categoryWiseVacancies')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {exam.categoryWiseVacancies.map((cv, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{cv.category}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{cv.count || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exam.posts && exam.posts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('availablePosts')}</h3>
                <div className="flex flex-wrap gap-2">
                  {exam.posts.map((post, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium">{post}</span>
                  ))}
                </div>
              </div>
            )}

            {exam.importantDates && exam.importantDates.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('importantDates')}</h3>
                <div className="relative pl-6 border-l-2 border-primary-200 dark:border-primary-800 space-y-4">
                  {exam.importantDates.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[29px] w-4 h-4 bg-primary-500 rounded-full border-2 border-white dark:border-gray-800" />
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.event || item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exam.jobLocations && exam.jobLocations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2"><FiMapPin className="w-5 h-5" /> {t('jobLocations')}</h3>
                <div className="flex flex-wrap gap-2">
                  {exam.jobLocations.map((loc, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-lg">{loc}</span>
                  ))}
                </div>
              </div>
            )}

            {exam.notificationPdfUrl && (
              <a href={exam.notificationPdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium">
                <FiFileText className="w-5 h-5" /> {t('downloadNotificationPdf')}
              </a>
            )}

            {exam.lastVerifiedAt && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                {t('lastVerified')}: {formatDate(exam.lastVerifiedAt)}{exam.lastVerifiedSource ? ` · ${exam.lastVerifiedSource}` : ''}
              </p>
            )}
          </div>
        </div>

        <div className={activeTab === 'Eligibility' ? '' : 'hidden'}>
          <div className="space-y-6">
            {exam.eligibility && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('eligibilityCriteria')}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.eligibility}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exam.ageLimit && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2"><FiUsers className="w-5 h-5 text-blue-600" /><p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('ageLimit')}</p></div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.ageLimit}</p>
                  {exam.ageLimitDetails && (exam.ageLimitDetails.min > 0 || exam.ageLimitDetails.max > 0) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exam.ageLimitDetails.min}-{exam.ageLimitDetails.max} years</p>
                  )}
                  {exam.ageLimitDetails?.relaxation && (
                    <p className="text-xs text-gray-500 mt-1">{exam.ageLimitDetails.relaxation}</p>
                  )}
                  {!exam.ageLimitDetails?.relaxation && (
                    <p className="text-xs text-gray-500 mt-1">{t('ageRelaxationNote')}</p>
                  )}
                </div>
              )}
              {(exam.qualifications || exam.qualification) && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('educationalQualification')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.qualifications || exam.qualification}</p>
                </div>
              )}
              {exam.attempts && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('numberOfAttempts')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.attempts}</p>
                </div>
              )}
              {exam.applicationFee && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('applicationFee')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.applicationFee}</p>
                </div>
              )}
            </div>

            {exam.requiredDocuments && exam.requiredDocuments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2"><FiFileText className="w-5 h-5" /> {t('requiredDocuments')}</h3>
                <ul className="space-y-2">
                  {exam.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" /> {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className={activeTab === 'Syllabus' ? '' : 'hidden'}>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('detailedSyllabus')}</h3>
            {exam.syllabus ? (
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.syllabus}</div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">{t('syllabusComingSoon')}</p>
                <Link to="/mind-maps" className="inline-flex items-center gap-2 mt-3 text-primary-600 hover:underline">{t('viewMindMaps')} <FiChevronRight className="w-4 h-4" /></Link>
              </div>
            )}
          </div>
        </div>

        <div className={activeTab === 'Exam Pattern' ? '' : 'hidden'}>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('examTabPattern')}</h3>
            {exam.examPattern ? (
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.examPattern}</div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('examPatternComingSoon')}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {exam.examMode && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('mode')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{exam.examMode}</p>
                </div>
              )}
              {exam.examDuration && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('duration')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.examDuration}</p>
                </div>
              )}
              {exam.negativeMarking && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('negativeMarking')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.negativeMarking}</p>
                </div>
              )}
            </div>

            {exam.selectionProcess && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('selectionProcess')}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.selectionProcess}</p>
              </div>
            )}

            {exam.cutoffs && exam.cutoffs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('previousYearCutoffs')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300 font-medium">{t('year')}</th>
                        <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300 font-medium">{t('stage')}</th>
                        <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300 font-medium">{t('category')}</th>
                        <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300 font-medium">{t('marks')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exam.cutoffs.map((c, idx) => (
                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                          <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{c.year}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{c.stage}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{c.category}</td>
                          <td className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">{c.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={activeTab === 'Previous Year Papers' ? '' : 'hidden'}>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('previousYearPapers')}</h3>
            {exam.previousYearPapers && exam.previousYearPapers.length > 0 ? (
              <div className="space-y-6">
                {Object.entries(
                  exam.previousYearPapers.reduce((acc, p) => {
                    const yr = p.year || 'Unknown';
                    if (!acc[yr]) acc[yr] = [];
                    acc[yr].push(p);
                    return acc;
                  }, {})
                )
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([year, papers]) => (
                    <div key={year}>
                      <h4 className="text-md font-bold text-primary-600 dark:text-primary-400 mb-3 flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" /> {year}
                      </h4>
                      <div className="space-y-3">
                        {papers.map((paper, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              {/* Fall back through the shapes this data has actually
                                  arrived in. Some records store the label as `title`
                                  rather than the schema's `paper` (TSPSC Group 4 did),
                                  which rendered as a blank heading on an otherwise
                                  populated card. Showing the year beats showing nothing
                                  when neither field is present. */}
                              <h5 className="font-semibold text-gray-900 dark:text-gray-100">{paper.paper || paper.title || `${year} paper`}</h5>
                              <div className="flex gap-2 flex-wrap">
                                {paper.marks && <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">{paper.marks} {t('marks')}</span>}
                                {paper.questions && <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">{paper.questions} {t('questionsShort')}</span>}
                                {paper.duration && <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full">{paper.duration}</span>}
                              </div>
                            </div>
                            {paper.topics && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium text-gray-700 dark:text-gray-300">{t('topicsLabel')}: </span>{paper.topics}</p>}
                            {paper.url && (
                              <a href={paper.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-primary-600 hover:underline">
                                <FiDownload className="w-3.5 h-3.5" /> {t('downloadPaper')}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50 mt-4">
                  <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">{t('preparationTip')}</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">{t('pyqStrategy')}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">{t('pyqComingSoon')}</p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-3">
                  {exam.officialWebsite && (
                    <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-600 hover:underline">
                      {t('checkOfficialWebsite')} <FiChevronRight className="w-4 h-4" />
                    </a>
                  )}
                  <Link to="/resources" className="inline-flex items-center gap-2 text-primary-600 hover:underline">{t('browseResources')} <FiChevronRight className="w-4 h-4" /></Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={activeTab === 'Salary & Career' ? '' : 'hidden'}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('salaryCareerGrowth')}</h3>
            {exam.salary && (
              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('salaryPayScale')}</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{exam.salary}</p>
                {exam.salaryRange && (exam.salaryRange.min > 0 || exam.salaryRange.max > 0) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t('rangeLabel')}: ₹{exam.salaryRange.min?.toLocaleString('en-IN')} - ₹{exam.salaryRange.max?.toLocaleString('en-IN')}
                  </p>
                )}
                {exam.salaryRange?.description && (
                  <p className="text-sm text-gray-500 mt-1">{exam.salaryRange.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">{t('governmentAllowances')}</p>
              </div>
            )}

            {exam.perks && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('perksAllowances')}</p>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{exam.perks}</p>
              </div>
            )}

            {exam.jobRole && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('jobRoleResponsibilities')}</p>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{exam.jobRole}</p>
              </div>
            )}

            {exam.careerGrowth && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('careerGrowthPromotions')}</p>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{exam.careerGrowth}</p>
              </div>
            )}

            {exam.jobLocations && exam.jobLocations.length > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FiMapPin className="w-4 h-4" /> {t('jobLocations')}</p>
                <div className="flex flex-wrap gap-2">
                  {exam.jobLocations.map((loc, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg border border-green-200 dark:border-green-800">{loc}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('careerBenefits')}</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> {t('careerBenefit1')}</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> {t('careerBenefit2')}</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> {t('careerBenefit3')}</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> {t('careerBenefit4')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={activeTab === 'How to Apply' ? '' : 'hidden'}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('applicationProcess')}</h3>
            {exam.applicationProcess ? (
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.applicationProcess}</div>
            ) : (
              <div className="space-y-3">
                {[t('applyStep1'), t('applyStep2'), t('applyStep3'), t('applyStep4'), t('applyStep5'), t('applyStep6'), t('applyStep7')].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-600 flex-shrink-0">{i + 1}</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
                  </div>
                ))}
              </div>
            )}
            {exam.applicationFee && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-sm text-gray-500">{t('applicationFee')}</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.applicationFee}</p>
              </div>
            )}

            {exam.requiredDocuments && exam.requiredDocuments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('requiredDocuments')}</h3>
                <ul className="space-y-2">
                  {exam.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiFileText className="w-4 h-4 text-gray-400 flex-shrink-0" /> {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {asHttpUrl(exam.applicationLink) && (
                <a href={asHttpUrl(exam.applicationLink)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  {t('applyNow')} <FiExternalLink className="w-5 h-5" />
                </a>
              )}
              {exam.notificationPdfUrl && (
                <a href={exam.notificationPdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <FiDownload className="w-5 h-5" /> {t('notificationPdf')}
                </a>
              )}
              {exam.officialWebsite && (
                <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  <FiExternalLink className="w-5 h-5" /> {t('officialWebsite')}
                </a>
              )}
            </div>

            {exam.contactInfo && (exam.contactInfo.helpdesk || exam.contactInfo.email || exam.contactInfo.phone) && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><FiPhone className="w-4 h-4" /> {t('helpDeskContact')}</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {exam.contactInfo.helpdesk && <p>{exam.contactInfo.helpdesk}</p>}
                  {exam.contactInfo.email && <p className="flex items-center gap-2"><FiMail className="w-4 h-4" /> {exam.contactInfo.email}</p>}
                  {exam.contactInfo.phone && <p className="flex items-center gap-2"><FiPhone className="w-4 h-4" /> {exam.contactInfo.phone}</p>}
                  {exam.contactInfo.address && <p>{exam.contactInfo.address}</p>}
                </div>
              </div>
            )}

            {exam.faqs && exam.faqs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2"><FiHelpCircle className="w-5 h-5" /> {t('faqs')}</h3>
                <div className="space-y-3">
                  {exam.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Q: {faq.question}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title={exam.title} path={`/exams/${id}`} description={examDescription} jsonLd={examSchemas} breadcrumbs={examCrumbs} />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-600 transition-colors">{t('home')}</Link>
        <FiChevronRight className="w-4 h-4" />
        <Link to="/exams" className="hover:text-primary-600 transition-colors">{t('exams')}</Link>
        <FiChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-xs">{exam.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className={`bg-gradient-to-r ${categoryHeroGradients[exam.category] || 'from-blue-600 via-indigo-600 to-purple-700'} rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-3">{exam.category || 'General'}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{exam.title}</h1>
                {exam.conductingBody && <p className="text-white/80">{t('conductedBy')}: {exam.conductingBody}</p>}
                {exam.lastDate && (
                  <p className="text-blue-100 flex items-center gap-2 mt-2">
                    <FiCalendar className="w-4 h-4" />
                    {t('lastDateApply')}: {formatDate(exam.lastDate)}
                    {new Date(exam.lastDate) < new Date() && (
                      <span className="px-2 py-0.5 bg-red-500/80 text-white text-xs rounded-full font-medium">{t('applicationClosed')}</span>
                    )}
                    {exam.dateStatus === 'tentative' && (
                      <span className="px-2 py-0.5 bg-yellow-500/80 text-white text-xs rounded-full font-medium">{t('tentative')}</span>
                    )}
                  </p>
                )}
                {exam.officialWebsite && (
                  <a
                    href={exam.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <FiExternalLink className="w-4 h-4" /> {t('officialSource')}
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={handleBookmark} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark exam'} title={bookmarked ? t('bookmarkedLabel') : t('bookmarkReminderHint')} className={`p-2.5 rounded-xl transition-all ${bookmarked ? 'bg-white text-primary-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  <FiBookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button onClick={handleShare} aria-label="Share exam" className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all">
                  <FiShare2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
                  title="Print exam details"
                >
                  <FiPrinter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Key dates strip */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{t('keyDatesInfo')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {exam.applicationStartDate && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center border border-emerald-100 dark:border-emerald-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('applicationStart')}</p>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{formatDate(exam.applicationStartDate)}</p>
                </div>
              )}
              {exam.lastDate && (
                <div className={`p-3 rounded-xl text-center border ${new Date(exam.lastDate) < new Date() ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50'}`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('lastDateApply')}</p>
                  <p className={`text-sm font-semibold ${new Date(exam.lastDate) < new Date() ? 'text-red-500 dark:text-red-400 line-through' : 'text-red-600 dark:text-red-400'}`}>
                    {formatDate(exam.lastDate)}
                  </p>
                  {new Date(exam.lastDate) < new Date() && <p className="text-xs text-red-500 font-medium mt-0.5">{t('closed')}</p>}
                  {exam.dateStatus === 'tentative' && <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mt-0.5">{t('tentative')}</p>}
                </div>
              )}
              {exam.examDate && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center border border-blue-100 dark:border-blue-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('examDate')}</p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{formatDate(exam.examDate)}</p>
                </div>
              )}
              {exam.admitCardDate && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center border border-amber-100 dark:border-amber-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('admitCard')}</p>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">{formatDate(exam.admitCardDate)}</p>
                </div>
              )}
              {exam.resultDate && (
                <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl text-center border border-violet-100 dark:border-violet-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('resultDate')}</p>
                  <p className="text-sm font-semibold text-violet-700 dark:text-violet-400">{formatDate(exam.resultDate)}</p>
                </div>
              )}
              {exam.salary && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center border border-green-100 dark:border-green-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('salary')}</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">{exam.salary}</p>
                </div>
              )}
              {exam.ageLimit && (
                <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl text-center border border-sky-100 dark:border-sky-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('ageLimit')}</p>
                  <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">{exam.ageLimit}</p>
                </div>
              )}
              {exam.applicationFee && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center border border-purple-100 dark:border-purple-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('applicationFee')}</p>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">{exam.applicationFee}</p>
                </div>
              )}
            </div>
          </div>

          {exam.dateStatus === 'tentative' && (
            <p className="text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2 mb-4">
              <FiAlertCircle className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
              {t('tentativeDatesWarning')}
            </p>
          )}

          {/* Tabs */}
          <div className="bg-gray-100 dark:bg-gray-800/60 p-1 rounded-2xl flex overflow-x-auto no-scrollbar mb-6 gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium'
                }`}
              >
                {tabLabels[tab] || tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            {renderTabContent()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('quickActions')}</h3>
            <div className="space-y-3">
              <div>
                <button onClick={handleBookmark} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${bookmarked ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border border-primary-200 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}>
                  <FiBookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                  {bookmarked ? t('bookmarkedLabel') : t('bookmarkThisExam')}
                </button>
                {!bookmarked && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1">{t('bookmarkReminderHint')}</p>
                )}
              </div>
              <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium transition-all">
                <FiShare2 className="w-5 h-5" /> {t('shareExam')}
              </button>
              <ShareButtons url={`https://govtexampath.com/exams/${id}`} title={exam.title} description={`${exam.title} - Eligibility, syllabus, exam pattern, salary details`} />
              <Link
                to={`/contact?subject=${encodeURIComponent(`Report Error: ${exam.title}`)}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all text-sm"
              >
                <FiAlertCircle className="w-4 h-4" /> {t('reportIncorrectInfo')}
              </Link>
              {exam.lastDate && (
                <div className="relative" ref={calendarRef}>
                  <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium transition-all"
                  >
                    <FiCalendar className="w-5 h-5" /> {t('addToCalendar')}
                  </button>
                  {calendarOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                      <button
                        onClick={() => {
                          addToGoogleCalendar(
                            `Deadline: ${exam.title}`,
                            `${exam.title}${exam.conductingBody ? ` - ${exam.conductingBody}` : ''}. Last date to apply.`,
                            exam.lastDate,
                            null,
                            asHttpUrl(exam.applicationLink) || `https://govtexampath.com/exams/${id}`
                          );
                          setCalendarOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                      >
                        Google Calendar
                      </button>
                      <button
                        onClick={() => {
                          generateICSFile(
                            `Deadline: ${exam.title}`,
                            `${exam.title}${exam.conductingBody ? ` - ${exam.conductingBody}` : ''}. Last date to apply. ${asHttpUrl(exam.applicationLink) || `https://govtexampath.com/exams/${id}`}`,
                            exam.lastDate,
                            null,
                            asHttpUrl(exam.applicationLink) || `https://govtexampath.com/exams/${id}`
                          );
                          setCalendarOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                      >
                        {t('downloadIcs')}
                      </button>
                    </div>
                  )}
                </div>
              )}
              {asHttpUrl(exam.applicationLink) && (
                <a href={asHttpUrl(exam.applicationLink)} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                  {t('applyNow')} <FiExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Related Exams */}
          {related.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('examRelated')}</h3>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link key={r._id} to={`/exams/${r._id}`} className="block p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{r.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          <button onClick={() => navigate('/exams')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FiArrowLeft className="w-4 h-4" /> {t('examBackToExams')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
