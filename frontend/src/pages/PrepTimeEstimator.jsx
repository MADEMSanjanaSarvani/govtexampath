import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiSearch, FiArrowRight, FiBookOpen, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { examsData } from '../data/examsData';

// Base preparation months by exam category
const basePrepMonths = {
  UPSC: 18,
  'State PSC': 12,
  Banking: 6,
  SSC: 6,
  Railways: 4,
  Defence: 6,
  Teaching: 4,
  Police: 3,
  Insurance: 5,
  PSU: 8,
  'Regulatory Bodies': 10,
  Judiciary: 12,
  Healthcare: 6,
  Postal: 3,
  Agriculture: 5,
  Miscellaneous: 6,
};

// Difficulty labels per category
const categoryDifficulty = {
  UPSC: 'Very Hard',
  'State PSC': 'Hard',
  Banking: 'Moderate',
  SSC: 'Moderate',
  Railways: 'Moderate',
  Defence: 'Moderate',
  Teaching: 'Moderate',
  Police: 'Easy',
  Insurance: 'Moderate',
  PSU: 'Hard',
  'Regulatory Bodies': 'Hard',
  Judiciary: 'Very Hard',
  Healthcare: 'Hard',
  Postal: 'Easy',
  Agriculture: 'Moderate',
  Miscellaneous: 'Moderate',
};

// Education level numeric mapping
const educationLevel = {
  '10th Pass': 1,
  '12th Pass': 2,
  Graduation: 3,
  'Post-Graduation': 4,
};

// Minimum education typically required by category
const categoryRequiredEducation = {
  UPSC: 3,
  'State PSC': 3,
  Banking: 3,
  SSC: 2,
  Railways: 1,
  Defence: 2,
  Teaching: 3,
  Police: 2,
  Insurance: 3,
  PSU: 3,
  'Regulatory Bodies': 3,
  Judiciary: 3,
  Healthcare: 4,
  Postal: 1,
  Agriculture: 3,
  Miscellaneous: 3,
};

// Tips by category
const categoryTips = {
  UPSC: [
    'Start with NCERT books from Class 6-12 for building a strong foundation.',
    'Read a quality newspaper daily and make notes on current affairs.',
    'Focus on answer writing practice from Day 1 — it is the key differentiator.',
    'Join a test series for Prelims and Mains after completing the syllabus once.',
  ],
  'State PSC': [
    'Study your state-specific history, geography, and current affairs thoroughly.',
    'Overlap with UPSC syllabus — use UPSC resources for general topics.',
    'Practice previous year papers of your specific state PSC exam.',
    'Focus on state-related schemes and policies in your preparation.',
  ],
  Banking: [
    'Speed and accuracy in Quantitative Aptitude are crucial — practice daily.',
    'Take sectional mock tests to identify weak areas early.',
    'Stay updated on banking and financial awareness — read The Hindu Business Line.',
    'Master data interpretation and reasoning puzzles for the Mains exam.',
  ],
  SSC: [
    'Build strong fundamentals in Maths — especially Algebra, Geometry, and Trigonometry.',
    'Practice vocabulary and reading comprehension daily for the English section.',
    'Solve previous 10 years question papers — SSC repeats concepts frequently.',
    'Focus on speed building through timed practice sessions.',
  ],
  Railways: [
    'General Science and Mathematics carry the highest weightage — prioritize them.',
    'Current affairs from the last 6 months are very important.',
    'Practice with previous year RRB papers for understanding the actual difficulty level.',
    'Focus on General Intelligence & Reasoning for quick scoring.',
  ],
  Defence: [
    'Physical fitness preparation should go hand-in-hand with written exam study.',
    'Focus on General Knowledge, English, and Elementary Mathematics.',
    'Start SSB interview preparation early — it has a high elimination rate.',
    'Practice current affairs and defence-related news daily.',
  ],
  Teaching: [
    'Master Child Development & Pedagogy — it is unique to teaching exams.',
    'Revise your subject-specific content from graduation level thoroughly.',
    'Practice previous year CTET/TET papers for understanding the pattern.',
    'Focus on National Education Policy and recent educational developments.',
  ],
  Police: [
    'Physical fitness is as important as written preparation — start running daily.',
    'Focus on General Awareness and Reasoning — they carry major weightage.',
    'Practice basic Maths regularly to improve speed in calculations.',
    'Stay updated with crime-related news and legal awareness topics.',
  ],
  Insurance: [
    'Banking and insurance awareness is crucial — study it separately.',
    'Focus on Quantitative Aptitude and Reasoning — they are the scoring sections.',
    'Understand insurance terminology, regulations, and recent policy changes.',
    'Take full-length mock tests to build exam temperament.',
  ],
  PSU: [
    'GATE score is often the primary selection criteria — focus on GATE preparation.',
    'Strengthen your core engineering subjects from the undergraduate syllabus.',
    'Practice numerical problems and derivations rather than just theory.',
    'Refer to standard textbooks and avoid shortcut-based study materials.',
  ],
  'Regulatory Bodies': [
    'These exams test in-depth knowledge — superficial preparation will not work.',
    'Study relevant Acts, Regulations, and recent notifications thoroughly.',
    'Focus on economic and financial awareness at an advanced level.',
    'Practice descriptive writing and essay-type answers for Phase II.',
  ],
  Judiciary: [
    'Start with bare Acts and build conceptual clarity in all major laws.',
    'Answer writing in Judiciary exams requires a specific legal format — practice it.',
    'Focus on Constitutional Law, CrPC, CPC, IPC, and Evidence Act.',
    'Read landmark Supreme Court and High Court judgments regularly.',
  ],
  Healthcare: [
    'Revise your core medical subjects thoroughly from standard textbooks.',
    'Practice MCQs daily from question banks and previous year papers.',
    'Focus on recent medical guidelines, protocols, and health policies.',
    'Solve topic-wise questions before moving to full-length mock tests.',
  ],
  Postal: [
    'Focus on General Knowledge, Mathematics, and English fundamentals.',
    'The syllabus is limited — comprehensive revision is the key strategy.',
    'Practice speed-based calculations and reasoning shortcuts.',
    'Previous year papers are the best resource for this exam.',
  ],
  Agriculture: [
    'Focus on Indian Agriculture, soil science, and agricultural economics.',
    'Stay updated on government schemes related to agriculture and rural development.',
    'Study crop patterns, irrigation methods, and latest agricultural technologies.',
    'Practice previous year papers and understand the exam-specific pattern.',
  ],
  Miscellaneous: [
    'Identify the exact syllabus and exam pattern before starting preparation.',
    'Focus on the highest-weightage topics first for maximum impact.',
    'Practice with previous year papers to understand the difficulty level.',
    'Maintain a consistent study schedule and revise regularly.',
  ],
};

// Timeline phase distribution (percentage of total time)
const timelinePhases = [
  { name: 'Foundation', percent: 40, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  { name: 'Practice', percent: 25, color: 'from-green-500 to-green-600', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  { name: 'Revision', percent: 20, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  { name: 'Mock Tests', percent: 15, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

// Popular estimates data
const popularEstimates = [
  { exam: 'UPSC CSE', range: '12-18 months', icon: '🏛️', difficulty: 'Very Hard' },
  { exam: 'SSC CGL', range: '4-6 months', icon: '📋', difficulty: 'Moderate' },
  { exam: 'IBPS PO', range: '3-6 months', icon: '🏦', difficulty: 'Moderate' },
  { exam: 'RRB NTPC', range: '3-4 months', icon: '🚂', difficulty: 'Moderate' },
];

function estimatePrepTime({ category, educationLevelValue, background, hoursPerDay, isWorking }) {
  // 1. Base months from category
  let base = basePrepMonths[category] || 6;

  // 2. Education match modifier
  const required = categoryRequiredEducation[category] || 3;
  if (educationLevelValue > required) {
    base *= 0.85; // PG for exam that needs graduation -> -15%
  } else if (educationLevelValue === required) {
    // exact match -> 0%
  } else {
    base *= 1.30; // below requirement -> +30%
  }

  // 3. Prior preparation modifier
  const prepModifiers = {
    'No prior preparation': 1.20,
    'Basic awareness (read newspaper)': 1.10,
    'Some preparation (< 3 months)': 1.00,
    'Moderate preparation (3-6 months)': 0.80,
    'Extensive preparation (6+ months)': 0.60,
  };
  base *= prepModifiers[background] || 1.0;

  // 4. Hours per day adjustment (base assumes 6 hours)
  base *= 6 / hoursPerDay;

  // 5. Working professional modifier
  if (isWorking) {
    base *= 1.30;
  }

  // 6. Round to nearest 0.5 months, minimum 1
  let result = Math.round(base * 2) / 2;
  if (result < 1) result = 1;

  return result;
}

function getConfidenceLevel(months) {
  // Confidence decreases with longer prep times (more variables)
  if (months <= 3) return 85;
  if (months <= 6) return 78;
  if (months <= 12) return 70;
  if (months <= 18) return 60;
  return 55;
}

const difficultyBadgeStyles = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  Moderate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Hard: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  'Very Hard': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
};

const PrepTimeEstimator = () => {
  const [selectedExamId, setSelectedExamId] = useState('');
  const [educationValue, setEducationValue] = useState('');
  const [background, setBackground] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Selected exam object
  const selectedExam = useMemo(
    () => examsData.find((e) => e._id === selectedExamId),
    [selectedExamId]
  );

  // Auto-filled category
  const examCategory = selectedExam?.category || '';

  // Filtered exams for searchable dropdown
  const filteredExams = useMemo(() => {
    if (!searchQuery.trim()) return examsData;
    const q = searchQuery.toLowerCase();
    return examsData.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleEstimate = (e) => {
    e.preventDefault();
    if (!selectedExamId || !educationValue || !background) return;

    const months = estimatePrepTime({
      category: examCategory,
      educationLevelValue: educationLevel[educationValue],
      background,
      hoursPerDay,
      isWorking,
    });

    const difficulty = categoryDifficulty[examCategory] || 'Moderate';
    const confidence = getConfidenceLevel(months);
    const tips = categoryTips[examCategory] || categoryTips.Miscellaneous;

    setResult({ months, difficulty, confidence, tips, examTitle: selectedExam.title, category: examCategory });
  };

  const handleExamSelect = (exam) => {
    setSelectedExamId(exam._id);
    setSearchQuery(exam.title);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Preparation Time Estimator"
        path="/prep-time-estimator"
        description="Get a realistic estimate of how long you need to prepare for any government exam based on your education, background, and available study hours. Covers UPSC, SSC, Banking, Railways, and more."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Preparation Time Estimator' }]} />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <FiClock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
            Preparation Time <span className="gradient-text">Estimator</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Get a realistic estimate of preparation time based on your background and available study hours
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleEstimate} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg">
            <div className="space-y-5">
              {/* Searchable Exam Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Select Exam
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      if (!e.target.value) setSelectedExamId('');
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search exams by name or category..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredExams.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No exams found</div>
                    ) : (
                      filteredExams.map((exam) => (
                        <button
                          key={exam._id}
                          type="button"
                          onClick={() => handleExamSelect(exam)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 ${
                            selectedExamId === exam._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                          }`}
                        >
                          <span className="text-sm text-gray-900 dark:text-gray-100 truncate">{exam.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 shrink-0">
                            {exam.category}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Exam Category (Auto-filled) */}
              {examCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Exam Category
                  </label>
                  <div className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm">
                    {examCategory}
                  </div>
                </div>
              )}

              {/* Education Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Your Education Level
                </label>
                <select
                  value={educationValue}
                  onChange={(e) => setEducationValue(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Education Level</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post-Graduation">Post-Graduation</option>
                </select>
              </div>

              {/* Relevant Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Relevant Background
                </label>
                <select
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Your Background</option>
                  <option value="No prior preparation">No prior preparation</option>
                  <option value="Basic awareness (read newspaper)">Basic awareness (read newspaper)</option>
                  <option value="Some preparation (< 3 months)">Some preparation (&lt; 3 months)</option>
                  <option value="Moderate preparation (3-6 months)">Moderate preparation (3-6 months)</option>
                  <option value="Extensive preparation (6+ months)">Extensive preparation (6+ months)</option>
                </select>
              </div>

              {/* Hours Available Per Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Hours Available Per Day: <span className="font-bold text-primary-600 dark:text-primary-400">{hoursPerDay}h</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <span>1 hour</span>
                  <span>6 hours</span>
                  <span>12 hours</span>
                </div>
              </div>

              {/* Working Professional Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Working Professional?
                </label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isWorking}
                  onClick={() => setIsWorking(!isWorking)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    isWorking ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isWorking ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Estimate Button */}
              <button
                type="submit"
                disabled={!selectedExamId || !educationValue || !background}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiClock className="w-5 h-5" /> Estimate Preparation Time
              </button>
            </div>
          </form>
        </div>

        {/* Result Card */}
        {result && (
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
              {/* Result Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 text-white">
                <h2 className="text-lg font-bold mb-1">{result.examTitle}</h2>
                <p className="text-blue-100 text-sm">Estimated preparation timeline based on your profile</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Main Estimate */}
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">
                    {result.months}
                    <span className="text-2xl font-medium text-gray-500 dark:text-gray-400 ml-2">months</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">of focused preparation recommended</p>
                </div>

                {/* Difficulty Badge & Confidence */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${difficultyBadgeStyles[result.difficulty]}`}>
                    {result.difficulty}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
                    <div className="w-24 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{result.confidence}%</span>
                  </div>
                </div>

                {/* Visual Timeline Bar */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Preparation Timeline</h3>
                  <div className="flex rounded-xl overflow-hidden h-8">
                    {timelinePhases.map((phase) => (
                      <div
                        key={phase.name}
                        className={`bg-gradient-to-r ${phase.color} flex items-center justify-center relative group`}
                        style={{ width: `${phase.percent}%` }}
                      >
                        <span className="text-[10px] sm:text-xs font-medium text-white truncate px-1">
                          {phase.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                    {timelinePhases.map((phase) => {
                      const phaseMonths = Math.max(0.5, Math.round((phase.percent / 100) * result.months * 2) / 2);
                      return (
                        <div key={phase.name} className={`${phase.bg} rounded-lg px-3 py-2 text-center`}>
                          <div className={`text-xs font-semibold ${phase.text}`}>{phase.name}</div>
                          <div className={`text-sm font-bold ${phase.text}`}>
                            {phaseMonths} {phaseMonths === 1 ? 'month' : 'months'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                    <FiBookOpen className="w-4 h-4" />
                    Tips for {result.category} Exams
                  </h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiCheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link
                  to="/resources"
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                >
                  Start Preparing <FiArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Popular Estimates */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
            Average Preparation Time for <span className="gradient-text">Popular Exams</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularEstimates.map((item) => (
              <div
                key={item.exam}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.exam}</h3>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <FiClock className="w-4 h-4 text-primary-500" />
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{item.range}</span>
                </div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadgeStyles[item.difficulty]}`}>
                  {item.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            * These estimates are indicative and based on general preparation patterns. Actual preparation time may vary
            based on individual learning speed, study methodology, coaching support, and other factors.
          </p>
        </div>
      </div>

      {/* Click-outside handler for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default PrepTimeEstimator;
