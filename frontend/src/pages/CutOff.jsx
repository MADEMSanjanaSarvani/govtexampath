import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiExternalLink, FiTrendingUp, FiX, FiChevronDown, FiBarChart2 } from 'react-icons/fi';
import { examsData } from '../data/examsData';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

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
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

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

    exams.sort((a, b) => a.title.localeCompare(b.title));
    return exams;
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Cut-Off Marks - Previous Year & Expected Cut-Offs for Govt Exams"
        path="/cut-off"
        description="Check previous year and expected cut-off marks for government exams including UPSC, SSC, Banking, Railways, Defence, and State PSC. Category-wise cut-off data for General, OBC, SC, ST, and EWS candidates."
      />
      <Breadcrumb items={[{ label: 'Cut-Off Marks' }]} />

      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
          <FiBarChart2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Cut-Off <span className="gradient-text">Marks</span> 2026
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Browse previous year and expected cut-off marks for all major government exams.
          Understand category-wise qualifying scores to plan your preparation effectively.
        </p>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 flex gap-3">
        <FiTrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Cut-off marks are based on previous year data and may vary. Check official websites for latest cut-offs.
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
          <FiBarChart2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No exams found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredExams.map((exam) => {
            const cutOffs = getApproxCutOff(exam.category);
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
                          <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Previous Year Cut-Off (Approx.)</th>
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
                      View Details
                    </Link>
                    <a
                      href={exam.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                      Official Cut-Off
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CutOff;
