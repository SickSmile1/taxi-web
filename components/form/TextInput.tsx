'use client';

import type { CSSProperties, InputHTMLAttributes } from 'react';

interface TextInputProps {
  name: string;
  type?: InputHTMLAttributes<'input'>['type'];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  autoComplete?: string;
  min?: number;
  max?: number;
  style?: CSSProperties;
}

export function TextInput({
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  inputMode,
  autoComplete,
  min,
  max,
  style,
}: TextInputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      autoComplete={autoComplete}
      min={min}
      max={max}
      className="form-input"
      style={style}
    />
  );
}
