import { useEffect, useRef, useState } from 'react';
import { about, education, experience, personalInfo, projects } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CODE_LINES = [
  { num: '01', tokens: [{ text: 'const ', cls: 'text-[#A855F7]' }, { text: 'developer', cls: 'text-[#00F0FF]' }, { text: ' = {', cls: 'text-[var(--text-secondary)]' }] },
  { num: '02', tokens: [{ text: '  name: ', cls: 'text-[var(--text-muted)]' }, { text: `'${personalInfo.name}'`, cls: 'text-[#B8FF2E]' }, { text: ',', cls: 'text-[var(--text-secondary)]' }] },
  { num: '03', tokens: [{ text: '  education: ', cls: 'text-[var(--text-muted)]' }, { text: `'${education[0].degree}'`, cls: 'text-[#F4F6FB]' }, { text: ',', cls: 'text-[var(--text-secondary)]' }] },
  { num: '04', tokens: [{ text: '  cgpa: ', cls: 'text-[var(--text-muted)]' }, { text: '8.93', cls: 'text-[#00F0FF]' }, { text: ', // up to 6th sem', cls: 'text-[var(--text-muted)] italic' }] },
  { num: '05', tokens: [{ text: '  shipped: ', cls: 'text-[var(--text-muted)]' }, { text: `['${projects[0].title}', '${projects[1].title}']`, cls: 'text-[#B8FF2E]' }, { text: ',', cls: 'text-[var(--text-secondary)]' }] },
  { num: '06', tokens: [{ text: '  building: ', cls: 'text-[var(--text-muted)]' }, { text: `'${projects[2].title} (4-agent pipeline)'`, cls: 'text-[#00F0FF]' }, { text: ',', cls: 'text-[var(--text-secondary)]' }] },
  { num: '07', tokens: [{ text: '  internedAt: ', cls: 'text-[var(--text-muted)]' }, { text: `'${experience[0].company}'`, cls: 'text-[#F4F6FB]' }, { text: ',', cls: 'text-[var(--text-secondary)]' }] },
  { num: '08', tokens: [{ text: '  status: ', cls: 'text-[var(--text-muted)]' }, { text: `'${about.summaryHighlights[0]}'`, cls: 'text-[#B8FF2E]' }] },
  { num: '09', tokens: [{ text: '};', cls: 'text-[var(--text-secondary)]' }] },
];

export function CodeEditorCard() {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState(reducedMotion ? CODE_LINES.length : 0);
  const [hasStarted, setHasStarted] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLines(CODE_LINES.length);
      return undefined;
    }

    const el = cardRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!hasStarted || reducedMotion) return undefined;
    if (visibleLines >= CODE_LINES.length) return undefined;

    const timer = window.setTimeout(() => {
      setVisibleLines((prev) => Math.min(prev + 1, CODE_LINES.length));
    }, 170);

    return () => window.clearTimeout(timer);
  }, [hasStarted, visibleLines, reducedMotion]);

  return (
    <div
      ref={cardRef}
      className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[rgba(10,12,20,0.85)] shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      {/* IDE Window Chrome */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#B8FF2E]/90" />
        </div>
        <span className="font-mono text-[11px] tracking-wider text-[var(--text-muted)]">
          aryan.profile.js
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-neon)]">
          {visibleLines >= CODE_LINES.length ? 'READY' : 'TYPING...'}
        </span>
      </div>

      {/* Typed Lines */}
      <div className="overflow-x-auto p-5 font-mono text-xs leading-6 sm:text-[13px] sm:leading-7">
        {CODE_LINES.map((line, idx) => {
          const shown = idx < visibleLines;
          const isCurrent = idx === visibleLines - 1 && visibleLines < CODE_LINES.length;
          return (
            <div
              key={line.num}
              className={`flex whitespace-pre transition-all duration-300 ${
                shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
              }`}
            >
              <span className="mr-4 select-none text-[var(--text-muted)]/60">{line.num}</span>
              <span>
                {line.tokens.map((tok, tIdx) => (
                  <span key={tIdx} className={tok.cls}>
                    {tok.text}
                  </span>
                ))}
                {isCurrent && !reducedMotion && (
                  <span className="ml-1 inline-block h-3.5 w-[2px] animate-pulse bg-[var(--accent-neon)] align-middle" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

