'use client';

import { airportBase } from '@/lib/airports';
import type { Translations } from '@/lib/translations';
import WireframeCanvas from './WireframeCanvas';

interface Props {
  t: Translations;
}

export default function FunnelAirportTransfer({ t }: Props) {
  const airportNotesMap: Record<string, string> = {
    'EuroAirport Basel-Mulhouse-Freiburg': 'Primärer Regional-Hub · ~70 km',
    'Karlsruhe / Baden-Baden': 'Baden-Airpark · ~110 km',
    'Flughafen Zürich': 'Internationaler Großflughafen · ~150 km',
    'Flughafen Stuttgart': 'Über A5 / A81 · ~200 km',
    'Allgäu Airport Memmingen': 'Allgäu Airport · ~230 km',
    'Flughafen Frankfurt': 'Internationale Langstrecke · ~260 km',
  };

  const airports = airportBase.map((a, i) => ({
    ...a,
    note: airportNotesMap[a.name] || t.airportNotes[i] || '',
  }));

  return (
    <section style={{ scrollMarginTop: 84 }}>
      <div className="section-container">
        <div className="section-tag">{t.b_tag}</div>
        <h2
          style={{
            fontFamily: "'Spectral', 'Noto Serif SC', Georgia, serif",
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1.12,
            margin: '0 0 10px',
            color: 'var(--text-heading)',
            maxWidth: 760,
          }}
        >
          {t.b_h2}
        </h2>
        <p
          style={{
            fontSize: 16.5,
            color: 'var(--text-muted)',
            margin: '0 0 30px',
            maxWidth: 660,
          }}
        >
          {t.b_intro}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 20,
          }}
        >
          {airports.map((ap) => (
            <div
              key={ap.iata}
              className="airport-card"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 14,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 14,
                  marginBottom: 6,
                }}
              >
                <WireframeCanvas
                  shape={ap.shape}
                  tone={ap.tone}
                  showHint
                  style={{ width: 96, height: 60, flexShrink: 0, order: 2 }}
                />
                <div style={{ order: 1, flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Spectral','Noto Serif SC',Georgia,serif",
                      fontSize: 19,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {ap.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: 'var(--text-faint)',
                      marginTop: 5,
                    }}
                  >
                    {ap.note}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  flexWrap: 'wrap',
                  margin: '6px 0 16px',
                }}
              >
                <span
                  style={{
                    fontSize: 11.5,
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                    color: 'var(--gold)',
                    border: '1px solid rgba(230,176,50,0.35)',
                    borderRadius: 6,
                    padding: '3px 9px',
                  }}
                >
                  {ap.iata}
                </span>
              </div>
              <div
                style={{
                  marginTop: 'auto',
                  borderTop: '1px solid var(--border-strong)',
                  paddingTop: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}
                  >
                    {t.dest_price_header || 'Transferpreis'}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Spectral',serif",
                      fontSize: 22,
                      fontWeight: 600,
                      color: 'var(--gold)',
                    }}
                  >
                    {ap.std}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginTop: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Großraum (5–8 Pers.)</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-soft)' }}>
                    +20 €
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 22,
            fontSize: 13,
            color: 'var(--text-faint)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="9.5"
              fill="none"
              stroke="var(--text-faint)"
              strokeWidth="1.6"
            />
            <path
              d="M12 11v5.5"
              stroke="var(--text-faint)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="7.6" r="1.1" fill="var(--text-faint)" />
          </svg>
          {t.b_disclaimer}
        </div>
      </div>
    </section>
  );
}
