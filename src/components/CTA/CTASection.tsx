import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTranslation } from '@/i18n';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang } = useTranslation();

  const whatsappUrl = lang === 'ar'
    ? "https://wa.me/201093299050?text=" + encodeURIComponent("مرحباً محمد، أنا مهتم بمناقشة مشروع معك.")
    : "https://wa.me/201093299050?text=" + encodeURIComponent("Hi Mohamed, I am interested in discussing a project with you.");

  useEffect(() => {
    if (!ref.current) return;
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      once: true,
      onEnter: () =>
        gsap.fromTo(
          ref.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
        ),
    });
    return () => trigger.kill();
  }, []);

  return (
    <section id="contact" className="relative py-16 sm:py-24 md:py-36">
      <div className="section-shell">
        <div
          ref={ref}
          className="card-surface relative overflow-hidden px-5 py-12 text-center sm:px-8 sm:py-16 md:px-16"
        >
          <div className="absolute inset-0 bg-blueprint-grid bg-blueprint opacity-20" />
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/20 blur-3xl" />

          <div className="relative">
            <p className="eyebrow flex justify-center">{t('cta.eyebrow')}</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-semibold text-text sm:text-3xl md:text-5xl">
              {t('cta.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-text-muted sm:mt-5 sm:text-base">
              {t('cta.subtitle')}
            </p>
            <div className="mt-8 flex justify-center sm:mt-10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group inline-flex w-full max-w-sm items-center justify-center gap-3 px-6 py-3.5 font-mono text-sm font-semibold shadow-glow hover:shadow-[0_0_55px_-5px_rgba(94,235,255,0.5)] sm:w-auto sm:max-w-none sm:px-8 sm:py-4 sm:text-base"
              >
                <svg
                  className="h-6 w-6 fill-current text-ink-950 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.07 1.95 11.878 1.95c-5.43 0-9.854 4.382-9.858 9.811-.002 1.773.486 3.505 1.411 4.994l-1.025 3.732 3.841-.989zm11.366-5.83c-.327-.162-1.926-.938-2.222-1.045-.296-.108-.513-.162-.73.162-.216.324-.836 1.045-1.025 1.262-.19.216-.379.243-.706.082-.327-.162-1.38-.501-2.628-1.597-.972-.854-1.628-1.909-1.82-2.233-.19-.324-.02-.5-.183-.661-.147-.146-.327-.379-.49-.569-.163-.189-.217-.324-.327-.54-.109-.217-.054-.405-.027-.567.027-.162.216-.513.324-.676.108-.162.144-.27.216-.405.072-.135.036-.254-.009-.416-.045-.162-.433-1.026-.593-1.405-.156-.373-.31-.322-.425-.327-.109-.005-.234-.006-.359-.006-.125 0-.327.046-.499.23-.172.184-.656.634-.656 1.546 0 .912.672 1.792.766 1.916.094.124 1.323 1.988 3.2 2.784.447.19.796.303 1.069.387.449.141.858.121 1.182.074.362-.052 1.926-.774 2.197-1.488.271-.714.271-1.326.19-1.455-.08-.129-.296-.208-.623-.37z" />
                </svg>
                {t('cta.submit')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
