import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import {
  ADDRESS_CITY,
  ADDRESS_STREET,
  ADDRESS_ZIP,
  PHONE_TEL,
} from '@/lib/constants';
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
    title: t.meta_kontakt_title,
    description: t.meta_kontakt_desc,
    alternates: {
      canonical: `/${lang}/kontakt/`,
      languages: buildHreflang('kontakt/'),
    },
    openGraph: {
      title: t.meta_kontakt_title,
      description: t.meta_kontakt_desc,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  const langLinks = Object.fromEntries(
    LANGS.map((l) => [l, `/${l}/kontakt/`]),
  ) as Record<Lang, string>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Taxi-Alica Freiburg',
    description: t.meta_kontakt_desc,
    url: `https://taxi-alica.de/${lang}/kontakt/`,
    telephone: PHONE_TEL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS_STREET,
      postalCode: ADDRESS_ZIP,
      addressLocality: ADDRESS_CITY,
      addressRegion: 'Baden-Württemberg',
      addressCountry: 'DE',
    },
    areaServed: { '@type': 'City', name: 'Freiburg im Breisgau' },
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
          <ContactForm t={t} />
        </main>
        <Footer t={t} lang={lang} />
      </div>
    </>
  );
}
