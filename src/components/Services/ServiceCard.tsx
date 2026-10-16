import { useTilt } from '@/hooks/useTilt';

export interface Tool {
  name: string;
  icon?: string;
}

export interface Service {
  index: string;
  title: string;
  description: string;
  stack: Tool[];
  span?: string;
  accent?: 'cyan' | 'violet';
}

export default function ServiceCard({ service }: { service: Service }) {
  const tiltRef = useTilt<HTMLDivElement>(6);
  const accent = service.accent === 'violet' ? 'violet' : 'cyan';

  return (
    <div
      ref={tiltRef}
      className="card-surface group relative flex h-full flex-col justify-between p-6 sm:p-7 md:p-8 rounded-3xl border border-ink-600/80 bg-ink-900/60 backdrop-blur-xl transition-all duration-300 hover:border-cyan/50 hover:shadow-glow will-change-transform"
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full ${accent === 'violet' ? 'bg-violet/15' : 'bg-cyan/15'} blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40`}
      />
      
      <div className="relative">
        <span className="font-mono text-xs font-semibold text-cyan/80 tracking-wider">{service.index}</span>
        <h3 className="mt-3 text-xl font-bold text-text sm:mt-4 sm:text-2xl">{service.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {service.description}
        </p>
      </div>

      <ul className="relative mt-7 flex flex-wrap gap-2 sm:mt-8">
        {service.stack.map((tool) => (
          <li
            key={tool.name}
            dir="ltr"
            className="flex items-center gap-2 rounded-full border border-ink-600/90 bg-ink-950/85 px-3 py-1.5 text-text transition-all duration-200 hover:border-cyan/60 hover:text-cyan hover:shadow-sm"
          >
            {tool.icon && (
              <img
                src={tool.icon}
                alt=""
                className="h-4 w-4 shrink-0 object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span className="text-[11px] font-mono font-medium sm:text-xs">{tool.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}