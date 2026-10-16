import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTranslation } from '@/i18n';
import { TechIcon } from './techIcons';

export interface Tool {
  name: string;
}

const allTools: Tool[] = [
  // Backend & Architecture
  { name: '.NET' },
  { name: 'C#' },
  { name: 'ABP.io' },
  { name: 'EF Core' },
  { name: 'PostgreSQL' },
  { name: 'SQL Server' },
  { name: 'Redis' },
  { name: 'RabbitMQ' },
  { name: 'Docker' },
  { name: 'Git' },

  // Frontend & Web
  { name: 'Angular' },
  { name: 'React' },
  { name: 'TypeScript' },
  { name: 'JavaScript' },
  { name: 'Tailwind CSS' },
  { name: 'HTML5' },
  { name: 'CSS3' },
  { name: 'Redux' },
  { name: 'RxJS' },
  { name: 'Sass' },

  // UI/UX & Design
  { name: 'Figma' },
  { name: 'Adobe XD' },
  { name: 'Design Systems' },
  { name: 'Prototyping' },
  { name: 'Wireframing' },
  { name: 'User Research' },

  // QA & Testing
  { name: 'Playwright' },
  { name: 'Cypress' },
  { name: 'xUnit' },
  { name: 'GitHub Actions' },
  { name: 'CI/CD Pipelines' },
  { name: 'Load Testing k6' },
  { name: 'Selenium' },
  { name: 'Postman' },
];

// 3 rows for mobile marquee slider
const ROW_1: Tool[] = [
  { name: '.NET' },
  { name: 'C#' },
  { name: 'ABP.io' },
  { name: 'EF Core' },
  { name: 'PostgreSQL' },
  { name: 'SQL Server' },
  { name: 'Redis' },
  { name: 'RabbitMQ' },
  { name: 'Docker' },
  { name: 'Git' },
];

const ROW_2: Tool[] = [
  { name: 'Angular' },
  { name: 'React' },
  { name: 'TypeScript' },
  { name: 'JavaScript' },
  { name: 'Tailwind CSS' },
  { name: 'Figma' },
  { name: 'Design Systems' },
  { name: 'Redux' },
  { name: 'RxJS' },
  { name: 'HTML5' },
];

const ROW_3: Tool[] = [
  { name: 'Playwright' },
  { name: 'Cypress' },
  { name: 'xUnit' },
  { name: 'GitHub Actions' },
  { name: 'CI/CD Pipelines' },
  { name: 'Load Testing k6' },
  { name: 'Postman' },
  { name: 'Adobe XD' },
  { name: 'Prototyping' },
  { name: 'CSS3' },
];

export default function ServicesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!sectionRef.current) return;
    const badges = sectionRef.current.querySelectorAll('[data-badge]');
    if (badges.length === 0) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(
          badges,
          { y: 25, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.02,
            ease: 'power3.out',
          }
        );
      },
      once: true,
    });
    return () => trigger.kill();
  }, []);

  const row1Repeated = [...ROW_1, ...ROW_1, ...ROW_1];
  const row2Repeated = [...ROW_2, ...ROW_2, ...ROW_2];
  const row3Repeated = [...ROW_3, ...ROW_3, ...ROW_3];

  return (
    <section id="services" className="relative py-20 sm:py-28 md:py-32 overflow-hidden">
      {/* Seamless blend from Hero black into subtle ambient color glow */}
      <div className="absolute top-0 left-0 right-0 h-40 sm:h-56 pointer-events-none z-0 bg-gradient-to-b from-[#05070C] via-[#05070C]/80 to-transparent" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-b from-cyan/10 via-violet/10 to-transparent blur-3xl pointer-events-none -z-10 opacity-60" />

      <div className="section-shell relative z-10">
        {/* Section Header */}
        <div className="text-center sm:text-start max-w-3xl">
          <p className="eyebrow">{t('services.eyebrow')}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:mt-4 sm:text-3xl md:text-4xl">
            {t('services.title')}
          </h2>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP VIEW (sm and up): 100% Original Badges Spread     */}
        {/* ======================================================== */}
        <div
          ref={sectionRef}
          className="mt-10 sm:mt-14 hidden sm:flex flex-wrap items-center justify-start gap-3 sm:gap-3.5 md:gap-4"
        >
          {allTools.map((tool) => (
            <div
              key={tool.name}
              data-badge
              dir="ltr"
              className="group flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-ink-600/70 bg-ink-950/70 px-4 py-2.5 sm:px-4.5 sm:py-3 text-text backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-cyan/70 hover:bg-ink-900/90 hover:text-cyan hover:shadow-glow cursor-default select-none"
            >
              <TechIcon
                name={tool.name}
                className="h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0 transition-transform duration-200 group-hover:scale-110"
              />
              <span className="font-mono text-xs sm:text-sm font-medium tracking-tight text-text/90 group-hover:text-cyan">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE VIEW (below sm): 3-Row Infinite Marquee Slider    */}
      {/* ======================================================== */}
      <div className="mt-8 block sm:hidden">
        <div
          dir="ltr"
          className="pause-on-hover relative flex flex-col gap-2.5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          {/* Row 1: Backend & Cloud (scroll left) */}
          <div className="animate-marquee flex gap-2.5">
            {row1Repeated.map((tool, idx) => (
              <div
                key={`m-r1-${tool.name}-${idx}`}
                className="group flex items-center gap-2 shrink-0 rounded-xl border border-ink-600/70 bg-ink-950/80 px-3 py-2 text-text backdrop-blur-md"
              >
                <TechIcon name={tool.name} className="h-4 w-4 shrink-0" />
                <span className="font-mono text-xs font-medium tracking-tight text-text/90 whitespace-nowrap">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2: Frontend & Design (scroll right) */}
          <div className="animate-marquee-reverse flex gap-2.5">
            {row2Repeated.map((tool, idx) => (
              <div
                key={`m-r2-${tool.name}-${idx}`}
                className="group flex items-center gap-2 shrink-0 rounded-xl border border-ink-600/70 bg-ink-950/80 px-3 py-2 text-text backdrop-blur-md"
              >
                <TechIcon name={tool.name} className="h-4 w-4 shrink-0" />
                <span className="font-mono text-xs font-medium tracking-tight text-text/90 whitespace-nowrap">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>

          {/* Row 3: QA & Testing (scroll left) */}
          <div className="animate-marquee flex gap-2.5">
            {row3Repeated.map((tool, idx) => (
              <div
                key={`m-r3-${tool.name}-${idx}`}
                className="group flex items-center gap-2 shrink-0 rounded-xl border border-ink-600/70 bg-ink-950/80 px-3 py-2 text-text backdrop-blur-md"
              >
                <TechIcon name={tool.name} className="h-4 w-4 shrink-0" />
                <span className="font-mono text-xs font-medium tracking-tight text-text/90 whitespace-nowrap">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
