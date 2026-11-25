import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';

export function MagneticButton({
  variant = 'primary',
  to,
  href,
  onClick,
  iconRight,
  className = '',
  children,
  ...props
}) {
  const { isMobile, reducedMotion } = useDeviceCapability();
  const btnRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const magneticEnabled = !isMobile && !reducedMotion;

  const handlePointerMove = (e) => {
    if (!magneticEnabled || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.24;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
    btnRef.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };

  const handlePointerLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = 'translate3d(0px, 0px, 0)';
  };

  const handlePointerDown = (e) => {
    if (reducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.9;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { id, x, y, size }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const isPrimary = variant === 'primary';
  const baseClasses = `group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-7 font-sans text-sm font-semibold tracking-wide transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-expo)] cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)] ${
    isPrimary
      ? 'border border-[var(--accent-neon)] bg-[var(--accent-neon)] text-[#06070B] shadow-[0_0_28px_rgba(184,255,46,0.28)] hover:shadow-[0_0_38px_rgba(0,240,255,0.45)]'
      : 'border border-[var(--border-strong)] bg-[rgba(13,16,26,0.72)] text-[var(--text-primary)] backdrop-blur-xl hover:border-[var(--accent-neon)]'
  } ${className}`.trim();

  const inner = (
    <>
      {/* Fill-wipe hover layer */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 translate-y-full rounded-full transition-transform duration-250 ease-[var(--ease-out-expo)] group-hover:translate-y-0 motion-reduce:hidden ${
          isPrimary
            ? 'bg-gradient-to-r from-[#00F0FF] via-[#5B6CFF] to-[#A855F7]'
            : 'bg-[var(--accent-neon)]'
        }`}
      />

      {/* Click ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          className="animate-btn-ripple pointer-events-none absolute rounded-full bg-white/40"
        />
      ))}

      {/* Label */}
      <span
        className={`relative z-10 inline-flex items-center gap-2 transition-colors duration-300 ${
          isPrimary
            ? 'text-[#06070B] group-hover:text-white'
            : 'text-[var(--text-primary)] group-hover:text-[#06070B]'
        }`}
      >
        <span>{children}</span>
        {iconRight && (
          <span className="inline-flex transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
            {iconRight}
          </span>
        )}
      </span>
    </>
  );

  const sharedEvents = {
    ref: btnRef,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    onPointerDown: handlePointerDown,
    onClick,
    className: baseClasses,
  };

  if (to) {
    return (
      <Link to={to} {...sharedEvents} {...props}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} {...sharedEvents} {...props}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" {...sharedEvents} {...props}>
      {inner}
    </button>
  );
}

