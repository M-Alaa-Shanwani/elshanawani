import { useTranslation } from '@/i18n';

export default function WhatsAppFloat() {
    const { lang } = useTranslation();

    const message = lang === 'ar'
        ? encodeURIComponent("مرحباً محمد، أنا مهتم بمناقشة مشروع معك.")
        : encodeURIComponent("Hi Mohamed, I am interested in discussing a project with you.");

    const whatsappUrl = `https://wa.me/201093299050?text=${message}`;
    const tooltipText = lang === 'ar' ? 'تواصل عبر واتس اب' : 'Chat on WhatsApp';

    return (
        <div className="fixed bottom-4 right-4 z-40 select-none group sm:bottom-6 sm:right-6 rtl:left-4 rtl:right-auto sm:rtl:left-6"
             style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
            {/* Tooltip */}
            <span className="pointer-events-none absolute bottom-full right-0 mb-3 hidden translate-y-2 whitespace-nowrap rounded-lg border border-ink-600 bg-ink-900/90 px-3 py-1.5 font-mono text-xs text-text opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block rtl:left-0 rtl:right-auto">
                {tooltipText}
            </span>

            {/* Pulsing Shadow Glow Ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366]/40 opacity-75 animate-ping" />

            {/* Main Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Contact"
                className="relative flex h-11 w-11 xs:h-12 xs:w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-black shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 group-hover:shadow-[0_0_35px_rgba(37,211,102,0.85)]"
            >
                <svg
                    className="h-5 w-5 xs:h-5.5 xs:w-5.5 sm:h-7 sm:w-7 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.07 1.95 11.878 1.95c-5.43 0-9.854 4.382-9.858 9.811-.002 1.773.486 3.505 1.411 4.994l-1.025 3.732 3.841-.989zm11.366-5.83c-.327-.162-1.926-.938-2.222-1.045-.296-.108-.513-.162-.73.162-.216.324-.836 1.045-1.025 1.262-.19.216-.379.243-.706.082-.327-.162-1.38-.501-2.628-1.597-.972-.854-1.628-1.909-1.82-2.233-.19-.324-.02-.5-.183-.661-.147-.146-.327-.379-.49-.569-.163-.189-.217-.324-.327-.54-.109-.217-.054-.405-.027-.567.027-.162.216-.513.324-.676.108-.162.144-.27.216-.405.072-.135.036-.254-.009-.416-.045-.162-.433-1.026-.593-1.405-.156-.373-.31-.322-.425-.327-.109-.005-.234-.006-.359-.006-.125 0-.327.046-.499.23-.172.184-.656.634-.656 1.546 0 .912.672 1.792.766 1.916.094.124 1.323 1.988 3.2 2.784.447.19.796.303 1.069.387.449.141.858.121 1.182.074.362-.052 1.926-.774 2.197-1.488.271-.714.271-1.326.19-1.455-.08-.129-.296-.208-.623-.37z" />
                </svg>
            </a>
        </div>
    );
}
