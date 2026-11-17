import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import meOriginal from '../../assets/me-original.webp';
import { Container, SectionHeading, SpotlightCard } from '../ui';
import { CodeEditorCard } from '../about/CodeEditorCard';
import { about, personalInfo } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHT_WORDS = new Set([
  '8.93',
  'MERN',
  '1,500+',
  'AutoDev',
  'AI,',
  'Know',
  'Your',
  'City,',
  'Shri',
  'Metro',
  'Products,',
  'PostgreSQL',
  'MongoDB',
]);

const STATS = [
  { target: 1500, decimals: 0, suffix: '+', label: 'Users on Know Your City' },
  { target: 8.93, decimals: 2, suffix: '', label: 'B.Tech CSE CGPA' },
  { target: 43, decimals: 0, suffix: '+', label: 'Furniture Models Built' },
  { target: 2, decimals: 0, suffix: '', label: 'Shipped Live Websites' },
];

export function AboutSection() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const wordRefs = useRef([]);
  const photoClipRef = useRef(null);
  const photoImgRef = useRef(null);
  const statRefs = useRef([]);

  const bioWords = about.bio.split(' ');

  // Scroll-scrubbed word-by-word illumination + clip-path parallax photo reveal
  useEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const words = wordRefs.current.filter(Boolean);
      if (words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'center 42%',
              scrub: 0.6,
            },
          }
        );
      }

      if (photoClipRef.current && photoImgRef.current) {
        gsap.fromTo(
          photoClipRef.current,
          { clipPath: 'inset(18% 12% 18% 12% round 24px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 20px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: photoClipRef.current,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 0.7,
            },
          }
        );

        gsap.fromTo(
          photoImgRef.current,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: photoClipRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Count-up stats triggered once when visible
  useEffect(() => {
    const nodes = statRefs.current.filter(Boolean);
    if (nodes.length === 0) return undefined;

    if (reducedMotion) {
      STATS.forEach((stat, idx) => {
        if (nodes[idx]) {
          nodes[idx].textContent = `${stat.target.toFixed(stat.decimals)}${stat.suffix}`;
        }
      });
      return undefined;
    }

    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !triggered) {
          triggered = true;
          STATS.forEach((stat, idx) => {
            const el = nodes[idx];
            if (!el) return;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: stat.target,
              duration: 1.45,
              ease: 'power3.out',
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

    if (nodes[0]) observer.observe(nodes[0].parentElement);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="ABOUT"
      className="relative z-10 border-t border-[var(--border-subtle)]/60 py-24 sm:py-32"
    >
      <Container className="space-y-16">
        <SectionHeading
          index="02"
          eyebrow="About"
          title="Engineering"
          accent="With Craft"
          subtitle={`${personalInfo.location} · ${personalInfo.availability}`}
        />

        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left: Parallax Clip-Path Expanding Photo + Stat Counters */}
          <div className="space-y-6">
            <div
              ref={photoClipRef}
              style={
                reducedMotion
                  ? { clipPath: 'inset(0% 0% 0% 0% round 20px)' }
                  : { clipPath: 'inset(18% 12% 18% 12% round 24px)' }
              }
              className="relative aspect-[4/4.3] overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-elevated)] will-change-[clip-path]"
            >
              <img
                ref={photoImgRef}
                src={meOriginal}
                alt={personalInfo.name}
                loading="lazy"
                className="h-full w-full object-cover object-top will-change-transform"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070B]/85 via-transparent to-transparent"
              />
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between font-mono text-[11px] tracking-widest uppercase text-[var(--text-secondary)]">
                <span>{personalInfo.name}</span>
                <span className="text-[var(--accent-neon)]">WIT SOLAPUR</span>
              </div>
            </div>

            {/* Stat Counters Grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, idx) => (
                <SpotlightCard key={stat.label} className="p-5!">
                  <div
                    ref={(el) => {
                      statRefs.current[idx] = el;
                    }}
                    className="font-display text-3xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums sm:text-4xl"
                  >
                    {reducedMotion ? `${stat.target.toFixed(stat.decimals)}${stat.suffix}` : '0'}
                  </div>
                  <p className="mt-1.5 font-mono text-[11px] tracking-wider uppercase text-[var(--text-secondary)]">
                    {stat.label}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Right: Scroll-Scrubbed Word-by-Word Lit Bio + Code Editor Card */}
          <div className="space-y-10">
            <p className="font-display text-xl leading-[1.45] font-semibold tracking-tight sm:text-2xl lg:text-[1.72rem]">
              {bioWords.map((word, idx) => {
                const isAccent = HIGHLIGHT_WORDS.has(word);
                return (
                  <span
                    key={`${word}-${idx}`}
                    ref={(el) => {
                      wordRefs.current[idx] = el;
                    }}
                    style={reducedMotion ? undefined : { opacity: 0.18 }}
                    className={`inline-block mr-[0.28em] will-change-opacity ${
                      isAccent ? 'text-[var(--accent-neon)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>

            <CodeEditorCard />
          </div>
        </div>
      </Container>
    </section>
  );
}

