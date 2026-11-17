export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  subtitle,
  align = 'left',
  className = '',
}) {
  const isCentered = align === 'center';

  return (
    <header
      className={`space-y-4 ${isCentered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'} ${className}`.trim()}
    >
      {(index || eyebrow) && (
        <div
          className={`inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-secondary)] ${
            isCentered ? 'justify-center' : ''
          }`}
        >
          {index && <span className="text-[var(--accent-neon)]">{index}</span>}
          {index && eyebrow && <span className="h-px w-6 bg-[var(--border-strong)]" />}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}

      <h2 className="type-h2 text-[var(--text-primary)]">
        {title}
        {accent && (
          <>
            {' '}
            <span className="text-gradient-secondary">{accent}</span>
          </>
        )}
      </h2>

      {subtitle && (
        <p className="type-body-lg text-[var(--text-secondary)]">{subtitle}</p>
      )}
    </header>
  );
}

