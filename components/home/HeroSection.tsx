'use client';

import { p } from '@/lib/base-path';
import { CheckIcon, PHONE_TEL, PhoneIcon } from '@/lib/constants';
import type { Lang, Translations } from '@/lib/translations';

interface HeroSectionProps {
  t: Translations;
  lang: Lang;
  isRtl: boolean;
}

export default function HeroSection({ t, lang, isRtl }: HeroSectionProps) {
  const previews = [
    {
      href: p(`/${lang}/krankenfahrten/`),
      tag: t.nav0,
      title: t.a_h2,
      desc: t.hero_preview_kranken,
    },
    {
      href: p(`/${lang}/flughafentransfer/`),
      tag: t.nav1,
      title: t.b_h2,
      desc: t.hero_preview_flug,
    },
    {
      href: p(`/${lang}/stadtfahrten/`),
      tag: t.nav2,
      title: t.c_h2,
      desc: t.hero_preview_stadt,
    },
  ];

  return (
    <section id="top" className="hero-section">
      <div className="hero-car-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p('/cars/mercedes_e220_hero.png')}
          alt="Taxi Alica Freiburg Mercedes-Benz E-Klasse"
          width={718}
          height={376}
          loading="eager"
          decoding="async"
          className="hero-car-img"
        />
      </div>
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          <span className="hero-eyebrow-text">{t.heroEyebrow}</span>
        </div>
        <h1 className="hero-title">{t.heroTitle}</h1>
        <p className="hero-sub">{t.heroSub}</p>
        <div className="hero-cta-group">
          <a
            href={p(`/${lang}/kontakt/`)}
            className="btn-gold hero-btn-primary"
          >
            {t.heroCtaCallback} <span style={{ fontSize: 18 }}>→</span>
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="btn-outline hero-btn-phone"
            aria-label={t.heroCtaCall}
            title={t.heroCtaCall}
          >
            <PhoneIcon color="currentColor" size={20} />
          </a>
        </div>
        <div className="hero-trust-list">
          {[t.heroT1, t.heroT2, t.heroT3].map((txt) => (
            <div key={txt} className="check-row hero-trust-item">
              <CheckIcon />
              {txt}
            </div>
          ))}
        </div>
      </div>

      <div className="hero-preview-grid">
        {previews.map((p) => (
          <a
            key={p.href}
            href={p.href}
            className="airport-card hero-preview-card"
          >
            <div className="hero-preview-tag">{p.tag}</div>
            <div className="hero-preview-title">{p.title}</div>
            <div className="hero-preview-desc">{p.desc}</div>
            <div className="hero-preview-link">{t.hero_learn_more}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
