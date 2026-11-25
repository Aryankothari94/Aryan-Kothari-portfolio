import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag } from '../ui';
import { ProjectWebGLImage } from './ProjectWebGLImage';
import { getProjectPlaceholderSvgUrl } from './projectVisuals';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { MOTION } from '../../config/motion';

export function ProjectCard({ project, index, className = '' }) {
  const { isMobile, reducedMotion } = useDeviceCapability();
  const interactive = !isMobile && !reducedMotion;

  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const lastTrailPos = useRef({ x: 0, y: 0 });
  const trailIdRef = useRef(0);

  const [isHovered, setIsHovered] = useState(false);
  const [inView, setInView] = useState(reducedMotion);
  const [trailGhosts, setTrailGhosts] = useState([]);

  const indexLabel = String(index + 1).padStart(2, '0');
  const titleWords = project.title.split(' ');
  const placeholderThumb = getProjectPlaceholderSvgUrl(project.id);

  const isLiveReady = project.liveUrl && !project.liveUrl.startsWith('TODO');
  const isRepoReady = project.repoUrl && !project.repoUrl.startsWith('TODO');

  useEffect(() => {
    if (reducedMotion) {
      setInView(true);
      return undefined;
    }

    const el = cardRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const handlePointerMove = (e) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / Math.max(rect.width, 1);
    const py = y / Math.max(rect.height, 1);

    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 10;
    cardRef.current.style.transform = `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.14), rgba(184,255,46,0.06) 35%, transparent 70%)`;
    }

    const dist = Math.hypot(x - lastTrailPos.current.x, y - lastTrailPos.current.y);
    if (dist >= 38) {
      lastTrailPos.current = { x, y };
      trailIdRef.current += 1;
      const id = trailIdRef.current;
      const rot = (Math.random() - 0.5) * 14;

      setTrailGhosts((prev) => [...prev.slice(-4), { id, x, y, rot }]);
      window.setTimeout(() => {
        setTrailGhosts((prev) => prev.filter((item) => item.id !== id));
      }, 480);
    }
  };

  const handlePointerEnter = (e) => {
    setIsHovered(true);
    if (interactive && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      lastTrailPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      cardRef.current.style.setProperty('--spotlight-opacity', '1');
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTrailGhosts([]);
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
    cardRef.current.style.setProperty('--spotlight-opacity', '0');
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className={`spotlight-card group relative flex h-full flex-col justify-between overflow-hidden p-5 transition-transform duration-200 ease-[var(--ease-out-expo)] will-change-transform sm:p-7 ${className}`.trim()}
    >
      {/* Specular Glare Overlay */}
      <div
        ref={glareRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
      />

      {/* Cursor-Following Image Trail */}
      {interactive &&
        trailGhosts.map((ghost) => (
          <img
            key={ghost.id}
            src={placeholderThumb}
            alt=""
            aria-hidden="true"
            style={{
              left: ghost.x,
              top: ghost.y,
              transform: `translate(-50%, -50%) rotate(${ghost.rot}deg)`,
            }}
            className="animate-trail-fade pointer-events-none absolute z-30 h-20 w-32 rounded-lg border border-[var(--accent-neon)]/50 object-cover shadow-2xl"
          />
        ))}

      {/* Clickable Case Study Link Area (valid HTML — separate from Live/GitHub buttons below) */}
      <Link
        to={`/work/${project.id}`}
        state={{ sharedTransition: true }}
        data-cursor="view"
        className="relative z-10 block space-y-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-neon)]"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="font-display text-4xl font-extrabold leading-none tracking-tight text-transparent [-webkit-text-stroke:1.2px_rgba(244,246,251,0.45)] transition-colors duration-300 group-hover:[-webkit-text-stroke:1.2px_#B8FF2E] sm:text-5xl">
            {indexLabel}
          </span>

          <Tag
            variant={project.status === 'Live' ? 'accent' : 'gradient'}
            dot={project.status === 'Live'}
          >
            {project.status}
          </Tag>
        </div>

        <motion.div
          layoutId={`project-media-${project.id}`}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
        >
          <div className="project-parallax-inner h-full w-[114%] -ml-[7%] will-change-transform">
            <ProjectWebGLImage
              projectId={project.id}
              alt={`${project.title} preview`}
              isHovered={isHovered}
            />
          </div>
        </motion.div>

        <div className="space-y-2.5">
          <motion.h3
            layoutId={`project-title-${project.id}`}
            className="type-h2 flex flex-wrap gap-x-2.5 text-[var(--text-primary)]"
          >
            {titleWords.map((word, wIdx) => (
              <span key={`${word}-${wIdx}`} className="inline-block overflow-hidden">
                <span
                  style={{
                    transitionDelay: reducedMotion
                      ? '0ms'
                      : `${wIdx * Math.round(MOTION.timing.staggerWord * 1000)}ms`,
                  }}
                  className={`inline-block transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    inView ? 'translate-y-0' : 'translate-y-[115%]'
                  }`}
                >
                  {word}
                </span>
              </span>
            ))}
          </motion.h3>

          {/* One-line result / problem summary */}
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {project.oneLiner}
          </p>
        </div>
      </Link>

      {/* Footer: Max 4 Tech Tags + Live & GitHub Buttons */}
      <div className="relative z-10 mt-6 space-y-4 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech, tIdx) => (
            <span
              key={tech}
              style={{
                transitionDelay: reducedMotion
                  ? '0ms'
                  : `${80 + tIdx * Math.round(MOTION.timing.staggerItem * 1000)}ms`,
              }}
              className={`inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-white/[0.03] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] transition-all duration-300 ease-[var(--ease-out-expo)] ${
                inView ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isLiveReady ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--accent-neon)] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#06070B] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span>Live</span>
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span
              title={project.liveUrl}
              className="inline-flex h-9 items-center rounded-full border border-[var(--border-subtle)] px-4 font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]"
            >
              In Progress
            </span>
          )}

          {isRepoReady ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-4 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] transition-colors hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)]"
            >
              <span>GitHub</span>
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span
              title={project.repoUrl}
              className="inline-flex h-9 items-center rounded-full border border-[var(--border-subtle)] px-4 font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]"
            >
              GitHub (TODO)
            </span>
          )}

          <Link
            to={`/work/${project.id}`}
            state={{ sharedTransition: true }}
            className="ml-auto font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-neon)]"
          >
            Case Study →
          </Link>
        </div>
      </div>
    </article>
  );
}
