import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import {
  CustomCursor,
  Navbar,
  PageTransition,
  Preloader,
  ScrollIndicators,
} from './components/core';
import { AnimatedBackground } from './components/backgrounds';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import {
  Button,
  Container,
  SectionHeading,
  SpotlightCard,
  Tag,
} from './components/ui';
import DesignSystemPage from './pages/DesignSystemPage';
import { personalInfo, projects } from './data/content';

const PLACEHOLDER_SECTIONS = [
  { id: 'projects', label: 'WORK', title: 'Selected Projects', copy: '04 // Hover the preview card below to test the VIEW cursor.' },
  { id: 'experience', label: 'EXP', title: 'Experience & Education', copy: '05 // E-Connect Pvt. Ltd. & WIT Solapur (UI pending)' },
  { id: 'contact', label: 'CONTACT', title: 'Get In Touch', copy: `06 // ${personalInfo.email}` },
];

function PlaceholderHome({ heroRevealReady }) {
  return (
    <main className="relative z-10">
      <HeroSection revealReady={heroRevealReady} />
      <AboutSection />
      <SkillsSection />

      {PLACEHOLDER_SECTIONS.map((sec, idx) => (
        <section
          key={sec.id}
          id={sec.id}
          data-section={sec.label}
          className="flex min-h-[82vh] items-center border-b border-[var(--border-subtle)]/50 py-24"
        >
          <Container>
            <div className="space-y-8">
              <SectionHeading
                index={`0${idx + 4}`}
                eyebrow={sec.label}
                title={sec.title}
                subtitle={sec.copy}
              />

              {sec.id === 'projects' && (
                <div className="grid gap-6 md:grid-cols-2">
                  {projects.slice(0, 2).map((project) => (
                    <SpotlightCard key={project.id} data-cursor="view" className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Tag variant="accent" dot>
                          {project.status}
                        </Tag>
                        <span className="font-mono text-xs text-[var(--text-muted)]">
                          data-cursor=&quot;view&quot;
                        </span>
                      </div>
                      <h3 className="type-h3 text-[var(--text-primary)]">{project.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{project.subtitle}</p>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </section>
      ))}
    </main>
  );
}

function PlaceholderSubRoute({ index, title, subtitle }) {
  return (
    <main className="relative z-10 flex min-h-screen items-center py-28">
      <Container size="narrow">
        <div className="space-y-6">
          <SectionHeading index={index} eyebrow="Route Shell" title={title} subtitle={subtitle} />
          <div className="flex flex-wrap gap-3">
            <Button to="/" variant="primary" size="md">
              ← Back Home
            </Button>
            <Button to="/design" variant="secondary" size="md">
              Inspect /design
            </Button>
          </div>
        </div>
      </Container>
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
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <div className="relative min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)]">
          <AnimatedBackground variant={bgVariant} />
          <CustomCursor />
          <ScrollIndicators />
          <Navbar />

          {!preloaderDone && (
            <Preloader onRevealStart={handleRevealStart} onComplete={handlePreloaderComplete} />
          )}

          <PageTransition>
            {(displayLocation) => (
              <Routes location={displayLocation}>
                <Route path="/" element={<PlaceholderHome heroRevealReady={heroRevealReady} />} />
                <Route
                  path="/work"
                  element={
                    <PlaceholderSubRoute
                      index="02"
                      title="Selected Work"
                      subtitle="Route shell ready — project case studies UI coming next."
                    />
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PlaceholderSubRoute
                      index="03"
                      title="About Aryan"
                      subtitle="Route shell ready — interactive biography & stack UI coming next."
                    />
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PlaceholderSubRoute
                      index="04"
                      title="Contact"
                      subtitle="Route shell ready — contact form wired to Express /api/contact coming next."
                    />
                  }
                />
                <Route
                  path="/design"
                  element={
                    <DesignSystemPage bgVariant={bgVariant} onSelectBgVariant={setBgVariant} />
                  }
                />
                <Route path="*" element={<PlaceholderHome heroRevealReady={heroRevealReady} />} />
              </Routes>
            )}
          </PageTransition>
        </div>
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
