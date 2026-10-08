'use client';

import { useEffect, useMemo, useState } from 'react';
import { p } from '@/lib/base-path';
import { DISTRICT_NAMES } from '@/lib/districts';
import { haversineKm } from '@/lib/geo';
import { calculatePrice, formatPrice } from '@/lib/tariff';
import type { Translations } from '@/lib/translations';
import PriceBreakdown from './pricing/PriceBreakdown';

const GOLD = 'var(--gold)';
const DIM = 'var(--text-muted)';

const optionBg: React.CSSProperties = {
  background: 'var(--bg-surface)',
};

interface Tariff {
  currency: string;
  base_fare: number;
  per_km_tier1: number;
  per_km_tier2: number;
  district_centers: Record<string, [number, number]>;
  distance_matrix: Record<string, number>;
}

function isNight(): boolean {
  const h = new Date().getHours();
  return h >= 22 || h < 6;
}

function isWeekend(): boolean {
  const d = new Date().getDay();
  return d === 0;
}

interface Props {
  t: Translations;
  lang: string;
  onSelect?: (from: string | null, to: string | null) => void;
}

export default function PricingPanel({ t, lang, onSelect }: Props) {
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const [fromDistrict, setFromDistrict] = useState('');
  const [toDistrict, setToDistrict] = useState('');
  const [showNight, setShowNight] = useState(isNight());
  const [showWeekend, setShowWeekend] = useState(isWeekend());

  useEffect(() => {
    fetch(p('/data/tariffs.json'))
      .then((r) => r.json())
      .then((d: Tariff) => setTariff(d));
  }, []);

  const priceData = useMemo(() => {
    if (!tariff || !fromDistrict || !toDistrict) return null;
    if (fromDistrict === toDistrict)
      return {
        distance: 0,
        base: 0,
        perKm: 0,
        nightSurcharge: 0,
        weekendSurcharge: 0,
        total: 0,
        breakdown: [],
      };

    const night = showNight;
    const weekend = showWeekend;

    let distance: number;
    const key1 = `${fromDistrict}_${toDistrict}`;
    const key2 = `${toDistrict}_${fromDistrict}`;
    const matrix = tariff.distance_matrix;

    if (matrix[key1] !== undefined) {
      distance = matrix[key1];
    } else if (matrix[key2] !== undefined) {
      distance = matrix[key2];
    } else {
      const from = tariff.district_centers[fromDistrict];
      const to = tariff.district_centers[toDistrict];
      if (!from || !to) return null;
      distance = haversineKm(
        { lng: from[0], lat: from[1] },
        { lng: to[0], lat: to[1] },
      );
      distance = Math.round(distance * 10) / 10;
    }

    const priceRes = calculatePrice(distance, {
      isNight: night,
      isSunday: weekend,
    });

    const breakdown: { label: string; value: number }[] = [
      { label: t.p_base_fare, value: priceRes.base },
    ];

    if (distance <= 3) {
      breakdown.push({
        label: `${t.p_per_km} (${distance} ${t.p_km} × ${formatPrice(priceRes.rateTier1)}/km)`,
        value: priceRes.kmCost,
      });
    } else {
      breakdown.push({
        label: `1.–3. km (3 ${t.p_km} × ${formatPrice(priceRes.rateTier1)}/km)`,
        value: priceRes.kmCostTier1,
      });
      breakdown.push({
        label: `ab 3. km (${(distance - 3).toFixed(1)} ${t.p_km} × ${formatPrice(priceRes.rateTier2)}/km)`,
        value: priceRes.kmCostTier2,
      });
    }

    return {
      distance,
      base: priceRes.base,
      perKm: priceRes.kmCost,
      nightSurcharge: priceRes.surcharge,
      weekendSurcharge: 0,
      total: priceRes.total,
      breakdown,
    };
  }, [tariff, fromDistrict, toDistrict, showNight, showWeekend, t]);

  const handleFromChange = (value: string) => {
    setFromDistrict(value);
    onSelect?.(value || null, toDistrict || null);
  };

  const handleToChange = (value: string) => {
    setToDistrict(value);
    onSelect?.(fromDistrict || null, value || null);
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      style={{
        background: 'var(--bg-page)',
        border: '1px solid var(--border-strong)',
        borderRadius: 12,
        padding: 20,
        fontSize: 13,
        color: 'var(--text-primary)',
        fontFamily:
          "var(--font-arabic, var(--font-jp, 'Helvetica Neue')), Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: GOLD }}
      >
        {t.p_title}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 14,
        }}
        dir={dir}
      >
        <select
          value={fromDistrict}
          onChange={(e) => handleFromChange(e.target.value)}
          aria-label={t.p_select_from}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-input)',
            borderRadius: 8,
            padding: '10px 12px',
            color: fromDistrict ? 'var(--text-primary)' : 'var(--text-faint)',
            fontSize: 13,
            fontFamily: 'inherit',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          <option value="" style={optionBg}>
            {t.p_select_from}
          </option>
          {DISTRICT_NAMES.map((name) => (
            <option key={name} value={name} style={optionBg}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={toDistrict}
          onChange={(e) => handleToChange(e.target.value)}
          aria-label={t.p_select_to}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-input)',
            borderRadius: 8,
            padding: '10px 12px',
            color: toDistrict ? 'var(--text-primary)' : 'var(--text-faint)',
            fontSize: 13,
            fontFamily: 'inherit',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          <option value="" style={optionBg}>
            {t.p_select_to}
          </option>
          {DISTRICT_NAMES.map((name) => (
            <option key={name} value={name} style={optionBg}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11.5,
            color: DIM,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showNight}
            onChange={(e) => setShowNight(e.target.checked)}
            style={{ accentColor: GOLD }}
          />
          {t.p_night_tariff}
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11.5,
            color: DIM,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showWeekend}
            onChange={(e) => setShowWeekend(e.target.checked)}
            style={{ accentColor: GOLD }}
          />
          {t.p_weekend_surcharge}
        </label>
      </div>

      {priceData &&
      fromDistrict &&
      toDistrict &&
      fromDistrict !== toDistrict ? (
        <PriceBreakdown
          distance={priceData.distance}
          distanceLabel={t.p_distance}
          kmLabel={t.p_km}
          breakdown={priceData.breakdown}
          total={priceData.total}
          totalLabel={t.p_total}
          estimateText={t.p_estimate}
        />
      ) : fromDistrict && toDistrict && fromDistrict === toDistrict ? (
        <div
          style={{ textAlign: 'center', padding: 12, color: DIM, fontSize: 12 }}
        >
          {fromDistrict} → {toDistrict}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: 12,
            color: 'var(--text-fainter)',
            fontSize: 12,
          }}
        >
          {t.p_select_from}
        </div>
      )}
    </div>
  );
}
