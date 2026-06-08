import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCpu, FiCheckSquare, FiMap, FiBook, FiGlobe, FiBell, FiStar, FiCalendar, FiSend, FiTrendingUp, FiShield, FiDollarSign, FiClock, FiHeart, FiAward, FiBarChart2, FiSearch, FiUsers, FiZap } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import SEO from '../components/common/SEO';
import { examsData } from '../data/examsData';
import { getExams } from '../services/examService';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const categories = [
  { name: 'UPSC', icon: '🏛️', count: '8+ Exams', gradient: 'from-purple-500 to-indigo-600', desc: 'IAS, IPS, IFS, NDA, CDS' },
  { name: 'SSC', icon: '📋', count: '10+ Exams', gradient: 'from-blue-500 to-cyan-600', desc: 'CGL, CHSL, MTS, GD, CPO' },
  { name: 'Banking', icon: '🏦', count: '12+ Exams', gradient: 'from-green-500 to-emerald-600', desc: 'IBPS PO, SBI PO, RBI' },
  { name: 'Railways', icon: '🚂', count: '6+ Exams', gradient: 'from-red-500 to-rose-600', desc: 'NTPC, Group D, JE, ALP' },
  { name: 'Defence', icon: '🎖️', count: '8+ Exams', gradient: 'from-amber-500 to-orange-600', desc: 'NDA, CDS, AFCAT, Navy' },
  { name: 'State PSC', icon: '🏢', count: '15+ Exams', gradient: 'from-orange-500 to-red-600', desc: 'UPPSC, MPPSC, BPSC' },
  { name: 'Teaching', icon: '📚', count: '5+ Exams', gradient: 'from-pink-500 to-rose-600', desc: 'CTET, KVS, NVS, UGC NET' },
  { name: 'Police', icon: '👮', count: '4+ Exams', gradient: 'from-indigo-500 to-blue-600', desc: 'CPO, Delhi Police, CAPF' },
  { name: 'Insurance', icon: '🛡️', count: '3+ Exams', gradient: 'from-teal-500 to-cyan-600', desc: 'LIC AAO, NICL, OICL' },
  { name: 'PSU', icon: '🏭', count: '10+ Exams', gradient: 'from-slate-500 to-gray-600', desc: 'ONGC, BHEL, IOCL, NTPC' },
  { name: 'Regulatory Bodies', icon: '⚖️', count: '8+ Exams', gradient: 'from-emerald-500 to-teal-600', desc: 'RBI, SEBI, NABARD' },
  { name: 'Judiciary', icon: '🏛️', count: '5+ Exams', gradient: 'from-yellow-500 to-amber-600', desc: 'Civil Judge, District Judge' },
  { name: 'Healthcare', icon: '🏥', count: '5+ Exams', gradient: 'from-red-400 to-pink-600', desc: 'NEET MDS, AIIMS, ESIC' },
  { name: 'Postal', icon: '📮', count: '3+ Exams', gradient: 'from-red-500 to-orange-600', desc: 'PA/SA, Postman, GDS' },
  { name: 'Agriculture', icon: '🌾', count: '4+ Exams', gradient: 'from-lime-500 to-green-600', desc: 'ICAR NET, FCI, State Agri' },
  { name: 'Miscellaneous', icon: '📂', count: '5+ Exams', gradient: 'from-gray-500 to-slate-600', desc: 'GATE, NTA, Others' },
];

const features = [
  { icon: FiCpu, title: 'Career Guide', description: 'Get personalized exam recommendations based on your qualifications, age, and interests.', link: '/ai-guide', color: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30' },
  { icon: FiCheckSquare, title: 'Eligibility Checker', description: 'Instantly check which government exams you qualify for based on your profile.', link: '/eligibility-checker', color: 'from-green-500 to-emerald-600', bg: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30' },
  { icon: FiMap, title: 'Syllabus Mind Maps', description: 'Visual breakdowns of exam syllabi with interactive, expandable tree views.', link: '/mind-maps', color: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30' },
  { icon: FiBook, title: 'Free Resources', description: '60+ study notes, previous year papers, and book recommendations for all exams.', link: '/resources', color: 'from-orange-500 to-red-600', bg: 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30' },
  { icon: FiGlobe, title: 'Current Affairs', description: '150+ articles covering national, international, economy, science & sports.', link: '/current-affairs', color: 'from-teal-500 to-cyan-600', bg: 'from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30' },
  { icon: FiBarChart2, title: 'Exam Priority Matrix', description: 'Find hidden-gem exams with the best salary-to-competition ratio.', link: '/exam-priority', color: 'from-rose-500 to-pink-600', bg: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30' },
];

const tools = [
  { icon: FiSearch, title: 'Compare Exams', link: '/compare', desc: 'Side-by-side comparison' },
  { icon: FiDollarSign, title: 'Salary Calculator', link: '/salary-calculator', desc: '7th & 8th Pay Commission' },
  { icon: FiCalendar, title: 'Exam Calendar', link: '/exam-calendar', desc: 'Never miss a deadline' },
  { icon: FiClock, title: 'Prep Time Estimator', link: '/prep-time-estimator', desc: 'Personalized timeline' },
  { icon: FiBell, title: 'Smart Notifications', link: '/register', desc: 'Instant exam alerts' },
  { icon: FiTrendingUp, title: 'Cut-Off Trends', link: '/cut-off', desc: 'Previous year analysis' },
];

const stats = [
  { value: '10,000+', label: 'Students Guided', icon: FiUsers },
  { value: '200+', label: 'Government Exams', icon: FiBook },
  { value: '100%', label: 'Free Forever', icon: FiHeart },
  { value: 'Daily', label: 'Updated Content', icon: FiZap },
];

const heroTypingWords = ['UPSC IAS', 'SSC CGL', 'Bank PO', 'Railways', 'Defence', 'State PSC', 'Teaching'];

const whyGovtJobReasons = [
  { icon: FiShield, title: 'Job Security', stat: 'Lifetime', desc: 'Cannot be terminated without due process — permanent employment guaranteed', color: 'text-blue-500' },
  { icon: FiDollarSign, title: 'Salary + Pension', stat: '₹32K-2.5L', desc: '7th Pay Commission salary with DA, HRA, and NPS pension benefits', color: 'text-green-500' },
  { icon: FiHeart, title: 'Medical Benefits', stat: 'Full Family', desc: 'CGHS/State health coverage for self, spouse, children & dependent parents', color: 'text-rose-500' },
  { icon: FiClock, title: 'Work-Life Balance', stat: '9-5 Hours', desc: 'Fixed working hours, weekends off, 30+ paid leaves, no midnight calls', color: 'text-purple-500' },
  { icon: FiAward, title: 'Social Prestige', stat: 'Top Status', desc: 'Respect in society, authority, and power to make a real difference', color: 'text-amber-500' },
  { icon: FiTrendingUp, title: 'Career Growth', stat: 'Assured', desc: 'Time-bound promotions, pay scale upgrades, and deputation opportunities', color: 'text-cyan-500' },
];

const quizQuestions = [
  { q: 'Who is the current Chief Justice of India (2026)?', options: ['Justice Sanjiv Khanna', 'Justice B.R. Gavai', 'Justice Surya Kant', 'Justice D.Y. Chandrachud'], answer: 0, topic: 'Polity' },
  { q: 'What is the repo rate set by RBI as of April 2026?', options: ['6.00%', '5.75%', '6.25%', '5.50%'], answer: 1, topic: 'Economy' },
  { q: 'India became the world\'s ___ largest economy in 2026.', options: ['3rd', '4th', '5th', '6th'], answer: 1, topic: 'Economy' },
  { q: 'Which organization conducts the SSC CGL exam?', options: ['UPSC', 'SSC', 'IBPS', 'RRB'], answer: 1, topic: 'General' },
  { q: 'PFBR nuclear reactor achieved first criticality at which location?', options: ['Tarapur', 'Kalpakkam', 'Kudankulam', 'Rawatbhata'], answer: 1, topic: 'Science' },
  { q: 'What is the full form of NABARD?', options: ['National Bank for Agriculture and Rural Development', 'National Board for Agricultural Research and Development', 'National Bureau of Animal Resource Development', 'National Bank for Allied Rural Development'], answer: 0, topic: 'Banking' },
  { q: 'Which article of the Indian Constitution deals with the Election Commission?', options: ['Article 280', 'Article 324', 'Article 356', 'Article 370'], answer: 1, topic: 'Polity' },
  { q: 'The Western Dedicated Freight Corridor connects JNPT to which city?', options: ['Delhi', 'Dadri', 'Lucknow', 'Varanasi'], answer: 1, topic: 'Current Affairs' },
  { q: 'What is the minimum age to appear for UPSC Civil Services?', options: ['18 years', '20 years', '21 years', '23 years'], answer: 2, topic: 'General' },
  { q: 'Who ran the first legal sub-2-hour marathon in April 2026?', options: ['Eliud Kipchoge', 'Sabastian Sawe', 'Kenenisa Bekele', 'Mo Farah'], answer: 1, topic: 'Sports' },
  { q: 'The 8th Pay Commission is expected to implement from which date?', options: ['January 2026', 'January 2027', 'April 2027', 'January 2028'], answer: 1, topic: 'Current Affairs' },
  { q: 'Which mission is India\'s human spaceflight programme?', options: ['Chandrayaan', 'Gaganyaan', 'Aditya', 'Mangalyaan'], answer: 1, topic: 'Science' },
  { q: 'RBI\'s Digital Rupee is also known as?', options: ['e-Rupee (e₹)', 'DigiRupee', 'CryptoINR', 'RuPay Digital'], answer: 0, topic: 'Economy' },
  { q: 'How many attempts does a General category candidate get for UPSC CSE?', options: ['4', '6', '8', 'Unlimited'], answer: 1, topic: 'General' },
  { q: 'India Population Census 2026 started on which date?', options: ['January 1, 2026', 'April 1, 2026', 'March 1, 2026', 'February 1, 2026'], answer: 1, topic: 'Current Affairs' },
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
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      setCount(current);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { ref, count };
};

const StatCard = ({ value, label, icon: Icon }) => {
  const numericPart = value.replace(/[^0-9]/g, '');
  const suffix = value.replace(/[0-9]/g, '');
  const { ref, count } = useCountUp(value);
  const displayValue = numericPart ? `${count.toLocaleString()}${suffix}` : value;

  return (
    <motion.div ref={ref} variants={fadeInUp} className="glass rounded-2xl p-6 text-center card-hover group">
      <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-400/10 dark:to-indigo-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{displayValue}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
    </motion.div>
  );
};

const testimonials = [
  { name: 'Priya Sharma', role: 'SSC CGL 2026 — AIR 342', text: 'GovtExamPath helped me understand which exams I was eligible for and guided my preparation strategy. The career guide recommended SSC CGL based on my profile, and I cracked it in my first attempt!', avatar: 'P' },
  { name: 'Rajesh Kumar', role: 'IBPS PO 2026 — Selected', text: 'The eligibility checker saved me hours of research. I could instantly see all banking exams I qualified for. I scored 38/40 in General Awareness thanks to the current affairs section!', avatar: 'R' },
  { name: 'Anjali Verma', role: 'UPSC CSE 2026 — Prelims Cleared', text: 'As a first-generation aspirant from a small town, I had zero guidance. GovtExamPath became my mentor. The syllabus mind maps and daily current affairs helped me clear Prelims with 120+.', avatar: 'A' },
  { name: 'Vikram Singh', role: 'RRB NTPC 2026 — Selected', text: 'I was confused between Railway NTPC and Group D. The compare tool showed me the salary difference clearly. The previous year papers were exactly what I needed.', avatar: 'V' },
  { name: 'Meena Kumari', role: 'CTET Jan 2026 — Qualified', text: 'The CTET mind map broke down the entire syllabus into manageable chunks. I studied for just 4 months using GovtExamPath resources and qualified in both Paper I and Paper II.', avatar: 'M' },
  { name: 'Arjun Reddy', role: 'NDA 2026 — Recommended', text: 'The prep time estimator told me I needed 8 months for NDA — and it was spot on. The career guide also suggested CDS as a backup. Now joining the Indian Army!', avatar: 'A' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is GovtExamPath?', acceptedAnswer: { '@type': 'Answer', text: 'GovtExamPath is India\'s free career guidance platform for government jobs. It offers smart exam recommendations, an eligibility checker, syllabus mind maps, and free preparation resources for 200+ government exams including UPSC, SSC, Banking, Railways, and Defence.' } },
    { '@type': 'Question', name: 'Which government exams can I apply for after graduation?', acceptedAnswer: { '@type': 'Answer', text: 'After graduation, you can apply for UPSC Civil Services (IAS/IPS), SSC CGL, IBPS PO, RBI Grade B, State PSC exams, and many more. Use the GovtExamPath Eligibility Checker to instantly see all exams you qualify for.' } },
    { '@type': 'Question', name: 'How to check eligibility for government exams?', acceptedAnswer: { '@type': 'Answer', text: 'Use the GovtExamPath Eligibility Checker. Enter your age, educational qualification, and category, and it will show all government exams you are eligible to apply for.' } },
    { '@type': 'Question', name: 'Is GovtExamPath free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, GovtExamPath is completely free. All features including Career Guide, Eligibility Checker, Mind Maps, study resources, and current affairs are available at no cost.' } },
  ],
};

const tickerExams = [
  'SSC CGL 2026 — 15,000+ Vacancies',
  'IBPS PO 2026 — Apply Now',
  'UPSC CSE 2026 — Notification Out',
  'RRB NTPC 2026 — 35,000+ Posts',
  'SBI PO 2026 — Last Date Soon',
  'NDA II 2026 — 12th Pass Apply',
  'RBI Grade B — ₹15.5 LPA Salary',
  'SSC CHSL 2026 — 4,500+ Vacancies',
  'CTET 2026 — Registration Open',
  'SEBI Grade A — ₹17.8 LPA',
];

const TypingEffect = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = heroTypingWords[wordIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(word.slice(0, displayed.length + 1));
        if (displayed.length === word.length) {
          setTimeout(() => setDeleting(true), 1500);
        }
      } else {
        setDisplayed(word.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % heroTypingWords.length);
        }
      }
    }, deleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  return (
    <span className="inline-block min-w-[200px] sm:min-w-[280px] text-left">
      <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
        {displayed}
      </span>
      <span className="animate-pulse text-white/80">|</span>
    </span>
  );
};

const FloatingBadge = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: delay + 0.8 }}
    className={`absolute hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-sm text-sm font-semibold ${className}`}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [dailyQuiz] = useState(getDailyQuestions);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const categoryColors = {
    SSC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    UPSC: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    Banking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Railways: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Defence: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'State PSC': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    Police: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    Insurance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    PSU: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
    'Regulatory Bodies': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    Judiciary: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    Healthcare: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    Postal: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Agriculture: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
  };

  const upcomingExams = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const futureExams = examsData
      .filter((exam) => exam.lastDate && exam.lastDate >= today)
      .sort((a, b) => a.lastDate.localeCompare(b.lastDate));
    if (futureExams.length > 0) return futureExams.slice(0, 6);
    return [...examsData].sort((a, b) => (a.title || '').localeCompare(b.title || '')).slice(0, 6);
  }, []);

  const closingSoonExams = useMemo(() => {
    const today = new Date();
    const twoWeeksOut = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const todayStr = today.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksOut.toISOString().split('T')[0];
    return examsData
      .filter((exam) => exam.lastDate && exam.lastDate >= todayStr && exam.lastDate <= twoWeeksStr)
      .sort((a, b) => a.lastDate.localeCompare(b.lastDate))
      .slice(0, 6);
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams({ limit: 6, sort: '-createdAt' });
        const list = data.exams || data.data || data;
        setExams(Array.isArray(list) ? list : []);
      } catch {
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const cycleTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(cycleTestimonial, 5000);
    return () => clearInterval(timer);
  }, [cycleTestimonial]);

  return (
    <div className="overflow-hidden">
      <SEO path="/" description="India's free career guidance platform for government jobs. Explore 200+ exams like UPSC, SSC, Banking, Railways. Get career guidance, eligibility checker, syllabus mind maps, and free resources." jsonLd={faqSchema} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-[5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-10 right-[5%] w-[600px] h-[600px] bg-purple-400/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        {/* Floating Exam Badges */}
        <FloatingBadge className="top-[18%] left-[6%] bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 border border-white/30" delay={0.2}>
          <span className="text-lg">🏛️</span> UPSC CSE — 1,000 Seats
        </FloatingBadge>
        <FloatingBadge className="top-[30%] right-[5%] bg-green-500/90 text-white border border-green-400/30" delay={0.4}>
          <span className="text-lg">🏦</span> IBPS PO — ₹7.5 LPA
        </FloatingBadge>
        <FloatingBadge className="bottom-[30%] left-[8%] bg-amber-500/90 text-white border border-amber-400/30" delay={0.6}>
          <span className="text-lg">🎖️</span> NDA — Join Armed Forces
        </FloatingBadge>
        <FloatingBadge className="bottom-[22%] right-[8%] bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 border border-white/30" delay={0.8}>
          <span className="text-lg">🚂</span> RRB NTPC — 35,000+ Posts
        </FloatingBadge>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-blue-100 mb-8"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              India's #1 Free Career Guidance Platform
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-4 leading-[1.1]">
              Your Path to{' '}
              <span className="block sm:inline">
                <TypingEffect />
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-100/80 mb-8">
              Starts Here
            </h2>

            <p className="text-lg sm:text-xl text-blue-100/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover <strong className="text-white">200+ government exams</strong>, check eligibility instantly, get expert career guidance, and access free preparation resources. All in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/exams"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 hover:shadow-black/30 hover:-translate-y-1 text-lg"
              >
                Explore Exams <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/ai-guide"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-lg"
              >
                <FiCpu className="w-5 h-5" /> Career Guide <FiArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Link>
            </div>

            {/* Quick search badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              <span className="text-blue-200/70 text-sm mr-1">Popular:</span>
              {['UPSC', 'SSC CGL', 'Banking', 'Railways', 'NDA'].map((tag) => (
                <Link
                  key={tag}
                  to={`/exams?category=${encodeURIComponent(tag === 'SSC CGL' ? 'SSC' : tag === 'NDA' ? 'Defence' : tag)}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-100 hover:bg-white/20 border border-white/10 transition-all hover:border-white/30"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Hero wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 120L48 108C96 96 192 72 288 60C384 48 480 48 576 56C672 64 768 80 864 84C960 88 1056 80 1152 72C1248 64 1344 56 1392 52L1440 48V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" className="fill-slate-50 dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* ═══════════════ SCROLLING TICKER ═══════════════ */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 -mt-1">
        <div className="overflow-hidden py-3">
          <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
            {[...tickerExams, ...tickerExams].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-6 text-sm text-white/90 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} />
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ═══════════════ CLOSING SOON ═══════════════ */}
      {closingSoonExams.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Application Closing Soon</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {closingSoonExams.map((exam) => {
                  const daysLeft = Math.ceil((new Date(exam.lastDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <Link key={exam._id} to={`/exams/${exam._id}`} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900/30 hover:shadow-md transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{exam.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Date: {new Date(exam.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <span className={`ml-3 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${daysLeft <= 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400'}`}>
                        {daysLeft <= 0 ? 'Today!' : daysLeft === 1 ? '1 day' : `${daysLeft} days`}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </AnimatedSection>
        </section>
      )}

      {/* ═══════════════ WHY GOVERNMENT JOBS? ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              <FiTrendingUp className="w-4 h-4" /> Why 2 Crore+ Indians Choose This Path
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Why <span className="gradient-text">Government Jobs</span>?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Private sector can match salary. It can never match the <strong className="text-gray-700 dark:text-gray-300">complete package</strong>.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyGovtJobReasons.map(({ icon: Icon, title, stat, desc, color }) => (
              <motion.div key={title} variants={fadeInUp} className="group relative p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 dark:from-gray-700/20 to-transparent rounded-bl-[60px]" />
                <div className="flex items-start gap-4 relative">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{stat}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="bg-gradient-to-br from-slate-50/80 to-blue-50/50 dark:from-gray-900/50 dark:to-gray-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                Browse by <span className="gradient-text">Category</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Explore government exams across 16 sectors — find the perfect career path for you
              </p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(({ name, icon, count, gradient, desc }) => (
                <motion.div key={name} variants={fadeInUp}>
                  <Link
                    to={`/exams?category=${encodeURIComponent(name)}`}
                    className="relative flex flex-col p-5 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden h-full"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
                    <div className="flex items-center gap-3 mb-2 relative">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm sm:text-base">{name}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{count}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 relative mt-auto">{desc}</p>
                    <FiArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Powerful tools and resources designed specifically for government exam aspirants
            </p>
          </motion.div>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {features.map(({ icon: Icon, title, description, link, color, bg }) => (
              <motion.div key={title} variants={fadeInUp}>
                <Link
                  to={link}
                  className={`block p-6 bg-gradient-to-br ${bg} rounded-2xl border border-gray-200/50 dark:border-gray-700/30 card-hover group h-full relative overflow-hidden`}
                >
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 rounded-full blur-xl" />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg relative`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Try Now <FiArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Tools */}
          <motion.div variants={fadeInUp}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {tools.map(({ icon: Icon, title, link, desc }) => (
                <Link
                  key={title}
                  to={link}
                  className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{title}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">{desc}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ═══════════════ LATEST EXAMS ═══════════════ */}
      <section className="bg-white/50 dark:bg-gray-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                  Latest <span className="gradient-text">Exams</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Recently posted government exam notifications</p>
              </div>
              <Link
                to="/exams"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                View All <FiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ExamList exams={exams} loading={loading} />
            </motion.div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/exams" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
                View All Exams <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ DAILY QUIZ ═══════════════ */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800/50 dark:to-gray-900/50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-semibold mb-4">
                <FiStar className="w-4 h-4" /> Daily Practice
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                Today's <span className="gradient-text">Quiz</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Test your knowledge with 3 questions — refreshed daily</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-4">
              {dailyQuiz.map((item, qi) => (
                <div key={qi} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full flex items-center justify-center">{qi + 1}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{item.topic}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{item.q}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.options.map((opt, oi) => {
                      const selected = quizAnswers[qi] === oi;
                      const isCorrect = oi === item.answer;
                      const showResult = quizSubmitted;
                      return (
                        <button
                          key={oi}
                          onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                          disabled={quizSubmitted}
                          className={`text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                            showResult && isCorrect
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                              : showResult && selected && !isCorrect
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
                              : selected
                              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400'
                              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-amber-300 dark:hover:border-amber-600'
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center mt-6">
              {!quizSubmitted ? (
                <button
                  onClick={() => Object.keys(quizAnswers).length === 3 && setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < 3}
                  className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${Object.keys(quizAnswers).length === 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                >
                  Check Answers
                </button>
              ) : (
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                    You scored {dailyQuiz.filter((item, i) => quizAnswers[i] === item.answer).length}/3
                  </p>
                  <Link to="/current-affairs" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                    Read Current Affairs for more practice <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Three simple steps to kickstart your government exam preparation</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800" />
              {[
                { step: '1', title: 'Choose Your Category', description: 'Browse 16 categories — UPSC, SSC, Banking, Railways, Defence, State PSC, Teaching, Police, and more.', icon: '🎯', gradient: 'from-blue-500 to-cyan-500' },
                { step: '2', title: 'Get Personalized Guidance', description: 'Use our career guide to get recommendations based on your qualifications, age, and career interests.', icon: '🧭', gradient: 'from-purple-500 to-pink-500' },
                { step: '3', title: 'Start Preparing', description: 'Access mind maps, resources, previous year papers, and current affairs to ace your exam.', icon: '🚀', gradient: 'from-orange-500 to-red-500' },
              ].map(({ step, title, description, icon, gradient }) => (
                <motion.div key={step} variants={fadeInUp} className="text-center relative">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl shadow-xl border border-gray-100 dark:border-gray-700 relative z-10 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <div className={`w-9 h-9 bg-gradient-to-br ${gradient} text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold shadow-lg`}>
                    {step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ EXAM NOTIFICATIONS ═══════════════ */}
      <section className="bg-gradient-to-br from-slate-50/80 to-blue-50/50 dark:from-gray-900/50 dark:to-gray-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                Latest Exam <span className="gradient-text">Notifications</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Stay updated with the newest government exam opportunities
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingExams.map((exam) => (
                <motion.div key={exam._id} variants={fadeInUp}>
                  <Link
                    to={`/exams/${exam._id}`}
                    className="block p-6 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[exam.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {exam.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {exam.title}
                    </h3>
                    {exam.lastDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <FiCalendar className="w-4 h-4" />
                        <span>Last Date: {new Date(exam.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                      View Details <FiArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/exams"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                View All Exams <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS — CAROUSEL ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              What Our <span className="gradient-text">Students Say</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Real stories from aspirants who found their path with us</p>
          </motion.div>

          {/* Desktop: grid, Mobile: carousel */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 card-hover"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile/tablet carousel */}
          <div className="lg:hidden">
            <div className="relative overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{testimonials[activeTestimonial].name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-gray-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Quick answers to common questions about government exams</p>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqSchema.mainEntity.map(({ name, acceptedAnswer }, i) => (
                <motion.div key={i} variants={fadeInUp} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{acceptedAnswer.text}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/faq" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
                View All FAQs <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatedSection>
          <motion.div
            variants={fadeInUp}
            className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10">
              <FiSend className="w-10 h-10 mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Never Miss an Exam Update</h2>
              <p className="text-blue-100 max-w-xl mx-auto mb-8">
                Join 10,000+ aspirants getting weekly exam notifications, deadline reminders, and preparation tips.
              </p>
              {subscribed ? (
                <p className="text-lg font-semibold text-green-200">
                  &#10003; Subscribed! Check your inbox for a confirmation.
                </p>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!email.trim()) return;
                    try {
                      await fetch('/.netlify/functions/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email.trim() }),
                      });
                      setSubscribed(true);
                    } catch {
                      setSubscribed(false);
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-5 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    Subscribe
                  </button>
                </form>
              )}
              <p className="text-xs text-blue-200 mt-4">No spam, unsubscribe anytime. We respect your privacy.</p>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatedSection>
          <motion.div
            variants={fadeInUp}
            className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-blue-100 max-w-lg mx-auto mb-10 text-lg">
                Join thousands of aspirants who are already using GovtExamPath to crack government exams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl text-lg"
                >
                  Get Started Free <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/ai-guide"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-lg"
                >
                  <FiCpu className="w-5 h-5" /> Try Career Guide
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Home;
