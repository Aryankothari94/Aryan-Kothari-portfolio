import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const SoundContext = createContext({
  muted: true,
  toggleMute: () => {},
  playHover: () => {},
  playClick: () => {},
  playSuccess: () => {},
});

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-cursor="view"]';

export function SoundProvider({ children }) {
  // OFF by default
  const [muted, setMuted] = useState(true);
  const audioCtxRef = useRef(null);
  const lastHoverTime = useRef(0);

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (startFreq, endFreq, durationSec, volume, type = 'sine') => {
      if (muted) return;
      const ctx = getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 40), now + durationSec);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec + 0.01);
    },
    [muted, getContext]
  );

  const playHover = useCallback(() => {
    const now = performance.now();
    if (now - lastHoverTime.current < 55) return;
    lastHoverTime.current = now;
    playTone(620, 880, 0.035, 0.022, 'triangle');
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(280, 110, 0.048, 0.045, 'sine');
  }, [playTone]);

  const playSuccess = useCallback(() => {
    if (muted) return;
    playTone(523.25, 659.25, 0.09, 0.04, 'sine');
    window.setTimeout(() => playTone(659.25, 783.99, 0.14, 0.04, 'sine'), 80);
  }, [muted, playTone]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (!next) {
        // Initialize audio context cleanly on explicit user toggle
        const ctx = getContext();
        if (ctx) {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
        }
      }
      return next;
    });
  }, [getContext]);

  // Global hover/click micro-sounds when unmuted
  useEffect(() => {
    if (muted) return undefined;

    let lastHoveredEl = null;

    const onPointerOver = (e) => {
      const target = e.target instanceof Element ? e.target.closest(INTERACTIVE_SELECTOR) : null;
      if (target && target !== lastHoveredEl) {
        lastHoveredEl = target;
        playHover();
      } else if (!target) {
        lastHoveredEl = null;
      }
    };

    const onPointerDown = (e) => {
      const target = e.target instanceof Element ? e.target.closest(INTERACTIVE_SELECTOR) : null;
      if (target) {
        playClick();
      }
    };

    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [muted, playHover, playClick]);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playHover, playClick, playSuccess }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}

