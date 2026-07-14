import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiClock, FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const HOUR = 60 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000;   // re-check every 30s
const REMINDER_GAP = HOUR;          // ~1 hour between reminders
const SNOOZE_OPTIONS = [2, 5, 10];  // snooze durations offered (minutes)
const IDLE_RESET = 30 * 60 * 1000;  // a >30-min gap starts a fresh study session

// Rotating exam-themed, motivational reminder lines (each also nudges a break).
const MESSAGES = [
  { key: 'studyMsg1', accent: '🎓' },
  { key: 'studyMsg2', accent: '🎯' },
  { key: 'studyMsg3', accent: '🌟' },
  { key: 'studyMsg4', accent: '💧' },
  { key: 'studyMsg5', accent: '🔥' },
  { key: 'studyMsg6', accent: '🏆' },
];

const LS = {
  start: 'study_session_start',
  lastActive: 'study_last_active',
  lastPopup: 'study_last_popup',
  snoozeUntil: 'study_snooze_until',
  disabled: 'study_reminders_off',
};

const getNum = (k) => parseInt(localStorage.getItem(k) || '0', 10);

export default function StudyReminderPopup() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [accent, setAccent] = useState('🎓');
  const [showSnooze, setShowSnooze] = useState(false);

  const show = useCallback((h) => {
    const idx = (Math.max(1, h) - 1) % MESSAGES.length;
    const { key, accent: acc } = MESSAGES[idx];
    setMessage(t(key).replace('{n}', String(Math.max(1, h))));
    setAccent(acc);
    setShowSnooze(false);
    setOpen(true);
  }, [t]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    // Preview trigger for testing: visit any page with ?studybuddy=1
    if (new URLSearchParams(window.location.search).get('studybuddy')) {
      show(2);
    }

    // Start or resume a study session.
    const now = Date.now();
    if (!localStorage.getItem(LS.start) || now - getNum(LS.lastActive) > IDLE_RESET) {
      localStorage.setItem(LS.start, String(now));
    }
    localStorage.setItem(LS.lastActive, String(now));

    const tick = () => {
      const t0 = Date.now();
      localStorage.setItem(LS.lastActive, String(t0));

      if (localStorage.getItem(LS.disabled) === '1') return;
      if (t0 < getNum(LS.snoozeUntil)) return;

      const start = getNum(LS.start) || t0;
      const lastPopup = getNum(LS.lastPopup);
      const sinceStart = t0 - start;
      const sinceLast = t0 - (lastPopup || start);

      if (sinceStart >= REMINDER_GAP && sinceLast >= REMINDER_GAP) {
        show(Math.max(1, Math.floor(sinceStart / HOUR)));
        localStorage.setItem(LS.lastPopup, String(t0));
      }
    };

    const id = setInterval(tick, CHECK_INTERVAL);
    return () => clearInterval(id);
  }, [show]);

  const handleDone = () => setOpen(false);
  const handleSnooze = (minutes) => {
    localStorage.setItem(LS.snoozeUntil, String(Date.now() + minutes * 60 * 1000));
    setShowSnooze(false);
    setOpen(false);
  };
  const handleDisable = () => {
    localStorage.setItem(LS.disabled, '1');
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          role="dialog"
          aria-live="polite"
          className="fixed bottom-24 right-5 z-[60] w-[19rem] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* accent bar */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

          <button
            onClick={handleDone}
            aria-label="Close"
            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>

          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* exam mascot */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-2xl shadow-md shadow-blue-500/25">
                  <motion.span
                    animate={{ y: [0, -3, 0], rotate: [0, -4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🧑‍🎓
                  </motion.span>
                </div>
                <motion.span
                  key={accent}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                  className="absolute -bottom-1.5 -right-1.5 text-base drop-shadow"
                >
                  {accent}
                </motion.span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <FiClock className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                    {t('studyPopupTitle')}
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3.5">
              <button
                onClick={handleDone}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors shadow-sm"
              >
                <FiCheck className="w-4 h-4" /> {t('studyPopupDone')}
              </button>
              <button
                onClick={() => setShowSnooze((s) => !s)}
                aria-expanded={showSnooze}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  showSnooze
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('studyPopupSnooze')}
                <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${showSnooze ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {showSnooze && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 mt-2">
                    {SNOOZE_OPTIONS.map((m) => (
                      <button
                        key={m}
                        onClick={() => handleSnooze(m)}
                        className="flex-1 px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        {t('snoozeFor').replace('{n}', String(m))}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleDisable}
              className="mt-2 w-full text-center text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {t('studyPopupOff')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
