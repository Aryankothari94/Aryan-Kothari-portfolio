import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#$%';

function runScramble(el, finalText) {
  if (!el || !finalText) return () => {};
  let frame = 0;
  const totalFrames = 18;
  let rafId = 0;
  let lastStep = 0;

  const tick = (now) => {
    if (now - lastStep >= 28) {
      lastStep = now;
      frame += 1;
      const progress = frame / totalFrames;
      const lockedCount = Math.floor(progress * finalText.length);

      let output = '';
      for (let i = 0; i < finalText.length; i += 1) {
        const ch = finalText[i];
        if (ch === ' ' || i < lockedCount) {
          output += ch;
        } else {
          output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = output;

      if (frame >= totalFrames) {
        el.textContent = finalText;
        return;
      }
    }
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  subtitle,
  align = 'left',
  className = '',
}) {
  const reducedMotion = useReducedMotion();
  const isCentered = align === 'center';
  const headingRef = useRef(null);
  const titleSpanRef = useRef(null);
  const accentSpanRef = useRef(null);

  useEffect(() => {
    if (titleSpanRef.current) titleSpanRef.current.textContent = title || '';
    if (accentSpanRef.current) accentSpanRef.current.textContent = accent || '';

    if (reducedMotion || !headingRef.current) return undefined;

    let cancelA = () => {};
    let cancelB = () => {};
    let triggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !triggered) {
          triggered = true;
          cancelA = runScramble(titleSpanRef.current, title);
          if (accent) {
            cancelB = runScramble(accentSpanRef.current, accent);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(headingRef.current);

    return () => {
      observer.disconnect();
      cancelA();
      cancelB();
    };
  }, [title, accent, reducedMotion]);

  return (
    <header
      ref={headingRef}
      className={`space-y-4 ${isCentered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'} ${className}`.trim()}
    >
      {(index || eyebrow) && (
        <div
          className={`inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-secondary)] ${
            isCentered ? 'justify-center' : ''
          }`}
        >
          {index && <span className="text-[var(--accent-neon)]">{index}</span>}
          {index && eyebrow && <span className="h-px w-6 bg-[var(--border-strong)]" />}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}

      <h2 className="type-h2 text-[var(--text-primary)]">
        <span ref={titleSpanRef}>{title}</span>
        {accent && (
          <>
            {' '}
            <span ref={accentSpanRef} className="text-gradient-secondary">
              {accent}
            </span>
          </>
        )}
      </h2>

      {subtitle && (
        <p className="type-body-lg text-[var(--text-secondary)]">{subtitle}</p>
      )}
    </header>
  );
}
