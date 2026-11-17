import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label[for], [data-cursor="pointer"]';

export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      const hasTouch = 'ontouchstart' in window && navigator.maxTouchPoints > 0;
      setEnabled(pointerQuery.matches && !hasTouch && !reducedMotion);
    };

    sync();
    pointerQuery.addEventListener('change', sync);
    return () => pointerQuery.removeEventListener('change', sync);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-custom-cursor');
      return undefined;
    }

    document.documentElement.classList.add('has-custom-cursor');

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const state = {
      visible: false,
      mouseX: window.innerWidth / 2,
      mouseY: window.innerHeight / 2,
      dotX: window.innerWidth / 2,
      dotY: window.innerHeight / 2,
      ringX: window.innerWidth / 2,
      ringY: window.innerHeight / 2,
      prevX: window.innerWidth / 2,
      prevY: window.innerHeight / 2,
      velX: 0,
      velY: 0,
      mode: 'default', // 'default' | 'link' | 'view'
      ringScale: 1,
      targetScale: 1,
      pressed: false,
      particles: [],
      frameCount: 0,
    };

    const setMode = (nextMode, customLabel = 'VIEW') => {
      if (state.mode === nextMode && (!labelRef.current || labelRef.current.textContent === customLabel)) {
        return;
      }
      state.mode = nextMode;

      if (nextMode === 'view') {
        state.targetScale = 2.25;
        if (labelRef.current) {
          labelRef.current.textContent = customLabel;
          labelRef.current.style.opacity = '1';
        }
        if (ringRef.current) {
          ringRef.current.style.backgroundColor = 'rgba(184, 255, 46, 0.94)';
          ringRef.current.style.borderColor = 'rgba(184, 255, 46, 1)';
        }
        if (dotRef.current) {
          dotRef.current.style.opacity = '0';
        }
      } else if (nextMode === 'link') {
        state.targetScale = 1.65;
        if (labelRef.current) labelRef.current.style.opacity = '0';
        if (ringRef.current) {
          ringRef.current.style.backgroundColor = 'rgba(184, 255, 46, 0.1)';
          ringRef.current.style.borderColor = 'rgba(184, 255, 46, 0.85)';
        }
        if (dotRef.current) {
          dotRef.current.style.opacity = state.visible ? '1' : '0';
        }
      } else {
        state.targetScale = 1;
        if (labelRef.current) labelRef.current.style.opacity = '0';
        if (ringRef.current) {
          ringRef.current.style.backgroundColor = 'transparent';
          ringRef.current.style.borderColor = 'rgba(244, 246, 251, 0.45)';
        }
        if (dotRef.current) {
          dotRef.current.style.opacity = state.visible ? '1' : '0';
        }
      }
    };

    const onPointerMove = (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      if (!state.visible) {
        state.visible = true;
        state.dotX = e.clientX;
        state.dotY = e.clientY;
        state.ringX = e.clientX;
        state.ringY = e.clientY;
        state.prevX = e.clientX;
        state.prevY = e.clientY;
        if (ringRef.current) ringRef.current.style.opacity = '1';
        if (dotRef.current && state.mode !== 'view') dotRef.current.style.opacity = '1';
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const viewTarget = target.closest('[data-cursor="view"]');
      if (viewTarget) {
        setMode('view', viewTarget.getAttribute('data-cursor-label') || 'VIEW');
        return;
      }

      if (target.closest(INTERACTIVE_SELECTOR)) {
        setMode('link');
        return;
      }

      setMode('default');
    };

    const onMouseDown = () => {
      state.pressed = true;
    };

    const onMouseUp = () => {
      state.pressed = false;
    };

    const onMouseLeave = () => {
      state.visible = false;
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    let rafId = 0;

    const tick = () => {
      state.frameCount += 1;

      const dx = state.mouseX - state.prevX;
      const dy = state.mouseY - state.prevY;
      state.prevX = state.mouseX;
      state.prevY = state.mouseY;

      state.velX += (dx - state.velX) * 0.35;
      state.velY += (dy - state.velY) * 0.35;

      const speed = Math.hypot(state.velX, state.velY);

      // Eased positions (no layout reads)
      state.dotX += (state.mouseX - state.dotX) * 0.65;
      state.dotY += (state.mouseY - state.dotY) * 0.65;
      state.ringX += (state.mouseX - state.ringX) * 0.16;
      state.ringY += (state.mouseY - state.ringY) * 0.16;

      const pressFactor = state.pressed ? 0.85 : 1;
      state.ringScale += (state.targetScale * pressFactor - state.ringScale) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${state.dotX}px, ${state.dotY}px, 0) translate(-50%, -50%) scale(${pressFactor})`;
      }

      if (ringRef.current) {
        if (state.mode === 'view') {
          ringRef.current.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%) scale(${state.ringScale})`;
        } else {
          const stretch = Math.min(speed * 0.012, 0.42);
          const squash = Math.min(speed * 0.006, 0.2);
          const angle = speed > 0.35 ? Math.atan2(state.velY, state.velX) : 0;
          const sx = state.ringScale * (1 + stretch);
          const sy = state.ringScale * (1 - squash);

          ringRef.current.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${sx}, ${sy})`;
        }
      }

      // Particle trail emission
      if (state.visible && speed > 1.8 && state.frameCount % 2 === 0) {
        if (state.particles.length >= 44) {
          state.particles.shift();
        }
        state.particles.push({
          x: state.dotX + (Math.random() - 0.5) * 4,
          y: state.dotY + (Math.random() - 0.5) * 4,
          vx: -state.velX * 0.06 + (Math.random() - 0.5) * 0.6,
          vy: -state.velY * 0.06 + (Math.random() - 0.5) * 0.6,
          life: 1,
          decay: 0.038 + Math.random() * 0.025,
          radius: 1.3 + Math.random() * 1.4,
          color: Math.random() > 0.35 ? '184, 255, 46' : '0, 240, 255',
        });
      }

      // Render particle trail on canvas
      if (ctx && canvas) {
        if (state.particles.length > 0) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          for (let i = state.particles.length - 1; i >= 0; i -= 1) {
            const p = state.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
              state.particles.splice(i, 1);
              continue;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.65})`;
            ctx.fill();
          }
        } else {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90]"
      />

      {/* Trailing Ring + VIEW Badge */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[95] flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(244,246,251,0.45)] transition-[background-color,border-color,opacity] duration-200 will-change-transform"
      >
        <span
          ref={labelRef}
          style={{ opacity: 0 }}
          className="font-mono text-[6px] font-bold tracking-[0.16em] text-[#06070B] transition-opacity duration-150"
        >
          VIEW
        </span>
      </div>

      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[96] h-1.5 w-1.5 rounded-full bg-[var(--accent-neon)] shadow-[0_0_10px_var(--accent-neon)] transition-opacity duration-150 will-change-transform"
      />
    </>
  );
}

