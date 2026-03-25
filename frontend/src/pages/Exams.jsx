import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import CategoryFilter from '../components/common/CategoryFilter';
import ExamList from '../components/exams/ExamList';
import Pagination from '../components/common/Pagination';
import { getExams } from '../services/examService';

const Exams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
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

  const handleSearch = useCallback((query) => {
    setSearch(query);
    setCurrentPage(1);
    const params = {};
    if (query) params.search = query;
    if (category) params.category = category;
    setSearchParams(params);
  }, [category, setSearchParams]);

  const handleCategoryChange = useCallback((cat) => {
    setCategory(cat);
    setCurrentPage(1);
    const params = {};
    if (search) params.search = search;
    if (cat) params.category = cat;
    setSearchParams(params);
  }, [search, setSearchParams]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Browse Exams</h1>
        <p className="text-gray-500 dark:text-gray-400">Find government exam notifications that match your goals</p>
      </div>

      <div className="space-y-4 mb-8">
        <SearchBar onSearch={handleSearch} placeholder="Search exams by title, category..." />
        <CategoryFilter selectedCategory={category} onCategoryChange={handleCategoryChange} />
      </div>

      <ExamList exams={exams} loading={loading} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Exams;
