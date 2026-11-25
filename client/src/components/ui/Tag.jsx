const TAG_VARIANTS = {
  default:
    'border-[var(--border-subtle)] bg-white/[0.03] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
  accent:
    'border-[rgba(184,255,46,0.32)] bg-[var(--accent-neon-dim)] text-[var(--accent-neon)]',
  gradient:
    'border-[rgba(0,240,255,0.28)] bg-gradient-to-r from-[#00F0FF]/10 via-[#5B6CFF]/10 to-[#A855F7]/10 text-[#D9F8FF]',
  outline:
    'border-[var(--border-strong)] bg-transparent text-[var(--text-primary)]',
};

export function Tag({
  variant = 'default',
  dot = false,
  className = '',
  children,
  ...props
}) {
  const variantClass = TAG_VARIANTS[variant] || TAG_VARIANTS.default;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-medium tracking-wider uppercase transition-colors duration-200 ${variantClass} ${className}`.trim()}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-neon)] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-neon)]" />
        </span>
      )}
      {children}
    </span>
  );
}

