import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';

export interface ThreeContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  container: HTMLDivElement;
}

interface UseThreeSceneOptions {
  /** Called once after renderer/scene/camera are created. Build your scene
   *  graph here and return a cleanup function that disposes everything you
   *  allocated (geometries, materials, textures, event listeners). */
  setup: (ctx: ThreeContext) => (() => void) | void;
  /** Called every animation frame. Receives elapsed seconds and delta. */
  onFrame?: (ctx: ThreeContext, elapsed: number, delta: number) => void;
  /** Cap the device pixel ratio to protect perf on high-DPI displays. */
  maxPixelRatio?: number;
  /** Background is transparent by default so the page background shows. */
  alpha?: boolean;
}

/**
 * Owns the full lifecycle of a Three.js scene mounted into a container div:
 * renderer creation, resize handling (via ResizeObserver so it also reacts
 * to layout/CSS changes, not just window resizes), the render loop, and
 * teardown. Every consumer gets the same memory-safe pattern instead of
 * hand-rolling dispose logic per component.
 */
export function useThreeScene<T extends HTMLDivElement>(
  options: UseThreeSceneOptions
): RefObject<T> {
  const containerRef = useRef<T>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { setup, maxPixelRatio = 2, alpha = true } = optionsRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ctx: ThreeContext = { scene, camera, renderer, container };
    const teardownScene = setup(ctx);

    const clock = new THREE.Clock();
    let rafId = 0;
    let isVisible = true;

    const renderLoop = () => {
      rafId = requestAnimationFrame(renderLoop);
      if (!isVisible) return; // pause work when the tab/section is hidden
      const delta = clock.getDelta();
      optionsRef.current.onFrame?.(ctx, clock.elapsedTime, delta);
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(renderLoop);

    // Pause the render loop when the hero scrolls off-screen or the tab is
    // backgrounded — real GPU/battery savings on a page people scroll past.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && document.visibilityState === 'visible';
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      teardownScene?.();

      // Defensive full-scene disposal: walk the graph and free every
      // geometry/material/texture even if a consumer's own cleanup missed one.
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = (mesh as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach((m) => disposeMaterial(m));
        } else if (material) {
          disposeMaterial(material as THREE.Material);
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}

function disposeMaterial(material: THREE.Material) {
  const withMaps = material as THREE.Material & Record<string, unknown>;
  Object.values(withMaps).forEach((value) => {
    if (value instanceof THREE.Texture) value.dispose();
  });
  material.dispose();
}
