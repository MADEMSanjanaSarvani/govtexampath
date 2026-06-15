import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiDatabase, FiSettings, FiShare2, FiLock, FiToggleLeft, FiMonitor, FiUser, FiUsers, FiRefreshCw, FiMail, FiChevronRight, FiHelpCircle, FiArrowUp } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

const sections = [
  {
    id: 'information-we-collect',
    number: 1,
    title: 'Information We Collect',
    icon: FiDatabase,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">When you use GovtExamPath, we may collect the following information:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Account Information:</strong> <span className="text-gray-600 dark:text-gray-300">Name, email address, and password when you create an account.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Usage Data:</strong> <span className="text-gray-600 dark:text-gray-300">Pages visited, features used, and time spent on the platform (collected via Google Analytics).</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Device Information:</strong> <span className="text-gray-600 dark:text-gray-300">Browser type, operating system, and screen resolution for improving user experience.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Preferences:</strong> <span className="text-gray-600 dark:text-gray-300">Bookmarked exams, notification preferences, and eligibility checker inputs.</span></span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-your-information',
    number: 2,
    title: 'How We Use Your Information',
    icon: FiSettings,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">We use collected information to:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Provide personalized exam recommendations through our Career Guide.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Save your bookmarks and notification preferences.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Send exam notification alerts you've subscribed to.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Improve our platform features and content based on usage patterns.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Respond to your questions and support requests.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'information-sharing',
    number: 3,
    title: 'Information Sharing',
    icon: FiShare2,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">We <strong className="text-gray-900 dark:text-white">do not sell, trade, or rent</strong> your personal information to third parties. We may share anonymized, aggregated data for analytics purposes. We use the following third-party services:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Google Analytics</strong> <span className="text-gray-600 dark:text-gray-300">— For understanding site usage and improving features.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Firebase Hosting</strong> <span className="text-gray-600 dark:text-gray-300">— For hosting the website.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Render</strong> <span className="text-gray-600 dark:text-gray-300">— For hosting backend services.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">MongoDB Atlas</strong> <span className="text-gray-600 dark:text-gray-300">— For secure database storage.</span></span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-security',
    number: 4,
    title: 'Data Security',
    icon: FiLock,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">We implement industry-standard security measures to protect your data:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Passwords are hashed using bcrypt and never stored in plain text.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">HTTPS encryption for all data in transit.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">JWT (JSON Web Tokens) for secure authentication.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Rate limiting to prevent abuse.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Regular security reviews of our codebase.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies-and-tracking',
    number: 5,
    title: 'Cookies and Tracking Technologies',
    icon: FiToggleLeft,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">We use cookies and local storage for:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Keeping you logged in (authentication tokens).</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Remembering your dark/light theme preference.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Google Analytics tracking (you can opt out using browser settings).</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'advertising-and-google-adsense',
    number: 6,
    title: 'Advertising and Google AdSense',
    icon: FiMonitor,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">GovtExamPath uses Google AdSense to display advertisements. Google AdSense is a third-party advertising service provided by Google LLC. Regarding advertising on our platform:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Third-party cookies:</strong> <span className="text-gray-600 dark:text-gray-300">Google and its advertising partners may use cookies, web beacons, and similar technologies to serve advertisements based on your prior visits to our website and other websites on the internet.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Personalized advertising:</strong> <span className="text-gray-600 dark:text-gray-300">Google may use the DART cookie and other technologies to display ads based on your browsing history and interests. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">Google's Ad Settings</a>.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Third-party ad networks:</strong> <span className="text-gray-600 dark:text-gray-300">Third-party vendors, including Google, use cookies to serve ads based on your prior visits. You can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">aboutads.info</a>.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">Data collection by advertisers:</strong> <span className="text-gray-600 dark:text-gray-300">Advertisers and ad networks may collect information such as your IP address, browser type, pages visited, and interaction with ads. This data collection is governed by the respective advertisers' privacy policies.</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong className="text-gray-900 dark:text-white">No control over ad content:</strong> <span className="text-gray-600 dark:text-gray-300">We do not control the content of advertisements displayed by Google AdSense. If you encounter inappropriate ads, please report them to us or directly to Google.</span></span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    number: 7,
    title: 'Your Rights',
    icon: FiUser,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">You have the right to:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Access your personal data stored on our platform.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Update or correct your account information.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Delete your account and associated data.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Opt out of email notifications.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Disable cookies through your browser settings.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'childrens-privacy',
    number: 8,
    title: "Children's Privacy",
    icon: FiUsers,
    content: (
      <p className="text-gray-600 dark:text-gray-300">GovtExamPath is intended for users aged 14 and above. We do not knowingly collect information from children under 14. If you are under 14, please use our platform with parental guidance.</p>
    ),
  },
  {
    id: 'changes-to-this-policy',
    number: 9,
    title: 'Changes to This Policy',
    icon: FiRefreshCw,
    content: (
      <p className="text-gray-600 dark:text-gray-300">We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of the platform after changes constitutes acceptance of the revised policy.</p>
    ),
  },
  {
    id: 'contact-us',
    number: 10,
    title: 'Contact Us',
    icon: FiMail,
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-300 mb-4">If you have questions about this privacy policy or your personal data, contact us at:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Email: <a href="mailto:govtexampath@gmail.com" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">govtexampath@gmail.com</a></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">Address: New Delhi, India</span>
          </li>
        </ul>
      </>
    ),
  },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sectionElements = sections.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, el } = sectionElements[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO title="Privacy Policy" path="/privacy-policy" description="GovtExamPath privacy policy. Learn how we collect, use, and protect your personal information." />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

        <div className="relative mt-6 mb-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-10 translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white opacity-5 -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <FiShield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Privacy <span className="text-blue-200">Policy</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-5">
              Your privacy matters to us. Here's how we protect your data.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white">
              Last updated: June 13, 2026
            </span>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  activeSection === section.id
                    ? 'bg-white/25 text-white'
                    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                }`}>
                  {section.number}
                </span>
                <span className="hidden sm:inline">{section.title}</span>
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
                className={`group rounded-xl border transition-all duration-300 scroll-mt-28 ${
                  isAlt
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                } hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50`}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/25">
                        {section.number}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white pt-1.5">
                      {section.title}
                    </h2>
                  </div>
                  <div className="pl-0 sm:pl-[5.75rem]">
                    {section.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white opacity-10 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white opacity-10 translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <FiHelpCircle className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Have Questions?</h3>
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-6">
              We're here to help. Reach out to us if you have any questions about your privacy or data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <FiMail className="h-4 w-4" />
                Contact Us
                <FiChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/25 transition-colors duration-200"
              >
                <FiHelpCircle className="h-4 w-4" />
                Visit FAQ
                <FiChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default PrivacyPolicy;
