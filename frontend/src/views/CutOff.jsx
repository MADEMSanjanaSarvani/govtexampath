import React, { useState, useMemo } from 'react';
import { Link } from '@/lib/router';
import { FiSearch, FiExternalLink, FiTrendingUp, FiX, FiChevronDown, FiBarChart2 } from 'react-icons/fi';
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

const getApproxCutOff = (category) => {
  switch (category) {
    case 'SSC':
      return [
        { cat: 'General', range: '180 - 200' },
        { cat: 'OBC', range: '170 - 185' },
        { cat: 'SC', range: '155 - 165' },
        { cat: 'ST', range: '140 - 150' },
        { cat: 'EWS', range: '170 - 185' },
      ];
    case 'Banking':
    case 'Insurance':
      return [
        { cat: 'General', range: '60 - 80' },
        { cat: 'OBC', range: '55 - 75' },
        { cat: 'SC', range: '45 - 65' },
        { cat: 'ST', range: '40 - 60' },
        { cat: 'EWS', range: '55 - 75' },
      ];
    case 'UPSC':
      return [
        { cat: 'General', range: '95 - 105' },
        { cat: 'OBC', range: '90 - 100' },
        { cat: 'SC', range: '80 - 90' },
        { cat: 'ST', range: '75 - 85' },
        { cat: 'EWS', range: '88 - 98' },
      ];
    case 'Railways':
      return [
        { cat: 'General', range: '70 - 85' },
        { cat: 'OBC', range: '65 - 78' },
        { cat: 'SC', range: '55 - 65' },
        { cat: 'ST', range: '48 - 58' },
        { cat: 'EWS', range: '65 - 78' },
      ];
    case 'Defence':
      return [
        { cat: 'General', range: '80 - 95' },
        { cat: 'OBC', range: '72 - 88' },
        { cat: 'SC', range: '60 - 75' },
        { cat: 'ST', range: '55 - 68' },
        { cat: 'EWS', range: '72 - 88' },
      ];
    case 'State PSC':
      return [
        { cat: 'General', range: '85 - 100' },
        { cat: 'OBC', range: '78 - 92' },
        { cat: 'SC', range: '68 - 80' },
        { cat: 'ST', range: '60 - 72' },
        { cat: 'EWS', range: '78 - 92' },
      ];
    case 'Teaching':
      return [
        { cat: 'General', range: '90 - 100' },
        { cat: 'OBC', range: '82 - 95' },
        { cat: 'SC', range: '75 - 85' },
        { cat: 'ST', range: '70 - 80' },
        { cat: 'EWS', range: '82 - 95' },
      ];
    case 'Police':
      return [
        { cat: 'General', range: '75 - 90' },
        { cat: 'OBC', range: '68 - 82' },
        { cat: 'SC', range: '58 - 70' },
        { cat: 'ST', range: '52 - 65' },
        { cat: 'EWS', range: '68 - 82' },
      ];
    case 'Judiciary':
      return [
        { cat: 'General', range: '55 - 65%' },
        { cat: 'OBC', range: '50 - 60%' },
        { cat: 'SC', range: '45 - 55%' },
        { cat: 'ST', range: '40 - 50%' },
        { cat: 'EWS', range: '50 - 60%' },
      ];
    case 'PSU':
      return [
        { cat: 'General', range: '65 - 80' },
        { cat: 'OBC', range: '60 - 75' },
        { cat: 'SC', range: '50 - 65' },
        { cat: 'ST', range: '45 - 58' },
        { cat: 'EWS', range: '60 - 75' },
      ];
    case 'Regulatory Bodies':
      return [
        { cat: 'General', range: '70 - 85' },
        { cat: 'OBC', range: '65 - 80' },
        { cat: 'SC', range: '55 - 70' },
        { cat: 'ST', range: '50 - 65' },
        { cat: 'EWS', range: '65 - 80' },
      ];
    case 'Healthcare':
      return [
        { cat: 'General', range: '50 - 65%' },
        { cat: 'OBC', range: '45 - 60%' },
        { cat: 'SC', range: '40 - 55%' },
        { cat: 'ST', range: '35 - 50%' },
        { cat: 'EWS', range: '45 - 60%' },
      ];
    case 'Postal':
      return [
        { cat: 'General', range: '70 - 82' },
        { cat: 'OBC', range: '62 - 75' },
        { cat: 'SC', range: '55 - 68' },
        { cat: 'ST', range: '48 - 60' },
        { cat: 'EWS', range: '62 - 75' },
      ];
    case 'Agriculture':
      return [
        { cat: 'General', range: '65 - 78' },
        { cat: 'OBC', range: '58 - 72' },
        { cat: 'SC', range: '50 - 65' },
        { cat: 'ST', range: '45 - 58' },
        { cat: 'EWS', range: '58 - 72' },
      ];
    case 'Miscellaneous':
      return [
        { cat: 'General', range: '68 - 82' },
        { cat: 'OBC', range: '62 - 76' },
        { cat: 'SC', range: '52 - 66' },
        { cat: 'ST', range: '46 - 60' },
        { cat: 'EWS', range: '62 - 76' },
      ];
    default:
      return [
        { cat: 'General', range: '70 - 85' },
        { cat: 'OBC', range: '62 - 78' },
        { cat: 'SC', range: '52 - 68' },
        { cat: 'ST', range: '45 - 60' },
        { cat: 'EWS', range: '62 - 78' },
      ];
  }
};

const CutOff = () => {
  const { t } = useLanguage();
  const { exams: examsData } = useExamsData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const allExams = useMemo(() => {
    return examsData.filter(e => e.isActive);
  }, [examsData]);

  const filteredExams = useMemo(() => {
    let exams = allExams.filter((exam) => exam.isActive !== false);

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

    exams.sort((a, b) => a.title.localeCompare(b.title));
    return exams;
  }, [search, category, allExams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Cut-Off Marks - Previous Year & Expected Cut-Offs for Govt Exams"
        path="/cut-off"
        description="Check previous year and expected cut-off marks for government exams including UPSC, SSC, Banking, Railways, Defence, and State PSC. Category-wise cut-off data for General, OBC, SC, ST, and EWS candidates."
        breadcrumbs={[{ name: 'Cut-Off Marks' }]}
      />
      <Breadcrumb items={[{ label: 'Cut-Off Marks' }]} />

      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
          <FiBarChart2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('cutOffTitle')} <span className="gradient-text">{new Date().getFullYear()}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('cutOffDesc')}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 flex gap-3">
        <FiTrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t('cutOffDisclaimer')}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchCutOff')}
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
          <FiBarChart2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noExamsMatchSearch')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredExams.map((exam) => {
            const dbCutoffs = exam.cutoffs && exam.cutoffs.length > 0
              ? exam.cutoffs.map(c => ({ cat: c.category, range: c.marks }))
              : null;
            const cutOffs = dbCutoffs || getApproxCutOff(exam.category);
            return (
              <div
                key={exam._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover flex flex-col"
              >
                <div className="p-5 flex-1 flex flex-col">
                  {/* Category badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {exam.category}
                    </span>
                  </div>

                  {/* Exam Name */}
                  <Link
                    to={`/exams/${exam._id}`}
                    className="font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-1 line-clamp-2"
                  >
                    {exam.title}
                  </Link>

                  {/* Conducting Body */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {exam.conductingBody}
                  </p>

                  {/* Cut-Off Table */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Category</th>
                          <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{t('previousYearCutOff')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cutOffs.map((row, idx) => (
                          <tr key={row.cat} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-750/30'}>
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{row.cat}</td>
                            <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-gray-100">{row.range}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    <Link
                      to={`/exams/${exam._id}`}
                      className="flex-1 text-center px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                    >
                      {t('viewDetails')}
                    </Link>
                    <a
                      href={exam.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                      {t('officialCutOff')}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Educational Content Section */}
      <section className="mt-16 mb-12 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            Understanding Cut-Off Marks in Government Exams
          </h2>

          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
            <p>
              Cut-off marks represent the minimum score a candidate must obtain to qualify for the next stage of a government examination or to be considered for final selection. Every competitive exam conducted by agencies such as UPSC, SSC, IBPS, RRB, and State Public Service Commissions publishes cut-off scores after results are declared. These scores serve as the benchmark that separates selected candidates from those who did not make the grade.
            </p>
            <p>
              The determination of cut-off marks is not arbitrary. Examining bodies consider several factors before arriving at the final numbers. The overall difficulty level of the question paper plays a significant role: a tougher paper generally leads to lower cut-offs, while an easier paper pushes them higher. The total number of vacancies advertised is equally important because fewer vacancies mean stiffer competition and higher cut-offs. The number of candidates who appeared for the examination also matters, since a larger pool of test-takers typically increases the qualifying threshold. Category-based reservation under the Indian Constitution ensures that separate, and usually lower, cut-offs are set for reserved categories such as OBC, SC, ST, EWS, and PwBD candidates.
            </p>
            <p>
              Additionally, the normalization process adopted by agencies like SSC, where exams are held in multiple shifts, adjusts raw scores to account for variations in difficulty across different shifts. Previous year trends, the ratio of applicants to vacancies, and even changes in exam patterns can influence cut-offs from one cycle to the next. Understanding these dynamics is essential for any aspirant who wants to set realistic targets and build a focused preparation strategy.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              Types of Cut-Off Marks
            </h3>
            <p>
              Government examinations typically involve multiple stages, and each stage has its own qualifying cut-off. Understanding the distinction between these types helps candidates plan how much effort to devote at every phase of the selection process.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Preliminary Cut-Off:</strong> The preliminary examination is the first screening round in most multi-tier exams such as UPSC CSE, SSC CGL, and IBPS PO. Its sole purpose is to shortlist candidates for the next stage. The prelims cut-off is generally the lowest among all stages because the exam is designed to filter out a large portion of applicants. For instance, UPSC CSE Prelims 2024 had a General category cut-off of around 98 marks out of 200. Candidates who clear this threshold advance to the Mains examination. In many exams, prelims marks are not counted in the final merit, which means this stage is purely qualifying in nature.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Mains Cut-Off:</strong> The Mains examination tests candidates in greater depth and carries significant weight in the overall selection. Mains cut-offs tend to be higher relative to the total marks because the candidate pool has already been filtered through prelims. In SSC CGL, for example, the Tier II Mains cut-off for General category candidates has historically ranged between 300 and 340 out of 500, depending on the year and difficulty. This stage demands a more thorough understanding of subjects and better analytical abilities.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Final Cut-Off:</strong> The final cut-off is the overall score threshold used to prepare the merit list for appointment. It often combines marks from multiple stages. In UPSC CSE, the final cut-off includes Mains written marks plus the Interview or Personality Test score. In SSC CGL, it aggregates Tier I and Tier II scores. The final cut-off is the most competitive of all because it determines actual selection. In recent years, the difference between the last selected candidate and the next in queue has sometimes been as narrow as 0.25 marks.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Category-Wise Cut-Off:</strong> India's reservation policy mandates separate cut-offs for different social categories. General (UR) candidates face the highest cut-off. OBC (Non-Creamy Layer) candidates typically have cut-offs that are 5 to 15 marks lower than General. SC and ST categories enjoy further relaxation, which can be 15 to 30 marks lower than the General cut-off. The EWS (Economically Weaker Sections) category, introduced in 2019, usually has cut-offs close to the OBC threshold. PwBD (Persons with Benchmark Disabilities) candidates receive the most relaxation, with cut-offs that can be significantly lower across all categories.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              Cut-Off Trends: What They Tell You
            </h3>
            <p>
              Analyzing cut-off trends over multiple years is one of the most effective ways to gauge the competitiveness of an exam and set realistic score targets. A year-over-year comparison reveals patterns that can inform your preparation strategy in meaningful ways.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Rising cut-offs</strong> indicate increasing competition. This can happen when the number of applicants grows significantly, the number of vacancies decreases, or the exam becomes easier, enabling more candidates to score well. For example, SSC CGL Tier I cut-offs have shown an upward trend in recent years due to the growing awareness and popularity of SSC examinations. When you observe rising cut-offs, it signals the need to aim well above the expected threshold rather than targeting just the minimum qualifying score.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Falling cut-offs</strong> can result from a tougher paper, a sudden increase in vacancies, or changes in the exam pattern that catch aspirants off guard. The introduction of a new section or a shift from descriptive to objective-type questions can temporarily depress cut-offs. For instance, when SSC introduced Computer-Based Testing, many candidates unfamiliar with the format scored lower, leading to a temporary dip in cut-offs.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Stable cut-offs</strong> over three to five years suggest that the exam has reached a maturity point where difficulty, vacancies, and candidate preparation levels are relatively balanced. In such cases, you can use the average of the last three years as a reliable target score. For practical purposes, aim 10 to 15 percent above the average cut-off to build a safety margin.
            </p>
            <p>
              Tracking post-wise cut-offs is equally important. In SSC CGL, the cut-off for a Tax Assistant post is significantly different from that of an Inspector (CBDT). Similarly, in IBPS PO, state-wise cut-offs can vary dramatically: a cut-off of 65 in one state might be 80 in another due to regional variations in applicant density.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              How to Score Above the Cut-Off
            </h3>
            <p>
              Clearing the cut-off is the first and most critical milestone in any competitive exam. Here are proven strategies that toppers and subject experts recommend to help you not just meet but comfortably exceed the qualifying threshold.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">1. Prioritize Accuracy Over Speed:</strong> Most government exams carry negative marking, typically 0.25 marks deducted for every wrong answer in a 2-mark question, or one-third of assigned marks. Random guessing can cause significant damage to your score. A deliberate approach where you attempt only questions you are reasonably confident about will yield a higher net score than recklessly attempting every question. In SSC exams, candidates who attempt 85 to 90 percent of questions with 90 percent or higher accuracy consistently clear the cut-off, while those who attempt everything with 70 percent accuracy often fall short.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">2. Eliminate Weak Areas Systematically:</strong> Identify the subjects or topics where you consistently lose marks through diagnostic tests. If Quantitative Aptitude is your weak area, devote extra study hours to it rather than spending more time on subjects you are already strong in. The marginal improvement from turning a weakness into a moderate strength is far greater than improving an already strong area. Use topic-wise previous year questions to identify exactly which subtopics (such as Geometry, Permutations and Combinations, or Data Interpretation) need the most attention.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">3. Practice Previous Year Papers Extensively:</strong> There is no substitute for solving previous year question papers under timed conditions. This practice familiarizes you with the actual difficulty level, question patterns, and the distribution of topics across sections. Aim to solve at least 10 to 15 previous year papers for any major exam. Analyze each paper after attempting it: note which questions you got wrong, which you skipped, and where you spent too much time. Many questions in government exams are repeated or closely modeled on previous papers.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">4. Master Time Management Across Sections:</strong> In exams like SSC CGL Tier II or IBPS PO Prelims, each section has a separate time limit. Allocate your time strategically. Start with the section you are strongest in to build confidence and secure easy marks. For sections without individual time limits, practice with a personal time allocation plan. For example, in a 60-minute paper with 100 questions, spending more than 45 seconds on a single question is usually counterproductive.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">5. Focus on High-Yield Topics:</strong> Every exam has certain topics that carry disproportionately high weight. In SSC exams, topics like Trigonometry, Algebra, Reading Comprehension, and Static GK form a substantial portion of the paper. In Banking exams, Data Interpretation, Simplification, and Puzzles are among the highest-scoring areas. Analyzing previous year papers will reveal these high-yield topics. Mastering them ensures you can secure a significant chunk of marks before even touching the more unpredictable questions.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">6. Take Regular Mock Tests and Analyze Performance:</strong> Join a reputable test series and take at least two full-length mock tests per week during your final preparation phase. After each mock, spend at least as much time analyzing the results as you spent taking the test. Track your section-wise scores, accuracy percentages, and the number of questions attempted across mocks. Look for improvement trends and course-correct if scores plateau. Many candidates who clear government exams report that consistent mock test practice in the last two to three months was the single biggest factor in their success.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              Category-Wise Cut-Off Explained
            </h3>
            <p>
              India's reservation system, enshrined in the Constitution, directly impacts cut-off marks for government examinations. The system aims to ensure equitable representation of historically disadvantaged communities in public employment and education. Here is how it works in practice and what it means for candidates in different categories.
            </p>
            <p>
              The <strong className="text-gray-900 dark:text-gray-100">General (Unreserved) category</strong> faces the highest cut-off in every exam because candidates in this group compete for unreserved seats without any relaxation. In SSC CGL 2023 Tier I, the General category cut-off was approximately 191 marks out of 400, reflecting the intense competition among the largest applicant pool.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">OBC (Non-Creamy Layer)</strong> candidates receive a moderate relaxation. In SSC CGL 2023, the OBC cut-off was around 176 marks, roughly 15 marks lower than General. This category has 27 percent reservation in central government jobs. Candidates must possess a valid Non-Creamy Layer certificate issued within the specified validity period.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">SC (Scheduled Caste)</strong> candidates benefit from 15 percent reservation, and their cut-offs are typically 20 to 35 marks lower than General. In SSC CGL 2023, the SC cut-off was approximately 161 marks. UPSC CSE Prelims 2024 had an SC cut-off of around 74.66 marks compared to the General cut-off of about 98 marks, illustrating the significant relaxation provided.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">ST (Scheduled Tribe)</strong> candidates have 7.5 percent reservation and receive the deepest relaxation among the traditional reservation categories. In SSC CGL 2023, the ST cut-off was roughly 143 marks, nearly 48 marks below the General threshold. This wider gap reflects the policy intent to ensure representation from tribal communities that may have limited access to educational resources.
            </p>
            <p>
              The <strong className="text-gray-900 dark:text-gray-100">EWS (Economically Weaker Sections)</strong> category was introduced through the 103rd Constitutional Amendment in 2019, providing 10 percent reservation for economically disadvantaged candidates from unreserved categories. EWS cut-offs are generally close to or slightly below OBC cut-offs. In SSC CGL 2023, the EWS cut-off was approximately 175 marks.
            </p>
            <p>
              It is important to note that reserved category candidates who score above the General cut-off are counted against the unreserved quota, not their reserved quota. This means that the actual cut-off for reserved categories can sometimes be effectively higher than officially published when high-performing reserved category candidates fill unreserved seats. Understanding your category cut-off accurately helps you set the right target score and avoid either overconfidence or unnecessary anxiety during preparation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CutOff;
