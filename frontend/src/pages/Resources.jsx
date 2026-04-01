import React, { useState } from 'react';
import { FiSearch, FiDownload, FiBook, FiFileText, FiBookOpen, FiExternalLink } from 'react-icons/fi';

const resourcesData = [
  { id: 1, title: 'UPSC Prelims General Studies Complete Notes', type: 'Notes', exam: 'UPSC', category: 'UPSC', description: 'Comprehensive notes covering all topics for UPSC Prelims GS Paper I including History, Geography, Polity, Economics, Environment, and Science.', pages: '450+ pages' },
  { id: 2, title: 'UPSC Previous Year Questions (2015-2024)', type: 'PYQ', exam: 'UPSC CSE', category: 'UPSC', description: 'Complete collection of UPSC Civil Services Prelims questions with detailed solutions and topic-wise analysis for the last 10 years.', pages: '300+ questions' },
  { id: 3, title: 'Indian Polity by M. Laxmikanth - Key Points', type: 'Notes', exam: 'UPSC / State PSC', category: 'UPSC', description: 'Chapter-wise summary notes from the most important book for Indian Polity preparation. Covers Constitution, governance, and political system.', pages: '120 pages' },
  { id: 4, title: 'SSC CGL Tier I Complete Study Material', type: 'Notes', exam: 'SSC CGL', category: 'SSC', description: 'All-in-one study material covering Quantitative Aptitude, English, Reasoning, and General Awareness for SSC CGL Tier I.', pages: '500+ pages' },
  { id: 5, title: 'SSC CGL Previous Year Papers (2019-2024)', type: 'PYQ', exam: 'SSC CGL', category: 'SSC', description: 'Shift-wise previous year question papers with answer keys and detailed solutions. Includes all shifts from recent years.', pages: '200+ papers' },
  { id: 6, title: 'Quantitative Aptitude for Competitive Exams', type: 'Books', exam: 'SSC / Banking', category: 'SSC', description: 'RS Aggarwal style quantitative aptitude guide with shortcuts, tricks, and 5000+ practice problems covering all topics.', pages: '600+ pages' },
  { id: 7, title: 'IBPS PO Prelims + Mains Complete Guide', type: 'Notes', exam: 'IBPS PO', category: 'Banking', description: 'Detailed preparation guide for IBPS PO covering all three sections - English, Quant, and Reasoning with banking awareness.', pages: '350 pages' },
  { id: 8, title: 'Banking Awareness Complete Capsule 2024', type: 'Notes', exam: 'Banking Exams', category: 'Banking', description: 'Everything you need for banking awareness - RBI policies, banking terms, financial news, government schemes, and economic surveys.', pages: '150 pages' },
  { id: 9, title: 'IBPS/SBI PO Previous Year Papers Collection', type: 'PYQ', exam: 'IBPS PO / SBI PO', category: 'Banking', description: 'Last 8 years of IBPS PO and SBI PO prelims and mains papers with solutions. Memory-based and official papers included.', pages: '400+ questions' },
  { id: 10, title: 'RRB NTPC Complete Preparation Kit', type: 'Notes', exam: 'RRB NTPC', category: 'Railways', description: 'Full preparation material for RRB NTPC CBT-1 and CBT-2 covering Math, Reasoning, and General Awareness with railway-specific GK.', pages: '400 pages' },
  { id: 11, title: 'Railway Group D Previous Year Papers', type: 'PYQ', exam: 'Railway Group D', category: 'Railways', description: 'Complete collection of Railway Group D exam papers from 2018-2024 with phase-wise solutions and answer keys.', pages: '150+ papers' },
  { id: 12, title: 'NDA Exam Complete Preparation Guide', type: 'Notes', exam: 'NDA', category: 'Defence', description: 'Comprehensive guide for NDA written exam covering Mathematics and General Ability Test with SSB interview tips.', pages: '500 pages' },
  { id: 13, title: 'CDS Previous Year Papers with Solutions', type: 'PYQ', exam: 'CDS', category: 'Defence', description: 'Last 10 years CDS exam papers with detailed solutions for English, GK, and Mathematics sections.', pages: '250+ questions' },
  { id: 14, title: 'Best Books for Government Exams 2024-25', type: 'Books', exam: 'All Exams', category: 'UPSC', description: 'Curated list of must-read books for UPSC, SSC, Banking, and Railways with expert reviews and reading strategies.', pages: 'Book list' },
  { id: 15, title: 'English Grammar & Vocabulary Master Guide', type: 'Notes', exam: 'All Exams', category: 'SSC', description: 'Complete English grammar and vocabulary guide with rules, examples, and 2000+ practice questions for all competitive exams.', pages: '300 pages' },
  { id: 16, title: 'Logical Reasoning & Analytical Ability', type: 'Notes', exam: 'All Exams', category: 'SSC', description: 'Master guide for reasoning section covering verbal, non-verbal, and analytical reasoning with shortcut methods.', pages: '350 pages' },
  { id: 17, title: 'State PSC General Studies Notes', type: 'Notes', exam: 'State PSC', category: 'State PSC', description: 'General studies notes tailored for state PSC exams covering state-specific history, geography, and administration.', pages: '400 pages' },
  { id: 18, title: 'CTET Complete Study Material', type: 'Notes', exam: 'CTET', category: 'Teaching', description: 'Full preparation guide for CTET Paper I and Paper II covering Child Development, Pedagogy, and subject-specific topics.', pages: '350 pages' },
];

const categories = ['All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC', 'Teaching'];
const types = ['All', 'Notes', 'PYQ', 'Books'];

const typeBadgeColors = {
  Notes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PYQ: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Books: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = resourcesData.filter(r => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchType = selectedType === 'All' || r.type === selectedType;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.exam.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
          <FiBook className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Study <span className="gradient-text">Resources</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Free study notes, previous year papers, and book recommendations for all exams</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by title, exam, or keyword..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 justify-center flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 justify-center mb-8">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === type ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            {type === 'All' ? 'All Types' : type}
          </button>
        ))}
      </div>

      {/* Resources grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiFileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No resources found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(resource => (
            <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 card-hover group">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeBadgeColors[resource.type]}`}>
                  {resource.type}
                </span>
                <span className="text-xs text-gray-400">{resource.pages}</span>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {resource.title}
              </h3>

              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2">{resource.exam}</p>

              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{resource.description}</p>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20">
                <FiDownload className="w-4 h-4" /> Download Free
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
