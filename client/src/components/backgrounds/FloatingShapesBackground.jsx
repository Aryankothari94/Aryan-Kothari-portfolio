import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function ShapesScene({ scrollYRef }) {
  const groupRef = useRef(null);
  const torusRef = useRef(null);
  const icoRef = useRef(null);
  const wireIcoRef = useRef(null);
  const ringRef = useRef(null);
  const smoothedScroll = useRef(0);

  const assets = useMemo(() => {
    const torusGeo = new THREE.TorusGeometry(1.35, 0.34, 24, 72);
    const icoGeo = new THREE.IcosahedronGeometry(1.15, 0);
    const wireIcoGeo = new THREE.IcosahedronGeometry(1.45, 0);
    const ringGeo = new THREE.TorusGeometry(0.85, 0.035, 16, 64);

    const torusMat = new THREE.MeshStandardMaterial({
      color: '#111626',
      metalness: 0.78,
      roughness: 0.22,
      emissive: '#071624',
      emissiveIntensity: 0.5,
    });

    const icoMat = new THREE.MeshStandardMaterial({
      color: '#141728',
      metalness: 0.72,
      roughness: 0.25,
      flatShading: true,
      emissive: '#190c2e',
      emissiveIntensity: 0.45,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: '#B8FF2E',
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    const ringMat = new THREE.MeshBasicMaterial({
      color: '#00F0FF',
      transparent: true,
      opacity: 0.38,
    });

    return {
      geometries: [torusGeo, icoGeo, wireIcoGeo, ringGeo],
      materials: [torusMat, icoMat, wireMat, ringMat],
      torusGeo,
      icoGeo,
      wireIcoGeo,
      ringGeo,
      torusMat,
      icoMat,
      wireMat,
      ringMat,
    };
  }, []);

  useEffect(() => {
    return () => {
      assets.geometries.forEach((g) => g.dispose());
      assets.materials.forEach((m) => m.dispose());
    };
  }, [assets]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Smooth scroll parallax without layout thrashing
    const targetScroll = scrollYRef.current;
    smoothedScroll.current += (targetScroll - smoothedScroll.current) * Math.min(1, dt * 6);
    const scrollProgress = smoothedScroll.current * 0.0014;

    if (groupRef.current) {
      groupRef.current.position.y = scrollProgress * 1.35;
      groupRef.current.rotation.x = scrollProgress * 0.14;
    }

    if (torusRef.current) {
      torusRef.current.rotation.x += dt * 0.18;
      torusRef.current.rotation.y += dt * 0.24;
      torusRef.current.position.y = 1.15 - scrollProgress * 0.85;
    }

    if (icoRef.current) {
      icoRef.current.rotation.y -= dt * 0.22;
      icoRef.current.rotation.z += dt * 0.14;
      icoRef.current.position.y = -1.25 + scrollProgress * 1.1;
    }

    if (wireIcoRef.current) {
      wireIcoRef.current.rotation.y -= dt * 0.14;
      wireIcoRef.current.rotation.x += dt * 0.11;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += dt * 0.28;
      ringRef.current.rotation.x = 1.1 + scrollProgress * 0.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 6, 5]} intensity={1.8} color="#00F0FF" />
      <directionalLight position={[-6, -4, 3]} intensity={1.4} color="#A855F7" />
      <pointLight position={[3, 2, 4]} intensity={2.2} color="#B8FF2E" distance={14} />

      <group ref={groupRef}>
        {/* Primary Torus (upper right) */}
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.45}>
          <mesh
            ref={torusRef}
            geometry={assets.torusGeo}
            material={assets.torusMat}
            position={[3.6, 1.15, -1.6]}
            rotation={[0.5, 0.3, 0]}
          />
        </Float>

        {/* Companion Neon Ring around Torus */}
        <mesh
          ref={ringRef}
          geometry={assets.ringGeo}
          material={assets.ringMat}
          position={[3.6, 1.15, -1.6]}
          scale={1.85}
        />

        {/* Primary Icosahedron + Neon Wireframe Halo (lower left) */}
        <Float speed={1.15} rotationIntensity={0.3} floatIntensity={0.55}>
          <group position={[-3.7, -1.25, -1.2]}>
            <mesh ref={icoRef} geometry={assets.icoGeo} material={assets.icoMat} />
            <mesh ref={wireIcoRef} geometry={assets.wireIcoGeo} material={assets.wireMat} />
          </group>
        </Float>
      </group>
    </>
  );
}

export default function FloatingShapesBackground({ className = '' }) {
  const glRef = useRef(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
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
        camera={{ position: [0, 0, 8], fov: 46, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          glRef.current = gl;
        }}
      >
        <ShapesScene scrollYRef={scrollYRef} />
      </Canvas>
    </div>
  );
}

