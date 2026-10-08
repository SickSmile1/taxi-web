'use client';

import type { ReactNode } from 'react';

interface CollapsiblePriceProps {
  open: boolean;
  onToggle: () => void;
  priceLabel: string;
  children: ReactNode;
}

export default function CollapsiblePrice({
  open,
  onToggle,
  priceLabel,
  children,
}: CollapsiblePriceProps) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-surface)',
          padding: '10px 12px',
          borderRadius: 8,
          marginBottom: 8,
          border: '1px solid var(--border-soft)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--gold)' }}>
          {priceLabel}
        </span>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-label="Toggle price details"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--gold)',
            fontSize: 11.5,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {open ? '🔼 Details' : '🔽 Details'}
        </button>
      </div>

      {open && (
        <div
          style={{
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
