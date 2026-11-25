import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, SectionHeading } from '../ui';
import { ProjectCard } from '../projects/ProjectCard';
import { projects, socials } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MOTION } from '../../config/motion';

gsap.registerPlugin(ScrollTrigger);

export function ProjectsSection() {
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  const pinSectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const githubItem = socials.find((s) => s.name === 'GitHub');
  const isGithubReady = githubItem?.url && !githubItem.url.startsWith('TODO');

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const enablePinnedHorizontal = isDesktop && !reducedMotion;

  useEffect(() => {
    if (!enablePinnedHorizontal || !pinSectionRef.current || !trackRef.current || !viewportRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const viewport = viewportRef.current;

      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      const scrollTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinSectionRef.current,
          pin: true,
          scrub: MOTION.scroll.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => `+=${getDistance() + MOTION.scroll.horizontalEndPaddingPx}`,
        },
      });

      const innerMedia = gsap.utils.toArray('.project-parallax-inner', track);
      innerMedia.forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('article') || el,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: MOTION.scroll.scrubParallax,
            },
          }
        );
      });
    }, pinSectionRef);

    return () => ctx.revert();
  }, [enablePinnedHorizontal]);

  return (
    <section
      ref={pinSectionRef}
      id="projects"
      data-section="WORK"
      className="relative z-10 overflow-hidden border-t border-[var(--border-subtle)]/60 py-24 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-24"
    >
      <Container className="mb-10 shrink-0">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="04"
            eyebrow="Selected Work"
            title="Featured"
            accent="Projects"
            subtitle="My best shipped products and active AI systems — built for real users."
          />

          {isGithubReady ? (
            <a
              href={githubItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-[0.16em] uppercase text-[var(--accent-neon)] transition-opacity hover:opacity-80"
            >
              More projects on GitHub ↗
            </a>
          ) : (
            <span
              title={githubItem?.url}
              className="font-mono text-xs tracking-[0.16em] uppercase text-[var(--text-muted)]"
            >
              More projects on GitHub (Link TODO)
            </span>
          )}
        </div>
      </Container>

      {enablePinnedHorizontal ? (
        <div ref={viewportRef} className="w-full overflow-hidden pl-12 pr-12">
          <div ref={trackRef} className="flex w-max items-stretch gap-7 will-change-transform">
            {projects.slice(0, 4).map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                className="w-[520px] shrink-0 xl:w-[580px]"
              />
            ))}
          </div>
        </div>
      ) : (
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {projects.slice(0, 4).map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </Container>
      )}
    </section>
  );
}
