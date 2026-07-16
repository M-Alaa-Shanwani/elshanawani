import { useState, type ReactNode } from 'react';
import { useTranslation } from '@/i18n';

interface StackTool {
  name: string;
  icon: string;
}

interface Layer {
  labelKey: 'stack.client' | 'stack.app' | 'stack.data' | 'stack.infra';
  detailKey: 'stack.client.detail' | 'stack.app.detail' | 'stack.data.detail' | 'stack.infra.detail';
  tools: StackTool[];
  proficiency: number;
  dashArray: string;
  accent: 'cyan' | 'violet';
  logo: ReactNode;
}

function LayerLogo({
  accent,
  children,
}: {
  accent: 'cyan' | 'violet';
  children: ReactNode;
}) {
  const color = accent === 'violet' ? 'text-violet' : 'text-cyan';
  const glow =
    accent === 'violet'
      ? 'drop-shadow-[0_0_18px_rgba(157,124,255,0.45)]'
      : 'drop-shadow-[0_0_18px_rgba(94,235,255,0.45)]';

  return (
    <svg
      className={`h-12 w-12 sm:h-20 sm:w-20 md:h-40 md:w-40 ${color} ${glow}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {children}
    </svg>
  );
}

export default function TechStackSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, lang } = useTranslation();

  const layers: Layer[] = [
    {
      labelKey: 'stack.client',
      detailKey: 'stack.client.detail',
      tools: [
        { name: 'Angular', icon: 'https://cdn.simpleicons.org/angular/dd0031' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178c6' },
        { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06b6d4' },
        { name: 'RxJS', icon: 'https://cdn.simpleicons.org/reactivex/b7178c' },
      ],
      proficiency: 95,
      dashArray: '280, 295',
      accent: 'cyan',
      logo: (
        <LayerLogo accent="cyan">
          <rect x="2" y="3" width="20" height="15" rx="2" />
          <path d="M6 10l3 3-3 3M11 15h7M2 18h20" strokeLinecap="round" strokeLinejoin="round" />
        </LayerLogo>
      ),
    },
    {
      labelKey: 'stack.app',
      detailKey: 'stack.app.detail',
      tools: [
        { name: 'ASP.NET Core', icon: 'https://cdn.simpleicons.org/dotnet/512bd4' },
        { name: 'ABP.io', icon: 'https://cdn.simpleicons.org/dotnet/512bd4' },
        { name: 'CQRS', icon: 'https://cdn.simpleicons.org/graphql/e10098' },
        { name: 'AutoMapper', icon: 'https://cdn.simpleicons.org/csharp/239120' },
      ],
      proficiency: 90,
      dashArray: '266, 295',
      accent: 'violet',
      logo: (
        <LayerLogo accent="violet">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path
            d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <line x1="12" y1="5" x2="12" y2="12" />
        </LayerLogo>
      ),
    },
    {
      labelKey: 'stack.data',
      detailKey: 'stack.data.detail',
      tools: [
        { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169e1' },
        { name: 'SQL Server', icon: 'https://cdn.simpleicons.org/microsoftsqlserver/CC2927' },
        { name: 'EF Core', icon: 'https://cdn.simpleicons.org/dotnet/512bd4' },
        { name: 'Redis', icon: 'https://cdn.simpleicons.org/redis/DC382D' },
      ],
      proficiency: 85,
      dashArray: '251, 295',
      accent: 'cyan',
      logo: (
        <LayerLogo accent="cyan">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </LayerLogo>
      ),
    },
    {
      labelKey: 'stack.infra',
      detailKey: 'stack.infra.detail',
      tools: [
        { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
        { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
        { name: 'Azure DevOps', icon: 'https://cdn.simpleicons.org/azuredevops/0078D7' },
        { name: 'GitHub Actions', icon: 'https://cdn.simpleicons.org/githubactions/2088FF' },
      ],
      proficiency: 80,
      dashArray: '236, 295',
      accent: 'violet',
      logo: (
        <LayerLogo accent="violet">
          <path
            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 11v6M9 14h6" strokeLinecap="round" strokeLinejoin="round" />
        </LayerLogo>
      ),
    },
  ];

  const current = layers[activeIndex];

  const next = () => setActiveIndex((prev) => (prev + 1) % layers.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + layers.length) % layers.length);

  return (
    <section id="stack" className="relative py-16 sm:py-24 md:py-36">
      <div className="section-shell">
        <p className="eyebrow">{t('stack.eyebrow')}</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold text-text sm:mt-4 sm:text-3xl md:text-4xl">
          {t('stack.title')}
        </h2>

        {/* Always side-by-side so logo + details show together (including mobile) */}
        <div className="relative mx-auto mt-8 flex w-full max-w-4xl flex-row items-stretch gap-3 sm:mt-12 sm:gap-8 md:mt-16 md:gap-14">
          {/* Graphical Left Section */}
          <div className="relative flex w-[34%] shrink-0 items-center justify-center sm:w-[40%] md:w-[45%]">
            <div
              className={`absolute inset-1 rounded-2xl bg-gradient-to-br opacity-35 transition-all duration-500 sm:inset-3 sm:rounded-3xl md:inset-4 ${
                activeIndex % 2 === 0
                  ? '-rotate-6 from-cyan/35 to-transparent shadow-glow'
                  : 'rotate-6 from-violet/35 to-transparent shadow-glow-violet'
              }`}
            />

            <div className="relative z-10 flex aspect-square w-full max-w-[88px] items-center justify-center rounded-xl border border-ink-600/80 bg-ink-800/80 shadow-xl backdrop-blur-md transition-all duration-500 sm:max-w-[160px] sm:rounded-2xl md:max-w-[256px]">
              <span className="absolute left-1.5 top-1.5 font-mono text-[7px] text-text-dim sm:left-3 sm:top-3 sm:text-[10px]">
                LOGO L{activeIndex + 1}
              </span>
              <div className="transition-all duration-500">{current.logo}</div>
            </div>
          </div>

          {/* Details card */}
          <div className="card-surface relative flex min-w-0 flex-1 flex-col justify-between overflow-hidden border border-ink-600/80 p-3 shadow-lg sm:p-6 md:p-8">
            <div
              className={`absolute right-0 top-0 h-28 w-28 -translate-y-8 translate-x-8 rounded-full opacity-30 blur-3xl transition-all duration-700 sm:h-40 sm:w-40 sm:-translate-y-12 sm:translate-x-12 ${
                current.accent === 'violet' ? 'bg-violet/40' : 'bg-cyan/40'
              }`}
            />

            <div className="relative">
              <span
                className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 sm:text-xs ${
                  current.accent === 'violet' ? 'text-violet' : 'text-cyan'
                }`}
              >
                L{activeIndex + 1} // {t(current.labelKey)}
              </span>

              <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-text transition-all duration-300 sm:mt-4 sm:text-3xl">
                {t(current.labelKey)}
              </h3>

              <p className="mt-1 text-[11px] leading-relaxed text-text-muted sm:mt-4 sm:text-sm">
                {t(current.detailKey)}
              </p>

              <div className="mt-3 flex flex-col gap-3 border-t border-ink-700/60 pt-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-6 sm:pt-6">
                <div className="min-w-0 flex-1 text-left rtl:text-right">
                  <div className="mb-2 font-mono text-[9px] uppercase tracking-wider text-text-dim sm:mb-3 sm:text-[11px]">
                    {lang === 'ar' ? 'أبرز التقنيات' : 'Core Technologies'}
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {current.tools.map((tool) => (
                      <span
                        key={tool.name}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[10px] text-text-muted transition-all duration-300 hover:text-white sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs ${
                          current.accent === 'violet'
                            ? 'border-ink-600 bg-ink-800 hover:border-violet/60'
                            : 'border-ink-600 bg-ink-800 hover:border-cyan/60'
                        }`}
                      >
                        <img
                          src={tool.icon}
                          alt=""
                          className="h-3.5 w-3.5 shrink-0 rounded-sm bg-white/10 p-0.5 object-contain sm:h-4 sm:w-4"
                          loading="lazy"
                        />
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden h-16 w-px shrink-0 bg-ink-700/60 sm:block" />

                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:gap-2">
                  <div className="relative flex h-12 w-12 items-center justify-center sm:h-16 sm:w-16">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="47"
                        stroke="rgba(35, 44, 70, 0.4)"
                        strokeWidth="4.5"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="47"
                        stroke={current.accent === 'violet' ? '#9D7CFF' : '#5EEBFF'}
                        strokeWidth="4.5"
                        strokeDasharray={current.dashArray}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <span className="absolute font-mono text-[11px] font-semibold text-text sm:text-sm">
                      {current.proficiency}%
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-dim sm:text-[10px]">
                    {lang === 'ar' ? 'التمكن' : 'Proficiency'}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-3 flex items-center justify-between border-t border-ink-700/60 pt-3 sm:mt-8 sm:pt-6">
              <span className="font-mono text-[10px] text-text-dim">
                {activeIndex + 1} / {layers.length}
              </span>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous Layer"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ink-600 bg-ink-950/70 text-base text-text transition-all duration-300 hover:border-cyan hover:text-cyan active:translate-x-0 sm:h-11 sm:w-11 sm:text-lg"
                >
                  {lang === 'ar' ? '›' : '‹'}
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next Layer"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ink-600 bg-ink-950/70 text-base text-text transition-all duration-300 hover:border-cyan hover:text-cyan active:translate-x-0 sm:h-11 sm:w-11 sm:text-lg"
                >
                  {lang === 'ar' ? '‹' : '›'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
