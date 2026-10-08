'use client';

import type { CSSProperties, ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  style?: CSSProperties;
}

export function FormField({
  label,
  children,
  error,
  required,
  style,
}: FormFieldProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is rendered via children
    <label className="form-field" style={style}>
      <span className="form-label-text">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
      {error && <span className="form-error-msg">{error}</span>}
    </label>
  );
}
