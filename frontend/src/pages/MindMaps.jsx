import React, { useState } from 'react';
import { FiBookOpen, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import SEO from '../components/common/SEO';

const syllabusData = [
  {
    category: 'UPSC Civil Services',
    color: 'from-purple-500 to-indigo-600',
    nodeColor: '#7c3aed',
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
      {
        name: 'Mains - General Studies',
        topics: [
          { name: 'GS Paper I', subtopics: ['Indian Heritage & Culture', 'World History', 'Society & Social Issues', 'Physical Geography', 'Resource Distribution'] },
          { name: 'GS Paper II', subtopics: ['Governance & Constitution', 'Social Justice', 'International Relations', 'Indian Foreign Policy'] },
          { name: 'GS Paper III', subtopics: ['Indian Economy & Development', 'Science & Technology', 'Environment & Biodiversity', 'Disaster Management', 'Internal Security'] },
          { name: 'GS Paper IV (Ethics)', subtopics: ['Ethics & Human Interface', 'Attitude', 'Emotional Intelligence', 'Public Administration Ethics', 'Case Studies'] },
          { name: 'Essay Paper', subtopics: ['Philosophical Topics', 'Socio-Economic Topics', 'Political Topics', 'Abstract Topics'] },
        ]
      },
    ]
  },
  {
    category: 'SSC',
    color: 'from-blue-500 to-cyan-600',
    nodeColor: '#3b82f6',
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
        name: 'SSC CGL - Tier II',
        topics: [
          { name: 'Quantitative Aptitude (Advanced)', subtopics: ['Advanced Algebra', 'Coordinate Geometry', 'Trigonometric Identities', 'Data Sufficiency', 'Probability'] },
          { name: 'English Language (Advanced)', subtopics: ['Para Jumbles', 'Error Correction', 'Vocab in Context', 'Narrative Writing', 'Letter/Application Writing'] },
          { name: 'Statistics', subtopics: ['Collection of Data', 'Frequency Distribution', 'Measures of Central Tendency', 'Correlation & Regression', 'Probability Theory', 'Index Numbers'] },
          { name: 'General Studies (Finance & Economics)', subtopics: ['Accounting Fundamentals', 'Auditing', 'Income Tax', 'Economics & Governance', 'Commerce'] },
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
    nodeColor: '#22c55e',
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
      {
        name: 'SBI PO',
        topics: [
          { name: 'English Language', subtopics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Para Jumbles', 'Error Detection'] },
          { name: 'Data Analysis', subtopics: ['Number Series', 'Data Interpretation', 'Quadratic Equations', 'Quantity Comparison'] },
          { name: 'Reasoning', subtopics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Blood Relations', 'Coding-Decoding'] },
          { name: 'General Awareness', subtopics: ['Banking Awareness', 'Current Affairs', 'Economy', 'Financial Markets'] },
        ]
      },
    ]
  },
  {
    category: 'Railways',
    color: 'from-red-500 to-rose-600',
    nodeColor: '#ef4444',
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
      {
        name: 'RRB Group D',
        topics: [
          { name: 'Mathematics', subtopics: ['Number System', 'BODMAS', 'Decimals', 'Fractions', 'Ratio & Proportion', 'Percentage', 'Mensuration', 'Time & Work', 'Profit & Loss', 'Simple Interest', 'Algebra', 'Geometry'] },
          { name: 'General Intelligence', subtopics: ['Analogies', 'Classification', 'Series', 'Coding-Decoding', 'Syllogism', 'Venn Diagrams', 'Blood Relations'] },
          { name: 'General Science', subtopics: ['Physics (10th level)', 'Chemistry (10th level)', 'Life Science (10th level)'] },
          { name: 'General Awareness', subtopics: ['Current Affairs', 'Culture', 'Sports', 'Personalities', 'Economics', 'Polity'] },
        ]
      },
    ]
  },
  {
    category: 'Defence',
    color: 'from-amber-500 to-orange-600',
    nodeColor: '#f59e0b',
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
      {
        name: 'AFCAT',
        topics: [
          { name: 'General Awareness', subtopics: ['History', 'Geography', 'Polity', 'Sports', 'Science', 'Defence & Current Affairs'] },
          { name: 'Verbal Ability', subtopics: ['Comprehension', 'Error Detection', 'Sentence Completion', 'Synonyms & Antonyms', 'Idioms'] },
          { name: 'Numerical Ability', subtopics: ['Decimal & Fractions', 'Ratio & Proportion', 'Percentage', 'Average', 'Profit & Loss', 'Simple & Compound Interest'] },
          { name: 'Reasoning & Military Aptitude', subtopics: ['Spatial Reasoning', 'Verbal & Non-Verbal', 'Series', 'Analogy', 'Classification'] },
        ]
      },
    ]
  },
  {
    category: 'Teaching',
    color: 'from-teal-500 to-cyan-600',
    nodeColor: '#14b8a6',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    borderColor: 'border-teal-200 dark:border-teal-800',
    exams: [
      {
        name: 'CTET Paper I (Class 1-5)',
        topics: [
          { name: 'Child Development & Pedagogy', subtopics: ['Growth & Development', 'Piaget & Vygotsky', 'Learning Theories', 'Inclusive Education', 'Assessment & Evaluation'] },
          { name: 'Mathematics', subtopics: ['Number System', 'Geometry', 'Measurement', 'Data Handling', 'Pedagogy of Mathematics'] },
          { name: 'Environmental Studies', subtopics: ['Family & Friends', 'Food & Shelter', 'Water & Travel', 'Nature & Environment', 'Pedagogy of EVS'] },
          { name: 'Language I & II', subtopics: ['Comprehension', 'Grammar', 'Language Pedagogy', 'Teaching Strategies'] },
        ]
      },
      {
        name: 'UGC NET',
        topics: [
          { name: 'Paper I (General)', subtopics: ['Teaching Aptitude', 'Research Aptitude', 'Comprehension', 'Communication', 'Reasoning', 'Data Interpretation', 'ICT', 'Higher Education System', 'Governance & Polity', 'People & Environment'] },
          { name: 'Paper II (Subject)', subtopics: ['Subject-Specific Core Topics', 'Research Methodology', 'Advanced Concepts', 'Applied Knowledge'] },
        ]
      },
    ]
  },
  {
    category: 'State PSC',
    color: 'from-rose-500 to-pink-600',
    nodeColor: '#f43f5e',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    borderColor: 'border-rose-200 dark:border-rose-800',
    exams: [
      {
        name: 'General State PSC Pattern',
        topics: [
          { name: 'General Studies', subtopics: ['Indian History & Culture', 'Indian & World Geography', 'Indian Polity & Governance', 'Indian Economy', 'General Science', 'Current Affairs'] },
          { name: 'State-Specific GK', subtopics: ['State History & Culture', 'State Geography', 'State Economy & Welfare', 'State Governance', 'Local Current Affairs', 'Famous Personalities'] },
          { name: 'Aptitude & Reasoning', subtopics: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'English/Hindi Language'] },
          { name: 'Optional Subject', subtopics: ['Subject chosen by candidate', 'In-depth paper', 'Applied knowledge'] },
        ]
      },
    ]
  },
];

const FlowNode = ({ label, color, nodeColor, children, level = 0, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = children && children.length > 0;

  const nodeStyles = {
    0: 'px-5 py-3 text-base font-bold rounded-xl shadow-lg',
    1: 'px-4 py-2.5 text-sm font-semibold rounded-lg shadow-md',
    2: 'px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm',
  };

  const nodeColorStyles = {
    0: `bg-gradient-to-r ${color} text-white`,
    1: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-2',
    2: 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border',
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`relative flex items-center gap-2 transition-all duration-300 ${nodeStyles[level] || nodeStyles[2]} ${nodeColorStyles[level] || nodeColorStyles[2]} ${
          hasChildren ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'cursor-default'
        }`}
        style={level === 1 ? { borderColor: nodeColor } : level === 2 ? { borderColor: `${nodeColor}40` } : {}}
      >
        {level === 1 && (
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: nodeColor }} />
        )}
        <span>{label}</span>
        {hasChildren && (
          <span className="ml-1 opacity-70">
            {expanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
          </span>
        )}
        {hasChildren && !expanded && (
          <span className={`text-xs opacity-60 ml-1 ${level === 0 ? 'bg-white/20 px-1.5 py-0.5 rounded-full' : ''}`}>
            {children.length}
          </span>
        )}
      </button>

      {/* Connector line down from node */}
      {hasChildren && expanded && (
        <>
          <div className="w-0.5 h-6" style={{ background: `${nodeColor}60` }} />

          {/* Horizontal connector + children */}
          <div className="relative flex items-start">
            {/* Horizontal line across all children */}
            {children.length > 1 && (
              <div
                className="absolute top-0 h-0.5"
                style={{
                  background: `${nodeColor}40`,
                  left: `${100 / (children.length * 2)}%`,
                  right: `${100 / (children.length * 2)}%`,
                }}
              />
            )}

            <div className={`flex ${level === 0 ? 'flex-wrap justify-center gap-x-3 gap-y-6 max-w-6xl' : 'flex-wrap justify-center gap-x-2 gap-y-4'}`}>
              {children.map((child, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Vertical connector up to horizontal line */}
                  <div className="w-0.5 h-4" style={{ background: `${nodeColor}40` }} />

                  {typeof child === 'string' ? (
                    <div
                      className="px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border transition-all hover:scale-105 hover:shadow-md"
                      style={{ borderColor: `${nodeColor}30` }}
                    >
                      {child}
                    </div>
                  ) : (
                    <FlowNode
                      label={child.name}
                      color={color}
                      nodeColor={nodeColor}
                      level={level + 1}
                      defaultExpanded={false}
                    >
                      {child.subtopics || child.topics}
                    </FlowNode>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MindMaps = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredData = selectedCategory
    ? syllabusData.filter(d => d.category === selectedCategory)
    : syllabusData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Syllabus Mind Maps" path="/mind-maps" description="Interactive syllabus mind maps for UPSC, SSC, Banking, Railways, Defence, Teaching, and State PSC exams. Visual flow-chart style topic breakdowns to plan your government exam preparation." />

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
          <FiBookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Syllabus <span className="gradient-text">Mind Maps</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Interactive flow-chart breakdowns for all major government exams</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click on any node to expand or collapse its topics</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 justify-center flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!selectedCategory ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}
        >
          All Categories
        </button>
        {syllabusData.map(d => (
          <button
            key={d.category}
            onClick={() => setSelectedCategory(d.category)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === d.category ? `bg-gradient-to-r ${d.color} text-white shadow-lg` : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}
          >
            {d.category}
          </button>
        ))}
      </div>

      {/* Flow Graph Mind Maps */}
      <div className="space-y-8">
        {filteredData.map((category) => (
          <div key={category.category} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 ${category.borderColor} overflow-hidden`}>
            {/* Category header */}
            <div className={`p-4 ${category.bgColor} border-b ${category.borderColor}`}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                {category.category}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  {category.exams.length} {category.exams.length === 1 ? 'exam' : 'exams'}
                </span>
              </h2>
            </div>

            {/* Flow graphs for each exam */}
            <div className="p-6 space-y-10 overflow-x-auto">
              {category.exams.map((exam, idx) => (
                <div key={idx} className={`${idx > 0 ? 'pt-8 border-t border-gray-100 dark:border-gray-700' : ''}`}>
                  <div className="flex justify-center min-w-fit">
                    <FlowNode
                      label={exam.name}
                      color={category.color}
                      nodeColor={category.nodeColor}
                      level={0}
                      defaultExpanded={true}
                    >
                      {exam.topics}
                    </FlowNode>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info section for SEO & AdSense content value */}
      <div className="mt-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">How to Use Syllabus Mind Maps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">1. Choose Your Exam</h3>
            <p>Select a category from the filter buttons above to focus on your target exam. We cover UPSC, SSC, Banking, Railways, Defence, Teaching, and State PSC syllabi.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">2. Explore Topics</h3>
            <p>Click on any topic node to expand and see its subtopics. Each branch shows the complete breakdown of what you need to study for that section.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Plan Your Preparation</h3>
            <p>Use the visual overview to identify areas you're strong in and topics that need more attention. Start with high-weightage subjects first for maximum impact.</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Why Visual Syllabus Maps Help</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Government exam syllabi can be overwhelming with hundreds of topics across multiple subjects. Our interactive flow-chart mind maps break down the entire syllabus into a visual hierarchy, making it easier to understand the scope of each exam. Research shows that visual learning aids improve retention by up to 65% compared to reading plain text. Use these maps alongside your study materials to track your preparation progress across all subjects and subtopics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MindMaps;
