import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n';

export default function Navbar() {
  const { t, lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#about', label: lang === 'ar' ? 'من أنا' : 'About' },
    { href: '#services', label: t('nav.capabilities') },
    { href: '#work', label: t('nav.work') },
    { href: '#process', label: t('nav.stack') },
    { href: '#contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-700/60 bg-ink-950/70 backdrop-blur-md">
      <nav className="section-shell flex h-14 items-center justify-between sm:h-16">
        <a
          href="#hero"
          onClick={close}
          className="font-display text-base font-semibold tracking-tight text-text sm:text-lg"
        >
          {t('nav.brand')}
          <span className="text-cyan">.</span>
        </a>

        <ul className="hidden items-center gap-6 font-mono text-sm text-text-muted lg:gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-cyan">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="rounded-full border border-ink-600 px-2.5 py-1.5 font-mono text-[11px] text-text-muted transition-colors hover:border-cyan/60 hover:text-cyan sm:px-3 sm:text-xs"
          >
            {t('nav.langToggle')}
          </button>
          <a
            href="#contact"
            onClick={close}
            className="btn-ghost !hidden !px-4 !py-2 text-xs sm:!inline-flex"
          >
            {t('nav.cta')}
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 text-text md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? (lang === 'ar' ? 'إغلاق القائمة' : 'Close menu') : lang === 'ar' ? 'فتح القائمة' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close' : 'Menu'}</span>
            <span className="relative block h-3.5 w-4" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-transform duration-200 ${open ? 'translate-y-[6px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-[6px] h-0.5 w-full rounded bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute left-0 top-[12px] h-0.5 w-full rounded bg-current transition-transform duration-200 ${open ? '-translate-y-[6px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`border-t border-ink-700/60 bg-ink-950/95 backdrop-blur-md md:hidden ${open ? 'block' : 'hidden'}`}
      >
        <ul className="section-shell flex flex-col gap-1 py-4 font-mono text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={close}
                className="block rounded-xl px-3 py-3 text-text-muted transition-colors hover:bg-ink-800 hover:text-cyan"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a href="#contact" onClick={close} className="btn-primary w-full justify-center">
              {t('nav.cta')}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
