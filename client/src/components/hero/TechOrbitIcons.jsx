import { useDeviceCapability } from '../../hooks/useDeviceCapability';

function ReactMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#00F0FF]" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

function NodeMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#B8FF2E]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2.5L20 7v10l-8 4.5L4 17V7l8-4.5z" strokeLinejoin="round" />
      <path d="M9.5 14.5V9.5l5 5V9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MongoMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#22C55E]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3c3.5 3.6 5 6.8 5 10.2 0 3.2-2.2 5.4-5 6.8-2.8-1.4-5-3.6-5-6.8C7 9.8 8.5 6.6 12 3z" />
      <path d="M12 10v11" strokeLinecap="round" />
    </svg>
  );
}

function ExpressMark() {
  return (
    <span className="font-mono text-xs font-bold tracking-tight text-[#F4F6FB]">EX</span>
  );
}

function PostgresMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#5B6CFF]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
    </svg>
  );
}

function JavaMark() {
  return (
    <span className="font-mono text-xs font-bold tracking-tight text-[#A855F7]">JV</span>
  );
}

const ORBIT_ITEMS = [
  {
    id: 'react',
    label: 'React',
    Icon: ReactMark,
    pos: 'top-[12%] -left-4 lg:-left-8',
    depth: 'front',
    delay: '0s',
  },
  {
    id: 'node',
    label: 'Node.js',
    Icon: NodeMark,
    pos: 'top-[18%] -right-3 lg:-right-6',
    depth: 'front',
    delay: '1.1s',
  },
  {
    id: 'mongo',
    label: 'MongoDB',
    Icon: MongoMark,
    pos: 'bottom-[28%] -left-6 lg:-left-10',
    depth: 'back',
    delay: '0.6s',
  },
  {
    id: 'express',
    label: 'Express',
    Icon: ExpressMark,
    pos: 'bottom-[20%] -right-4 lg:-right-8',
    depth: 'front',
    delay: '1.8s',
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    Icon: PostgresMark,
    pos: 'top-[4%] left-[22%]',
    depth: 'back',
    delay: '2.4s',
  },
  {
    id: 'java',
    label: 'Java DSA',
    Icon: JavaMark,
    pos: 'bottom-[42%] right-[2%]',
    depth: 'back',
    delay: '0.9s',
  },
];

export function TechOrbitIcons({ layer = 'all' }) {
  const { isMobile, reducedMotion } = useDeviceCapability();
  if (isMobile) return null;

  const items = ORBIT_ITEMS.filter((item) => layer === 'all' || item.depth === layer);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${layer === 'back' ? 'z-10' : 'z-30'}`}
    >
      {items.map(({ id, label, Icon, pos, depth, delay }) => {
        const isBack = depth === 'back';
        return (
          <div
            key={id}
            style={reducedMotion ? undefined : { animationDelay: delay }}
            className={`absolute ${pos} ${reducedMotion ? '' : 'animate-tech-float'} ${
              isBack ? 'scale-90 opacity-65 blur-[1.4px]' : 'opacity-95'
            }`}
          >
            <div className="flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[rgba(12,15,24,0.78)] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <Icon />
              <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--text-secondary)]">
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

