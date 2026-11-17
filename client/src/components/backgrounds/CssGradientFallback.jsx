export function CssGradientFallback({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--bg-void)] ${className}`.trim()}
      style={{
        backgroundImage: [
          'radial-gradient(ellipse 75% 55% at 15% 15%, rgba(0, 240, 255, 0.12), transparent 65%)',
          'radial-gradient(ellipse 65% 50% at 85% 28%, rgba(168, 85, 247, 0.11), transparent 65%)',
          'radial-gradient(ellipse 60% 45% at 45% 90%, rgba(184, 255, 46, 0.065), transparent 70%)',
        ].join(', '),
      }}
    />
  );
}

