import { useEffect, useState } from 'react';

/**
 * True when running inside the Capacitor Android shell, false on the website.
 *
 * Always starts false and flips after mount, deliberately. These pages are
 * statically exported, so the HTML is generated on a build machine where there
 * is no Capacitor and no window. Reading the platform during render would make
 * the client's first render disagree with that HTML and React would throw a
 * hydration mismatch — so the first paint is the web layout everywhere, and the
 * app chrome appears a tick later.
 *
 * The practical effect is a brief flash of the website layout on cold start.
 * Preventing it properly means the shell telling the page what it is before
 * first paint, which is a bigger change than this one; the flash is the price
 * of static export and it is small.
 */
export default function useIsNativeApp() {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Capacitor injects window.Capacitor. isNativePlatform is a function on v4+
    // but has been a boolean before, so tolerate both rather than assume.
    const cap = typeof window !== 'undefined' ? window.Capacitor : null;
    if (!cap) return;
    const native =
      typeof cap.isNativePlatform === 'function'
        ? cap.isNativePlatform()
        : Boolean(cap.isNativePlatform);
    if (native) setIsNative(true);
  }, []);

  return isNative;
}
