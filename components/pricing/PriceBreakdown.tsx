'use client';

import FareRow from './FareRow';

interface PriceBreakdownProps {
  distance: number;
  distanceLabel: string;
  kmLabel: string;
  breakdown: { label: string; value: number }[];
  total: number;
  totalLabel: string;
  estimateText: string;
}

export default function PriceBreakdown({
  distance,
  distanceLabel,
  kmLabel,
  breakdown,
  total,
  totalLabel,
  estimateText,
}: PriceBreakdownProps) {
  return (
    <div>
      <div
        style={{
          padding: 12,
          background: 'var(--bg-surface)',
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {distanceLabel}
          </span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            {distance} {kmLabel}
          </span>
        </div>
        {breakdown.map((item) => (
          <FareRow key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-strong)',
        }}
      >
        <FareRow
          label={totalLabel}
          value={total}
          dim={false}
          bold
          highlight
          size={14}
        />
      </div>

      <div style={{ fontSize: 10.5, color: 'var(--text-faint)', marginTop: 8 }}>
        {estimateText}
      </div>
    </div>
  );
}
