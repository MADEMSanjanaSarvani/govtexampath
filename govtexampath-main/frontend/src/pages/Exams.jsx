import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import Pagination from '../components/common/Pagination';
import { getExams } from '../services/examService';

const allCategories = [
  'All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC',
  'Teaching', 'Police', 'Insurance', 'GATE', 'APPSC', 'TSPSC', 'Other',
];

const categoryColors = {
  All: 'from-gray-500 to-gray-600',
  UPSC: 'from-purple-500 to-indigo-600',
  SSC: 'from-blue-500 to-cyan-600',
  Banking: 'from-green-500 to-emerald-600',
  Railways: 'from-red-500 to-rose-600',
  Defence: 'from-amber-500 to-orange-600',
  'State PSC': 'from-orange-500 to-red-600',
  Teaching: 'from-pink-500 to-rose-600',
  Police: 'from-indigo-500 to-blue-600',
  Insurance: 'from-teal-500 to-cyan-600',
  GATE: 'from-violet-500 to-purple-600',
  APPSC: 'from-emerald-500 to-teal-600',
  TSPSC: 'from-sky-500 to-blue-600',
  Other: 'from-slate-500 to-gray-600',
};

const Exams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 9 };
      if (search) params.search = search;
      if (category) params.category = category;
      const data = await getExams(params);
      setExams(data.exams || data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 9) || 1);
    } catch {
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, category]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
      const params = {};
      if (searchInput) params.search = searchInput;
      if (category) params.category = category;
      setSearchParams(params);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, category, setSearchParams]);

  const handleCategoryChange = (cat) => {
    const newCat = cat === 'All' ? '' : cat;
    setCategory(newCat);
    setCurrentPage(1);
    const params = {};
    if (search) params.search = search;
    if (newCat) params.category = newCat;
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Browse <span className="gradient-text">Exams</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Find government exam notifications that match your career goals</p>
      </div>

      {/* Search bar */}
      <div className="relative w-full max-w-2xl mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search exams by title, category, conducting body..."
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
        {allCategories.map((cat) => {
          const isSelected = (cat === 'All' && !category) || category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isSelected
                  ? `bg-gradient-to-r ${categoryColors[cat]} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <ExamList exams={exams} loading={loading} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Exams;
