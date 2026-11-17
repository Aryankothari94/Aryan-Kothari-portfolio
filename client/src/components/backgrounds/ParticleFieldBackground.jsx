import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 850;

const POINTS_VERTEX = `
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uPixelRatio;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aScale * uPixelRatio * (110.0 / max(-mvPosition.z, 1.0));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const POINTS_FRAGMENT = `
  varying vec3 vColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.05, dist) * 0.85;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const PALETTE = [
  new THREE.Color('#B8FF2E'), // Electric Volt
  new THREE.Color('#00F0FF'), // Cyan Glow
  new THREE.Color('#5B6CFF'), // Cobalt
  new THREE.Color('#A855F7'), // Violet
  new THREE.Color('#F4F6FB'), // Alabaster
];

function ParticleSystem({ pointerRef }) {
  const { viewport } = useThree();
  const pointsRef = useRef(null);

  const { geometry, material, basePositions, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const base = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const phaseArr = new Float32Array(PARTICLE_COUNT);
    const speedArr = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 6;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      base[i3] = x;
      base[i3 + 1] = y;
      base[i3 + 2] = z;

      // Weight toward cyan/cobalt/white with crisp volt accents
      const roll = Math.random();
      const color =
        roll < 0.14
          ? PALETTE[0]
          : roll < 0.42
            ? PALETTE[1]
            : roll < 0.68
              ? PALETTE[2]
              : roll < 0.86
                ? PALETTE[3]
                : PALETTE[4];

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      scales[i] = 0.65 + Math.random() * 1.45;
      phaseArr[i] = Math.random() * Math.PI * 2;
      speedArr[i] = 0.25 + Math.random() * 0.45;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: POINTS_VERTEX,
      fragmentShader: POINTS_FRAGMENT,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      geometry: geo,
      material: mat,
      basePositions: base,
      phases: phaseArr,
      speeds: speedArr,
    };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const posAttr = geometry.attributes.position;
    const arr = posAttr.array;

    const mouseWorldX = pointerRef.current.x * (viewport.width * 0.5);
    const mouseWorldY = pointerRef.current.y * (viewport.height * 0.5);
    const repelRadius = 2.6;
    const repelRadiusSq = repelRadius * repelRadius;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      const ph = phases[i];
      const sp = speeds[i];

      // Organic drift target
      const targetX = basePositions[i3] + Math.sin(t * sp + ph) * 0.45;
      const targetY = basePositions[i3 + 1] + Math.cos(t * sp * 0.85 + ph) * 0.45;
      const targetZ = basePositions[i3 + 2] + Math.sin(t * sp * 0.6 + ph) * 0.25;

      let cx = arr[i3] + (targetX - arr[i3]) * Math.min(1, dt * 3.2);
      let cy = arr[i3 + 1] + (targetY - arr[i3 + 1]) * Math.min(1, dt * 3.2);
      const cz = arr[i3 + 2] + (targetZ - arr[i3 + 2]) * Math.min(1, dt * 3.2);

      // Cursor radial repulsion
      if (pointerRef.current.active) {
        const dx = cx - mouseWorldX;
        const dy = cy - mouseWorldY;
        const distSq = dx * dx + dy * dy;

        if (distSq < repelRadiusSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / repelRadius) * 2.2;
          cx += (dx / dist) * force * dt * 11;
          cy += (dy / dist) * force * dt * 11;
        }
      }

      arr[i3] = cx;
      arr[i3 + 1] = cy;
      arr[i3 + 2] = cz;
    }

    posAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function ParticleFieldBackground({ className = '' }) {
  const glRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const onPointerMove = (e) => {
      pointerRef.current.x = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      pointerRef.current.y = -(e.clientY / Math.max(window.innerHeight, 1)) * 2 + 1;
      pointerRef.current.active = true;
    };

    const onMouseLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      glRef.current?.dispose();
      glRef.current = null;
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--bg-void)] ${className}`.trim()}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          glRef.current = gl;
        }}
      >
        <ParticleSystem pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}

