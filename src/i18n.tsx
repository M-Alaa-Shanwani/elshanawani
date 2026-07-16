import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'ar';
type Dir = 'ltr' | 'rtl';

// ---------- translations ----------

const translations = {
  en: {
    // Navbar
    'nav.brand': 'Mohamed',
    'nav.capabilities': 'Capabilities',
    'nav.work': 'Work',
    'nav.stack': 'Stack',
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

    // Services
    'services.eyebrow': 'Capabilities',
    'services.title': 'Four disciplines, one delivery pipeline.',
    'services.web.title': 'Web Engineering',
    'services.web.desc':
      'Full-stack web platforms on .NET and Angular — domain-driven backends, accessible UIs, built to scale past the demo.',
    'services.mobile.title': 'Mobile',
    'services.mobile.desc':
      'Cross-platform apps that feel native, shipped fast without sacrificing performance.',
    'services.uiux.title': 'UI / UX',
    'services.uiux.desc':
      'Interfaces designed from real user flows, not templates — wireframe to pixel-perfect handoff.',
    'services.qa.title': 'QA / QC',
    'services.qa.desc':
      'Automated and manual test coverage embedded from sprint one — regressions caught before they ship.',

    // Work
    'work.eyebrow': 'Selected work',
    'work.title': 'Real projects, real results.',
    'work.subtitle':
      'A selection of live products and platforms I\'ve shipped. Swipe or use the arrows to explore.',
    'work.scrollLeft': 'Scroll left',
    'work.scrollRight': 'Scroll right',

    // TechStack
    'stack.eyebrow': 'The stack',
    'stack.title': 'The technologies I work with daily.',
    'stack.client': 'Client',
    'stack.client.detail': 'Presentation layer',
    'stack.app': 'Application',
    'stack.app.detail': 'Domain & API layer',
    'stack.data': 'Data',
    'stack.data.detail': 'Persistence layer',
    'stack.infra': 'Infrastructure',
    'stack.infra.detail': 'Delivery & ops layer',

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
    'nav.capabilities': 'الخدمات',
    'nav.work': 'أعمالي',
    'nav.stack': 'التقنيات',
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

    // Services
    'services.eyebrow': 'الخدمات',
    'services.title': 'أربع تخصصات، خط إنتاج واحد.',
    'services.web.title': 'تطوير الويب',
    'services.web.desc':
      'منصات ويب متكاملة على .NET و Angular — باك إند مبني على Domain-Driven Design وواجهات سهلة الوصول.',
    'services.mobile.title': 'الموبايل',
    'services.mobile.desc':
      'تطبيقات Cross-platform بإحساس تطبيقات أصلية، سريعة التسليم بدون التنازل عن الأداء.',
    'services.uiux.title': 'UI / UX',
    'services.uiux.desc':
      'واجهات مصممة من تدفقات المستخدم الحقيقية، مش من قوالب — من الـ Wireframe للتسليم.',
    'services.qa.title': 'ضمان الجودة',
    'services.qa.desc':
      'تغطية اختبارية آلية ويدوية من أول سبرنت — الأخطاء تتكشف قبل ما توصل للمستخدم.',

    // Work
    'work.eyebrow': 'أعمال مختارة',
    'work.title': 'مشاريع حقيقية، نتائج حقيقية.',
    'work.subtitle':
      'مجموعة من المنتجات والمنصات اللي سلّمتها. اسحب أو استخدم الأسهم للاستكشاف.',
    'work.scrollLeft': 'اسحب لليسار',
    'work.scrollRight': 'اسحب لليمين',

    // TechStack
    'stack.eyebrow': 'التقنيات',
    'stack.title': 'التقنيات اللي بشتغل بيها يوميًا.',
    'stack.client': 'العميل',
    'stack.client.detail': 'طبقة العرض',
    'stack.app': 'التطبيق',
    'stack.app.detail': 'طبقة API والمنطق',
    'stack.data': 'البيانات',
    'stack.data.detail': 'طبقة التخزين',
    'stack.infra': 'البنية التحتية',
    'stack.infra.detail': 'طبقة التشغيل والنشر',

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
