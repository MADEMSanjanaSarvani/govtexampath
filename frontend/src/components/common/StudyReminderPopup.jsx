import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiClock } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const HOUR = 60 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000;   // re-check every 30s
const REMINDER_GAP = HOUR;          // ~1 hour between reminders
const SNOOZE_MS = 10 * 60 * 1000;   // snooze = 10 minutes
const IDLE_RESET = 30 * 60 * 1000;  // a >30-min gap starts a fresh study session

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
  const [hours, setHours] = useState(1);

  const pickMessage = useCallback((h) => {
    const variants = ['studyPopupHour', 'studyPopupStretch', 'studyPopupEyes'];
    const key = variants[(h - 1) % variants.length] || 'studyPopupHour';
    return t(key).replace('{n}', String(h));
  }, [t]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    // Preview trigger for testing: visit any page with ?studybuddy=1
    if (new URLSearchParams(window.location.search).get('studybuddy')) {
      setHours(2);
      setMessage(pickMessage(2));
      setOpen(true);
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
        const h = Math.max(1, Math.floor(sinceStart / HOUR));
        setHours(h);
        setMessage(pickMessage(h));
        setOpen(true);
        localStorage.setItem(LS.lastPopup, String(t0));
      }
    };

    const id = setInterval(tick, CHECK_INTERVAL);
    return () => clearInterval(id);
  }, [pickMessage]);

  const handleDone = () => setOpen(false);
  const handleSnooze = () => {
    localStorage.setItem(LS.snoozeUntil, String(Date.now() + SNOOZE_MS));
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
          className="fixed bottom-5 left-5 z-[60] w-[19rem] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* accent bar */}
          <div className="h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />

          <button
            onClick={handleDone}
            aria-label="Close"
            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>

          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* mascot */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-2xl shadow-md shadow-blue-500/25">
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    💧
                  </motion.span>
                </div>
                <span className="absolute -bottom-1 -right-1 text-sm">📚</span>
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
                onClick={handleSnooze}
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t('studyPopupSnooze')}
              </button>
            </div>

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
