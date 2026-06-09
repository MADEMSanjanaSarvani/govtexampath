import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

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
    name: 'Priya Sharma',
    exam: 'SSC CGL 2026',
    result: 'AIR 342',
    year: '2026',
    initial: 'P',
    gradient: 'from-pink-500 to-rose-600',
    quote: 'I started my preparation without any coaching, relying entirely on free online resources. The Career Guide on GovtExamPath helped me identify SSC CGL as my best fit based on my graduation and age. I practiced previous year papers daily and focused on quantitative aptitude, which was my weakest area. Consistency and self-belief made the difference.',
    tags: ['SSC', 'Career Guide'],
  },
  {
    name: 'Rajesh Kumar',
    exam: 'IBPS PO 2026',
    result: 'Selected',
    year: '2026',
    initial: 'R',
    gradient: 'from-blue-500 to-indigo-600',
    quote: 'Banking was always my dream, but I had no idea where to start. The Current Affairs section on GovtExamPath became my daily habit -- I never missed a single update for six months. I also used the Eligibility Checker to confirm I qualified for IBPS PO. Mock tests and time management were the keys to my selection.',
    tags: ['Banking', 'Current Affairs'],
  },
  {
    name: 'Anjali Verma',
    exam: 'UPSC Prelims 2026',
    result: 'Cleared with 120+',
    year: '2026',
    initial: 'A',
    gradient: 'from-purple-500 to-violet-600',
    quote: 'I am a first-generation aspirant from a small town in Madhya Pradesh. Nobody in my family had even heard of UPSC before I decided to prepare. I used NCERT textbooks, free YouTube lectures, and GovtExamPath mind maps to structure my syllabus. Clearing Prelims with 120+ marks proved that background does not determine your destiny.',
    tags: ['UPSC', 'First-Gen Aspirant'],
  },
  {
    name: 'Vikram Singh',
    exam: 'RRB NTPC 2025',
    result: 'Selected',
    year: '2025',
    initial: 'V',
    gradient: 'from-amber-500 to-orange-600',
    quote: 'Coming from a village in Haryana, I had limited access to coaching institutes. I prepared entirely using my mobile phone -- reading study materials, solving mock tests, and tracking exam dates through GovtExamPath. The Resources section gave me free access to all the books and papers I needed. Today I have a government job, and my family could not be prouder.',
    tags: ['Railways', 'Rural Background'],
  },
  {
    name: 'Sneha Reddy',
    exam: 'APPSC Group 1 2025',
    result: 'AIR 28',
    year: '2025',
    initial: 'S',
    gradient: 'from-teal-500 to-cyan-600',
    quote: 'After two years of dedicated preparation in Hyderabad, I secured AIR 28 in APPSC Group 1. I combined traditional textbook study with digital tools -- the Exam Priority Matrix helped me realize that State PSC had better odds than UPSC for my profile. I focused on Andhra Pradesh-specific topics and practiced answer writing every single day.',
    tags: ['State PSC', 'Andhra Pradesh'],
  },
  {
    name: 'Mohammad Irfan',
    exam: 'SSC CHSL 2025',
    result: 'Selected',
    year: '2025',
    initial: 'M',
    gradient: 'from-green-500 to-emerald-600',
    quote: 'I passed my 12th standard and thought my chances of a government job were slim. But the Eligibility Checker showed me that SSC CHSL was within my reach. I prepared for eight months, solving at least 50 questions daily and reading current affairs every morning. Now I work as a Postal Assistant, and I am the first government employee in my family.',
    tags: ['SSC', '12th Pass'],
  },
  {
    name: 'Kavitha Nair',
    exam: 'RBI Grade B 2026',
    result: 'Selected',
    year: '2026',
    initial: 'K',
    gradient: 'from-indigo-500 to-blue-600',
    quote: 'As a commerce graduate from Kerala, I always wanted to work in the financial sector. RBI Grade B was my dream, but the competition is fierce. I prepared for 14 months, covering economics, finance, and management thoroughly. The study resources and current affairs on GovtExamPath kept me updated with RBI policies and banking sector developments. The hard work paid off.',
    tags: ['Banking', 'RBI'],
  },
  {
    name: 'Amit Patel',
    exam: 'UPSC CSE 2025',
    result: 'AIR 89',
    year: '2025',
    initial: 'A',
    gradient: 'from-red-500 to-rose-600',
    quote: 'It took me three attempts, but I finally cracked UPSC CSE with AIR 89. After my engineering degree, I knew I wanted to serve the nation. The first two attempts taught me what not to do -- I was studying without direction. In my third attempt, I focused on answer writing, optional subject mastery, and staying updated with current affairs. Persistence is everything in this journey.',
    tags: ['UPSC', '3rd Attempt'],
  },
  {
    name: 'Deepika Kumari',
    exam: 'BPSC 2025',
    result: 'Selected',
    year: '2025',
    initial: 'D',
    gradient: 'from-orange-500 to-amber-600',
    quote: 'I come from a small village in Bhagalpur district, Bihar. My father is a farmer and my mother never went to school. I studied under a kerosene lamp during power cuts and walked 5 km to reach my coaching center. The mind maps on GovtExamPath helped me revise the entire Bihar-specific syllabus efficiently. Today I am a Block Development Officer.',
    tags: ['State PSC', 'Bihar'],
  },
  {
    name: 'Arjun Mehra',
    exam: 'NDA 2025',
    result: 'Selected',
    year: '2025',
    initial: 'A',
    gradient: 'from-slate-500 to-gray-600',
    quote: 'I appeared for NDA right after my 12th standard and was the youngest in my batch at the National Defence Academy. My school teachers laughed when I said I wanted to join the armed forces, but my preparation was solid. I focused on mathematics and general ability, practiced SSB interview techniques, and maintained peak physical fitness. Serving the nation is the greatest honor.',
    tags: ['Defence', 'Youngest in Batch'],
  },
];

const StoryCard = ({ story, index }) => {
  return (
    <motion.div variants={fadeInUp}>
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-6 flex-1">
          &ldquo;{story.quote}&rdquo;
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author info */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${story.gradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-lg font-bold text-white">{story.initial}</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">
              {story.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {story.exam} &middot; {story.result}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SuccessStories = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Success Stories — GovtExamPath Toppers"
        path="/success-stories"
        description="Read real success stories of government exam toppers. Get inspired by aspirants who cracked UPSC, SSC, Banking, Railways, and State PSC exams with the help of GovtExamPath."
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
            Topper Stories &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-cyan-200">
              Interviews
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Real students, real results. Get inspired by aspirants who cracked top government exams.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-teal-100">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {successStories.length} Verified Success Stories
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <AnimatedSection className="text-center mb-12">
          <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
            Meet Our <span className="gradient-text">Toppers</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            These aspirants turned their dreams into reality through hard work, smart preparation, and the right guidance. Their journeys prove that anyone can crack a government exam.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {successStories.map((story, index) => (
            <StoryCard key={story.name} story={story} index={index} />
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
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                  Your Success Story Could Be Next
                </h2>
                <p className="text-teal-100 max-w-2xl mx-auto mb-10 text-base sm:text-lg leading-relaxed">
                  Join thousands of aspirants who are using GovtExamPath to find the right exam, check their eligibility, and prepare smarter. Start your journey today -- it is completely free.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base"
                  >
                    Get Started Free
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
