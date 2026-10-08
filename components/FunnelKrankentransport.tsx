'use client';

import type { Translations } from '@/lib/translations';

const warnBorderStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  background: 'rgba(224,82,82,0.10)',
  border: '1px solid rgba(224,82,82,0.3)',
  borderRadius: 10,
  padding: '20px 22px',
};

interface Props {
  t: Translations;
}

export default function FunnelKrankentransport({ t }: Props) {
  return (
    <section style={{ scrollMarginTop: 84, background: 'var(--bg-deep)' }}>
      <div className="section-container">
        <div className="section-tag">{t.a_tag}</div>
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
          {t.a_h2}
        </h2>
        <p
          style={{
            fontSize: 16.5,
            color: 'var(--text-muted)',
            margin: '0 0 34px',
            maxWidth: 640,
          }}
        >
          {t.a_h3b}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 26,
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={warnBorderStyle}>
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <path
                  d="M12 3.2 22 20.5H2z"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9.5v5"
                  stroke="var(--gold)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17.4" r="1.2" fill="var(--gold)" />
              </svg>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: 7,
                  }}
                >
                  {t.a_warnTitle}
                </div>
                <div
                  style={{
                    fontSize: 15.5,
                    lineHeight: 1.55,
                    color: 'var(--text-error)',
                  }}
                >
                  {t.a_warnBody}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 11.5,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  border: `1px solid rgba(230,176,50,0.4)`,
                  borderRadius: 999,
                  padding: '4px 11px',
                  marginBottom: 14,
                }}
              >
                {t.a_h3a}
              </div>
              <p
                style={{
                  fontSize: 15.5,
                  lineHeight: 1.62,
                  color: 'var(--text-soft)',
                  margin: 0,
                }}
              >
                {t.a_billBody}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 16,
                paddingTop: 4,
              }}
            >
              <a
                href="#kontakt"
                className="btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'var(--gold)',
                  color: 'var(--bg-page)',
                  padding: '14px 24px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: 'inherit',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                {t.a_cta} <span style={{ fontSize: 17 }}>→</span>
              </a>
              <span
                style={{
                  fontSize: 13.5,
                  color: 'var(--text-faint)',
                  maxWidth: 280,
                  lineHeight: 1.5,
                }}
              >
                {t.a_note}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface-3)',
              border: '1px solid var(--border-strong)',
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 16,
              }}
            >
              {t.a_listTitle}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {t.a_list.map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 13,
                    padding: '13px 2px',
                    borderBottom: '1px solid var(--border-strong)',
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      flexShrink: 0,
                      borderRadius: 8,
                      background: `rgba(230,176,50,0.12)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="var(--gold)"
                        strokeWidth="2.6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
