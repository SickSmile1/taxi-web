'use client';

import { useEffect, useRef, useState } from 'react';
import { p } from '@/lib/base-path';
import type { Lang, Translations } from '@/lib/translations';

export const LANG_LABELS: Record<Lang, string> = {
  de: 'DE',
  en: 'EN',
  zh: '中',
  ar: 'ع',
  es: 'ES',
  fr: 'FR',
  ja: '日',
};

export const LANG_DETAILS: Record<
  Lang,
  { code: string; label: string; native: string }
> = {
  de: { code: 'DE', label: 'Deutsch', native: 'Deutsch' },
  en: { code: 'EN', label: 'English', native: 'English' },
  fr: { code: 'FR', label: 'Français', native: 'Français' },
  es: { code: 'ES', label: 'Español', native: 'Español' },
  ar: { code: 'AR', label: 'العربية', native: 'العربية' },
  ja: { code: 'JA', label: '日本語', native: '日本語' },
  zh: { code: 'ZH', label: '中文', native: '中文' },
};

const navLinkStyle: React.CSSProperties = {
  color: 'var(--text-soft)',
  fontSize: 14.5,
  letterSpacing: '0.02em',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '8px 16px',
  color: 'var(--text-soft)',
  fontSize: 13.5,
};

interface DesktopNavProps {
  t: Translations;
  lang: Lang;
  langLinks: Record<Lang, string>;
}

export default function DesktopNav({ t, lang, langLinks }: DesktopNavProps) {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANG_DETAILS[lang] || {
    code: lang.toUpperCase(),
    label: lang.toUpperCase(),
    native: lang.toUpperCase(),
  };

  return (
    <>
      <nav
        className="desktop-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <a
          href={p(`/${lang}/interactive-map/`)}
          className="nav-link"
          style={navLinkStyle}
        >
          {t.navInteractive}
        </a>

        <div className="dropdown" style={{ position: 'relative' }}>
          <button
            type="button"
            className="nav-link"
            aria-controls="service-dropdown"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-soft)',
              fontSize: 14.5,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '10px 0',
            }}
          >
            {t.navService}
            <span style={{ fontSize: 9, opacity: 0.8 }}>▼</span>
          </button>
          <div
            id="service-dropdown"
            role="menu"
            className="dropdown-content"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'var(--bg-page)',
              border: '1px solid var(--border-strong)',
              borderRadius: 8,
              padding: '8px 0',
              minWidth: 180,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              display: 'none',
              flexDirection: 'column',
              gap: 2,
              zIndex: 200,
            }}
          >
            <a
              href={p(`/${lang}/stadtfahrten/`)}
              className="dropdown-item"
              style={dropdownItemStyle}
            >
              {t.nav2}
            </a>
            <a
              href={p(`/${lang}/krankenfahrten/`)}
              className="dropdown-item"
              style={dropdownItemStyle}
            >
              {t.nav0}
            </a>
            <a
              href={p(`/${lang}/flughafentransfer/`)}
              className="dropdown-item"
              style={dropdownItemStyle}
            >
              {t.nav1}
            </a>
          </div>
        </div>

        <a
          href={p(`/${lang}/fuhrpark/`)}
          className="nav-link"
          style={navLinkStyle}
        >
          {t.navCars}
        </a>

        <a
          href={p(`/${lang}/#about`)}
          className="nav-link"
          style={navLinkStyle}
        >
          {t.navAbout}
        </a>
        <a
          href={p(`/${lang}/kontakt/`)}
          className="nav-link"
          style={navLinkStyle}
        >
          {t.nav3}
        </a>
      </nav>

      {/* Language Selector Dropdown */}
      <div
        ref={langRef}
        className="dropdown desktop-lang-dropdown"
        style={{ position: 'relative' }}
      >
        <button
          type="button"
          onClick={() => setLangOpen((prev) => !prev)}
          className="nav-link"
          aria-haspopup="true"
          aria-expanded={langOpen}
          aria-label="Select Language"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-soft)',
            borderRadius: 999,
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            transition: 'border-color 0.2s, background-color 0.2s',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--gold)' }}>🌐</span>
          <span>{currentLang.code}</span>
          <span
            style={{
              fontSize: 8,
              opacity: 0.7,
              marginLeft: 2,
              transform: langOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          >
            ▼
          </span>
        </button>

        <div
          role="menu"
          className="dropdown-content"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--bg-page)',
            border: '1px solid var(--border-strong)',
            borderRadius: 10,
            padding: '6px 0',
            minWidth: 164,
            boxShadow: '0 10px 36px rgba(0,0,0,0.65)',
            display: langOpen ? 'flex' : 'none',
            flexDirection: 'column',
            gap: 2,
            zIndex: 250,
          }}
        >
          {(Object.entries(langLinks) as [Lang, string][]).map(([l, href]) => {
            const isCurrent = lang === l;
            const item = LANG_DETAILS[l] || {
              code: l.toUpperCase(),
              native: l.toUpperCase(),
            };
            return (
              <a
                key={l}
                href={p(href)}
                role="menuitem"
                className="dropdown-item"
                onClick={() => setLangOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 16px',
                  fontSize: 13.5,
                  color: isCurrent ? 'var(--gold)' : 'var(--text-soft)',
                  fontWeight: isCurrent ? 700 : 400,
                  background: isCurrent ? 'var(--bg-surface)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                <span>{item.native}</span>
                <span
                  style={{
                    fontSize: 11.5,
                    color: isCurrent ? 'var(--gold)' : 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {item.code}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
