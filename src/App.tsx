import { I18nProvider, useTranslation } from '@/i18n';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/Hero/Hero';
import AboutSection from '@/components/About/AboutSection';
import DemoSection from '@/components/Demo/DemoSection';
import OrbScene from '@/components/Hero/OrbScene';
import ServicesGrid from '@/components/Services/ServicesGrid';
import PartnersMarquee from '@/components/Partners/PartnersMarquee';
import WorksSection from '@/components/Work/WorksSection';
import ProcessSection from '@/components/Process/ProcessSection';
import CTASection from '@/components/CTA/CTASection';
import WhatsAppFloat from '@/components/layout/WhatsAppFloat';

function AppContent() {
  const { dir, lang } = useTranslation();

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${lang === 'ar' ? 'font-arabic' : ''}`} dir={dir}>
      <OrbScene />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <AboutSection />
        <DemoSection />
        <ServicesGrid />
        <PartnersMarquee />
        <WorksSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ThemeProvider>
  );
}
