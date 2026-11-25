import { useEffect, useMemo, useRef, useState } from 'react';
import { skills } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function buildFibonacciSphere(items) {
  const n = items.length;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return items.map((name, i) => {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    return {
      name,
      x: Math.cos(theta) * radiusAtY,
      y,
      z: Math.sin(theta) * radiusAtY,
    };
  });
}

export function SkillTagSphere() {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef(null);
  const tagRefs = useRef([]);
  const [dragging, setDragging] = useState(false);

  const points = useMemo(() => buildFibonacciSphere(skills.core.slice(0, 10)), []);

  const rotRef = useRef({
    vx: 0.0022,
    vy: 0.0038,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    hovered: false,
  });

  useEffect(() => {
    const nodes = tagRefs.current.filter(Boolean);
    if (nodes.length === 0) return undefined;

    const coords = points.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    let rafId = 0;
    let inView = false;

    const getRadius = () => (window.innerWidth < 640 ? 116 : 165);

    const renderFrame = () => {
      if (!inView) {
        rafId = 0;
        return;
      }

      const r = rotRef.current;
      const sphereRadius = getRadius();

      if (!r.isDragging) {
        if (reducedMotion) {
          r.vx *= 0.88;
          r.vy *= 0.88;
        } else {
          const idleVx = r.hovered ? 0.0005 : 0.0018;
          const idleVy = r.hovered ? 0.001 : 0.0036;
          r.vx += (idleVx - r.vx) * 0.04;
          r.vy += (idleVy - r.vy) * 0.04;
        }
      }

      const cosX = Math.cos(r.vx);
      const sinX = Math.sin(r.vx);
      const cosY = Math.cos(r.vy);
      const sinY = Math.sin(r.vy);

      for (let i = 0; i < coords.length; i += 1) {
        const c = coords[i];
        const x1 = c.x * cosY - c.z * sinY;
        const z1 = c.z * cosY + c.x * sinY;
        const y2 = c.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + c.y * sinX;

        c.x = x1;
        c.y = y2;
        c.z = z2;

        const el = nodes[i];
        if (!el) continue;

        const depth = (z2 + 1) * 0.5;
        const scale = 0.78 + depth * 0.42;
        const opacity = 0.35 + depth * 0.65;
        const px = x1 * sphereRadius;
        const py = y2 * sphereRadius;

        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(depth * 40));
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = Boolean(entries[0]?.isIntersecting);
        if (visible && !inView) {
          inView = true;
          if (!rafId) rafId = requestAnimationFrame(renderFrame);
        } else if (!visible) {
          inView = false;
        }
      },
      { rootMargin: '150px' }
    );

    if (stageRef.current) observer.observe(stageRef.current);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [points, reducedMotion]);

  useEffect(() => {
    const onPointerMove = (e) => {
      const r = rotRef.current;
      if (!r.isDragging) return;
      const dx = e.clientX - r.lastX;
      const dy = e.clientY - r.lastY;
      r.lastX = e.clientX;
      r.lastY = e.clientY;
      r.vy = dx * 0.0045;
      r.vx = -dy * 0.0045;
    };

    const onPointerUp = () => {
      if (!rotRef.current.isDragging) return;
      rotRef.current.isDragging = false;
      setDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const handlePointerDown = (e) => {
    rotRef.current.isDragging = true;
    rotRef.current.lastX = e.clientX;
    rotRef.current.lastY = e.clientY;
    setDragging(true);
  };

  const handleKeyDown = (e) => {
    const r = rotRef.current;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      r.vy += 0.04;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      r.vy -= 0.04;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      r.vx -= 0.04;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      r.vx += 0.04;
    }
  };

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => {
        rotRef.current.hovered = true;
      }}
      onPointerLeave={() => {
        rotRef.current.hovered = false;
      }}
      role="region"
      aria-label="Interactive 3D skill sphere — drag or use arrow keys to rotate"
      className={`relative mx-auto flex h-[320px] w-full max-w-[500px] touch-none select-none items-center justify-center overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-xl sm:h-[400px] ${
        dragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-52 w-52 rounded-full opacity-35 blur-[70px]"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 240, 255, 0.35), rgba(184, 255, 46, 0.2) 55%, transparent 75%)',
        }}
      />

      <div className="relative h-0 w-0">
        {points.map((item, idx) => (
          <span
            key={`${item.name}-${idx}`}
            ref={(el) => {
              tagRefs.current[idx] = el;
            }}
            className="absolute top-0 left-0 whitespace-nowrap rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)]/95 px-4 py-1.5 font-mono text-xs font-medium tracking-wide text-[var(--text-primary)] shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-colors duration-200 hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)] will-change-transform"
          >
            {item.name}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[var(--border-subtle)] bg-black/45 px-3 py-1 font-mono text-xs tracking-[0.18em] uppercase text-[var(--text-muted)]">
        Drag 3D Sphere
      </div>
    </div>
  );
}
