'use client';

import type { Translations } from '@/lib/translations';

interface ServiceAreaProps {
  t: Translations;
}

export default function ServiceArea({ t }: ServiceAreaProps) {
  return (
    <section id="service-area" className="service-area-section">
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="section-tag">04 — Einzugsgebiet</div>
        <h2
          style={{
            fontFamily: "'Spectral', 'Noto Serif SC', Georgia, serif",
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1.12,
            margin: '0 0 20px',
            color: 'var(--text-heading)',
          }}
        >
          {t.districtsLabel} &amp; {t.suburbsLabel}
        </h2>
        <p
          style={{
            fontSize: 16.5,
            color: 'var(--text-muted)',
            margin: '0 0 34px',
            maxWidth: 760,
            lineHeight: 1.62,
          }}
        >
          {t.heroDescription}
        </p>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}
          className="service-details-grid"
        >
          {/* Freiburg Districts Accordion */}
          <details className="service-details service-accordion">
            <summary
              className="service-accordion-summary"
              aria-label={t.ariaDistricts}
            >
              <span>{t.districtsLabel}</span>
              <span style={{ fontSize: 12, color: 'var(--gold)' }}>▼</span>
            </summary>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px 18px',
                marginTop: 18,
                borderTop: '1px solid var(--border-strong)',
                paddingTop: 14,
              }}
            >
              {[
                'Littenweiler',
                'Waldsee',
                'Ebnet',
                'Kappel',
                'Stühlinger',
                'Zähringen',
                'Betzenhausen',
                'Landwasser',
                'Hochdorf',
                'St. Georgen',
              ].map((name) => (
                <div
                  key={name}
                  style={{
                    fontSize: 14.5,
                    color: 'var(--text-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ color: 'var(--gold)' }}>•</span> {name}
                </div>
              ))}
            </div>
          </details>

          {/* Surrounding Municipalities Accordion */}
          <details className="service-details service-accordion">
            <summary
              className="service-accordion-summary"
              aria-label={t.ariaSuburbs}
            >
              <span>{t.suburbsLabel}</span>
              <span style={{ fontSize: 12, color: 'var(--gold)' }}>▼</span>
            </summary>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px 18px',
                marginTop: 18,
                borderTop: '1px solid var(--border-strong)',
                paddingTop: 14,
              }}
            >
              {[
                'Kirchzarten',
                'Stegen',
                'Buchenbach',
                'Wildtal',
                'Denzlingen',
                'Waldkirch',
                'March',
                'Ebringen',
                'Schallstadt',
                'Bad Krozingen',
              ].map((name) => (
                <div
                  key={name}
                  style={{
                    fontSize: 14.5,
                    color: 'var(--text-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ color: 'var(--gold)' }}>•</span> {name}
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
