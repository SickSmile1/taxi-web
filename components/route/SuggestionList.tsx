'use client';

export interface SuggestionItem {
  id: string;
  label: string;
  sublabel?: string;
  sublabelColor?: 'muted' | 'gold';
}

interface SuggestionListProps {
  items: SuggestionItem[];
  activeIndex: number;
  onSelect: (item: SuggestionItem, index: number) => void;
  onHover: (index: number) => void;
  ariaLabel: string;
}

export default function SuggestionList({
  items,
  activeIndex,
  onSelect,
  onHover,
  ariaLabel,
}: SuggestionListProps) {
  if (items.length === 0) return null;

  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-input)',
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 200,
        overflowY: 'auto',
      }}
    >
      {items.map((item, idx) => (
        <div
          key={item.id}
          role="option"
          tabIndex={0}
          aria-selected={idx === activeIndex}
          onClick={() => onSelect(item, idx)}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border-soft)',
            fontSize: 12,
            background: idx === activeIndex ? 'var(--bg-soft)' : 'transparent',
            color: idx === activeIndex ? 'var(--gold)' : 'var(--text-primary)',
          }}
          onMouseEnter={() => onHover(idx)}
        >
          {item.label}
          {item.sublabel && (
            <span
              style={{
                color:
                  item.sublabelColor === 'gold'
                    ? 'var(--gold)'
                    : 'var(--text-muted)',
                marginLeft: 6,
                fontSize: 11,
              }}
            >
              {item.sublabel}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
