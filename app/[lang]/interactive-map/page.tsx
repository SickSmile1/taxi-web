import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MapIsland from '@/components/MapIsland';
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
    title: t.meta_interactive_title,
    description: t.meta_interactive_desc,
    alternates: {
      canonical: `/${lang}/interactive-map/`,
      languages: buildHreflang('interactive-map/'),
    },
    openGraph: {
      title: t.meta_interactive_title,
      description: t.meta_interactive_desc,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

export default async function InteractiveMapPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  const langLinks = Object.fromEntries(
    LANGS.map((l) => [l, `/${l}/interactive-map/`]),
  ) as Record<Lang, string>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Taxi-Alica Freiburg Interaktive Karte',
    description: t.meta_interactive_desc,
    url: `https://taxi-alica.de/${lang}/interactive-map/`,
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
          <MapIsland t={t} mode="full" />
        </main>
        <ContactForm t={t} />
        <Footer t={t} lang={lang} />
      </div>
    </>
  );
}
