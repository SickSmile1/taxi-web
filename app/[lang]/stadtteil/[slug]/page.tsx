import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import TaxiLogo from '@/components/TaxiLogo';
import {
  DISTRICT_NAMES,
  getDistrictBySlug,
  getDistrictSlug,
} from '@/lib/districts';
import { getDistrictSEO } from '@/lib/districts-seo';
import { haversineKm } from '@/lib/geo';
import { buildDistrictHreflang, OG_LOCALE } from '@/lib/hreflang';
import { calculatePrice, formatPrice } from '@/lib/tariff';
import { getTranslation, LANGS, type Lang } from '@/lib/translations';
import adjData from '@/public/data/districts-adj.json';
import poisData from '@/public/data/pois.json';
import tariffs from '@/public/data/tariffs.json';

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    DISTRICT_NAMES.map((d) => ({
      lang,
      slug: getDistrictSlug(d),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const districtName = getDistrictBySlug(slug);
  if (!districtName) return {};

  const seo = getDistrictSEO(districtName, lang as Lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `/${lang}/stadtteil/${slug}/`,
      languages: buildDistrictHreflang(slug),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

const GOLD = '#E6B032';
const PHONE_TEL = '+4976115537668';
const PHONE_DISPLAY = '0761 15 53 76 68';

interface DestinationPOI {
  key: string;
  name: string;
  coords: { lng: number; lat: number };
  district: string;
  roadFactor: number;
  isAirport?: boolean;
  airportSurcharge?: number;
}

// 5 default destinations to compute prices to
const DEFAULT_POIS: Record<string, DestinationPOI> = {
  hbf: {
    key: 'hbf',
    name: 'Freiburg Hauptbahnhof',
    coords: { lng: 7.841452, lat: 47.996942 },
    district: 'Stühlinger',
    roadFactor: 1.3,
  },
  muenster: {
    key: 'muenster',
    name: 'Freiburger Münster (Altstadt)',
    coords: { lng: 7.8525, lat: 47.9956 },
    district: 'Altstadt',
    roadFactor: 1.3,
  },
  messe: {
    key: 'messe',
    name: 'Messe Freiburg',
    coords: { lng: 7.838, lat: 48.021 },
    district: 'Mooswald',
    roadFactor: 1.3,
  },
  heuboden: {
    key: 'heuboden',
    name: 'Heuboden Umkirch',
    coords: { lng: 7.7615, lat: 48.0163 },
    district: 'Umkirch',
    roadFactor: 1.25,
  },
  basel: {
    key: 'basel',
    name: 'EuroAirport Basel (BSL)',
    coords: { lng: 7.5297, lat: 47.5896 },
    district: 'Basel',
    roadFactor: 1.36,
    isAirport: true,
    airportSurcharge: 15,
  },
};

// Fallback swap targets for de-duplication
const SWAP_POIS: Record<string, DestinationPOI> = {
  seepark: {
    key: 'seepark',
    name: 'Seepark Freiburg',
    coords: { lng: 7.801, lat: 48.008 },
    district: 'Betzenhausen',
    roadFactor: 1.3,
  },
  stadion: {
    key: 'stadion',
    name: 'Europa-Park Stadion (SC Freiburg)',
    coords: { lng: 7.8297, lat: 48.0216 },
    district: 'Brühl',
    roadFactor: 1.3,
  },
  schloss_reinach: {
    key: 'schloss_reinach',
    name: 'Schloss Reinach Munzingen',
    coords: { lng: 7.702, lat: 47.968 },
    district: 'Munzingen',
    roadFactor: 1.2,
  },
};

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const districtName = getDistrictBySlug(slug);
  if (!districtName) notFound();

  const t = getTranslation(lang as Lang);
  const seo = getDistrictSEO(districtName, lang as Lang);
  const homeHref = `/${lang}/`;

  // Get coordinates for the current district from tariffs.json
  const districtCenters = tariffs.district_centers as unknown as Record<
    string,
    number[]
  >;
  const coordsArray = districtCenters[districtName];
  if (!coordsArray) notFound();

  const districtCoords = { lng: coordsArray[0], lat: coordsArray[1] };

  // Build the list of target POIs, applying the dynamic de-duplication rules
  const targetPois: DestinationPOI[] = [];

  // 1. Freiburg Hbf
  if (districtName === 'Stühlinger') {
    targetPois.push(SWAP_POIS.seepark);
  } else {
    targetPois.push(DEFAULT_POIS.hbf);
  }

  // 2. Freiburger Münster
  if (districtName === 'Altstadt') {
    targetPois.push(SWAP_POIS.stadion);
  } else {
    targetPois.push(DEFAULT_POIS.muenster);
  }

  // 3. Messe Freiburg
  if (districtName === 'Mooswald') {
    targetPois.push(SWAP_POIS.schloss_reinach);
  } else {
    targetPois.push(DEFAULT_POIS.messe);
  }

  // 4. Heuboden Umkirch & 5. EuroAirport Basel (Always external)
  targetPois.push(DEFAULT_POIS.heuboden);
  targetPois.push(DEFAULT_POIS.basel);

  // Calculate distances and prices dynamically
  const faresList = targetPois.map((poi) => {
    // Check if the pair exists in the precalculated distance matrix in tariffs.json
    let distanceKm = 0;
    const key1 = `${districtName}_${poi.district}`;
    const key2 = `${poi.district}_${districtName}`;
    const matrix = tariffs.distance_matrix as Record<string, number>;

    if (matrix[key1] !== undefined) {
      distanceKm = matrix[key1];
    } else if (matrix[key2] !== undefined) {
      distanceKm = matrix[key2];
    } else {
      // Calculate straight line distance and multiply by road network correction factor
      const straightDist = haversineKm(districtCoords, poi.coords);
      distanceKm = Math.round(straightDist * poi.roadFactor * 10) / 10;
    }

    // Calculate fare using official tariff
    const priceBreakdown = calculatePrice(distanceKm);

    // Add airport surcharge if applicable
    if (poi.airportSurcharge) {
      priceBreakdown.total =
        Math.round((priceBreakdown.total + poi.airportSurcharge) * 100) / 100;
      priceBreakdown.kmCost =
        Math.round((priceBreakdown.kmCost + poi.airportSurcharge) * 100) / 100;
    }

    return {
      ...poi,
      distanceKm,
      priceFormatted: formatPrice(priceBreakdown.total),
    };
  });

  const localPoi = poisData.find((p) => p.district === districtName);
  const adjList = (adjData as Record<string, string[]>)[districtName] || [];
  const hbfFare = faresList.find((f) => f.key === 'hbf') || faresList[0];

  // Schema.org LocalBusiness structured data
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
        areaServed: [
          {
            '@type': 'AdministrativeArea',
            name: `${districtName}, Freiburg im Breisgau`,
          },
          {
            '@type': 'City',
            name: 'Freiburg im Breisgau',
          },
        ],
      },
      ...faresList.map((poi) => ({
        '@type': 'TaxiService',
        name: `Taxi von Freiburg-${districtName} nach ${poi.name}`,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Taxi-Alica Freiburg',
          telephone: '+4976115537668',
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: `${districtName}, Freiburg im Breisgau`,
        },
        offers: {
          '@type': 'Offer',
          price: calculatePrice(poi.distanceKm).total.toFixed(2),
          priceCurrency: 'EUR',
          description: `Taxi-Fahrpreis von Freiburg-${districtName} nach ${poi.name}`,
        },
      })),
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name:
              lang === 'de'
                ? `Wie viel kostet ein Taxi von Freiburg-${districtName} zum Hauptbahnhof?`
                : `How much does a taxi cost from Freiburg-${districtName} to the Central Station?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                lang === 'de'
                  ? `Eine Taxifahrt von Freiburg-${districtName} zum Hauptbahnhof kostet tagsüber ca. ${hbfFare.priceFormatted} bei einer Fahrtstrecke von ${hbfFare.distanceKm} km.`
                  : `A taxi ride from Freiburg-${districtName} to the Central Station costs approx. ${hbfFare.priceFormatted} during the day for a route of ${hbfFare.distanceKm} km.`,
            },
          },
          {
            '@type': 'Question',
            name:
              lang === 'de'
                ? `Bietet Taxi-Alica Krankenfahrten in Freiburg-${districtName} an?`
                : `Does Taxi-Alica offer medical patient transport in Freiburg-${districtName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                lang === 'de'
                  ? `Ja, wir bieten zuverlässige sitzende Krankenfahrten im gesamten Stadtteil Freiburg-${districtName} an und rechnen direkt mit Ihrer Krankenkasse ab.`
                  : `Yes, we offer reliable medical patient transport in the entire district of Freiburg-${districtName} and handle direct billing with health insurance companies.`,
            },
          },
        ],
      },
    ],
  };

  // Create pre-filled links to map
  const getMapLink = (poi: DestinationPOI) => {
    const toSlug =
      poi.key === 'basel'
        ? 'euroairport-basel'
        : poi.key === 'heuboden'
          ? 'heuboden-umkirch'
          : poi.key === 'muenster'
            ? 'freiburger-muenster'
            : poi.key === 'hbf'
              ? 'freiburg-hauptbahnhof'
              : poi.key === 'messe'
                ? 'europa-park-stadion'
                : ''; // fallback
    return `/${lang}/interactive-map/?from=${encodeURIComponent(districtName)}&to=${toSlug}`;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page-wrapper">
        {/* Header */}
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
          {/* Breadcrumbs */}
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
            <Link
              href={`/${lang}/stadtfahrten/`}
              style={{ color: 'var(--text-muted)' }}
            >
              {t.nav2}
            </Link>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)' }}>{districtName}</span>
          </nav>

          {/* Title */}
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
            Freiburg {districtName} Taxi
          </div>
          <h1
            style={{
              fontFamily: "'Spectral', Georgia, serif",
              fontWeight: 600,
              fontSize: 42,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              margin: '0 0 24px',
              color: 'var(--text-heading)',
            }}
          >
            {lang === 'de'
              ? `Ihr Taxi-Service in Freiburg-${districtName}`
              : `Your Taxi Service in Freiburg-${districtName}`}
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: '0 0 48px',
            }}
          >
            {seo.intro}
          </p>

          {/* Fare Estimates Section */}
          <section style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontWeight: 600,
                fontSize: 26,
                color: 'var(--text-heading)',
                margin: '0 0 20px',
              }}
            >
              {seo.titleSectionPrices}
            </h2>
            <p
              style={{
                fontSize: 15.5,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: 24,
              }}
            >
              {seo.pricingText}
            </p>

            <div
              style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-strong)',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  background: 'var(--bg-surface)',
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border-strong)',
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                <div>Zielort</div>
                <div>Distanz</div>
                <div>Tarif (ca.)</div>
                <div style={{ textAlign: 'right' }}>Route</div>
              </div>
              {faresList.map((poi) => {
                const durationMin = Math.max(
                  1,
                  Math.round(poi.distanceKm * 1.5),
                );
                const durationPeakMin = Math.round(durationMin * 1.35);
                return (
                  <div
                    key={poi.name}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      padding: '18px 24px',
                      borderBottom: '1px solid var(--border-soft)',
                      fontSize: 15,
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {poi.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          marginTop: 4,
                        }}
                      >
                        {lang === 'de'
                          ? `Fahrzeit: ca. ${durationMin} Min. (Stoßzeit: ca. ${durationPeakMin} Min. / +35% Stau)`
                          : `Travel time: approx. ${durationMin} min (Peak: approx. ${durationPeakMin} min / +35% traffic)`}
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {poi.distanceKm} km
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--gold)' }}>
                      {poi.priceFormatted}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Link
                        href={getMapLink(poi)}
                        style={{
                          display: 'inline-flex',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-soft)',
                          color: 'var(--text-primary)',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12.5,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Karte →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: 'var(--text-muted)',
                margin: '14px 10px 0',
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
              {seo.priceEstimationNote}
            </p>
          </section>

          {/* CTA Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              marginBottom: 56,
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-strong)',
              padding: 28,
              borderRadius: 12,
            }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                Taxi jetzt anfordern
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  lineHeight: 1.4,
                }}
              >
                Buchen Sie Ihre Fahrt direkt telefonisch oder fordern Sie einen
                unverbindlichen Rückruf an.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={`tel:${PHONE_TEL}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'var(--gold)',
                  color: 'var(--bg-page)',
                  padding: '14px 24px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: 'none',
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
                  padding: '14px 24px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14.5,
                  textDecoration: 'none',
                }}
              >
                {t.dest_cta_callback}
              </Link>
            </div>
          </div>

          {/* Local Info Section */}
          <section
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 40,
              marginBottom: 40,
            }}
          >
            <h2
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontWeight: 600,
                fontSize: 22,
                color: 'var(--text-heading)',
                margin: '0 0 20px',
              }}
            >
              {seo.titleSectionWhy}
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: 28,
              }}
            >
              {seo.medicalAirport}
            </p>
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
          </section>

          {/* Local POI Highlight Section */}
          {localPoi && (
            <section
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: 40,
                marginBottom: 40,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Spectral', Georgia, serif",
                  fontWeight: 600,
                  fontSize: 22,
                  color: 'var(--text-heading)',
                  margin: '0 0 20px',
                }}
              >
                {lang === 'de'
                  ? `Fahrtziele & Highlights in ${districtName}`
                  : `Key Destinations in ${districtName}`}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                {lang === 'de'
                  ? localPoi.descDe
                  : localPoi.descEn || localPoi.descDe}
              </p>
            </section>
          )}

          {/* Dynamic FAQs Section */}
          <section
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 40,
              marginBottom: 40,
            }}
          >
            <h2
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontWeight: 600,
                fontSize: 22,
                color: 'var(--text-heading)',
                margin: '0 0 20px',
              }}
            >
              {lang === 'de'
                ? 'Häufig gestellte Fragen (FAQ)'
                : 'Frequently Asked Questions (FAQ)'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  {seo.faqTrafficTitle}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {seo.faqTrafficAnswer}
                </p>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  {lang === 'de'
                    ? `Wie viel kostet ein Taxi von Freiburg-${districtName} zum Hauptbahnhof?`
                    : `How much does a taxi cost from Freiburg-${districtName} to the Central Station?`}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {lang === 'de'
                    ? `Eine Taxifahrt von Freiburg-${districtName} zum Hauptbahnhof kostet tagsüber ca. ${hbfFare.priceFormatted} bei einer Fahrtstrecke von ${hbfFare.distanceKm} km. Der Preis berechnet sich nach dem offiziellen Freiburger Taxitarif.`
                    : `A taxi ride from Freiburg-${districtName} to the Central Station costs approx. ${hbfFare.priceFormatted} during the day for a route of ${hbfFare.distanceKm} km. The fare is calculated based on the official Freiburg tariff.`}
                </p>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  {lang === 'de'
                    ? `Bietet Taxi-Alica Krankenfahrten in Freiburg-${districtName} an?`
                    : `Does Taxi-Alica offer medical patient transport in Freiburg-${districtName}?`}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {lang === 'de'
                    ? `Ja, wir bieten zuverlässige Krankenfahrten im gesamten Stadtteil Freiburg-${districtName} zu Ärzten, Kliniken und Reha-Einrichtungen an. Wir übernehmen die Direktabrechnung mit allen gesetzlichen Krankenkassen (mit Transportschein).`
                    : `Yes, we offer reliable medical patient transport in the entire district of Freiburg-${districtName} to doctors, clinics, and rehabilitation facilities. We handle direct billing with all public health insurance providers.`}
                </p>
              </div>
            </div>
          </section>

          {/* Adjacent Districts Section */}
          {adjList.length > 0 && (
            <section
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: 40,
                marginBottom: 40,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Spectral', Georgia, serif",
                  fontWeight: 600,
                  fontSize: 20,
                  color: 'var(--text-heading)',
                  margin: '0 0 16px',
                }}
              >
                {lang === 'de'
                  ? 'Benachbarte Einsatzgebiete'
                  : 'Adjacent Service Districts'}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {adjList.map((neighbor) => {
                  const neighborSlug = getDistrictSlug(neighbor);
                  return (
                    <Link
                      key={neighbor}
                      href={`/${lang}/stadtteil/${neighborSlug}/`}
                      style={{
                        display: 'inline-flex',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-strong)',
                        color: 'var(--text-muted)',
                        padding: '8px 16px',
                        borderRadius: 20,
                        fontSize: 13.5,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      className="neighbor-link"
                    >
                      Taxi {neighbor}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

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
                textDecoration: 'none',
              }}
            >
              {t.dest_back}
            </Link>
          </div>
        </main>

        <Footer t={t} lang={lang} currentSlug={slug} />
      </div>
    </>
  );
}
