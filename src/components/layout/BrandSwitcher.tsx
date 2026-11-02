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

  // Alternates between Name view and Video view in an infinite loop:
  // Name displays for ~3.5s -> transitions to Video -> Video plays to end (approx 10s) ->
  // brief pause -> transitions back to Name for ~3.5s -> repeats.
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
    // When video completes, switch back to name after a brief grace moment
    timerRef.current = window.setTimeout(() => {
      setShowVideo(false);
    }, 450);
  };

  return (
    <a
      href="#hero"
      onClick={onClick}
      className="group relative flex h-10 items-center select-none"
      title={lang === 'ar' ? 'محمد علاء — المطور والمصمم' : 'Mohamed Alaa — Developer & Designer'}
    >
      {/* 1. Name View */}
      <div
        className={`flex items-center transition-all duration-500 ease-out ${
          showVideo
            ? 'pointer-events-none scale-90 opacity-0 -translate-y-2 absolute start-0'
            : 'scale-100 opacity-100 translate-y-0 relative'
        }`}
      >
        <span className="font-display text-base font-bold tracking-tight text-text sm:text-lg transition-colors group-hover:text-cyan">
          {t('nav.brand')}
          <span className="text-cyan animate-pulse">.</span>
        </span>
      </div>

      {/* 2. Video View */}
      <div
        className={`flex items-center transition-all duration-500 ease-out ${
          showVideo
            ? 'scale-100 opacity-100 translate-y-0 relative'
            : 'pointer-events-none scale-90 opacity-0 translate-y-2 absolute start-0'
        }`}
      >
        <div className="relative h-8.5 sm:h-9.5 aspect-video overflow-hidden rounded-xl border border-cyan/60 bg-black shadow-[0_0_20px_-3px_rgba(94,235,255,0.4)] ring-1 ring-cyan/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_28px_-2px_rgba(94,235,255,0.65)]">
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}brand-video.mp4`}
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            className="h-full w-full object-cover object-center"
          />
          {/* Subtle live indicator pulse */}
          <span className="absolute top-1 end-1 flex h-1.5 w-1.5 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan" />
          </span>
        </div>
      </div>
    </a>
  );
}
