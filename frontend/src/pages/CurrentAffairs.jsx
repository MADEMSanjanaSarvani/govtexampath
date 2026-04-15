import React, { useState } from 'react';
import { FiSearch, FiCalendar, FiDownload, FiGlobe } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';

const currentAffairsData = [
  {
    id: 101, title: 'SSC CGL 2026 Notification Released: 15,000+ Vacancies Announced',
    category: 'National', date: '2026-04-12',
    content: 'The Staff Selection Commission has released the SSC CGL 2026 notification with over 15,000 vacancies across Group B and Group C posts. Online registration begins April 20, 2026 and the last date to apply is May 15, 2026. Tier-I CBT exam is scheduled for July 2026. Eligible candidates must hold a Bachelor\'s degree from a recognized university. Posts include Tax Assistant, Auditor, Sub-Inspector, and Inspector in various central government departments. The age limit is 18-32 years with relaxation for reserved categories.'
  },
  {
    id: 102, title: 'RBI Cuts Repo Rate to 5.75%: Impact on Banking Exams and Economy',
    category: 'Economy', date: '2026-04-10',
    content: 'The Reserve Bank of India\'s Monetary Policy Committee reduced the repo rate by 25 basis points to 5.75% in its April 2026 meeting, the third consecutive cut this year. The standing deposit facility rate now stands at 5.50% and the marginal standing facility rate at 6.00%. RBI Governor cited easing inflation at 3.8% and projected GDP growth at 6.8% for FY27. Banking exam aspirants should note the updated rates as RBI monetary policy is a frequently asked topic in IBPS, SBI, and RBI exams.'
  },
  {
    id: 103, title: 'UPSC CSE Prelims 2026: Exam Date Confirmed for June 1',
    category: 'National', date: '2026-04-08',
    content: 'UPSC has confirmed the Civil Services Preliminary Examination 2026 date as June 1, 2026. Admit cards will be available from May 15 on the official UPSC website. A total of 1,025 vacancies have been notified for IAS, IPS, IFS, and other services. The exam will follow the standard pattern: General Studies Paper I (200 marks) and CSAT Paper II (200 marks, qualifying). Candidates are advised to focus on revision and mock tests in the remaining time. UPSC has also announced that the interview process will be conducted from January 2027.'
  },
  {
    id: 104, title: 'India and EU Sign Free Trade Agreement After 16 Years of Negotiations',
    category: 'International', date: '2026-04-05',
    content: 'India and the European Union signed a comprehensive Free Trade Agreement (FTA) covering goods, services, and investment. The deal eliminates tariffs on 90% of goods traded between the two partners over the next 10 years. Key sectors benefiting include textiles, pharmaceuticals, IT services, and agriculture. The EU committed to invest €50 billion in Indian manufacturing under the Make in India initiative. This is India\'s largest trade deal and is expected to boost bilateral trade from $120 billion to $200 billion by 2030.'
  },
  {
    id: 105, title: 'ISRO\'s Gaganyaan Uncrewed Mission Scheduled for May 2026',
    category: 'Science', date: '2026-04-14',
    content: 'ISRO has announced that the second uncrewed Gaganyaan mission (G2) is scheduled for launch in May 2026 from Sriharikota. The mission will test the crew escape system, life support, and re-entry module in orbital conditions. The Vyommitra humanoid robot will simulate astronaut functions during the mission. The first crewed Gaganyaan mission is targeted for late 2026, which will make India the 4th country to independently send humans to space. ISRO Chairman confirmed that three astronaut candidates have completed training at the Gaganyaan Training Facility.'
  },
  {
    id: 106, title: 'IBPS PO 2026 Prelims Results Declared: Mains Exam in May',
    category: 'National', date: '2026-04-11',
    content: 'IBPS has declared the results of PO Prelims 2026 examination on its official website. Candidates who qualified can download their scorecards from ibps.in. The IBPS PO Mains examination is scheduled for May 18, 2026. A total of 4,500+ vacancies are available across 11 participating banks. The Mains exam will consist of Reasoning & Computer Aptitude, Data Analysis, General/Economy/Banking Awareness, and English Language sections. Interview calls will be issued in June 2026.'
  },
  {
    id: 107, title: 'India\'s UPI Crosses 20 Billion Monthly Transactions in March 2026',
    category: 'Economy', date: '2026-04-03',
    content: 'The Unified Payments Interface (UPI) recorded over 20 billion transactions worth Rs 24 lakh crore in March 2026, a new all-time high. NPCI data shows 45% year-on-year growth in transaction volume. UPI is now operational in 12 countries including Singapore, UAE, France, and Sri Lanka. The government plans to expand UPI to 25 countries by 2027. PhonePe leads with 47% market share followed by Google Pay at 34%. This topic is important for banking awareness sections in IBPS and SBI exams.'
  },
  {
    id: 108, title: 'Cabinet Approves 8th Pay Commission: Implementation from January 2027',
    category: 'National', date: '2026-04-01',
    content: 'The Union Cabinet has approved the constitution of the 8th Central Pay Commission, which will revise salaries and pensions of approximately 50 lakh central government employees and 65 lakh pensioners. The Commission will be headed by a retired Supreme Court judge and will submit recommendations by October 2026 for implementation from January 1, 2027. The expected fitment factor of 2.57x could raise the minimum basic pay from Rs 18,000 to Rs 46,260. This directly impacts salary structures of posts filled through SSC, UPSC, and Banking exams.'
  },
  {
    id: 109, title: 'Asian Games 2026 Nagoya: India Targets 120+ Medals',
    category: 'Sports', date: '2026-04-09',
    content: 'The 20th Asian Games will be held in Nagoya, Japan from September 19 to October 4, 2026. India aims to surpass its Hangzhou 2022 record of 107 medals. The Indian Olympic Association has announced a 650-member contingent across 40 sports. Key medal hopes include athletics, shooting, wrestling, boxing, and badminton. The government has allocated Rs 500 crore under the TOPS scheme for athlete preparation. Important for general knowledge sections in all competitive exams.'
  },
  {
    id: 110, title: 'Supreme Court Upholds Reservation in Promotions for SC/ST Employees',
    category: 'National', date: '2026-04-07',
    content: 'The Supreme Court of India, in a landmark 5-judge Constitution Bench ruling, upheld the validity of reservation in promotions for SC/ST employees in government services. The court held that Article 16(4A) provides adequate constitutional basis for the policy. The ruling clarified that states must demonstrate backwardness through quantifiable data and ensure the "creamy layer" concept applies. This judgment is significant for polity and governance sections in UPSC, State PSC, and other competitive exams.'
  },
  {
    id: 111, title: 'Railway Budget 2026-27: 500 New Vande Bharat Routes Announced',
    category: 'National', date: '2026-04-02',
    content: 'The Railway Ministry announced plans to launch 500 new Vande Bharat Express routes by March 2027 as part of the Amrit Bharat Station Scheme. Capital expenditure for railways increased to Rs 3.2 lakh crore. 10 lakh new jobs to be created in railway infrastructure projects. The Bullet Train project between Mumbai and Ahmedabad is 65% complete with commercial operations expected by 2028. Candidates appearing for RRB NTPC and Group D exams should note these developments.'
  },
  {
    id: 112, title: 'India Becomes World\'s 4th Largest Economy, Overtakes Japan',
    category: 'Economy', date: '2026-04-13',
    content: 'India has officially overtaken Japan to become the world\'s 4th largest economy by nominal GDP at $4.2 trillion. The IMF confirmed the ranking in its April 2026 World Economic Outlook. India is now behind only the US ($28.5T), China ($19.8T), and Germany ($4.5T). India\'s GDP per capita stands at $2,900. The government targets becoming the 3rd largest economy by 2028. Key growth drivers include services sector (55% of GDP), manufacturing expansion, and digital economy growth.'
  },
  // Older articles
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
    id: 5, title: 'RBI Monetary Policy: Repo Rate Cut After 4 Years',
    category: 'Economy', date: '2025-02-07',
    content: 'The Reserve Bank of India\'s Monetary Policy Committee (MPC) reduced the repo rate by 25 basis points to 6.25%, the first cut since May 2020. The standing deposit facility rate adjusted to 6%, and the marginal standing facility rate to 6.50%. GDP growth projected at 6.7% for FY26. CPI inflation forecast at 4.2%.'
  },
  {
    id: 6, title: 'Chandrayaan-4 Mission: ISRO Announces Moon Sample Return Plan',
    category: 'Science', date: '2025-01-25',
    content: 'ISRO announced the Chandrayaan-4 mission plan to collect and return lunar soil samples to Earth by 2028. The mission will involve two launches using LVM-3 and PSLV rockets. This will make India the 4th country to achieve lunar sample return after US, Russia, and China. Budget allocation of Rs 2,104 crore approved.'
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
      <SEO title="Current Affairs" path="/current-affairs" description="Daily current affairs for government exam preparation. National, international, economy, science, and sports updates for UPSC, SSC, Banking, and Railways exams." />
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
