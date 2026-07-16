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
  span?: string; // extra grid utility classes for bento asymmetry
  accent?: 'cyan' | 'violet';
}

export default function ServiceCard({ service }: { service: Service }) {
  const tiltRef = useTilt<HTMLDivElement>(8);
  const accent = service.accent === 'violet' ? 'violet' : 'cyan';

  return (
    <div
      ref={tiltRef}
      className="card-surface group flex h-full flex-col justify-between p-5 will-change-transform sm:p-6 md:p-8"
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full ${accent === 'violet' ? 'bg-violet/10' : 'bg-cyan/10'} blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0`}
      />
      <div className="relative">
        <span className="font-mono text-xs text-text-dim">{service.index}</span>
        <h3 className="mt-3 text-xl font-semibold text-text sm:mt-4 sm:text-2xl">{service.title}</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
          {service.description}
        </p>
      </div>
      <ul className="relative mt-6 flex flex-wrap gap-2 sm:mt-8">
        {service.stack.map((tool) => (
          <li
            key={tool.name}
            className="flex items-center gap-2 rounded-full border border-ink-600 bg-ink-950/80 px-3 py-1.5 text-text-muted transition hover:border-cyan/50 hover:text-cyan sm:gap-2.5 sm:px-3.5 sm:py-2"
          >
            {tool.icon ? (
              <img
                src={tool.icon}
                alt=""
                className="h-4 w-4 shrink-0 rounded-sm bg-white/10 p-0.5 object-contain sm:h-5 sm:w-5"
                loading="lazy"
              />
            ) : (
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-sm bg-ink-800 text-[10px] uppercase text-text-dim sm:h-5 sm:w-5">
                {tool.name.slice(0, 1)}
              </span>
            )}
            <span className="text-[11px] font-mono sm:text-xs">{tool.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
