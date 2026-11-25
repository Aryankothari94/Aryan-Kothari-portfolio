import { Container, SectionHeading, SpotlightCard } from '../ui';
import { SkillTagSphere } from '../skills/SkillTagSphere';
import { skills } from '../../data/content';

const TECH_GLYPHS = {
  'React.js': '⚛',
  'Node.js': '⬢',
  'Express.js': 'EX',
  MongoDB: '🍃',
  'PostgreSQL (Supabase)': 'PG',
  'JavaScript (ES6+)': 'JS',
  Java: 'JV',
  Python: 'PY',
  'RESTful APIs': 'API',
  'n8n AI Workflows': 'AI',
};

export function SkillsSection() {
  return (
    <section
      id="skills"
      data-section="SKILLS"
      className="relative z-10 border-t border-[var(--border-subtle)]/60 py-28 sm:py-36"
    >
      <Container className="space-y-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="space-y-8">
            <SectionHeading
              index="03"
              eyebrow="Core Stack"
              title="Technologies I"
              accent="Ship With"
              subtitle="10 core tools I use to take web apps and AI workflows from prototype to production."
            />

            {/* Clean Visual 10-Tech Grid (no progress rings or percentage bars) */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {skills.core.slice(0, 10).map((tech) => (
                <SpotlightCard key={tech} className="flex items-center gap-3.5 p-3.5!">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-white/[0.03] font-mono text-xs font-bold text-[var(--accent-neon)]">
                    {TECH_GLYPHS[tech] || '•'}
                  </span>
                  <span className="font-sans text-sm font-medium text-[var(--text-primary)]">
                    {tech}
                  </span>
                </SpotlightCard>
              ))}
            </div>
          </div>

          <SkillTagSphere />
        </div>
      </Container>
    </section>
  );
}
