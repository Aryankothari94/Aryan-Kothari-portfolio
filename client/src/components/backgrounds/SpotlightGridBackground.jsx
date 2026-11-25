import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function SpotlightGridBackground({ className = '' }) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    if (reducedMotion) {
      el.style.setProperty('--grid-mx', '50%');
      el.style.setProperty('--grid-my', '35%');
      return undefined;
    }

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = 0;

    const onPointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const tick = () => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      el.style.setProperty('--grid-mx', `${currentX.toFixed(1)}px`);
      el.style.setProperty('--grid-my', `${currentY.toFixed(1)}px`);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        '--grid-mx': '50%',
        '--grid-my': '35%',
      }}
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--bg-void)] ${className}`.trim()}
    >
      {/* Subtle Base Architectural Grid */}
      <div
        className={`absolute -inset-16 opacity-65 ${reducedMotion ? '' : 'animate-grid-drift'}`}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Illuminated Neon/Cyan Grid Revealed by Cursor Spotlight */}
      <div
        className={`absolute -inset-16 ${reducedMotion ? '' : 'animate-grid-drift'}`}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(184,255,46,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.24) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage:
            'radial-gradient(360px circle at var(--grid-mx) var(--grid-my), #000 0%, rgba(0,0,0,0.45) 45%, transparent 80%)',
          maskImage:
            'radial-gradient(360px circle at var(--grid-mx) var(--grid-my), #000 0%, rgba(0,0,0,0.45) 45%, transparent 80%)',
        }}
      />

      {/* Cursor Radial Ambient Bloom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(520px circle at var(--grid-mx) var(--grid-my), rgba(184,255,46,0.085), rgba(0,240,255,0.055) 38%, rgba(91,108,255,0.03) 62%, transparent 78%)',
        }}
      />

      {/* Soft Edge Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 45%, transparent 45%, rgba(6,7,11,0.88) 100%)',
        }}
      />
    </div>
  );
}

