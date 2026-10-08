import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import FunnelAirportTransfer from '@/components/FunnelAirportTransfer';
import Header from '@/components/Header';
import { buildHreflang, OG_LOCALE } from '@/lib/hreflang';
import { getTranslation, LANGS, type Lang } from '@/lib/translations';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  return {
    title: t.meta_flug_title,
    description: t.meta_flug_desc,
    alternates: {
      canonical: `/${lang}/flughafentransfer/`,
      languages: buildHreflang('flughafentransfer/'),
    },
    openGraph: {
      title: t.meta_flug_title,
      description: t.meta_flug_desc,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

export default async function FlughafentransferPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  const langLinks = Object.fromEntries(
    LANGS.map((l) => [l, `/${l}/flughafentransfer/`]),
  ) as Record<Lang, string>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Taxi-Alica Freiburg',
    description: t.meta_flug_desc,
    url: `https://taxi-alica.de/${lang}/flughafentransfer/`,
    telephone: '+4976115537668',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bötzinger Str. 66',
      postalCode: '79111',
      addressLocality: 'Freiburg im Breisgau',
      addressRegion: 'Baden-Württemberg',
      addressCountry: 'DE',
    },
    areaServed: [
      { '@type': 'City', name: 'Freiburg im Breisgau' },
      { '@type': 'Airport', name: 'EuroAirport Basel-Mulhouse-Freiburg' },
      { '@type': 'Airport', name: 'Flughafen Stuttgart' },
      { '@type': 'Airport', name: 'Flughafen Frankfurt' },
      { '@type': 'Airport', name: 'Karlsruhe / Baden-Baden Airport' },
      { '@type': 'Airport', name: 'München International Airport' },
    ],
    priceRange: '€€',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page-wrapper">
        <Header t={t} lang={lang as Lang} langLinks={langLinks} />
        <main>
          <FunnelAirportTransfer t={t} />
        </main>
        <ContactForm t={t} />
        <Footer t={t} lang={lang} />
      </div>
    </>
  );
}
