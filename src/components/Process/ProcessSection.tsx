import { useState, useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTranslation, type TranslationKey } from '@/i18n';

interface ProcessStep {
  number: string;
  tabLabelKey: { ar: string; en: string };
  titleKey: TranslationKey;
  descKey: TranslationKey;
  accent: 'cyan' | 'fuchsia' | 'amber' | 'emerald';
  badgeColor: string;
  borderColor: string;
  glowColor: string;
  tags: string[];
  icon: JSX.Element;
}

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const { t, lang } = useTranslation();
  const isAr = lang === 'ar';

  const steps: ProcessStep[] = [
    {
      number: '01',
      tabLabelKey: { ar: 'المعمارية', en: 'Architecture' },
      titleKey: 'process.step1.title',
      descKey: 'process.step1.desc',
      accent: 'cyan',
      badgeColor: 'text-cyan bg-cyan/15 border-cyan/40',
      borderColor: 'group-hover:border-cyan/60',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(94,235,255,0.15)]',
      tags: ['Clean Architecture', 'Domain-Driven Design', 'DB Modeling'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      number: '02',
      tabLabelKey: { ar: 'التصميم UI/UX', en: 'UI/UX Design' },
      titleKey: 'process.step2.title',
      descKey: 'process.step2.desc',
      accent: 'fuchsia',
      badgeColor: 'text-fuchsia-400 bg-fuchsia-500/15 border-fuchsia-500/40',
      borderColor: 'group-hover:border-fuchsia-500/60',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(232,48,144,0.15)]',
      tags: ['Figma Prototypes', 'Design System', 'Pixel-Perfect'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
    },
    {
      number: '03',
      tabLabelKey: { ar: 'البرمجة', en: 'Development' },
      titleKey: 'process.step3.title',
      descKey: 'process.step3.desc',
      accent: 'amber',
      badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
      borderColor: 'group-hover:border-amber-500/60',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      tags: ['.NET & Angular / React', 'APIs & Webhooks', 'Payment Gateways'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      ),
    },
    {
      number: '04',
      tabLabelKey: { ar: 'الجودة والنشر', en: 'QA & Deploy' },
      titleKey: 'process.step4.title',
      descKey: 'process.step4.desc',
      accent: 'emerald',
      badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
      borderColor: 'group-hover:border-emerald-500/60',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      tags: ['Automated Tests', 'CI/CD Pipelines', 'Zero Downtime'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('[data-process-card]');
    if (cards.length === 0) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          cards,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      },
    });
    return () => trigger.kill();
  }, []);

  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;
    const el = mobileSliderRef.current;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const cardWidth = card.offsetWidth + 14;
    const scrollLeft = Math.abs(el.scrollLeft);
    const newIdx = Math.min(Math.round(scrollLeft / cardWidth), steps.length - 1);
    if (newIdx !== activeStepIdx) {
      setActiveStepIdx(newIdx);
    }
  };

  const scrollToStep = (index: number) => {
    if (!mobileSliderRef.current) return;
    const el = mobileSliderRef.current;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const cardWidth = card.offsetWidth + 14;
    const isRtl = isAr;
    el.scrollTo({
      left: isRtl ? -index * cardWidth : index * cardWidth,
      behavior: 'smooth',
    });
    setActiveStepIdx(index);
  };

  return (
    <section id="process" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan/10 via-violet/10 to-emerald-500/10 blur-3xl pointer-events-none -z-10 opacity-60" />

      <div className="section-shell relative z-10">
        {/* Section Header */}
        <div className="text-center sm:text-start max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-violet tracking-wider uppercase backdrop-blur-md sm:px-3 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
            {t('process.eyebrow')}
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:mt-4 sm:text-3xl md:text-4xl">
            {t('process.title')}
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs xs:text-sm sm:text-base text-text-muted leading-relaxed">
            {t('process.subtitle')}
          </p>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP VIEW (md and up): Original 4-Column Grid Layout  */}
        {/* ======================================================== */}
        <div className="mt-10 sm:mt-16 hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              data-process-card
              className={`group relative flex flex-1 flex-col justify-between rounded-2xl sm:rounded-3xl border border-ink-600/70 bg-ink-950/70 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-ink-900/85 ${step.borderColor} ${step.glowColor}`}
            >
              <div>
                {/* Step Header: Icon + Number */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border ${step.badgeColor} transition-transform duration-300 group-hover:scale-110`}>
                    <span className="[&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
                      {step.icon}
                    </span>
                  </div>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-text-dim/40 transition-colors duration-300 group-hover:text-text/70">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 sm:mt-6 text-base sm:text-xl font-bold tracking-tight text-text transition-colors duration-200 group-hover:text-white">
                  {t(step.titleKey)}
                </h3>

                {/* Description */}
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-text-muted leading-relaxed">
                  {t(step.descKey)}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-ink-800/80 flex flex-wrap gap-1.5">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    dir="ltr"
                    className="inline-block rounded-md border border-ink-700/60 bg-ink-900/60 px-2 py-0.5 sm:py-1 font-mono text-[10px] text-text-dim transition-colors duration-200 group-hover:text-text-muted group-hover:border-ink-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* MOBILE VIEW (below md): Interactive Step Slider / Wizard */}
        {/* ======================================================== */}
        <div className="mt-7 block md:hidden">
          {/* Quick Step Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            {steps.map((step, idx) => (
              <button
                key={`step-tab-${step.number}`}
                type="button"
                onClick={() => scrollToStep(idx)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs shrink-0 whitespace-nowrap transition-all duration-300 ${
                  activeStepIdx === idx
                    ? 'border border-cyan/60 bg-cyan/15 text-cyan font-semibold shadow-glow'
                    : 'border border-ink-700/70 bg-ink-900/60 text-text-muted hover:border-ink-600'
                }`}
              >
                <span className="font-bold text-[10px]">{step.number}</span>
                <span>{isAr ? step.tabLabelKey.ar : step.tabLabelKey.en}</span>
              </button>
            ))}
          </div>

          {/* Swipeable Step Cards */}
          <div
            ref={mobileSliderRef}
            onScroll={handleMobileScroll}
            className="mt-3 flex gap-3.5 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-3 pt-1 scroll-smooth"
          >
            {steps.map((step) => (
              <div
                key={`m-step-${step.number}`}
                className="w-[85vw] max-w-[325px] shrink-0 snap-center rounded-2xl border border-ink-600/80 bg-ink-950/85 p-5 backdrop-blur-xl flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${step.badgeColor}`}>
                      <span className="[&>svg]:h-5 [&>svg]:w-5">
                        {step.icon}
                      </span>
                    </div>
                    <span className="font-mono text-2xl font-black text-text-dim/50">
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3.5 text-base font-bold tracking-tight text-text">
                    {t(step.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs text-text-muted leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-4 pt-3.5 border-t border-ink-800/80 flex flex-wrap gap-1">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      dir="ltr"
                      className="inline-block rounded border border-ink-700/70 bg-ink-900/70 px-2 py-0.5 font-mono text-[9px] text-text-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Step Navigation Bar */}
          <div className="mt-3.5 flex items-center justify-between px-1 text-text-dim font-mono text-xs">
            <button
              type="button"
              disabled={activeStepIdx === 0}
              onClick={() => scrollToStep(activeStepIdx - 1)}
              className={`flex items-center gap-1 text-[11px] transition-colors ${
                activeStepIdx === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'text-cyan hover:text-cyan/80 active:scale-95'
              }`}
            >
              <span className="text-sm rtl:rotate-180">←</span>
              <span>{isAr ? 'السابقة' : 'Previous'}</span>
            </button>

            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, dotIdx) => (
                <button
                  key={`dot-step-${dotIdx}`}
                  type="button"
                  onClick={() => scrollToStep(dotIdx)}
                  aria-label={`Go to step ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeStepIdx === dotIdx
                      ? 'w-6 bg-violet shadow-glow'
                      : 'w-1.5 bg-ink-700 hover:bg-ink-600'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={activeStepIdx === steps.length - 1}
              onClick={() => scrollToStep(activeStepIdx + 1)}
              className={`flex items-center gap-1 text-[11px] transition-colors ${
                activeStepIdx === steps.length - 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'text-cyan hover:text-cyan/80 active:scale-95'
              }`}
            >
              <span>{isAr ? 'التالية' : 'Next'}</span>
              <span className="text-sm rtl:rotate-180">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
