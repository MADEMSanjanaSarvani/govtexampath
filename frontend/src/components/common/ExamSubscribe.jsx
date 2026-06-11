import React, { useState, useEffect } from 'react';
import { FiBell, FiBellOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'examSubscriptions';

const getSubscriptions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setSubscriptions = (subs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
};

const ExamSubscribe = ({ category, examTitle }) => {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const subs = getSubscriptions();
    setSubscribed(subs.includes(category));
  }, [category]);

  const handleToggle = () => {
    const subs = getSubscriptions();
    const displayName = examTitle || category;

    if (subscribed) {
      const updated = subs.filter((c) => c !== category);
      setSubscriptions(updated);
      setSubscribed(false);
      toast(`Unsubscribed from ${displayName} alerts`, {
        icon: '🔕',
      });
    } else {
      const updated = [...subs, category];
      setSubscriptions(updated);
      setSubscribed(true);
      toast.success(`Subscribed to ${displayName} exam alerts!`);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
        subscribed
          ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/50'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400'
      }`}
      aria-label={subscribed ? `Unsubscribe from ${category} alerts` : `Subscribe to ${category} alerts`}
    >
      {subscribed ? (
        <>
          <FiBellOff className="w-3.5 h-3.5" />
          Subscribed
        </>
      ) : (
        <>
          <FiBell className="w-3.5 h-3.5" />
          Subscribe
        </>
      )}
    </button>
  );
};

export default ExamSubscribe;
