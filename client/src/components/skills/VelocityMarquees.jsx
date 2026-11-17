import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ROW_ONE = [
  ...skills.languages,
  ...skills.frontend,
  ...skills.backend,
];

const ROW_TWO = [
  ...skills.databases,
  ...skills.tools,
  ...skills.coreConcepts,
];

export function VelocityMarquees() {
  const reducedMotion = useReducedMotion();
  const trackOneRef = useRef(null);
  const trackTwoRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;

    let offsetOne = 0; // 0 .. -50 (%)
    let offsetTwo = -50; // -50 .. 0 (%)
    let smoothVelocity = 0;
    let lastScrollY = window.scrollY || 0;
    let rafId = 0;
    let prevTime = performance.now();

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
    });

    const tick = (now) => {
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      const curScrollY = window.scrollY || 0;
      const nativeVel = (curScrollY - lastScrollY) / Math.max(dt, 0.008);
      lastScrollY = curScrollY;

      const stVel = trigger.getVelocity ? trigger.getVelocity() : 0;
      const rawSpeed = Math.max(Math.abs(stVel), Math.abs(nativeVel));
      const targetBoost = Math.min(rawSpeed * 0.012, 22);

      smoothVelocity += (targetBoost - smoothVelocity) * 0.08;

      // Base speed in % per second + scroll velocity boost
      const step = (3.4 + smoothVelocity) * dt;

      offsetOne -= step;
      if (offsetOne <= -50) offsetOne += 50;

      offsetTwo += step;
      if (offsetTwo >= 0) offsetTwo -= 50;

      if (trackOneRef.current) {
        trackOneRef.current.style.transform = `translate3d(${offsetOne.toFixed(3)}%, 0, 0)`;
      }
      if (trackTwoRef.current) {
        trackTwoRef.current.style.transform = `translate3d(${offsetTwo.toFixed(3)}%, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      trigger.kill();
    };
  }, [reducedMotion]);

  const maskStyle = {
    WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
    maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
  };

  return (
    <div className="space-y-4 overflow-hidden py-4" style={maskStyle}>
      {/* Row 1 -> Left */}
      <div className="overflow-hidden">
        <div
          ref={trackOneRef}
          className={`flex w-max items-center gap-4 will-change-transform ${
            reducedMotion ? 'w-full flex-wrap justify-center' : ''
          }`}
        >
          {(reducedMotion ? ROW_ONE : [...ROW_ONE, ...ROW_ONE]).map((item, idx) => (
            <span
              key={`r1-${item}-${idx}`}
              className="inline-flex shrink-0 items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-5 py-2 font-mono text-xs tracking-wider uppercase text-[var(--text-primary)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-neon)]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 -> Right */}
      <div className="overflow-hidden">
        <div
          ref={trackTwoRef}
          className={`flex w-max items-center gap-4 will-change-transform ${
            reducedMotion ? 'w-full flex-wrap justify-center' : ''
          }`}
        >
          {(reducedMotion ? ROW_TWO : [...ROW_TWO, ...ROW_TWO]).map((item, idx) => (
            <span
              key={`r2-${item}-${idx}`}
              className="inline-flex shrink-0 items-center gap-3 rounded-full border border-[rgba(0,240,255,0.2)] bg-white/[0.02] px-5 py-2 font-mono text-xs tracking-wider uppercase text-[var(--text-secondary)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

