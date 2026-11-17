import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

export function PageTransition({ children }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const { lenis } = useSmoothScroll();

  const [displayLocation, setDisplayLocation] = useState(location);
  const curtainRef = useRef(null);
  const accentStripRef = useRef(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return undefined;
    }

    if (location.pathname === displayLocation.pathname) {
      return undefined;
    }

    const isSharedProjectTransition =
      Boolean(location.state?.sharedTransition) ||
      location.pathname.startsWith('/work/') ||
      displayLocation.pathname.startsWith('/work/');

    if (reducedMotion || isSharedProjectTransition) {
      setDisplayLocation(location);
      if (location.state?.scrollToId) {
        requestAnimationFrame(() => {
          const target = document.querySelector(location.state.scrollToId);
          target?.scrollIntoView({ behavior: 'auto' });
          ScrollTrigger.refresh();
        });
      } else {
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
      return undefined;
    }

    const curtain = curtainRef.current;
    const strip = accentStripRef.current;
    if (!curtain || !strip) {
      setDisplayLocation(location);
      return undefined;
    }

    gsap.killTweensOf([curtain, strip]);
    gsap.set(curtain, { yPercent: 100, visibility: 'visible' });
    gsap.set(strip, { yPercent: 100, visibility: 'visible' });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set([curtain, strip], { visibility: 'hidden' });
      },
    });

    // Phase 1: Curtain wipes in from bottom
    tl.to(strip, {
      yPercent: 0,
      duration: 0.28,
      ease: 'power4.inOut',
    })
      .to(
        curtain,
        {
          yPercent: 0,
          duration: 0.34,
          ease: 'power4.inOut',
        },
        0.05
      )
      // Midpoint swap: update route & reset scroll
      .add(() => {
        setDisplayLocation(location);
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
        requestAnimationFrame(() => ScrollTrigger.refresh());
      })
      // Phase 2: Curtain wipes out upward
      .to(
        curtain,
        {
          yPercent: -100,
          duration: 0.38,
          ease: 'power4.inOut',
        },
        '+=0.04'
      )
      .to(
        strip,
        {
          yPercent: -100,
          duration: 0.34,
          ease: 'power4.inOut',
        },
        '-=0.34'
      );

    return () => {
      tl.kill();
    };
  }, [location, displayLocation.pathname, reducedMotion, lenis]);

  return (
    <>
      {children(displayLocation)}

      {/* Route Wipe Curtains */}
      <div
        ref={accentStripRef}
        aria-hidden="true"
        style={{ visibility: 'hidden' }}
        className="pointer-events-none fixed inset-0 z-[80] bg-[var(--accent-neon)] will-change-transform"
      />
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{ visibility: 'hidden' }}
        className="pointer-events-none fixed inset-0 z-[81] flex items-center justify-center bg-[#06070B] will-change-transform"
      >
        <span className="font-mono text-xs tracking-[0.28em] uppercase text-[var(--accent-neon)]">
          LOADING VIEW //
        </span>
      </div>
    </>
  );
}

