import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uMouseEnergy;

  varying vec2 vUv;

  // 2D Simplex-like hash & gradient noise
  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      value += amp * noise(p);
      p = rot * p * 2.02;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 st = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 mouseSt = (uMouse - 0.5) * vec2(aspect, 1.0);

    // Interactive radial liquid distortion around cursor
    float dist = length(st - mouseSt);
    float pull = exp(-dist * 2.8) * (0.35 + uMouseEnergy * 0.55);
    vec2 dir = normalize(st - mouseSt + 0.0001);
    vec2 warpedSt = st - dir * pull * 0.16;

    float t = uTime * 0.16;
    vec2 q = vec2(fbm(warpedSt * 1.45 + vec2(t, t * 0.7)),
                  fbm(warpedSt * 1.45 + vec2(5.2 - t * 0.6, 1.3)));
    vec2 r = vec2(fbm(warpedSt * 1.6 + 2.2 * q + vec2(1.7, 9.2) + t * 0.45),
                  fbm(warpedSt * 1.6 + 2.2 * q + vec2(8.3, 2.8) - t * 0.38));

    float f = fbm(warpedSt * 1.3 + 2.1 * r);
    float liquid = clamp(f * 0.5 + 0.5, 0.0, 1.0);

    // Palette matching design system
    vec3 colVoid = vec3(0.0235, 0.0275, 0.0431);   // #06070B
    vec3 colCobalt = vec3(0.11, 0.14, 0.36);       // deep cobalt
    vec3 colCyan = vec3(0.0, 0.941, 1.0);          // #00F0FF
    vec3 colViolet = vec3(0.659, 0.333, 0.969);    // #A855F7
    vec3 colVolt = vec3(0.722, 1.0, 0.18);         // #B8FF2E

    vec3 color = mix(colVoid, colCobalt, smoothstep(0.25, 0.75, liquid) * 0.55);
    color = mix(color, colViolet * 0.32, smoothstep(0.45, 0.92, dot(q, r) * 0.5 + 0.5));
    color = mix(color, colCyan * 0.28, smoothstep(0.55, 0.96, length(r)) * 0.75);

    // Subtle electric volt liquid highlight near cursor
    float cursorHalo = exp(-dist * 3.4) * (0.28 + uMouseEnergy * 0.45);
    color += colVolt * cursorHalo * (0.14 + 0.16 * liquid);
    color += colCyan * exp(-dist * 2.1) * 0.06;

    // Gentle vignette to keep center text super legible
    float vignette = 1.0 - smoothstep(0.45, 1.45, length(st));
    color *= mix(0.62, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ShaderLiquidBackground({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(0.65);
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseEnergy: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    let lastMouseX = 0.5;
    let lastMouseY = 0.5;
    let mouseEnergy = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(rect.width, 1);
      const ny = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
      targetMouse.set(
        THREE.MathUtils.clamp(nx, 0, 1),
        THREE.MathUtils.clamp(ny, 0, 1)
      );
      const speed = Math.hypot(targetMouse.x - lastMouseX, targetMouse.y - lastMouseY);
      lastMouseX = targetMouse.x;
      lastMouseY = targetMouse.y;
      mouseEnergy = Math.min(1, mouseEnergy + speed * 4.5);
    };

    const onResize = () => {
      const nextW = container.clientWidth || window.innerWidth;
      const nextH = container.clientHeight || window.innerHeight;
      renderer.setPixelRatio(0.65);
      renderer.setSize(nextW, nextH);
      uniforms.uResolution.value.set(nextW, nextH);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    let rafId = 0;
    let prevTime = performance.now();

    const animate = (now) => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) {
        prevTime = now;
        return;
      }

      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      uniforms.uTime.value += dt;
      uniforms.uMouse.value.lerp(targetMouse, 0.18);
      mouseEnergy *= 0.94;
      uniforms.uMouseEnergy.value = mouseEnergy;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      scene.remove(quad);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`.trim()}
    />
  );
}

