import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiBookOpen,
  FiAward,
  FiCpu,
  FiCheckSquare,
  FiMap,
  FiGlobe,
  FiShield,
  FiHeart,
  FiMail,
  FiInstagram,
  FiUsers,
  FiClock,
  FiArrowRight,
} from 'react-icons/fi';
import { FaYoutube, FaTelegramPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GovtExamPath',
  url: 'https://govtexampath.com',
  logo: 'https://govtexampath.com/logo512.png',
  description:
    "India's free career guidance platform for government exam aspirants. Explore 200+ exams, check eligibility, find your best-fit exams, and access free preparation resources.",
  foundingDate: '2026',
  email: 'govtexampath@gmail.com',
  sameAs: ['https://instagram.com/govtexampath', 'https://youtube.com/@govtexampath', 'https://x.com/govtexampath', 'https://t.me/govtexampath'],
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
      jobTitle: 'Founder & CEO',
    },
  ],
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    value: 3,
  },
};

const examCategories = [
  { emoji: '\u{1F3DB}️', label: 'UPSC' },
  { emoji: '\u{1F4CB}', label: 'SSC' },
  { emoji: '\u{1F3E6}', label: 'Banking' },
  { emoji: '\u{1F682}', label: 'Railways' },
  { emoji: '\u{1F396}️', label: 'Defence' },
  { emoji: '\u{1F3E2}', label: 'State PSC' },
  { emoji: '\u{1F4DA}', label: 'Teaching' },
  { emoji: '\u{1F46E}', label: 'Police' },
  { emoji: '\u{1F6E1}️', label: 'Insurance' },
  { emoji: '\u{1F3ED}', label: 'PSU' },
  { emoji: '\u{2696}️', label: 'Regulatory Bodies' },
  { emoji: '\u{1F3DB}️', label: 'Judiciary' },
  { emoji: '\u{1F3E5}', label: 'Healthcare' },
  { emoji: '\u{1F4EE}', label: 'Postal' },
  { emoji: '\u{1F33E}', label: 'Agriculture' },
  { emoji: '\u{1F4C2}', label: 'Miscellaneous' },
];

const About = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: FiCpu,
      title: t('careerGuide'),
      description: t('aboutFeat1Desc'),
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-t-blue-500',
      link: '/ai-guide',
    },
    {
      icon: FiCheckSquare,
      title: t('eligibilityChecker'),
      description: t('aboutFeat2Desc'),
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-t-green-500',
      link: '/eligibility-checker',
    },
    {
      icon: FiMap,
      title: t('mindMaps'),
      description: t('aboutFeat3Desc'),
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      border: 'border-t-purple-500',
      link: '/mind-maps',
    },
    {
      icon: FiBookOpen,
      title: t('studyResources'),
      description: t('aboutFeat4Desc'),
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      border: 'border-t-orange-500',
      link: '/resources',
    },
    {
      icon: FiAward,
      title: t('expertBlog'),
      description: t('aboutFeat5Desc'),
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-t-red-500',
      link: '/blog',
    },
    {
      icon: FiGlobe,
      title: t('currentAffairs'),
      description: t('aboutFeat6Desc'),
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-900/30',
      border: 'border-t-teal-500',
      link: '/current-affairs',
    },
  ];

  const trustItems = [
    {
      icon: FiShield,
      title: t('trustOfficialSources'),
      stat: '100%',
      description: t('trustOfficialSourcesDesc'),
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: FiClock,
      title: t('trustAlwaysUpdated'),
      stat: 'Daily',
      description: t('trustAlwaysUpdatedDesc'),
      gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: FiHeart,
      title: t('trustFreeForever'),
      stat: '$0',
      description: t('trustFreeForeverDesc'),
      gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: FiShield,
      title: t('trustPrivacy'),
      stat: 'Zero',
      description: t('trustPrivacyDesc'),
      gradient: 'from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  const teamMembers = [
    {
      name: 'Sanjana Sarvani',
      role: t('roleCEO'),
      initial: 'S',
      gradient: 'from-pink-500 to-rose-600',
      ringGradient: 'from-pink-400 via-rose-500 to-pink-600',
      bio: t('teamBio1'),
      email: 'govtexampath@gmail.com',
    },
    {
      name: 'Rahul Mehta',
      role: t('roleTechLead'),
      initial: 'R',
      gradient: 'from-blue-500 to-indigo-600',
      ringGradient: 'from-blue-400 via-indigo-500 to-blue-600',
      bio: t('teamBio2'),
      email: null,
    },
    {
      name: 'Priya Singh',
      role: t('roleContentHead'),
      initial: 'P',
      gradient: 'from-green-500 to-emerald-600',
      ringGradient: 'from-green-400 via-emerald-500 to-green-600',
      bio: t('teamBio3'),
      email: null,
    },
  ];

  const stats = [
    { value: '10,000+', label: t('statStudentsGuided'), icon: FiUsers },
    { value: '200+', label: t('statExamsCovered'), icon: FiBookOpen },
    { value: '16', label: t('categories'), icon: FiMap },
    { value: 'Daily', label: t('statUpdates'), icon: FiClock },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="About Us"
        path="/about"
        description="Learn about GovtExamPath — India's free career guidance platform for government exam aspirants. Discover our mission, story, team, and how we help 10,000+ students find their dream government job."
        jsonLd={orgJsonLd}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: t('aboutUs') }]} />
      </div>

      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute top-1/4 right-16 w-32 h-32 bg-white/5 rounded-full animate-bounce" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }} />
          <div className="absolute bottom-10 right-1/3 w-12 h-12 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute top-16 right-1/2 w-40 h-40 bg-white/5 rounded-full animate-bounce" style={{ animationDuration: '10s' }} />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -top-16 -right-16 w-96 h-96 bg-white/5 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
            <FiBookOpen className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {t('aboutUs')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200">GovtExamPath</span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
            {t('aboutHeroSub')}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-blue-100 mb-12">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {t('aboutFounded')}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6 text-center hover:bg-white/15 transition-all duration-300"
              >
                <stat.icon className="w-5 h-5 text-blue-200 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                {t('ourMission').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('ourMission').split(' ').slice(-1)[0]}</span>
              </h2>
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 text-base sm:text-lg">
                <p>{t('missionP1')}</p>
                <p>{t('missionP2')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {examCategories.map((cat) => (
                <div
                  key={cat.label}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{cat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              {t('whatWeOffer').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('whatWeOffer').split(' ').slice(-1)[0]}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('whatWeOfferSub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`bg-white dark:bg-gray-800 rounded-2xl border-t-4 ${feature.border} border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group`}
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bg} mb-5`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${feature.color} group-hover:gap-2 transition-all duration-300`}
                >
                  {t('learnMore')} <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              {t('whyTrustUs').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('whyTrustUs').split(' ').slice(-1)[0]}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('whyTrustUsSub')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className={`bg-gradient-to-br ${item.gradient} rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-lg transition-all duration-300`}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4">
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <div className={`text-2xl font-extrabold ${item.color} mb-1`}>
                  {item.stat}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              {t('ourTeam').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('ourTeam').split(' ').slice(-1)[0]}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('ourTeamSub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${member.ringGradient} p-1 mx-auto mb-5`}>
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center`}>
                    <span className="text-3xl font-bold text-white">
                      {member.initial}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-1">
                  {member.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full mb-4">
                  {member.role}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {member.bio}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all"
                    >
                      <FiMail className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href="https://instagram.com/govtexampath"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 transition-all"
                  >
                    <FiInstagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              {t('connectWithUs').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('connectWithUs').split(' ').slice(-1)[0]}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-2">
              {t('connectWithUsSub')}
            </p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {t('joinAspirants')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://instagram.com/govtexampath"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <FiInstagram className="w-5 h-5" />
              Follow on Instagram
            </a>
            <a
              href="mailto:govtexampath@gmail.com"
              className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <FiMail className="w-5 h-5" />
              govtexampath@gmail.com
            </a>
            <a
              href="https://youtube.com/@govtexampath"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaYoutube className="w-5 h-5" />
              Subscribe on YouTube
            </a>
            <a
              href="https://t.me/govtexampath"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaTelegramPlane className="w-5 h-5" />
              Join Telegram
            </a>
            <a
              href="https://x.com/govtexampath"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaXTwitter className="w-5 h-5" />
              Follow on X
            </a>
          </div>
        </section>

        <section className="pb-12">
          <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />
              <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative px-8 py-14 sm:px-16 sm:py-20 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                {t('dreamJobTitle')}
              </h2>
              <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-base sm:text-lg leading-relaxed">
                {t('dreamJobSub')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/exams"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base"
                >
                  <FiBookOpen className="w-5 h-5" />
                  {t('exploreExams')}
                </Link>
                <Link
                  to="/ai-guide"
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 text-base"
                >
                  <FiCpu className="w-5 h-5" />
                  {t('careerGuide')}
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
