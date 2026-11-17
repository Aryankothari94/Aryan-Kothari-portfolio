import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

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

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [reducedMotion]);

  const value = useMemo(
    () => ({
      lenis: lenisInstance,
      scrollTo: (target, options = {}) => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { duration: 1.15, ...options });
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

