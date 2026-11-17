import { Container, SectionHeading } from '../ui';
import { SkillTagSphere } from '../skills/SkillTagSphere';
import { VelocityMarquees } from '../skills/VelocityMarquees';
import { SkillTiltCard } from '../skills/SkillTiltCard';
import { skills } from '../../data/content';

const SKILL_CATEGORIES = [
  {
    key: 'languages',
    title: 'Languages',
    items: skills.languages,
    ringPercent: Math.round((skills.languages.length / 7) * 100),
    ringLabel: `0${skills.languages.length}`,
    ringSublabel: `${skills.languages.length} Core Languages`,
    accentColor: '#B8FF2E',
  },
  {
    key: 'frontend',
    title: 'Frontend',
    items: skills.frontend,
    ringPercent: Math.round((skills.frontend.length / 7) * 100),
    ringLabel: `0${skills.frontend.length}`,
    ringSublabel: `${skills.frontend.length} UI Capabilities`,
    accentColor: '#00F0FF',
  },
  {
    key: 'backend',
    title: 'Backend',
    items: skills.backend,
    ringPercent: Math.round((skills.backend.length / 7) * 100),
    ringLabel: `0${skills.backend.length}`,
    ringSublabel: `${skills.backend.length} Server Modules`,
    accentColor: '#5B6CFF',
  },
  {
    key: 'databases',
    title: 'Databases',
    items: skills.databases,
    ringPercent: Math.round((skills.databases.length / 7) * 100),
    ringLabel: `0${skills.databases.length}`,
    ringSublabel: 'SQL & NoSQL Engines',
    accentColor: '#A855F7',
  },
  {
    key: 'tools',
    title: 'Tools & Automation',
    items: skills.tools,
    ringPercent: Math.round((skills.tools.length / 7) * 100),
    ringLabel: `0${skills.tools.length}`,
    ringSublabel: `${skills.tools.length} Dev & Workflow Tools`,
    accentColor: '#B8FF2E',
  },
  {
    key: 'coreConcepts',
    title: 'Core Concepts',
    items: skills.coreConcepts,
    // Resume explicitly notes ~50% of planned Java DSA roadmap completed
    ringPercent: 50,
    ringLabel: '50%',
    ringSublabel: 'Java DSA Roadmap · 6 Areas',
    accentColor: '#00F0FF',
  },
];

export function SkillsSection() {
  return (
    <section
      id="skills"
      data-section="SKILLS"
      className="relative z-10 border-t border-[var(--border-subtle)]/60 py-24 sm:py-32"
    >
      <Container className="space-y-16">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <SectionHeading
              index="03"
              eyebrow="Technical Stack"
              title="Skills &"
              accent="Core Systems"
              subtitle="Full-stack MERN engineering, PostgreSQL data modeling, AI agent workflows, and Java DSA — interactive in 3D space."
            />

            <p className="type-sm max-w-md text-[var(--text-muted)]">
              Drag the 3D Fibonacci tag sphere to inspect every technology across languages,
              frontend, backend, databases, tools, and CS fundamentals.
            </p>
          </div>

          <SkillTagSphere />
        </div>

        {/* Opposing Scroll-Velocity Reactive Marquees */}
        <VelocityMarquees />

        {/* 3D Tilt + Glare + Animated Ring Skill Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((cat) => (
            <SkillTiltCard
              key={cat.key}
              category={cat.title}
              items={cat.items}
              ringPercent={cat.ringPercent}
              ringLabel={cat.ringLabel}
              ringSublabel={cat.ringSublabel}
              accentColor={cat.accentColor}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

