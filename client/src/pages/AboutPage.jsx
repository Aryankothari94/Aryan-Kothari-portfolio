import { AboutSection } from '../components/sections/AboutSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';

export default function AboutPage() {
  return (
    <main className="relative z-10 min-h-screen pt-16">
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
    </main>
  );
}

