'use client';

import { useContactForm } from '@/hooks/useContactForm';
import type { Translations } from '@/lib/translations';
import { FormField } from './form/FormField';
import { SelectInput } from './form/SelectInput';
import { TextArea } from './form/TextArea';
import { TextInput } from './form/TextInput';

interface Props {
  t: Translations;
}

export default function ContactForm({ t }: Props) {
  const { fields, errors, submitted, handleSubmit, updateField } =
    useContactForm(t);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  if (submitted && Object.keys(errors).length === 0) {
    return (
      <section id="kontakt" className="contact-section">
        <div className="contact-container">
          <div className="contact-success-card">
            <div
              style={{
                width: 54,
                height: 54,
                margin: '0 auto 18px',
                borderRadius: '50%',
                background: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="var(--bg-page)"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              style={{ fontSize: 18, color: 'var(--text-primary)', margin: 0 }}
            >
              {t.k_success}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="kontakt" className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <div className="section-tag">{t.k_tag}</div>
          <h2 className="contact-h2">{t.k_h2}</h2>
          <p className="contact-subtitle">{t.k_sub}</p>
        </div>

        <form onSubmit={onSubmit} className="contact-form-card">
          {/* Honeypot - hidden from users */}
          <div
            style={{ position: 'absolute', left: '-9999px' }}
            aria-hidden="true"
          >
            <label htmlFor="website">Website</label>
            <input
              type="text"
              name="website"
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={fields.honeypot}
              onChange={(e) => updateField('honeypot', e.target.value)}
            />
          </div>

          {/* Name */}
          <FormField label={t.nameLabel} required error={errors.name}>
            <TextInput
              name="name"
              value={fields.name}
              onChange={(v) => updateField('name', v)}
              placeholder={t.namePlaceholder}
            />
          </FormField>

          <div className="form-field-grid">
            {/* Phone */}
            <FormField label={t.k_phone} required error={errors.phone}>
              <TextInput
                name="phone"
                type="tel"
                value={fields.phone}
                onChange={(v) => updateField('phone', v)}
                placeholder="+49 …"
              />
            </FormField>
            {/* Email */}
            <FormField label={t.k_email} required error={errors.email}>
              <TextInput
                name="email"
                type="email"
                value={fields.email}
                onChange={(v) => updateField('email', v)}
                placeholder="name@mail.de"
              />
            </FormField>
          </div>

          {/* Concern */}
          <FormField label={t.k_concern} style={{ marginTop: 18 }}>
            <SelectInput
              name="concern"
              value={fields.concern}
              onChange={(v) => updateField('concern', v)}
              options={t.k_concernOpts}
              placeholder={t.k_selectPlaceholder}
            />
          </FormField>

          <div className="form-field-grid">
            {/* Pickup */}
            <FormField label={t.k_from}>
              <TextInput
                name="pickup"
                placeholder="Freiburg …"
                value={fields.pickup}
                onChange={(v) => updateField('pickup', v)}
              />
            </FormField>
            {/* Destination */}
            <FormField label={t.k_to}>
              <TextInput
                name="destination"
                placeholder="EuroAirport …"
                value={fields.destination}
                onChange={(v) => updateField('destination', v)}
              />
            </FormField>
          </div>

          <div className="form-field-grid">
            {/* Preferred Time */}
            <FormField label={t.k_date}>
              <TextInput
                name="preferredTime"
                type="date"
                value={fields.preferredTime}
                onChange={(v) => updateField('preferredTime', v)}
                style={{ padding: '12px 14px' }}
              />
            </FormField>
            {/* Passenger Count */}
            <FormField label={t.passengerCountLabel}>
              <TextInput
                name="passengerCount"
                type="number"
                min={1}
                max={20}
                value={fields.passengerCount}
                onChange={(v) => updateField('passengerCount', v)}
              />
            </FormField>
          </div>

          {/* Notes */}
          <FormField label={t.k_message} style={{ marginTop: 18 }}>
            <TextArea
              name="notes"
              rows={3}
              maxLength={500}
              placeholder={t.k_messagePh}
              value={fields.notes}
              onChange={(v) => updateField('notes', v)}
            />
          </FormField>

          {/* Privacy */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 18,
            }}
          >
            <input
              type="checkbox"
              name="privacy"
              checked={fields.privacy}
              onChange={(e) => updateField('privacy', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--gold)' }}
            />
            <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
              {t.k_privacy}
            </span>
          </label>
          {errors.privacy && (
            <div
              style={{
                marginTop: 8,
                color: 'var(--text-error)',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M12 3.2 22 20.5H2z"
                  fill="none"
                  stroke="var(--border-error)"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9.5v5"
                  stroke="var(--border-error)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              {errors.privacy}
            </div>
          )}

          <button type="submit" className="contact-submit-btn btn-gold">
            {t.k_submit}
          </button>
        </form>
      </div>
    </section>
  );
}
