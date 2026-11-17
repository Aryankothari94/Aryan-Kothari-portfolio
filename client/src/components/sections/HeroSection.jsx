import { Container, MagneticButton, Tag } from '../ui';
import { KineticNameBackdrop } from '../hero/KineticNameBackdrop';
import { RoleTypewriterGlitch } from '../hero/RoleTypewriterGlitch';
import { HeroPortrait } from '../hero/HeroPortrait';
import { TechMarquee } from '../hero/TechMarquee';
import { about, personalInfo } from '../../data/content';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSection({ revealReady = true }) {
  const { scrollTo } = useSmoothScroll();

  return (
    <section
      id="hero"
      data-section="HERO"
      className="relative z-10 flex min-h-screen flex-col justify-between overflow-hidden pt-20 sm:pt-24"
    >
      {/* Main Hero Stage */}
      <Container className="relative flex flex-1 items-center py-8 sm:py-12">
        <div className="relative w-full">
          {/* Monumental Kinetic Typography Behind Cutout (desktop overlaps behind portrait; mobile stacks cleanly) */}
          <div className="pointer-events-none relative z-10 mb-4 lg:absolute lg:inset-x-0 lg:top-1/2 lg:mb-0 lg:-translate-y-[58%]">
            <KineticNameBackdrop name={personalInfo.name} revealReady={revealReady} />
          </div>

          {/* Foreground Grid: Left Bio/Role/CTAs + Right-Aligned Portrait Cutout */}
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
            {/* Portrait first on mobile (stacked), right column on desktop */}
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <HeroPortrait
                revealReady={revealReady}
                alt={`${personalInfo.name} — ${personalInfo.title}`}
              />
            </div>

            {/* Editorial Left Content */}
            <div className="order-2 relative z-30 space-y-6 text-center lg:order-1 lg:pt-28 lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                <Tag variant="accent" dot>
                  {personalInfo.availability}
                </Tag>
                <Tag variant="gradient">CGPA 8.93 · B.Tech CSE</Tag>
              </div>

              <div className="space-y-3">
                <h1 className="sr-only">
                  {personalInfo.name} — {personalInfo.title}
                </h1>
                <RoleTypewriterGlitch />
                <p className="type-body-lg mx-auto max-w-xl text-[var(--text-secondary)] lg:mx-0">
                  {about.summaryHighlights[0]} — {about.summaryHighlights[1]}.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
                <MagneticButton
                  variant="primary"
                  iconRight={<ArrowIcon />}
                  onClick={() => scrollTo('#projects')}
                >
                  Explore Projects
                </MagneticButton>

                <MagneticButton
                  variant="secondary"
                  href={`mailto:${personalInfo.email}`}
                >
                  Get In Touch
                </MagneticButton>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 font-mono text-xs text-[var(--text-muted)] lg:justify-start">
                <span>{personalInfo.location}</span>
                <span>•</span>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="transition-colors hover:text-[var(--accent-neon)]"
                >
                  {personalInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Tech-Stack Marquee + Scroll Indicator */}
      <TechMarquee onScrollNext={() => scrollTo('#about')} />
    </section>
  );
}

