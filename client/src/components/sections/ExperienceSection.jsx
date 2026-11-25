import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, ResumeButton, SectionHeading, SpotlightCard, Tag } from '../ui';
import { education, experience, notableBadges } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MOTION } from '../../config/motion';

gsap.registerPlugin(ScrollTrigger);

export function ExperienceSection() {
  const reducedMotion = useReducedMotion();
  const timelineWrapRef = useRef(null);
  const progressLineRef = useRef(null);
  const entryRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleEntries, setVisibleEntries] = useState(() => new Set());

  // Self-drawing vertical line
  useEffect(() => {
    if (reducedMotion || !timelineWrapRef.current || !progressLineRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineWrapRef.current,
            start: 'top 72%',
            end: 'bottom 72%',
            scrub: MOTION.scroll.scrub,
          },
        }
      );
    }, timelineWrapRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const nodes = entryRefs.current.filter(Boolean);
    if (nodes.length === 0) return undefined;

    if (reducedMotion) {
      setVisibleEntries(new Set(nodes.map((_, i) => i)));
      return undefined;
    }

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = nodes.indexOf(entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: '-38% 0px -38% 0px', threshold: 0 }
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = nodes.indexOf(entry.target);
            if (idx !== -1) {
              setVisibleEntries((prev) => {
                if (prev.has(idx)) return prev;
                const next = new Set(prev);
                next.add(idx);
                return next;
              });
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    nodes.forEach((node) => {
      activeObserver.observe(node);
      revealObserver.observe(node);
    });

    return () => {
      activeObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [reducedMotion]);

  return (
    <section
      id="experience"
      data-section="EXP"
      className="relative z-10 border-t border-[var(--border-subtle)]/60 py-28 sm:py-36"
    >
      <Container className="space-y-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="05"
            eyebrow="Background"
            title="Experience &"
            accent="Education"
          />
          <ResumeButton variant="secondary" />
        </div>

        {/* Compact Experience Timeline (role, company, dates, ONE impact line) */}
        <div ref={timelineWrapRef} className="relative max-w-4xl py-2 pl-10">
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-3 w-[2px] bg-white/10" />
          <div
            ref={progressLineRef}
            aria-hidden="true"
            style={{
              transform: reducedMotion ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top center',
            }}
            className="absolute top-0 bottom-0 left-3 w-[2px] bg-gradient-to-b from-[#B8FF2E] via-[#00F0FF] to-[#A855F7] shadow-[0_0_16px_rgba(184,255,46,0.5)] will-change-transform"
          />

          <div className="space-y-8">
            {experience.map((item, idx) => {
              const isActive = idx === activeIndex;
              const isVisible = reducedMotion || visibleEntries.has(idx);

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    entryRefs.current[idx] = el;
                  }}
                  className={`relative transition-all duration-600 ease-[var(--ease-out-expo)] ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-6 -left-[34px] z-20 block h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'scale-125 border-[var(--accent-neon)] bg-[var(--accent-neon)] shadow-[0_0_14px_var(--accent-neon)]'
                        : 'border-[var(--border-strong)] bg-[var(--bg-void)]'
                    }`}
                  />

                  <SpotlightCard
                    className={`transition-transform duration-300 ${
                      isActive && !reducedMotion ? 'scale-[1.015]' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="type-h3 text-[var(--text-primary)]">{item.role}</h3>
                        <p className="mt-0.5 text-sm font-medium text-[#00F0FF]">{item.company}</p>
                      </div>
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {item.period}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">{item.impact}</p>
                  </SpotlightCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* Single-line Education + Max 2 Small Notable Recognition Badges */}
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-6 py-5 backdrop-blur-xl">
          <p className="text-sm text-[var(--text-primary)] sm:text-base">
            <span className="font-display font-semibold">{education.degree}</span>
            <span className="mx-2 text-[var(--text-muted)]">·</span>
            <span className="text-[var(--text-secondary)]">{education.institution}</span>
            <span className="mx-2 text-[var(--text-muted)]">·</span>
            <span className="font-mono text-xs text-[var(--text-muted)]">{education.period}</span>
            <span className="mx-2 text-[var(--text-muted)]">·</span>
            <span className="font-mono text-xs font-semibold text-[var(--accent-neon)]">
              {education.grade}
            </span>
          </p>

          <div className="flex flex-wrap gap-2">
            {notableBadges.slice(0, 3).map((badge) => (
              <Tag key={badge} variant="accent">
                {badge}
              </Tag>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
