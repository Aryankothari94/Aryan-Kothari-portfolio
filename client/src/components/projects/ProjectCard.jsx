import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag } from '../ui';
import { ProjectWebGLImage } from './ProjectWebGLImage';
import { getProjectPlaceholderSvgUrl } from './projectVisuals';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';

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

  // Trigger split-title & pop-in tags when card enters viewport
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

    // 3D tilt & spotlight glare
    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 10;
    cardRef.current.style.transform = `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.14), rgba(184,255,46,0.06) 35%, transparent 70%)`;
    }

    // Cursor-following image trail (spawns every ~38px moved)
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
    <Link
      to={`/work/${project.id}`}
      state={{ sharedTransition: true }}
      data-cursor="view"
      className={`block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-neon)] ${className}`.trim()}
    >
      <article
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{ transformStyle: 'preserve-3d' }}
        className="spotlight-card group relative flex h-full flex-col justify-between overflow-hidden p-5 transition-transform duration-300 ease-[var(--ease-out-expo)] will-change-transform sm:p-7"
      >
        {/* Specular Glare Overlay */}
        <div
          ref={glareRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        />

        {/* Cursor-Following Miniature Image Trail */}
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

        {/* Card Header: Big Index + Status */}
        <div className="relative z-10 flex items-start justify-between gap-4 pb-4">
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

        {/* Visual Frame with Shared LayoutId + Inner Parallax Target */}
        <motion.div
          layoutId={`project-media-${project.id}`}
          className="relative z-10 aspect-[16/9] w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
        >
          <div className="project-parallax-inner h-full w-[114%] -ml-[7%] will-change-transform">
            <ProjectWebGLImage
              projectId={project.id}
              alt={`${project.title} preview`}
              isHovered={isHovered}
            />
          </div>
        </motion.div>

        {/* Card Footer: Text-Split Title Reveal + Subtitle + Pop-In Tech Tags */}
        <div className="relative z-10 mt-6 space-y-4">
          <div>
            <motion.h3
              layoutId={`project-title-${project.id}`}
              className="type-h2 flex flex-wrap gap-x-2.5 text-[var(--text-primary)]"
            >
              {titleWords.map((word, wIdx) => (
                <span key={`${word}-${wIdx}`} className="inline-block overflow-hidden">
                  <span
                    style={{
                      transitionDelay: reducedMotion ? '0ms' : `${wIdx * 65}ms`,
                    }}
                    className={`inline-block transition-transform duration-600 ease-[var(--ease-out-expo)] ${
                      inView ? 'translate-y-0' : 'translate-y-[115%]'
                    }`}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </motion.h3>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{project.subtitle}</p>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {project.highlights[0]}
          </p>

          {/* Pop-In Tech Stack Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.techStack.map((tech, tIdx) => (
              <span
                key={tech}
                style={{
                  transitionDelay: reducedMotion ? '0ms' : `${140 + tIdx * 55}ms`,
                }}
                className={`inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] transition-all duration-400 ease-[var(--ease-out-expo)] ${
                  inView ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}

