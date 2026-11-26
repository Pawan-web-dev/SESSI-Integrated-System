import { useEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/app/hooks';
import logo from '@/assets/images/essi-logo.png';
import { selectLoading } from '@/features/loader/selectLoading';

/**
 * True a short moment after `active` turns on, and stays true for a minimum time after it turns off.
 * Quick requests (under `showAfter` ms) never show anything, and the loader never flashes on and off.
 */
function useDelayedFlag(active: boolean, showAfter = 200, minShown = 500): boolean {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);
  useEffect(() => {
    let timer: number | undefined;
    if (active && !visible) {
      timer = window.setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, showAfter);
    } else if (!active && visible) {
      const wait = Math.max(150, minShown - (Date.now() - shownAt.current));
      timer = window.setTimeout(() => setVisible(false), wait);
    }
    return () => window.clearTimeout(timer);
  }, [active, visible, showAfter, minShown]);
  return visible;
}

/** The loader itself: a green bar across the top and the ESSI logo in a spinning ring, centred on the page. */
export function LoaderView({ label }: { label: string }) {
  return (
    <>
      <div className="essi-loader-bar" aria-hidden="true" />
      {/* only the logo ring is shown; the label is still read out to screen readers */}
      <div className="essi-loader-overlay" role="status" aria-live="polite" aria-busy="true" aria-label={label}>
        <div className="essi-loader-ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="44" className="essi-loader-track" />
            <circle cx="50" cy="50" r="44" className="essi-loader-arc" />
          </svg>
          <img src={logo} alt="" />
        </div>
      </div>
    </>
  );
}

/**
 * Global loader. Mounted once in App: it appears whenever something is loading or saving
 * (any API call, or work reported with useGlobalLoader) and blocks the screen so a button cannot be pressed twice.
 */
export function GlobalLoader() {
  const { active, label } = useAppSelector(selectLoading, shallowEqual);
  const visible = useDelayedFlag(active);
  // keep the last message while the loader fades out, so the text does not jump to the default
  const [shownLabel, setShownLabel] = useState(label);
  if (active && label !== shownLabel) setShownLabel(label);
  return visible ? <LoaderView label={shownLabel} /> : null;
}

/** Shown while a page's code is being downloaded (Suspense fallback). */
export function PageLoader() {
  const visible = useDelayedFlag(true, 200, 0);
  return visible ? <LoaderView label="Loading page…" /> : null;
}
