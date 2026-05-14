import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiTarget,
  FiUsers,
  FiBookOpen,
  FiAward,
  FiCpu,
  FiCheckCircle,
  FiMap,
  FiFileText,
  FiTrendingUp,
  FiShield,
  FiRefreshCw,
  FiLock,
  FiDollarSign,
  FiMail,
  FiInstagram,
  FiArrowRight,
  FiHeart,
  FiClock,
} from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GovtExamPath',
  url: 'https://govtexampath.com',
  logo: 'https://govtexampath.com/logo512.png',
  description:
    "India's free AI-powered career guidance platform for government exam aspirants. Explore 200+ exams, check eligibility, get personalized recommendations, and access free preparation resources.",
  foundingDate: '2024',
  email: 'govtexampath@gmail.com',
  sameAs: ['https://instagram.com/govtexampath'],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'govtexampath@gmail.com',
    contactType: 'customer support',
    availableLanguage: ['English', 'Hindi'],
  },
  founder: [
    {
      '@type': 'Person',
      name: 'Sanjana Sarvani',
      jobTitle: 'Founder & Content Lead',
    },
  ],
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    value: 3,
  },
};

const features = [
  {
    icon: FiCpu,
    title: 'AI Career Guide',
    description:
      'Get personalized exam recommendations powered by AI. Answer a few questions about your education, age, and interests, and our guide maps out the best government exams for you.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: FiCheckCircle,
    title: 'Eligibility Checker',
    description:
      'Instantly verify which government exams you qualify for. We cross-check your age, educational qualification, and reservation category against official criteria.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: FiMap,
    title: 'Syllabus Mind Maps',
    description:
      'Visualize complex syllabi through interactive mind maps. Break down subjects into digestible topics and plan your preparation strategy effectively.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: FiBookOpen,
    title: 'Free Study Resources',
    description:
      'Access curated study materials, previous year papers, book recommendations, and direct links to official sources — all organized by exam and subject.',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: FiTrendingUp,
    title: 'Current Affairs',
    description:
      'Stay updated with daily current affairs tailored for government exam preparation. We cover national, international, economy, science, and sports news.',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    icon: FiFileText,
    title: 'Expert Blog & Guides',
    description:
      'Read in-depth preparation guides, exam strategies, and success stories written by subject experts and successful candidates.',
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
];

const trustSignals = [
  {
    icon: FiShield,
    title: 'Data from Official Sources',
    description:
      'Every exam detail — eligibility, age limits, syllabus, and dates — is sourced directly from official bodies like UPSC, SSC, IBPS, RBI, RRB, and state PSCs.',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: FiRefreshCw,
    title: 'Regular Updates',
    description:
      'Our research team reviews and updates exam data daily. When official notifications change, our platform reflects it within hours, not weeks.',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    icon: FiDollarSign,
    title: 'No Hidden Fees',
    description:
      'GovtExamPath is and will always be 100% free. No premium tiers, no paywall, no "unlock full features" tricks. Every tool is open to every aspirant.',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: FiLock,
    title: 'Privacy First',
    description:
      'We never sell, share, or misuse your personal data. Your preparation journey and profile information remain strictly private and secure.',
    color: 'text-purple-600 dark:text-purple-400',
  },
];

const teamMembers = [
  {
    name: 'Sanjana Sarvani',
    role: 'Founder & Content Lead',
    initials: 'SS',
    gradient: 'from-blue-500 to-indigo-600',
    bio: 'Passionate about making government exam guidance accessible to every aspirant in India. Sanjana leads content strategy and ensures every piece of information on the platform is accurate, helpful, and easy to understand.',
  },
  {
    name: 'Rahul Mehta',
    role: 'Technology Lead',
    initials: 'RM',
    gradient: 'from-green-500 to-teal-600',
    bio: 'The engineer behind GovtExamPath. Rahul builds and maintains the platform, develops our AI-powered tools, and ensures a fast and seamless experience for users across all devices.',
  },
  {
    name: 'Priya Singh',
    role: 'Research & Data',
    initials: 'PS',
    gradient: 'from-orange-500 to-red-500',
    bio: 'Priya maintains our exam database with meticulous attention to detail. She tracks official notifications daily, verifies eligibility criteria, and ensures every data point is up to date.',
  },
];

const stats = [
  { value: '10,000+', label: 'Students Guided', icon: FiUsers },
  { value: '200+', label: 'Exams Covered', icon: FiBookOpen },
  { value: '16', label: 'Exam Categories', icon: FiTarget },
  { value: 'Daily', label: 'Content Updates', icon: FiClock },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Us"
        path="/about"
        description="Learn about GovtExamPath — India's free AI-powered career guidance platform for government exam aspirants. Discover our mission, story, team, and how we help 10,000+ students find their dream government job."
        jsonLd={orgJsonLd}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'About Us' }]} />

        {/* Hero Section */}
        <section className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden mb-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              About GovtExamPath
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              India's free AI-powered career guidance platform helping government exam aspirants navigate 200+ exams and find the right path to their dream job.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Make government exam guidance accessible to every student in India, for free. Every year, crores of aspirants prepare for government exams — UPSC, SSC, Banking, Railways, Defence, and more. Many lack access to quality guidance, especially students from smaller towns and rural areas. We are here to change that.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { number: '10,000+', label: 'Students Guided', icon: FiUsers, color: 'text-blue-500' },
              { number: '200+', label: 'Exams Covered', icon: FiBookOpen, color: 'text-green-500' },
              { number: '16', label: 'Exam Categories', icon: FiTarget, color: 'text-purple-500' },
              { number: '100%', label: 'Free Forever', icon: FiHeart, color: 'text-red-500' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 text-center"
              >
                <item.icon className={`w-7 h-7 ${item.color} mx-auto mb-2`} />
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  {item.number}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 sm:p-10 lg:p-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
              Our <span className="gradient-text">Story</span>
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
              <p>
                GovtExamPath was born from a firsthand observation that still drives us today: <strong className="text-gray-900 dark:text-gray-200">millions of talented aspirants across India struggle not because they lack ability, but because they lack guidance.</strong>
              </p>
              <p>
                Our founding team noticed a stark contrast. Students in metro cities had access to coaching centres, mentors, and peer networks that helped them navigate the complex landscape of government examinations. But aspirants from Tier 2 and Tier 3 cities — from places like Jhansi, Raipur, Salem, and Siliguri — were often left on their own. They spent weeks, sometimes months, just figuring out which exams they were even eligible for.
              </p>
              <p>
                With over 200 government exams spread across 16 categories — each with different eligibility criteria, age limits, educational requirements, and reservation rules — the landscape is genuinely overwhelming. A graduate from a small town in Bihar deserves the same clarity about their career options as someone with access to Delhi's top coaching institutes.
              </p>
              <p>
                That conviction became GovtExamPath. We started as a passion project, manually compiling exam data from official notifications issued by UPSC, SSC, IBPS, RBI, RRB, state PSCs, and dozens of other recruiting bodies. Then we built AI-powered tools to make this information truly actionable — from personalized career recommendations to instant eligibility checking.
              </p>
              <p>
                Today, we serve <strong className="text-gray-900 dark:text-gray-200">thousands of students across India</strong> with our free tools and resources. But we are just getting started. Our vision is a future where no aspirant in India is held back by a lack of information — where every student, regardless of where they live, has a clear, organized, and personalized path to their dream government job.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              What We <span className="gradient-text">Offer</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive suite of free tools and resources designed to support every stage of your government exam preparation journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Trust Us Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Why <span className="gradient-text">Trust Us</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Your preparation time is precious. Here is why thousands of aspirants rely on GovtExamPath.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trustSignals.map((signal) => (
              <div
                key={signal.title}
                className="flex gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex-shrink-0 mt-1">
                  <signal.icon className={`w-7 h-7 ${signal.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {signal.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A small, dedicated team working to make government exam guidance accessible to every aspirant in India.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center"
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <span className="text-2xl font-bold text-white">{member.initials}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10">
              Platform at a Glance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Links / Connect With Us */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Connect With <span className="gradient-text">Us</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Have questions, feedback, or suggestions? We would love to hear from you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://instagram.com/govtexampath"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <FiInstagram className="w-5 h-5" />
              Follow on Instagram
            </a>
            <a
              href="mailto:govtexampath@gmail.com"
              className="flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm hover:shadow-md transition-all"
            >
              <FiMail className="w-5 h-5" />
              govtexampath@gmail.com
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl border border-blue-200 dark:border-blue-800 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Join Thousands of Aspirants
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
              Start your government exam preparation journey today. Use our free tools to discover the best exams for you, check your eligibility, and get personalized career guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/register"
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Create Free Account
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ai-guide"
                className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm hover:shadow-md transition-all"
              >
                <FiCpu className="w-4 h-4" />
                AI Career Guide
              </Link>
              <Link
                to="/eligibility-checker"
                className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm hover:shadow-md transition-all"
              >
                <FiCheckCircle className="w-4 h-4" />
                Eligibility Checker
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
