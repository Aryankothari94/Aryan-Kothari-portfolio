import { Suspense, lazy, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const FullscreenMenu = lazy(() => import('./FullscreenMenu'));

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" />
    </svg>
  );
}

function SoundIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
      {muted ? (
        <path d="m16 9 5 6m0-6-5 6" strokeLinecap="round" />
      ) : (
        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const { lockScroll, unlockScroll } = useSmoothScroll();
  const { theme, toggleTheme } = useTheme();
  const { muted, toggleMute } = useSound();

  useEffect(() => {
    if (open) {
      setMenuMounted(true);
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [open, lockScroll, unlockScroll]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleLinkClick = (e, to) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== to) {
      navigate(to);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setMenuMounted(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed top-0 left-0 z-[65] w-full px-5 py-5 sm:px-10 sm:py-6">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <Link
            to="/"
            className="pointer-events-auto group inline-flex items-center gap-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2 transition-colors duration-200 hover:border-[var(--border-strong)]"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--accent-neon)] shadow-[0_0_10px_var(--accent-neon)] transition-transform duration-300 group-hover:scale-125" />
            <span className="font-display text-sm font-bold tracking-wider uppercase text-[var(--text-primary)]">
              AK
            </span>
            <span className="hidden font-mono text-xs tracking-[0.18em] text-[var(--text-muted)] sm:inline">
              // MERN
            </span>
          </Link>

          <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={toggleMute}
              aria-pressed={!muted}
              aria-label={muted ? 'Enable subtle UI sounds' : 'Mute UI sounds'}
              title={muted ? 'Sound: Off (click to enable)' : 'Sound: On'}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xl transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)] ${
                muted
                  ? 'border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                  : 'border-[var(--accent-neon)] bg-[var(--accent-neon-dim)] text-[var(--accent-neon)]'
              }`}
            >
              <SoundIcon muted={muted} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-primary)] backdrop-blur-xl transition-colors duration-200 hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)]"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              type="button"
              onPointerEnter={() => setMenuMounted(true)}
              onClick={() => {
                setMenuMounted(true);
                setOpen((prev) => !prev);
              }}
              aria-expanded={open}
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              className="group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-glass)] backdrop-blur-xl transition-colors duration-200 hover:border-[var(--accent-neon)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)]"
            >
              <div className="relative flex h-4 w-5 flex-col items-center justify-center">
                <span
                  className={`absolute h-[1.75px] w-5 rounded-full bg-[var(--text-primary)] transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                    open
                      ? 'translate-y-0 rotate-45 bg-[var(--accent-neon)]'
                      : '-translate-y-[5px] rotate-0 group-hover:w-4'
                  }`}
                />
                <span
                  className={`absolute h-[1.75px] w-5 rounded-full bg-[var(--text-primary)] transition-all duration-200 ease-[var(--ease-out-expo)] ${
                    open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
                  }`}
                />
                <span
                  className={`absolute h-[1.75px] w-5 rounded-full bg-[var(--text-primary)] transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                    open
                      ? 'translate-y-0 -rotate-45 bg-[var(--accent-neon)]'
                      : 'translate-y-[5px] rotate-0 group-hover:w-4'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {menuMounted && (
        <Suspense fallback={null}>
          <FullscreenMenu
            open={open}
            currentPath={location.pathname}
            reducedMotion={reducedMotion}
            onNavigate={handleLinkClick}
          />
        </Suspense>
      )}
    </>
  );
}
