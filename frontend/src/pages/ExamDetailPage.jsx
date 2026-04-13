import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiBookmark, FiShare2, FiExternalLink, FiCalendar, FiUsers, FiChevronRight, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getExamById, getExams, bookmarkExam } from '../services/examService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const tabs = ['Overview', 'Eligibility', 'Syllabus', 'Exam Pattern', 'Salary & Career', 'How to Apply'];

const ExamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [exam, setExam] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const data = await getExamById(id);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try { return format(new Date(dateStr), 'dd MMMM yyyy'); } catch { return dateStr; }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) { toast.error('Please login to bookmark exams'); return; }
    try {
      await bookmarkExam(exam._id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Bookmark removed' : 'Exam bookmarked!');
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Exam not found</h2>
        <p className="text-gray-500 dark:text-gray-400">The exam you're looking for doesn't exist or has been removed.</p>
        <Link to="/exams" className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:underline"><FiArrowLeft /> Back to Exams</Link>
      </div>
    );
  }

  // Login gate for full details
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6 transition-colors">
          <FiArrowLeft className="w-5 h-5" /> Back
        </button>

        {/* Preview header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 mb-6">
          <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-3">{exam.category || 'General'}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{exam.title}</h1>
          {exam.conductingBody && <p className="text-blue-100">Conducted by: {exam.conductingBody}</p>}
        </div>

        {/* Blurred content with login prompt */}
        <div className="relative">
          <div className="blur-sm pointer-events-none select-none">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {exam.description ? exam.description.substring(0, 200) + '...' : 'Detailed information about this exam including eligibility criteria, syllabus, exam pattern, salary details, and application process is available for registered users.'}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><p className="text-sm text-gray-400">Age Limit</p><p className="font-semibold">18-32 years</p></div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><p className="text-sm text-gray-400">Salary Range</p><p className="font-semibold">As per norms</p></div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><p className="text-sm text-gray-400">Qualification</p><p className="font-semibold">Graduation</p></div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><p className="text-sm text-gray-400">Application Fee</p><p className="font-semibold">Varies</p></div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiLock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Login to View Full Details</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">Create a free account to access complete exam details, eligibility information, syllabus, and more.</p>
              <div className="flex gap-3 justify-center">
                <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">Login</Link>
                <Link to="/register" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 transition-all">Register Free</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            {exam.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">About This Exam</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.description}</p>
              </div>
            )}
            {exam.conductingBody && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Conducting Body</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.conductingBody}</p>
              </div>
            )}
            {exam.vacancies && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Vacancies</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.vacancies}</p>
              </div>
            )}
            {exam.importantDates && exam.importantDates.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Important Dates</h3>
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
          </div>
        );

      case 'Eligibility':
        return (
          <div className="space-y-6">
            {exam.eligibility && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Eligibility Criteria</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.eligibility}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exam.ageLimit && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2"><FiUsers className="w-5 h-5 text-blue-600" /><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Age Limit</p></div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.ageLimit}</p>
                  <p className="text-xs text-gray-500 mt-1">Age relaxation applicable for reserved categories as per government norms</p>
                </div>
              )}
              {exam.qualification && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Qualification</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.qualification}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'Syllabus':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Detailed Syllabus</h3>
            {exam.syllabus ? (
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.syllabus}</div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Detailed syllabus information will be updated soon.</p>
                <Link to="/mind-maps" className="inline-flex items-center gap-2 mt-3 text-primary-600 hover:underline">View Mind Maps <FiChevronRight className="w-4 h-4" /></Link>
              </div>
            )}
          </div>
        );

      case 'Exam Pattern':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Exam Pattern</h3>
            {exam.examPattern ? (
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.examPattern}</div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">Exam pattern details will be updated soon.</p>
            )}
          </div>
        );

      case 'Salary & Career':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Salary & Career Growth</h3>
            {exam.salary && (
              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Salary Range</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{exam.salary}</p>
                <p className="text-sm text-gray-500 mt-2">Plus DA, HRA, and other government allowances as applicable.</p>
              </div>
            )}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Career Benefits</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Job security and pension benefits</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Regular pay commission revisions</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Government housing and medical benefits</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Career advancement through promotions</li>
              </ul>
            </div>
          </div>
        );

      case 'How to Apply':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Application Process</h3>
            <div className="space-y-3">
              {['Visit the official website and register', 'Fill in personal and educational details', 'Upload photograph and signature', 'Pay the application fee online', 'Submit and download confirmation'].map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-600 flex-shrink-0">{i + 1}</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
                </div>
              ))}
            </div>
            {exam.applicationFee && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-sm text-gray-500">Application Fee</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.applicationFee}</p>
              </div>
            )}
            {exam.applicationLink && (
              <a href={exam.applicationLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                Apply Now <FiExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title={exam.title} path={`/exams/${id}`} description={`${exam.title} - ${exam.conductingBody || 'Government Exam'}. Eligibility, syllabus, exam pattern, salary, important dates and how to apply.`} />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <FiChevronRight className="w-4 h-4" />
        <Link to="/exams" className="hover:text-primary-600 transition-colors">Exams</Link>
        <FiChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-xs">{exam.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-3">{exam.category || 'General'}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{exam.title}</h1>
                {exam.conductingBody && <p className="text-blue-100">Conducted by: {exam.conductingBody}</p>}
                {exam.lastDate && (
                  <p className="text-blue-100 flex items-center gap-2 mt-2">
                    <FiCalendar className="w-4 h-4" /> Last Date: {formatDate(exam.lastDate)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={handleBookmark} className={`p-2.5 rounded-xl transition-all ${bookmarked ? 'bg-white text-primary-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  <FiBookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button onClick={handleShare} className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all">
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {exam.salary && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{exam.salary}</p>
              </div>
            )}
            {exam.ageLimit && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Age Limit</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{exam.ageLimit}</p>
              </div>
            )}
            {exam.applicationFee && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">App Fee</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{exam.applicationFee}</p>
              </div>
            )}
            {exam.lastDate && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Date</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{formatDate(exam.lastDate)}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab}
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
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={handleBookmark} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${bookmarked ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border border-primary-200 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}>
                <FiBookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Bookmarked' : 'Bookmark This Exam'}
              </button>
              <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium transition-all">
                <FiShare2 className="w-5 h-5" /> Share
              </button>
              {exam.applicationLink && (
                <a href={exam.applicationLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                  Apply Now <FiExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Related Exams */}
          {related.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Related Exams</h3>
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
            <FiArrowLeft className="w-4 h-4" /> Back to All Exams
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
