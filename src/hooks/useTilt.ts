import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * Drives a lightweight CSS 3D tilt on hover using GSAP's quickTo (which
 * batches transform writes to the next animation frame). Deliberately
 * avoids mounting a WebGL context per card — four extra renderers for a
 * hover effect would cost far more GPU/memory than it's worth; a real
 * perspective transform reads the same to the eye at this scale.
 */
export function useTilt<T extends HTMLElement>(intensity = 10) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return; // skip on touch

    const rotateX = gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power3.out' });
    const rotateY = gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power3.out' });
    const translateZ = gsap.quickTo(el, 'z', { duration: 0.4, ease: 'power3.out' });

    gsap.set(el, { transformPerspective: 800, transformStyle: 'preserve-3d' });

    const onMove = (event: PointerEvent) => {
      const bounds = el.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width - 0.5;
      const py = (event.clientY - bounds.top) / bounds.height - 0.5;
      rotateY(px * intensity);
      rotateX(-py * intensity);
      translateZ(12);
    };
    const onLeave = () => {
      rotateY(0);
      rotateX(0);
      translateZ(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [intensity]);

  return ref;
}
