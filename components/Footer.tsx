'use client';

import { p } from '@/lib/base-path';
import {
  ADDRESS_FULL,
  GOLD,
  PHONE_DISPLAY,
  PHONE_TEL,
  PhoneIcon,
} from '@/lib/constants';
import { DISTRICT_REGIONS, getDistrictSlug } from '@/lib/districts';
import type { Translations } from '@/lib/translations';
import TaxiLogo from './TaxiLogo';

interface Props {
  t: Translations;
  lang: string;
  currentSlug?: string;
}

export default function Footer({ t, lang, currentSlug }: Props) {
  return (
    <>
      <footer className="site-footer">
        <div className="footer-grid site-footer-inner">
          <div>
            <a
              href={p(`/${lang}/`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 11,
                marginBottom: 14,
                textDecoration: 'none',
              }}
            >
              <TaxiLogo width={72} />
              <span
                style={{
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.01em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                }}
              >
                Taxi Alica
              </span>
            </a>
            <p
              style={{
                fontSize: 14,
                color: 'var(--text-faint)',
                lineHeight: 1.6,
                maxWidth: 320,
                margin: '0 0 14px',
              }}
            >
              {t.f_tagline}
            </p>
            <a href={`tel:${PHONE_TEL}`} className="site-footer-phone">
              {PHONE_DISPLAY}
            </a>
            <div
              style={{
                fontSize: 12.5,
                color: 'var(--text-faint)',
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              {ADDRESS_FULL}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-fainter)',
                marginTop: 8,
                maxWidth: 340,
                lineHeight: 1.5,
              }}
            >
              {t.f_vehNote}
            </div>
          </div>
          <div>
            <div className="site-footer-col-title">{t.f_servicesTitle}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                [`/${lang}/krankenfahrten/`, t.nav0],
                [`/${lang}/flughafentransfer/`, t.nav1],
                [`/${lang}/stadtfahrten/`, t.nav2],
                [`/${lang}/fuhrpark/`, t.navCars],
                [`/${lang}/kontakt/`, t.nav3],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={p(href)}
                  className="nav-link"
                  style={{ fontSize: 14.5, color: 'var(--text-soft)' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="site-footer-col-title">{t.f_legalTitle}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <a
                href={p(`/${lang}/impressum/`)}
                className="nav-link"
                style={{ fontSize: 14.5, color: 'var(--text-soft)' }}
              >
                {t.f_impressum}
              </a>
              <a
                href={p(`/${lang}/datenschutz/`)}
                className="nav-link"
                style={{ fontSize: 14.5, color: 'var(--text-soft)' }}
              >
                {t.f_datenschutz}
              </a>
              <a
                href="#"
                className="nav-link"
                style={{ fontSize: 14.5, color: 'var(--text-soft)' }}
              >
                {t.f_agb}
              </a>
            </div>
          </div>
        </div>

        {/* Freiburg Districts Local SEO Link Hub */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '24px 28px',
            maxWidth: 1240,
            margin: '0 auto',
          }}
        >
          <details
            style={{ cursor: 'pointer', outline: 'none' }}
            className="districts-details"
          >
            <summary
              style={{
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
                fontWeight: 600,
                listStyle: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                userSelect: 'none',
              }}
            >
              {t.districtsToggle}
            </summary>
            <nav
              aria-label={t.districtsToggle}
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px 32px',
                paddingTop: 20,
              }}
            >
              {DISTRICT_REGIONS.map((region) => (
                <div key={region.id}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--gold)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: 10,
                    }}
                  >
                    {region.name[lang] || region.name.de}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    {region.districts.map((d) => {
                      const slug = getDistrictSlug(d);
                      const isCurrent = currentSlug === slug;
                      return (
                        <a
                          key={d}
                          href={p(`/${lang}/stadtteil/${slug}/`)}
                          aria-current={isCurrent ? 'page' : undefined}
                          className={`district-footer-link ${isCurrent ? 'active' : ''}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 8px',
                            borderRadius: 6,
                            fontSize: 13,
                            color: isCurrent
                              ? 'var(--gold)'
                              : 'var(--text-soft)',
                            fontWeight: isCurrent ? 600 : 400,
                            textDecoration: 'none',
                            background: isCurrent
                              ? 'var(--bg-surface)'
                              : 'transparent',
                            transition: 'color 0.15s, background-color 0.15s',
                          }}
                        >
                          {d}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </details>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div
            style={{
              maxWidth: 1240,
              margin: '0 auto',
              padding: '18px 28px',
              fontSize: 12.5,
              color: 'var(--text-faint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              © 2026 Taxi&#8209;Alica · Freiburg im Breisgau · {t.f_rights}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <a
                href={p(`/${lang}/datenschutz/`)}
                className="nav-link"
                style={{ fontSize: 12.5, color: 'var(--text-faint)' }}
              >
                {t.f_datenschutz}
              </a>
              <span style={{ opacity: 0.4 }}>·</span>
              <a
                href={p(`/${lang}/impressum/`)}
                className="nav-link"
                style={{ fontSize: 12.5, color: 'var(--text-faint)' }}
              >
                {t.f_impressum}
              </a>
            </div>
          </div>
        </div>
      </footer>

      <a
        href={`tel:${PHONE_TEL}`}
        className="sticky-call"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 84,
          zIndex: 120,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--gold)',
          color: 'var(--bg-page)',
          padding: '15px 22px',
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        <PhoneIcon color="#1A1A1A" size={20} />
        {t.sticky}
      </a>
    </>
  );
}
