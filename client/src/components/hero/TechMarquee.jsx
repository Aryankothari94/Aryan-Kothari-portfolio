import { skills } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

const MARQUEE_ITEMS = [
  ...skills.frontend.slice(0, 2),
  ...skills.backend.slice(0, 3),
  ...skills.databases,
  ...skills.languages.slice(0, 3),
  ...skills.tools.slice(0, 4),
];

export function TechMarquee({ onScrollNext }) {
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  const handleScrollDown = () => {
    if (onScrollNext) {
      onScrollNext();
      return;
    }
    scrollTo('#about');
  };

  return (
    <div className="relative z-30 border-t border-[var(--border-subtle)] bg-[rgba(6,7,11,0.58)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-5 py-3.5 sm:px-10">
        {/* Infinite Marquee Strip */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          <div
            className={`flex w-max items-center gap-8 ${
              reducedMotion ? 'flex-wrap justify-center' : 'animate-marquee hover:[animation-play-state:paused]'
            }`}
          >
            {(reducedMotion ? MARQUEE_ITEMS : [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]).map(
              (item, idx) => (
                <div key={`${item}-${idx}`} className="flex shrink-0 items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent-neon)]" />
                  <span className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--text-secondary)]">
                    {item}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <button
          type="button"
          onClick={handleScrollDown}
          aria-label="Scroll to next section"
          className="group hidden shrink-0 cursor-pointer items-center gap-3 border-l border-[var(--border-subtle)] pl-6 sm:inline-flex"
        >
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-neon)]">
            Scroll
          </span>
          <span className="relative flex h-7 w-4 items-start justify-center rounded-full border border-[var(--border-strong)] p-1 transition-colors group-hover:border-[var(--accent-neon)]">
            <span className="h-1.5 w-1 rounded-full bg-[var(--accent-neon)] motion-safe:animate-bounce" />
          </span>
        </button>
      </div>
    </div>
  );
}

