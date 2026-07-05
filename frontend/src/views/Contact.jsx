import React, { useState } from 'react';
import { Link } from '@/lib/router';
import { FiMail, FiClock, FiMapPin, FiSend, FiCheckCircle, FiArrowRight, FiHelpCircle, FiMessageSquare } from 'react-icons/fi';
import { FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(form.subject || 'Contact from GovtExamPath');
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:govtexampath@gmail.com?subject=${subject}&body=${body}`, '_self');
    setSubmitted(true);
    toast.success(t('contactThankYou'));
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
    setSending(false);
  };

  const infoCards = [
    {
      icon: FiMail,
      title: t('contactEmailLabel'),
      value: 'govtexampath@gmail.com',
      href: 'mailto:govtexampath@gmail.com',
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-200 dark:border-blue-800',
    },
    {
      icon: FiClock,
      title: t('contactResponseTime'),
      value: t('contactResponseTimeVal'),
      href: null,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-800',
    },
    {
      icon: FiMapPin,
      title: t('contactLocationLabel'),
      value: 'New Delhi, India',
      href: null,
      gradient: 'from-rose-500 to-pink-600',
      bg: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20',
      border: 'border-rose-200 dark:border-rose-800',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Contact Us" path="/contact" description="Get in touch with the GovtExamPath team. We're here to help with questions about government exams, eligibility, and platform features." />
      <Breadcrumb items={[{ label: t('contact') }]} />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 sm:p-10 mb-8 text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute bottom-[-60px] left-[-30px] w-64 h-64 rounded-full bg-white/10" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-5 shadow-lg">
            <FiMessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{t('contactTitle')}</h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto">{t('contactSubtitle')}</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {infoCards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.bg} rounded-2xl border ${card.border} p-6 flex flex-col items-center text-center`}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{card.title}</h3>
            {card.href ? (
              <a href={card.href} className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">{card.value}</a>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Social channels */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 text-center">Also reach us on</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://instagram.com/govtexampath"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-xl text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <FaInstagram className="w-4 h-4" /> Instagram
          </a>
          <a
            href="https://t.me/govtexampath"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-xl text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <FaTelegramPlane className="w-4 h-4" /> Telegram
          </a>
          <Link
            to="/faq"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <FiHelpCircle className="w-4 h-4" /> Browse FAQs <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Contact form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FiSend className="w-4 h-4 text-white" />
          </span>
          {t('contactSendMessage')}
        </h2>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t('contactMessageSent')}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t('contactThankYou')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('contactYourName')}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder={t('contactEnterName')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('contactEmailAddress')}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('contactSubjectLabel')}</label>
              <select
                name="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">{t('contactSelectTopic')}</option>
                <option value="general">{t('contactGenQuestion')}</option>
                <option value="exam-info">{t('contactExamInfo')}</option>
                <option value="eligibility">{t('contactEligibilityQuery')}</option>
                <option value="bug">{t('contactReportBug')}</option>
                <option value="feature">{t('contactFeatureRequest')}</option>
                <option value="feedback">{t('contactFeedbackLabel')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('contactMessageLabel')}</label>
              <textarea
                name="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                placeholder={t('contactTypeHere')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSend className="w-5 h-5" /> {sending ? t('contactSending') : t('contactSendBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
