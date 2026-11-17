import { useEffect, useRef, useState } from 'react';
import { Tag } from '../ui';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function SkillTiltCard({
  category,
  items,
  ringPercent,
  ringLabel,
  ringSublabel,
  accentColor = '#B8FF2E',
}) {
  const { isMobile, reducedMotion } = useDeviceCapability();
  const interactiveTilt = !isMobile && !reducedMotion;

  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const [inView, setInView] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setInView(true);
      return undefined;
    }
    const el = cardRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const handlePointerMove = (e) => {
    if (!interactiveTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / Math.max(rect.width, 1);
    const py = y / Math.max(rect.height, 1);

    const rotY = (px - 0.5) * 14;
    const rotX = (0.5 - py) * 14;

    cardRef.current.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.16), rgba(184,255,46,0.07) 36%, transparent 72%)`;
    }
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    cardRef.current.style.setProperty('--spotlight-opacity', '0');
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  const handlePointerEnter = () => {
    if (interactiveTilt && cardRef.current) {
      cardRef.current.style.setProperty('--spotlight-opacity', '1');
    }
  };

  const dashOffset = inView
    ? RING_CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, ringPercent / 100)))
    : RING_CIRCUMFERENCE;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className="spotlight-card relative flex flex-col justify-between overflow-hidden p-6 transition-transform duration-300 ease-[var(--ease-out-expo)] will-change-transform sm:p-7"
    >
      {/* Dynamic Specular Glare Overlay */}
      <div
        ref={glareRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
      />

      <div className="relative z-10 space-y-5">
        {/* Header + Animated SVG Progress Ring */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
              {ringSublabel}
            </p>
            <h3 className="type-h3 mt-1 text-[var(--text-primary)]">{category}</h3>
          </div>

          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r={RING_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r={RING_RADIUS}
                fill="none"
                stroke={accentColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{
                  transition: reducedMotion
                    ? 'none'
                    : 'stroke-dashoffset 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: `drop-shadow(0 0 6px ${accentColor}66)`,
                }}
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-[var(--text-primary)]">
              {ringLabel}
            </span>
          </div>
        </div>

        {/* Skill Pills from content.js */}
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Tag key={item} variant="default" className="text-[11px]!">
              {item}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}

