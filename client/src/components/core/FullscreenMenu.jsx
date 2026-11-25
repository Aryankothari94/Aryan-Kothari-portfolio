import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { personalInfo, socials } from '../../data/content';
import { MOTION } from '../../config/motion';

const NAV_LINKS = [
  { index: '01', label: 'Home', to: '/' },
  { index: '02', label: 'Work', to: '/work' },
  { index: '03', label: 'About', to: '/about' },
  { index: '04', label: 'Contact', to: '/contact' },
  { index: '05', label: 'Design System', to: '/design' },
];

export default function FullscreenMenu({ open, currentPath, reducedMotion, onNavigate }) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            key="fullscreen-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={reducedMotion ? { opacity: 0 } : { y: '-100%', opacity: 0.9 }}
            animate={reducedMotion ? { opacity: 1 } : { y: '0%', opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { y: '-100%', opacity: 0.9 }}
            transition={{
              duration: reducedMotion ? 0.12 : MOTION.timing.menuDuration,
              ease: MOTION.easing.framerSnappy,
            }}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--bg-void) 96%, transparent)',
            }}
            className="fixed inset-0 z-[60] flex flex-col justify-between overflow-y-auto px-6 pt-28 pb-10 backdrop-blur-2xl will-change-transform sm:px-12 lg:px-20"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/4 right-10 h-96 w-96 rounded-full opacity-20 blur-[120px]"
              style={{
                background: 'radial-gradient(circle, #B8FF2E 0%, #00F0FF 45%, transparent 72%)',
              }}
            />

            <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 lg:grid-cols-[1.5fr_0.9fr]">
              <nav className="space-y-3 sm:space-y-4">
                {NAV_LINKS.map((item, idx) => {
                  const isActive = currentPath === item.to;
                  return (
                    <div key={item.to} className="overflow-hidden">
                      <motion.div
                        initial={reducedMotion ? { opacity: 1 } : { y: '110%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        exit={reducedMotion ? { opacity: 0 } : { y: '110%', opacity: 0 }}
                        transition={{
                          duration: reducedMotion ? 0.01 : MOTION.timing.menuLinkDuration,
                          delay: reducedMotion
                            ? 0
                            : MOTION.timing.menuLinkDelay + idx * MOTION.timing.menuLinkStagger,
                          ease: MOTION.easing.framerSnappy,
                        }}
                      >
                        <a
                          href={item.to}
                          onClick={(e) => onNavigate(e, item.to)}
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

              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.01 : MOTION.timing.menuLinkDuration,
                  delay: reducedMotion ? 0 : 0.18,
                  ease: MOTION.easing.framerSnappy,
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
                  <p className="text-sm text-[var(--text-secondary)]">{personalInfo.availability}</p>
                </div>

                {personalInfo.resumeUrl && !personalInfo.resumeUrl.startsWith('TODO') ? (
                  <a
                    href={personalInfo.resumeUrl}
                    download="Aryan_Kothari_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-[var(--accent-neon)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#06070B]"
                  >
                    Download Resume ↗
                  </a>
                ) : (
                  <span
                    title={personalInfo.resumeUrl}
                    className="inline-flex rounded-full border border-[var(--border-subtle)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    Resume PDF (TODO)
                  </span>
                )}

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
    </MotionConfig>
  );
}

