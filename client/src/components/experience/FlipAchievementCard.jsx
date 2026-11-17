import { useRef, useState } from 'react';
import { Tag } from '../ui';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function FlipAchievementCard({
  index,
  category,
  title,
  summary,
  detail,
  tagVariant = 'accent',
  inView,
}) {
  const reducedMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const updateSpotlight = (e) => {
    if (reducedMotion) return;
    const targets = [frontRef.current, backRef.current].filter(Boolean);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targets.forEach((el) => {
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
      el.style.setProperty('--spotlight-opacity', '1');
    });
  };

  const clearSpotlight = () => {
    const targets = [frontRef.current, backRef.current].filter(Boolean);
    targets.forEach((el) => {
      el.style.setProperty('--spotlight-opacity', '0');
    });
  };

  return (
    <div
      style={{
        transitionDelay: reducedMotion ? '0ms' : `${index * 80}ms`,
      }}
      className={`perspective-1100 h-60 w-full transition-all duration-600 ease-[var(--ease-out-expo)] ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      onPointerMove={updateSpotlight}
      onPointerLeave={() => {
        clearSpotlight();
        if (!reducedMotion) setFlipped(false);
      }}
      onPointerEnter={(e) => {
        updateSpotlight(e);
        if (!reducedMotion && e.pointerType === 'mouse') setFlipped(true);
      }}
    >
      <button
        type="button"
        onClick={() => setFlipped((prev) => !prev)}
        aria-pressed={flipped}
        aria-label={`${title} — flip card for details`}
        className={`preserve-3d relative h-full w-full cursor-pointer text-left transition-transform duration-600 ease-[var(--ease-out-expo)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-neon)] ${
          flipped && !reducedMotion ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Face */}
        <div
          ref={frontRef}
          className={`spotlight-card backface-hidden absolute inset-0 flex flex-col justify-between p-6 ${
            reducedMotion && flipped ? 'hidden' : ''
          }`}
        >
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Tag variant={tagVariant}>{category}</Tag>
          </div>

          <div className="relative z-10 space-y-2">
            <h4 className="font-display text-lg font-bold leading-snug text-[var(--text-primary)]">
              {title}
            </h4>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{summary}</p>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
            <span>Flip for details</span>
            <span className="text-[var(--accent-neon)]">↻</span>
          </div>
        </div>

        {/* Back Face */}
        <div
          ref={backRef}
          className={`spotlight-card backface-hidden absolute inset-0 flex flex-col justify-between border-[rgba(184,255,46,0.35)]! p-6 ${
            reducedMotion ? (flipped ? 'block' : 'hidden') : 'rotate-y-180'
          }`}
        >
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent-neon)]">
              Verified Highlight
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <p className="relative z-10 text-sm leading-relaxed text-[var(--text-primary)]">
            {detail}
          </p>

          <div className="relative z-10 border-t border-[var(--border-subtle)] pt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--text-secondary)]">
            {category}
          </div>
        </div>
      </button>
    </div>
  );
}

