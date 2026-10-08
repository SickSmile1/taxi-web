'use client';

interface FareRowProps {
  label: string;
  value: string | number;
  dim?: boolean;
  bold?: boolean;
  highlight?: boolean;
  size?: number;
}

export default function FareRow({
  label,
  value,
  dim = true,
  bold = false,
  highlight = false,
  size = 12,
}: FareRowProps) {
  const formattedValue =
    typeof value === 'number' ? `${value.toFixed(2)} €` : value;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: size >= 14 ? '10px 0 0' : '3px 0',
        fontSize: size,
      }}
    >
      <span
        style={{
          color: highlight
            ? 'var(--gold)'
            : dim
              ? 'var(--text-muted)'
              : 'inherit',
          fontWeight: bold ? 700 : 400,
          fontSize: size >= 14 ? 14 : size,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontWeight: bold ? 700 : 400,
          fontSize: size >= 14 ? (highlight ? 18 : 14) : size,
          fontFamily: highlight ? "'Spectral', serif" : 'inherit',
          color: highlight ? 'var(--gold)' : 'inherit',
        }}
      >
        {formattedValue}
      </span>
    </div>
  );
}
