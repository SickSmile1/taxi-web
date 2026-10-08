'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { p } from '@/lib/base-path';
import { GOLD } from '@/lib/constants';
import { setRoute } from '@/lib/route-store';
import { calculatePrice } from '@/lib/tariff';
import type { Translations } from '@/lib/translations';

const RouteCalculator = dynamic(() => import('./RouteCalculator'), {
  ssr: false,
});
const ThreeMap = dynamic(() => import('./ThreeMap'), { ssr: false });

interface MapIslandProps {
  t: Translations;
  selectedFrom?: string | null;
  selectedTo?: string | null;
  mode?: 'basic' | 'full';
  fullStretch?: boolean;
}

export default function MapIsland({
  t,
  selectedFrom,
  selectedTo,
  mode = 'basic',
  fullStretch = false,
}: MapIslandProps) {
  const [hoveredAp, setHoveredAp] = useState<string | null>(null);

  const handleAirportClick = async (ap: {
    slug: string;
    file: string;
    name: string;
    dist: number;
  }) => {
    // 1. Fetch pre-calculated OSRM route geometry from local public file
    let geometry: [number, number][] = [];
    try {
      const res = await fetch(p(`/data/routes/hbf-${ap.file}.json`));
      if (res.ok) {
        const data = await res.json();
        geometry = data;
      }
    } catch {
      /* proceed with fallback below */
    }

    if (!geometry || geometry.length === 0) {
      // Fallback: straight-line geometry
      const start: [number, number] = [7.841452, 47.996942]; // Freiburg Hbf
      const dest: [number, number] =
        ap.slug === 'euroairport-basel'
          ? [7.5297, 47.5896]
          : ap.slug === 'karlsruhe-airport'
            ? [8.08, 48.7794]
            : ap.slug === 'flughafen-frankfurt'
              ? [8.5705, 50.0333]
              : [11.7861, 48.3538];
      for (let i = 0; i <= 30; i++) {
        const pct = i / 30;
        const lng = start[0] + (dest[0] - start[0]) * pct;
        const lat = start[1] + (dest[1] - start[1]) * pct;
        geometry.push([lng, lat]);
      }
    }

    // 2. Dispatch the route update to start the 3D animation
    setRoute({
      pickup: {
        street: 'Freiburg Hauptbahnhof',
        coords: [7.841452, 47.996942],
      },
      destination: { name: ap.name, coords: geometry[geometry.length - 1] },
      distanceKm: ap.dist,
      durationMin: Math.round(ap.dist * 0.8),
      price: calculatePrice(ap.dist),
      geometry,
    });
  };

  return (
    <div
      style={
        fullStretch
          ? { width: '100%', height: '100%' }
          : { height: 480, padding: '0 28px', maxWidth: 1240, margin: '0 auto' }
      }
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <ThreeMap mode={mode} />

        {/* Route Calculator panel positioned on top left */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 25,
          }}
        >
          <RouteCalculator t={t} />
        </div>

        {/* Airport Buttons Bar positioned on bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            zIndex: 20,
            display: 'flex',
            gap: 6,
            background: 'rgba(26, 26, 26, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-strong)',
            padding: '6px 10px',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: 'var(--gold)',
              fontWeight: 700,
              fontSize: 11,
              marginRight: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t.airportsLabel}
          </span>
          {[
            {
              slug: 'euroairport-basel',
              file: 'basel',
              name: 'EuroAirport Basel (BSL)',
              dist: 70,
            },
            {
              slug: 'karlsruhe-airport',
              file: 'karlsruhe',
              name: 'Karlsruhe / Baden-Baden (FKB)',
              dist: 110,
            },
            {
              slug: 'flughafen-frankfurt',
              file: 'frankfurt',
              name: 'Flughafen Frankfurt (FRA)',
              dist: 260,
            },
            {
              slug: 'muenchen-airport',
              file: 'munich',
              name: 'München International (MUC)',
              dist: 430,
            },
          ].map((ap) => (
            <button
              key={ap.slug}
              onClick={() => handleAirportClick(ap)}
              onMouseEnter={() => setHoveredAp(ap.slug)}
              onMouseLeave={() => setHoveredAp(null)}
              aria-label={`Select ${ap.name} airport`}
              style={{
                background:
                  hoveredAp === ap.slug
                    ? 'var(--bg-elevated)'
                    : 'var(--bg-surface)',
                border: '1px solid var(--border-input)',
                borderColor:
                  hoveredAp === ap.slug ? 'var(--gold)' : 'var(--border-input)',
                color:
                  hoveredAp === ap.slug ? 'var(--gold)' : 'var(--text-primary)',
                padding: '6px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {ap.name.split('(')[1].replace(')', '')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
