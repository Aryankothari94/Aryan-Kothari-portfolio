import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import meOriginal from '../../assets/me-original.webp';
import meOriginal480 from '../../assets/me-original-480.webp';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { TechOrbitIcons } from './TechOrbitIcons';
import { MOTION } from '../../config/motion';

const CUTOUT_480 = '/images/me-cutout-480.webp';
const CUTOUT_640 = '/images/me-cutout-640.webp';

export function HeroPortrait({ revealReady, alt }) {
  const { isMobile, reducedMotion } = useDeviceCapability();
  const interactive = !isMobile && !reducedMotion;

  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const clipRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(CUTOUT_640);
  const isFallbackImg = imgSrc === meOriginal;

  // Smooth rise-up reveal on load (keeps <img> unclipped for fast LCP)
  useEffect(() => {
    if (!revealReady || !clipRef.current) return undefined;

    if (reducedMotion) {
      gsap.set(clipRef.current, { opacity: 1, y: 0 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        clipRef.current,
        { y: 18, scale: 0.98 },
        {
          y: 0,
          scale: 1,
          duration: MOTION.timing.revealDuration,
          ease: MOTION.easing.gsapSnappy,
        }
      );
    }, stageRef);

    return () => ctx.revert();
  }, [revealReady, reducedMotion]);

  // 3D tilt & subtle parallax (smaller displacement than backdrop text for depth)
  useEffect(() => {
    if (!interactive || !tiltRef.current) return undefined;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;

    const onPointerMove = (e) => {
      targetX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      targetY = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    const tick = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;

      if (tiltRef.current) {
        const tx = (curX * 11).toFixed(2);
        const ty = (curY * 8).toFixed(2);
        const rotY = (curX * 5.5).toFixed(2);
        const rotX = (-curY * 4.5).toFixed(2);

        tiltRef.current.style.transform = `perspective(1100px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [interactive]);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto w-full max-w-[270px] sm:max-w-[330px] md:max-w-[380px] lg:max-w-[430px]"
    >
      {/* Back-layer depth-blurred orbiting tech icons */}
      <TechOrbitIcons layer="back" />

      <div ref={tiltRef} className="relative will-change-transform">
        {/* Soft Glowing Backlight Behind Shoulders (separates black blazer from dark void) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 bottom-[4%] top-[24%] z-0 rounded-full opacity-85 blur-[64px]"
          style={{
            background:
              'radial-gradient(circle at 50% 62%, rgba(0, 240, 255, 0.28) 0%, rgba(91, 108, 255, 0.26) 40%, rgba(184, 255, 46, 0.14) 68%, transparent 85%)',
          }}
        />

        {/* Animated Concentric Arc / Ring Behind Head */}
        <svg
          aria-hidden="true"
          viewBox="0 0 360 360"
          className={`pointer-events-none absolute -top-6 left-1/2 z-0 h-[82%] w-[82%] -translate-x-1/2 opacity-80 ${
            reducedMotion ? '' : 'animate-orbit-slow'
          }`}
        >
          <defs>
            <linearGradient id="headArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8FF2E" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="180"
            cy="180"
            r="156"
            fill="none"
            stroke="url(#headArcGrad)"
            strokeWidth="1.75"
            strokeDasharray="240 120 48 90"
            strokeLinecap="round"
          />
          <circle
            cx="180"
            cy="180"
            r="138"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
            strokeDasharray="6 10"
          />
        </svg>

        {/* Portrait Cutout with Rise-Up Reveal + Duotone-to-Colour Hover */}
        <div
          ref={clipRef}
          className="group relative z-20 overflow-hidden will-change-transform"
        >
          <div className="relative">
            <img
              src={imgSrc}
              srcSet={
                isFallbackImg
                  ? `${meOriginal480} 480w, ${meOriginal} 927w`
                  : `${CUTOUT_480} 480w, ${CUTOUT_640} 640w`
              }
              sizes="(max-width: 640px) 270px, (max-width: 1024px) 380px, 430px"
              alt={alt}
              width={640}
              height={707}
              fetchPriority="high"
              onError={() => {
                if (!isFallbackImg) setImgSrc(meOriginal);
              }}
              className={`block h-auto w-full select-none object-contain transition-all duration-500 ease-[var(--ease-out-expo)] ${
                isFallbackImg ? 'rounded-2xl border border-[var(--border-strong)]' : ''
              } ${
                isMobile || reducedMotion
                  ? ''
                  : 'grayscale-[42%] saturate-[0.72] contrast-[1.08] group-hover:grayscale-0 group-hover:saturate-[1.08] group-hover:contrast-[1.04]'
              }`}
              draggable={false}
            />

            {/* Subtle Duotone Tint Overlay that clears on hover */}
            {!isMobile && !reducedMotion && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-45 mix-blend-color transition-opacity duration-500 ease-[var(--ease-out-expo)] group-hover:opacity-0"
                style={{
                  background:
                    'linear-gradient(155deg, rgba(0, 240, 255, 0.55) 0%, rgba(91, 108, 255, 0.45) 55%, rgba(184, 255, 46, 0.35) 100%)',
                }}
              />
            )}

            {/* Bottom fade into void so waist seam blends smoothly */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#06070B] via-[#06070B]/70 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Front-layer sharp orbiting tech icons */}
      <TechOrbitIcons layer="front" />
    </div>
  );
}

