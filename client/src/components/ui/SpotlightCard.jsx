import { useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function SpotlightCard({
  as: Component = 'div',
  className = '',
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}) {
  const cardRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const handlePointerMove = (event) => {
    if (!reducedMotion && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event) => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--spotlight-opacity', '0');
    }
    onPointerLeave?.(event);
  };

  const handlePointerEnter = () => {
    if (!reducedMotion && cardRef.current) {
      cardRef.current.style.setProperty('--spotlight-opacity', '1');
    }
  };

  return (
    <Component
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`spotlight-card overflow-hidden p-6 sm:p-8 ${className}`.trim()}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </Component>
  );
}

