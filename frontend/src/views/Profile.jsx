import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from '@/lib/router';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiEdit2, FiSave, FiX, FiHome, FiBookmark, FiBell, FiShield,
  FiArrowRight, FiZap, FiClock, FiTrendingUp, FiCheckSquare, FiCpu, FiBook,
  FiMap, FiGlobe, FiCalendar, FiAward, FiTarget, FiSun, FiMoon, FiExternalLink,
  FiChevronRight, FiActivity, FiCheck,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { updateProfile } from '../services/authService';
import { getBookmarks, getExams } from '../services/examService';
import { getAchievements } from '../utils/achievements';
import { getActivityDays, getStreaks } from '../utils/activity';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';

// ── Motivational quotes (rotate daily) ───────────────────────────────────────
const QUOTES = [
  'Success is the sum of small efforts repeated day in and day out.',
  'The expert in anything was once a beginner.',
  'Your only limit is the amount of effort you are willing to put in.',
  "Don't watch the clock; do what it does — keep going.",
  'One selection can change your whole life. Keep preparing.',
  'Discipline beats motivation. Show up today.',
  'Every topper was once where you are right now.',
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' } }),
};

const daysBetween = (a, b) => Math.floor((a - b) / 86400000);

const Profile = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, fetchNotifications } = useNotifications();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const [bookmarkCount, setBookmarkCount] = useState(null);
  const [exams, setExams] = useState([]);
  const [streak, setStreak] = useState(1);
  const [studyMins, setStudyMins] = useState(0);

  const firstName = (user?.name || 'there').trim().split(' ')[0];
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  // ── Real data: bookmarks + exams + notifications ──────────────────────────
  useEffect(() => {
    let active = true;
    getBookmarks()
      .then((d) => { const list = d?.exams || d?.data || d; if (active) setBookmarkCount(Array.isArray(list) ? list.length : 0); })
      .catch(() => active && setBookmarkCount(0));
    getExams({ limit: 60 })
      .then((d) => { const list = d?.exams || d?.data || d; if (active) setExams(Array.isArray(list) ? list : []); })
      .catch(() => {});
    fetchNotifications?.({ limit: 5 });
    return () => { active = false; };
  }, [fetchNotifications]);

  // ── Real daily visit/study streak (localStorage) ──────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const lastVisit = parseInt(localStorage.getItem('profile_last_visit') || '0', 10);
    let s = parseInt(localStorage.getItem('profile_streak') || '0', 10) || 0;
    if (!lastVisit) s = 1;
    else {
      const gap = daysBetween(todayMs, lastVisit);
      if (gap === 1) s += 1;          // consecutive day
      else if (gap > 1) s = 1;        // streak broken
      else s = Math.max(s, 1);        // same day
    }
    localStorage.setItem('profile_streak', String(s));
    localStorage.setItem('profile_last_visit', String(todayMs));
    setStreak(s);

    // Study minutes today, from the study-session timer we already track
    const start = parseInt(localStorage.getItem('study_session_start') || '0', 10);
    const lastActive = parseInt(localStorage.getItem('study_last_active') || '0', 10);
    if (start && lastActive >= todayMs) {
      setStudyMins(Math.max(0, Math.round((lastActive - Math.max(start, todayMs)) / 60000)));
    }
  }, []);

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setLoading(true);
    try {
      const data = await updateProfile({ name });
      updateUser(data.data || data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ── Upcoming exams (nearest future deadline) ──────────────────────────────
  const upcoming = useMemo(() => {
    const now = Date.now();
    return exams
      .map((e) => ({ e, when: e.lastDate ? new Date(e.lastDate).getTime() : null }))
      .filter((x) => x.when && x.when >= now)
      .sort((a, b) => a.when - b.when)
      .slice(0, 3)
      .map((x) => ({ ...x.e, daysLeft: Math.max(0, daysBetween(x.when, now)) }));
  }, [exams]);

  // ── Recommendations (popular / high-salary picks) ─────────────────────────
  const recommended = useMemo(() => exams.slice(0, 4), [exams]);

  // ── Profile completion (real, actionable) ─────────────────────────────────
  const completion = useMemo(() => {
    const items = [
      { label: 'Add your name', done: !!user?.name },
      { label: 'Verify your email', done: !!user?.email },
      { label: 'Save your first exam', done: (bookmarkCount || 0) > 0 },
      { label: 'Pick your language', done: !!language },
      { label: 'Build a 3-day streak', done: streak >= 3 },
    ];
    const done = items.filter((i) => i.done).length;
    return { pct: Math.round((done / items.length) * 100), items };
  }, [user, bookmarkCount, language, streak]);

  const achievements = useMemo(
    () => getAchievements({ bookmarkCount: bookmarkCount || 0, streak, completionPct: completion.pct }),
    [bookmarkCount, streak, completion.pct],
  );
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—';
  const lastLogin = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : 'Today';

  // ── Quick action tiles (all real links) ───────────────────────────────────
  const actions = [
    { to: '/dashboard', Icon: FiHome, label: t('dashboard'), g: 'from-blue-500 to-indigo-600' },
    { to: '/bookmarks', Icon: FiBookmark, label: t('bookmarks'), g: 'from-rose-500 to-red-600' },
    { to: '/ai-guide', Icon: FiCpu, label: t('careerGuide'), g: 'from-violet-500 to-purple-600' },
    { to: '/eligibility-checker', Icon: FiCheckSquare, label: t('eligibilityChecker'), g: 'from-emerald-500 to-teal-600' },
    { to: '/current-affairs', Icon: FiGlobe, label: t('currentAffairs'), g: 'from-cyan-500 to-blue-600' },
    { to: '/mind-maps', Icon: FiMap, label: t('mindMaps'), g: 'from-amber-500 to-orange-600' },
    { to: '/resources', Icon: FiBook, label: t('resources'), g: 'from-fuchsia-500 to-pink-600' },
    { to: '/exam-calendar', Icon: FiCalendar, label: t('examCalendar'), g: 'from-indigo-500 to-blue-600' },
  ];

  const stats = [
    { Icon: FiBookmark, label: 'Saved Exams', value: bookmarkCount, g: 'from-rose-500 to-red-600', to: '/bookmarks' },
    { Icon: FiZap, label: 'Day Streak', value: streak, suffix: streak === 1 ? ' day' : ' days', g: 'from-amber-500 to-orange-600' },
    { Icon: FiClock, label: 'Study Time Today', value: studyMins, suffix: ' min', g: 'from-emerald-500 to-teal-600' },
    { Icon: FiBell, label: 'Notifications', value: unreadCount || 0, g: 'from-violet-500 to-purple-600', to: '/notifications' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="My Profile" path="/profile" description="Your personalised GovtExamPath dashboard — track streaks, bookmarks, upcoming exams and recommendations." noindex />

      {/* ── 1. HERO HEADER ─────────────────────────────────────────────── */}
      <motion.section
        variants={fadeUp} initial="hidden" animate="show"
        className="relative overflow-hidden rounded-[24px] p-6 sm:p-8 mb-6 text-white shadow-xl shadow-blue-500/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-[20px] bg-white/15 backdrop-blur-sm border-4 border-white/25 flex items-center justify-center text-4xl font-extrabold shadow-lg">
              {initial}
            </div>
            <button
              type="button"
              aria-label="Upload profile picture"
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              onClick={() => toast('Photo upload coming soon!', { icon: '📸' })}
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <p className="text-blue-100 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 flex-wrap">
              {firstName} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-blue-100/90 text-sm mt-1">Continue your government exam preparation journey.</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                <FiMail className="w-3 h-3" /> {user?.email}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm capitalize">
                <FiShield className="w-3 h-3" /> {user?.role || 'user'}
              </span>
            </div>
          </div>

          {/* Meta + completion */}
          <div className="sm:text-right sm:min-w-[190px]">
            <div className="grid grid-cols-2 sm:block gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-blue-200">Member Since</p>
                <p className="font-semibold">{memberSince}</p>
              </div>
              <div className="sm:mt-2">
                <p className="text-[11px] uppercase tracking-wide text-blue-200">Last Login</p>
                <p className="font-semibold">{lastLogin}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-blue-100 mb-1">
                <span>Profile completion</span><span className="font-bold">{completion.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <motion.div className="h-full rounded-full bg-white"
                  initial={{ width: 0 }} animate={{ width: `${completion.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
            </div>
            <button
              onClick={() => setEditing((v) => !v)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors shadow"
            >
              <FiEdit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Inline edit */}
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="relative mt-5 pt-5 border-t border-white/20 overflow-hidden">
            <label className="block text-xs text-blue-100 mb-1.5">Full name</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/95 text-gray-900 outline-none focus:ring-2 focus:ring-white" />
              <button onClick={handleSave} disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-semibold disabled:opacity-60">
                {loading ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />} Save
              </button>
              <button onClick={() => { setEditing(false); setName(user?.name || ''); }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm font-medium">
                <FiX className="w-4 h-4" /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* ── 2. QUICK STATS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const Card = s.to ? Link : 'div';
          return (
            <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
              <Card {...(s.to ? { to: s.to } : {})}
                className="block h-full bg-white dark:bg-gray-800 rounded-[20px] border border-gray-100 dark:border-gray-700 p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.g} flex items-center justify-center shadow-md mb-3`}>
                  <s.Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">
                  {s.value === null ? <span className="inline-block w-8 h-6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse align-middle" /> : s.value}{s.value !== null && s.suffix}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── 3. QUICK ACTIONS ───────────────────────────────────────────── */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map(({ to, Icon, label, g }) => (
            <Link key={to} to={to}
              className="group flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g} flex items-center justify-center shadow-sm flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ── ACHIEVEMENTS ───────────────────────────────────────────────── */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
            <FiAward className="w-4 h-4 text-amber-500" /> Achievements
          </h2>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{unlockedCount}/{achievements.length} unlocked</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {achievements.map((a, i) => (
            <motion.div key={a.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
              title={`${a.label} — ${a.desc}`}
              className={`relative flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl border transition-all ${
                a.unlocked
                  ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg'
                  : 'bg-gray-50 dark:bg-gray-800/40 border-dashed border-gray-200 dark:border-gray-700'
              }`}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${
                a.unlocked ? `bg-gradient-to-br ${a.g} shadow-md` : 'bg-gray-200 dark:bg-gray-700 grayscale opacity-50'
              }`}>
                {a.emoji}
              </div>
              <p className={`text-[11px] font-semibold leading-tight ${a.unlocked ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>{a.label}</p>
              {!a.unlocked && <span className="text-[9px] text-gray-400 dark:text-gray-500">🔒 locked</span>}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── STUDY ACTIVITY HEATMAP ─────────────────────────────────────── */}
      <StreakHeatmap />

      {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / MAIN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming exams */}
          <Panel title="Upcoming Deadlines" icon={FiClock} accent="text-orange-500">
            {upcoming.length === 0 ? (
              <Empty text="No upcoming deadlines loaded yet." />
            ) : (
              <div className="space-y-3">
                {upcoming.map((e) => (
                  <div key={e._id || e.title} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex-shrink-0">
                      <span className="text-lg font-extrabold leading-none">{e.daysLeft}</span>
                      <span className="text-[9px] uppercase">{e.daysLeft === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{e.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{e.category} · last date {new Date(e.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <Link to={`/exams/${e._id}`} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 flex-shrink-0">
                      View <FiChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Recommendations */}
          <Panel title="Recommended For You" icon={FiTarget} accent="text-violet-500" action={{ to: '/exams', label: 'Browse all' }}>
            {recommended.length === 0 ? (
              <Empty text="Recommendations load once exams are fetched." />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {recommended.map((e) => (
                  <div key={e._id || e.title} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug">{e.title}</p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 flex-shrink-0">{e.category}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 mb-3">
                      {e.salary && <p>💰 {e.salary}</p>}
                      {e.eligibility && <p className="line-clamp-1">🎓 {e.eligibility}</p>}
                    </div>
                    <Link to={`/exams/${e._id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                      View Details <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Recent notifications */}
          <Panel title="Recent Notifications" icon={FiBell} accent="text-amber-500" action={{ to: '/notifications', label: 'View all' }}>
            {(!notifications || notifications.length === 0) ? (
              <Empty text="No notifications yet." />
            ) : (
              <div className="space-y-1">
                {notifications.slice(0, 4).map((n) => {
                  const unread = !n.read && !n.isRead;
                  return (
                    <div key={n._id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      {unread ? <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" /> : <span className="w-2 h-2 mt-1.5 flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${unread ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{n.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        {/* RIGHT / SIDE */}
        <div className="space-y-6">
          {/* Profile completion */}
          <Panel title="Profile Completion" icon={FiActivity} accent="text-emerald-500">
            <div className="flex items-center gap-4 mb-4">
              <Ring pct={completion.pct} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Complete your profile to unlock better recommendations.</p>
              </div>
            </div>
            <div className="space-y-2">
              {completion.items.map((it) => (
                <div key={it.label} className="flex items-center gap-2 text-sm">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${it.done ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                    {it.done ? <FiCheck className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                  </span>
                  <span className={it.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}>{it.label}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Preferences */}
          <Panel title="Preferences" icon={FiGlobe} accent="text-blue-500">
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Language</p>
              <div className="flex gap-1.5">
                {[['en', 'EN'], ['hi', 'हिं'], ['te', 'తె']].map(([code, lbl]) => (
                  <button key={code} onClick={() => setLanguage(code)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${language === code ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Theme</p>
              <button onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isDark ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />} {isDark ? 'Dark' : 'Light'} mode
                </span>
                <span className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${isDark ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}>
                  <span className="w-4 h-4 rounded-full bg-white shadow" />
                </span>
              </button>
            </div>
          </Panel>

          {/* Security */}
          <Panel title="Security" icon={FiShield} accent="text-gray-500">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Password</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reset your account password</p>
              </div>
              <Link to="/forgot-password" className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                Reset <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Panel>

          {/* Motivational */}
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            className="rounded-[20px] p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-indigo-100 text-xs font-semibold uppercase tracking-wide">
              <FiAward className="w-4 h-4" /> Today's Motivation
            </div>
            <p className="text-sm leading-relaxed font-medium">"{quote}"</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ── Reusable pieces ──────────────────────────────────────────────────────────
const Panel = ({ title, icon: Icon, accent, action, children }) => (
  <motion.section variants={fadeUp} initial="hidden" animate="show"
    className="bg-white dark:bg-gray-800 rounded-[20px] border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
        {Icon && <Icon className={`w-5 h-5 ${accent || 'text-blue-500'}`} />} {title}
      </h2>
      {action && (
        <Link to={action.to} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
          {action.label} <FiChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
    {children}
  </motion.section>
);

const Empty = ({ text }) => (
  <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">{text}</p>
);

// GitHub-style activity heatmap of daily site visits (last 18 weeks).
const StreakHeatmap = () => {
  const [cells, setCells] = useState([]);
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const days = getActivityDays();
    setStreaks(getStreaks());

    const WEEKS = 18;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - (WEEKS * 7 - 1));
    start.setDate(start.getDate() - start.getDay()); // align to Sunday

    const out = [];
    for (let i = 0; i < WEEKS * 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      out.push({ key, active: days.has(key), future: d > today });
    }
    setCells(out);
  }, []);

  // group into week columns (7 rows each)
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <motion.section variants={fadeUp} initial="hidden" animate="show"
      className="mb-6 bg-white dark:bg-gray-800 rounded-[20px] border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
          <FiZap className="w-4 h-4 text-orange-500" /> Study Activity
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-600 dark:text-gray-300">🔥 Current: <b className="text-gray-900 dark:text-gray-100">{streaks.current}d</b></span>
          <span className="text-gray-600 dark:text-gray-300">🏆 Longest: <b className="text-gray-900 dark:text-gray-100">{streaks.longest}d</b></span>
        </div>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((c) => (
                <div
                  key={c.key}
                  title={c.future ? '' : `${c.key}${c.active ? ' · active' : ''}`}
                  className={`w-3 h-3 rounded-sm ${
                    c.future
                      ? 'bg-transparent'
                      : c.active
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                        : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-gray-400">
        <span>Less</span>
        <span className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-700" />
        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-700" />
        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-emerald-400 to-teal-500" />
        <span>More</span>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Your activity fills in each day you visit — keep the streak alive! 🔥</p>
    </motion.section>
  );
};

const Ring = ({ pct }) => {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-gray-200 dark:stroke-gray-700" />
        <motion.circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round"
          className="stroke-emerald-500" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.9, ease: 'easeOut' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-gray-900 dark:text-gray-100">{pct}%</span>
    </div>
  );
};

export default Profile;
