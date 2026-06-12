import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiStar, FiArrowRight, FiMail, FiBookOpen, FiUsers, FiHeart } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
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

const SuccessStories = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <SEO
        title="Success Stories — GovtExamPath"
        path="/success-stories"
        description="Success stories from government exam aspirants. Share your journey and inspire others preparing for UPSC, SSC, Banking, Railways, and State PSC exams."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Success Stories' }]} />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute top-1/4 right-16 w-32 h-32 bg-white/5 rounded-full animate-bounce" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }} />
          <div className="absolute bottom-10 right-1/3 w-12 h-12 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -top-16 -right-16 w-96 h-96 bg-white/5 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
            <FiStar className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {t('ssHeroTitle')}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-cyan-200">
              {t('ssHeroHighlight')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed mb-8">
            {t('ssHeroSubtitle')}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-teal-100">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Coming Soon
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <AnimatedSection className="text-center mb-16">
          <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
            {/* Large illustration icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-3xl mb-8">
              <FiBookOpen className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
              Your Story <span className="gradient-text">Matters</span>
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed mb-3">
              We believe in showcasing only real achievements from real people. We are currently collecting genuine success stories from aspirants who have used GovtExamPath in their preparation journey.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Have you cleared a government exam? Your story could inspire thousands of aspirants across India.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* Feature cards */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 sm:p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiUsers className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Real People</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Every story we publish will be from a verified user with a genuine achievement.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 sm:p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiHeart className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Authentic Journeys</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              No fabricated quotes or made-up results. Only honest preparation stories shared with consent.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 sm:p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiStar className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Inspire Others</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Your experience can guide and motivate aspirants who are just starting their journey.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="mt-16 sm:mt-20">
          <motion.div variants={fadeInUp}>
            <div className="relative rounded-3xl bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="relative px-8 py-14 sm:px-16 sm:py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <FiMail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                  Share Your Success Story
                </h2>
                <p className="text-teal-100 max-w-2xl mx-auto mb-10 text-base sm:text-lg leading-relaxed">
                  Have you cleared a government exam? We would love to hear about your journey. Reach out to us and your story could be featured here to inspire thousands of aspirants.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base"
                  >
                    <FiMail className="w-5 h-5" />
                    Share Your Story
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/exams"
                    className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 text-base"
                  >
                    Explore Exams
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default SuccessStories;
