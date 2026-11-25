import { Suspense, lazy, useCallback, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import {
  Navbar,
  PageTransition,
  Preloader,
  ScrollIndicators,
} from './components/core';
import { AnimatedBackground } from './components/backgrounds';
import { LazySection } from './components/core/LazySection';
import { HeroSection } from './components/sections/HeroSection';
import { Footer } from './components/layout/Footer';
import { useDeviceCapability } from './hooks/useDeviceCapability';
import { MOTION } from './config/motion';

const CustomCursor = lazy(() =>
  import('./components/core/CustomCursor').then((m) => ({ default: m.CustomCursor }))
);

const KonamiEasterEgg = lazy(() =>
  import('./components/core/KonamiEasterEgg').then((m) => ({ default: m.KonamiEasterEgg }))
);
const AboutSection = lazy(() =>
  import('./components/sections/AboutSection').then((m) => ({ default: m.AboutSection }))
);
const SkillsSection = lazy(() =>
  import('./components/sections/SkillsSection').then((m) => ({ default: m.SkillsSection }))
);
const ProjectsSection = lazy(() =>
  import('./components/sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
);
const ExperienceSection = lazy(() =>
  import('./components/sections/ExperienceSection').then((m) => ({ default: m.ExperienceSection }))
);
const ContactSection = lazy(() =>
  import('./components/sections/ContactSection').then((m) => ({ default: m.ContactSection }))
);

const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));
const WorkPage = lazy(() => import('./pages/WorkPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function HomePage({ heroRevealReady }) {
  return (
    <main id="main-content" className="relative z-10">
      <HeroSection revealReady={heroRevealReady} />
      <LazySection id="about" dataSection="ABOUT" minHeightClass="min-h-[900px]">
        <AboutSection />
      </LazySection>
      <LazySection id="skills" dataSection="SKILLS" minHeightClass="min-h-[950px]">
        <SkillsSection />
      </LazySection>
      <LazySection id="projects" dataSection="WORK" minHeightClass="min-h-[820px]">
        <ProjectsSection />
      </LazySection>
      <LazySection id="experience" dataSection="EXP" minHeightClass="min-h-[950px]">
        <ExperienceSection />
      </LazySection>
      <LazySection id="contact" dataSection="CONTACT" minHeightClass="min-h-[700px]">
        <ContactSection />
      </LazySection>
    </main>
  );
}

function hasSeenPreloader() {
  try {
    return window.sessionStorage.getItem(MOTION.preloader.sessionKey) === '1';
  } catch {
    return false;
  }
}

export default function App() {
  const { isMobile, reducedMotion } = useDeviceCapability();
  const [preloaderDone, setPreloaderDone] = useState(hasSeenPreloader);
  const [heroRevealReady, setHeroRevealReady] = useState(hasSeenPreloader);
  const [bgVariant, setBgVariant] = useState('shader');

  const handleRevealStart = useCallback(() => {
    setHeroRevealReady(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setHeroRevealReady(true);
    setPreloaderDone(true);
  }, []);

  return (
    <ThemeProvider>
      <SoundProvider>
        <SmoothScrollProvider>
          <div className="relative flex min-h-screen flex-col bg-[var(--bg-void)] text-[var(--text-primary)]">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:rounded-full focus:bg-[var(--accent-neon)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:text-[#06070B]"
            >
              Skip to content
            </a>

            <AnimatedBackground variant={bgVariant} />
            {!isMobile && !reducedMotion && (
              <Suspense fallback={null}>
                <CustomCursor />
              </Suspense>
            )}
            <Suspense fallback={null}>
              <KonamiEasterEgg />
            </Suspense>
            <ScrollIndicators />
            <Navbar />

            {!preloaderDone && (
              <Preloader onRevealStart={handleRevealStart} onComplete={handlePreloaderComplete} />
            )}

            <div className="flex-1">
              <PageTransition>
                {(displayLocation) => (
                  <Suspense fallback={<div className="min-h-screen" />}>
                    <Routes location={displayLocation}>
                      <Route path="/" element={<HomePage heroRevealReady={heroRevealReady} />} />
                      <Route path="/work" element={<WorkPage />} />
                      <Route path="/work/:projectId" element={<ProjectDetailPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route
                        path="/design"
                        element={
                          <DesignSystemPage
                            bgVariant={bgVariant}
                            onSelectBgVariant={setBgVariant}
                          />
                        }
                      />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                )}
              </PageTransition>
            </div>

            <Footer />
          </div>
        </SmoothScrollProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
