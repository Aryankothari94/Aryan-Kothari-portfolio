import { Container, MagneticButton } from '../ui';
import { KineticNameBackdrop } from '../hero/KineticNameBackdrop';
import { HeroPortrait } from '../hero/HeroPortrait';
import { personalInfo } from '../../data/content';
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
      className="relative z-10 flex min-h-screen items-center overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20"
    >
      <Container className="relative">
        <div className="relative w-full">
          {/* Monumental Kinetic Name Behind Cutout */}
          <div className="pointer-events-none relative z-10 mb-6 min-h-[76px] sm:min-h-[110px] lg:absolute lg:inset-x-0 lg:top-[8%] lg:mb-0 lg:min-h-[260px]">
            <KineticNameBackdrop name={personalInfo.name} revealReady={revealReady} />
          </div>

          {/* Foreground Grid: Value Proposition + 2 CTAs & Portrait Cutout */}
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <HeroPortrait
                revealReady={revealReady}
                alt={`${personalInfo.name} — ${personalInfo.title}`}
              />
            </div>

            <div className="order-2 relative z-30 space-y-8 text-center lg:order-1 lg:pt-32 lg:text-left">
              <h1 className="sr-only">{personalInfo.name}</h1>

              <p className="type-body-lg mx-auto max-w-xl text-[var(--text-primary)] lg:mx-0">
                {personalInfo.valueProp}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <MagneticButton
                  variant="primary"
                  iconRight={<ArrowIcon />}
                  onClick={() => scrollTo('#projects')}
                >
                  View my work
                </MagneticButton>

                <MagneticButton
                  variant="secondary"
                  onClick={() => scrollTo('#contact')}
                >
                  Let&apos;s talk
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
