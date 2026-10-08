import { p } from '@/lib/base-path';
import type { Lang, Translations } from '@/lib/translations';

interface AboutSectionProps {
  t: Translations;
  lang?: Lang;
}

export default function AboutSection({ t, lang = 'de' }: AboutSectionProps) {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="section-tag">{t.aboutTag}</div>
        <h2 className="about-h2">{t.aboutTitle}</h2>
        {t.aboutIntro.split('\n\n').map((p) => (
          <p key={p.slice(0, 40)} className="about-p">
            {p}
          </p>
        ))}
        {t.aboutHistory.split('\n\n').map((p) => (
          <p key={p.slice(0, 40)} className="about-p">
            {p}
          </p>
        ))}

        <div style={{ margin: '20px 0 28px' }}>
          <a
            href={p(`/${lang}/fuhrpark/`)}
            className="btn-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 22px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <span>🚘</span>
            <span>{t.navCars} (360°)</span>
            <span>→</span>
          </a>
        </div>

        <div className="about-quote-card">
          <h3
            style={{
              fontFamily: "'Spectral', 'Noto Serif SC', Georgia, serif",
              fontWeight: 600,
              fontSize: 22,
              margin: '0 0 18px',
              color: 'var(--gold)',
            }}
          >
            {t.aboutPhilosophyTitle}
          </h3>
          {t.aboutPhilosophyQuote.split('\n\n').map((p) => (
            <p
              key={p.slice(0, 40)}
              style={{
                fontSize: 16,
                lineHeight: 1.75,
                color: 'var(--text-soft)',
                fontStyle: 'italic',
                margin: '0 0 14px',
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
