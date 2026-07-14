// Lightweight, honest achievements. Most badges derive from real signals the
// app already has (bookmarks, streak, profile completion); two are tracked in
// localStorage from genuine user actions (using the AI guide, reading articles).

const readInt = (k) => {
  try { return parseInt(localStorage.getItem(k) || '0', 10) || 0; } catch { return 0; }
};
const readFlag = (k) => {
  try { return localStorage.getItem(k) === '1'; } catch { return false; }
};

// ── Trackers (called from the relevant pages) ────────────────────────────────
export const markUsedAIGuide = () => {
  try { localStorage.setItem('ach_ai_guide', '1'); } catch { /* ignore */ }
};

export const incArticlesRead = () => {
  try { localStorage.setItem('ach_articles_read', String(readInt('ach_articles_read') + 1)); } catch { /* ignore */ }
};

// ── Badge definitions ────────────────────────────────────────────────────────
export const getAchievements = ({ bookmarkCount = 0, streak = 0, completionPct = 0 } = {}) => {
  const articlesRead = readInt('ach_articles_read');
  return [
    { id: 'first_login', emoji: '🏅', label: 'First Login', desc: 'Welcome aboard!', unlocked: true, g: 'from-amber-400 to-orange-500' },
    { id: 'first_bookmark', emoji: '🎯', label: 'First Bookmark', desc: 'Saved your first exam', unlocked: bookmarkCount > 0, g: 'from-rose-400 to-red-500' },
    { id: 'collector', emoji: '🔖', label: 'Collector', desc: 'Saved 5 exams', unlocked: bookmarkCount >= 5, g: 'from-pink-400 to-rose-500' },
    { id: 'regular', emoji: '📅', label: 'Regular', desc: '3-day streak', unlocked: streak >= 3, g: 'from-sky-400 to-blue-500' },
    { id: 'on_fire', emoji: '🔥', label: 'On Fire', desc: '7-day streak', unlocked: streak >= 7, g: 'from-orange-400 to-red-500' },
    { id: 'profile_pro', emoji: '⭐', label: 'Profile Pro', desc: 'Completed your profile', unlocked: completionPct >= 100, g: 'from-violet-400 to-purple-500' },
    { id: 'ai_explorer', emoji: '🤖', label: 'AI Explorer', desc: 'Used the AI Career Guide', unlocked: readFlag('ach_ai_guide'), g: 'from-indigo-400 to-blue-500' },
    { id: 'bookworm', emoji: '📚', label: 'Bookworm', desc: 'Read 10 current affairs', unlocked: articlesRead >= 10, g: 'from-emerald-400 to-teal-500' },
  ];
};
