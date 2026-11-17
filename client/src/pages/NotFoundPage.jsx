import { useEffect, useRef } from 'react';
import { Container, MagneticButton, Tag } from '../components/ui';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function NotFoundPage() {
  const reducedMotion = useReducedMotion();
  const codeRef = useRef(null);

  useEffect(() => {
    if (reducedMotion || !codeRef.current) return undefined;

    const onPointerMove = (e) => {
      if (!codeRef.current) return;
      const nx = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 24;
      const ny = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 16;
      codeRef.current.style.transform = `translate3d(${nx.toFixed(1)}px, ${ny.toFixed(1)}px, 0)`;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reducedMotion]);

  return (
    <main className="relative z-10 flex min-h-[82vh] items-center justify-center py-28">
      <Container size="narrow" className="text-center">
        <div className="space-y-8">
          <div className="flex justify-center">
            <Tag variant="accent" dot>
              ERR_ROUTE_NOT_FOUND
            </Tag>
          </div>

          <div ref={codeRef} className="relative inline-block will-change-transform">
            <h1
              className={`font-display font-extrabold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:2px_var(--accent-neon)] ${
                reducedMotion ? '' : 'animate-pulse'
              }`}
              style={{ fontSize: 'clamp(5.5rem, 20vw, 13rem)' }}
            >
              404
            </h1>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-display font-extrabold leading-none tracking-[-0.05em] text-gradient-secondary opacity-35 blur-[1px]"
              style={{ fontSize: 'clamp(5.5rem, 20vw, 13rem)' }}
            >
              404
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="type-h2 text-[var(--text-primary)]">Signal Lost in the Void</h2>
            <p className="type-body mx-auto max-w-md text-[var(--text-secondary)]">
              The route you requested doesn&apos;t exist on this server. Jump back to the main
              showcase or inspect my shipped projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton to="/" variant="primary">
              ← Return Home
            </MagneticButton>
            <MagneticButton to="/work" variant="secondary">
              Browse Projects
            </MagneticButton>
          </div>
        </div>
      </Container>
    </main>
  );
}

