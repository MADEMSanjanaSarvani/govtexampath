import React from 'react';

const categories = [
  'All', 'SSC', 'UPSC', 'Banking', 'Railways', 'State PSC',
  'GATE', 'APPSC', 'TSPSC', 'Defence', 'Teaching', 'Other',
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            (cat === 'All' && !selectedCategory) || selectedCategory === cat
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
