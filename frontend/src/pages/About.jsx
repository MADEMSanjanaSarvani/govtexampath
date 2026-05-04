import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiUsers, FiBookOpen, FiAward } from 'react-icons/fi';
import SEO from '../components/common/SEO';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="About Us" path="/about" description="Learn about GovtExamPath — India's free career guidance platform for government exam aspirants. Our mission, team, and how we help lakhs of students." />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
          About <span className="gradient-text">GovtExamPath</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          India's free career guidance platform helping government exam aspirants find the right path to their dream job.
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <h2>Our Mission</h2>
        <p>
          GovtExamPath was built with a simple mission: <strong>make government exam guidance accessible to every student in India, for free.</strong> Every year, crores of aspirants prepare for government exams — UPSC, SSC, Banking, Railways, Defence, and more. Many of them lack access to quality guidance, especially students from Tier 2 and Tier 3 cities.
        </p>
        <p>
          We bridge that gap by providing AI-powered career recommendations, eligibility checking, interactive syllabus mind maps, curated study resources, daily current affairs, and expert preparation guides — all completely free.
        </p>

        <h2>What We Offer</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <FiTarget className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">AI Career Guide</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Personalized exam recommendations based on your education, age, and career interests using AI-powered analysis.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <FiUsers className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Eligibility Checker</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Instantly check which government exams you qualify for based on your age, qualification, and reservation category.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <FiBookOpen className="w-8 h-8 text-orange-500 mb-3" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Free Study Resources</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Access 24+ study materials, previous year papers, and book recommendations linked directly to official sources.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <FiAward className="w-8 h-8 text-purple-500 mb-3" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">200+ Exam Coverage</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive coverage across UPSC, SSC, Banking, Railways, Defence, State PSC, Teaching, Police, Insurance, PSU, Regulatory Bodies, Judiciary, Healthcare, Postal, Agriculture, and more.</p>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <h2>Why GovtExamPath?</h2>
        <ul>
          <li><strong>100% Free</strong> — No hidden charges, no premium plans. All features are accessible to everyone.</li>
          <li><strong>Accurate & Updated</strong> — Exam data is regularly verified against official sources like SSC, UPSC, IBPS, and RBI.</li>
          <li><strong>Built for India</strong> — Designed specifically for Indian government exam aspirants with local language support planned.</li>
          <li><strong>Privacy First</strong> — We don't sell your data. Your preparation journey stays private.</li>
        </ul>

        <h2>Our Story</h2>
        <p>
          GovtExamPath started as a passion project by a team of government exam enthusiasts who saw firsthand how confusing the landscape of government exams can be. With 200+ exams across 16 categories, each with different eligibility criteria, age limits, and reservation rules, aspirants often spend weeks just figuring out which exams they can apply for.
        </p>
        <p>
          We built GovtExamPath to solve this problem — giving aspirants a clear, organized, and personalized path to their dream government job. Today, we serve thousands of students across India with our free tools and resources.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Start Your Journey Today</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-5">Use our free tools to discover the best government exams for you.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/eligibility-checker" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
            Check Eligibility
          </Link>
          <Link to="/ai-guide" className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-all">
            AI Career Guide
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
