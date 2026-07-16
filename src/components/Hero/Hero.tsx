import { useEffect, useRef } from 'react';
import HeroScene from './HeroScene';
import OrbScene from './OrbScene';
import { gsap } from '@/lib/gsap';
import { useTranslation } from '@/i18n';

export default function Hero() {
  const copyRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden pt-16 pb-20 sm:pb-16"
    >
      <div className="absolute inset-0 bg-blueprint-grid bg-blueprint opacity-40" />
      <div className="absolute inset-0 bg-grid-fade" />
      <OrbScene />
      <HeroScene />

      <div ref={copyRef} className="section-shell relative z-10 w-full pointer-events-none">
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

      <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[10px] text-text-dim sm:bottom-8 sm:block sm:text-xs">
        {t('hero.scroll')}
      </div>
    </section>
  );
}
