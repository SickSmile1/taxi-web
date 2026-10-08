'use client';

import { p } from '@/lib/base-path';
import type { Lang, Translations } from '@/lib/translations';
import { LANG_DETAILS, LANG_LABELS } from './DesktopNav';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
  lang: Lang;
  langLinks: Record<Lang, string>;
}

export default function MobileDrawer({
  open,
  onClose,
  t,
  lang,
  langLinks,
}: MobileDrawerProps) {
  return (
    <div
      id="mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={open ? t.menuClose : t.menuOpen}
      className={`mobile-drawer ${open ? 'open' : ''}`}
    >
      <a
        href={p(`/${lang}/interactive-map/`)}
        className="mobile-drawer-link"
        onClick={onClose}
      >
        {t.navInteractive}
      </a>
      <a
        href={p(`/${lang}/stadtfahrten/`)}
        className="mobile-drawer-link"
        onClick={onClose}
      >
        {t.nav2}
      </a>
      <a
        href={p(`/${lang}/krankenfahrten/`)}
        className="mobile-drawer-link"
        onClick={onClose}
      >
        {t.nav0}
      </a>
      <a
        href={p(`/${lang}/flughafentransfer/`)}
        className="mobile-drawer-link"
        onClick={onClose}
      >
        {t.nav1}
      </a>
      <a
        href={p(`/${lang}/fuhrpark/`)}
        className="mobile-drawer-link"
        onClick={onClose}
      >
        {t.navCars}
      </a>
      <a
        href={p(`/${lang}/#about`)}
        className="mobile-drawer-link"
        onClick={onClose}
      >
        {t.navAbout}
      </a>
      <a
        href={p(`/${lang}/kontakt/`)}
        className="mobile-drawer-link"
        onClick={onClose}
      >
        {t.nav3}
      </a>

      {/* Language Selection inside Drawer */}
      <div
        style={{
          marginTop: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Sprache / Language
        </span>
        <div style={{ position: 'relative' }}>
          <select
            value={lang}
            onChange={(e) => {
              const next = e.target.value as Lang;
              if (langLinks[next]) {
                onClose();
                window.location.href = p(langLinks[next]);
              }
            }}
            aria-label="Sprache auswählen"
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: 8,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
            }}
          >
            {(Object.entries(langLinks) as [Lang, string][]).map(([l]) => {
              const info = LANG_DETAILS[l] || {
                code: l.toUpperCase(),
                native: l.toUpperCase(),
              };
              return (
                <option
                  key={l}
                  value={l}
                  style={{
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {info.native} ({info.code})
                </option>
              );
            })}
          </select>
          <span
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: 10,
              color: 'var(--text-muted)',
            }}
          >
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}
