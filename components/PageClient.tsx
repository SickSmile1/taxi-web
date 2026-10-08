'use client';

import { PHONE_TEL, PhoneIcon } from '@/lib/constants';
import type { Lang, Translations } from '@/lib/translations';
import ContactForm from './ContactForm';
import Footer from './Footer';
import Header from './Header';
import AboutSection from './home/AboutSection';
import HeroSection from './home/HeroSection';
import ServiceArea from './home/ServiceArea';
import MapIsland from './MapIsland';

interface Props {
  t: Translations;
  lang: Lang;
  isRtl: boolean;
  langLinks: Record<Lang, string>;
}

export default function PageClient({ t, lang, isRtl, langLinks }: Props) {
  return (
    <div className="page-wrapper">
      <Header t={t} lang={lang} langLinks={langLinks} />

      <HeroSection t={t} lang={lang} isRtl={isRtl} />

      <ServiceArea t={t} />

      <section className="map-section">
        <MapIsland t={t} />
      </section>

      <AboutSection t={t} lang={lang} />

      <ContactForm t={t} />
      <Footer t={t} lang={lang} />

      {/* Mobile Floating Click-to-Call Button */}
      <a
        href={`tel:${PHONE_TEL}`}
        className="mobile-call-float"
        aria-label="Sofort Taxi anrufen"
      >
        <PhoneIcon color="var(--bg-page)" size={19} />
        <span>Jetzt anrufen</span>
      </a>
    </div>
  );
}
