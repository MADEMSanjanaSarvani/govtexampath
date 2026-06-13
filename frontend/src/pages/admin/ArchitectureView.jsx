import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiServer, FiGlobe, FiDatabase, FiMail, FiSmartphone, FiClock,
  FiGitBranch, FiLayers, FiCode, FiMonitor, FiChevronRight,
  FiChevronDown, FiRefreshCw, FiActivity, FiZap, FiShield,
  FiUsers, FiFileText, FiBell, FiSearch, FiExternalLink,
  FiBox, FiCpu, FiWifi, FiArrowRight, FiTarget, FiBookOpen,
  FiTrendingUp, FiMapPin, FiCalendar, FiAward, FiBarChart2,
  FiGrid, FiCheckCircle, FiAlertTriangle, FiInfo, FiStar,
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import SEO from '../../components/common/SEO';
import { getScraperStats, getSources } from '../../services/scraperService';

// ─── Architecture Data ──────────────────────────────────────────────────────

const systemNodes = {
  frontend: {
    id: 'frontend',
    label: 'Frontend (React 19)',
    icon: FiMonitor,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    description: 'Single Page Application deployed on Netlify',
    tech: ['React 19', 'Tailwind CSS', 'Framer Motion', 'React Router 7', 'Socket.io Client', 'Axios'],
    deployment: 'Netlify',
    deployUrl: 'https://govtexampath.netlify.app',
    details: {
      pages: [
        { name: 'Home', path: '/', desc: 'Hero, exam categories, stats, CTA' },
        { name: 'Exams', path: '/exams', desc: 'All exams with category filters, search, bookmarks' },
        { name: 'Exam Detail', path: '/exams/:id', desc: 'Full exam info, dates, eligibility, salary' },
        { name: 'Current Affairs', path: '/current-affairs', desc: '170+ articles, daily digest, PDF download' },
        { name: 'Resources', path: '/resources', desc: 'On-site notes, PYQs, official guides, books' },
        { name: 'Mind Maps', path: '/mind-maps', desc: 'Interactive syllabus tree visualizations' },
        { name: 'Community', path: '/community', desc: 'Discussion forum with categories & threads' },
        { name: 'AI Career Guide', path: '/ai-guide', desc: 'Chatbot for career guidance' },
        { name: 'Exam Calendar', path: '/exam-calendar', desc: 'Monthly exam schedule view' },
        { name: 'Compare Exams', path: '/compare', desc: 'Side-by-side exam comparison' },
        { name: 'Exam Priority Matrix', path: '/exam-priority', desc: '38+ exams in 4 priority quadrants' },
        { name: 'Prep Time Estimator', path: '/prep-time-estimator', desc: 'Personalized prep time calculator' },
        { name: 'Salary Calculator', path: '/salary-calculator', desc: '7th/8th CPC salary breakdown' },
        { name: 'Eligibility Checker', path: '/eligibility-checker', desc: 'Check exam eligibility by age/education' },
        { name: 'Results', path: '/results', desc: 'Latest exam results feed' },
        { name: 'Admit Cards', path: '/admit-cards', desc: 'Active admit card downloads' },
        { name: 'Cut-Off Marks', path: '/cut-off', desc: 'Category-wise cutoff data' },
        { name: 'Answer Keys', path: '/answer-keys', desc: 'Official answer key links' },
        { name: 'Blog', path: '/blog', desc: 'Preparation tips and articles' },
      ],
      contexts: [
        { name: 'AuthContext', desc: 'User auth state, login/register/logout, JWT token management' },
        { name: 'LanguageContext', desc: '6 languages (EN, HI, TE, KN, TA, ML) with 450+ translation keys' },
        { name: 'ThemeContext', desc: 'Dark/light mode toggle with localStorage persistence' },
        { name: 'NotificationContext', desc: 'Real-time notification state, unread count, Socket.io events' },
        { name: 'SocketContext', desc: 'WebSocket connection lifecycle management' },
      ],
      adminPages: [
        { name: 'Dashboard', path: '/admin', desc: 'Stats overview: users, exams, notifications' },
        { name: 'Manage Exams', path: '/admin/exams', desc: 'CRUD for exams with form modal' },
        { name: 'Manage Users', path: '/admin/users', desc: 'User list, role toggle, delete' },
        { name: 'Notifications', path: '/admin/notifications', desc: 'Send/schedule notifications, email integration' },
        { name: 'Auto Updater', path: '/admin/auto-updater', desc: 'Scraper sources, manual triggers, logs' },
        { name: 'Architecture', path: '/admin/architecture', desc: 'This page — system documentation' },
      ],
    },
  },
  backend: {
    id: 'backend',
    label: 'Backend (Node.js / Express)',
    icon: FiServer,
    color: 'from-green-500 to-emerald-600',
    borderColor: 'border-green-400',
    bgLight: 'bg-green-50 dark:bg-green-950/30',
    description: 'REST API server deployed on Render',
    tech: ['Node.js', 'Express', 'Mongoose', 'Socket.io', 'Firebase Admin', 'node-cron', 'Cheerio', 'JWT'],
    deployment: 'Render',
    deployUrl: 'https://govtexampath-backend.onrender.com',
    details: {
      routes: [
        { method: 'GET/POST', path: '/api/auth/*', desc: 'Login, register, Google OAuth, profile' },
        { method: 'GET/POST/PUT/DEL', path: '/api/exams/*', desc: 'Exam CRUD, bookmarks, search' },
        { method: 'GET/POST', path: '/api/notifications/*', desc: 'Send, schedule, FCM token, read status' },
        { method: 'GET/POST/PUT/DEL', path: '/api/admin/*', desc: 'Dashboard stats, user management' },
        { method: 'GET/POST/PUT/DEL', path: '/api/scraper/*', desc: 'Sources, triggers, logs, stats' },
        { method: 'GET/POST/PUT/DEL', path: '/api/resources/*', desc: 'Study materials CRUD' },
        { method: 'GET', path: '/api/current-affairs', desc: 'Current affairs articles' },
      ],
      services: [
        { name: 'scraper.js', desc: 'Monitors 16+ govt sites for exam updates using Cheerio + MD5 hashing' },
        { name: 'currentAffairsScraper.js', desc: 'Scrapes PIB for 30+ daily articles with auto-categorization' },
        { name: 'scheduler.js', desc: 'Cron jobs: exam check (2h), cleanup (midnight), news (6AM/6PM)' },
        { name: 'emailService.js', desc: 'Brevo API integration for notification emails' },
        { name: 'pushService.js', desc: 'Firebase Cloud Messaging for mobile push notifications' },
        { name: 'schedulerService.js', desc: 'Deferred notification delivery engine' },
      ],
    },
  },
  database: {
    id: 'database',
    label: 'MongoDB Atlas',
    icon: FiDatabase,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    description: 'Cloud-hosted NoSQL database',
    tech: ['MongoDB Atlas', 'Mongoose ODM'],
    deployment: 'MongoDB Atlas (Cloud)',
    details: {
      models: [
        { name: 'User', fields: 'name, email, password, googleId, role, bookmarks, fcmTokens, notificationPreferences', desc: 'Auth + profile + notification preferences' },
        { name: 'Exam', fields: 'title, category (16 types), description, eligibility, dates, salary, cutoffs, vacancies', desc: 'Core exam data with text search index' },
        { name: 'ExamSource', fields: 'name, conductingBody, category, url, selector, contentHash, failures', desc: 'Scraper monitoring targets with health tracking' },
        { name: 'UpdateLog', fields: 'source, type, exam, details, changes', desc: 'Change detection audit trail' },
        { name: 'Notification', fields: 'title, message, type (10), priority, schedule, recipients, readBy', desc: 'Multi-channel notification records' },
        { name: 'NotificationLog', fields: 'notification, channel, recipientCount, status', desc: 'Delivery tracking per channel' },
        { name: 'CurrentAffair', fields: 'title, content, category (9), source, publishDate, tags', desc: 'News articles for exam prep' },
        { name: 'Resource', fields: 'title, type (notes/pyq/books/syllabus), examCategory, fileUrl', desc: 'Study materials and resources' },
      ],
    },
  },
  netlify: {
    id: 'netlify',
    label: 'Netlify (CDN)',
    icon: FiGlobe,
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-400',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/30',
    description: 'Frontend hosting with global CDN, auto-deploy from GitHub',
    tech: ['Netlify CDN', 'Auto-deploy', 'SSL/TLS', 'Prerendering'],
    deployment: 'Netlify',
    details: {
      config: [
        { name: 'Build Command', value: 'npm run build && node scripts/prerender.js' },
        { name: 'Publish Dir', value: 'frontend/build' },
        { name: 'Node Version', value: '18' },
        { name: 'API Proxy', value: '/api/* → Render backend (reverse proxy)' },
        { name: 'SPA Fallback', value: '/* → /index.html (200)' },
        { name: 'Headers', value: 'X-Robots-Tag, X-Frame-Options, X-Content-Type-Options' },
      ],
      envVars: [
        'REACT_APP_API_URL',
        'REACT_APP_GOOGLE_CLIENT_ID',
        'REACT_APP_GEMINI_API_KEY',
      ],
    },
  },
  render: {
    id: 'render',
    label: 'Render (PaaS)',
    icon: FiCpu,
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-400',
    bgLight: 'bg-violet-50 dark:bg-violet-950/30',
    description: 'Backend hosting with auto-deploy, managed Node.js runtime',
    tech: ['Render Web Service', 'Auto-deploy', 'SSL/TLS', 'Health checks'],
    deployment: 'Render',
    details: {
      envVars: [
        'MONGO_URI',
        'JWT_SECRET',
        'CLIENT_URL',
        'BREVO_API_KEY',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'FIREBASE_SERVICE_ACCOUNT',
        'NODE_ENV',
        'PORT',
      ],
    },
  },
  brevo: {
    id: 'brevo',
    label: 'Brevo (Email)',
    icon: FiMail,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-400',
    bgLight: 'bg-pink-50 dark:bg-pink-950/30',
    description: 'Transactional email API for notification delivery',
    tech: ['Brevo API v3', 'SMTP'],
    deployment: 'Brevo Cloud',
  },
  firebase: {
    id: 'firebase',
    label: 'Firebase (Push)',
    icon: FiSmartphone,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    description: 'Firebase Cloud Messaging for mobile push notifications',
    tech: ['Firebase Admin SDK', 'FCM'],
    deployment: 'Google Cloud',
  },
  govtSites: {
    id: 'govtSites',
    label: 'Government Websites',
    icon: FiGlobe,
    color: 'from-slate-500 to-gray-600',
    borderColor: 'border-slate-400',
    bgLight: 'bg-slate-50 dark:bg-slate-950/30',
    description: '16+ official government exam portals monitored for updates',
    tech: ['HTTP/HTTPS', 'HTML Parsing', 'Cheerio'],
    deployment: 'External',
    details: {
      sources: [
        { name: 'UPSC', url: 'upsc.gov.in' },
        { name: 'SSC', url: 'ssc.gov.in' },
        { name: 'IBPS', url: 'ibps.in' },
        { name: 'RRB', url: 'rrbcdg.gov.in' },
        { name: 'NTA', url: 'nta.ac.in' },
        { name: 'SBI', url: 'sbi.co.in' },
        { name: 'RBI', url: 'rbi.org.in' },
        { name: 'Defence', url: 'joinindianarmy.nic.in' },
        { name: 'India Post', url: 'indiapostgdsonline.gov.in' },
        { name: 'EPFO', url: 'epfindia.gov.in' },
        { name: 'UIDAI', url: 'uidai.gov.in' },
        { name: 'DRDO', url: 'drdo.gov.in' },
        { name: 'NHAI', url: 'nhai.gov.in' },
        { name: 'BPSC', url: 'bpsc.bih.nic.in' },
        { name: 'PIB', url: 'pib.gov.in' },
        { name: 'Sarkari Result', url: 'sarkariresult.com' },
      ],
    },
  },
  github: {
    id: 'github',
    label: 'GitHub',
    icon: FiGitBranch,
    color: 'from-gray-700 to-gray-900',
    borderColor: 'border-gray-500',
    bgLight: 'bg-gray-100 dark:bg-gray-800',
    description: 'Source code repository with CI/CD workflows',
    tech: ['Git', 'GitHub Actions', 'Claude Code Integration'],
    deployment: 'GitHub',
  },
};

const connections = [
  { from: 'github', to: 'netlify', label: 'Auto-deploy on push', color: 'text-cyan-500', type: 'deploy' },
  { from: 'github', to: 'render', label: 'Auto-deploy on push', color: 'text-violet-500', type: 'deploy' },
  { from: 'frontend', to: 'backend', label: 'REST API calls (Axios)', color: 'text-blue-500', type: 'api' },
  { from: 'frontend', to: 'backend', label: 'WebSocket (Socket.io)', color: 'text-green-500', type: 'realtime' },
  { from: 'backend', to: 'database', label: 'Mongoose ODM queries', color: 'text-emerald-500', type: 'data' },
  { from: 'backend', to: 'brevo', label: 'Email notifications', color: 'text-pink-500', type: 'notification' },
  { from: 'backend', to: 'firebase', label: 'Push notifications (FCM)', color: 'text-amber-500', type: 'notification' },
  { from: 'backend', to: 'govtSites', label: 'Scrape every 2 hours', color: 'text-slate-500', type: 'scraper' },
  { from: 'netlify', to: 'frontend', label: 'Serves built React app', color: 'text-blue-400', type: 'serve' },
  { from: 'render', to: 'backend', label: 'Runs Node.js server', color: 'text-green-400', type: 'serve' },
  { from: 'netlify', to: 'render', label: 'API proxy (/api/*)', color: 'text-indigo-500', type: 'proxy' },
];

const scraperSchedule = [
  { name: 'Exam Source Monitor', cron: '0 */2 * * *', frequency: 'Every 2 hours', icon: FiSearch, color: 'text-blue-500', desc: 'Checks 16+ govt websites for content changes using MD5 hashing. Creates notifications and updates exam records on detection.' },
  { name: 'Daily Cleanup', cron: '0 0 * * *', frequency: 'Midnight IST', icon: FiRefreshCw, color: 'text-orange-500', desc: 'Deactivates exams with past application dates. Identifies stale exams not updated in 30+ days.' },
  { name: 'Current Affairs Scraper', cron: '0 6,18 * * *', frequency: '6 AM & 6 PM IST', icon: FiFileText, color: 'text-green-500', desc: 'Scrapes PIB for 30+ articles per run. Auto-categorizes into 9 types. Deduplicates by title similarity.' },
];

const dataFlows = [
  {
    title: 'User visits GovtExamPath',
    steps: [
      { label: 'Browser', desc: 'User opens govtexampath.netlify.app', icon: FiMonitor, color: 'blue' },
      { label: 'Netlify CDN', desc: 'Serves React SPA from nearest edge node', icon: FiGlobe, color: 'cyan' },
      { label: 'React App', desc: 'Client-side routing, lazy-loaded pages', icon: FiCode, color: 'indigo' },
      { label: 'API Call', desc: 'Axios requests proxied via Netlify → Render', icon: FiArrowRight, color: 'purple' },
      { label: 'Express API', desc: 'Processes request, applies auth middleware', icon: FiServer, color: 'green' },
      { label: 'MongoDB', desc: 'Fetches/stores data via Mongoose', icon: FiDatabase, color: 'emerald' },
    ],
  },
  {
    title: 'Scraper detects exam update',
    steps: [
      { label: 'Cron Job', desc: 'node-cron triggers every 2 hours', icon: FiClock, color: 'orange' },
      { label: 'Fetch Page', desc: 'HTTP GET to govt website (e.g., ssc.gov.in)', icon: FiGlobe, color: 'slate' },
      { label: 'Parse HTML', desc: 'Cheerio extracts content via CSS selector', icon: FiCode, color: 'yellow' },
      { label: 'MD5 Compare', desc: 'Compares hash with stored lastContentHash', icon: FiShield, color: 'red' },
      { label: 'Update DB', desc: 'Creates UpdateLog, updates Exam if matched', icon: FiDatabase, color: 'emerald' },
      { label: 'Notify Users', desc: 'Socket.io + FCM push + Brevo email', icon: FiBell, color: 'pink' },
    ],
  },
  {
    title: 'Admin sends notification',
    steps: [
      { label: 'Admin Panel', desc: 'Admin fills notification form', icon: FiMonitor, color: 'blue' },
      { label: 'POST /api', desc: 'Creates Notification in MongoDB', icon: FiServer, color: 'green' },
      { label: 'Socket.io', desc: 'Real-time broadcast to online users', icon: FiWifi, color: 'indigo' },
      { label: 'Firebase', desc: 'FCM push to registered mobile devices', icon: FiSmartphone, color: 'amber' },
      { label: 'Brevo', desc: 'Email sent if sendEmail flag is true', icon: FiMail, color: 'pink' },
      { label: 'Log', desc: 'NotificationLog tracks delivery per channel', icon: FiCheckCircle, color: 'green' },
    ],
  },
];

const techStack = [
  { category: 'Frontend', items: [
    { name: 'React 19', role: 'UI framework' },
    { name: 'Tailwind CSS', role: 'Utility-first styling' },
    { name: 'Framer Motion', role: 'Animations' },
    { name: 'React Router 7', role: 'Client-side routing' },
    { name: 'Axios', role: 'HTTP client' },
    { name: 'Socket.io Client', role: 'WebSocket' },
    { name: 'React Hot Toast', role: 'Notifications UI' },
    { name: 'React Icons', role: 'Icon library' },
    { name: 'date-fns', role: 'Date utilities' },
  ]},
  { category: 'Backend', items: [
    { name: 'Node.js', role: 'Runtime' },
    { name: 'Express', role: 'Web framework' },
    { name: 'Mongoose', role: 'MongoDB ODM' },
    { name: 'Socket.io', role: 'WebSocket server' },
    { name: 'node-cron', role: 'Job scheduling' },
    { name: 'Cheerio', role: 'HTML scraping' },
    { name: 'bcryptjs', role: 'Password hashing' },
    { name: 'jsonwebtoken', role: 'JWT auth' },
    { name: 'google-auth-library', role: 'Google OAuth' },
  ]},
  { category: 'Infrastructure', items: [
    { name: 'Netlify', role: 'Frontend CDN + deploy' },
    { name: 'Render', role: 'Backend PaaS' },
    { name: 'MongoDB Atlas', role: 'Cloud database' },
    { name: 'GitHub', role: 'Source + CI/CD' },
    { name: 'Brevo', role: 'Email API' },
    { name: 'Firebase', role: 'Push notifications' },
  ]},
  { category: 'Languages', items: [
    { name: 'English', role: 'Default' },
    { name: 'Hindi', role: 'हिन्दी' },
    { name: 'Telugu', role: 'తెలుగు' },
    { name: 'Kannada', role: 'ಕನ್ನಡ' },
    { name: 'Tamil', role: 'தமிழ்' },
    { name: 'Malayalam', role: 'മലയാളം' },
  ]},
];

// ─── Components ─────────────────────────────────────────────────────────────

const NodeCard = ({ node, isExpanded, onToggle }) => {
  const Icon = node.icon;
  return (
    <motion.div
      layout
      className={`rounded-2xl border-2 ${node.borderColor} ${node.bgLight} overflow-hidden transition-shadow hover:shadow-xl cursor-pointer`}
      onClick={onToggle}
    >
      <div className={`bg-gradient-to-r ${node.color} px-5 py-3.5 flex items-center gap-3`}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm sm:text-base truncate">{node.label}</h3>
          <p className="text-white/70 text-xs truncate">{node.deployment}</p>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronRight className="w-5 h-5 text-white/70" />
        </motion.div>
      </div>

      <div className="px-5 py-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{node.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {node.tech.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium">{t}</span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && node.details && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-4">
              <NodeDetails node={node} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NodeDetails = ({ node }) => {
  const d = node.details;

  if (d.pages) {
    return (
      <>
        <DetailSection title="Public Pages" icon={FiGlobe} count={d.pages.length}>
          {d.pages.map(p => (
            <DetailRow key={p.path} primary={p.name} secondary={p.path} desc={p.desc} />
          ))}
        </DetailSection>
        <DetailSection title="Context Providers" icon={FiLayers} count={d.contexts.length}>
          {d.contexts.map(c => (
            <DetailRow key={c.name} primary={c.name} desc={c.desc} />
          ))}
        </DetailSection>
        <DetailSection title="Admin Pages" icon={FiShield} count={d.adminPages.length}>
          {d.adminPages.map(p => (
            <DetailRow key={p.path} primary={p.name} secondary={p.path} desc={p.desc} />
          ))}
        </DetailSection>
      </>
    );
  }

  if (d.routes) {
    return (
      <>
        <DetailSection title="API Routes" icon={FiServer} count={d.routes.length}>
          {d.routes.map(r => (
            <DetailRow key={r.path} primary={r.method} secondary={r.path} desc={r.desc} tag />
          ))}
        </DetailSection>
        <DetailSection title="Services" icon={FiCpu} count={d.services.length}>
          {d.services.map(s => (
            <DetailRow key={s.name} primary={s.name} desc={s.desc} />
          ))}
        </DetailSection>
      </>
    );
  }

  if (d.models) {
    return (
      <DetailSection title="Collections" icon={FiDatabase} count={d.models.length}>
        {d.models.map(m => (
          <div key={m.name} className="py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{m.name}</span>
              <span className="text-xs text-gray-400">{m.desc}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{m.fields}</p>
          </div>
        ))}
      </DetailSection>
    );
  }

  if (d.config) {
    return (
      <DetailSection title="Configuration" icon={FiCode}>
        {d.config.map(c => (
          <div key={c.name} className="flex items-start gap-2 py-1.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-32 shrink-0">{c.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{c.value}</span>
          </div>
        ))}
        {d.envVars && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Environment Variables</p>
            <div className="flex flex-wrap gap-1.5">
              {d.envVars.map(v => (
                <span key={v} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-mono">{v}</span>
              ))}
            </div>
          </div>
        )}
      </DetailSection>
    );
  }

  if (d.envVars) {
    return (
      <DetailSection title="Environment Variables" icon={FiShield}>
        <div className="flex flex-wrap gap-1.5">
          {d.envVars.map(v => (
            <span key={v} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-mono">{v}</span>
          ))}
        </div>
      </DetailSection>
    );
  }

  if (d.sources) {
    return (
      <DetailSection title="Monitored Sources" icon={FiGlobe} count={d.sources.length}>
        <div className="grid grid-cols-2 gap-2">
          {d.sources.map(s => (
            <div key={s.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{s.name}</span>
              <span className="text-gray-400 truncate">{s.url}</span>
            </div>
          ))}
        </div>
      </DetailSection>
    );
  }

  return null;
};

const DetailSection = ({ title, icon: Icon, count, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{title}</h4>
      {count != null && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold">{count}</span>}
    </div>
    <div>{children}</div>
  </div>
);

const DetailRow = ({ primary, secondary, desc, tag }) => (
  <div className="flex items-start gap-2 py-1.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
    {tag ? (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-mono font-bold shrink-0 mt-0.5">{primary}</span>
    ) : (
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 shrink-0">{primary}</span>
    )}
    {secondary && <span className="text-xs text-gray-400 font-mono shrink-0">{secondary}</span>}
    {desc && <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto text-right">{desc}</span>}
  </div>
);

const ConnectionLine = ({ conn }) => {
  const typeIcons = { deploy: FiGitBranch, api: FiArrowRight, realtime: FiWifi, data: FiDatabase, notification: FiBell, scraper: FiSearch, serve: FiServer, proxy: FiArrowRight };
  const TypeIcon = typeIcons[conn.type] || FiArrowRight;
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow`}>
      <TypeIcon className={`w-4 h-4 ${conn.color} shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-gray-700 dark:text-gray-300">{systemNodes[conn.from]?.label?.split(' ')[0]}</span>
          <FiArrowRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-700 dark:text-gray-300">{systemNodes[conn.to]?.label?.split(' ')[0]}</span>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{conn.label}</p>
      </div>
      <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium uppercase`}>{conn.type}</span>
    </div>
  );
};

const FlowDiagram = ({ flow }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow">
    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
      <FiActivity className="w-4 h-4 text-indigo-500" />
      {flow.title}
    </h3>
    <div className="flex flex-col gap-0">
      {flow.steps.map((step, idx) => {
        const StepIcon = step.icon;
        const colors = {
          blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
          cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600',
          indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600',
          purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
          green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
          emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
          orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
          slate: 'bg-slate-100 dark:bg-slate-900/30 text-slate-600',
          yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600',
          red: 'bg-red-100 dark:bg-red-900/30 text-red-600',
          pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600',
          amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
        };
        return (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-xl ${colors[step.color]} flex items-center justify-center shrink-0`}>
                <StepIcon className="w-4 h-4" />
              </div>
              {idx < flow.steps.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 my-1" />
              )}
            </div>
            <div className="pt-1.5 pb-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────

const ArchitectureView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [scraperStats, setScraperStats] = useState(null);
  const [liveSources, setLiveSources] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, sourcesRes] = await Promise.all([
          getScraperStats().catch(() => ({ data: null })),
          getSources().catch(() => ({ data: [] })),
        ]);
        setScraperStats(statsRes.data);
        setLiveSources(sourcesRes.data || []);
      } catch {} finally {
        setStatsLoading(false);
      }
    };
    load();
  }, []);

  const toggleNode = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: FiGrid },
    { id: 'connections', label: 'Connections', icon: FiGitBranch },
    { id: 'scrapers', label: 'Scrapers', icon: FiRefreshCw },
    { id: 'dataflow', label: 'Data Flows', icon: FiActivity },
    { id: 'stack', label: 'Tech Stack', icon: FiLayers },
  ];

  return (
    <AdminLayout>
      <SEO title="System Architecture" path="/admin/architecture" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <FiCpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">System Architecture</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Interactive documentation of the entire GovtExamPath platform</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <QuickStat icon={FiMonitor} label="Frontend Pages" value="19+" color="blue" />
          <QuickStat icon={FiServer} label="API Routes" value="7 groups" color="green" />
          <QuickStat icon={FiDatabase} label="DB Collections" value="8" color="emerald" />
          <QuickStat icon={FiGlobe} label="Scraped Sources" value={liveSources.length > 0 ? `${liveSources.length}` : '16+'} color="slate" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Visual Architecture Map */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <FiMapPin className="w-5 h-5 text-yellow-400" />
                  System Architecture Map
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left: External Services */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">External Services</p>
                    <MiniNode node={systemNodes.github} onClick={() => { setActiveTab('overview'); toggleNode('github'); }} />
                    <MiniNode node={systemNodes.govtSites} onClick={() => { setActiveTab('overview'); toggleNode('govtSites'); }} />
                    <MiniNode node={systemNodes.brevo} />
                    <MiniNode node={systemNodes.firebase} />
                  </div>

                  {/* Center: Core Platform */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Core Platform</p>
                    <MiniNode node={systemNodes.frontend} onClick={() => toggleNode('frontend')} highlight />
                    <div className="flex items-center justify-center gap-1 py-1">
                      <div className="h-0.5 w-8 bg-indigo-500/50 rounded" />
                      <FiArrowRight className="w-3 h-3 text-indigo-400" />
                      <span className="text-[10px] text-indigo-400 font-medium">REST + WebSocket</span>
                      <FiArrowRight className="w-3 h-3 text-indigo-400" />
                      <div className="h-0.5 w-8 bg-indigo-500/50 rounded" />
                    </div>
                    <MiniNode node={systemNodes.backend} onClick={() => toggleNode('backend')} highlight />
                  </div>

                  {/* Right: Infrastructure */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Infrastructure</p>
                    <MiniNode node={systemNodes.netlify} onClick={() => toggleNode('netlify')} />
                    <MiniNode node={systemNodes.render} onClick={() => toggleNode('render')} />
                    <MiniNode node={systemNodes.database} onClick={() => toggleNode('database')} highlight />
                  </div>
                </div>
              </div>

              {/* Expandable Node Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.values(systemNodes).map(node => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    isExpanded={expandedNodes.has(node.id)}
                    onToggle={() => toggleNode(node.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FiGitBranch className="w-5 h-5 text-indigo-500" />
                  All System Connections
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Every edge between components in the system</p>
                <div className="space-y-2">
                  {connections.map((conn, idx) => (
                    <ConnectionLine key={idx} conn={conn} />
                  ))}
                </div>
              </div>

              {/* Connection Type Legend */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Connection Types</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { type: 'API', desc: 'HTTP REST calls', icon: FiArrowRight, color: 'text-blue-500' },
                    { type: 'WebSocket', desc: 'Real-time events', icon: FiWifi, color: 'text-green-500' },
                    { type: 'Deploy', desc: 'CI/CD pipelines', icon: FiGitBranch, color: 'text-purple-500' },
                    { type: 'Data', desc: 'Database queries', icon: FiDatabase, color: 'text-emerald-500' },
                    { type: 'Scraper', desc: 'HTML scraping', icon: FiSearch, color: 'text-slate-500' },
                    { type: 'Notification', desc: 'Email/Push', icon: FiBell, color: 'text-pink-500' },
                    { type: 'Proxy', desc: 'Reverse proxy', icon: FiArrowRight, color: 'text-indigo-500' },
                    { type: 'Serve', desc: 'Static/runtime', icon: FiServer, color: 'text-gray-500' },
                  ].map(t => {
                    const TIcon = t.icon;
                    return (
                      <div key={t.type} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <TIcon className={`w-4 h-4 ${t.color}`} />
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t.type}</p>
                          <p className="text-[10px] text-gray-500">{t.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scrapers' && (
            <div className="space-y-6">
              {/* Schedule Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-orange-500" />
                  Cron Job Schedule
                </h2>
                <div className="space-y-4">
                  {scraperSchedule.map(s => {
                    const SIcon = s.icon;
                    return (
                      <div key={s.name} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0">
                          <SIcon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{s.name}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-mono font-bold">{s.cron}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{s.frequency}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scraper Pipeline */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiZap className="w-5 h-5 text-yellow-500" />
                  Scraper Pipeline
                </h2>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                  {[
                    { step: 1, title: 'Cron Trigger', desc: 'node-cron fires at scheduled interval (every 2h for exams)', color: 'bg-orange-500' },
                    { step: 2, title: 'Fetch Source Page', desc: 'HTTP GET request to govt website URL with timeout handling', color: 'bg-blue-500' },
                    { step: 3, title: 'Parse HTML', desc: 'Cheerio loads HTML, extracts text using CSS selector from ExamSource', color: 'bg-indigo-500' },
                    { step: 4, title: 'Compute MD5 Hash', desc: 'MD5 hash of extracted text compared against lastContentHash in DB', color: 'bg-purple-500' },
                    { step: 5, title: 'Detect Change', desc: 'If hash differs → change detected. Same → no_change logged. Error → failure count incremented', color: 'bg-red-500' },
                    { step: 6, title: 'Extract Details', desc: 'Regex extraction of vacancies, fees, age limits, cutoffs, dates from notification text', color: 'bg-yellow-500' },
                    { step: 7, title: 'Match Exam', desc: '3 strategies: direct conducting body match → category text search → regex for known exam names', color: 'bg-green-500' },
                    { step: 8, title: 'Update Database', desc: 'Update Exam record with new details. Create UpdateLog entry. Update ExamSource hash', color: 'bg-emerald-500' },
                    { step: 9, title: 'Notify Users', desc: 'Create Notification record. Broadcast via Socket.io + Firebase FCM push + Brevo email', color: 'bg-pink-500' },
                  ].map(s => (
                    <div key={s.step} className="relative flex items-start gap-4 pb-5 pl-2">
                      <div className={`relative z-10 w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}>
                        {s.step}
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{s.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Sources */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiGlobe className="w-5 h-5 text-teal-500" />
                  Monitored Sources
                  {liveSources.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-bold">{liveSources.length} sources</span>
                  )}
                </h2>
                {statsLoading ? (
                  <p className="text-sm text-gray-500">Loading live data...</p>
                ) : liveSources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {liveSources.map(src => (
                      <div key={src._id} className={`flex items-center gap-3 p-3 rounded-xl border ${src.isActive ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${src.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{src.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{src.conductingBody} • {src.category}</p>
                        </div>
                        {src.consecutiveFailures > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold">{src.consecutiveFailures} fails</span>
                        )}
                        {src.lastChecked && (
                          <span className="text-[10px] text-gray-400">{new Date(src.lastChecked).toLocaleDateString()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {systemNodes.govtSites.details.sources.map(s => (
                      <div key={s.name} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700">
                        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{s.name}</p>
                          <p className="text-[10px] text-gray-400">{s.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Stats */}
              {scraperStats && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FiBarChart2 className="w-5 h-5 text-indigo-500" />
                    Live Scraper Stats
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatBox label="Active Sources" value={scraperStats.activeSources ?? '-'} color="green" />
                    <StatBox label="Total Checks" value={scraperStats.totalChecks ?? '-'} color="blue" />
                    <StatBox label="Changes Detected" value={scraperStats.recentChanges ?? '-'} color="amber" />
                    <StatBox label="Errors" value={scraperStats.recentErrors ?? '-'} color="red" />
                  </div>
                </div>
              )}

              <div className="text-center">
                <Link
                  to="/admin/auto-updater"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Go to Auto Updater Panel
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'dataflow' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <FiInfo className="w-4 h-4 text-indigo-500" />
                  <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">How to read these flows</p>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">Each flow shows the step-by-step journey of data through the system. Follow the numbered steps from top to bottom to understand what happens at each stage.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {dataFlows.map(flow => (
                  <FlowDiagram key={flow.title} flow={flow} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stack' && (
            <div className="space-y-6">
              {techStack.map(group => (
                <div key={group.category} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{group.category}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {group.items.map(item => (
                      <div key={item.name} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* File Structure */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiBox className="w-5 h-5 text-indigo-500" />
                  Project Structure
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FileTree title="Frontend" items={[
                    { path: 'src/pages/', desc: '19 public pages + 6 admin pages', indent: 0 },
                    { path: 'src/components/', desc: 'Reusable UI components', indent: 0 },
                    { path: '  common/', desc: 'SEO, Breadcrumb, Loading, etc.', indent: 1 },
                    { path: '  layout/', desc: 'Navbar, Footer, Sidebar', indent: 1 },
                    { path: '  admin/', desc: 'AdminLayout, ExamForm, StatsCard', indent: 1 },
                    { path: 'src/context/', desc: '5 React contexts', indent: 0 },
                    { path: 'src/services/', desc: 'API service modules (Axios)', indent: 0 },
                    { path: 'src/data/', desc: 'Static data (examsData, etc.)', indent: 0 },
                    { path: 'netlify.toml', desc: 'CDN config, redirects, headers', indent: 0 },
                  ]} />
                  <FileTree title="Backend" items={[
                    { path: 'routes/', desc: '7 route modules', indent: 0 },
                    { path: 'models/', desc: '8 Mongoose schemas', indent: 0 },
                    { path: 'services/', desc: 'Scrapers, email, push, scheduler', indent: 0 },
                    { path: '  scraper.js', desc: 'Exam source monitor (Cheerio + MD5)', indent: 1 },
                    { path: '  currentAffairsScraper.js', desc: 'PIB article scraper', indent: 1 },
                    { path: '  scheduler.js', desc: 'Cron job orchestrator', indent: 1 },
                    { path: '  emailService.js', desc: 'Brevo email integration', indent: 1 },
                    { path: '  pushService.js', desc: 'Firebase FCM push', indent: 1 },
                    { path: 'middleware/', desc: 'Auth, admin, error handling', indent: 0 },
                    { path: 'server.js', desc: 'Express + Socket.io entry point', indent: 0 },
                  ]} />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  );
};

// ─── Small Helper Components ────────────────────────────────────────────────

const QuickStat = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    emerald: 'from-emerald-500 to-teal-600',
    slate: 'from-slate-500 to-gray-600',
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color }) => {
  const colors = {
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  };
  return (
    <div className={`rounded-xl p-4 text-center ${colors[color]}`}>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
    </div>
  );
};

const MiniNode = ({ node, onClick, highlight }) => {
  const Icon = node.icon;
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        highlight ? 'bg-white/10 border border-white/20 hover:bg-white/15' : 'bg-white/5 border border-white/10 hover:bg-white/10'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center shadow-sm`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{node.label.split('(')[0].trim()}</p>
        <p className="text-[10px] text-gray-400">{node.deployment}</p>
      </div>
      {onClick && <FiChevronDown className="w-3.5 h-3.5 text-gray-500" />}
    </div>
  );
};

const FileTree = ({ title, items }) => (
  <div>
    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
      <FiBox className="w-4 h-4 text-indigo-500" />
      {title}
    </h3>
    <div className="space-y-1 font-mono text-xs">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2 py-1" style={{ paddingLeft: `${item.indent * 16}px` }}>
          <span className="text-indigo-500 dark:text-indigo-400 font-semibold shrink-0">{item.path}</span>
          <span className="text-gray-400 dark:text-gray-500">— {item.desc}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ArchitectureView;
