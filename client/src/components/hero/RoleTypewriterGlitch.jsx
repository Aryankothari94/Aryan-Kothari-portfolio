import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ROLES = [
  'Full-Stack Web Developer (MERN)',
  'Java DSA Practitioner',
  'AI Workflow Automation Builder',
  '2x Shipped Production Websites',
];

export function RoleTypewriterGlitch() {
  const reducedMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState(ROLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(ROLES[0]);
      setIsGlitching(false);
      return undefined;
    }

    const currentRole = ROLES[roleIndex];
    let timeoutId;

    if (!isDeleting && displayed === currentRole) {
      timeoutId = window.setTimeout(() => {
        setIsGlitching(true);
        window.setTimeout(() => setIsGlitching(false), 260);
        setIsDeleting(true);
      }, 2100);
    } else if (isDeleting && displayed === '') {
      setIsGlitching(true);
      window.setTimeout(() => setIsGlitching(false), 240);
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else if (isDeleting) {
      timeoutId = window.setTimeout(() => {
        setDisplayed((prev) => prev.slice(0, -1));
      }, 26);
    } else {
      timeoutId = window.setTimeout(() => {
        setDisplayed(currentRole.slice(0, displayed.length + 1));
      }, 48);
    }

    return () => window.clearTimeout(timeoutId);
  }, [displayed, isDeleting, roleIndex, reducedMotion]);

  return (
    <div className="inline-flex min-h-[2rem] items-center gap-2.5 font-mono text-sm sm:text-base">
      <span className="text-[var(--accent-neon)]" aria-hidden="true">
        &gt;_
      </span>
      <span
        data-text={displayed}
        className={`relative font-medium tracking-wide text-[var(--text-primary)] ${
          isGlitching ? 'role-glitch' : ''
        }`}
      >
        {displayed}
      </span>
      {!reducedMotion && (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-[2px] animate-pulse bg-[var(--accent-neon)]"
        />
      )}
    </div>
  );
}

