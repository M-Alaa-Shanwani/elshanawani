import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from '@/i18n';

/**
 * Decorative floating 3D icon.
 *
 * All source images are rendered "leaning inward from the left", i.e. they are
 * designed to sit on the RIGHT side of a layout. When the icon ends up on the
 * physical LEFT side (because of `side` + the current text direction), the image
 * is mirrored so it always leans toward the content.
 *
 * Positioning / sizing is fully controlled by the caller through `className`
 * (use logical utilities like `start-*` / `end-*` so it adapts to RTL/LTR).
 */
type Side = 'start' | 'end';

interface Floating3DProps {
  /** File name inside `public/3d/` */
  src: string;
  /** Logical side the icon is placed on (start = text side, end = opposite side). */
  side: Side;
  /** Positioning + size utilities, e.g. `absolute top-0 end-4 w-40`. */
  className?: string;
  /** Full float cycle in seconds. */
  duration?: number;
  /** Animation delay in seconds (de-syncs multiple icons). */
  delay?: number;
  /** Vertical travel in px. */
  distance?: number;
  /** Max rotation in degrees during the float (auto-mirrored when flipped). */
  tilt?: number;
  /** Glow tint behind the icon. */
  glow?: 'cyan' | 'violet';
}

export default function Floating3D({
  src,
  side,
  className = '',
  duration = 6,
  delay = 0,
  distance = 16,
  tilt = 3,
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
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const floatVars = {
    '--float-duration': `${duration}s`,
    '--float-delay': `${delay}s`,
    '--float-distance': `${-Math.abs(distance)}px`,
    '--float-rotate': `${flip ? -tilt : tilt}deg`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`floating-3d isolate pointer-events-none select-none ${visible ? 'is-visible' : ''} ${className}`}
    >
      {/* Soft ambient glow */}
      <div
        className={`absolute inset-[18%] -z-10 rounded-full blur-3xl ${
          glow === 'cyan' ? 'bg-cyan/25' : 'bg-violet/30'
        }`}
      />

      <div className="float-3d" style={floatVars}>
        <img
          src={`${import.meta.env.BASE_URL}3d/${src}`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block h-auto w-full drop-shadow-[0_25px_35px_rgba(76,60,200,0.35)]"
          style={flip ? { transform: 'scaleX(-1)' } : undefined}
        />
      </div>

      {/* Ground shadow that breathes with the float */}
      <div className="float-3d-shadow" style={floatVars} />
    </div>
  );
}
