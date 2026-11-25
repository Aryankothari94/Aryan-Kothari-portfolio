import { Component, Suspense, lazy, useEffect, useState } from 'react';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useTheme } from '../../context/ThemeContext';
import { CssGradientFallback } from './CssGradientFallback';

const LazyShaderLiquid = lazy(() => import('./ShaderLiquidBackground'));
const LazyParticleField = lazy(() => import('./ParticleFieldBackground'));
const LazyFloatingShapes = lazy(() => import('./FloatingShapesBackground'));
const LazySpotlightGrid = lazy(() => import('./SpotlightGridBackground'));

const VARIANT_MAP = {
  shader: LazyShaderLiquid,
  particles: LazyParticleField,
  shapes: LazyFloatingShapes,
  grid: LazySpotlightGrid,
};

class BackgroundErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function AnimatedBackground({
  variant = 'shader',
  forceFallback = false,
  withGrain = true,
  className = '',
}) {
  const { shouldUseFallback } = useDeviceCapability();
  const { theme } = useTheme();
  const [hydratedWebGL, setHydratedWebGL] = useState(false);

  // Defer WebGL shader mount until first user interaction or idle timeout so initial paint & TBT stay fast
  useEffect(() => {
    if (forceFallback || shouldUseFallback || variant === 'fallback' || theme === 'light') {
      return undefined;
    }

    let settled = false;
    const activate = () => {
      if (settled) return;
      settled = true;
      setHydratedWebGL(true);
      window.removeEventListener('pointermove', activate);
      window.removeEventListener('scroll', activate);
      window.removeEventListener('keydown', activate);
    };

    window.addEventListener('pointermove', activate, { passive: true, once: true });
    window.addEventListener('scroll', activate, { passive: true, once: true });
    window.addEventListener('keydown', activate, { passive: true, once: true });

    const timer = window.setTimeout(activate, 4200);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', activate);
      window.removeEventListener('scroll', activate);
      window.removeEventListener('keydown', activate);
    };
  }, [forceFallback, shouldUseFallback, variant, theme]);

  const ActiveLayer = VARIANT_MAP[variant] || LazyShaderLiquid;

  if (
    forceFallback ||
    shouldUseFallback ||
    variant === 'fallback' ||
    theme === 'light' ||
    !hydratedWebGL
  ) {
    return (
      <>
        <CssGradientFallback className={className} />
        {withGrain && (
          <div aria-hidden="true" className="film-grain pointer-events-none fixed inset-0 z-[1]" />
        )}
      </>
    );
  }

  return (
    <>
      <BackgroundErrorBoundary resetKey={variant} fallback={<CssGradientFallback className={className} />}>
        <Suspense fallback={<CssGradientFallback className={className} />}>
          <ActiveLayer className={className} />
        </Suspense>
      </BackgroundErrorBoundary>
      {withGrain && (
        <div aria-hidden="true" className="film-grain pointer-events-none fixed inset-0 z-[1]" />
      )}
    </>
  );
}
