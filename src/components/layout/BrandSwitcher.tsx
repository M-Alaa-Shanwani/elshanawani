import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';

interface BrandSwitcherProps {
  onClick?: () => void;
}

export default function BrandSwitcher({ onClick }: BrandSwitcherProps) {
  const { t, lang } = useTranslation();
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);
  const safetyRef = useRef<number | null>(null);

  // Alternates between Name view and Frameless 3D Character view:
  // Name displays for ~3.5s -> transitions to Character (video) -> plays waving animation to end ->
  // brief pause -> transitions back to Name for ~3.5s -> repeats continuously.
  useEffect(() => {
    if (!showVideo) {
      if (safetyRef.current) clearTimeout(safetyRef.current);
      timerRef.current = window.setTimeout(() => {
        setShowVideo(true);
      }, 3500);
    } else {
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Fallback in case of browser strict autoplay restrictions
            timerRef.current = window.setTimeout(() => setShowVideo(false), 4000);
          });
        }
      }
      // Safety guard: video is ~10s long; if onEnded event doesn't fire, auto-swap after 11.5s
      safetyRef.current = window.setTimeout(() => {
        setShowVideo(false);
      }, 11500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (safetyRef.current) clearTimeout(safetyRef.current);
    };
  }, [showVideo]);

  const handleVideoEnded = () => {
    if (safetyRef.current) clearTimeout(safetyRef.current);
    timerRef.current = window.setTimeout(() => {
      setShowVideo(false);
    }, 450);
  };

  return (
    <a
      href="#hero"
      onClick={onClick}
      className="group relative flex h-11 sm:h-13 items-center select-none"
      title={lang === 'ar' ? 'محمد علاء — المطور والمصمم' : 'Mohamed Alaa — Developer & Designer'}
    >
      {/* 1. Name View */}
      <div
        className={`flex items-center transition-all duration-500 ease-out ${
          showVideo
            ? 'pointer-events-none scale-90 opacity-0 -translate-y-1 absolute start-0'
            : 'scale-100 opacity-100 translate-y-0 relative'
        }`}
      >
        <span className="font-display text-base font-bold tracking-tight text-text sm:text-lg transition-colors group-hover:text-cyan">
          {t('nav.brand')}
          <span className="text-cyan animate-pulse">.</span>
        </span>
      </div>

      {/* 2. Seamless 3D Character View - frameless, natural blend (no circle, no border) */}
      <div
        className={`flex items-center transition-all duration-500 ease-out ${
          showVideo
            ? 'scale-100 opacity-100 translate-y-0 relative'
            : 'pointer-events-none scale-90 opacity-0 translate-y-1 absolute start-0'
        }`}
      >
        <div className="relative h-11 sm:h-13 w-auto flex items-center justify-center overflow-visible">
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}brand-video.mp4`}
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            className="h-full w-auto max-w-[95px] sm:max-w-[120px] object-contain object-center mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none select-none transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    </a>
  );
}
