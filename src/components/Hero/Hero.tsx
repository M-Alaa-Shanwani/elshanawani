import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useTranslation } from '@/i18n';

export default function Hero() {
  const copyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay error:', err);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!copyRef.current) return;
    const items = copyRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(
      items,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-[100svh] w-full items-center overflow-hidden pt-16 pb-16"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover object-center"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Soft dark overlay */}
        <div className="absolute inset-0 bg-ink-950/40 dark:bg-black/50 transition-colors duration-300" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent pointer-events-none" />
      </div>

      <div className="absolute inset-0 bg-blueprint-grid bg-blueprint opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" />

      <div ref={copyRef} className="section-shell relative z-20 w-full pointer-events-none">
        <p data-reveal className="eyebrow mb-4 text-[10px] leading-relaxed sm:mb-6 sm:text-xs">
          {t('hero.eyebrow')}
        </p>
        <h1
          data-reveal
          className="max-w-3xl text-[clamp(1.85rem,7vw,4.75rem)] font-semibold leading-[1.1] text-text sm:leading-[1.05]"
        >
          {t('hero.headline_1')}
          <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
            {t('hero.headline_highlight')}
          </span>
        </h1>
        <p data-reveal className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:mt-6 sm:text-base md:text-lg">
          {t('hero.subtitle')}
        </p>
        <div data-reveal className="pointer-events-auto mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a href="#contact" className="btn-primary w-full justify-center sm:w-auto">
            {t('hero.cta_primary')}
          </a>
          <a href="#services" className="btn-ghost w-full justify-center sm:w-auto">
            {t('hero.cta_secondary')}
          </a>
        </div>
      </div>
    </section>
  );
}
