import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button, Container, MagneticButton, Tag } from '../components/ui';
import { getProjectPlaceholderSvgUrl } from '../components/projects/projectVisuals';
import { projects } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MOTION } from '../config/motion';

gsap.registerPlugin(ScrollTrigger);

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.5 3.5H12.5V10.5M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const reducedMotion = useReducedMotion();
  const heroMediaRef = useRef(null);

  const idx = projects.findIndex((p) => p.id === projectId);
  const project = idx !== -1 ? projects[idx] : projects[0];
  const projectIndex = idx !== -1 ? idx : 0;
  const nextProject = projects[(projectIndex + 1) % projects.length];

  const isLiveUrlReady = project.liveUrl && !project.liveUrl.startsWith('TODO');
  const isRepoUrlReady = project.repoUrl && !project.repoUrl.startsWith('TODO');
  const placeholderUrl = getProjectPlaceholderSvgUrl(project.id);

  // Parallax hero image on scroll
  useEffect(() => {
    if (reducedMotion || !heroMediaRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroMediaRef.current,
        { yPercent: -5, scale: 1.08 },
        {
          yPercent: 7,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroMediaRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [project.id, reducedMotion]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : MOTION.timing.staggerItem,
        delayChildren: reducedMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.01 : MOTION.timing.revealDuration,
        ease: MOTION.easing.framerSnappy,
      },
    },
  };

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-28">
      <Container className="space-y-14">
        {/* Top Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            to="/"
            state={{ sharedTransition: true, scrollToId: '#projects' }}
            variant="ghost"
            size="sm"
          >
            ← Back to Projects
          </Button>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Project {String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {/* Hero Title & Shared-Element Media */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Tag
                variant={project.status === 'Live' ? 'accent' : 'gradient'}
                dot={project.status === 'Live'}
              >
                {project.status}
              </Tag>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                {project.subtitle}
              </span>
            </div>

            <motion.h1
              layoutId={`project-title-${project.id}`}
              className="type-display text-[var(--text-primary)]"
            >
              {project.title}
            </motion.h1>
          </div>

          {/* Shared-Element Parallax Hero Frame */}
          <motion.div
            layoutId={`project-media-${project.id}`}
            className="relative aspect-[16/9] max-h-[540px] w-full overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-elevated)]"
          >
            <img
              ref={heroMediaRef}
              src={placeholderUrl}
              alt={`${project.title} showcase`}
              className="h-full w-full object-cover will-change-transform"
            />
            <div className="pointer-events-none absolute top-4 left-4 rounded-md border border-dashed border-white/25 bg-black/60 px-3 py-1 font-mono text-[11px] tracking-wider uppercase text-white/80 backdrop-blur-sm">
              Placeholder · Replace with Live Screenshot
            </div>
          </motion.div>
        </div>

        {/* Staggered Details, Metrics, Tech Stack & Live/GitHub CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]"
        >
          {/* Left: Highlights */}
          <div className="space-y-6">
            <motion.h2 variants={itemVariants} className="type-h3 text-[var(--text-primary)]">
              Architecture &amp; Execution
            </motion.h2>

            <ul className="space-y-4">
              {project.highlights.map((bullet, bIdx) => (
                <motion.li
                  key={bIdx}
                  variants={itemVariants}
                  className="flex gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-5 backdrop-blur-xl"
                >
                  <span className="font-mono text-xs font-bold text-[var(--accent-neon)]">
                    0{bIdx + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                    {bullet}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right: Metrics, Stack & Links */}
          <div className="space-y-8">
            <motion.div
              variants={itemVariants}
              className="space-y-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-glass)] p-6 backdrop-blur-xl"
            >
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
                Key Metrics
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.metrics.map((metric) => (
                  <Tag key={metric} variant="accent">
                    {metric}
                  </Tag>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-glass)] p-6 backdrop-blur-xl"
            >
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Tag key={tech} variant="default">
                    {tech}
                  </Tag>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {isLiveUrlReady ? (
                <MagneticButton
                  variant="primary"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  iconRight={<ExternalIcon />}
                >
                  Visit Live Site
                </MagneticButton>
              ) : (
                <Button variant="secondary" disabled title={project.liveUrl}>
                  Live URL (In Progress)
                </Button>
              )}

              {isRepoUrlReady ? (
                <MagneticButton
                  variant="secondary"
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  iconRight={<ExternalIcon />}
                >
                  GitHub Repo
                </MagneticButton>
              ) : (
                <Button variant="ghost" disabled title={project.repoUrl}>
                  GitHub Repo (TODO)
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Next Project Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-10">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Next Project
          </span>
          <Link
            to={`/work/${nextProject.id}`}
            className="group inline-flex items-center gap-3 font-display text-2xl font-bold text-[var(--text-primary)] transition-colors hover:text-[var(--accent-neon)] sm:text-3xl"
          >
            <span>{nextProject.title}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Container>
    </main>
  );
}
