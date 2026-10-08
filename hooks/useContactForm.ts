'use client';

import { useCallback, useState } from 'react';
import type { Translations } from '@/lib/translations';

interface FormFields {
  name: string;
  phone: string;
  email: string;
  concern: string;
  pickup: string;
  destination: string;
  preferredTime: string;
  passengerCount: string;
  notes: string;
  privacy: boolean;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  privacy?: string;
}

const INITIAL_FIELDS: FormFields = {
  name: '',
  phone: '',
  email: '',
  concern: '',
  pickup: '',
  destination: '',
  preferredTime: '',
  passengerCount: '',
  notes: '',
  privacy: false,
  honeypot: '',
};

export function useContactForm(t: Translations) {
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = useCallback(
    (f: FormFields): FormErrors => {
      const e: FormErrors = {};
      if (!f.name || f.name.length < 2) e.name = t.nameError;
      if (!f.phone || f.phone.length < 6) e.phone = t.phoneError;
      if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
        e.email = t.emailError;
      }
      if (!f.privacy) e.privacy = t.privacyError;
      return e;
    },
    [t],
  );

  const handleSubmit = useCallback((): boolean => {
    if (fields.honeypot) return false;
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return false;

    const subject = encodeURIComponent(
      t.k_mailtoSubject.replace('{name}', fields.name),
    );
    const body = encodeURIComponent(
      `${t.k_mailtoName}: ${fields.name}\n${t.k_mailtoPhone}: ${fields.phone}\n${t.k_mailtoEmail}: ${fields.email}\n` +
        `${t.k_mailtoConcern}: ${fields.concern}\n${t.k_mailtoPickup}: ${fields.pickup}\n${t.k_mailtoDestination}: ${fields.destination}\n` +
        `${t.k_mailtoTime}: ${fields.preferredTime}\n${t.k_mailtoPassengers}: ${fields.passengerCount}\n` +
        `${t.k_mailtoNotes}: ${fields.notes}\n---.\n${t.k_mailtoSentFrom}`,
    );
    window.open(`mailto:info@taxi-alica.de?subject=${subject}&body=${body}`);

    setSubmitted(true);
    return true;
  }, [fields, validate, t]);

  const updateField = useCallback(
    (name: keyof FormFields, value: string | boolean) => {
      setFields((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  return { fields, errors, submitted, handleSubmit, updateField };
}
