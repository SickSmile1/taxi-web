import type { Metadata } from 'next';
import PageClient from '@/components/PageClient';
import { buildHreflang, OG_LOCALE } from '@/lib/hreflang';
import { getTranslation, isRtl, LANGS, type Lang } from '@/lib/translations';

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
  const pageTitle =
    lang === 'de'
      ? 'Taxi Alica | Ihr Zuverlässiger Taxi-Service'
      : `${t.heroTitle} | Taxi Alica`;
  return {
    title: pageTitle,
    description: t.heroSub,
    alternates: {
      canonical: `/${lang}/`,
      languages: buildHreflang(),
    },
    openGraph: {
      title: pageTitle,
      description: t.heroSub,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  const langLinks = Object.fromEntries(
    LANGS.map((l) => [l, `/${l}/`]),
  ) as Record<Lang, string>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Taxi-Alica Freiburg',
    description: t.heroSub,
    url: `https://taxi-alica.de/${lang}/`,
    telephone: '+4976115537668',
    image: 'https://taxi-alica.de/logo_low_res.png',
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
      { '@type': 'Place', name: 'Littenweiler' },
      { '@type': 'Place', name: 'Waldsee' },
      { '@type': 'Place', name: 'Ebnet' },
      { '@type': 'Place', name: 'Kappel' },
      { '@type': 'Place', name: 'Stühlinger' },
      { '@type': 'Place', name: 'Zähringen' },
      { '@type': 'Place', name: 'Betzenhausen' },
      { '@type': 'Place', name: 'Landwasser' },
      { '@type': 'Place', name: 'Hochdorf' },
      { '@type': 'Place', name: 'St. Georgen' },
      { '@type': 'City', name: 'Kirchzarten' },
      { '@type': 'City', name: 'Stegen' },
      { '@type': 'City', name: 'Buchenbach' },
      { '@type': 'Place', name: 'Wildtal' },
      { '@type': 'City', name: 'Denzlingen' },
      { '@type': 'City', name: 'Waldkirch' },
      { '@type': 'City', name: 'March' },
      { '@type': 'City', name: 'Ebringen' },
      { '@type': 'City', name: 'Schallstadt' },
      { '@type': 'Place', name: 'Norsingen' },
      { '@type': 'City', name: 'Bad Krozingen' },
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
      <PageClient
        t={t}
        lang={lang as Lang}
        isRtl={isRtl(lang as Lang)}
        langLinks={langLinks}
      />
    </>
  );
}
