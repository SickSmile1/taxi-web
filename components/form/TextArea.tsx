'use client';

interface TextAreaProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export function TextArea({
  name,
  value,
  onChange,
  placeholder,
  rows,
  maxLength,
}: TextAreaProps) {
  return (
    <textarea
      name={name}
      rows={rows}
      maxLength={maxLength}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="form-input"
      style={{ resize: 'vertical' }}
    />
  );
}
