import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';

export function KineticNameBackdrop({ name, revealReady }) {
  const { isMobile, reducedMotion } = useDeviceCapability();
  const interactive = !isMobile && !reducedMotion;

  const containerRef = useRef(null);
  const letterMaskRefs = useRef([]);
  const letterInteractiveRefs = useRef([]);

  const words = name.toUpperCase().split(' ');
  const firstWord = words[0] || 'ARYAN';
  const secondWord = words.slice(1).join(' ') || 'KOTHARI';

  // Per-character masked rise-up reveal
  useEffect(() => {
    if (!revealReady) return undefined;

    const masks = letterMaskRefs.current.filter(Boolean);
    if (reducedMotion) {
      gsap.set(masks, { yPercent: 0, opacity: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        masks,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.035,
          ease: 'expo.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [revealReady, reducedMotion]);

  // Mouse proximity letter repel + parallax (zero layout reads per frame)
  useEffect(() => {
    if (!interactive) return undefined;

    const nodes = letterInteractiveRefs.current.filter(Boolean);
    if (nodes.length === 0) return undefined;

    let centers = [];
    const states = nodes.map(() => ({ x: 0, y: 0, scale: 1 }));
    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let normX = 0;
    let normY = 0;
    let smoothNormX = 0;
    let smoothNormY = 0;
    let pointerActive = false;

    const measureCenters = () => {
      centers = nodes.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
        };
      });
    };

    measureCenters();
    const measureTimer = window.setTimeout(measureCenters, 950);

    const onPointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      normX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      normY = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      pointerActive = true;
    };

    const onMouseLeave = () => {
      pointerActive = false;
      normX = 0;
      normY = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', measureCenters, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    let rafId = 0;
    const radius = 195;

    const tick = () => {
      smoothNormX += (normX - smoothNormX) * 0.08;
      smoothNormY += (normY - smoothNormY) * 0.08;

      if (containerRef.current) {
        // Larger parallax than the portrait cutout (+-26px) for foreground/background depth
        containerRef.current.style.transform = `translate3d(${(-smoothNormX * 26).toFixed(2)}px, ${(-smoothNormY * 18).toFixed(2)}px, 0)`;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const el = nodes[i];
        const center = centers[i];
        const st = states[i];

        let tx = 0;
        let ty = 0;
        let ts = 1;
        let proximity = 0;

        if (pointerActive && center) {
          const dx = center.cx - mouseX;
          const dy = center.cy - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < radius && dist > 0.01) {
            proximity = 1 - dist / radius;
            const push = proximity * proximity * 28;
            tx = (dx / dist) * push;
            ty = (dy / dist) * push;
            ts = 1 + proximity * 0.14;
          }
        }

        st.x += (tx - st.x) * 0.16;
        st.y += (ty - st.y) * 0.16;
        st.scale += (ts - st.scale) * 0.16;

        el.style.transform = `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, 0) scale(${st.scale.toFixed(3)})`;
        if (proximity > 0.08) {
          el.style.color = 'rgba(184, 255, 46, 0.92)';
          el.style.webkitTextStrokeColor = 'rgba(184, 255, 46, 0.95)';
        } else {
          el.style.color = '';
          el.style.webkitTextStrokeColor = '';
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(measureTimer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', measureCenters);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [interactive]);

  let globalCharIdx = 0;

  const renderWord = (word, outlined = false) => (
    <div
      className={`flex select-none flex-wrap justify-center lg:justify-start ${
        outlined ? 'lg:pl-14 xl:pl-24' : ''
      }`}
    >
      {word.split('').map((char, idx) => {
        const refIdx = globalCharIdx;
        globalCharIdx += 1;
        return (
          <span key={`${word}-${idx}`} className="inline-block overflow-hidden py-1">
            <span
              ref={(el) => {
                letterMaskRefs.current[refIdx] = el;
              }}
              className="inline-block will-change-transform"
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              <span
                ref={(el) => {
                  letterInteractiveRefs.current[refIdx] = el;
                }}
                className={`inline-block font-display font-extrabold leading-[0.86] tracking-[-0.04em] transition-colors duration-200 will-change-transform ${
                  outlined
                    ? 'text-transparent [-webkit-text-stroke:1.5px_rgba(244,246,251,0.34)]'
                    : 'text-[rgba(244,246,251,0.14)] sm:text-[rgba(244,246,251,0.16)]'
                }`}
                style={{
                  fontSize: 'clamp(3.75rem, 13.8vw, 13rem)',
                }}
              >
                {char}
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none relative z-10 w-full will-change-transform"
    >
      {renderWord(firstWord, false)}
      {renderWord(secondWord, true)}
    </div>
  );
}

