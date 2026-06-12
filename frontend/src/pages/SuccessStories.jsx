import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiStar, FiArrowRight, FiMail, FiAward, FiTrendingUp } from 'react-icons/fi';
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

const successStories = [
  {
    name: 'Tina Dabi',
    exam: 'UPSC CSE 2015',
    result: 'AIR 1',
    initial: 'T',
    gradient: 'from-purple-500 to-indigo-600',
    summary: 'Tina Dabi became the UPSC Civil Services topper in 2015 at the age of 22. A graduate from Lady Shri Ram College, Delhi University, she was the first Scheduled Caste woman to top the exam. She is currently serving as District Collector of Jaisalmer, Rajasthan.',
    keyTakeaway: 'Consistent daily study routine of 7-8 hours with NCERT books as the foundation.',
    tags: ['UPSC', 'IAS'],
    source: 'UPSC Official Results 2015',
  },
  {
    name: 'Kanishak Kataria',
    exam: 'UPSC CSE 2018',
    result: 'AIR 1',
    initial: 'K',
    gradient: 'from-blue-500 to-cyan-600',
    summary: 'Kanishak Kataria topped the UPSC Civil Services Examination 2018. An IIT Bombay B.Tech graduate, he left his job at a leading tech company in South Korea to pursue civil services. He cleared the exam in his first attempt with Mathematics as his optional subject.',
    keyTakeaway: 'Left a high-paying tech career abroad to serve the nation through civil services.',
    tags: ['UPSC', 'IAS'],
    source: 'UPSC Official Results 2018',
  },
  {
    name: 'Srushti Jayant Deshmukh',
    exam: 'UPSC CSE 2018',
    result: 'AIR 5',
    initial: 'S',
    gradient: 'from-teal-500 to-emerald-600',
    summary: 'Srushti Jayant Deshmukh secured AIR 5 in UPSC CSE 2018, becoming the topper among women candidates that year. A Chemical Engineering graduate from Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal, she cleared the exam in her first attempt at age 23.',
    keyTakeaway: 'Focused on answer writing practice and self-study without any coaching institute.',
    tags: ['UPSC', 'IAS'],
    source: 'UPSC Official Results 2018',
  },
  {
    name: 'Anu Kumari',
    exam: 'UPSC CSE 2017',
    result: 'AIR 2',
    initial: 'A',
    gradient: 'from-pink-500 to-rose-600',
    summary: 'Anu Kumari secured AIR 2 in UPSC CSE 2017 while being a working mother. A B.Tech and MBA graduate from Haryana, she balanced her preparation with her job and family responsibilities. Her story inspired many women and working professionals across India.',
    keyTakeaway: 'Proved that family responsibilities and exam preparation can go hand in hand with determination.',
    tags: ['UPSC', 'IAS'],
    source: 'UPSC Official Results 2017',
  },
  {
    name: 'Aditya Joshi',
    exam: 'SSC CGL 2019',
    result: 'AIR 1',
    initial: 'A',
    gradient: 'from-orange-500 to-amber-600',
    summary: 'Aditya Joshi topped the SSC CGL 2019 examination. Known for his disciplined preparation approach, he focused on previous year question papers and time management. His success demonstrated that SSC exams can also lead to prestigious government positions.',
    keyTakeaway: 'Practiced over 200 previous year papers to master the exam pattern.',
    tags: ['SSC', 'CGL'],
    source: 'SSC Official Results 2019',
  },
  {
    name: 'Saurabh Kumar',
    exam: 'IBPS PO 2020',
    result: 'Selected',
    initial: 'S',
    gradient: 'from-green-500 to-teal-600',
    summary: 'Saurabh Kumar cleared IBPS PO in 2020 coming from a small town in Bihar. Without access to expensive coaching, he relied on free online resources, mock tests, and self-study. His selection as a Probationary Officer proved that dedication matters more than resources.',
    keyTakeaway: 'Used free online resources and daily mock tests to prepare without coaching.',
    tags: ['Banking', 'IBPS PO'],
    source: 'IBPS Official Results 2020',
  },
  {
    name: 'Nandini KR',
    exam: 'UPSC CSE 2016',
    result: 'AIR 1',
    initial: 'N',
    gradient: 'from-violet-500 to-purple-600',
    summary: 'Nandini KR topped the UPSC Civil Services Examination 2016. Hailing from Chitradurga, Karnataka, she completed her B.Tech from Siddaganga Institute of Technology. She chose Kannada Literature as her optional subject and cleared the exam in her second attempt.',
    keyTakeaway: 'Choosing the right optional subject and learning from the first attempt were crucial.',
    tags: ['UPSC', 'IAS'],
    source: 'UPSC Official Results 2016',
  },
  {
    name: 'Pradeep Singh',
    exam: 'UPSC CSE 2019',
    result: 'AIR 1',
    initial: 'P',
    gradient: 'from-red-500 to-orange-600',
    summary: 'Pradeep Singh secured AIR 1 in UPSC CSE 2019. An Electrical Engineering graduate from IIT Bombay, he cleared the exam in his third attempt. His perseverance after two unsuccessful attempts became an inspiration for aspirants who face setbacks.',
    keyTakeaway: 'Failed twice before topping the exam — persistence and learning from mistakes paid off.',
    tags: ['UPSC', 'IAS'],
    source: 'UPSC Official Results 2019',
  },
];

const StoryCard = ({ story }) => (
  <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${story.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <span className="text-white font-bold text-xl">{story.initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{story.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{story.exam}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${story.gradient} text-white flex-shrink-0`}>
          {story.result}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
        {story.summary}
      </p>

      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-3 mb-4">
        <div className="flex items-start gap-2">
          <FiTrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-teal-700 dark:text-teal-300 font-medium leading-relaxed">
            {story.keyTakeaway}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {story.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 italic">{story.source}</span>
      </div>
    </div>
  </motion.div>
);

const SuccessStories = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <SEO
        title="Success Stories — GovtExamPath"
        path="/success-stories"
        description="Inspiring success stories from government exam toppers. Learn from real achievers who cleared UPSC, SSC, Banking, Railways, and State PSC exams."
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
            Real stories of real achievers who cleared India's toughest government exams through dedication and hard work.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-teal-100">
            <FiAward className="w-4 h-4" />
            {successStories.length} Inspiring Stories
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center italic">
          These stories feature well-known government exam toppers based on publicly available information from official results and media reports.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {successStories.map((story) => (
            <StoryCard key={story.name} story={story} />
          ))}
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
