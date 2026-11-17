import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { personalInfo, socials } from '../../data/content';

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

const NAV_LINKS = [
  { index: '01', label: 'Home', to: '/' },
  { index: '02', label: 'Work', to: '/work' },
  { index: '03', label: 'About', to: '/about' },
  { index: '04', label: 'Contact', to: '/contact' },
  { index: '05', label: 'Design System', to: '/design' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const { lockScroll, unlockScroll } = useSmoothScroll();
  const { theme, toggleTheme } = useTheme();
  const { muted, toggleMute } = useSound();

  useEffect(() => {
    if (open) {
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

  return (
    <>
      {/* Fixed Minimal Top Bar */}
      <header className="pointer-events-none fixed top-0 left-0 z-50 w-full px-5 py-5 sm:px-10 sm:py-6">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <Link
            to="/"
            className="pointer-events-auto group inline-flex items-center gap-2.5 rounded-full border border-[var(--border-subtle)] bg-[rgba(6,7,11,0.65)] px-4 py-2 backdrop-blur-xl transition-colors duration-200 hover:border-[var(--border-strong)]"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--accent-neon)] shadow-[0_0_10px_var(--accent-neon)] transition-transform duration-300 group-hover:scale-125" />
            <span className="font-display text-sm font-bold tracking-wider uppercase text-[var(--text-primary)]">
              AK
            </span>
            <span className="hidden font-mono text-[11px] tracking-[0.18em] text-[var(--text-muted)] sm:inline">
              // MERN
            </span>
          </Link>

          <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3">
            <span className="hidden rounded-full border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-3.5 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-secondary)] backdrop-blur-xl md:inline-flex">
              {personalInfo.availability.includes('internship') ? 'Open to Internships' : 'Available'}
            </span>

            {/* Sound Mute Toggle (OFF by default) */}
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

            {/* Dark / Light Theme Toggle (View Transitions circular reveal) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-primary)] backdrop-blur-xl transition-colors duration-200 hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)]"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Morphing Hamburger Button */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
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

      {/* Full-Screen Staggered Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="fullscreen-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { clipPath: 'inset(0% 0% 100% 0%)', opacity: 1 }
            }
            animate={
              reducedMotion
                ? { opacity: 1 }
                : { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }
            }
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { clipPath: 'inset(0% 0% 100% 0%)', opacity: 1 }
            }
            transition={{ duration: reducedMotion ? 0.12 : 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-[var(--bg-void)]/96 px-6 pt-28 pb-10 backdrop-blur-2xl sm:px-12 lg:px-20"
          >
            {/* Subtle Ambient Mesh Inside Menu */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/4 right-10 h-96 w-96 rounded-full opacity-20 blur-[120px]"
              style={{
                background: 'radial-gradient(circle, #B8FF2E 0%, #00F0FF 45%, transparent 72%)',
              }}
            />

            <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 lg:grid-cols-[1.5fr_0.9fr]">
              {/* Staggered Roll-Over Links */}
              <nav className="space-y-3 sm:space-y-4">
                {NAV_LINKS.map((item, idx) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <div key={item.to} className="overflow-hidden">
                      <motion.div
                        initial={reducedMotion ? { opacity: 1 } : { y: '110%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        exit={reducedMotion ? { opacity: 0 } : { y: '110%', opacity: 0 }}
                        transition={{
                          duration: reducedMotion ? 0.01 : 0.55,
                          delay: reducedMotion ? 0 : 0.14 + idx * 0.065,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <a
                          href={item.to}
                          onClick={(e) => handleLinkClick(e, item.to)}
                          className="group inline-flex items-baseline gap-4 py-1 sm:gap-6"
                        >
                          <span
                            className={`font-mono text-xs tracking-widest transition-colors duration-200 sm:text-sm ${
                              isActive
                                ? 'text-[var(--accent-neon)]'
                                : 'text-[var(--text-muted)] group-hover:text-[var(--accent-neon)]'
                            }`}
                          >
                            {item.index}
                          </span>

                          {/* Text Roll-Over Container */}
                          <span className="relative inline-block overflow-hidden leading-[1.05]">
                            <span
                              className={`block font-display text-4xl font-extrabold tracking-tight transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-full motion-reduce:transform-none sm:text-6xl lg:text-7xl ${
                                isActive ? 'text-[var(--accent-neon)]' : 'text-[var(--text-primary)]'
                              }`}
                            >
                              {item.label}
                            </span>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 block translate-y-full font-display text-4xl font-extrabold tracking-tight text-[var(--accent-neon)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-y-0 motion-reduce:hidden sm:text-6xl lg:text-7xl"
                            >
                              {item.label}
                            </span>
                          </span>
                        </a>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>

              {/* Right Column Metadata */}
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.01 : 0.45,
                  delay: reducedMotion ? 0 : 0.32,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-8 border-t border-[var(--border-subtle)] pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12"
              >
                <div className="space-y-2">
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
                    Direct Contact
                  </p>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="block text-lg font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent-neon)]"
                  >
                    {personalInfo.email}
                  </a>
                  <p className="text-sm text-[var(--text-secondary)]">{personalInfo.location}</p>
                </div>

                <div className="space-y-2">
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
                    Profiles
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {socials.map((item) => {
                      const isTodo = item.url.startsWith('TODO');
                      return isTodo ? (
                        <span
                          key={item.name}
                          title={item.url}
                          className="rounded-full border border-[var(--border-subtle)] px-3.5 py-1.5 font-mono text-xs text-[var(--text-muted)]"
                        >
                          {item.name} (TODO)
                        </span>
                      ) : (
                        <a
                          key={item.name}
                          href={item.url}
                          className="rounded-full border border-[var(--border-strong)] px-3.5 py-1.5 font-mono text-xs text-[var(--text-primary)] transition-colors hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)]"
                        >
                          {item.name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--text-muted)]">
              <span>{personalInfo.name}</span>
              <span>ESC TO CLOSE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

