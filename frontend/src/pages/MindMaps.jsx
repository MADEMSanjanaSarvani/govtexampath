import React, { useState } from 'react';
import { FiChevronRight, FiChevronDown, FiBookOpen } from 'react-icons/fi';
import SEO from '../components/common/SEO';

const syllabusData = [
  {
    category: 'UPSC Civil Services',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    exams: [
      {
        name: 'Prelims - General Studies I',
        topics: [
          { name: 'Indian History', subtopics: ['Ancient India', 'Medieval India', 'Modern India - Freedom Struggle', 'Art & Culture', 'Post-Independence India'] },
          { name: 'Geography', subtopics: ['Physical Geography', 'Indian Geography', 'World Geography', 'Climate & Weather', 'Environmental Geography'] },
          { name: 'Indian Polity', subtopics: ['Constitution', 'Parliament & State Legislatures', 'Judiciary', 'Panchayati Raj & Municipalities', 'Constitutional Bodies', 'Fundamental Rights & Duties'] },
          { name: 'Economics', subtopics: ['Indian Economy', 'Planning & Budget', 'Banking & Finance', 'International Trade', 'Economic Reforms', 'Agriculture'] },
          { name: 'Science & Technology', subtopics: ['Physics Basics', 'Chemistry Basics', 'Biology', 'Space & Defence Technology', 'IT & Computers', 'Biotechnology'] },
          { name: 'Environment & Ecology', subtopics: ['Biodiversity', 'Climate Change', 'Environmental Laws', 'Pollution', 'International Environmental Treaties'] },
          { name: 'Current Affairs', subtopics: ['National Events', 'International Relations', 'Awards & Honours', 'Government Schemes', 'Summits & Conferences'] },
        ]
      },
      {
        name: 'Prelims - CSAT (Paper II)',
        topics: [
          { name: 'Comprehension', subtopics: ['Reading Comprehension', 'Passage Analysis', 'Inference Drawing'] },
          { name: 'Logical Reasoning', subtopics: ['Syllogism', 'Blood Relations', 'Coding-Decoding', 'Seating Arrangement', 'Direction Test'] },
          { name: 'Mathematics', subtopics: ['Number System', 'Percentage', 'Ratio & Proportion', 'Profit & Loss', 'Time & Work', 'Data Interpretation'] },
          { name: 'Decision Making', subtopics: ['Administrative Decision Making', 'Ethical Dilemmas', 'Problem Solving'] },
        ]
      },
    ]
  },
  {
    category: 'SSC',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    exams: [
      {
        name: 'SSC CGL - Tier I',
        topics: [
          { name: 'Quantitative Aptitude', subtopics: ['Number System', 'Algebra', 'Geometry & Mensuration', 'Trigonometry', 'Statistics', 'Data Interpretation', 'Profit & Loss', 'Time Speed Distance'] },
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Cloze Test', 'Error Detection', 'Sentence Improvement', 'Synonyms & Antonyms', 'Idioms & Phrases', 'One Word Substitution'] },
          { name: 'General Intelligence & Reasoning', subtopics: ['Analogy', 'Classification', 'Series', 'Coding-Decoding', 'Matrix', 'Word Formation', 'Venn Diagram', 'Blood Relations'] },
          { name: 'General Awareness', subtopics: ['History', 'Geography', 'Polity', 'Economics', 'Science', 'Current Affairs', 'Static GK'] },
        ]
      },
      {
        name: 'SSC CHSL',
        topics: [
          { name: 'English Language', subtopics: ['Spot the Error', 'Fill in the Blanks', 'Synonyms/Antonyms', 'Spelling Check', 'Comprehension', 'Active/Passive Voice'] },
          { name: 'Quantitative Aptitude', subtopics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics'] },
          { name: 'General Intelligence', subtopics: ['Analogies', 'Classification', 'Coding-Decoding', 'Puzzle', 'Matrix', 'Non-Verbal Reasoning'] },
          { name: 'General Awareness', subtopics: ['Current Events', 'Sports', 'History', 'Culture', 'Geography', 'Economics', 'Polity', 'Science'] },
        ]
      },
    ]
  },
  {
    category: 'Banking',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    exams: [
      {
        name: 'IBPS PO - Prelims',
        topics: [
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Cloze Test', 'Para Jumbles', 'Error Spotting', 'Fill in the Blanks', 'Sentence Rearrangement'] },
          { name: 'Quantitative Aptitude', subtopics: ['Simplification', 'Number Series', 'Data Interpretation', 'Quadratic Equations', 'Arithmetic Problems', 'Data Sufficiency'] },
          { name: 'Reasoning Ability', subtopics: ['Puzzles & Seating Arrangement', 'Syllogism', 'Inequality', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Order & Ranking'] },
        ]
      },
      {
        name: 'IBPS PO - Mains',
        topics: [
          { name: 'General/Economy/Banking Awareness', subtopics: ['Banking Terms', 'RBI Policies', 'Financial Awareness', 'Budget & Economy', 'Government Schemes', 'International Organizations'] },
          { name: 'Data Analysis & Interpretation', subtopics: ['Bar Graph', 'Pie Chart', 'Line Graph', 'Tabular DI', 'Caselet DI', 'Missing DI'] },
          { name: 'Reasoning & Computer Aptitude', subtopics: ['Puzzles', 'Machine Input-Output', 'Logical Reasoning', 'Data Sufficiency', 'Computer Fundamentals'] },
        ]
      },
    ]
  },
  {
    category: 'Railways',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    exams: [
      {
        name: 'RRB NTPC CBT-1',
        topics: [
          { name: 'Mathematics', subtopics: ['Number System', 'BODMAS', 'Decimals & Fractions', 'LCM & HCF', 'Ratio & Proportion', 'Percentage', 'Mensuration', 'Time & Work', 'Simple & Compound Interest', 'Profit & Loss', 'Elementary Algebra', 'Geometry', 'Trigonometry', 'Elementary Statistics'] },
          { name: 'General Intelligence & Reasoning', subtopics: ['Analogies', 'Alphabetical & Number Series', 'Coding-Decoding', 'Mathematical Operations', 'Relationships', 'Syllogism', 'Jumbling', 'Venn Diagrams', 'Data Interpretation', 'Statement-Conclusion', 'Decision Making'] },
          { name: 'General Awareness', subtopics: ['Current Events', 'History of India', 'Indian Polity', 'Indian Geography', 'Indian Economy', 'Physics', 'Chemistry', 'Life Science', 'Computer Basics', 'Sports', 'Inventions', 'United Nations'] },
        ]
      },
    ]
  },
  {
    category: 'Defence',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    exams: [
      {
        name: 'NDA Written Exam',
        topics: [
          { name: 'Mathematics', subtopics: ['Algebra', 'Matrices & Determinants', 'Trigonometry', 'Analytical Geometry (2D & 3D)', 'Differential Calculus', 'Integral Calculus', 'Vector Algebra', 'Statistics & Probability'] },
          { name: 'General Ability Test', subtopics: ['English', 'Physics', 'Chemistry', 'General Science', 'History', 'Geography', 'Current Events'] },
        ]
      },
      {
        name: 'CDS Exam',
        topics: [
          { name: 'English', subtopics: ['Comprehension', 'Grammar', 'Vocabulary', 'Sentence Correction', 'Ordering of Words'] },
          { name: 'General Knowledge', subtopics: ['History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Current Affairs', 'Defence Related Topics'] },
          { name: 'Elementary Mathematics', subtopics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry', 'Mensuration', 'Statistics'] },
        ]
      },
    ]
  },
];

const TreeNode = ({ name, children, level = 0, color, isLast = false }) => {
  const [expanded, setExpanded] = useState(level < 2);

  const hasChildren = children && children.length > 0;
  const paddingLeft = level * 16;

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg text-left transition-all duration-200 group ${
          hasChildren ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer' : 'cursor-default'
        }`}
        style={{ marginLeft: `${paddingLeft}px` }}
      >
        {hasChildren ? (
          expanded ? <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <FiChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color || 'from-blue-400 to-blue-500'} flex-shrink-0`} />
        )}
        <span className={`text-sm ${level === 0 ? 'font-bold text-gray-900 dark:text-gray-100' : level === 1 ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
          {name}
        </span>
        {hasChildren && (
          <span className="text-xs text-gray-400 ml-auto">{children.length}</span>
        )}
      </button>
      {expanded && hasChildren && (
        <div className={`${level < 1 ? 'ml-2 border-l-2 border-gray-100 dark:border-gray-700' : ''}`}>
          {children.map((child, idx) => (
            <TreeNode
              key={idx}
              name={child.name || child}
              children={child.subtopics || child.topics}
              level={level + 1}
              color={color}
              isLast={idx === children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MindMaps = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = selectedCategory
    ? syllabusData.filter(d => d.category === selectedCategory)
    : syllabusData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Syllabus Mind Maps" path="/mind-maps" description="Interactive syllabus mind maps for UPSC, SSC, Banking, Railways, and Defence exams. Visual topic breakdowns to plan your government exam preparation." />
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
          <FiBookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Syllabus <span className="gradient-text">Mind Maps</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Interactive syllabus breakdowns for all major government exams</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 justify-center flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!selectedCategory ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
        >
          All Categories
        </button>
        {syllabusData.map(d => (
          <button
            key={d.category}
            onClick={() => setSelectedCategory(d.category)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === d.category ? `bg-gradient-to-r ${d.color} text-white shadow-lg` : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
          >
            {d.category}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search topics..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Trees */}
      <div className="space-y-6">
        {filteredData.map((category) => (
          <div key={category.category} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 ${category.borderColor} overflow-hidden`}>
            <div className={`p-4 ${category.bgColor}`}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                {category.category}
              </h2>
            </div>
            <div className="p-4">
              {category.exams.map((exam, idx) => (
                <div key={idx} className={idx > 0 ? 'mt-4 pt-4 border-t border-gray-100 dark:border-gray-700' : ''}>
                  <TreeNode
                    name={exam.name}
                    children={exam.topics}
                    level={0}
                    color={category.color}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MindMaps;
