import { useTilt } from '@/hooks/useTilt';

export interface WorkItem {
  image: string;
  imageAlt: string;
  title: string;
  role: string;
  description: string;
  tags: string[];
  /** True until the placeholder art in /public/work is swapped for a real
   *  screenshot — renders a visible "placeholder" ribbon so nobody mistakes
   *  it for a finished asset. Remove/flip this once you add the real image. */
  isPlaceholderImage?: boolean;
}

export default function WorkCard({ item }: { item: WorkItem }) {
  const tiltRef = useTilt<HTMLDivElement>(6);

  return (
    <div ref={tiltRef} className="card-surface group flex h-full flex-col will-change-transform">
      {/* Browser screenshot frame */}
      <div className="relative w-full overflow-hidden border-b border-ink-600 bg-ink-900">
        {/* Chrome / title bar */}
        <div className="relative z-10 flex items-center gap-2 border-b border-ink-600/80 bg-ink-800/90 px-2 py-1.5 backdrop-blur-sm">
          <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
            <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
            <span className="h-2 w-2 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded border border-ink-600/70 bg-ink-950/70 px-2 py-0.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full border border-cyan/40 bg-cyan/20"
              aria-hidden="true"
            />
            <span className="truncate font-mono text-[8px] text-text-dim">
              https://app.example.com
            </span>
          </div>
        </div>

        {/* Viewport / screenshot area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-950">
          <img
            src={item.image}
            alt={item.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),inset_0_8px_20px_rgba(0,0,0,0.35)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25"
            aria-hidden="true"
          />
          {item.isPlaceholderImage && (
            <span className="absolute right-2 top-2 z-10 rounded-full bg-ink-950/80 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wide text-cyan backdrop-blur-sm">
              Placeholder
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <span className="font-mono text-[9px] text-text-dim">{item.role}</span>
        <h3 className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-text">
          {item.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-text-muted">
          {item.description}
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-ink-600 px-1.5 py-0.5 font-mono text-[8px] text-text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
