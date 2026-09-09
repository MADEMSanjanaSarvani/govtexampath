import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiFileText, FiCalendar, FiBookmark, FiUser } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Bottom tab bar, rendered only inside the Android shell.
 *
 * The app and the website are the same React build, so without this the app
 * showed the site's top navbar and hamburger — a layout that reads as a web page
 * because navigation sits out of thumb reach and every destination hides behind
 * a menu. Five destinations at the bottom is what makes the difference.
 *
 * The other thirteen routes the navbar carries — About, FAQ, Privacy, Terms and
 * the rest — are not lost; they live under Profile, which is where someone using
 * an app looks for them.
 */

// Labels come from LanguageContext, so these follow the app's language rather
// than pinning English. All five keys already exist in both locales.
const TABS = [
  { href: '/', labelKey: 'home', Icon: FiHome },
  { href: '/exams', labelKey: 'exams', Icon: FiFileText },
  { href: '/exam-calendar', labelKey: 'examCalendar', Icon: FiCalendar },
  { href: '/bookmarks', labelKey: 'bookmarks', Icon: FiBookmark },
  { href: '/profile', labelKey: 'profile', Icon: FiUser },
];

const BottomNav = () => {
  const router = useRouter();
  const { t } = useLanguage();

  // "/" must match exactly or it would light up on every route. The others match
  // their subtree, so an exam detail page keeps the Exams tab active.
  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-800"
      // Keeps the row clear of the gesture bar on phones that have one. Without
      // it the last few pixels of each tab sit under the system handle.
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="flex items-stretch justify-around">
        {TABS.map(({ href, labelKey, Icon }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                // min-h-[56px] keeps every tab a comfortable tap target rather
                // than letting the label's line-height decide.
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[11px] font-medium transition-colors ${
                  active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 active:text-gray-700 dark:active:text-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="max-w-full truncate">{t(labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
