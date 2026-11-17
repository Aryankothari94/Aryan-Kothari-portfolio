import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

function detectWebGLSupport() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

function evaluateDeviceCapability() {
  if (typeof window === 'undefined') {
    return { isMobile: false, isLowEnd: false, hasWebGL: false };
  }

  const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const isSmallScreen = window.innerWidth < 768;
  const isMobile = isCoarsePointer || isSmallScreen;

  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined;
  const memory = typeof navigator !== 'undefined' ? navigator.deviceMemory : undefined;
  const saveData = typeof navigator !== 'undefined' ? navigator.connection?.saveData : false;

  const isLowEnd =
    Boolean(saveData) ||
    (typeof cores === 'number' && cores <= 2) ||
    (typeof memory === 'number' && memory <= 2);

  const hasWebGL = detectWebGLSupport();

  return { isMobile, isLowEnd, hasWebGL };
}

export function useDeviceCapability() {
  const reducedMotion = useReducedMotion();
  const [capability, setCapability] = useState(() => evaluateDeviceCapability());

  useEffect(() => {
    const onResize = () => setCapability(evaluateDeviceCapability());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const shouldUseFallback =
    reducedMotion || capability.isMobile || capability.isLowEnd || !capability.hasWebGL;

  return {
    ...capability,
    reducedMotion,
    shouldUseFallback,
  };
}

