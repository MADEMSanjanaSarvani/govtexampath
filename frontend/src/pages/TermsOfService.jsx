import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import {
  FiFileText, FiList, FiUser, FiAlertTriangle, FiBook, FiInfo,
  FiCpu, FiEdit, FiExternalLink, FiMonitor, FiShield, FiAnchor,
  FiRefreshCw, FiXCircle, FiMapPin, FiScissors, FiCheckCircle, FiMail
} from 'react-icons/fi';

const sections = [
  {
    id: 'description',
    number: 1,
    title: 'Description of Service',
    icon: FiList,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">GovtExamPath is a free educational platform designed to assist Indian government exam aspirants. Our services include:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span><strong className="text-gray-900 dark:text-white">Exam Information Database:</strong> <span className="text-gray-600 dark:text-gray-300">Comprehensive details on 200+ government exams across 16 categories including UPSC, SSC, Banking, Railways, Defence, State PSC, Teaching, Police, Insurance, PSU, Regulatory Bodies, Judiciary, Healthcare, Postal, Agriculture, and more.</span></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span><strong className="text-gray-900 dark:text-white">AI-Powered Career Guide:</strong> <span className="text-gray-600 dark:text-gray-300">Personalized exam recommendations based on your qualifications, age, and career preferences using artificial intelligence algorithms.</span></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span><strong className="text-gray-900 dark:text-white">Eligibility Checker:</strong> <span className="text-gray-600 dark:text-gray-300">A tool to check your eligibility for various government exams based on age, education, and category.</span></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span><strong className="text-gray-900 dark:text-white">Study Resources:</strong> <span className="text-gray-600 dark:text-gray-300">Curated links to free study materials, previous year papers, and book recommendations from official and trusted sources.</span></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span><strong className="text-gray-900 dark:text-white">Interactive Mind Maps:</strong> <span className="text-gray-600 dark:text-gray-300">Visual syllabus breakdowns for major examinations to aid structured preparation.</span></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span><strong className="text-gray-900 dark:text-white">Blog &amp; Preparation Guides:</strong> <span className="text-gray-600 dark:text-gray-300">Original articles with exam strategies, preparation tips, comparison guides, and expert advice.</span></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span><strong className="text-gray-900 dark:text-white">Current Affairs:</strong> <span className="text-gray-600 dark:text-gray-300">Daily and monthly current affairs compilations relevant to government exam preparation.</span></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span><strong className="text-gray-900 dark:text-white">Exam Notifications:</strong> <span className="text-gray-600 dark:text-gray-300">Real-time alerts about new exam notifications, application deadlines, and result announcements.</span></span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'user-accounts',
    number: 2,
    title: 'User Accounts',
    icon: FiUser,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">To access certain features such as bookmarks, personalized dashboard, and exam notifications, you may need to create a free account. When creating an account:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">You must provide accurate and complete information including your name and email address.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">You are responsible for maintaining the security and confidentiality of your password.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">You are responsible for all activities that occur under your account.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">You must notify us immediately of any unauthorized access to your account.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">You must be at least 14 years of age to create an account. Users under 18 should use the platform with parental guidance.</span></li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mt-4">We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent or abusive behavior.</p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    number: 3,
    title: 'Acceptable Use Policy',
    icon: FiAlertTriangle,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">You agree to use GovtExamPath only for lawful purposes. You must not:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Use the platform to distribute spam, malware, or harmful content.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Attempt to gain unauthorized access to our systems, servers, or other user accounts.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Scrape, crawl, or use automated tools to extract data from the platform without written permission.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Reproduce, redistribute, or commercially exploit our content without authorization.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Impersonate any person or entity, or falsely represent your affiliation with any person or entity.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Use the platform in any way that could damage, disable, or impair our services.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Upload or transmit viruses, worms, or other malicious code.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Harass, abuse, or threaten other users of the platform.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    number: 4,
    title: 'Intellectual Property Rights',
    icon: FiBook,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">All content on GovtExamPath, including but not limited to text, articles, blog posts, graphics, logos, user interface design, software code, mind maps, and data compilations, is the intellectual property of GovtExamPath or its content creators and is protected by Indian copyright and intellectual property laws.</p>
        <p className="text-gray-700 dark:text-gray-200 font-semibold mb-2">You may:</p>
        <ul className="space-y-3 mb-4">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">View and use the content for personal, non-commercial educational purposes.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Share links to our pages on social media and other platforms.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Print or download content for your personal study use.</span></li>
        </ul>
        <p className="text-gray-700 dark:text-gray-200 font-semibold mb-2">You may not:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Copy, reproduce, or redistribute our content for commercial purposes.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Create derivative works based on our content without permission.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Remove any copyright or proprietary notices from our materials.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'exam-disclaimer',
    number: 5,
    title: 'Exam Information Disclaimer',
    icon: FiInfo,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">GovtExamPath compiles exam information from official government sources including UPSC, SSC, IBPS, RBI, SEBI, Railway Recruitment Boards, State Public Service Commissions, and other conducting bodies. While we strive to keep all information accurate and up-to-date:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Exam details such as eligibility criteria, age limits, application fees, syllabus, exam patterns, and important dates may change without prior notice by the respective conducting bodies.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Users must always verify information from the official exam notification and conducting body website before making any decisions or submitting applications.</strong></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">GovtExamPath is not affiliated with any government body, recruitment agency, or exam conducting organization.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">We do not guarantee the accuracy, completeness, or timeliness of any exam information displayed on our platform.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'ai-disclaimer',
    number: 6,
    title: 'AI-Powered Features Disclaimer',
    icon: FiCpu,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Our Career Guide and Eligibility Checker use algorithms to analyze user-provided information and match it against our exam database. Please note:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">AI recommendations are suggestions based on the data you provide and our exam criteria database. They are <strong className="text-gray-900 dark:text-white">not professional career counseling</strong>.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">The AI may not consider all factors relevant to your individual situation.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Eligibility results are indicative and based on general criteria. Official eligibility is determined solely by the respective exam conducting body upon application review.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">We do not guarantee that following AI recommendations will result in exam selection or career success.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'blog-content',
    number: 7,
    title: 'Blog Content and Preparation Advice',
    icon: FiEdit,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Our blog articles, preparation strategies, study timetables, and tips are based on general best practices, topper interviews, and expert analysis. This content:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Is for educational and informational purposes only.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">May not be suitable for every individual's learning style or circumstances.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Does not guarantee success in any examination.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Should be adapted to your personal strengths, weaknesses, and available preparation time.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'third-party',
    number: 8,
    title: 'Third-Party Links and Resources',
    icon: FiExternalLink,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">GovtExamPath contains links to external websites including official government exam portals, study material providers, and other educational resources. We provide these links for your convenience, but:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">We do not control, endorse, or take responsibility for the content, privacy practices, or availability of third-party websites.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Accessing external links is at your own risk.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">We recommend reviewing the terms and privacy policies of any third-party site you visit.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'advertising',
    number: 9,
    title: 'Advertising',
    icon: FiMonitor,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">GovtExamPath may display advertisements through Google AdSense and other advertising networks to support the free operation of this platform. Regarding advertisements:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">We do not endorse any products or services advertised on our platform.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Ad content is served by third-party advertising networks and is not controlled by GovtExamPath.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Clicking on advertisements is at your own discretion and risk.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Third-party advertisers may use cookies and tracking technologies as described in our Privacy Policy.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'liability',
    number: 10,
    title: 'Limitation of Liability',
    icon: FiShield,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">To the fullest extent permitted by applicable Indian law:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">GovtExamPath is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">We do not warrant that the platform will be uninterrupted, error-free, secure, or free of viruses or other harmful components.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">This includes but is not limited to damages arising from missed application deadlines, incorrect eligibility assessments, reliance on exam information, or following preparation advice.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Our total liability for any claim shall not exceed the amount you paid to use our services (which is zero, as our platform is free).</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'indemnification',
    number: 11,
    title: 'Indemnification',
    icon: FiAnchor,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">You agree to indemnify, defend, and hold harmless GovtExamPath, its founders, team members, and affiliates from any claims, losses, damages, liabilities, costs, or expenses (including legal fees) arising from:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Your use of or access to the platform.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Your violation of these Terms of Service.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Your violation of any applicable law or regulation.</span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Any content you submit or transmit through the platform.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: 'modifications',
    number: 12,
    title: 'Modifications to Terms',
    icon: FiRefreshCw,
    content: (
      <p className="text-gray-600 dark:text-gray-300">We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Your continued use of GovtExamPath after changes are posted constitutes your acceptance of the revised terms. We encourage you to review this page periodically.</p>
    ),
  },
  {
    id: 'termination',
    number: 13,
    title: 'Termination',
    icon: FiXCircle,
    content: (
      <p className="text-gray-600 dark:text-gray-300">We may terminate or suspend your access to GovtExamPath at any time, without prior notice, for any reason, including but not limited to violation of these terms. Upon termination, your right to use the platform ceases immediately. Provisions of these terms that by their nature should survive termination shall survive.</p>
    ),
  },
  {
    id: 'governing-law',
    number: 14,
    title: 'Governing Law and Jurisdiction',
    icon: FiMapPin,
    content: (
      <p className="text-gray-600 dark:text-gray-300">These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these terms or your use of GovtExamPath shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.</p>
    ),
  },
  {
    id: 'severability',
    number: 15,
    title: 'Severability',
    icon: FiScissors,
    content: (
      <p className="text-gray-600 dark:text-gray-300">If any provision of these Terms of Service is found to be unenforceable or invalid by a court of competent jurisdiction, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
    ),
  },
  {
    id: 'entire-agreement',
    number: 16,
    title: 'Entire Agreement',
    icon: FiCheckCircle,
    content: (
      <p className="text-gray-600 dark:text-gray-300">These Terms of Service, together with our Privacy Policy and Disclaimer, constitute the entire agreement between you and GovtExamPath regarding the use of our platform and supersede any prior agreements or understandings.</p>
    ),
  },
  {
    id: 'contact',
    number: 17,
    title: 'Contact Us',
    icon: FiMail,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">If you have questions about these Terms of Service, please contact us at:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Email: <a href="mailto:govtexampath@gmail.com" className="text-purple-600 dark:text-purple-400 hover:underline">govtexampath@gmail.com</a></span></li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" /><span className="text-gray-600 dark:text-gray-300">Address: New Delhi, India</span></li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mt-4">By using GovtExamPath, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
      </>
    ),
  },
];

const TermsOfService = () => {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO title="Terms of Service" path="/terms-of-service" description="GovtExamPath terms of service. Read our terms and conditions for using the platform, user responsibilities, and legal disclaimers." />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Terms of Service' }]} />

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 sm:p-12 mb-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-white/20 rounded-2xl p-4 mb-6">
              <FiFileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Terms of <span className="font-black">Service</span>
            </h1>
            <p className="text-purple-100 text-lg max-w-2xl mb-6">Please read these terms carefully before using GovtExamPath.</p>
            <p className="text-white/80 text-sm mb-4">Welcome to GovtExamPath. By accessing or using our website at <strong className="text-white">govtexampath.com</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform.</p>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
              Last updated: April 24, 2026
            </span>
          </div>
        </div>

        <div className="mb-10 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 dark:hover:border-purple-600 shadow-sm"
              >
                {section.number}. {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isAlt = index % 2 === 1;
            return (
              <div
                key={section.id}
                id={section.id}
                className={`scroll-mt-24 rounded-xl border transition-shadow duration-300 hover:shadow-lg ${isAlt ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'} p-6 sm:p-8`}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-sm font-bold shrink-0">
                    {section.number}
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="pl-14">
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/3" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white opacity-10 rounded-full translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3">Questions about our terms?</h3>
            <p className="text-purple-100 mb-6 max-w-xl mx-auto">We are happy to help clarify anything. Reach out to our team or check our frequently asked questions.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
              >
                <FiMail className="w-4 h-4" />
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
