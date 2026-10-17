import { useTranslation } from '@/i18n';
import { TechIcon } from './techIcons';

export interface Tool {
  name: string;
}

// 3 rows for marquee slider
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
  const { t, lang } = useTranslation();

  const row1Repeated = [...ROW_1, ...ROW_1, ...ROW_1, ...ROW_1];
  const row2Repeated = [...ROW_2, ...ROW_2, ...ROW_2, ...ROW_2];
  const row3Repeated = [...ROW_3, ...ROW_3, ...ROW_3, ...ROW_3];

  return (
    <section id="services" className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="section-shell relative z-10">
        {/* Section Header */}
        <div className="text-center sm:text-start max-w-3xl mb-8 sm:mb-12">
          <p className="eyebrow">{t('services.eyebrow')}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:mt-4 sm:text-3xl md:text-4xl">
            {t('services.title')}
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-text-muted leading-relaxed max-w-2xl">
            {lang === 'ar'
              ? 'منظومة تقنية متكاملة من أحدث لغات البرمجة وأطر العمل وقواعد البيانات لتنفيذ وتوسيع المشاريع البرمجية.'
              : 'An integrated modern stack of high-performance frameworks, cloud tools, and databases engineered for production.'}
          </p>
        </div>
      </div>

      {/* 3-Row Infinite Marquee Slider (Both PC & Mobile) */}
      <div
        dir="ltr"
        className="pause-on-hover relative w-full overflow-hidden flex flex-col gap-3 sm:gap-4 md:gap-5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        {/* Row 1: Backend & Cloud (scroll left) */}
        <div className="animate-marquee-slow flex w-max gap-3 sm:gap-4 will-change-transform">
          {row1Repeated.map((tool, idx) => (
            <div
              key={`r1-${tool.name}-${idx}`}
              className="group flex items-center gap-2.5 sm:gap-3 shrink-0 rounded-xl sm:rounded-2xl border border-ink-600/70 bg-ink-950/80 px-3.5 py-2 sm:px-5 sm:py-3 text-text backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan/70 hover:bg-ink-900/90 hover:text-cyan hover:shadow-glow select-none"
            >
              <TechIcon
                name={tool.name}
                className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-mono text-xs sm:text-sm font-medium tracking-tight text-text/90 whitespace-nowrap group-hover:text-cyan">
                {tool.name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Frontend & Design (scroll right) */}
        <div className="animate-marquee-reverse-slow flex w-max gap-3 sm:gap-4 will-change-transform">
          {row2Repeated.map((tool, idx) => (
            <div
              key={`r2-${tool.name}-${idx}`}
              className="group flex items-center gap-2.5 sm:gap-3 shrink-0 rounded-xl sm:rounded-2xl border border-ink-600/70 bg-ink-950/80 px-3.5 py-2 sm:px-5 sm:py-3 text-text backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet/70 hover:bg-ink-900/90 hover:text-violet hover:shadow-glow-violet select-none"
            >
              <TechIcon
                name={tool.name}
                className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-mono text-xs sm:text-sm font-medium tracking-tight text-text/90 whitespace-nowrap group-hover:text-violet">
                {tool.name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 3: QA, Testing & DevOps (scroll left) */}
        <div className="animate-marquee-slow flex w-max gap-3 sm:gap-4 will-change-transform">
          {row3Repeated.map((tool, idx) => (
            <div
              key={`r3-${tool.name}-${idx}`}
              className="group flex items-center gap-2.5 sm:gap-3 shrink-0 rounded-xl sm:rounded-2xl border border-ink-600/70 bg-ink-950/80 px-3.5 py-2 sm:px-5 sm:py-3 text-text backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan/70 hover:bg-ink-900/90 hover:text-cyan hover:shadow-glow select-none"
            >
              <TechIcon
                name={tool.name}
                className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-mono text-xs sm:text-sm font-medium tracking-tight text-text/90 whitespace-nowrap group-hover:text-cyan">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
