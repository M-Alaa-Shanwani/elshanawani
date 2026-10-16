import { useTranslation } from '@/i18n';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-ink-700/60 py-6 pb-24 sm:py-10">
      <div className="section-shell flex flex-col items-center justify-between gap-2.5 text-center font-mono text-[10px] xs:text-[11px] text-text-dim sm:gap-4 sm:text-xs md:flex-row md:text-left">
        <span>{t('footer.copy', { year: new Date().getFullYear().toString() })}</span>
        <span>{t('footer.tagline')}</span>
      </div>
    </footer>
  );
}
