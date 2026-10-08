'use client';

import { p } from '@/lib/base-path';
import type { Lang, Translations } from '@/lib/translations';
import Car360Viewer from './fleet/Car360Viewer';

interface Props {
  t: Translations;
  lang: Lang;
}

export default function FunnelFleet({ t, lang }: Props) {
  const fleetUsps = [
    'Gepflegte Nichtraucher-Fahrzeuge höchster Sicherheitsstufe',
    'Tägliche Innenraum-Desinfektion & penible Sauberkeit',
    'Großraumtaxi bis zu 8 Fahrgäste mit riesigem Gepäckraum',
    'Klimatisierung, USB-Lademöglichkeiten & Ledersitze',
    'Bargeldlose Kartenzahlung (EC, Kreditkarte, Apple/Google Pay)',
    'Kindersitze & Sitzerhöhungen auf Vorbestellung verfügbar',
  ];

  return (
    <section style={{ scrollMarginTop: 84 }}>
      <div className="section-container">
        {/* Header Block */}
        <div className="section-tag">{t.fuhrpark_tag}</div>
        <h1
          style={{
            fontFamily: "'Spectral', 'Noto Serif SC', Georgia, serif",
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1.15,
            margin: '0 0 14px',
            color: 'var(--text-heading)',
            maxWidth: 820,
          }}
        >
          {t.fuhrpark_h2}
        </h1>
        <p
          style={{
            fontSize: 16.5,
            color: 'var(--text-muted)',
            margin: '0 0 30px',
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          {t.fuhrpark_sub}
        </p>

        {/* Fleet Highlights USPs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14,
            marginBottom: 36,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 14,
            padding: '20px 24px',
          }}
        >
          {fleetUsps.map((usp) => (
            <div
              key={usp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13.5,
                color: 'var(--text-soft)',
              }}
            >
              <span>•</span>
              <span>{usp}</span>
            </div>
          ))}
        </div>

        {/* Fleet Showcase Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid var(--border-strong)',
            marginBottom: 36,
            background: 'var(--bg-surface)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p('/cars/gemini_fleet_showcase.jpg')}
            alt="Taxi-Alica Fahrzeugflotte Freiburg"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 520,
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Interactive 360 Turntable & Specification Studio */}
        <Car360Viewer t={t} lang={lang} />
      </div>
    </section>
  );
}
