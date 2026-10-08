import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import FunnelFleet from '@/components/FunnelFleet';
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
    title: t.meta_fuhrpark_title,
    description: t.meta_fuhrpark_desc,
    alternates: {
      canonical: `/${lang}/fuhrpark/`,
      languages: buildHreflang('fuhrpark/'),
    },
    openGraph: {
      title: t.meta_fuhrpark_title,
      description: t.meta_fuhrpark_desc,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

export default async function FuhrparkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  const langLinks = Object.fromEntries(
    LANGS.map((l) => [l, `/${l}/fuhrpark/`]),
  ) as Record<Lang, string>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Taxi-Alica Freiburg',
    description: t.meta_fuhrpark_desc,
    url: `https://taxi-alica.de/${lang}/fuhrpark/`,
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
          <FunnelFleet t={t} lang={lang as Lang} />
        </main>
        <ContactForm t={t} />
        <Footer t={t} lang={lang} />
      </div>
    </>
  );
}
