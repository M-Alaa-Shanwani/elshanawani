import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTranslation } from '@/i18n';

const DEMO_URL = 'https://m-alaa-shanwani.github.io/madar-os/';

interface Feature {
  icon: JSX.Element;
  en: { title: string; desc: string };
  ar: { title: string; desc: string };
}

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-5 w-5',
};

const FEATURES: Feature[] = [
  {
    icon: (
      <svg {...svgProps}>
        <path d="M4 4h6v16H4zM14 4h6v10h-6z" />
      </svg>
    ),
    en: { title: 'Boards & Sprints', desc: 'Drag-and-drop Kanban with live timers, SLAs and task dependencies.' },
    ar: { title: 'اللوحات والسبرنتات', desc: 'كانبان بالسحب والإفلات مع مؤقتات حية واتفاقيات SLA وتبعيات المهام.' },
  },
  {
    icon: (
      <svg {...svgProps}>
        <path d="M4 18l5-6 4 3 7-9" />
      </svg>
    ),
    en: { title: 'Deals & Client Portal', desc: 'A CRM pipeline plus a dedicated portal where clients follow their projects.' },
    ar: { title: 'الصفقات وبوابة العميل', desc: 'مسار CRM لمتابعة الصفقات وبوابة مخصصة يتابع منها العميل مشاريعه.' },
  },
  {
    icon: (
      <svg {...svgProps}>
        <path d="M12 3v18M16 7c0-2-8-2-8 1s8 2 8 5-8 3-8 0" />
      </svg>
    ),
    en: { title: 'Finance & Margins', desc: 'Budgets, real-time project cost and profitability health per project.' },
    ar: { title: 'المالية وهوامش الربح', desc: 'ميزانيات وتكلفة لحظية وصحة ربحية لكل مشروع.' },
  },
  {
    icon: (
      <svg {...svgProps}>
        <path d="M6 11h12v9H6zM8 11V8a4 4 0 118 0v3" />
      </svg>
    ),
    en: { title: 'Roles & Permissions', desc: 'Admin, HR, PM, Client and Freelancer — each sees only what they should.' },
    ar: { title: 'الأدوار والصلاحيات', desc: 'مدير وموارد بشرية ومدير مشروع وعميل ومستقل — كلٌّ يرى ما يخصه فقط.' },
  },
  {
    icon: (
      <svg {...svgProps}>
        <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
      </svg>
    ),
    en: { title: 'Automation & Workflow', desc: 'Rules and workflows that remove repetitive operational work.' },
    ar: { title: 'الأتمتة وسير العمل', desc: 'قواعد وسير عمل تلغي الأعمال التشغيلية المتكررة.' },
  },
  {
    icon: (
      <svg {...svgProps}>
        <path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5v2a3 3 0 003 3M16 6h3v2a3 3 0 01-3 3M12 13v4M9 20h6" />
      </svg>
    ),
    en: { title: 'Gamified Teamwork', desc: 'Points, levels and achievements that keep the team engaged.' },
    ar: { title: 'تحفيز بالألعاب', desc: 'نقاط ومستويات وإنجازات تُبقي الفريق متحمسًا.' },
  },
];

export default function DemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useTranslation();
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll('[data-demo-reveal]');
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section id="demo" ref={sectionRef} className="relative overflow-hidden py-16 sm:py-24 md:py-36">
      {/* Ambient glow matching the MADAR brand gradient (indigo → violet → cyan) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[860px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500/15 via-violet/15 to-cyan/15 opacity-70 blur-3xl" />

      <div className="section-shell relative z-10">
        {/* Header */}
        <div data-demo-reveal className="max-w-3xl text-center sm:text-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-400 backdrop-blur-md sm:px-3 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            {isAr ? 'عرض تجريبي' : 'Live Demo'}
          </div>
          <h2 className="mt-3 text-2xl font-bold leading-[1.2] tracking-tight text-text sm:mt-4 sm:text-3xl md:text-5xl sm:leading-[1.15]">
            {isAr ? (
              <>
                مشروع من فكرتي وبرمجتي:{' '}
                <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                  مدار — نظام تشغيل الشركات
                </span>
              </>
            ) : (
              <>
                An idea I conceived and built:{' '}
                <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                  MADAR — The Company OS
                </span>
              </>
            )}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted sm:mt-4 sm:text-base">
            {isAr
              ? 'مدار نظام إداري متكامل يجمع إدارة المشاريع والفريق والعملاء والمالية في مكان واحد. الفكرة والتصميم والبرمجة كلها مني، والنسخة التجريبية جاهزة للاطلاع عليها وتجربتها بنفسك.'
              : 'MADAR is an all-in-one management system that brings projects, teams, clients and finance together. The idea, design and code are all mine — and a demo is ready for you to explore and try yourself.'}
          </p>
        </div>

        {/* Demo disclosure */}
        <div
          data-demo-reveal
          role="note"
          className="mt-6 sm:mt-8 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5"
        >
          <span className="mt-0.5 grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
          </span>
          <p className="text-xs leading-relaxed text-text sm:text-sm">
            <b className="font-bold text-amber-400">{isAr ? 'ملاحظة: ' : 'Please note: '}</b>
            {isAr
              ? 'هذه نسخة عرض (Demo) فقط لتوضيح الفكرة والتجربة. جميع البيانات والأسماء والأرقام داخلها وهمية، ولا يتم حفظ أي بيانات حقيقية.'
              : 'This is a demo only, built to show the concept and the experience. All data, names and figures inside are fictional, and no real data is stored.'}
          </p>
        </div>

        {/* Project Action Card */}
        <div
          data-demo-reveal
          className="mt-6 sm:mt-8 flex flex-col items-start justify-between gap-5 sm:gap-6 rounded-2xl sm:rounded-3xl border border-ink-600/70 bg-ink-950/70 p-5 sm:p-8 backdrop-blur-xl sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan/25 bg-[radial-gradient(circle_at_center,#121B3B_0%,#070B18_100%)] p-2 shadow-[0_8px_28px_rgba(67,97,238,0.35)] sm:h-20 sm:w-20">
              <img src={`${import.meta.env.BASE_URL}projects/madar-logo.svg`} alt="MADAR logo" className="h-full w-full object-contain" loading="lazy" />
            </div>
            <div dir="ltr">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">MADAR</span>
                <span className="font-arabic text-xl font-bold text-cyan sm:text-2xl">مدار</span>
              </div>
              <p className="mt-0.5 sm:mt-1 font-mono text-xs uppercase tracking-[0.2em] text-text-dim sm:text-sm">The Company OS</p>
            </div>
          </div>

          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full sm:w-auto justify-center text-sm py-3 px-6 text-center"
          >
            {isAr ? 'افتح العرض التجريبي' : 'Open Live Demo'}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 ${isAr ? '-scale-x-100' : ''}`}
              aria-hidden="true"
            >
              <path d="M7 17L17 7M8 7h9v9" />
            </svg>
          </a>
        </div>

        {/* Feature cards */}
        <div className="mt-8 sm:mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const copy = isAr ? feature.ar : feature.en;
            return (
              <div
                key={feature.en.title}
                data-demo-reveal
                className="group rounded-2xl border border-ink-600/70 bg-ink-950/70 p-4.5 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan/50 hover:bg-ink-900/85 hover:shadow-glow flex items-start gap-4 sm:block"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </span>
                <div className="min-w-0 flex-1 sm:mt-4">
                  <h3 className="text-base font-bold tracking-tight text-text leading-snug">{copy.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted sm:mt-1.5 sm:text-sm">{copy.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
