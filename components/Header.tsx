'use client';

import { useEffect, useState } from 'react';
import { p } from '@/lib/base-path';
import { PHONE_DISPLAY, PHONE_TEL, PhoneIcon } from '@/lib/constants';
import type { Lang, Translations } from '@/lib/translations';
import DesktopNav from './header/DesktopNav';
import MobileDrawer from './header/MobileDrawer';
import ThemeToggle from './header/ThemeToggle';
import TaxiLogo from './TaxiLogo';

interface Props {
  t: Translations;
  lang: Lang;
  langLinks: Record<Lang, string>;
}

export default function Header({ t, lang, langLinks }: Props) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.body.classList.toggle('light-theme', nextTheme === 'light');
    window.dispatchEvent(
      new CustomEvent('theme-change', { detail: nextTheme }),
    );
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a
          href={p(`/${lang}/`)}
          style={{ display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <TaxiLogo width={96} />
          <span className="site-brand-title">Taxi Alica</span>
        </a>

        <DesktopNav t={t} lang={lang} langLinks={langLinks} />

        <div className="site-header-actions">
          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
            label={theme === 'dark' ? t.themeToggleLight : t.themeToggleDark}
          />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            aria-label={t.navigationMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <a
            href={`tel:${PHONE_TEL}`}
            className="btn-gold phone-btn site-header-phone-btn"
          >
            <PhoneIcon color="var(--bg-page)" size={16} />
            <span className="phone-btn-text">{PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>

      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        t={t}
        lang={lang}
        langLinks={langLinks}
      />
    </header>
  );
}
