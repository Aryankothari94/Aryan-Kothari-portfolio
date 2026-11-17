import { useEffect, useRef, useState } from 'react';
import { getProjectPlaceholderSvgUrl } from './projectVisuals';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';

const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT = `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    float ripple = sin(dist * 26.0 - uTime * 6.5) * exp(-dist * 4.2) * uHover * 0.022;
    vec2 dir = normalize(uv - uMouse + 0.0001);
    vec2 distortedUv = clamp(uv + dir * ripple, 0.001, 0.999);

    // Subtle RGB chromatic split on ripple edge
    float chroma = ripple * 0.45;
    float r = texture2D(uTexture, clamp(distortedUv + vec2(chroma, 0.0), 0.001, 0.999)).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, clamp(distortedUv - vec2(chroma, 0.0), 0.001, 0.999)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export function ProjectWebGLImage({ projectId, alt, isHovered, className = '' }) {
  const { shouldUseFallback } = useDeviceCapability();
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const hoveredRef = useRef(false);
  const [webglReady, setWebglReady] = useState(false);

  const placeholderUrl = getProjectPlaceholderSvgUrl(projectId);

  useEffect(() => {
    hoveredRef.current = isHovered;
  }, [isHovered]);

  // Mount lightweight WebGL ripple layer only when hovered on capable devices (prevents excess GL contexts)
  useEffect(() => {
    if (shouldUseFallback || !isHovered || !containerRef.current) {
      setWebglReady(false);
      return undefined;
    }

    const container = containerRef.current;
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 360;

    let disposed = false;
    let rafId = 0;
    let cleanupFn = null;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(rect.width, 1)));
      mouseRef.current.y = Math.max(
        0,
        Math.min(1, 1 - (e.clientY - rect.top) / Math.max(rect.height, 1))
      );
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });

    import('three').then((THREE) => {
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      const geometry = new THREE.PlaneGeometry(2, 2);
      const img = new Image();
      img.src = placeholderUrl;

      const texture = new THREE.Texture(img);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      img.onload = () => {
        if (!disposed) {
          texture.needsUpdate = true;
          setWebglReady(true);
        }
      };

      const uniforms = {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(mouseRef.current.x, mouseRef.current.y) },
        uHover: { value: 0 },
        uTime: { value: 0 },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms,
        depthTest: false,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      container.appendChild(renderer.domElement);

      let prevTime = performance.now();
      const tick = (now) => {
        rafId = requestAnimationFrame(tick);
        const dt = Math.min((now - prevTime) / 1000, 0.05);
        prevTime = now;

        uniforms.uTime.value += dt;
        uniforms.uMouse.value.x += (mouseRef.current.x - uniforms.uMouse.value.x) * 0.14;
        uniforms.uMouse.value.y += (mouseRef.current.y - uniforms.uMouse.value.y) * 0.14;
        const targetH = hoveredRef.current ? 1 : 0;
        uniforms.uHover.value += (targetH - uniforms.uHover.value) * 0.12;

        renderer.render(scene, camera);
      };

      rafId = requestAnimationFrame(tick);

      cleanupFn = () => {
        cancelAnimationFrame(rafId);
        scene.remove(mesh);
        texture.dispose();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      container.removeEventListener('pointermove', onPointerMove);
      cleanupFn?.();
      setWebglReady(false);
    };
  }, [isHovered, placeholderUrl, shouldUseFallback]);

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`.trim()}>
      {/* Base Gradient Placeholder Image (always present + fallback on mobile/low-end) */}
      <img
        src={placeholderUrl}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          webglReady ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Explicit Placeholder Marker Badge */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 rounded-md border border-dashed border-white/25 bg-black/55 px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase text-white/75 backdrop-blur-sm">
        Placeholder · Replace Screenshot
      </div>
    </div>
  );
}
