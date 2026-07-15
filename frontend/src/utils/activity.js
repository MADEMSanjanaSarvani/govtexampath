// Records real daily activity (one entry per day the user opens the site) so the
// Profile can show a GitHub-style streak heatmap. Data is local to the browser
// and fills in over time — nothing is fabricated.

const KEY = 'activity_days';

const isoDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
};

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
};

// Call once per page/app load — stamps today as an active day.
export const recordActivity = () => {
  try {
    const today = isoDay(new Date());
    const set = new Set(read());
    if (!set.has(today)) {
      set.add(today);
      const arr = [...set].sort().slice(-220); // keep ~7 months
      localStorage.setItem(KEY, JSON.stringify(arr));
    }
  } catch { /* ignore */ }
};

export const getActivityDays = () => new Set(read());

export const getStreaks = () => {
  const sorted = read().sort();
  if (sorted.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const gap = Math.round((new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000);
    if (gap === 1) { run += 1; longest = Math.max(longest, run); } else { run = 1; }
  }

  const days = new Set(sorted);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let current = 0;
  for (let i = 0; ; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    if (days.has(isoDay(d))) current += 1; else break;
  }

  return { current, longest };
};
