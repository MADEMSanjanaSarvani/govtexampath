import React, { useState } from 'react';
import { FiSearch, FiCalendar, FiDownload, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';

const currentAffairsData = [
  {
    id: 1, title: 'Union Budget 2025-26: Key Highlights for Government Exam Aspirants',
    category: 'Economy', date: '2025-02-01',
    content: 'Finance Minister presented the Union Budget with focus on infrastructure development, digital economy, and employment generation. The fiscal deficit target set at 4.4% of GDP. New tax slabs under the new regime: No tax up to Rs 12 lakh. Capital expenditure allocation increased to Rs 11.21 lakh crore. PM Gati Shakti extended with Rs 75,000 crore allocation for road infrastructure.'
  },
  {
    id: 2, title: 'India Successfully Tests Agni-5 Missile with MIRV Technology',
    category: 'National', date: '2025-01-15',
    content: 'India conducted a successful test of the Agni-5 ballistic missile equipped with Multiple Independently Targetable Re-entry Vehicle (MIRV) technology under Mission Divyastra. This makes India the 6th country to develop MIRV capability, joining the US, Russia, UK, France, and China. Range of Agni-5 is over 5,000 km.'
  },
  {
    id: 3, title: 'Digital India Programme: 100 Crore Aadhaar Authentications Monthly',
    category: 'National', date: '2025-01-20',
    content: 'The Digital India initiative has achieved a milestone with over 100 crore Aadhaar authentications per month. The UIDAI reported that Aadhaar has enabled direct benefit transfers of over Rs 34 lakh crore to beneficiaries. The programme has helped eliminate ghost beneficiaries and reduced leakage in government subsidy distribution.'
  },
  {
    id: 4, title: 'India-EFTA Trade Agreement: $100 Billion Investment Commitment',
    category: 'International', date: '2025-01-10',
    content: 'India signed the Trade and Economic Partnership Agreement (TEPA) with the European Free Trade Association (EFTA) comprising Iceland, Liechtenstein, Norway, and Switzerland. EFTA committed to invest $100 billion in India over 15 years. This is India\'s first free trade agreement with European countries.'
  },
  {
    id: 5, title: 'RBI Monetary Policy: Repo Rate Cut After 4 Years',
    category: 'Economy', date: '2025-02-07',
    content: 'The Reserve Bank of India\'s Monetary Policy Committee (MPC) reduced the repo rate by 25 basis points to 6.25%, the first cut since May 2020. The standing deposit facility rate adjusted to 6%, and the marginal standing facility rate to 6.50%. GDP growth projected at 6.7% for FY26. CPI inflation forecast at 4.2%.'
  },
  {
    id: 6, title: 'Chandrayaan-4 Mission: ISRO Announces Moon Sample Return Plan',
    category: 'Science', date: '2025-01-25',
    content: 'ISRO announced the Chandrayaan-4 mission plan to collect and return lunar soil samples to Earth by 2028. The mission will involve two launches using LVM-3 and PSLV rockets. This will make India the 4th country to achieve lunar sample return after US, Russia, and China. Budget allocation of Rs 2,104 crore approved.'
  },
  {
    id: 7, title: 'India Elected as Non-Permanent Member of UN Security Council 2028-29',
    category: 'International', date: '2025-02-15',
    content: 'India was elected as a non-permanent member of the United Nations Security Council for the 2028-29 term with overwhelming support. India received 184 votes out of 193 in the General Assembly. This will be India\'s 9th term on the UNSC. India continues to push for permanent membership and UNSC reforms.'
  },
  {
    id: 8, title: 'National Education Policy: Implementation of 4-Year UG Programme',
    category: 'National', date: '2025-01-05',
    content: 'Over 300 universities across India have implemented the 4-year undergraduate programme under the National Education Policy 2020. Multiple entry and exit options now available. Academic Bank of Credits (ABC) has registered over 3 crore students. The new curriculum includes multidisciplinary approach with skill-based courses.'
  },
  {
    id: 9, title: 'Paris Olympics 2024 Recap: India\'s Best Medal Tally',
    category: 'Sports', date: '2025-01-12',
    content: 'India achieved its best-ever Olympic medal tally at Paris 2024 with 6 medals including 1 gold, 2 silver, and 3 bronze. Neeraj Chopra clinched silver in javelin throw. Manu Bhaker made history with 2 bronze medals in shooting. Indian hockey team won bronze medal. Total of 117 athletes represented India across 16 sports.'
  },
  {
    id: 10, title: 'PM Vishwakarma Yojana: 50 Lakh Artisans Enrolled',
    category: 'National', date: '2025-02-10',
    content: 'The PM Vishwakarma Yojana has enrolled over 50 lakh traditional artisans and craftspeople across 18 trades. The scheme provides up to Rs 3 lakh collateral-free credit at 5% interest rate, modern toolkit, digital payment training, and brand promotion. Weavers, blacksmiths, potters, carpenters, and goldsmiths are among the major beneficiaries.'
  },
  {
    id: 11, title: 'India\'s GDP Growth: World Bank Projects 6.5% for FY26',
    category: 'Economy', date: '2025-01-28',
    content: 'The World Bank has projected India\'s GDP growth at 6.5% for FY2025-26, making it the fastest-growing major economy. Key drivers include strong domestic consumption, government capital expenditure, and digital transformation. Manufacturing sector showed robust growth of 8.2%. Services sector contributed 55% to GDP.'
  },
  {
    id: 12, title: 'ISRO Launches NVS-02 Navigation Satellite Successfully',
    category: 'Science', date: '2025-01-30',
    content: 'ISRO successfully launched the NVS-02 satellite aboard GSLV Mark II rocket from Sriharikota. This satellite is part of the Navigation with Indian Constellation (NavIC) system, India\'s indigenous GPS alternative. NVS-02 carries L1, L5, and S-band navigation payloads. NavIC provides positioning accuracy of better than 5 meters over India.'
  },
];

const categoryList = ['All', 'National', 'International', 'Economy', 'Science', 'Sports'];

const categoryBadgeColors = {
  National: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  International: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Economy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Science: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Sports: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const CurrentAffairs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const handleWeeklyPdfDownload = () => {
    try {
      // Generate a text-based PDF-like summary of current affairs
      const header = 'GovtExamPath - Weekly Current Affairs Digest\n' +
        '='.repeat(50) + '\n' +
        `Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}\n` +
        '='.repeat(50) + '\n\n';

      const body = currentAffairsData.map((item, idx) => {
        return `${idx + 1}. [${item.category}] ${item.title}\n` +
          `   Date: ${new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n` +
          `   ${item.content}\n`;
      }).join('\n');

      const footer = '\n' + '='.repeat(50) +
        '\nPrepared by GovtExamPath - India\'s Free Career Guidance Platform' +
        '\nVisit: govtexampath.com for more resources\n';

      const content = header + body + footer;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GovtExamPath-CurrentAffairs-Weekly-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Weekly Current Affairs downloaded!');
    } catch (err) {
      console.error('[GovtExamPath] PDF download error:', err);
      toast.error('Download failed. Please try again.');
    }
  };

  const filtered = currentAffairsData.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
          <FiGlobe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Current <span className="gradient-text">Affairs</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Stay updated with the latest events relevant to government exams</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search current affairs..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category pills & download */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex gap-2 overflow-x-auto">
          {categoryList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={handleWeeklyPdfDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <FiDownload className="w-4 h-4" /> Weekly PDF
        </button>
      </div>

      {/* News cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiGlobe className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No current affairs found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover"
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${categoryBadgeColors[item.category]}`}>
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiCalendar className="w-3 h-3" /> {formatDate(item.date)}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    {expandedId !== item.id && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{item.content}</p>
                    )}
                  </div>
                </div>

                {expandedId === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-gray-400">Important for:</span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">UPSC</span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">SSC</span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">Banking</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentAffairs;
