import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiCpu, FiCheckSquare, FiMap, FiBook, FiGlobe, FiBell, FiStar } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import SEO from '../components/common/SEO';
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
  { name: 'UPSC', icon: '🏛️', count: '8+ Exams', gradient: 'from-purple-500 to-indigo-600' },
  { name: 'SSC', icon: '📋', count: '10+ Exams', gradient: 'from-blue-500 to-cyan-600' },
  { name: 'Banking', icon: '🏦', count: '12+ Exams', gradient: 'from-green-500 to-emerald-600' },
  { name: 'Railways', icon: '🚂', count: '6+ Exams', gradient: 'from-red-500 to-rose-600' },
  { name: 'Defence', icon: '🎖️', count: '8+ Exams', gradient: 'from-amber-500 to-orange-600' },
  { name: 'State PSC', icon: '🏢', count: '15+ Exams', gradient: 'from-orange-500 to-red-600' },
  { name: 'Teaching', icon: '📚', count: '5+ Exams', gradient: 'from-pink-500 to-rose-600' },
  { name: 'Police', icon: '👮', count: '4+ Exams', gradient: 'from-indigo-500 to-blue-600' },
  { name: 'Insurance', icon: '🛡️', count: '3+ Exams', gradient: 'from-teal-500 to-cyan-600' },
];

const features = [
  { icon: FiCpu, title: 'AI Career Guide', description: 'Get personalized exam recommendations based on your qualifications, age, and interests using our intelligent chatbot.', link: '/ai-guide', color: 'from-blue-500 to-indigo-600' },
  { icon: FiCheckSquare, title: 'Eligibility Checker', description: 'Instantly check which government exams you qualify for based on your age, education, and category.', link: '/eligibility-checker', color: 'from-green-500 to-emerald-600' },
  { icon: FiMap, title: 'Syllabus Mind Maps', description: 'Visual breakdowns of exam syllabi with interactive, expandable tree views for effective study planning.', link: '/mind-maps', color: 'from-purple-500 to-pink-600' },
  { icon: FiBook, title: 'Free Resources', description: 'Access study notes, previous year questions, book recommendations, and preparation strategies for all exams.', link: '/resources', color: 'from-orange-500 to-red-600' },
  { icon: FiGlobe, title: 'Current Affairs', description: 'Stay updated with daily current affairs covering national, international, economy, science, and sports events.', link: '/current-affairs', color: 'from-teal-500 to-cyan-600' },
  { icon: FiBell, title: 'Smart Notifications', description: 'Never miss a deadline. Get instant alerts for new exams, application dates, and admit card releases.', link: '/register', color: 'from-rose-500 to-pink-600' },
];

const stats = [
  { value: '10,000+', label: 'Students Guided' },
  { value: '85+', label: 'Government Exams' },
  { value: '100%', label: 'Free Forever' },
  { value: 'Daily', label: 'Updated Content' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'SSC CGL Qualifier', text: 'GovtExamPath helped me understand which exams I was eligible for and guided my preparation strategy. The AI career guide recommended SSC CGL based on my profile, and I cracked it in my first attempt!', avatar: 'P' },
  { name: 'Rajesh Kumar', role: 'IBPS PO Selected', text: 'The eligibility checker saved me hours of research. I could instantly see all banking exams I qualified for. The mind maps for exam syllabus made my revision incredibly efficient.', avatar: 'R' },
  { name: 'Anjali Verma', role: 'UPSC Aspirant', text: 'As a first-generation aspirant, I had no guidance on government exams. GovtExamPath became my mentor. The current affairs section and resource library are invaluable for UPSC preparation.', avatar: 'A' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is GovtExamPath?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GovtExamPath is India\'s free career guidance platform for government jobs. It offers AI-powered exam recommendations, an eligibility checker, syllabus mind maps, and free preparation resources for 85+ government exams including UPSC, SSC, Banking, Railways, and Defence.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which government exams can I apply for after graduation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After graduation, you can apply for a wide range of government exams such as UPSC Civil Services (IAS/IPS), SSC CGL, IBPS PO, RBI Grade B, State PSC exams, and many more. Use the GovtExamPath Eligibility Checker to instantly see all exams you qualify for based on your age, education, and category.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to check eligibility for government exams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can check your eligibility for government exams instantly using the GovtExamPath Eligibility Checker. Simply enter your age, educational qualification, and category, and the tool will show you a list of all government exams you are eligible to apply for.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is GovtExamPath free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, GovtExamPath is completely free to use. All features including the AI Career Guide, Eligibility Checker, Syllabus Mind Maps, study resources, and current affairs are available at no cost. Our mission is to make government exam guidance accessible to every aspirant in India.',
      },
    },
  ],
};

const Home = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="overflow-hidden">
      <SEO path="/" description="India's free career guidance platform for government jobs. Explore 85+ exams like UPSC, SSC, Banking, Railways. Get AI career guide, eligibility checker, syllabus mind maps, and free resources." jsonLd={faqSchema} />
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-blue-100 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              India's Free Career Guidance Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Your Path to{' '}
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Government Jobs
              </span>
              {' '}Starts Here
            </h1>

            <p className="text-lg sm:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover 85+ government exams, check your eligibility instantly, get AI-powered career guidance, and access free preparation resources. All in one place, completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/exams"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5 text-lg"
              >
                Explore Exams <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/ai-guide"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-lg"
              >
                <FiCpu className="w-5 h-5" /> AI Career Guide
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 73.3C480 67 600 73 720 80C840 87 960 93 1080 90C1200 87 1320 73 1380 66.7L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-slate-50 dark:fill-gray-950"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="glass rounded-2xl p-6 text-center card-hover"
              >
                <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Explore government exams across different sectors and find the perfect career path for you
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {categories.map(({ name, icon, count, gradient }) => (
              <motion.div key={name} variants={fadeInUp}>
                <Link
                  to={`/exams?category=${encodeURIComponent(name)}`}
                  className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{count}</p>
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Latest Exams */}
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

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Powerful tools and resources designed specifically for government exam aspirants
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, link, color }) => (
              <motion.div key={title} variants={fadeInUp}>
                <Link
                  to={link}
                  className="block p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 card-hover group h-full"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Three simple steps to kickstart your government exam preparation</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800" />
              {[
                { step: '1', title: 'Choose Your Category', description: 'Browse through 9+ categories of government exams including UPSC, SSC, Banking, Railways, Defence, and more.', icon: '🎯' },
                { step: '2', title: 'Get Personalized Guidance', description: 'Use our AI career guide to get exam recommendations based on your qualifications, age, and career interests.', icon: '🤖' },
                { step: '3', title: 'Start Preparing', description: 'Access syllabus mind maps, study resources, previous year questions, and current affairs to ace your exam.', icon: '🚀' },
              ].map(({ step, title, description, icon }) => (
                <motion.div key={step} variants={fadeInUp} className="text-center relative">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative z-10">
                    {icon}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold shadow-md">
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

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              What Our <span className="gradient-text">Students Say</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Real stories from aspirants who found their path with us</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatedSection>
          <motion.div
            variants={fadeInUp}
            className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-blue-100 max-w-lg mx-auto mb-8 text-lg">
                Join thousands of aspirants who are already using GovtExamPath to navigate their government exam preparation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl text-lg"
                >
                  Get Started Free <FiArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/ai-guide"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-lg"
                >
                  <FiCpu className="w-5 h-5" /> Try AI Guide
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
