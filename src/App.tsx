import { I18nProvider, useTranslation } from '@/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/Hero/Hero';
import ServicesGrid from '@/components/Services/ServicesGrid';
import WorksSection from '@/components/Work/WorksSection';
import TechStackSection from '@/components/TechStack/TechStackSection';
import CTASection from '@/components/CTA/CTASection';
import WhatsAppFloat from '@/components/layout/WhatsAppFloat';

function AppContent() {
  const { dir, lang } = useTranslation();

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${lang === 'ar' ? 'font-arabic' : ''}`} dir={dir}>
      <Navbar />
      <main>
        <Hero />
        <ServicesGrid />
        <WorksSection />
        <TechStackSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
