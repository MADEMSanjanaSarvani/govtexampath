import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiDatabase,
  FiCpu,
  FiCheckSquare,
  FiExternalLink,
  FiEdit,
  FiBriefcase,
  FiAward,
  FiMonitor,
  FiUsers,
  FiShield,
  FiRefreshCw,
  FiMail,
} from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

const sections = [
  {
    number: 1,
    icon: FiInfo,
    title: 'General Information Disclaimer',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          GovtExamPath is an independent educational platform that provides information about Indian government examinations. We are <strong className="text-gray-900 dark:text-white">not affiliated with, endorsed by, or officially connected to</strong> any government body, public service commission, recruitment board, or exam conducting organization including but not limited to:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Union Public Service Commission (UPSC)',
            'Staff Selection Commission (SSC)',
            'Institute of Banking Personnel Selection (IBPS)',
            'Reserve Bank of India (RBI)',
            'Railway Recruitment Boards (RRBs)',
            'State Public Service Commissions (PSCs)',
            'Securities and Exchange Board of India (SEBI)',
            'National Testing Agency (NTA)',
            'Any other government or semi-government recruitment organization',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          All logos, trademarks, and organization names mentioned on this platform belong to their respective owners.
        </p>
      </>
    ),
  },
  {
    number: 2,
    icon: FiDatabase,
    title: 'Exam Information Accuracy',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          We make every effort to ensure the accuracy and timeliness of exam information displayed on our platform, including eligibility criteria, age limits, application fees, important dates, syllabus, exam patterns, and vacancy details. However:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Exam conducting bodies may change rules, criteria, dates, or other details at any time without prior notice.',
            'There may be a delay between official updates and our platform updates.',
            'Information on our platform may contain inadvertent errors or omissions.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
          <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
            <strong className="text-gray-900 dark:text-white">We strongly recommend that users always refer to the official notification and website of the respective exam conducting body for the most current and authoritative information before submitting applications or making decisions.</strong>
          </li>
        </ul>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          GovtExamPath shall not be held responsible for any loss, damage, or inconvenience caused by reliance on information provided on this platform.
        </p>
      </>
    ),
  },
  {
    number: 3,
    icon: FiCpu,
    title: 'Career Guide Disclaimer',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Our Career Guide provides exam recommendations based on your profile (age, education, preferences, etc.). Please understand that:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            <>Recommendations are generated based on your inputs and are <strong className="text-gray-900 dark:text-white">suggestions only</strong>, not professional career counseling or advice.</>,
            'The system may not account for all individual circumstances, recent policy changes, or specific state-level variations.',
            'Recommendations should be used as a starting point for your own research, not as a definitive career plan.',
            'We do not guarantee that pursuing any recommended exam will result in selection or employment.',
            'For comprehensive career guidance, we recommend consulting qualified career counselors and official exam authorities.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: 4,
    icon: FiCheckSquare,
    title: 'Eligibility Checker Disclaimer',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Our Eligibility Checker tool provides <strong className="text-gray-900 dark:text-white">indicative results</strong> based on the general eligibility criteria in our database matched against the information you provide. Important caveats:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Results are approximate and should not be considered as official eligibility confirmation.',
            'Eligibility criteria can vary by specific post, department, and year of examination.',
            'Reservation category relaxations (age, fee, attempts) are applied based on general government norms and may differ for specific exams.',
            'Official eligibility is determined solely by the respective exam conducting body during the application review process.',
            'Always check the official notification for the exact eligibility requirements before applying.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: 5,
    icon: FiExternalLink,
    title: 'Study Resources and External Links',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          GovtExamPath provides curated links to free study materials, previous year question papers, book recommendations, and external educational resources. Regarding these resources:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'We do not host or own most external study materials; we link to officially available or widely recognized free resources.',
            'External websites have their own terms of service and privacy policies that are beyond our control.',
            'We do not guarantee the availability, accuracy, or quality of content on external websites.',
            'Links are provided for convenience and do not imply endorsement of the linked site or its content.',
            'If you find any broken link or inappropriate content, please report it to us.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: 6,
    icon: FiEdit,
    title: 'Blog and Article Content',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Articles, preparation strategies, study timetables, book recommendations, exam comparisons, and tips published on our blog are:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Based on general best practices, publicly available topper strategies, and educational research.',
            'Written for educational and informational purposes only.',
            'Not guaranteed to produce specific results in any examination.',
            'General in nature and may need to be adapted to your individual learning style, available time, and current preparation level.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          Every aspirant's journey is different. What works for one candidate may not work for another. Use our content as guidance while developing your own personalized preparation strategy.
        </p>
      </>
    ),
  },
  {
    number: 7,
    icon: FiBriefcase,
    title: 'No Professional Advice',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Nothing on GovtExamPath constitutes:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Professional career counseling or advice',
            'Legal advice regarding government employment regulations',
            'Financial advice regarding exam fees, coaching investments, or career earnings',
            'Medical advice regarding fitness criteria for specific posts (e.g., Defence, Police)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          For professional advice in these areas, please consult qualified professionals.
        </p>
      </>
    ),
  },
  {
    number: 8,
    icon: FiAward,
    title: 'No Guarantee of Results',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          GovtExamPath provides tools and information to assist in your preparation journey. However, we do not guarantee:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Selection in any government examination',
            'Achievement of specific scores or ranks',
            'Employment in any government position',
            'That our preparation strategies will be effective for every individual',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          Success in government examinations depends on numerous factors including individual effort, preparation quality, competition level, and official selection criteria.
        </p>
      </>
    ),
  },
  {
    number: 9,
    icon: FiMonitor,
    title: 'Advertising Disclaimer',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          GovtExamPath may display advertisements served by third-party advertising networks, including Google AdSense. These advertisements help us maintain and improve our free platform. Please note:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Advertisements are served by third-party networks and their content is not controlled, reviewed, or endorsed by GovtExamPath.',
            'We are not responsible for the accuracy, content, or practices of advertisers.',
            'Clicking on advertisements and any subsequent transactions are entirely at your own risk and discretion.',
            'Third-party advertisers may use cookies and tracking technologies subject to their own privacy policies.',
            'The presence of an advertisement on our platform does not constitute a recommendation or endorsement of the advertised product or service.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: 10,
    icon: FiUsers,
    title: 'User-Generated Content',
    content: (
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        If users submit any content through our platform (such as comments, queries through the contact form, or feedback), they grant GovtExamPath a non-exclusive, royalty-free right to use, display, and distribute that content. Users are solely responsible for the content they submit and must ensure it does not violate any laws or third-party rights.
      </p>
    ),
  },
  {
    number: 11,
    icon: FiShield,
    title: 'Limitation of Liability',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          To the maximum extent permitted by applicable Indian law, GovtExamPath, its founders, team members, contributors, and affiliates shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages, including but not limited to:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Loss arising from missed application deadlines based on dates displayed on our platform',
            'Incorrect eligibility assessment leading to wasted application fees',
            'Reliance on outdated exam information',
            'Any decision made based on AI recommendations or eligibility checker results',
            'Technical errors, server downtime, or data loss',
            'Actions taken based on blog articles or preparation advice',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: 12,
    icon: FiRefreshCw,
    title: 'Changes to This Disclaimer',
    content: (
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        We reserve the right to update or modify this Disclaimer at any time without prior notice. Changes will be posted on this page with an updated revision date. Your continued use of GovtExamPath after any changes constitutes acceptance of the updated Disclaimer.
      </p>
    ),
  },
  {
    number: 13,
    icon: FiMail,
    title: 'Contact Us',
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          If you have any questions or concerns about this Disclaimer, please contact us at:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
            Email: <a href="mailto:govtexampath@gmail.com" className="text-amber-600 dark:text-amber-400 hover:underline font-medium">govtexampath@gmail.com</a>
          </li>
          <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
            Address: New Delhi, India
          </li>
        </ul>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          By using GovtExamPath, you acknowledge that you have read and understood this Disclaimer.
        </p>
      </>
    ),
  },
];

const Disclaimer = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Disclaimer"
        path="/disclaimer"
        description="GovtExamPath disclaimer. Important information about the accuracy of exam data, AI recommendations, and content on our platform."
      />
      <Breadcrumb items={[{ label: 'Disclaimer' }]} />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 sm:p-12 mb-10">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white opacity-10" />
        <div className="absolute top-1/2 right-1/4 h-24 w-24 rounded-full bg-white opacity-10" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-white/20 mb-5">
            <FiAlertTriangle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Disclaimer</h1>
          <p className="text-amber-100 text-lg max-w-2xl">
            Important information about the content and services on GovtExamPath.
          </p>
          <span className="inline-block mt-5 px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium text-white backdrop-blur-sm">
            Last updated: June 13, 2026
          </span>
        </div>
      </div>

      <div className="mb-8 flex items-start gap-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-5 sm:p-6">
        <FiAlertCircle className="h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">Important Notice</p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            GovtExamPath is an independent educational platform and is <strong className="text-gray-900 dark:text-white">NOT</strong> affiliated with any government body. The information provided on GovtExamPath (<strong className="text-gray-900 dark:text-white">govtexampath.com</strong>) is for general informational and educational purposes only. Please read this disclaimer carefully before using our platform.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isEven = index % 2 === 0;
          return (
            <div
              key={section.number}
              className={`group rounded-xl border transition-all duration-200 hover:shadow-lg ${
                isEven
                  ? 'border-amber-100 dark:border-amber-900/30 bg-white dark:bg-gray-800'
                  : 'border-orange-100 dark:border-orange-900/30 bg-orange-50/30 dark:bg-orange-900/10'
              }`}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-bold shadow-sm">
                    {section.number}
                  </div>
                  <div className="flex items-center gap-3 pt-1.5">
                    <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="ml-14">{section.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 sm:p-10 text-center">
        <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white opacity-10" />
        <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white opacity-10" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-3">Have Concerns?</h3>
          <p className="text-amber-100 mb-6 max-w-lg mx-auto">
            If you have any questions about this disclaimer or need clarification, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-amber-700 font-semibold shadow-lg hover:shadow-xl hover:bg-amber-50 transition-all duration-200"
            >
              <FiMail className="h-5 w-5" />
              Contact Us
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-semibold backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
            >
              <FiInfo className="h-5 w-5" />
              Visit FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
