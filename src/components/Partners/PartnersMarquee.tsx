import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTranslation } from '@/i18n';

interface LogoItem {
  id: string;
  name: string;
  src: string;
}

// Track 1: 6 logos
const ROW_1: LogoItem[] = [
  { id: '1', name: 'MADAR OS', src: `${import.meta.env.BASE_URL}logos/projects/madar.svg` },
  { id: '2', name: 'Sabk Al-Jusore', src: `${import.meta.env.BASE_URL}logos/projects/sabk-aljusore.svg` },
  { id: '3', name: 'Fintech Platform', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-02.png` },
  { id: '4', name: 'Retail App', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-03.png` },
  { id: '5', name: 'Logistics System', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-04.png` },
  { id: '6', name: 'E-Commerce Solution', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-05.png` },
];

// Track 2: 5 logos
const ROW_2: LogoItem[] = [
  { id: '7', name: 'Enterprise Portal', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-06.png` },
  { id: '8', name: 'Health Platform', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-07.png` },
  { id: '9', name: 'SaaS Dashboard', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-08.png` },
  { id: '10', name: 'Smart System', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-09.png` },
  { id: '11', name: 'Digital Services', src: `${import.meta.env.BASE_URL}logos/projects/project-logo-10.png` },
];

export default function PartnersMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useTranslation();
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!sectionRef.current) return;
    const header = sectionRef.current.querySelector('[data-marquee-reveal]');
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (header) {
          gsap.fromTo(
            header,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
          );
        }
      },
    });
    return () => trigger.kill();
  }, []);

  // Repeat rows 4 times so marquee flows seamlessly on wide screens
  const row1Repeated = [...ROW_1, ...ROW_1, ...ROW_1, ...ROW_1];
  const row2Repeated = [...ROW_2, ...ROW_2, ...ROW_2, ...ROW_2];

  return (
    <section
      id="partners"
      ref={sectionRef}
      className="relative overflow-hidden py-14 sm:py-24 md:py-28"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[360px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan/10 via-violet/15 to-cyan/10 opacity-60 blur-3xl" />

      <div className="section-shell relative z-10 mb-8 sm:mb-14">
        {/* Section Header */}
        <div data-marquee-reveal className="max-w-3xl text-center sm:text-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan backdrop-blur-md sm:px-3 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
            {isAr ? 'سجل الأعمال والشراكات' : 'Track Record & Projects'}
          </div>
          <h2 className="mt-3 text-xl xs:text-2xl font-bold leading-[1.2] tracking-tight text-text sm:mt-3.5 sm:text-3xl md:text-5xl sm:leading-[1.15]">
            {isAr ? (
              <>
                مشاريع وعلامات تجارية{' '}
                <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                  تشرفت بتطويرها والمساهمة فيها
                </span>
              </>
            ) : (
              <>
                Projects & Brands I've{' '}
                <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                  Architected, Built, or Contributed To
                </span>
              </>
            )}
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs xs:text-sm leading-relaxed text-text-muted sm:text-base">
            {isAr
              ? 'مجموعة من الأنظمة الإدارية، المتاجر الإلكترونية، المنصات الخدمية، والعلامات التجارية التي قمت بهندستها وتطويرها بالكامل أو المساهمة في برمجتها وإطلاقها بنجاح.'
              : 'A curated showcase of enterprise platforms, management systems, e-commerce stores, and digital products I built end-to-end or contributed to in production.'}
          </p>
        </div>
      </div>

      {/* Marquee Rails with Gradient Edge Fade */}
      <div
        dir="ltr"
        className="pause-on-hover relative flex flex-col gap-3 sm:gap-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {/* Track 1: scrolling left */}
        <div className="animate-marquee flex gap-3 sm:gap-6">
          {row1Repeated.map((item, idx) => (
            <div
              key={`row1-${item.id}-${idx}`}
              className="group flex h-16 w-32 xs:h-20 xs:w-40 sm:h-28 sm:w-56 shrink-0 items-center justify-center rounded-xl xs:rounded-2xl sm:rounded-3xl border border-ink-600/70 bg-ink-900/60 p-2.5 xs:p-3.5 sm:p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:bg-ink-800/90 hover:shadow-glow"
            >
              <img
                src={item.src}
                alt={item.name}
                loading="lazy"
                className="max-h-8 max-w-[90px] xs:max-h-10 xs:max-w-[125px] sm:max-h-16 sm:max-w-[170px] object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
              />
            </div>
          ))}
        </div>

        {/* Track 2: scrolling right (reverse) */}
        <div className="animate-marquee-reverse flex gap-3 sm:gap-6">
          {row2Repeated.map((item, idx) => (
            <div
              key={`row2-${item.id}-${idx}`}
              className="group flex h-16 w-32 xs:h-20 xs:w-40 sm:h-28 sm:w-56 shrink-0 items-center justify-center rounded-xl xs:rounded-2xl sm:rounded-3xl border border-ink-600/70 bg-ink-900/60 p-2.5 xs:p-3.5 sm:p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet/50 hover:bg-ink-800/90 hover:shadow-glow-violet"
            >
              <img
                src={item.src}
                alt={item.name}
                loading="lazy"
                className="max-h-8 max-w-[90px] xs:max-h-10 xs:max-w-[125px] sm:max-h-16 sm:max-w-[170px] object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Bottom Trust Badge */}
      <div className="section-shell mt-6 sm:mt-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink-700/60 bg-ink-950/80 px-3 py-1.5 xs:px-4 xs:py-2 font-mono text-[10px] xs:text-xs text-text-muted backdrop-blur-md">
          <span className="flex h-1.5 w-1.5 xs:h-2 xs:w-2 rounded-full bg-emerald-400" />
          <span>
            {isAr
              ? 'أكثر من 11 منصة وعلامة تجارية تم تنفيذها والمساهمة في نجاحها'
              : '11+ Production systems & brand platforms shipped or contributed to'}
          </span>
        </div>
      </div>
    </section>
  );
}
