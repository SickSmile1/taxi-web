'use client';

import { useState } from 'react';
import { p } from '@/lib/base-path';
import { FLEET_GALLERY_IMAGES, type FleetGalleryItem } from '@/lib/fleet';
import type { Lang, Translations } from '@/lib/translations';

interface Props {
  t: Translations;
  lang: Lang;
}

export default function FleetRealGallery({ t, lang }: Props) {
  const [lightboxImg, setLightboxImg] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  return (
    <section style={{ marginTop: 40, marginBottom: 50 }}>
      <div className="section-tag" style={{ marginBottom: 8 }}>
        Echte Flotteneindrücke
      </div>
      <h3
        style={{
          fontFamily: "'Spectral', 'Noto Serif SC', Georgia, serif",
          fontWeight: 600,
          fontSize: 28,
          lineHeight: 1.2,
          margin: '0 0 10px',
          color: 'var(--text-heading)',
        }}
      >
        {t.fuhrpark_overview_title}
      </h3>
      <p
        style={{
          fontSize: 15.5,
          color: 'var(--text-muted)',
          margin: '0 0 28px',
          maxWidth: 720,
          lineHeight: 1.6,
        }}
      >
        {t.fuhrpark_overview_sub}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}
      >
        {FLEET_GALLERY_IMAGES.map((item: FleetGalleryItem) => {
          const title = item.title[lang] || item.title.de;
          const subtitle = item.subtitle[lang] || item.subtitle.de;
          const imgSrc = p(item.file);

          return (
            <div
              key={item.id}
              onClick={() =>
                setLightboxImg({
                  src: imgSrc,
                  alt: title,
                  caption: `${title} — ${subtitle}`,
                })
              }
              className="airport-card"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 14,
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: item.aspectRatio,
                  background: '#0d1117',
                  overflow: 'hidden',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(6px)',
                    color: 'var(--gold)',
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(230,176,50,0.3)',
                  }}
                >
                  HD Foto 🔍
                </span>
              </div>
              <div style={{ padding: '18px 20px', flex: 1 }}>
                <h4
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--text-heading)',
                    margin: '0 0 6px',
                  }}
                >
                  {title}
                </h4>
                <p
                  style={{
                    fontSize: 13.5,
                    color: 'var(--text-soft)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxImg && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 24,
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              fontSize: 24,
              width: 44,
              height: 44,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImg.src}
            alt={lightboxImg.alt}
            style={{
              maxWidth: '92vw',
              maxHeight: '84vh',
              objectFit: 'contain',
              borderRadius: 12,
              boxShadow: '0 0 50px rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
          {lightboxImg.caption && (
            <div
              style={{
                marginTop: 16,
                color: '#f0f0f0',
                fontSize: 14,
                fontWeight: 600,
                background: 'rgba(0,0,0,0.7)',
                padding: '8px 20px',
                borderRadius: 999,
                textAlign: 'center',
                maxWidth: '80vw',
              }}
            >
              {lightboxImg.caption}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
