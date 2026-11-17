import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const KONAMI = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
];

const GLYPHS = '01ARYANKOTHARIMERNJSNODE<>/{}[]$#';

export function KonamiEasterEgg() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);
  const bufferRef = useRef([]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && active) {
        setActive(false);
        return;
      }

      const key = e.key.toLowerCase();
      bufferRef.current = [...bufferRef.current, key].slice(-KONAMI.length);

      const matched = KONAMI.every((k, idx) => bufferRef.current[idx] === k);
      if (matched) {
        bufferRef.current = [];
        setActive(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useEffect(() => {
    if (!active) return undefined;

    const autoCloseTimer = window.setTimeout(() => setActive(false), 7500);
    if (reducedMotion || !canvasRef.current) {
      return () => window.clearTimeout(autoCloseTimer);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => window.clearTimeout(autoCloseTimer);

    const fontSize = 15;
    let columns = 0;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.ceil(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -30));
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let rafId = 0;
    let lastTick = 0;

    const draw = (now) => {
      rafId = requestAnimationFrame(draw);
      if (now - lastTick < 36) return;
      lastTick = now;

      ctx.fillStyle = 'rgba(6, 7, 11, 0.14)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.2 ? '#B8FF2E' : '#00F0FF';
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.clearTimeout(autoCloseTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [active, reducedMotion]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-label="Konami code Easter egg active"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/45 backdrop-blur-[2px]"
    >
      {!reducedMotion && (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      )}

      <div className="relative z-10 mx-4 max-w-md rounded-2xl border border-[var(--accent-neon)] bg-[#06070B]/90 p-6 text-center shadow-[0_0_50px_rgba(184,255,46,0.35)] backdrop-blur-xl">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[var(--accent-neon)]">
          ↑ ↑ ↓ ↓ ← → ← → B A
        </p>
        <h3 className="type-h3 mt-2 text-[#F4F6FB]">Matrix Mode Unlocked</h3>
        <p className="mt-2 text-xs text-[#98A0B8]">
          Nice catch! Keep scrolling or press ESC to exit the Matrix.
        </p>
        <button
          type="button"
          onClick={() => setActive(false)}
          className="mt-4 cursor-pointer rounded-full bg-[var(--accent-neon)] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#06070B]"
        >
          Exit Matrix
        </button>
      </div>
    </div>
  );
}

