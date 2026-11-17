import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

export function ScrollIndicators() {
  const location = useLocation();
  const { scrollTo } = useSmoothScroll();
  const barRef = useRef(null);

  const [sections, setSections] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Top scroll progress bar via ScrollTrigger (zero React re-renders on scroll)
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.transform = 'scaleX(0)';
    }

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [location.pathname]);

  // Side section counter via IntersectionObserver (no scroll-loop getBoundingClientRect)
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-section]'));
    if (nodes.length === 0) {
      setSections([]);
      return undefined;
    }

    const mapped = nodes.map((el, idx) => ({
      id: el.id || `section-${idx + 1}`,
      label: el.getAttribute('data-section') || `0${idx + 1}`,
      el,
    }));
    setSections(mapped);
    setActiveIndex(0);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = nodes.indexOf(entry.target);
            if (idx !== -1) {
              setActiveIndex(idx);
            }
          }
        }
      },
      {
        rootMargin: '-42% 0px -42% 0px',
        threshold: 0,
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  const totalStr = String(sections.length).padStart(2, '0');
  const activeStr = String(activeIndex + 1).padStart(2, '0');

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 h-[2px] w-full bg-white/[0.06]"
      >
        <div
          ref={barRef}
          style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
          className="h-full w-full bg-gradient-to-r from-[#B8FF2E] via-[#00F0FF] to-[#A855F7] shadow-[0_0_12px_rgba(184,255,46,0.65)] will-change-transform"
        />
      </div>

      {/* Side Section Counter (01/06) */}
      {sections.length > 1 && (
        <aside
          aria-label="Section progress"
          className="fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
        >
          <div className="flex items-baseline gap-1 font-mono text-xs tabular-nums tracking-widest">
            <span className="text-sm font-semibold text-[var(--accent-neon)]">{activeStr}</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-[var(--text-muted)]">{totalStr}</span>
          </div>

          <nav className="flex flex-col items-end gap-2.5">
            {sections.map((sec, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollTo(sec.el)}
                  aria-label={`Jump to ${sec.label}`}
                  className="group flex cursor-pointer items-center gap-2.5 py-0.5 focus-visible:outline-1 focus-visible:outline-[var(--accent-neon)]"
                >
                  <span
                    className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${
                      isActive
                        ? 'translate-x-0 text-[var(--text-primary)] opacity-100'
                        : 'translate-x-1 text-[var(--text-muted)] opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  >
                    {sec.label}
                  </span>
                  <span
                    className={`block h-[2px] rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-6 bg-[var(--accent-neon)] shadow-[0_0_10px_var(--accent-neon)]'
                        : 'w-2.5 bg-white/20 group-hover:w-4 group-hover:bg-white/50'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </aside>
      )}
    </>
  );
}

