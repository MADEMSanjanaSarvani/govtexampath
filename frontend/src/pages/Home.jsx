import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiCpu, FiCheckSquare, FiMap, FiBook, FiGlobe, FiStar, FiBarChart2 } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import SEO from '../components/common/SEO';
import { examsData } from '../data/examsData';
import { getExams } from '../services/examService';
import { useLanguage } from '../context/LanguageContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={staggerContainer} className={className}>
      {children}
    </motion.div>
  );
};

const categories = [
  { name: 'UPSC', icon: '🏛️', count: '8+ Exams', gradient: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: 'SSC', icon: '📋', count: '10+ Exams', gradient: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Banking', icon: '🏦', count: '12+ Exams', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'Railways', icon: '🚂', count: '6+ Exams', gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  { name: 'Defence', icon: '🎖️', count: '8+ Exams', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { name: 'State PSC', icon: '🏢', count: '15+ Exams', gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Teaching', icon: '📚', count: '5+ Exams', gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { name: 'Police', icon: '👮', count: '4+ Exams', gradient: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { name: 'Insurance', icon: '🛡️', count: '3+ Exams', gradient: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { name: 'PSU', icon: '🏭', count: '10+ Exams', gradient: 'from-slate-500 to-gray-600', bg: 'bg-slate-50 dark:bg-slate-900/20' },
  { name: 'Regulatory Bodies', icon: '⚖️', count: '8+ Exams', gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { name: 'Judiciary', icon: '🏛️', count: '5+ Exams', gradient: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
];

const features = [
  { icon: FiCpu, title: 'Career Guide', desc: 'Personalized exam recommendations based on your profile', link: '/ai-guide', color: 'from-blue-500 to-indigo-600' },
  { icon: FiCheckSquare, title: 'Eligibility Checker', desc: 'Instantly find exams you qualify for', link: '/eligibility-checker', color: 'from-green-500 to-emerald-600' },
  { icon: FiMap, title: 'Syllabus Mind Maps', desc: 'Visual breakdowns for effective study planning', link: '/mind-maps', color: 'from-purple-500 to-pink-600' },
  { icon: FiBook, title: 'Free Resources', desc: '60+ study materials, papers & book lists', link: '/resources', color: 'from-orange-500 to-red-600' },
  { icon: FiGlobe, title: 'Current Affairs', desc: '150+ articles updated daily for all exams', link: '/current-affairs', color: 'from-teal-500 to-cyan-600' },
  { icon: FiBarChart2, title: 'Exam Priority Matrix', desc: 'Find hidden-gem exams with low competition', link: '/exam-priority', color: 'from-rose-500 to-pink-600' },
];

const heroWords = ['UPSC IAS', 'SSC CGL', 'Bank PO', 'Railways', 'Defence', 'State PSC'];

const quizQuestions = [
  { q: 'Who is the current Chief Justice of India (2026)?', options: ['Justice Sanjiv Khanna', 'Justice B.R. Gavai', 'Justice Surya Kant', 'Justice D.Y. Chandrachud'], answer: 0, topic: 'Polity' },
  { q: 'What is the repo rate set by RBI as of April 2026?', options: ['6.00%', '5.75%', '6.25%', '5.50%'], answer: 1, topic: 'Economy' },
  { q: 'India became the world\'s ___ largest economy in 2026.', options: ['3rd', '4th', '5th', '6th'], answer: 1, topic: 'Economy' },
  { q: 'Which organization conducts the SSC CGL exam?', options: ['UPSC', 'SSC', 'IBPS', 'RRB'], answer: 1, topic: 'General' },
  { q: 'What is the full form of NABARD?', options: ['National Bank for Agriculture and Rural Development', 'National Board for Agricultural Research and Development', 'National Bureau of Animal Resource Development', 'National Bank for Allied Rural Development'], answer: 0, topic: 'Banking' },
  { q: 'Which article deals with the Election Commission?', options: ['Article 280', 'Article 324', 'Article 356', 'Article 370'], answer: 1, topic: 'Polity' },
  { q: 'What is the minimum age for UPSC Civil Services?', options: ['18 years', '20 years', '21 years', '23 years'], answer: 2, topic: 'General' },
  { q: 'The 8th Pay Commission implements from?', options: ['Jan 2026', 'Jan 2027', 'Apr 2027', 'Jan 2028'], answer: 1, topic: 'Current Affairs' },
  { q: 'India\'s human spaceflight programme is?', options: ['Chandrayaan', 'Gaganyaan', 'Aditya', 'Mangalyaan'], answer: 1, topic: 'Science' },
  { q: 'How many UPSC CSE attempts for General category?', options: ['4', '6', '8', 'Unlimited'], answer: 1, topic: 'General' },
];

const getDailyQuestions = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const shuffled = [...quizQuestions].sort((a, b) => {
    const hashA = ((seed * 31 + quizQuestions.indexOf(a)) % 997);
    const hashB = ((seed * 31 + quizQuestions.indexOf(b)) % 997);
    return hashA - hashB;
  });
  return shuffled.slice(0, 3);
};

const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ''));
    if (isNaN(num) || num === 0) return;
    const step = Math.ceil(num / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { current = num; clearInterval(timer); }
      setCount(current);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { ref, count };
};

const StatCard = ({ val, label }) => {
  const numericPart = val.replace(/[^0-9]/g, '');
  const suffix = val.replace(/[0-9]/g, '');
  const { ref, count } = useCountUp(val);
  const display = numericPart ? `${count.toLocaleString()}${suffix}` : val;
  return (
    <motion.div ref={ref} variants={fadeInUp} className="glass rounded-2xl py-6 sm:py-8 text-center">
      <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{display}</p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">{label}</p>
    </motion.div>
  );
};

const TypingEffect = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = heroWords[wordIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(word.slice(0, displayed.length + 1));
        if (displayed.length === word.length) setTimeout(() => setDeleting(true), 1500);
      } else {
        setDisplayed(word.slice(0, displayed.length - 1));
        if (displayed.length === 0) { setDeleting(false); setWordIndex((p) => (p + 1) % heroWords.length); }
      }
    }, deleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  return (
    <span className="inline-block min-w-[180px] sm:min-w-[260px] text-left">
      <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">{displayed}</span>
      <span className="animate-pulse text-white/70">|</span>
    </span>
  );
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is GovtExamPath?', acceptedAnswer: { '@type': 'Answer', text: 'GovtExamPath is India\'s free career guidance platform for government jobs with 200+ exams, eligibility checker, mind maps, and free resources.' } },
    { '@type': 'Question', name: 'Which exams can I apply for after graduation?', acceptedAnswer: { '@type': 'Answer', text: 'UPSC CSE, SSC CGL, IBPS PO, RBI Grade B, State PSC and many more. Use our Eligibility Checker to find all exams you qualify for.' } },
    { '@type': 'Question', name: 'Is GovtExamPath free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, completely free. Career Guide, Eligibility Checker, Mind Maps, resources, and current affairs — all at no cost.' } },
  ],
};

const testimonials = [
  { name: 'Priya Sharma', role: 'SSC CGL 2026 — AIR 342', text: 'The career guide recommended SSC CGL based on my profile, and I cracked it in my first attempt!', avatar: 'P' },
  { name: 'Rajesh Kumar', role: 'IBPS PO 2026 — Selected', text: 'I scored 38/40 in General Awareness thanks to the current affairs section and resources.', avatar: 'R' },
  { name: 'Anjali Verma', role: 'UPSC Prelims 2026 — Cleared', text: 'As a first-gen aspirant, GovtExamPath became my mentor. Cleared Prelims with 120+.', avatar: 'A' },
];

const Home = () => {
  const { t } = useLanguage();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [dailyQuiz] = useState(getDailyQuestions);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const closingSoonExams = useMemo(() => {
    const today = new Date();
    const twoWeeksOut = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const todayStr = today.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksOut.toISOString().split('T')[0];
    return examsData
      .filter((e) => e.lastDate && e.lastDate >= todayStr && e.lastDate <= twoWeeksStr)
      .sort((a, b) => a.lastDate.localeCompare(b.lastDate))
      .slice(0, 4);
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams({ limit: 6, sort: '-createdAt' });
        const list = data.exams || data.data || data;
        setExams(Array.isArray(list) ? list : []);
      } catch { setExams([]); }
      finally { setLoading(false); }
    };
    fetchExams();
  }, []);

  return (
    <div className="overflow-hidden">
      <SEO path="/" description="India's free career guidance platform for government jobs. Explore 200+ exams like UPSC, SSC, Banking, Railways. Get career guidance, eligibility checker, syllabus mind maps, and free resources." jsonLd={faqSchema} />

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-blue-100 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {t('heroTag')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              {t('heroTitle1')} <TypingEffect />
            </h1>

            <p className="text-lg sm:text-xl text-blue-100/90 mb-10 max-w-xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/exams" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 hover:-translate-y-0.5 text-lg">
                {t('exploreExams')} <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/ai-guide" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-lg">
                <FiCpu className="w-5 h-5" /> {t('careerGuide')}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 100L60 90C120 80 240 60 360 53C480 47 600 53 720 60C840 67 960 73 1080 70C1200 67 1320 53 1380 47L1440 40V100H0Z" className="fill-slate-50 dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <AnimatedSection>
          <div className="grid grid-cols-4 gap-3">
            {[
              { val: '200+', label: 'Exams' },
              { val: '10,000+', label: 'Students' },
              { val: '16', label: 'Categories' },
              { val: '100%', label: 'Free' },
            ].map((s) => (
              <StatCard key={s.label} val={s.val} label={s.label} />
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── CLOSING SOON (conditional) ── */}
      {closingSoonExams.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Closing Soon</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {closingSoonExams.map((exam) => {
                  const daysLeft = Math.ceil((new Date(exam.lastDate) - new Date()) / 86400000);
                  return (
                    <Link key={exam._id} to={`/exams/${exam._id}`} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl hover:shadow-sm transition-all group">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-red-600 transition-colors">{exam.title}</p>
                      <span className="ml-2 flex-shrink-0 text-xs font-bold text-red-600 dark:text-red-400">{daysLeft <= 0 ? 'Today' : `${daysLeft}d`}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </AnimatedSection>
        </section>
      )}

      {/* ── CATEGORIES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">16 sectors, 200+ exams — find your path</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.map(({ name, icon, count, gradient, bg }) => (
              <motion.div key={name} variants={fadeInUp}>
                <Link to={`/exams?category=${encodeURIComponent(name)}`} className={`flex flex-col items-center gap-3 p-6 sm:p-7 ${bg} rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group h-full`}>
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl sm:text-4xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>{icon}</div>
                  <div className="text-center">
                    <span className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 block">{name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">{count}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/exams" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
              View all categories <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-gradient-to-b from-slate-50/80 to-white dark:from-gray-900/50 dark:to-gray-950 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                Free Tools to <span className="gradient-text">Succeed</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Everything you need for government exam preparation</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, title, desc, link, color }) => (
                <motion.div key={title} variants={fadeInUp}>
                  <Link to={link} className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── LATEST EXAMS ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                {t('latestExams')}
              </h2>
              <Link to="/exams" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium rounded-xl hover:bg-primary-100 transition-colors">
                {t('viewAll')} <FiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ExamList exams={exams} loading={loading} />
            </motion.div>
            <div className="text-center mt-6 sm:hidden">
              <Link to="/exams" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline text-sm">
                {t('viewAll')} <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── DAILY QUIZ ── */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800/50 dark:to-gray-900/50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-semibold mb-3">
                <FiStar className="w-3.5 h-3.5" /> Daily Practice
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                Today's <span className="gradient-text">Quiz</span>
              </h2>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-4">
              {dailyQuiz.map((item, qi) => (
                <div key={qi} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{qi + 1}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{item.topic}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm sm:text-base">{item.q}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.options.map((opt, oi) => {
                      const selected = quizAnswers[qi] === oi;
                      const isCorrect = oi === item.answer;
                      const show = quizSubmitted;
                      return (
                        <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))} disabled={quizSubmitted}
                          className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            show && isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                            : show && selected && !isCorrect ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
                            : selected ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 text-amber-700 dark:text-amber-400'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                          }`}>
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + oi)}.</span>{opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center mt-5">
              {!quizSubmitted ? (
                <button onClick={() => Object.keys(quizAnswers).length === 3 && setQuizSubmitted(true)} disabled={Object.keys(quizAnswers).length < 3}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all ${Object.keys(quizAnswers).length === 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                  {t('checkAnswer')}
                </button>
              ) : (
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">You scored {dailyQuiz.filter((item, i) => quizAnswers[i] === item.answer).length}/3</p>
                  <Link to="/current-affairs" className="inline-flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                    More practice <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              {t('whatStudentsSay')}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={fadeInUp} className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 card-hover">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── CTA + NEWSLETTER ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 sm:p-14 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{t('readyToStart')}</h2>
              <p className="text-blue-100 max-w-md mx-auto mb-8">
                Join thousands of aspirants using GovtExamPath to crack government exams.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <Link to="/register" className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl text-lg">
                  {t('getStarted')} <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/ai-guide" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-lg">
                  <FiCpu className="w-5 h-5" /> {t('careerGuide')}
                </Link>
              </div>
              <div className="border-t border-white/10 pt-6 max-w-sm mx-auto">
                {subscribed ? (
                  <p className="text-green-200 font-medium text-sm">Subscribed! Check your inbox.</p>
                ) : (
                  <form onSubmit={async (e) => { e.preventDefault(); if (!email.trim()) return; try { await fetch('/.netlify/functions/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim() }) }); setSubscribed(true); } catch {} }}
                    className="flex gap-2">
                    <input type="email" required placeholder="Get exam updates via email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-full text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    <button type="submit" className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors text-sm">Subscribe</button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Home;
