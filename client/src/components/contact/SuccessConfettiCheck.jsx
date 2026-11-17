import { useEffect, useRef } from 'react';
import { Button } from '../ui';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CONFETTI_COLORS = ['#B8FF2E', '#00F0FF', '#5B6CFF', '#A855F7', '#F4F6FB'];

export function SuccessConfettiCheck({ onReset, warning }) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reducedMotion || !canvasRef.current) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = rect.width || 480;
    const height = rect.height || 360;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const originX = width * 0.5;
    const originY = height * 0.34;

    const pieces = Array.from({ length: 58 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 6.5;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.4,
        w: 4 + Math.random() * 5,
        h: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 1,
      };
    });

    let rafId = 0;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (const p of pieces) {
        p.vy += 0.16;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        p.life -= 0.013;

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (alive) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  return (
    <div className="relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[rgba(184,255,46,0.35)] bg-[var(--bg-glass)] p-8 text-center backdrop-blur-xl">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 space-y-6">
        {/* Drawn Checkmark SVG */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-neon-dim)]">
          <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#B8FF2E"
              strokeWidth="2.5"
              strokeDasharray="176"
              strokeDashoffset={reducedMotion ? '0' : '176'}
              className={reducedMotion ? '' : 'animate-stroke-draw'}
            />
            <path
              d="M20 33 L28.5 41.5 L45 24"
              fill="none"
              stroke="#B8FF2E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="44"
              strokeDashoffset={reducedMotion ? '0' : '44'}
              style={reducedMotion ? undefined : { animationDelay: '240ms' }}
              className={reducedMotion ? '' : 'animate-stroke-draw'}
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="type-h3 text-[var(--text-primary)]">Message Sent!</h3>
          <p className="mx-auto max-w-sm text-sm text-[var(--text-secondary)]">
            Thanks for reaching out. I&apos;ve received your inquiry and will reply shortly.
          </p>
          {warning && (
            <p className="font-mono text-xs text-amber-300/90">{warning}</p>
          )}
        </div>

        <Button variant="secondary" size="sm" onClick={onReset}>
          Send Another Message
        </Button>
      </div>
    </div>
  );
}

