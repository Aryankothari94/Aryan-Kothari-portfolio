import { Link } from 'react-router-dom';

const VARIANT_CLASSES = {
  primary:
    'bg-[var(--accent-neon)] text-[#06070B] font-semibold shadow-[0_0_24px_rgba(184,255,46,0.24)] hover:shadow-[0_0_36px_rgba(184,255,46,0.48)] hover:brightness-105 active:scale-[0.98]',
  secondary:
    'border border-[var(--border-strong)] bg-[var(--bg-glass)] text-[var(--text-primary)] backdrop-blur-md hover:border-[rgba(0,240,255,0.5)] hover:bg-[var(--bg-glass-hover)] hover:shadow-[0_0_24px_rgba(0,240,255,0.16)] active:scale-[0.98]',
  ghost:
    'border border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-white/[0.05] hover:text-[var(--text-primary)] active:scale-[0.98]',
};

const SIZE_CLASSES = {
  sm: 'h-9 px-4 text-xs tracking-wide gap-1.5',
  md: 'h-11 px-6 text-sm tracking-wide gap-2',
  lg: 'h-13 px-8 text-[15px] tracking-wide gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  iconLeft,
  iconRight,
  className = '',
  children,
  disabled = false,
  ...props
}) {
  const baseClasses =
    'group relative inline-flex items-center justify-center rounded-full font-sans font-medium whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)] disabled:pointer-events-none disabled:opacity-45 cursor-pointer select-none';
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const composedClassName = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();

  const content = (
    <>
      {iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && (
        <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">
          {iconRight}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={composedClassName} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={composedClassName} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} className={composedClassName} {...props}>
      {content}
    </button>
  );
}

