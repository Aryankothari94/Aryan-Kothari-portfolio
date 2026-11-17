import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, SectionHeading } from '../ui';
import { ProjectCard } from '../projects/ProjectCard';
import { projects } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function ProjectsSection() {
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  const pinSectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

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
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => `+=${getDistance() + 360}`,
        },
      });

      const innerMedia = gsap.utils.toArray('.project-parallax-inner', track);
      innerMedia.forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('article') || el,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
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
      className="relative z-10 overflow-hidden border-t border-[var(--border-subtle)]/60 py-20 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-24"
    >
      <Container className="mb-10 shrink-0">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="04"
            eyebrow="Selected Work"
            title="Shipped &"
            accent="Active Builds"
            subtitle="Production platforms and client systems — click any project to open its full breakdown."
          />

          <span className="hidden font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] lg:inline-block">
            {projects.length} Featured Projects · Scroll →
          </span>
        </div>
      </Container>

      {enablePinnedHorizontal ? (
        <div ref={viewportRef} className="w-full overflow-hidden pl-12 pr-12">
          <div ref={trackRef} className="flex w-max items-stretch gap-8 will-change-transform">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                className="w-[640px] shrink-0 xl:w-[700px]"
              />
            ))}
          </div>
        </div>
      ) : (
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </Container>
      )}
    </section>
  );
}

