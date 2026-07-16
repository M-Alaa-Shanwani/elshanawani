import { useEffect, useRef } from 'react';
import ServiceCard, { type Service } from './ServiceCard';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTranslation } from '@/i18n';

export default function ServicesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const services: Service[] = [
    {
      index: '01',
      title: t('services.web.title'),
      description: t('services.web.desc'),
      stack: [
        { name: 'ASP.NET Core', icon: 'https://cdn.simpleicons.org/dotnet/512bd4' },
        { name: 'Angular', icon: 'https://cdn.simpleicons.org/angular/dd0031' },
        { name: 'ABP.io', icon: 'https://cdn.simpleicons.org/dotnet/512bd4' },
        { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169e1' },
      ],
      span: 'sm:col-span-2 lg:col-span-2',
      accent: 'cyan',
    },
    {
      index: '02',
      title: t('services.mobile.title'),
      description: t('services.mobile.desc'),
      stack: [
        { name: 'React Native', icon: 'https://cdn.simpleicons.org/react/61dafb' },
        { name: 'Kotlin', icon: 'https://cdn.simpleicons.org/kotlin/7f52ff' },
        { name: 'Swift', icon: 'https://cdn.simpleicons.org/swift/f05138' },
      ],
      accent: 'violet',
    },
    {
      index: '03',
      title: t('services.uiux.title'),
      description: t('services.uiux.desc'),
      stack: [
        { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma/f24e1e' },
        { name: 'Design Systems', icon: 'https://cdn.simpleicons.org/storybook/ff4785' },
        { name: 'Prototyping', icon: 'https://cdn.simpleicons.org/framer/0055ff' },
      ],
      accent: 'cyan',
    },
    {
      index: '04',
      title: t('services.qa.title'),
      description: t('services.qa.desc'),
      stack: [
        { name: 'Playwright', icon: 'https://cdn.simpleicons.org/playwright/2EAD33' },
        { name: 'xUnit', icon: 'https://cdn.simpleicons.org/dotnet/512bd4' },
        { name: 'CI Pipelines', icon: 'https://cdn.simpleicons.org/githubactions/2088FF' },
        { name: 'Load Testing', icon: 'https://cdn.simpleicons.org/k6/7D64FF' },
      ],
      span: 'sm:col-span-2 lg:col-span-2',
      accent: 'violet',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('[data-card]');
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      onEnter: () => {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
      },
      once: true,
    });
    return () => trigger.kill();
  }, []);

  return (
    <section id="services" className="relative py-16 sm:py-24 md:py-36">
      <div className="section-shell">
        <p className="eyebrow">{t('services.eyebrow')}</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold text-text sm:mt-4 sm:text-3xl md:text-4xl">
          {t('services.title')}
        </h2>
        <div ref={sectionRef} className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <div data-card key={service.index} className={`min-w-0 ${service.span ?? ''}`}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
