'use client';

import { useState } from 'react';
import { CheckIcon, PHONE_TEL, PhoneIcon } from '@/lib/constants';
import type { Lang, Translations } from '@/lib/translations';
import MapIsland from './MapIsland';
import PricingPanel from './PricingPanel';

interface Props {
  t: Translations;
  lang: Lang;
}

export default function FunnelCityRides({ t, lang }: Props) {
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);

  return (
    <section style={{ scrollMarginTop: 84, background: 'var(--bg-deep)' }}>
      <div className="section-container">
        <div className="section-tag">{t.c_tag}</div>
        <h2
          style={{
            fontFamily: "'Spectral','Noto Serif SC',Georgia,serif",
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1.12,
            margin: '0 0 10px',
            color: 'var(--text-heading)',
          }}
        >
          {t.c_h2}
        </h2>
        <p
          style={{
            fontSize: 16.5,
            color: 'var(--text-muted)',
            margin: '0 0 22px',
            maxWidth: 520,
          }}
        >
          {t.c_body}
        </p>
        <div
          className="check-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            fontSize: 14,
            color: 'var(--text-soft)',
            marginBottom: 30,
          }}
        >
          <CheckIcon />
          {t.c_tariff}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <PricingPanel
            t={t}
            lang={lang}
            onSelect={(from, to) => {
              setSelectedFrom(from);
              setSelectedTo(to);
            }}
          />
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/10',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--border-strong)',
            }}
          >
            <MapIsland
              t={t}
              selectedFrom={selectedFrom}
              selectedTo={selectedTo}
              fullStretch
            />
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <a
            href={`tel:${PHONE_TEL}`}
            className="btn-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 11,
              background: 'var(--gold)',
              color: 'var(--bg-page)',
              padding: '15px 26px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15.5,
              fontFamily: 'inherit',
              textDecoration: 'none',
            }}
          >
            <PhoneIcon color="var(--bg-page)" size={18} />
            {t.c_cta}
          </a>
        </div>
      </div>
    </section>
  );
}
