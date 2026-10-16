import { useState } from 'react';
import WorkCard, { type ProjectItem } from './WorkCard';
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
  const { lang } = useTranslation();
  const isAr = lang === 'ar';

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

  return (
    <section id="work" className="relative py-20 sm:py-28 md:py-36">
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

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap self-start md:self-end">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as CategoryFilter)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-xs shrink-0 transition-all duration-200 ${
                  filter === tab.id
                    ? 'bg-cyan text-ink-950 font-semibold shadow-glow scale-105'
                    : 'border border-ink-600 bg-ink-900/80 text-text-muted hover:border-cyan/40 hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-7">
          {filteredProjects.map((project) => (
            <WorkCard
              key={project.id}
              project={project}
              onOpenDetails={setActiveProject}
            />
          ))}
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
