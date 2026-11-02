import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from '@/i18n';

/**
 * Decorative floating 3D icon with continuous silky-smooth floating animation,
 * ambient glow, breathing shadow, and RTL/LTR auto-mirroring.
 */
type Side = 'start' | 'end';

interface Floating3DProps {
  /** File name inside `public/3d/` */
  src: string;
  /** Logical side the icon is placed on (start = text side, end = opposite side). */
  side: Side;
  /** Positioning + size utilities, e.g. `absolute top-0 end-4 w-40`. */
  className?: string;
  /** Animation duration in seconds (defaults to ~3.5s for natural visible floating). */
  duration?: number;
  /** Animation delay in seconds. */
  delay?: number;
  /** Glow tint behind the icon. */
  glow?: 'cyan' | 'violet';
}

export default function Floating3D({
  src,
  side,
  className = '',
  duration = 3.6,
  delay = 0,
  glow = 'violet',
}: Floating3DProps) {
  const { dir } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const physical =
    dir === 'rtl' ? (side === 'start' ? 'right' : 'left') : side === 'start' ? 'left' : 'right';
  const flip = physical === 'left';

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '150px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animClass = flip ? 'float-3d-b' : 'float-3d-a';
  const animStyle: CSSProperties = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`floating-3d isolate pointer-events-none select-none transition-all ${
        visible ? 'is-visible' : ''
      } ${className}`}
    >
      {/* Soft ambient glow */}
      <div
        className={`absolute inset-[15%] -z-10 rounded-full blur-3xl transition-opacity duration-700 ${
          glow === 'cyan' ? 'bg-cyan/25' : 'bg-violet/30'
        }`}
      />

      <div className={animClass} style={animStyle}>
        <img
          src={`${import.meta.env.BASE_URL}3d/${src}`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block h-auto w-full drop-shadow-[0_25px_35px_rgba(76,60,200,0.35)] transition-transform duration-300"
          style={flip ? { transform: 'scaleX(-1)' } : undefined}
        />
      </div>

      {/* Ground shadow that breathes with the float */}
      <div className="float-3d-shadow" style={animStyle} />
    </div>
  );
}
