import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import {
  ADDRESS_CITY,
  ADDRESS_DISTRICT,
  ADDRESS_STREET,
  ADDRESS_ZIP,
  PHONE_DISPLAY,
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
    title: t.meta_impressum_title,
    description: t.meta_impressum_desc,
    alternates: {
      canonical: `/${lang}/impressum/`,
      languages: buildHreflang('impressum/'),
    },
    openGraph: {
      title: t.meta_impressum_title,
      description: t.meta_impressum_desc,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  const langLinks = Object.fromEntries(
    LANGS.map((l) => [l, `/${l}/impressum/`]),
  ) as Record<Lang, string>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Taxi-Alica Freiburg',
    description: t.meta_impressum_desc,
    url: `https://taxi-alica.de/${lang}/impressum/`,
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
        <main className="legal-main">
          <div className="legal-container">
            <h1 className="legal-title">{t.f_impressum}</h1>
            <p className="legal-subtitle">
              Angaben gemäß § 5 TMG / Gesetzliche Anbieterkennzeichnung
            </p>

            <section style={{ marginBottom: 32 }}>
              <div className="legal-card">
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  Taxi Alica
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  {ADDRESS_STREET}
                  <br />
                  {ADDRESS_ZIP} {ADDRESS_CITY}-{ADDRESS_DISTRICT}
                  <br />
                  Deutschland
                </div>

                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    fontSize: 14.5,
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Telefon / 24h Service:{' '}
                    </span>
                    <a href={`tel:${PHONE_TEL}`} className="legal-link">
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 className="legal-h2">Aufsichts- & Genehmigungsbehörde</h2>
              <p className="legal-p">
                Zuständige Genehmigungs- und Aufsichtsbehörde für den
                Gelegenheitsverkehr mit Taxen gemäß Personenbeförderungsgesetz
                (PBefG):
              </p>
              <div className="legal-card" style={{ marginTop: 12 }}>
                <strong>Stadt Freiburg im Breisgau</strong>
                <br />
                Garten-, Friedhofs- und Forsteamt / Amt für öffentliche Ordnung
                <br />
                Freiburg im Breisgau
              </div>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 className="legal-h2">Berufsbezeichnung & Regelungen</h2>
              <p className="legal-p">
                <strong>Berufsbezeichnung:</strong> Taxiunternehmer /
                Krankenbeförderung (verliehen in der Bundesrepublik Deutschland)
                <br />
                <strong>Zuständige Kammer:</strong> Industrie- und Handelskammer
                (IHK) Südlicher Oberrhein
                <br />
                <strong>Berufsrechtliche Regelungen:</strong>
                <br />– Personenbeförderungsgesetz (PBefG)
                <br />– Verordnung über den Betrieb von Kraftfahrunternehmen im
                Personenverkehr (BOKraft)
                <br />– Verordnung des Oberbürgermeisters der Stadt Freiburg
                über die Beförderungsentgelte und Beförderungsbedingungen für
                den Verkehr mit Taxen (Taxitarifordnung Freiburg)
              </p>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 className="legal-h2">EU-Streitschlichtung</h2>
              <p className="legal-p">
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-link"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                .
                <br />
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 className="legal-h2">
                Quellenangaben & Geodaten (3D Tiles & Karten)
              </h2>
              <p className="legal-p">
                Die auf dieser Website eingesetzten interaktiven Karten und das
                dreidimensionale Stadtmodell basieren auf offenen Geodaten und
                Softwarekomponenten:
              </p>
              <div
                className="legal-card"
                style={{
                  marginTop: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div>
                  <strong>3D-Stadtmodell Freiburg (3D Tiles LoD2):</strong>
                  <br />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Geobasisdaten / 3D-Gebäudemodelle bereitgestellt durch die{' '}
                    <strong>Stadt Freiburg im Breisgau</strong> (Vermessungsamt
                    / Geodatenportal{' '}
                    <a
                      href="https://3d.freiburg.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="legal-link"
                    >
                      3d.freiburg.de
                    </a>
                    ).
                  </span>
                  <br />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Lizenz: Datenlizenz Deutschland – Namensnennung – Version
                    2.0 (
                    <a
                      href="https://www.govdata.de/dl-de/by-2-0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="legal-link"
                    >
                      dl-de/by-2-0
                    </a>
                    ).
                  </span>
                </div>

                <div
                  style={{
                    paddingTop: 12,
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <strong>Kartendaten & Straßennetzwerk:</strong>
                  <br />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    ©{' '}
                    <a
                      href="https://www.openstreetmap.org/copyright"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="legal-link"
                    >
                      OpenStreetMap-Mitwirkende
                    </a>{' '}
                    (veröffentlicht unter der Open Database License, ODbL).
                  </span>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 className="legal-h2">Haftung für Inhalte und Links</h2>
              <p className="legal-p">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen.
              </p>
            </section>
          </div>
        </main>
        <Footer t={t} lang={lang} />
      </div>
    </>
  );
}
