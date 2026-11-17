import { useCallback, useState } from 'react';
import { LayoutGroup, MotionConfig } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import {
  CustomCursor,
  KonamiEasterEgg,
  Navbar,
  PageTransition,
  Preloader,
  ScrollIndicators,
} from './components/core';
import { AnimatedBackground } from './components/backgrounds';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import DesignSystemPage from './pages/DesignSystemPage';
import WorkPage from './pages/WorkPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function HomePage({ heroRevealReady }) {
  return (
    <main className="relative z-10">
      <HeroSection revealReady={heroRevealReady} />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </main>
  );
}

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroRevealReady, setHeroRevealReady] = useState(false);
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
        <MotionConfig reducedMotion="user">
          <SmoothScrollProvider>
            <div className="relative flex min-h-screen flex-col bg-[var(--bg-void)] text-[var(--text-primary)]">
              <AnimatedBackground variant={bgVariant} />
              <CustomCursor />
              <KonamiEasterEgg />
              <ScrollIndicators />
              <Navbar />

              {!preloaderDone && (
                <Preloader onRevealStart={handleRevealStart} onComplete={handlePreloaderComplete} />
              )}

              <div className="flex-1">
                <LayoutGroup>
                  <PageTransition>
                    {(displayLocation) => (
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
                    )}
                  </PageTransition>
                </LayoutGroup>
              </div>

              <Footer />
            </div>
          </SmoothScrollProvider>
        </MotionConfig>
      </SoundProvider>
    </ThemeProvider>
  );
}
