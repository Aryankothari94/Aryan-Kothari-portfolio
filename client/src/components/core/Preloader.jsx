import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { MOTION } from '../../config/motion';

export function Preloader({ onRevealStart, onComplete }) {
  const reducedMotion = useReducedMotion();
  const { lockScroll, unlockScroll } = useSmoothScroll();

  const overlayRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const strokeTextRef = useRef(null);
  const fillTextRef = useRef(null);
  const underlinePathRef = useRef(null);
  const contentWrapRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      unlockScroll();
      onRevealStart?.();
      onComplete?.();
      return undefined;
    }

    lockScroll();

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const underlinePath = underlinePathRef.current;
      const underlineLength = underlinePath ? underlinePath.getTotalLength() : 620;

      if (underlinePath) {
        gsap.set(underlinePath, {
          strokeDasharray: underlineLength,
          strokeDashoffset: underlineLength,
        });
      }

      gsap.set(strokeTextRef.current, {
        strokeDasharray: 720,
        strokeDashoffset: 720,
      });

      gsap.set(fillTextRef.current, { opacity: 0 });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        onComplete: () => {
          try {
            window.sessionStorage.setItem(MOTION.preloader.sessionKey, '1');
          } catch {
            // ignore storage errors
          }
          unlockScroll();
          onComplete?.();
        },
      });

      const p = MOTION.preloader;

      // Phase 1: 0-100 counter, SVG stroke draw, and GPU progress bar
      tl.to(
        counter,
        {
          value: 100,
          duration: p.countDuration,
          ease: MOTION.easing.gsapPowerOut,
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0');
            }
          },
        },
        0
      )
        .to(
          progressBarRef.current,
          {
            scaleX: 1,
            duration: p.countDuration,
            ease: MOTION.easing.gsapPowerOut,
          },
          0
        )
        .to(
          strokeTextRef.current,
          {
            strokeDashoffset: 0,
            duration: p.strokeDuration,
            ease: MOTION.easing.gsapPowerOut,
          },
          0.02
        )
        .to(
          underlinePath,
          {
            strokeDashoffset: 0,
            duration: p.underlineDuration,
            ease: MOTION.easing.gsapPowerOut,
          },
          0.06
        )
        .to(
          fillTextRef.current,
          {
            opacity: 1,
            duration: p.fillDuration,
            ease: 'power2.out',
          },
          p.fillStartAt
        )
        // Phase 2: Fade typography up + clip-path curtain reveal (~1.28s total)
        .to(
          contentWrapRef.current,
          {
            y: -20,
            opacity: 0,
            duration: p.textExitDuration,
            ease: 'power2.in',
          },
          p.textExitAt
        )
        .to(
          overlayRef.current,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: p.curtainDuration,
            ease: MOTION.easing.gsapWipe,
            onStart: () => {
              onRevealStart?.();
            },
          },
          p.curtainStartAt
        );
    }, overlayRef);

    return () => {
      ctx.revert();
      unlockScroll();
    };
  }, [reducedMotion, lockScroll, unlockScroll, onRevealStart, onComplete]);

  if (reducedMotion) return null;

  return (
    <div
      ref={overlayRef}
      aria-label="Loading portfolio"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#05060A] px-6 py-8 sm:px-12 sm:py-10"
    >
      {/* Top Diagnostic Line */}
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--text-muted)]">
        <span>PORTFOLIO // 2026</span>
        <span className="text-[var(--accent-neon)]">INIT SYSTEM</span>
      </div>

      {/* Center SVG Stroke Name Draw */}
      <div ref={contentWrapRef} className="mx-auto w-full max-w-4xl">
        <svg
          viewBox="0 0 920 150"
          className="w-full overflow-visible"
          role="img"
          aria-label="Aryan Kothari"
        >
          <defs>
            <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B8FF2E" />
              <stop offset="55%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          {/* Animated Stroke Layer */}
          <text
            ref={strokeTextRef}
            x="50%"
            y="88"
            textAnchor="middle"
            fill="none"
            stroke="url(#preloaderGrad)"
            strokeWidth="1.6"
            strokeLinejoin="round"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '74px',
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            ARYAN KOTHARI
          </text>

          {/* Solid Fill Fade-In Layer */}
          <text
            ref={fillTextRef}
            x="50%"
            y="88"
            textAnchor="middle"
            fill="#F4F6FB"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '74px',
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            ARYAN KOTHARI
          </text>

          {/* Signature Underline Vector Path */}
          <path
            ref={underlinePathRef}
            d="M 150 118 Q 460 132 770 118"
            fill="none"
            stroke="#B8FF2E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom Counter & GPU Progress Hairline */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-secondary)]">
            MERN STACK · CREATIVE DEV
          </span>
          <div className="flex items-baseline gap-1 font-mono tabular-nums">
            <span
              ref={counterRef}
              className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-6xl"
            >
              000
            </span>
            <span className="text-sm text-[var(--accent-neon)]">%</span>
          </div>
        </div>

        <div className="h-[2px] w-full overflow-hidden bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-gradient-to-r from-[#B8FF2E] via-[#00F0FF] to-[#A855F7]"
          />
        </div>
      </div>
    </div>
  );
}

