import { useState, useRef, useEffect, useCallback } from 'react';
import type { ProjectItem } from './WorkCard';
import { useTranslation } from '@/i18n';

const allProjects: ProjectItem[] = [
  {
    id: 'synitera-saas',
    category: 'web',
    image: '/work/synitera-saas.jpg',
    badge: { ar: 'منصة سحابية SaaS', en: 'Enterprise SaaS' },
    title: {
      ar: 'منصة سينيتيرا — إدارة الشركات والميكروسيرفس',
      en: 'Synitera — Cloud Operations & Multi-Tenant Portal',
    },
    desc: {
      ar: 'بوابة إدارة سحابية متعددة المستأجرين مبنية بـ Domain-Driven Design على ABP.io لمتابعة صحة السيرفرات ومقاييس الأداء.',
      en: 'Multi-tenant enterprise management portal engineered on ABP.io with Domain-Driven Design, server telemetry, and RBAC.',
    },
    metric: { ar: '🛡️ استقرار بنسبة 99.98%', en: '🛡️ 99.98% High Availability' },
    tags: ['ABP.io', 'ASP.NET Core', 'Angular', 'Redis', 'Kubernetes'],
    details: {
      ar: {
        role: 'هندسة الأنظمة والباك إند المتقدم (Backend Lead & Architecture)',
        highlight: 'معمارية موزعة عالية الاعتمادية مع معالجة أكثر من 14 مليون طلب شهرياً بأقل من 40ms زمن استجابة.',
      },
      en: {
        role: 'Backend Lead & Cloud Architecture',
        highlight: 'Distributed microservices architecture serving 14M+ monthly requests with sub-40ms response latency.',
      },
    },
  },
  {
    id: 'hathout-cafe',
    category: 'web',
    image: '/work/hathout-cafe.jpg',
    badge: { ar: 'منصة ويب & POS', en: 'Web Platform & POS' },
    title: {
      ar: 'نظام حتحوت كافيه — إدارة المطاعم والمبيعات السحابية',
      en: 'Hathout Cafe — Cloud POS & Restaurant Management',
    },
    desc: {
      ar: 'منصة سحابية متكاملة لإدارة سلسلة المقاهي ونقاط البيع، مع ربط مباشر بين الكاشير والمطبخ مع لوحة تحكم ذكية للإيرادات.',
      en: 'Cloud platform for restaurant operations, live kitchen dispatch, and digital table reservations with live revenue analytics.',
    },
    metric: { ar: '⚡ معالجة طلبات < 200ms', en: '⚡ Sub-200ms Order Processing' },
    tags: ['.NET Core 8', 'Angular 17', 'PostgreSQL', 'SignalR', 'Docker'],
    details: {
      ar: {
        role: 'تصميم وبناء كامل (Full-Stack Architecture & Development)',
        highlight: 'أتمتة دورة الطلبات بنسبة 95% والربط المباشر مع أجهزة الطباعة الحرارية والموازين، ونظام تقارير محاسبية تفاعلي.',
      },
      en: {
        role: 'Full-Stack Architecture & Development',
        highlight: 'Automated 95% of order lifecycles with thermal printer telemetry and real-time revenue analytics dashboard.',
      },
    },
  },
  {
    id: 'nabdh-health',
    category: 'mobile',
    image: '/work/nabdh-health.jpg',
    badge: { ar: 'تطبيق موبايل طبي', en: 'Mobile App · Health' },
    title: {
      ar: 'تطبيق نبض الطبي — استشارات وحجوزات طبية فورية',
      en: 'Nabdh — Telehealth & Smart Clinic Mobile App',
    },
    desc: {
      ar: 'تطبيق رعاية صحية متطور يربط المرضى بالأطباء الاستشاريين عبر مكالمات فيديو مشفرة، مع حجز المواعيد وملف صحي ذكي.',
      en: 'Patient-first mobile healthcare solution featuring encrypted WebRTC video consultations, clinic booking, and tracking.',
    },
    metric: { ar: '📱 +50,000 مستخدم نشط', en: '📱 +50k Active Patients' },
    tags: ['React Native', 'Node.js', 'WebRTC', 'Firebase', 'TypeScript'],
    details: {
      ar: {
        role: 'تطوير تطبيق الموبايل والواجهات (Mobile App & UX)',
        highlight: 'تجربة مستخدم حاصلة على تقييم 4.9 في المتاجر مع مكالمات فيديو فائقة الاستقرار حتى في الشبكات الضعيفة.',
      },
      en: {
        role: 'Mobile App & UX Engineering',
        highlight: 'Maintained 4.9-star store rating with crystal-clear latency-optimized video feeds across diverse mobile networks.',
      },
    },
  },
  {
    id: 'madar-logistics',
    category: 'web',
    image: '/work/madar-logistics.jpg',
    badge: { ar: 'منصة لوجستية & أسطول', en: 'Logistics & Fleet SaaS' },
    title: {
      ar: 'مدار للشحن — تتبع الشحنات والأسطول اللحظي',
      en: 'Madar Logistics — Live Fleet Dispatch & Telemetry',
    },
    desc: {
      ar: 'لوحة تحكم تشغيلية لشركات الشحن والخدمات اللوجستية، تتيح تعقب مسارات السائقين لحظياً وتحسين استهلاك الوقود وخفض التكاليف.',
      en: 'High-throughput logistics dispatching console tracking fleet GPS coordinates in real-time with route optimization engines.',
    },
    metric: { ar: '📍 تتبع 10,000 مركبة لحظياً', en: '📍 10k Active Fleet Units' },
    tags: ['React 18', 'NestJS', 'Leaflet', 'RabbitMQ', 'PostgreSQL'],
    details: {
      ar: {
        role: 'تطوير الواجهة الأمامية والخرائط التفاعلية (Frontend & Geospatial)',
        highlight: 'خرائط تفاعلية سلسة تدعم آلاف النقاط المتزامنة وتحديث فوري للمسارات عبر WebSockets.',
      },
      en: {
        role: 'Frontend & Geospatial Engineering',
        highlight: 'Engineered silky-smooth cluster rendering for thousands of moving vehicles using optimized WebSockets pipelines.',
      },
    },
  },
  {
    id: 'finedge-portal',
    category: 'web',
    image: '/work/aim-ai.jpg',
    badge: { ar: 'بوابة مالية B2B', en: 'B2B Fintech Portal' },
    title: {
      ar: 'فاين إيدج — بوابة الفواتير والتحصيلات البنكية',
      en: 'FinEdge — Enterprise Billing & Settlement Engine',
    },
    desc: {
      ar: 'منصة تسوية مالية تربط بين بوابات الدفع الإلكتروني وحسابات البنوك، مع إصدار الفواتير الضريبية وتوليد التقارير المالية بدقة.',
      en: 'Automated settlement engine bridging commercial payment gateways with enterprise bank ledgers and VAT e-invoicing.',
    },
    metric: { ar: '💳 معالجة +$8M معاملات شهرياً', en: '💳 $8M+ Monthly Volume' },
    tags: ['.NET 8', 'Angular', 'SQL Server', 'Stripe', 'Docker'],
    details: {
      ar: {
        role: 'أمان البيانات والامتثال المالي (Fintech Security & Core API)',
        highlight: 'بناء محرك معاملات متوافق مع معايير PCI-DSS مع حماية فائقة ضد ازدواجية الخصم.',
      },
      en: {
        role: 'Fintech Security & Core API',
        highlight: 'Architected idempotent transactional pipeline meeting strict PCI-DSS audit requirements without transaction drift.',
      },
    },
  },
  {
    id: 'aim-ai',
    category: 'ai',
    image: '/work/aim-ai.jpg',
    badge: { ar: 'منصة ذكاء اصطناعي', en: 'Enterprise AI & Automation' },
    title: {
      ar: 'منصة aim.ai — أتمتة العمليات والحلول الذكية',
      en: 'aim.ai — Neural Workflow & Operations Automation',
    },
    desc: {
      ar: 'منصة مؤسسية لأتمتة سير العمل وربط النماذج الذكية التوليدية لتحليل البيانات الضخمة واتخاذ القرارات التجارية اللحظية.',
      en: 'Enterprise AI orchestration platform integrating LLMs for automated pipeline extraction and real-time operational decisions.',
    },
    metric: { ar: '🤖 أتمتة مهام بنسبة 80%', en: '🤖 80% Automated Ops' },
    tags: ['Python', 'FastAPI', 'React', 'OpenAI API', 'LangChain'],
    details: {
      ar: {
        role: 'هندسة خطوط النماذج والذكاء الاصطناعي (AI Lead Engineer)',
        highlight: 'تقليص زمن معالجة المستندات المؤسسية بنسبة 80% باستخدام خطوط معالجة لغوية ذكية متزامنة.',
      },
      en: {
        role: 'AI Lead Engineer',
        highlight: 'Reduced enterprise document processing turnaround by 80% with resilient asynchronous LLM extraction chains.',
      },
    },
  },
  {
    id: 'maxstore',
    category: 'ecommerce',
    image: '/work/maxstore.jpg',
    badge: { ar: 'متجر تجارة إلكترونية', en: 'E-Commerce Store' },
    title: {
      ar: 'متجر maxStore — منصة تجارة إلكترونية عصرية',
      en: 'maxStore — High-Performance E-Commerce Platform',
    },
    desc: {
      ar: 'منصة تسوق متكاملة للأزياء الراقية، توفر تجربة مستخدم سلسة مع سلة مشتريات ديناميكية، قسائم خصم تفاعلية، وتتبع شحنات متكامل.',
      en: 'Modern boutique shopping experience with instant cart state, interactive coupon engine, and seamless multi-channel checkout.',
    },
    metric: { ar: '🛍️ تجربة شراء فورية', en: '🛍️ Sub-second Checkout' },
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'LocalStorage'],
    details: {
      ar: {
        role: 'تطوير وتصميم واجهة المتجر (Frontend & Interaction Design)',
        highlight: 'كود نظيف تماماً وخفيف وبدون اعتمادات خارجية ثقيلة، لضمان تحميل فوري وتجربة شرائية استثنائية.',
      },
      en: {
        role: 'Frontend & Interaction Design',
        highlight: 'Lightweight zero-dependency architecture ensuring sub-second initial page render and instant cart responsiveness.',
      },
    },
  },
  {
    id: 'pegasus-store',
    category: 'ecommerce',
    image: '/work/pegasus-store.jpg',
    badge: { ar: 'متجر ساعات وسلع فاخرة', en: 'Luxury Goods Store' },
    title: {
      ar: 'متجر ساعات Pegasus — منصة بيع الساعات الفاخرة',
      en: 'Pegasus Watches — Luxury Timepiece E-Commerce',
    },
    desc: {
      ar: 'متجر رقمي متخصص في الساعات الكلاسيكية والرياضية الفاخرة، يبرز تفاصيل الحركات الميكانيكية وتجربة شراء استثنائية.',
      en: 'Bespoke horology boutique engineered with high-precision micro-interactions celebrating mechanical timepiece craftsmanship.',
    },
    metric: { ar: '⭐ تقييم 4.9 للمتجر', en: '⭐ 4.9 Store Rating' },
    tags: ['JavaScript', 'Modern CSS', 'E-Commerce', 'UI/UX'],
    details: {
      ar: {
        role: 'تصميم تجربة العميل والواجهات (UI/UX & Storefront)',
        highlight: 'واجهات داكنة فاخرة تعكس قيمة المنتجات الحصرية مع تدفق شراء مبسط بدون تعقيد.',
      },
      en: {
        role: 'UI/UX & Storefront Engineering',
        highlight: 'Crafted ultra-refined dark luxury aesthetics highlighting timepiece finishing and smooth micro-interactions.',
      },
    },
  },
  {
    id: 'arooma-uiux',
    category: 'uiux',
    image: '/work/docs-al7osam.jpg',
    badge: { ar: 'تصميم منتج UI/UX', en: 'UI/UX Design System' },
    title: {
      ar: 'نظام أرومة — تجربة بحث وحجز عقاري متطورة',
      en: 'Arooma — PropTech Booking Flow & Design System',
    },
    desc: {
      ar: 'نظام تصميم متكامل (Design System) لمنصة عقارية ذكية مع تدفقات حجز ثلاثية الأبعاد ونماذج تفاعلية شاملة لكافة الحالات.',
      en: 'Comprehensive design system and micro-interaction library for modern real-estate search, 3D property tours, and checkout.',
    },
    metric: { ar: '🎨 +120 شاشة ومكون تفاعلي', en: '🎨 120+ Components & Screens' },
    tags: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
    details: {
      ar: {
        role: 'أبحاث وتصميم تجربة المستخدم (Lead Product Designer)',
        highlight: 'رفع معدل إتمام الحجوزات بنسبة 40% من خلال تبسيط تدفق المستخدم وتوحيد هوية التصميم في كافة الشاشات.',
      },
      en: {
        role: 'Lead Product Designer',
        highlight: 'Increased booking completion by 40% via simplified checkout funnels and cohesive design tokens.',
      },
    },
  },
  {
    id: 'docs-al7osam',
    category: 'web',
    image: '/work/docs-al7osam.jpg',
    badge: { ar: 'بوابة توثيق ومعمارية', en: 'Engineering Docs Portal' },
    title: {
      ar: 'بوابة توثيق الحسام — معمارية الأنظمة والمكتبات البرمجية',
      en: 'Al-Hosam Portal — Engineering Blueprints & SDK Docs',
    },
    desc: {
      ar: 'بوابة متكاملة لتوثيق معمارية المشاريع البرمجية وقواعد البيانات مع أمثلة حية لمكتبات الـ API والمخططات الهندسية التفاعلية.',
      en: 'Centralized developer portal documenting microservices architecture, database schemas, and live interactive API specs.',
    },
    metric: { ar: '📚 توثيق 100% للمنظومة', en: '📚 100% Architecture Coverage' },
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'OpenAPI', 'Markdown'],
    details: {
      ar: {
        role: 'هندسة التوثيق والمعمارية (Lead Documentation Architect)',
        highlight: 'توحيد المراجع البرمجية وتقليص زمن تدريب المهندسين الجدد بنسبة 60% بفضل التوثيق المنهجي المتكامل.',
      },
      en: {
        role: 'Lead Documentation Architect',
        highlight: 'Streamlined developer onboarding by 60% through standardized schema specifications and architecture blueprints.',
      },
    },
  },
];

type CategoryFilter = 'all' | 'web' | 'ecommerce' | 'mobile' | 'ai' | 'uiux';

export default function WorksSection() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const trackWrapRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { lang } = useTranslation();
  const isAr = lang === 'ar';

  const getShortTitle = (title: string) => {
    const parts = title.split(/[–—-]/);
    return parts[0]?.trim() || title;
  };

  const filterTabs = [
    { id: 'all', label: isAr ? 'الكل' : 'All' },
    { id: 'web', label: isAr ? 'منصات سحابية & SaaS' : 'Cloud & SaaS' },
    { id: 'ecommerce', label: isAr ? 'متاجر رقمية' : 'E-Commerce' },
    { id: 'mobile', label: isAr ? 'تطبيقات موبايل' : 'Mobile Apps' },
    { id: 'ai', label: isAr ? 'ذكاء اصطناعي' : 'AI Systems' },
    { id: 'uiux', label: isAr ? 'تصميم UI/UX' : 'UI/UX Design' },
  ];

  const filteredProjects =
    filter === 'all'
      ? allProjects
      : allProjects.filter((item) => item.category === filter);

  // Center active card smoothly inside track container
  const center = useCallback((index: number) => {
    const wrap = trackWrapRef.current;
    const card = cardsRef.current[index];
    if (!wrap || !card) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      const start = card.offsetTop;
      wrap.scrollTo({
        top: start - (wrap.clientHeight / 2 - card.clientHeight / 2),
        behavior: 'smooth',
      });
    } else {
      const wrapRect = wrap.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const diff = (cardRect.left + cardRect.width / 2) - (wrapRect.left + wrapRect.width / 2);
      wrap.scrollBy({ left: diff, behavior: 'smooth' });
    }
  }, []);

  const activate = useCallback(
    (index: number, shouldCenter = true) => {
      setActiveIndex(index);
      if (shouldCenter) {
        requestAnimationFrame(() => {
          center(index);
        });
      }
    },
    [center]
  );

  const go = useCallback(
    (step: number) => {
      setActiveIndex((prev) => {
        const next = Math.min(Math.max(prev + step, 0), filteredProjects.length - 1);
        requestAnimationFrame(() => center(next));
        return next;
      });
    },
    [center, filteredProjects.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        go(isAr ? -1 : 1);
      } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        go(isAr ? 1 : -1);
      }
    };
    window.addEventListener('keydown', onKeyDown, { passive: true });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, isAr]);

  // Window resize re-centering
  useEffect(() => {
    const onResize = () => center(activeIndex);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeIndex, center]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isMobile ? Math.abs(dy) > 60 : Math.abs(dx) > 60) {
      const step = (isMobile ? dy : dx) > 0 ? -1 : 1;
      go(isAr && !isMobile ? -step : step);
    }
  };

  return (
    <section id="work" className="relative py-20 sm:py-28 md:py-36 overflow-hidden">
      <div className="section-shell">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-ink-700/60">
          <div>
            <p className="eyebrow">{isAr ? 'أعمال مختارة' : 'Selected Work'}</p>
            <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-text sm:mt-4 sm:text-3xl md:text-5xl">
              {isAr ? 'مشاريع حقيقية، نتائج ملموسة.' : 'Real Projects, Measurable Results.'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
              {isAr
                ? 'مجموعة من أحدث الأنظمة والمنصات والتطبيقات التي قمت بتطويرها وتصميمها بأعلى معايير الجودة والأداء والهندسة البرمجية.'
                : 'A curated selection of platforms, mobile apps, and systems I engineered with production-grade precision and modern aesthetics.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 self-start md:self-end">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFilter(tab.id as CategoryFilter);
                    activate(0, true);
                  }}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-xs shrink-0 transition-all duration-200 cursor-pointer ${
                    filter === tab.id
                      ? 'bg-cyan text-ink-950 font-semibold shadow-glow scale-105'
                      : 'border border-ink-600 bg-ink-900/80 text-text-muted hover:border-cyan/40 hover:text-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Header Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => go(-1)}
                disabled={activeIndex === 0}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 bg-ink-900/80 text-text transition-all duration-200 hover:border-cyan hover:bg-cyan hover:text-ink-950 hover:shadow-glow disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
                aria-label={isAr ? 'السابق' : 'Previous'}
              >
                <span className="text-base font-bold">{isAr ? '›' : '‹'}</span>
              </button>
              <button
                onClick={() => go(1)}
                disabled={activeIndex === filteredProjects.length - 1}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 bg-ink-900/80 text-text transition-all duration-200 hover:border-cyan hover:bg-cyan hover:text-ink-950 hover:shadow-glow disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
                aria-label={isAr ? 'التالي' : 'Next'}
              >
                <span className="text-base font-bold">{isAr ? '‹' : '›'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center-Mode Expanding Productivity Slider */}
        <div className="relative mt-8 sm:mt-12">
          {/* Subtle edge fades for luxury desktop look */}
          <div className="pointer-events-none absolute -inset-y-2 start-0 z-10 hidden md:block w-6 sm:w-12 bg-gradient-to-r from-ink-950 to-transparent" />
          <div className="pointer-events-none absolute -inset-y-2 end-0 z-10 hidden md:block w-6 sm:w-12 bg-gradient-to-l from-ink-950 to-transparent" />

          <div
            ref={trackWrapRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="slider relative w-full overflow-x-auto overflow-y-hidden no-scrollbar"
          >
            <div className="work-slider-track">
              {filteredProjects.map((project, idx) => {
                const isActive = activeIndex === idx;
                const badgeText = isAr ? project.badge.ar : project.badge.en;
                const titleText = isAr ? project.title.ar : project.title.en;
                const descText = isAr ? project.desc.ar : project.desc.en;
                const metricText = isAr ? project.metric.ar : project.metric.en;
                const imageSrc =
                  project.image.startsWith('http') || project.image.startsWith(import.meta.env.BASE_URL)
                    ? project.image
                    : `${import.meta.env.BASE_URL}${project.image.replace(/^\/+/, '')}`;

                return (
                  <article
                    key={project.id}
                    ref={(el) => (cardsRef.current[idx] = el)}
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => activate(idx, true)}
                    onMouseEnter={() => {
                      if (
                        typeof window !== 'undefined' &&
                        window.matchMedia('(hover: hover)').matches
                      ) {
                        activate(idx, true);
                      }
                    }}
                    className="work-project-card group select-none"
                  >
                    {/* Background cover image with hover zoom & dark vignette */}
                    <img
                      src={imageSrc}
                      alt=""
                      loading="lazy"
                      className="work-project-card__bg"
                    />

                    {/* Spine Header with Index for Inactive Desktop Cards */}
                    <div className="work-project-card__spine">
                      <span className="work-project-card__idx">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="work-project-card__spine-icon" aria-hidden="true">
                        ✦
                      </span>
                    </div>

                    {/* Card Content Overlay */}
                    <div className="work-project-card__content">
                      {/* Ribbon Title for Inactive Desktop Cards */}
                      <span className="work-project-card__ribbon-title" aria-hidden="true">
                        {getShortTitle(titleText)}
                      </span>

                      {/* Mobile Inactive Bar (< 768px) */}
                      <div className="work-project-card__mobile-bar" aria-hidden="true">
                        <span className="font-mono text-xs font-bold text-cyan">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-bold text-white truncate flex-1 text-start">
                          {titleText}
                        </span>
                        <span className="text-white/40 text-base font-bold">
                          {isActive ? '−' : '+'}
                        </span>
                      </div>

                      {/* Featured Thumbnail */}
                      <div className="work-project-card__thumb">
                        <img
                          src={imageSrc}
                          alt={titleText}
                          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                      </div>

                      {/* Body Column */}
                      <div className="work-project-card__body">
                        {/* Badges */}
                        <div className="work-project-card__badges">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-ink-950/85 px-2.5 py-0.5 font-mono text-[11px] font-medium text-cyan backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                            {badgeText}
                          </span>
                          <span className="inline-flex items-center rounded-lg border border-white/10 bg-ink-800/80 px-2.5 py-0.5 text-[11px] font-medium text-text-muted">
                            {metricText}
                          </span>
                        </div>

                        {/* Single Unified Title */}
                        <h3 className="work-project-card__title">
                          {titleText}
                        </h3>

                        {/* Description */}
                        <p className="work-project-card__desc">
                          {descText}
                        </p>

                        {/* Tech Tags */}
                        <div className="work-project-card__tags">
                          {project.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-ink-700/80 bg-ink-800/80 px-2 py-0.5 font-mono text-[10px] text-text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action Details Button */}
                        <div className="work-project-card__action">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveProject(project);
                            }}
                            className="work-project-card__btn group/btn"
                          >
                            <span>{isAr ? 'استعراض تفاصيل المشروع' : 'View Project Details'}</span>
                            <span className="transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
                              {isAr ? '←' : '→'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Indicator Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink-700/60 pt-5">
          {/* Dot Indicators */}
          <div className="hidden md:flex items-center gap-2 py-1">
            {filteredProjects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => activate(idx, true)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? 'w-8 bg-cyan shadow-glow scale-105'
                    : 'w-2.5 bg-white/20 hover:bg-white/50'
                }`}
                aria-label={`Go to project slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows & Counter */}
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
            <span className="font-mono text-xs text-text-dim">
              <span className="text-cyan font-bold text-sm">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              {' / '}
              {String(filteredProjects.length).padStart(2, '0')}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => go(-1)}
                disabled={activeIndex === 0}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 bg-ink-900/80 text-text transition-all duration-200 hover:border-cyan hover:bg-cyan hover:text-ink-950 hover:shadow-glow disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
                aria-label={isAr ? 'السابق' : 'Previous'}
              >
                <span className="text-base font-bold">{isAr ? '›' : '‹'}</span>
              </button>
              <button
                onClick={() => go(1)}
                disabled={activeIndex === filteredProjects.length - 1}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 bg-ink-900/80 text-text transition-all duration-200 hover:border-cyan hover:bg-cyan hover:text-ink-950 hover:shadow-glow disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
                aria-label={isAr ? 'التالي' : 'Next'}
              >
                <span className="text-base font-bold">{isAr ? '‹' : '›'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-ink-600 bg-ink-900 p-5 sm:p-8 shadow-2xl text-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 end-4 sm:top-5 sm:end-5 flex h-9 w-9 items-center justify-center rounded-full border border-ink-600 bg-ink-800 text-text-muted transition-colors hover:border-cyan hover:text-cyan"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              ✕
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-ink-700 bg-ink-950">
              <img
                src={
                  activeProject.image.startsWith('http') || activeProject.image.startsWith(import.meta.env.BASE_URL)
                    ? activeProject.image
                    : `${import.meta.env.BASE_URL}${activeProject.image.replace(/^\/+/, '')}`
                }
                alt={isAr ? activeProject.title.ar : activeProject.title.en}
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Modal Header */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan/40 bg-ink-950/80 px-3 py-1 font-mono text-xs text-cyan">
                {isAr ? activeProject.badge.ar : activeProject.badge.en}
              </span>
              <span className="rounded-lg border border-white/10 bg-ink-800 px-3 py-1 text-xs text-text">
                {isAr ? activeProject.metric.ar : activeProject.metric.en}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold sm:text-2xl text-text">
              {isAr ? activeProject.title.ar : activeProject.title.en}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
              {isAr ? activeProject.desc.ar : activeProject.desc.en}
            </p>

            {/* Role & Highlights */}
            {activeProject.details && (
              <div className="mt-6 rounded-2xl border border-ink-700/80 bg-ink-950/60 p-4 sm:p-5">
                <h4 className="font-mono text-xs text-cyan uppercase tracking-wider">
                  {isAr ? 'الدور والمسؤوليات' : 'Role & Key Contributions'}
                </h4>
                <p className="mt-1 text-sm font-semibold text-text">
                  {isAr
                    ? activeProject.details.ar.role
                    : activeProject.details.en.role}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted sm:text-sm">
                  {isAr
                    ? activeProject.details.ar.highlight
                    : activeProject.details.en.highlight}
                </p>
              </div>
            )}

            {/* Tech Tags */}
            <div className="mt-6">
              <h4 className="font-mono text-xs text-text-dim uppercase tracking-wider mb-2">
                {isAr ? 'التقنيات المستخدمة' : 'Technologies Used'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-1 font-mono text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex flex-wrap gap-4 border-t border-ink-700/60 pt-6">
              <a
                href="#contact"
                onClick={() => setActiveProject(null)}
                className="btn-primary justify-center text-sm"
              >
                {isAr ? 'اطلب مشروعاً مماثلاً' : 'Request Similar Project'}
              </a>
              <button
                onClick={() => setActiveProject(null)}
                className="btn-ghost justify-center text-sm"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
