import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, SectionHeading, SpotlightCard, Tag } from '../ui';
import { FlipAchievementCard } from '../experience/FlipAchievementCard';
import { achievements, certifications, education, experience } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const ACHIEVEMENT_CARDS = [
  {
    category: 'Hackathon',
    title: 'Intercollege Hackathon Finalist',
    summary: 'Selected for the Final Round.',
    detail: achievements[0],
    tagVariant: 'accent',
  },
  {
    category: 'Competition',
    title: 'WIT-Char Webtopia',
    summary: 'National-level website designing competition.',
    detail: achievements[1],
    tagVariant: 'gradient',
  },
  {
    category: 'Java DSA',
    title: 'DSA Roadmap (~50%)',
    summary: 'OOP, Recursion & Backtracking completed.',
    detail: achievements[2],
    tagVariant: 'accent',
  },
  {
    category: 'Production',
    title: '2 Live Production Websites',
    summary: '1 public platform & 1 paid client project.',
    detail: achievements[3],
    tagVariant: 'gradient',
  },
];

export function ExperienceSection() {
  const reducedMotion = useReducedMotion();
  const timelineWrapRef = useRef(null);
  const progressLineRef = useRef(null);
  const entryRefs = useRef([]);
  const gridRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleEntries, setVisibleEntries] = useState(() => new Set());
  const [gridInView, setGridInView] = useState(reducedMotion);

  const timelineEntries = useMemo(() => {
    const expItems = experience.map((item) => ({
      id: item.id,
      kind: 'Experience',
      period: item.period,
      title: item.role,
      org: item.company,
      highlights: item.highlights,
      tagVariant: 'accent',
    }));

    const eduItems = education.map((item) => ({
      id: item.id,
      kind: 'Education',
      period: item.period.startsWith('TODO') ? item.institution : item.period,
      title: item.degree,
      org: item.institution,
      highlights: [item.grade],
      tagVariant: 'gradient',
    }));

    return [...expItems, ...eduItems];
  }, []);

  const recognitionCards = useMemo(() => {
    const certCards = certifications.map((cert) => ({
      category: 'Certification',
      title: cert.title || cert.name,
      summary: cert.issuer || '',
      detail: cert.description || cert.date || cert.title,
      tagVariant: 'accent',
    }));
    return [...certCards, ...ACHIEVEMENT_CARDS];
  }, []);

  // Scroll-drawn glowing vertical timeline line
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
            start: 'top 68%',
            end: 'bottom 68%',
            scrub: 0.45,
          },
        }
      );
    }, timelineWrapRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Active timeline node + entry reveal via IntersectionObserver (zero scroll-loop reads)
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
  }, [reducedMotion, timelineEntries.length]);

  // Flip grid staggered entrance
  useEffect(() => {
    if (reducedMotion) {
      setGridInView(true);
      return undefined;
    }
    const el = gridRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setGridInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      id="experience"
      data-section="EXP"
      className="relative z-10 border-t border-[var(--border-subtle)]/60 py-24 sm:py-32"
    >
      <Container className="space-y-24">
        {/* Part 1: Alternating Scroll-Drawn Vertical Timeline */}
        <div className="space-y-16">
          <SectionHeading
            index="05"
            eyebrow="Experience & Education"
            title="Trajectory &"
            accent="Academic Foundation"
            subtitle="From production web development training at E-Connect Pvt. Ltd. to Computer Science engineering at WIT Solapur."
          />

          <div ref={timelineWrapRef} className="relative mx-auto max-w-5xl py-4">
            {/* Static Track Line (left rail on mobile, centered on md+) */}
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-4 w-[2px] bg-white/10 md:left-1/2 md:-translate-x-1/2"
            />

            {/* Self-Drawing Glowing Gradient Line */}
            <div
              ref={progressLineRef}
              aria-hidden="true"
              style={{ transform: reducedMotion ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'top center' }}
              className="absolute top-0 bottom-0 left-4 w-[2px] bg-gradient-to-b from-[#B8FF2E] via-[#00F0FF] to-[#A855F7] shadow-[0_0_16px_rgba(184,255,46,0.55)] will-change-transform md:left-1/2 md:-translate-x-1/2"
            />

            <div className="space-y-12 md:space-y-16">
              {timelineEntries.map((entry, idx) => {
                const isLeft = idx % 2 === 0;
                const isActive = idx === activeIndex;
                const isVisible = reducedMotion || visibleEntries.has(idx);

                const slideHiddenClass = reducedMotion
                  ? ''
                  : isLeft
                    ? 'opacity-0 translate-x-6 md:-translate-x-12'
                    : 'opacity-0 translate-x-6 md:translate-x-12';

                return (
                  <div
                    key={entry.id}
                    ref={(el) => {
                      entryRefs.current[idx] = el;
                    }}
                    className="relative grid items-center pl-12 md:grid-cols-2 md:gap-12 md:pl-0"
                  >
                    {/* Timeline Node */}
                    <div
                      aria-hidden="true"
                      className="absolute top-7 left-4 z-20 -translate-x-1/2 md:top-1/2 md:left-1/2 md:-translate-y-1/2"
                    >
                      <div className="relative flex h-4 w-4 items-center justify-center">
                        {isActive && !reducedMotion && (
                          <span className="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-[var(--accent-neon)]/45" />
                        )}
                        <span
                          className={`relative block h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                            isActive
                              ? 'scale-125 border-[var(--accent-neon)] bg-[var(--accent-neon)] shadow-[0_0_16px_var(--accent-neon)]'
                              : 'border-[var(--border-strong)] bg-[#06070B]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Alternating Card Placement */}
                    <div
                      className={`transition-all duration-700 ease-[var(--ease-out-expo)] ${
                        isLeft ? 'md:col-start-1' : 'md:col-start-2'
                      } ${isVisible ? 'translate-x-0 opacity-100' : slideHiddenClass}`}
                    >
                      <SpotlightCard
                        className={`transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                          isActive && !reducedMotion
                            ? 'scale-[1.03] border-[rgba(184,255,46,0.38)]!'
                            : 'scale-100 opacity-85'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Tag variant={entry.tagVariant} dot={isActive}>
                              {entry.kind}
                            </Tag>
                            <span className="font-mono text-xs text-[var(--text-muted)]">
                              {entry.period}
                            </span>
                          </div>

                          <div>
                            <h3 className="type-h3 text-[var(--text-primary)]">{entry.title}</h3>
                            <p className="mt-1 text-sm font-medium text-[#00F0FF]">{entry.org}</p>
                          </div>

                          <ul className="space-y-2 border-t border-[var(--border-subtle)] pt-3">
                            {entry.highlights.map((line, lIdx) => (
                              <li
                                key={lIdx}
                                style={{
                                  transitionDelay: reducedMotion ? '0ms' : `${120 + lIdx * 70}ms`,
                                }}
                                className={`flex items-start gap-2.5 text-sm text-[var(--text-secondary)] transition-all duration-500 ${
                                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                                }`}
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-neon)]" />
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </SpotlightCard>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Part 2: Achievements & Certifications Flip-Card Grid */}
        <div ref={gridRef} className="space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              index="05B"
              eyebrow="Milestones"
              title="Achievements &"
              accent="Recognition"
              subtitle="Hover or tap any card to flip for full verified details."
            />
            {certifications.length === 0 && (
              <span className="font-mono text-[11px] tracking-wider uppercase text-[var(--text-muted)]">
                Certifications slot ready in content.js
              </span>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recognitionCards.map((item, idx) => (
              <FlipAchievementCard
                key={item.title}
                index={idx}
                category={item.category}
                title={item.title}
                summary={item.summary}
                detail={item.detail}
                tagVariant={item.tagVariant}
                inView={gridInView}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

