'use client';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
  label: string;
}

export default function ThemeToggle({
  theme,
  onToggle,
  label,
}: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: 'none',
        border: '1px solid var(--border-soft)',
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: 16,
        color: 'var(--text-primary)',
        padding: 0,
        transition: 'border-color 0.15s, transform 0.15s',
      }}
      className="theme-toggle-btn"
      aria-label={label}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
