import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'ar';
type Dir = 'ltr' | 'rtl';

// ---------- translations ----------

const translations = {
  en: {
    // Navbar
    'nav.brand': 'Mohamed',
    'nav.capabilities': 'Tech & Tools',
    'nav.work': 'Work',
    'nav.stack': 'Process',
    'nav.contact': 'Contact',
    'nav.cta': 'Hire me',
    'nav.langToggle': 'عربي',

    // Hero
    'hero.eyebrow': 'Freelance Full-Stack Developer & UI/UX Designer',
    'hero.headline_1': 'I build software that ',
    'hero.headline_highlight': 'stands the test of time.',
    'hero.subtitle':
      'Full-stack development, mobile apps, UI/UX design and quality assurance — delivered with engineering precision on .NET, Angular and modern cloud infrastructure.',
    'hero.cta_primary': 'Hire me',
    'hero.cta_secondary': 'View my work',
    'hero.scroll': 'scroll to explore',

    // Services & Technologies
    'services.eyebrow': 'Technologies & Tools',
    'services.title': 'Full-Cycle Tech Stack & Delivery Pipeline.',
    'services.subtitle': 'Modern technologies, robust architectures, seamless integrations, and end-to-end quality assurance.',
    'services.all': 'All Tools',
    'services.backend.title': 'Backend & Architecture',
    'services.backend.desc':
      'Robust and secure backend infrastructure built on .NET, DDD, and scalable databases.',
    'services.frontend.title': 'Frontend & Web Apps',
    'services.frontend.desc':
      'Interactive, high-performance, and responsive user interfaces delivering smooth browsing across all screens.',
    'services.uiux.title': 'UI / UX Design',
    'services.uiux.desc':
      'Interfaces designed from real user flows — wireframe to pixel-perfect design system handoff.',
    'services.integrations.title': 'Integrations & Cloud',
    'services.integrations.desc':
      'Scalable APIs, payment gateways, event-driven webhooks, and secure cloud microservices.',
    'services.qa.title': 'QA, Testing & DevOps',
    'services.qa.desc':
      'Automated and manual test coverage with CI/CD pipelines embedded from sprint one.',

    // Work
    'work.eyebrow': 'Selected work',
    'work.title': 'Real projects, real results.',
    'work.subtitle':
      'A selection of live products and platforms I\'ve shipped. Swipe or use the arrows to explore.',
    'work.scrollLeft': 'Scroll left',
    'work.scrollRight': 'Scroll right',

    // Process & Workflow
    'process.eyebrow': 'How I Deliver',
    'process.title': 'From Concept to Production-Grade Software.',
    'process.subtitle': 'A structured, engineering-first approach that ensures rock-solid architecture, pixel-perfect UX, and rapid execution.',
    'process.step1.title': 'Architecture & Planning',
    'process.step1.desc': 'In-depth requirements discovery, database schema design, and Clean Architecture / DDD modeling before touching code.',
    'process.step2.title': 'UI/UX & Prototyping',
    'process.step2.desc': 'Modern, high-fidelity Figma prototypes and design systems tailored to real user journeys and business conversion.',
    'process.step3.title': 'Clean Code & Integrations',
    'process.step3.desc': 'Production-ready full-stack implementation with SOLID principles, robust APIs, and seamless third-party integrations.',
    'process.step4.title': 'QA, CI/CD & Deployment',
    'process.step4.desc': 'Automated testing suites, CI/CD pipelines, performance optimization, and smooth zero-downtime cloud deployment.',

    // CTA
    'cta.eyebrow': "Let's work together",
    'cta.title': 'Have a project worth building properly?',
    'cta.subtitle':
      "Tell me what you're building — click below to chat directly with me on WhatsApp and get started on a custom plan.",
    'cta.placeholder': 'you@company.com',
    'cta.emailLabel': 'Work email',
    'cta.submit': 'Send WhatsApp message',

    // Footer
    'footer.copy': '© {year} Mohamed Alaa',
    'footer.tagline': 'Web · Mobile · UI/UX · QA',
  },
  ar: {
    // Navbar
    'nav.brand': 'محمد',
    'nav.capabilities': 'التقنيات والأدوات',
    'nav.work': 'أعمالي',
    'nav.stack': 'منهجية العمل',
    'nav.contact': 'تواصل',
    'nav.cta': 'وظّفني',
    'nav.langToggle': 'EN',

    // Hero
    'hero.eyebrow': 'مطور Full-Stack ومصمم UI/UX — فري لانس',
    'hero.headline_1': 'أبني برمجيات ',
    'hero.headline_highlight': 'تصمد أمام اختبار الزمن.',
    'hero.subtitle':
      'تطوير ويب، تطبيقات موبايل، تصميم واجهات وضمان جودة — بدقة هندسية على .NET و Angular والبنية السحابية الحديثة.',
    'hero.cta_primary': 'وظّفني',
    'hero.cta_secondary': 'شوف أعمالي',
    'hero.scroll': 'اسحب لأسفل',

    // Services & Technologies
    'services.eyebrow': 'التقنيات والأدوات',
    'services.title': 'منظومة تقنية متكاملة، وخط إنتاج برمجي شامل.',
    'services.subtitle': 'أحدث الأدوات والتقنيات لتغطية معمارية الأنظمة، واجهات المستخدم، التكاملات والربط، وضمان الجودة.',
    'services.all': 'كل الأدوات',
    'services.backend.title': 'الأنظمة الخلفية والمعمارية (Backend)',
    'services.backend.desc':
      'بنية تحتية برمجية قوية وآمنة مبنية على .NET ومعمارية Domain-Driven Design وقواعد بيانات متقدمة.',
    'services.frontend.title': 'الواجهات الأمامية وتطبيقات الويب (Frontend)',
    'services.frontend.desc':
      'واجهات مستخدم تفاعلية، سريعة، ومتجاوبة بالكامل، تضمن تجربة تصفح سلسة وممتعة عبر جميع الشاشات.',
    'services.uiux.title': 'تصميم واجهات وتجربة المستخدم (UI/UX)',
    'services.uiux.desc':
      'واجهات مصممة من تدفقات المستخدم الحقيقية، مش من قوالب — من الـ Wireframe للتسليم الاحترافي.',
    'services.integrations.title': 'التكاملات والربط السحابي (Integrations)',
    'services.integrations.desc':
      'ربط واجهات الـ APIs، بوابات الدفع الإلكتروني، خوادم السحاب، والمعمارية المعتمدة على الأحداث Webhooks.',
    'services.qa.title': 'ضمان الجودة والأتمتة (QA & DevOps)',
    'services.qa.desc':
      'تغطية اختبارية آلية ويدوية مع خطوط إمداد CI/CD من أول سبرنت — الأخطاء تتكشف قبل ما توصل للمستخدم.',

    // Work
    'work.eyebrow': 'أعمال مختارة',
    'work.title': 'مشاريع حقيقية، نتائج حقيقية.',
    'work.subtitle':
      'مجموعة من المنتجات والمنصات اللي سلّمتها. اسحب أو استخدم الأسهم للاستكشاف.',
    'work.scrollLeft': 'اسحب لليسار',
    'work.scrollRight': 'اسحب لليمين',

    // Process & Workflow
    'process.eyebrow': 'منهجية العمل',
    'process.title': 'من الفكرة إلى منتج برمجي قوي في بيئة الإنتاج.',
    'process.subtitle': 'خطوات هندسية متكاملة تضمن أعلى معايير الجودة، سرعة الإطلاق، واستقرار النظام على المدى الطويل.',
    'process.step1.title': 'المعمارية والتخطيط الهندسي',
    'process.step1.desc': 'تحليل المتطلبات بدقة، وتصميم المخططات وقواعد البيانات، واختيار الأنماط المعمارية (Clean Architecture & DDD) قبل كتابة الكود.',
    'process.step2.title': 'تصميم واجهات وتجربة المستخدم',
    'process.step2.desc': 'تحويل الرؤية إلى نماذج تفاعلية وتصميمات عصرية على Figma مع بناء نظام تصميم (Design System) مخصص ودقيق.',
    'process.step3.title': 'التطوير النظيف والتكاملات',
    'process.step3.desc': 'بناء الأنظمة بمبادئ SOLID و Clean Code مع تطوير الـ Backend والـ Frontend، وربط بوابات الدفع وواجهات الـ APIs الخارجية.',
    'process.step4.title': 'الأتمتة وضمان الجودة والنشر',
    'process.step4.desc': 'تغطية الاختبارات الآلية، وإعداد خطوط الإمداد المستمر CI/CD، وضبط الأمان والسيرفرات السحابية لإطلاق آمن ومستقر.',

    // CTA
    'cta.eyebrow': 'يلا نشتغل سوا',
    'cta.title': 'عندك مشروع يستاهل يتبني صح؟',
    'cta.subtitle':
      'قولّي إيه اللي بتبنيه — اضغط تحت للتواصل معايا مباشرة على واتساب ونبدأ نشتغل سوا بوضوح وسرعة.',
    'cta.placeholder': 'you@company.com',
    'cta.emailLabel': 'إيميل العمل',
    'cta.submit': 'أرسل رسالة واتساب',

    // Footer
    'footer.copy': '© {year} محمد علاء',
    'footer.tagline': 'ويب · موبايل · UI/UX · ضمان جودة',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['en'];

// ---------- context ----------

interface I18nContextValue {
  lang: Language;
  dir: Dir;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang') as Language | null;
      if (stored === 'ar' || stored === 'en') return stored;
    }
    return 'en';
  });

  const dir: Dir = lang === 'ar' ? 'rtl' : 'ltr';

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string>): string => {
      let str: string = (translations[lang] as Record<string, string>)[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, v);
        });
      }
      return str;
    },
    [lang]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <I18nContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
