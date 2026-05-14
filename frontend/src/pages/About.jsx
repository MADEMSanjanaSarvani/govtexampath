import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiAward, FiCpu, FiCheckSquare, FiMap, FiGlobe, FiShield, FiHeart, FiMail, FiInstagram } from 'react-icons/fi';
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
    icon: FiCheckSquare,
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
    title: 'Study Resources',
    description:
      'Access curated study materials, previous year papers, book recommendations, and direct links to official sources -- all organized by exam and subject.',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: FiGlobe,
    title: 'Current Affairs',
    description:
      'Stay updated with daily current affairs tailored for government exam preparation. We cover national, international, economy, science, and sports news.',
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: FiAward,
    title: 'Expert Blog',
    description:
      'Read in-depth preparation guides, exam strategies, and success stories written by subject experts and successful candidates.',
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
];

const trustItems = [
  {
    icon: FiShield,
    title: 'Official Sources',
    description:
      'Every exam detail -- eligibility, age limits, syllabus, and dates -- is sourced directly from official bodies like UPSC, SSC, IBPS, and RBI.',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: FiGlobe,
    title: 'Always Updated',
    description:
      'Our research team reviews and updates exam data daily. When official notifications change, our platform reflects it within hours.',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    icon: FiHeart,
    title: '100% Free Forever',
    description:
      'GovtExamPath is and will always be completely free. No premium tiers, no paywall, no hidden charges. Every tool is open to every aspirant.',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: FiShield,
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
    initial: 'S',
    gradient: 'from-pink-500 to-rose-600',
    bio: 'Drives content strategy and ensures every piece of guidance on the platform is accurate, accessible, and actionable for aspirants across India.',
  },
  {
    name: 'Rahul Mehta',
    role: 'Technology Lead',
    initial: 'R',
    gradient: 'from-blue-500 to-indigo-600',
    bio: 'Builds and maintains the platform, develops AI-powered tools, and ensures a fast, seamless experience for users on every device.',
  },
  {
    name: 'Priya Singh',
    role: 'Research & Data',
    initial: 'P',
    gradient: 'from-green-500 to-emerald-600',
    bio: 'Tracks official notifications daily, verifies eligibility criteria, and maintains the exam database with meticulous attention to detail.',
  },
];

const stats = [
  { value: '10,000+', label: 'Students Guided' },
  { value: '200+', label: 'Exams Covered' },
  { value: '16', label: 'Exam Categories' },
  { value: 'Daily', label: 'Content Updates' },
];

const About = () => {
  return (
    <div className="min-h-screen">
      {/* SEO & Breadcrumb */}
      <SEO
        title="About Us"
        path="/about"
        description="Learn about GovtExamPath — India's free AI-powered career guidance platform for government exam aspirants. Discover our mission, story, team, and how we help 10,000+ students find their dream government job."
        jsonLd={orgJsonLd}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'About Us' }]} />

        {/* Hero Section */}
        <section className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden mb-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              About GovtExamPath
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              India's free career guidance platform helping government exam aspirants navigate 200+ exams and find the right path to their dream job.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>
                Every year, crores of aspirants prepare for government examinations -- UPSC, SSC, Banking, Railways, Defence, Teaching, and more. Yet a vast number of them struggle not because they lack talent, but because they lack clear, reliable guidance. This gap is especially wide for students in Tier 2 and Tier 3 cities, where access to quality coaching and mentorship remains limited. GovtExamPath exists to close that gap by making comprehensive exam guidance available to every aspirant, completely free of cost.
              </p>
              <p>
                We believe that a graduate from a small town in Bihar or Rajasthan deserves the same clarity about career options as someone with access to Delhi's top coaching institutes. Our platform brings together verified exam data, AI-powered career tools, and curated study resources so that no aspirant is held back by a lack of information. Whether you are just starting your preparation or looking to discover new opportunities, GovtExamPath is built to guide you at every step.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 text-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
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
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4`}
                >
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
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex-shrink-0 mt-1">
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              Our <span className="gradient-text">Team</span>
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
                  <span className="text-2xl font-bold text-white">
                    {member.initial}
                  </span>
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

        {/* Connect With Us Section */}
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
          <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden p-8 sm:p-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full -translate-x-1/3 translate-y-1/3" />
            </div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Start Your Journey Today
              </h2>
              <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
                Discover the best government exams for you, check your eligibility instantly, and get personalized career guidance -- all for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  to="/eligibility-checker"
                  className="flex items-center gap-2 px-6 py-3.5 bg-white text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all"
                >
                  <FiCheckSquare className="w-4 h-4" />
                  Eligibility Checker
                </Link>
                <Link
                  to="/ai-guide"
                  className="flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all"
                >
                  <FiCpu className="w-4 h-4" />
                  AI Career Guide
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
