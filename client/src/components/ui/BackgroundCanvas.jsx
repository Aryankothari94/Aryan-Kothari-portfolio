import { useReducedMotion } from '../../hooks/useReducedMotion';

export function BackgroundCanvas() {
  const reducedMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base Void */}
      <div className="absolute inset-0 bg-[var(--bg-void)]" />

      {/* Subtle Architectural Grid */}
      <div className="bg-grid-subtle absolute inset-0 opacity-80" />

      {/* Animated Gradient Mesh Orbs */}
      <div
        className={`absolute -top-[18%] -left-[12%] h-[58vw] max-h-[760px] w-[58vw] max-w-[760px] rounded-full blur-[130px] ${
          reducedMotion ? '' : 'mesh-orb-a'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(0, 240, 255, 0.14) 0%, rgba(91, 108, 255, 0.09) 45%, transparent 72%)',
        }}
      />

      <div
        className={`absolute top-[22%] -right-[16%] h-[52vw] max-h-[680px] w-[52vw] max-w-[680px] rounded-full blur-[140px] ${
          reducedMotion ? '' : 'mesh-orb-b'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(91, 108, 255, 0.08) 45%, transparent 72%)',
        }}
      />

      <div
        className={`absolute -bottom-[24%] left-[24%] h-[44vw] max-h-[580px] w-[44vw] max-w-[580px] rounded-full blur-[150px] ${
          reducedMotion ? '' : 'mesh-orb-a'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(184, 255, 46, 0.075) 0%, rgba(0, 240, 255, 0.04) 48%, transparent 75%)',
        }}
      />

      {/* Film-Grain Noise Overlay */}
      <div className="film-grain fixed inset-0 z-50" />
    </div>
  );
}

