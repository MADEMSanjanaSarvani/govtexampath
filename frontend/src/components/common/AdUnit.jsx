import React, { useEffect, useRef, useState } from 'react';

/**
 * A single explicit AdSense display unit.
 *
 * WHY THIS EXISTS
 * The site carries only the Auto ads loader, so every ad is placed by Google
 * guessing where one fits. Over the week to 10 Sep that produced 698 impressions
 * against 1,010 page views — 0.69 ads per page, when a page with two deliberate
 * slots should exceed 1.0. Auto ads is finding nowhere to go on a large share of
 * pages. A placed unit renders wherever it is put, so impressions track page
 * views instead of trailing them.
 *
 * NEVER RENDERS IN THE ANDROID APP.
 * AdSense is for web inventory; Google's programme policies do not allow AdSense
 * code inside an application, and AdMob is the product for that. The Capacitor
 * build loads this same React bundle, so without this guard shipping an APK would
 * put AdSense code in an app — an account-level risk, not a formatting one. The
 * native check happens inside the effect rather than through useIsNativeApp so
 * there is no render where the unit exists before the platform is known.
 *
 * Nothing renders until `slot` is supplied, so adding <AdUnit> to a page before
 * creating the slot in AdSense is harmless — it is simply absent.
 */
const AdUnit = ({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  // Reserve height so the page does not jump when the ad arrives. Cumulative
  // layout shift is a ranking signal, and ads are the usual cause of it.
  minHeight = 280,
}) => {
  const insRef = useRef(null);
  const pushedRef = useRef(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!slot) return;

    const cap = typeof window !== 'undefined' ? window.Capacitor : null;
    const isNative = cap
      ? (typeof cap.isNativePlatform === 'function' ? cap.isNativePlatform() : Boolean(cap.isNativePlatform))
      : false;
    if (isNative) return; // stays false, so no <ins> is ever created in the app

    setShow(true);
  }, [slot]);

  useEffect(() => {
    if (!show || pushedRef.current) return;
    // AdSense throws "All 'ins' elements in the DOM with class=adsbygoogle
    // already have ads in them" if the same element is pushed twice, which is
    // easy to hit under client-side routing. One push per mounted unit.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // A blocked or not-yet-loaded script must not take the page down with it.
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ minHeight }} aria-hidden="true">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6646740696712454"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdUnit;
