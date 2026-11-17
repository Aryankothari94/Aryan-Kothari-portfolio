import { useEffect, useMemo, useRef, useState } from 'react';
import { skills } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ALL_SKILLS = [
  ...skills.languages.map((name) => ({ name, group: 'lang' })),
  ...skills.frontend.map((name) => ({ name, group: 'ui' })),
  ...skills.backend.map((name) => ({ name, group: 'api' })),
  ...skills.databases.map((name) => ({ name, group: 'db' })),
  ...skills.tools.map((name) => ({ name, group: 'tool' })),
  ...skills.coreConcepts.map((name) => ({ name, group: 'core' })),
];

function buildFibonacciSphere(items) {
  const n = items.length;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return items.map((item, i) => {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    return {
      ...item,
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

  const points = useMemo(() => buildFibonacciSphere(ALL_SKILLS), []);

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

    // Mutable local copy of 3D unit vectors
    const coords = points.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    let rafId = 0;

    const getRadius = () => (window.innerWidth < 640 ? 132 : 196);

    const renderFrame = () => {
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
        // Rotate around Y
        const x1 = c.x * cosY - c.z * sinY;
        const z1 = c.z * cosY + c.x * sinY;
        // Rotate around X
        const y2 = c.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + c.y * sinX;

        c.x = x1;
        c.y = y2;
        c.z = z2;

        const el = nodes[i];
        if (!el) continue;

        // Perspective projection
        const depth = (z2 + 1) * 0.5; // 0 (back) .. 1 (front)
        const scale = 0.68 + depth * 0.48;
        const opacity = 0.24 + depth * 0.76;
        const px = x1 * sphereRadius;
        const py = y2 * sphereRadius;

        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(depth * 40));
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
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

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => {
        rotRef.current.hovered = true;
      }}
      onPointerLeave={() => {
        rotRef.current.hovered = false;
      }}
      role="region"
      aria-label="Interactive 3D skill sphere — drag to rotate"
      className={`relative mx-auto flex h-[340px] w-full max-w-[540px] touch-none select-none items-center justify-center overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[rgba(11,14,22,0.52)] backdrop-blur-xl sm:h-[460px] ${
        dragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Ambient Sphere Core Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-56 w-56 rounded-full opacity-35 blur-[70px]"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 240, 255, 0.35), rgba(184, 255, 46, 0.2) 55%, transparent 75%)',
        }}
      />

      {/* Sphere Center Anchor */}
      <div className="relative h-0 w-0">
        {points.map((item, idx) => (
          <span
            key={`${item.name}-${idx}`}
            ref={(el) => {
              tagRefs.current[idx] = el;
            }}
            className="absolute top-0 left-0 whitespace-nowrap rounded-full border border-[var(--border-strong)] bg-[rgba(13,16,26,0.88)] px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-wide text-[var(--text-primary)] shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-colors duration-200 hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)] will-change-transform sm:text-xs"
          >
            {item.name}
          </span>
        ))}
      </div>

      {/* Subtle Drag Hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[var(--border-subtle)] bg-black/40 px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
        Drag 3D Sphere
      </div>
    </div>
  );
}

