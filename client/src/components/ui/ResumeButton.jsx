import { useState } from 'react';
import { MagneticButton } from './MagneticButton';
import { personalInfo } from '../../data/content';

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5V10.5M8 10.5L4.75 7.25M8 10.5L11.25 7.25M3 13.5H13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ResumeButton({ variant = 'secondary', className = '' }) {
  const [showTodoHint, setShowTodoHint] = useState(false);
  const isReady = personalInfo.resumeUrl && !personalInfo.resumeUrl.startsWith('TODO');

  if (isReady) {
    return (
      <MagneticButton
        variant={variant}
        href={personalInfo.resumeUrl}
        download="Aryan_Kothari_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        iconRight={<DownloadIcon />}
        className={className}
      >
        Download Resume
      </MagneticButton>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-1.5">
      <MagneticButton
        variant={variant}
        iconRight={<DownloadIcon />}
        title={personalInfo.resumeUrl}
        onClick={() => {
          setShowTodoHint(true);
          window.setTimeout(() => setShowTodoHint(false), 2600);
        }}
        className={className}
      >
        Download Resume
      </MagneticButton>
      {showTodoHint && (
        <span className="font-mono text-xs text-[var(--accent-neon)]">
          Add PDF URL to personalInfo.resumeUrl in content.js
        </span>
      )}
    </div>
  );
}

