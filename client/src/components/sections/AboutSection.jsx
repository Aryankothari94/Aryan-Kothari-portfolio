import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import meOriginal from '../../assets/me-original.webp';
import meOriginal480 from '../../assets/me-original-480.webp';
import { Container, ResumeButton, SectionHeading, SpotlightCard } from '../ui';
import { about, personalInfo } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MOTION } from '../../config/motion';

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHT_WORDS = new Set([
  'MERN',
  '1,500+',
  'AutoDev',
  'AI',
  'clean',
  'measurable',
]);

export function AboutSection() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const wordRefs = useRef([]);
  const photoClipRef = useRef(null);
  const photoImgRef = useRef(null);
  const statRefs = useRef([]);

  const bioWords = about.bio.split(' ');

  useEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const words = wordRefs.current.filter(Boolean);
      if (words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.58 },
          {
            opacity: 1,
            stagger: MOTION.timing.staggerWord,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 72%',
              end: 'center 45%',
              scrub: MOTION.scroll.scrub,
            },
          }
        );
      }

      if (photoClipRef.current && photoImgRef.current) {
        gsap.fromTo(
          photoClipRef.current,
          { clipPath: 'inset(16% 10% 16% 10% round 24px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 20px)',
            ease: MOTION.easing.gsapPowerOut,
            scrollTrigger: {
              trigger: photoClipRef.current,
              start: 'top 85%',
              end: 'top 42%',
              scrub: MOTION.scroll.scrub,
            },
          }
        );

        gsap.fromTo(
          photoImgRef.current,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: photoClipRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: MOTION.scroll.scrubParallax,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // 3 stats count-up when visible
  useEffect(() => {
    const nodes = statRefs.current.filter(Boolean);
    if (nodes.length === 0) return undefined;

    if (reducedMotion) {
      about.stats.forEach((stat, idx) => {
        if (nodes[idx]) {
          nodes[idx].textContent = `${stat.value.toFixed(stat.decimals)}${stat.suffix}`;
        }
      });
      return undefined;
    }

    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !triggered) {
          triggered = true;
          about.stats.forEach((stat, idx) => {
            const el = nodes[idx];
            if (!el) return;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: stat.value,
              duration: 0.75,
              ease: MOTION.easing.gsapPowerOut,
              onUpdate: () => {
                el.textContent = `${obj.val.toFixed(stat.decimals)}${stat.suffix}`;
              },
            });
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (nodes[0]?.parentElement) observer.observe(nodes[0].parentElement);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="ABOUT"
      className="relative z-10 border-t border-[var(--border-subtle)]/60 py-28 sm:py-36"
    >
      <Container className="space-y-16">
        <SectionHeading
          index="02"
          eyebrow="About"
          title="Built for"
          accent="Shipped Impact"
        />

        <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          {/* Parallax Clip-Path Photo */}
          <div
            ref={photoClipRef}
            style={
              reducedMotion
                ? { clipPath: 'inset(0% 0% 0% 0% round 20px)' }
                : { clipPath: 'inset(16% 10% 16% 10% round 24px)' }
            }
            className="relative mx-auto aspect-[4/4.3] w-full max-w-[380px] overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-elevated)] will-change-[clip-path] lg:mx-0"
          >
            <img
              ref={photoImgRef}
              src={meOriginal}
              srcSet={`${meOriginal480} 480w, ${meOriginal} 927w`}
              sizes="(max-width: 1024px) 92vw, 380px"
              alt={personalInfo.name}
              width={927}
              height={1024}
              loading="lazy"
              className="h-full w-full object-cover object-top will-change-transform"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070B]/80 via-transparent to-transparent"
            />
          </div>

          {/* Short 3-Sentence Bio + 3 Stats + Download Resume */}
          <div className="space-y-10">
            <p className="font-display text-xl leading-[1.48] font-semibold tracking-tight sm:text-2xl lg:text-[1.72rem]">
              {bioWords.map((word, idx) => {
                const isAccent = HIGHLIGHT_WORDS.has(word.replace(/[.,—]/g, ''));
                return (
                  <span
                    key={`${word}-${idx}`}
                    ref={(el) => {
                      wordRefs.current[idx] = el;
                    }}
                    style={reducedMotion ? undefined : { opacity: 0.58 }}
                    className={`inline-block mr-[0.28em] will-change-opacity ${
                      isAccent ? 'text-[var(--accent-neon)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>

            {/* Max 3 Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {about.stats.slice(0, 3).map((stat, idx) => (
                <SpotlightCard key={stat.label} className="p-5!">
                  <div
                    ref={(el) => {
                      statRefs.current[idx] = el;
                    }}
                    className="font-display text-3xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums sm:text-4xl"
                  >
                    {reducedMotion ? `${stat.value.toFixed(stat.decimals)}${stat.suffix}` : '0'}
                  </div>
                  <p className="mt-1.5 font-mono text-xs tracking-wider uppercase text-[var(--text-secondary)]">
                    {stat.label}
                  </p>
                </SpotlightCard>
              ))}
            </div>

            <ResumeButton variant="secondary" />
          </div>
        </div>
      </Container>
    </section>
  );
}
