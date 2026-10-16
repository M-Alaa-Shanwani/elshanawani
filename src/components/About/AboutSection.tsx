import { useTranslation } from '@/i18n';

export default function AboutSection() {
  const { lang } = useTranslation();
  const isAr = lang === 'ar';

  return (
    <section id="about" className="relative py-16 sm:py-24 md:py-36 overflow-hidden">
      {/* Seamless blend from Hero into About section */}
      <div className="absolute top-0 left-0 right-0 h-40 sm:h-56 pointer-events-none z-0 bg-gradient-to-b from-ink-950 via-ink-950/80 to-transparent" />

      <div className="section-shell relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 sm:gap-8 lg:gap-16 items-center">
          
          {/* Photo Column - on desktop and tablet (sm:col-span-5) */}
          <div className="hidden sm:flex sm:col-span-5 justify-center">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-ink-700/50">
              <img
                src="/about-me.jpg"
                alt="Mohamed Alaa"
                loading="lazy"
                className="h-full w-full object-cover object-center aspect-[3/4]"
              />
            </div>
          </div>

          {/* Content Column (sm:col-span-7) */}
          <div className="sm:col-span-7">
            {/* Mobile Header with Side-by-Side Photo (below sm: 640px) */}
            <div className="flex sm:hidden items-center gap-3.5 xs:gap-4 mb-5">
              <div className="relative w-24 xs:w-28 shrink-0 overflow-hidden rounded-2xl shadow-xl border border-ink-700/50 aspect-[3/4]">
                <img
                  src="/about-me.jpg"
                  alt="Mohamed Alaa"
                  loading="lazy"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="eyebrow">{isAr ? 'من أنا' : 'About Me'}</p>
                <h2 className="mt-1 text-base xs:text-lg font-bold tracking-tight text-text leading-[1.25]">
                  {isAr ? (
                    <>
                      أهندس حلولاً برمجية،{' '}
                      <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                        تصنع فارقاً حقيقياً
                      </span>
                    </>
                  ) : (
                    <>
                      Engineering systems,{' '}
                      <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                        crafting experiences
                      </span>
                    </>
                  )}
                </h2>
              </div>
            </div>

            {/* Desktop / Tablet Heading (sm and up) */}
            <div className="hidden sm:block">
              <p className="eyebrow">{isAr ? 'من أنا' : 'About Me'}</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:mt-4 sm:text-3xl md:text-5xl leading-[1.15]">
                {isAr ? (
                  <>
                    أهندس حلولاً برمجية متكاملة،{' '}
                    <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                      تصنع فارقاً حقيقياً
                    </span>{' '}
                    في نجاح الأعمال.
                  </>
                ) : (
                  <>
                    Engineering resilient systems,{' '}
                    <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                      crafting experiences
                    </span>{' '}
                    that scale effortlessly.
                  </>
                )}
              </h2>
            </div>

            <p className="mt-3 sm:mt-5 text-sm sm:text-base leading-relaxed text-text-muted">
              {isAr
                ? 'أنا محمد علاء، مطور Full-Stack ومصمم UI/UX متخصص في تحويل الأفكار المعقدة إلى منتجات رقمية عالية الكفاءة والقابلية للتوسع. أجمع بين قوة الباك إند والمعماريات الموزعة (.NET Core, Microservices, Domain-Driven Design) وبين دقة الواجهات الأمامية التفاعلية وتصميم المنتجات (Angular, React, Figma).'
                : 'I am Mohamed Alaa, a Full-Stack Engineer and Product Designer focused on shipping mission-critical web platforms, enterprise systems, and mobile applications. I bridge backend architecture (.NET, ABP.io, Distributed Systems) with modern frontend development and refined UI/UX workflows.'}
            </p>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-text-muted">
              {isAr
                ? 'فلسفتي في العمل قائمة على الدقة والمسؤولية الكاملة (End-to-End Ownership)؛ أبدأ معك من مرحلة دراسة متطلبات المشروع وهندسة تجربة المستخدم وحتى كتابة الكود النظيف والنشر السحابي، لضمان استقرار وسرعة كل مليمتر في النظام.'
                : 'My approach centers on end-to-end ownership. From user research and interactive wireframes to schema design, clean API implementation, and cloud deployment — every layer is built to withstand real-world production demands.'}
            </p>

            {/* Feature Highlights Grid - ALWAYS 3 COLUMNS SIDE-BY-SIDE */}
            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="rounded-xl sm:rounded-2xl border border-ink-600/70 bg-ink-900/60 p-2.5 sm:p-4 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:border-cyan/40">
                <div>
                  <span className="text-base sm:text-xl">⚡</span>
                  <h4 className="mt-1 sm:mt-2 text-[11px] sm:text-sm font-bold text-text leading-tight">
                    {isAr ? 'معمارية متينة' : 'Robust Architecture'}
                  </h4>
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-text-muted leading-tight sm:leading-relaxed">
                  {isAr
                    ? 'Clean Architecture و DDD لملايين الطلبات.'
                    : 'Clean Architecture & DDD for scale.'}
                </p>
              </div>

              <div className="rounded-xl sm:rounded-2xl border border-ink-600/70 bg-ink-900/60 p-2.5 sm:p-4 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:border-violet/40">
                <div>
                  <span className="text-base sm:text-xl">🎨</span>
                  <h4 className="mt-1 sm:mt-2 text-[11px] sm:text-sm font-bold text-text leading-tight">
                    {isAr ? 'تصميم مخصص' : 'Bespoke UI/UX'}
                  </h4>
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-text-muted leading-tight sm:leading-relaxed">
                  {isAr
                    ? 'واجهات مدروسة بتدفقات سلسة وحقيقية.'
                    : 'Human-centered designs from real flows.'}
                </p>
              </div>

              <div className="rounded-xl sm:rounded-2xl border border-ink-600/70 bg-ink-900/60 p-2.5 sm:p-4 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:border-cyan/40">
                <div>
                  <span className="text-base sm:text-xl">🚀</span>
                  <h4 className="mt-1 sm:mt-2 text-[11px] sm:text-sm font-bold text-text leading-tight">
                    {isAr ? 'شحن سريع وموثوق' : 'Production Delivery'}
                  </h4>
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-text-muted leading-tight sm:leading-relaxed">
                  {isAr
                    ? 'التزام بالمواعيد مع تغطية اختبار كاملة.'
                    : 'On-time milestones with automated QA.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <a href="#contact" className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3">
                {isAr ? 'دعنا نتحدث عن مشروعك' : "Let's Build Something Great"}
              </a>
              <a href="#work" className="btn-ghost text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3">
                {isAr ? 'استعراض المشاريع' : 'Explore My Work'}
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
