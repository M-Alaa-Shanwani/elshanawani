import { useEffect, useRef } from 'react';
import WorkCard, { type WorkItem } from './WorkCard';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTranslation } from '@/i18n';

const works: WorkItem[] = [
  {
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Hospitality dashboard showing revenue and occupancy analytics',
    title: 'Coastline Analytics — hospitality revenue intelligence',
    role: 'Product design & frontend',
    description:
      'A live analytics suite for coastal hotels and resorts, tracking occupancy, ADR, RevPAR, and cross-property scorecards with built-in forecasting and team alerts.',
    tags: ['React', 'TypeScript', 'Chart.js', 'Tailwind', 'REST API'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Mobile health app showing appointment scheduling and patient data',
    title: 'Nova Health — patient intake mobile experience',
    role: 'Mobile product & UX',
    description:
      'A patient-first intake app for clinics and telehealth teams, with secure records, dynamic symptom triage, and in-app appointment booking for fast, modern care.',
    tags: ['React Native', 'Expo', 'Figma', 'Firebase', 'HIPAA'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Corporate finance portal with charts and cash-flow metrics',
    title: 'Atlas Finance — treasury & cashflow portal',
    role: 'Full-stack product delivery',
    description:
      'A treasury management portal for mid-market finance teams, featuring cash forecasting, bank connectivity, approvals, and compliance workflows in a single secure dashboard.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'OAuth', 'Kubernetes'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Omnichannel retail operations interface with product inventory views',
    title: 'Aether Retail — omnichannel commerce platform',
    role: 'Platform engineering',
    description:
      'A unified operations dashboard for retail teams to manage inventory, POS, online orders and fulfillment across stores and marketplaces.',
    tags: ['Vue', 'Shopify', 'GraphQL', 'Microservices', 'PWA'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Solar energy monitoring dashboard with performance metrics',
    title: 'GreenGrid — renewable asset monitoring',
    role: 'Data platform & UX',
    description:
      'A monitoring platform for solar farms that visualizes live output, device health, and maintenance schedules using telemetry from distributed inverters.',
    tags: ['Svelte', 'AWS', 'IoT', 'DataViz', 'Tailwind'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Fleet tracking dashboard with route maps and vehicle status',
    title: 'PulseFleet — delivery operations command center',
    role: 'UX strategy & frontend',
    description:
      'A dispatch and fleet visibility solution for logistics teams, with live route tracking, ETA optimization, and driver performance analytics.',
    tags: ['React', 'Mapbox', 'Node.js', 'PostgreSQL', 'Realtime'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Sales pipeline dashboard for B2B customer relationship management',
    title: 'Orchid CRM — B2B pipeline intelligence',
    role: 'CRM product and integrations',
    description:
      'A CRM built for specialist sales teams, with deal scoring, automated touchpoints, and custom account hierarchies that mirror complex B2B relationships.',
    tags: ['React', 'Python', 'Salesforce', 'Zapier', 'API'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Home automation dashboard showing room controls and device status',
    title: 'Rover Home — smart home control console',
    role: 'IoT UX & integration',
    description:
      'A control console for connected homes that brings lighting, climate, security, and media into one elegant interface with voice assistant support.',
    tags: ['React', 'MQTT', 'Smart Home', 'WebSockets', 'UI Design'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Creative production planner with scheduling and tasks',
    title: 'Muse Studio — creative production planner',
    role: 'Product design & implementation',
    description:
      'A planning tool for creative agencies to run briefs, timelines, asset approvals and resource planning across studios, clients and campaigns.',
    tags: ['Figma', 'React', 'Prisma', 'Tailwind', 'Notion Sync'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Legal compliance dashboard with task workflows and status cards',
    title: 'Beacon Legal — compliance workflow platform',
    role: 'Enterprise SaaS delivery',
    description:
      'A workflow platform for legal teams managing risk, audits and policy approvals with document metadata, reminders, and evidence logging.',
    tags: ['Angular', 'Azure', 'Microfrontend', 'Security', 'Workflow'],
  },
];

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('[data-work-card]');
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          cards,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
        );
      },
    });
    return () => trigger.kill();
  }, []);

  // Autoplay carousel on all screen sizes
  useEffect(() => {
    const timer = setInterval(() => {
      if (isHovered.current || !sliderRef.current) return;

      const el = sliderRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const firstCard = el.querySelector('[data-work-card]');
        const scrollAmount = firstCard ? firstCard.clientWidth + 12 : el.clientWidth * 0.2;
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.querySelector('[data-work-card]');
    const step = firstCard ? firstCard.clientWidth + 12 : Math.round(sliderRef.current.clientWidth * 0.75);
    sliderRef.current.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <section id="work" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36">
      <div className="section-shell">
        <p className="eyebrow">{t('work.eyebrow')}</p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="max-w-xl text-2xl font-semibold text-text sm:text-3xl md:text-4xl">
              {t('work.title')}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-text-muted sm:mt-4 sm:text-base">
              {t('work.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              aria-label={t('work.scrollLeft')}
              onClick={() => scroll('left')}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 bg-ink-950/70 text-xl text-text transition hover:border-cyan hover:text-cyan sm:h-11 sm:w-11"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={t('work.scrollRight')}
              onClick={() => scroll('right')}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 bg-ink-950/70 text-xl text-text transition hover:border-cyan hover:text-cyan sm:h-11 sm:w-11"
            >
              ›
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden text-left sm:mt-10" dir="ltr">
          <div
            ref={sliderRef}
            onMouseEnter={() => { isHovered.current = true; }}
            onMouseLeave={() => { isHovered.current = false; }}
            onTouchStart={() => { isHovered.current = true; }}
            onTouchEnd={() => { isHovered.current = false; }}
            className="flex gap-3 overflow-x-auto pb-6 pr-2 scroll-smooth snap-x snap-mandatory touch-pan-x work-carousel"
            aria-label="Selected work carousel"
          >
            <div className="flex gap-3">
              {works.map((item) => (
                <div
                  data-work-card
                  key={item.title}
                  className="w-[200px] flex-shrink-0 snap-start sm:w-[220px] md:w-[240px]"
                >
                  <WorkCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
