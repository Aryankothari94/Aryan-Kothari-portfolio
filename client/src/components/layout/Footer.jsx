import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '../ui';
import { FooterMiniGame } from './FooterMiniGame';
import { personalInfo, socials } from '../../data/content';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 11v5M8 8v.01M12 16v-5m0 2a2 2 0 1 1 4 0v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        d="M9 19c-4 1.2-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.5-.6 1.2-.5 2V21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RocketIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        d="M12 2c3.5 3 5 6.8 5 11.2L15 16H9l-2-2.8C7 8.8 8.5 5 12 2Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M7 12.5 4 15v2l3-1M17 12.5l3 2.5v2l-3-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICON_MAP = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Email: MailIcon,
};

function formatLocalTimeIST() {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

export function Footer() {
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  const [localTime, setLocalTime] = useState(formatLocalTimeIST);
  const [launching, setLaunching] = useState(false);

  const wordmarkRef = useRef(null);
  const fillLayerRef = useRef(null);

  // Live local-time clock
  useEffect(() => {
    const timer = window.setInterval(() => {
      setLocalTime(formatLocalTimeIST());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Giant outlined text that fills on scroll
  useEffect(() => {
    if (reducedMotion || !wordmarkRef.current || !fillLayerRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillLayerRef.current,
        { clipPath: 'inset(0% 100% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: 'top 92%',
            end: 'bottom 80%',
            scrub: 0.5,
          },
        }
      );
    }, wordmarkRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleRocketLaunch = () => {
    if (reducedMotion) {
      scrollTo(0);
      return;
    }
    if (launching) return;
    setLaunching(true);
    window.setTimeout(() => {
      scrollTo(0);
    }, 180);
    window.setTimeout(() => {
      setLaunching(false);
    }, 760);
  };

  return (
    <footer className="relative z-10 overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 pt-14 pb-10 backdrop-blur-xl">
      <Container className="space-y-12">
        {/* Top Row: Socials + Playable Mini-Game + Live Clock + Rocket Back-to-Top */}
        <div className="flex flex-wrap items-center justify-between gap-8">
          {/* Social Icons with Hover Glow */}
          <div className="flex flex-wrap items-center gap-3">
            {socials.map((item) => {
              const Icon = ICON_MAP[item.name] || MailIcon;
              const isTodo = item.url.startsWith('TODO');
              if (isTodo) {
                return (
                  <span
                    key={item.name}
                    title={item.url}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white/[0.02] px-4 py-2 font-mono text-xs text-[var(--text-muted)]"
                  >
                    <Icon />
                    <span>{item.name}</span>
                    <span className="text-[10px] opacity-70">(TODO)</span>
                  </span>
                );
              }
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target={item.url.startsWith('http') ? '_blank' : undefined}
                  rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/[0.03] px-4 py-2 font-mono text-xs text-[var(--text-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)] hover:shadow-[0_0_24px_rgba(184,255,46,0.24)]"
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    <Icon />
                  </span>
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Playable Mini-Game */}
          <FooterMiniGame />

          {/* Live Local Time Clock + Rocket Launch Button */}
          <div className="flex items-center gap-5">
            <div className="text-right font-mono">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--text-muted)]">
                Banswara, IN (IST)
              </p>
              <p className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                {localTime}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRocketLaunch}
              aria-label="Launch back to top"
              className="group relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-visible rounded-full border border-[var(--border-strong)] bg-[rgba(13,16,26,0.8)] text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)]"
            >
              {/* Exhaust Trail */}
              {launching && (
                <span
                  aria-hidden="true"
                  className="animate-exhaust-trail pointer-events-none absolute top-full h-14 w-2 rounded-full bg-gradient-to-b from-[#B8FF2E] via-[#00F0FF] to-transparent blur-[1px]"
                />
              )}

              <RocketIcon
                className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 ${
                  launching ? 'animate-rocket-launch text-[var(--accent-neon)]' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Giant Outlined Text that Fills on Scroll */}
        <div
          ref={wordmarkRef}
          aria-hidden="true"
          className="relative select-none overflow-hidden py-2 text-center"
        >
          <div
            className="font-display font-extrabold leading-[0.9] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(244,246,251,0.2)]"
            style={{ fontSize: 'clamp(2.5rem, 10.5vw, 9.5rem)' }}
          >
            {personalInfo.name.toUpperCase()}
          </div>

          <div
            ref={fillLayerRef}
            style={reducedMotion ? undefined : { clipPath: 'inset(0% 100% 0% 0%)' }}
            className="pointer-events-none absolute inset-0 py-2 font-display font-extrabold leading-[0.9] tracking-[-0.04em] text-gradient-secondary will-change-[clip-path]"
          >
            <span style={{ fontSize: 'clamp(2.5rem, 10.5vw, 9.5rem)' }}>
              {personalInfo.name.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
          <span>© 2026 {personalInfo.name}</span>
          <span>MERN Stack · Java DSA · AI Workflow Automation</span>
        </div>
      </Container>
    </footer>
  );
}

