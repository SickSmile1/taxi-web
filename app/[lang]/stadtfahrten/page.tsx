import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import FunnelCityRides from '@/components/FunnelCityRides';
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
    title: t.meta_stadt_title,
    description: t.meta_stadt_desc,
    alternates: {
      canonical: `/${lang}/stadtfahrten/`,
      languages: buildHreflang('stadtfahrten/'),
    },
    openGraph: {
      title: t.meta_stadt_title,
      description: t.meta_stadt_desc,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

export default async function StadtfahrtenPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  const langLinks = Object.fromEntries(
    LANGS.map((l) => [l, `/${l}/stadtfahrten/`]),
  ) as Record<Lang, string>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Taxi-Alica Freiburg',
    description: t.meta_stadt_desc,
    url: `https://taxi-alica.de/${lang}/stadtfahrten/`,
    telephone: '+4976115537668',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bötzinger Str. 66',
      postalCode: '79111',
      addressLocality: 'Freiburg im Breisgau',
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
          <FunnelCityRides t={t} lang={lang as Lang} />
        </main>
        <ContactForm t={t} />
        <Footer t={t} lang={lang} />
      </div>
    </>
  );
}
