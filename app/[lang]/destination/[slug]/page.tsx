import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import TaxiLogo from '@/components/TaxiLogo';
import {
  destinations,
  getDestinationBySlug,
  getMeta,
} from '@/lib/destinations';
import { buildDestHreflang, OG_LOCALE } from '@/lib/hreflang';
import { getTranslation, LANGS, type Lang } from '@/lib/translations';

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    destinations.map((d) => ({ lang, slug: d.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return {};
  const { title, description } = getMeta(dest, lang as Lang);
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/destination/${slug}/`,
      languages: buildDestHreflang(slug),
    },
    openGraph: {
      title,
      description,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

const GOLD = '#E6B032';
const PHONE_TEL = '+4976115537668';
const PHONE_DISPLAY = '0761 15 53 76 68';

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const t = getTranslation(lang as Lang);
  const { body } = getMeta(dest, lang as Lang);
  const isAirport = dest.kind === 'airport';
  const homeHref = `/${lang}/`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        name: 'Taxi-Alica Freiburg',
        url: `https://taxi-alica.de/${lang}/`,
        telephone: '+4976115537668',
        image: 'https://taxi-alica.de/logo_low_res.png',
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Bötzinger Str. 66',
          postalCode: '79111',
          addressLocality: 'Freiburg im Breisgau',
          addressRegion: 'Baden-Württemberg',
          addressCountry: 'DE',
        },
      },
      {
        '@type': 'TaxiService',
        name: isAirport
          ? `Flughafentransfer nach ${dest.name}`
          : `Taxi-Service zum ${dest.name}`,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Taxi-Alica Freiburg',
          telephone: '+4976115537668',
        },
        areaServed: {
          '@type': 'City',
          name: 'Freiburg im Breisgau',
        },
        hasOfferCatalog: dest.priceStd
          ? {
              '@type': 'OfferCatalog',
              name: 'Tarife',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: t.b_colStandard,
                  },
                  price: dest.priceStd,
                  priceCurrency: 'EUR',
                },
              ],
            }
          : undefined,
      },
      {
        '@type': 'Place',
        '@id': `https://taxi-alica.de/${lang}/destination/${slug}/#place`,
        name: dest.name,
        geo:
          dest.lat && dest.lng
            ? {
                '@type': 'GeoCoordinates',
                latitude: dest.lat,
                longitude: dest.lng,
              }
            : undefined,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page-wrapper">
        {/* Minimal header */}
        <header
          style={{
            borderBottom: '1px solid var(--border-strong)',
            background: 'var(--bg-header)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <div
            style={{
              maxWidth: 1240,
              margin: '0 auto',
              padding: '14px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link
              href={homeHref}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <TaxiLogo width={88} />
              <span
                style={{
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.01em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                }}
              >
                Taxi Alica
              </span>
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                background: 'var(--gold)',
                color: 'var(--bg-page)',
                padding: '10px 18px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </header>

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '72px 28px' }}>
          {/* Breadcrumb */}
          <nav
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginBottom: 32,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Link href={homeHref} style={{ color: 'var(--text-muted)' }}>
              Taxi-Alica Freiburg
            </Link>
            <span>›</span>
            <span>{isAirport ? t.nav1 : t.nav2}</span>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)' }}>{dest.name}</span>
          </nav>

          {/* Page heading */}
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            {isAirport ? t.nav1 : t.nav2}
            {dest.iata && ` · ${dest.iata}`}
          </div>
          <h1
            style={{
              fontFamily: "'Spectral', Georgia, serif",
              fontWeight: 600,
              fontSize: 46,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              margin: '0 0 24px',
              color: 'var(--text-heading)',
            }}
          >
            {isAirport
              ? `${t.dest_h1_to_airport} ${dest.name}`
              : `${t.dest_h1_to_landmark} ${dest.name}`}
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: '0 0 48px',
              maxWidth: 660,
            }}
          >
            {body}
          </p>

          {/* Price table for airports */}
          {isAirport && dest.priceStd && (
            <div
              style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-strong)',
                borderRadius: 14,
                padding: 32,
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  fontSize: 12.5,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 16,
                }}
              >
                {t.dest_price_header} · {dest.distanceKm} {t.dest_distance_from}
              </div>
              <div
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 12,
                  padding: '24px 28px',
                  border: '1px solid var(--border-soft)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: 'var(--text-secondary)',
                      marginBottom: 6,
                    }}
                  >
                    {t.b_colStandard}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Spectral', serif",
                      fontSize: 38,
                      fontWeight: 600,
                      color: 'var(--gold)',
                    }}
                  >
                    {dest.priceStd}
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    color: 'var(--text-soft)',
                  }}
                >
                  <span>Großraum (5–8 Personen): </span>
                  <strong style={{ color: 'var(--gold)' }}>+20 €</strong>
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  margin: '18px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9.5"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M12 11v5.5"
                    stroke="var(--text-muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="7.6" r="1.1" fill="var(--text-muted)" />
                </svg>
                {t.dest_price_note}
              </p>
            </div>
          )}

          {/* CTA */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              marginBottom: 48,
            }}
          >
            <a
              href={`tel:${PHONE_TEL}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--gold)',
                color: 'var(--bg-page)',
                padding: '15px 26px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15.5,
              }}
            >
              {t.dest_cta_call}: {PHONE_DISPLAY}
            </a>
            <Link
              href={`/${lang}/#kontakt`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                border: '1px solid var(--border-soft)',
                color: 'var(--text-primary)',
                padding: '15px 26px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {t.dest_cta_callback}
            </Link>
          </div>

          {/* Key facts */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 40 }}>
            <h2
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontWeight: 600,
                fontSize: 22,
                color: 'var(--text-heading)',
                margin: '0 0 20px',
              }}
            >
              {t.dest_why_title}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              {t.dest_usps.map((fact: string) => (
                <div
                  key={fact}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '14px 16px',
                    background: 'var(--bg-surface-2)',
                    borderRadius: 10,
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="var(--gold)"
                      strokeWidth="2.4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {fact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div
            style={{
              marginTop: 56,
              paddingTop: 32,
              borderTop: '1px solid var(--border)',
            }}
          >
            <Link
              href={homeHref}
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {t.dest_back}
            </Link>
          </div>
        </main>

        <Footer t={t} lang={lang} />
      </div>
    </>
  );
}
