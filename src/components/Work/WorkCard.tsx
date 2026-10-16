import { useTilt } from '@/hooks/useTilt';
import { useTranslation } from '@/i18n';

export interface ProjectItem {
  id: string;
  category: 'web' | 'mobile' | 'ecommerce' | 'ai' | 'uiux';
  image: string;
  badge: { ar: string; en: string };
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  metric: { ar: string; en: string };
  tags: string[];
  details: {
    ar: { role: string; highlight: string };
    en: { role: string; highlight: string };
  };
}

interface WorkCardProps {
  project: ProjectItem;
  onOpenDetails: (project: ProjectItem) => void;
}

export default function WorkCard({ project, onOpenDetails }: WorkCardProps) {
  const tiltRef = useTilt<HTMLDivElement>(4);
  const { lang } = useTranslation();
  const isAr = lang === 'ar';

  const badgeText = isAr ? project.badge.ar : project.badge.en;
  const titleText = isAr ? project.title.ar : project.title.en;
  const descText = isAr ? project.desc.ar : project.desc.en;
  const metricText = isAr ? project.metric.ar : project.metric.en;

  const imageSrc = project.image.startsWith('http') || project.image.startsWith(import.meta.env.BASE_URL)
    ? project.image
    : `${import.meta.env.BASE_URL}${project.image.replace(/^\/+/, '')}`;

  return (
    <div
      ref={tiltRef}
      onClick={() => onOpenDetails(project)}
      className="group card-surface relative flex h-full flex-col cursor-pointer overflow-hidden rounded-2xl border border-ink-600/70 bg-ink-900/70 backdrop-blur-md transition-all duration-300 hover:border-cyan/50 hover:shadow-glow will-change-transform"
    >
      {/* Image Preview Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-950">
        <img
          src={imageSrc}
          alt={titleText}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 start-3 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-ink-950/85 px-3 py-1 font-mono text-[11px] font-medium text-cyan backdrop-blur-md shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            {badgeText}
          </span>
        </div>

        {/* Metric Pill */}
        <div className="absolute bottom-3 start-3 z-10">
          <span className="inline-flex items-center rounded-lg border border-white/15 bg-ink-950/90 px-2.5 py-1 text-[11px] font-medium text-text backdrop-blur-md shadow-md">
            {metricText}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4.5 xs:p-5 sm:p-6">
        <h3 className="text-base font-bold text-text transition-colors duration-200 group-hover:text-cyan sm:text-lg">
          {titleText}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-text-muted sm:mt-2.5 sm:text-sm line-clamp-3">
          {descText}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-ink-700/60 sm:mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-ink-700/80 bg-ink-800/80 px-2.5 py-0.5 font-mono text-[10px] text-text-muted transition-colors group-hover:border-ink-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link */}
        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-cyan pt-2 sm:mt-5">
          <span>{isAr ? 'عرض تفاصيل المشروع' : 'View Project Details'}</span>
          <span className="text-sm transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            {isAr ? '←' : '→'}
          </span>
        </div>
      </div>
    </div>
  );
}
