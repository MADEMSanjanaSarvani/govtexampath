import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiAward, FiAlertTriangle, FiFilter, FiChevronRight, FiUsers, FiBriefcase, FiDollarSign, FiStar } from 'react-icons/fi';
import SEO from '../components/common/SEO';

const examPriorityData = [
  // Sweet Spot — lower competition, good vacancies
  { name: 'RBI Grade B', category: 'Banking', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '300+', applicants: '50,000', ratio: '167:1', salary: '₹77,208+', tip: 'Hidden gem — one of the best risk-reward exams in India. Tough syllabus filters out casual applicants.' },
  { name: 'NABARD Grade A', category: 'Banking', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '150+', applicants: '30,000', ratio: '200:1', salary: '₹44,500+', tip: 'Rural banking focus with great perks. Competition is much lower than mainstream bank PO exams.' },
  { name: 'SEBI Grade A', category: 'Regulatory', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '100+', applicants: '25,000', ratio: '250:1', salary: '₹44,500+', tip: 'Elite regulator post. Small batch means high quality peers and rapid career growth.' },
  { name: 'ECGC PO', category: 'Insurance', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '75+', applicants: '15,000', ratio: '200:1', salary: '₹36,000+', tip: 'Most aspirants don\'t even know this exam exists. Excellent salary for relatively easy preparation.' },
  { name: 'FCI Manager', category: 'PSU', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '500+', applicants: '80,000', ratio: '160:1', salary: '₹40,000+', tip: 'Central government perks with manageable competition. Perfect for those who missed banking exams.' },
  { name: 'NDA', category: 'Defence', qualification: '12th', quadrant: 'sweet-spot', vacancies: '400+', applicants: '50,000', ratio: '125:1', salary: '₹56,100+', tip: 'Best route into Armed Forces after 12th. Physical fitness requirement filters many applicants.' },
  { name: 'State PSC', category: 'State PSC', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '500-2,000', applicants: '1-3 lakh', ratio: '150-300:1', salary: '₹36,000-56,000', tip: 'State-level IAS equivalent. Far less competition than UPSC with similar job satisfaction.' },
  { name: 'APPSC Group 1', category: 'State PSC', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '300+', applicants: '60,000', ratio: '200:1', salary: '₹49,870-1,58,970', tip: 'Andhra Pradesh\'s top civil services exam. Far easier than UPSC CSE with state-level postings in AP — ideal for Telugu-speaking aspirants.' },
  { name: 'TSPSC Group 1', category: 'State PSC', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '200+', applicants: '50,000', ratio: '250:1', salary: '₹49,870-1,58,970', tip: 'Telangana\'s premier civil services exam. Excellent career in state administration with postings across Telangana districts.' },
  { name: 'AFCAT', category: 'Defence', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '300+', applicants: '40,000', ratio: '133:1', salary: '₹56,100+', tip: 'Air Force entry for graduates. SSB interview filters ensure quality over quantity.' },
  { name: 'UPSC CAPF AC', category: 'UPSC', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '250+', applicants: '50,000', ratio: '200:1', salary: '₹56,100+', tip: 'Central Armed Police Forces officer post. Easier than CSE but similar prestige in uniformed services.' },
  { name: 'CDS', category: 'Defence', qualification: 'graduation', quadrant: 'sweet-spot', vacancies: '450+', applicants: '50,000', ratio: '111:1', salary: '₹56,100+', tip: 'Graduate route to Army, Navy, Air Force. SSB stage removes majority — written exam is accessible.' },

  // Worth the Effort — high vacancies, manageable competition
  { name: 'SSC CGL', category: 'SSC', qualification: 'graduation', quadrant: 'worth-effort', vacancies: '15,000+', applicants: '30+ lakh', ratio: '200:1', salary: '₹25,500-1,51,100', tip: 'The gold standard for graduate-level exams. Massive vacancies make it worth every hour of prep.' },
  { name: 'RRB NTPC', category: 'Railways', qualification: 'graduation', quadrant: 'worth-effort', vacancies: '11,000+', applicants: '1.2 crore', ratio: '1,000:1', salary: '₹19,900-35,400', tip: 'Huge applicant pool but also huge vacancies. Syllabus overlaps with SSC — prepare both simultaneously.' },
  { name: 'RRB Group D', category: 'Railways', qualification: '10th', quadrant: 'worth-effort', vacancies: '1,03,000+', applicants: '1.5 crore', ratio: '145:1', salary: '₹18,000+', tip: 'Largest government recruitment in India. Over 1 lakh posts means even average preparation can succeed.' },
  { name: 'IBPS PO', category: 'Banking', qualification: 'graduation', quadrant: 'worth-effort', vacancies: '4,000+', applicants: '10+ lakh', ratio: '250:1', salary: '₹44,900+', tip: 'Banking sector\'s premier exam. CWE score valid for 11 public sector banks — one exam, many chances.' },
  { name: 'CRPF ASI/SI', category: 'Police', qualification: 'graduation', quadrant: 'worth-effort', vacancies: '2,000+', applicants: '3 lakh', ratio: '150:1', salary: '₹29,200+', tip: 'Paramilitary force with excellent perks. Physical test requirement significantly reduces actual competition.' },
  { name: 'SSC CPO', category: 'SSC', qualification: 'graduation', quadrant: 'worth-effort', vacancies: '4,000+', applicants: '15+ lakh', ratio: '375:1', salary: '₹35,400+', tip: 'Delhi Police & CAPF Sub-Inspector. Uniform job with SSC-level syllabus — great overlap with CGL prep.' },
  { name: 'IBPS Clerk', category: 'Banking', qualification: 'graduation', quadrant: 'worth-effort', vacancies: '5,000+', applicants: '15+ lakh', ratio: '300:1', salary: '₹19,900+', tip: 'Stepping stone into banking. Many PO toppers started as Clerks — internal promotion path is solid.' },
  { name: 'CTET', category: 'Teaching', qualification: 'graduation', quadrant: 'worth-effort', vacancies: 'Eligibility test', applicants: '20+ lakh', ratio: 'N/A', salary: '₹35,400+', tip: 'Gateway to KVS, NVS, state teaching jobs. Qualify once, apply to hundreds of teaching vacancies.' },
  { name: 'APPSC Group 2', category: 'State PSC', qualification: 'graduation', quadrant: 'worth-effort', vacancies: '500+', applicants: '1.5 lakh', ratio: '300:1', salary: '₹37,100-91,450', tip: 'Deputy Tahsildar, Municipal Commissioner level posts in AP. Good stepping stone — many Group 2 officers later crack Group 1.' },
  { name: 'TSPSC Group 2', category: 'State PSC', qualification: 'graduation', quadrant: 'worth-effort', vacancies: '400+', applicants: '1.2 lakh', ratio: '300:1', salary: '₹37,100-91,450', tip: 'Mid-level Telangana state services. Solid career with manageable preparation timeline of 6-8 months alongside Group 1.' },
  { name: 'TSPSC Group 4', category: 'State PSC', qualification: '10th', quadrant: 'worth-effort', vacancies: '5,000+', applicants: '5 lakh', ratio: '100:1', salary: '₹16,400-49,870', tip: 'Largest Telangana state recruitment for 10th pass. Junior Assistant and clerical posts — excellent ratio of just 100:1.' },

  // High Stakes — fewer seats or tougher odds
  { name: 'SBI PO', category: 'Banking', qualification: 'graduation', quadrant: 'high-stakes', vacancies: '2,000+', applicants: '20+ lakh', ratio: '1,000:1', salary: '₹44,900+', tip: 'India\'s most prestigious banking exam. SBI brand carries weight — tough but incredibly rewarding.' },
  { name: 'SSC CHSL', category: 'SSC', qualification: '12th', quadrant: 'high-stakes', vacancies: '4,500+', applicants: '30+ lakh', ratio: '667:1', salary: '₹25,500+', tip: '12th pass gateway to central government. LDC, PA, DEO posts — good career growth within departments.' },
  { name: 'SSC MTS', category: 'SSC', qualification: '10th', quadrant: 'high-stakes', vacancies: '8,000+', applicants: '50+ lakh', ratio: '625:1', salary: '₹18,000+', tip: 'Easiest syllabus among SSC exams but the sheer number of applicants makes it competitive.' },
  { name: 'RBI Assistant', category: 'Banking', qualification: 'graduation', quadrant: 'high-stakes', vacancies: '450+', applicants: '8+ lakh', ratio: '1,778:1', salary: '₹36,091+', tip: 'RBI brand with great perks. Limited vacancies but the salary and job security make it worth trying.' },
  { name: 'SSC JE', category: 'SSC', qualification: 'graduation', quadrant: 'high-stakes', vacancies: '1,500+', applicants: '10+ lakh', ratio: '667:1', salary: '₹35,400+', tip: 'For engineering graduates only. Technical syllabus reduces competition from general graduates.' },
  { name: 'IBPS SO', category: 'Banking', qualification: 'graduation', quadrant: 'high-stakes', vacancies: '1,500+', applicants: '5+ lakh', ratio: '333:1', salary: '₹36,000+', tip: 'Specialist Officers in IT, Agriculture, HR, Marketing. Domain knowledge gives you an edge.' },
  { name: 'APPSC Group 3', category: 'State PSC', qualification: '12th', quadrant: 'high-stakes', vacancies: '2,000+', applicants: '3 lakh', ratio: '150:1', salary: '₹22,460-66,330', tip: 'Panchayat Secretary and other village-level posts in AP. Large applicant pool for 12th pass level but decent vacancies.' },
  { name: 'TSPSC Group 3', category: 'State PSC', qualification: '12th', quadrant: 'high-stakes', vacancies: '1,500+', applicants: '2.5 lakh', ratio: '167:1', salary: '₹22,460-66,330', tip: 'Telangana Panchayat Secretary posts. Competitive but the syllabus is manageable for 12th pass candidates.' },

  // Hardest Battle — brutal competition or very few seats
  { name: 'UPSC CSE', category: 'UPSC', qualification: 'graduation', quadrant: 'hardest', vacancies: '933', applicants: '13+ lakh', ratio: '1,394:1', salary: '₹56,100+', tip: 'The Mount Everest of Indian exams. 1-2 years of dedicated full-time preparation is the norm.' },
  { name: 'SSC GD Constable', category: 'SSC', qualification: '10th', quadrant: 'hardest', vacancies: '26,000+', applicants: '1+ crore', ratio: '385:1', salary: '₹21,700+', tip: 'Despite 26k+ vacancies, 1 crore applicants make this extremely tough. Physical fitness is the real filter.' },
  { name: 'SBI Clerk', category: 'Banking', qualification: 'graduation', quadrant: 'hardest', vacancies: '5,000+', applicants: '25+ lakh', ratio: '500:1', salary: '₹19,900+', tip: 'Don\'t be fooled by the "clerk" designation — the competition is fierce. State-wise cutoffs vary wildly.' },
  { name: 'UPSC NDA', category: 'UPSC', qualification: '12th', quadrant: 'hardest', vacancies: '400', applicants: '6+ lakh', ratio: '1,500:1', salary: '₹56,100+', tip: 'Written exam is manageable, but SSB interview has a 95% rejection rate. Focus heavily on SSB prep.' },
  { name: 'UGC NET', category: 'Teaching', qualification: 'post-graduation', quadrant: 'hardest', vacancies: 'Eligibility test', applicants: '12+ lakh', ratio: 'N/A', salary: '₹57,700+', tip: 'Assistant Professor eligibility. Only ~6% qualify. Master your subject — there\'s no shortcut here.' },
  { name: 'GATE (for PSU)', category: 'PSU', qualification: 'graduation', quadrant: 'hardest', vacancies: '1,000+', applicants: '10+ lakh', ratio: '1,000:1', salary: '₹40,000-60,000', tip: 'GATE score opens doors to ONGC, BHEL, NTPC, IOCL. Top 500 rank needed for premier PSUs.' },
];

const quadrants = {
  'sweet-spot': { label: 'Sweet Spot', subtitle: 'Lower competition, good vacancies', icon: FiTarget, color: 'emerald', bgClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', chipClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', headerBg: 'bg-gradient-to-r from-emerald-500 to-green-500' },
  'worth-effort': { label: 'Worth the Effort', subtitle: 'High vacancies, manageable competition', icon: FiTrendingUp, color: 'amber', bgClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', chipClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500' },
  'high-stakes': { label: 'High Stakes', subtitle: 'Fewer seats or tougher odds', icon: FiAward, color: 'blue', bgClass: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', chipClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  'hardest': { label: 'Hardest Battle', subtitle: 'Brutal competition or very few seats', icon: FiAlertTriangle, color: 'red', bgClass: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', chipClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', headerBg: 'bg-gradient-to-r from-red-500 to-rose-500' },
};

const qualFilters = [
  { key: 'all', label: 'All Levels' },
  { key: '10th', label: '10th Pass' },
  { key: '12th', label: '12th Pass' },
  { key: 'graduation', label: 'Graduation' },
  { key: 'post-graduation', label: 'Post Graduation' },
];

const ExamPriorityMatrix = () => {
  const [qualFilter, setQualFilter] = useState('all');
  const [selectedExam, setSelectedExam] = useState(null);

  const filtered = useMemo(() => {
    if (qualFilter === 'all') return examPriorityData;
    return examPriorityData.filter(e => e.qualification === qualFilter);
  }, [qualFilter]);

  const groupedByQuadrant = useMemo(() => {
    const groups = {};
    Object.keys(quadrants).forEach(q => { groups[q] = filtered.filter(e => e.quadrant === q); });
    return groups;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title="Exam Priority Matrix — Which Government Exam Should You Target? | GovtExamPath"
        description="Find the best government exam for you based on competition level, vacancies, and salary. Compare 30+ exams across 4 priority quadrants — from hidden gems to hardest battles."
      />

      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm mb-4">
              <FiTarget className="w-4 h-4" /> Smart Exam Selection
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
              Exam Priority Matrix
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Not all exams are equal. Some have 1 lakh vacancies, others have 100. Some get 1 crore applicants, others get 50,000. Find where the real opportunity lies.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* Qualification Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <FiFilter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filter by qualification:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {qualFilters.map(f => (
              <button
                key={f.key}
                onClick={() => { setQualFilter(f.key); setSelectedExam(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  qualFilter === f.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Exam Detail */}
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedExam.name}</h3>
                <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-semibold ${quadrants[selectedExam.quadrant].chipClass}`}>
                  {quadrants[selectedExam.quadrant].label}
                </span>
              </div>
              <button onClick={() => setSelectedExam(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                <FiBriefcase className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Vacancies</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.vacancies}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                <FiUsers className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Applicants</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.applicants}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                <FiTarget className="w-5 h-5 mx-auto text-red-500 mb-1" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Competition</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.ratio}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                <FiDollarSign className="w-5 h-5 mx-auto text-green-500 mb-1" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Starting Salary</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.salary}</p>
              </div>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <FiStar className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Our take:</strong> {selectedExam.tip}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quadrant Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {Object.entries(quadrants).map(([key, q]) => {
            const Icon = q.icon;
            const exams = groupedByQuadrant[key] || [];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border overflow-hidden ${q.bgClass}`}
              >
                <div className={`${q.headerBg} px-5 py-3 flex items-center gap-2`}>
                  <Icon className="w-5 h-5 text-white" />
                  <div>
                    <h2 className="font-bold text-white">{q.label}</h2>
                    <p className="text-xs text-white/70">{q.subtitle}</p>
                  </div>
                  <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{exams.length}</span>
                </div>
                <div className="p-4">
                  {exams.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No exams match this qualification level</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {exams.map(exam => (
                        <button
                          key={exam.name}
                          onClick={() => setSelectedExam(exam)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-pointer ${
                            selectedExam?.name === exam.name
                              ? 'ring-2 ring-offset-1 ring-indigo-500 ' + q.chipClass
                              : q.chipClass + ' hover:shadow-md'
                          }`}
                        >
                          {exam.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Competition Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Competition Landscape</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Applicants-per-seat ratio for major exams (lower is better)</p>
          <div className="space-y-3">
            {filtered
              .filter(e => e.ratio !== 'N/A' && !e.ratio.includes('-'))
              .sort((a, b) => {
                const parseRatio = (r) => parseInt(r.replace(/[,:]/g, '').split('1')[0].trim());
                return parseRatio(a.ratio) - parseRatio(b.ratio);
              })
              .slice(0, 15)
              .map(exam => {
                const ratio = parseInt(exam.ratio.replace(/[,:]/g, '').split('1')[0].trim());
                const maxRatio = 1500;
                const width = Math.min((ratio / maxRatio) * 100, 100);
                const q = quadrants[exam.quadrant];
                return (
                  <div key={exam.name} className="flex items-center gap-3 group cursor-pointer" onClick={() => setSelectedExam(exam)}>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-28 text-right truncate">{exam.name}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${q.headerBg} flex items-center justify-end pr-2`}
                      >
                        <span className="text-xs font-bold text-white whitespace-nowrap">{exam.ratio}</span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">Click any bar to see full details</p>
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">How to Read This Matrix</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20">
              <FiTarget className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Sweet Spot</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hidden gems most aspirants skip. Lower applicant counts, decent vacancies, great salary. Start here if you want the best odds.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20">
              <FiTrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-700 dark:text-amber-400">Worth the Effort</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mainstream exams with large vacancies. Competition is real but the sheer number of posts means consistent effort pays off.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20">
              <FiAward className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-400">High Stakes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prestigious exams with fewer seats or tough cutoffs. Worth attempting alongside safer options — don't put all eggs here.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20">
              <FiAlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-400">Hardest Battle</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Brutal competition ratios. Only attempt if you can commit 1-2 years of full-time preparation. Always keep backup exams ready.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Found your target exam? Check if you're eligible and start preparing.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/eligibility-checker" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
              Check Eligibility <FiChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/exams" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-all flex items-center gap-2">
              Browse All Exams <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPriorityMatrix;
