'use client';

interface SelectInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

export function SelectInput({
  name,
  value,
  onChange,
  options,
  placeholder,
}: SelectInputProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="form-input"
      style={{ appearance: 'none' }}
    >
      <option value="" style={{ background: 'var(--bg-surface-2)' }}>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option
          key={opt}
          value={opt}
          style={{ background: 'var(--bg-surface-2)' }}
        >
          {opt}
        </option>
      ))}
    </select>
  );
}
