import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MOTION } from '../config/motion';

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollContext = createContext({
  lenis: null,
  scrollTo: () => {},
  lockScroll: () => {},
  unlockScroll: () => {},
});

export function SmoothScrollProvider({ children }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef(null);
  const [lenisInstance, setLenisInstance] = useState(null);

  useEffect(() => {
    if (reducedMotion) {
      lenisRef.current = null;
      setLenisInstance(null);
      return undefined;
    }

    let lenis = null;
    let update = null;
    let cancelled = false;

    const initLenis = () => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: MOTION.scroll.lenisLerp,
        smoothWheel: true,
        wheelMultiplier: MOTION.scroll.lenisWheelMultiplier,
        touchMultiplier: MOTION.scroll.lenisTouchMultiplier,
      });

      lenisRef.current = lenis;
      setLenisInstance(lenis);

      lenis.on('scroll', ScrollTrigger.update);

      update = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
    };

    const timer = window.setTimeout(initLenis, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (update) gsap.ticker.remove(update);
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
      }
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [reducedMotion]);

  const value = useMemo(
    () => ({
      lenis: lenisInstance,
      scrollTo: (target, options = {}) => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, {
            duration: MOTION.scroll.scrollToDuration,
            ...options,
          });
          return;
        }
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: reducedMotion ? 'auto' : 'smooth' });
        } else if (typeof target === 'string') {
          const el = document.querySelector(target);
          el?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      },
      lockScroll: () => {
        lenisRef.current?.stop();
        document.documentElement.style.overflow = 'hidden';
      },
      unlockScroll: () => {
        document.documentElement.style.overflow = '';
        lenisRef.current?.start();
      },
    }),
    [lenisInstance, reducedMotion]
  );

  return (
    <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

