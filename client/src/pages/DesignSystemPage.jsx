import {
  Button,
  Container,
  SectionHeading,
  SpotlightCard,
  Tag,
} from '../components/ui';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { about, personalInfo, projects, skills } from '../data/content';

const BACKGROUND_VARIANTS = [
  { id: 'shader', label: 'WebGL Liquid Shader', desc: 'Interactive FBM noise reacting to cursor' },
  { id: 'particles', label: 'R3F Particle Field', desc: 'Drifting points with cursor repulsion' },
  { id: 'shapes', label: '3D Geometric Shapes', desc: 'Torus & icosahedron with scroll parallax' },
  { id: 'grid', label: 'Spotlight Grid', desc: 'Animated grid with cursor spotlight' },
  { id: 'fallback', label: 'CSS Fallback', desc: 'Zero-WebGL low-end & mobile gradient' },
];

const COLOR_TOKENS = [
  {
    name: 'Obsidian Void',
    token: '--bg-void',
    value: '#06070B',
    swatchStyle: { background: '#06070B' },
    desc: 'Primary canvas background',
  },
  {
    name: 'Elevated Surface',
    token: '--bg-elevated',
    value: '#0C0E15',
    swatchStyle: { background: '#0C0E15' },
    desc: 'Secondary panels & drawers',
  },
  {
    name: 'Glass Surface',
    token: '--bg-glass',
    value: 'rgba(13, 16, 26, 0.62)',
    swatchStyle: {
      background: 'rgba(13, 16, 26, 0.62)',
      backdropFilter: 'blur(16px)',
    },
    desc: 'Frosted translucent card base',
  },
  {
    name: 'Electric Volt (Accent)',
    token: '--accent-neon',
    value: '#B8FF2E',
    swatchStyle: {
      background: '#B8FF2E',
      boxShadow: '0 0 28px rgba(184, 255, 46, 0.35)',
    },
    desc: 'Primary kinetic accent & CTAs',
  },
  {
    name: 'Spectral Plasma (Secondary)',
    token: '--gradient-secondary',
    value: '#00F0FF → #5B6CFF → #A855F7',
    swatchStyle: {
      background: 'linear-gradient(135deg, #00F0FF 0%, #5B6CFF 52%, #A855F7 100%)',
    },
    desc: 'Secondary mesh & highlight gradient',
  },
  {
    name: 'Alabaster Ink',
    token: '--text-primary',
    value: '#F4F6FB',
    swatchStyle: { background: '#F4F6FB' },
    desc: 'Headings & high-emphasis text',
  },
  {
    name: 'Muted Slate',
    token: '--text-secondary',
    value: '#98A0B8',
    swatchStyle: { background: '#98A0B8' },
    desc: 'Body copy & metadata labels',
  },
  {
    name: 'Hairline Border',
    token: '--border-subtle',
    value: 'rgba(255, 255, 255, 0.08)',
    swatchStyle: {
      background: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.24)',
    },
    desc: 'Structural dividers & card edges',
  },
];

const TYPE_SCALE = [
  {
    label: 'Hero',
    className: 'type-hero',
    token: '--text-hero',
    formula: 'clamp(2.75rem, 6vw + 1rem, 6.25rem)',
    sample: 'Creative MERN Engineer.',
  },
  {
    label: 'Display',
    className: 'type-display',
    token: '--text-display',
    formula: 'clamp(2rem, 3.8vw + 0.75rem, 4rem)',
    sample: 'Built for production scale.',
  },
  {
    label: 'Heading 2',
    className: 'type-h2',
    token: '--text-h2',
    formula: 'clamp(1.625rem, 2.4vw + 0.75rem, 2.75rem)',
    sample: 'Selected Architecture & Systems',
  },
  {
    label: 'Heading 3',
    className: 'type-h3',
    token: '--text-h3',
    formula: 'clamp(1.2rem, 1.3vw + 0.65rem, 1.65rem)',
    sample: 'Geospatial Intelligence Platform',
  },
  {
    label: 'Body Large',
    className: 'type-body-lg text-[var(--text-secondary)]',
    token: '--text-body-lg',
    formula: 'clamp(1.0625rem, 0.45vw + 0.9rem, 1.25rem)',
    sample: about.bio,
  },
  {
    label: 'Body',
    className: 'type-body text-[var(--text-secondary)]',
    token: '--text-body',
    formula: 'clamp(0.9375rem, 0.2vw + 0.875rem, 1.0625rem)',
    sample:
      'Designed modular RESTful APIs with optimized queries and data modeling for fast multi-city data retrieval.',
  },
  {
    label: 'Small / UI',
    className: 'type-sm text-[var(--text-secondary)]',
    token: '--text-sm',
    formula: 'clamp(0.8125rem, 0.12vw + 0.775rem, 0.875rem)',
    sample: `${personalInfo.location} · ${personalInfo.email}`,
  },
  {
    label: 'Micro / Mono',
    className: 'type-xs font-mono uppercase tracking-[0.18em] text-[var(--text-muted)]',
    token: '--text-xs',
    formula: 'clamp(0.7rem, 0.08vw + 0.68rem, 0.75rem)',
    sample: '01 // FULL-STACK SYSTEM · MERN + POSTGRESQL + AI AGENTS',
  },
];

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DesignSystemPage({ bgVariant = 'shader', onSelectBgVariant }) {
  const reducedMotion = useReducedMotion();
  const { isMobile, isLowEnd, hasWebGL, shouldUseFallback } = useDeviceCapability();

  return (
    <div className="relative z-10 min-h-screen pt-24 pb-28">
      {/* Top Diagnostic Bar */}
      <div className="border-y border-[var(--border-subtle)] bg-[rgba(6,7,11,0.55)] backdrop-blur-xl">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent-neon)] shadow-[0_0_12px_var(--accent-neon)]" />
            <span className="font-display text-sm font-bold tracking-wide uppercase">
              Design System <span className="text-[var(--text-muted)]">/ Temporary Review</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Tag variant={reducedMotion ? 'accent' : 'gradient'} dot={!reducedMotion}>
              {reducedMotion ? 'Reduced Motion: Active' : 'Motion: Full'}
            </Tag>
            <Button to="/" variant="ghost" size="sm">
              ← Home Shell
            </Button>
          </div>
        </Container>
      </div>

      <main className="space-y-24 pt-14 sm:pt-20">
        {/* Intro Hero Specimen */}
        <section>
          <Container>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Tag variant="accent" dot>
                  Design Tokens v1.0
                </Tag>
                <Tag variant="gradient">Syne + Plus Jakarta Sans + JetBrains Mono</Tag>
              </div>

              <h1 className="type-hero max-w-5xl">
                Obsidian depth,{' '}
                <span className="text-[var(--accent-neon)]">volt precision,</span>{' '}
                <span className="text-gradient-secondary">spectral glass.</span>
              </h1>

              <p className="type-body-lg max-w-2xl text-[var(--text-secondary)]">
                Visual foundation for {personalInfo.name}&apos;s portfolio — built with CSS custom
                properties, a fluid <code className="font-mono text-[var(--accent-neon)]">clamp()</code>{' '}
                type scale, SVG film grain, drifting gradient mesh orbs, and cursor-reactive
                glassmorphism cards.
              </p>
            </div>
          </Container>
        </section>

        {/* 01 // Color Palette & Gradients */}
        <section>
          <Container className="space-y-10">
            <SectionHeading
              index="01"
              eyebrow="Color Architecture"
              title="Tokens &"
              accent="Surface Hierarchy"
              subtitle="High-contrast dark obsidian surfaces anchored by a single electric volt accent and a three-stop spectral gradient."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COLOR_TOKENS.map((item) => (
                <SpotlightCard key={item.token} className="p-5!">
                  <div
                    className="mb-4 h-20 w-full rounded-xl border border-white/10"
                    style={item.swatchStyle}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                        {item.name}
                      </h3>
                    </div>
                    <p className="font-mono text-xs text-[var(--accent-neon)]">{item.token}</p>
                    <p className="font-mono text-[11px] text-[var(--text-muted)]">{item.value}</p>
                    <p className="pt-1 text-xs text-[var(--text-secondary)]">{item.desc}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </Container>
        </section>

        {/* 02 // Fluid Typography Scale */}
        <section>
          <Container className="space-y-10">
            <SectionHeading
              index="02"
              eyebrow="Typography"
              title="Fluid Scale with"
              accent="clamp()"
              subtitle="Expressive Syne display headings paired with clean Plus Jakarta Sans body copy and JetBrains Mono metadata."
            />

            <SpotlightCard className="divide-y divide-[var(--border-subtle)] p-0!">
              {TYPE_SCALE.map((row) => (
                <div
                  key={row.token}
                  className="grid gap-4 p-6 sm:p-8 lg:grid-cols-[240px_1fr] lg:items-baseline"
                >
                  <div className="space-y-1">
                    <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
                      {row.label}
                    </p>
                    <p className="font-mono text-xs text-[var(--accent-neon)]">{row.token}</p>
                    <p className="font-mono text-[11px] text-[var(--text-muted)]">{row.formula}</p>
                  </div>
                  <div className="min-w-0">
                    <p className={`${row.className} break-words`}>{row.sample}</p>
                  </div>
                </div>
              ))}
            </SpotlightCard>
          </Container>
        </section>

        {/* 03 // Reusable Components: Buttons & Tags */}
        <section>
          <Container className="space-y-10">
            <SectionHeading
              index="03"
              eyebrow="Primitives"
              title="Buttons, Tags &"
              accent="Interactive States"
              subtitle="Polymorphic controls supporting React Router links, anchors, and native buttons with accessible focus rings."
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <SpotlightCard className="space-y-8">
                <div>
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                    Button Variants & Sizes
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" size="sm" iconRight={<ArrowIcon />}>
                      Primary SM
                    </Button>
                    <Button variant="primary" size="md" iconRight={<ArrowIcon />}>
                      Primary MD
                    </Button>
                    <Button variant="primary" size="lg" iconRight={<ArrowIcon />}>
                      Primary LG
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" size="sm">
                    Secondary SM
                  </Button>
                  <Button variant="secondary" size="md" iconRight={<ArrowIcon />}>
                    Secondary MD
                  </Button>
                  <Button variant="secondary" size="lg">
                    Secondary LG
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="ghost" size="sm">
                    Ghost SM
                  </Button>
                  <Button variant="ghost" size="md" iconRight={<ArrowIcon />}>
                    Ghost MD
                  </Button>
                  <Button variant="primary" size="md" disabled>
                    Disabled
                  </Button>
                </div>
              </SpotlightCard>

              <SpotlightCard className="space-y-8">
                <div>
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                    Tag Variants
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Tag variant="accent" dot>
                      Live Production
                    </Tag>
                    <Tag variant="gradient">AI Agent Pipeline</Tag>
                    <Tag variant="outline">CGPA 8.93</Tag>
                    <Tag variant="default">MERN Stack</Tag>
                  </div>
                </div>

                <div>
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                    Skill Tag Cluster (from content.js)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...skills.languages, ...skills.databases, ...skills.backend].map((skill) => (
                      <Tag key={skill} variant="default">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </Container>
        </section>

        {/* 04 // Cursor Spotlight Glass Cards */}
        <section>
          <Container className="space-y-10">
            <SectionHeading
              index="04"
              eyebrow="Glassmorphism"
              title="Cursor-Reactive"
              accent="Spotlight Cards"
              subtitle="Move your cursor across the cards below to inspect the radial-gradient 1px border glow and inner surface sheen."
            />

            <div className="grid gap-6 md:grid-cols-3">
              {projects.map((project, idx) => (
                <SpotlightCard
                  key={project.id}
                  data-cursor="view"
                  className="flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        0{idx + 1}
                      </span>
                      <Tag
                        variant={project.status === 'Live' ? 'accent' : 'gradient'}
                        dot={project.status === 'Live'}
                      >
                        {project.status}
                      </Tag>
                    </div>

                    <div>
                      <h3 className="type-h3 text-[var(--text-primary)]">{project.title}</h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {project.subtitle}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {project.highlights[0]}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] pt-4">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <Tag key={tech} variant="default" className="text-[10px]! px-2.5! py-0.5!">
                        {tech}
                      </Tag>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </Container>
        </section>

        {/* 05 // SectionHeading Alignment & Container Bounds */}
        <section>
          <Container className="space-y-12">
            <SectionHeading
              index="05"
              eyebrow="Centered Specimen"
              title="Editorial Heading"
              accent="Centered Variant"
              subtitle="Demonstrating centered SectionHeading alignment and Container max-width tiers below."
              align="center"
            />

            <div className="space-y-4">
              {[
                { size: 'narrow', label: 'Container size="narrow" (max-w-4xl)' },
                { size: 'default', label: 'Container size="default" (max-w-7xl)' },
                { size: 'wide', label: 'Container size="wide" (max-w-[1440px])' },
              ].map((tier) => (
                <Container key={tier.size} size={tier.size} className="px-0!">
                  <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-white/[0.02] px-5 py-3 font-mono text-xs text-[var(--text-secondary)]">
                    {tier.label}
                  </div>
                </Container>
              ))}
            </div>
          </Container>
        </section>

        {/* 06 // Lazy-Loaded Animated Backgrounds */}
        <section>
          <Container className="space-y-8">
            <SectionHeading
              index="06"
              eyebrow="Background Engine"
              title="Lazy-Loaded"
              accent="WebGL & CSS Layers"
              subtitle="Switch active background layers live. Three.js & R3F scenes are code-split, dispose geometries/materials/GL contexts on unmount, and automatically fall back to pure CSS on mobile, low-end, or reduced-motion devices."
            />

            <SpotlightCard className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <Tag variant={hasWebGL ? 'accent' : 'outline'}>
                  WebGL: {hasWebGL ? 'Supported' : 'Unavailable'}
                </Tag>
                <Tag variant="default">Mobile: {isMobile ? 'Yes' : 'No'}</Tag>
                <Tag variant="default">Low-End: {isLowEnd ? 'Yes' : 'No'}</Tag>
                <Tag variant={shouldUseFallback ? 'accent' : 'gradient'}>
                  Auto Mode: {shouldUseFallback ? 'CSS Fallback' : 'Full WebGL'}
                </Tag>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {BACKGROUND_VARIANTS.map((item) => {
                  const active = bgVariant === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectBgVariant?.(item.id)}
                      className={`cursor-pointer rounded-xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? 'border-[var(--accent-neon)] bg-[var(--accent-neon-dim)]'
                          : 'border-[var(--border-subtle)] bg-white/[0.02] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </SpotlightCard>
          </Container>
        </section>
      </main>
    </div>
  );
}

