'use client';

import { useParams } from 'next/navigation';
import { getTranslation, LANGS, type Lang } from '@/lib/translations';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const rawLang = (params?.lang as string) || 'en';
  const lang: Lang = LANGS.includes(rawLang as Lang) ? (rawLang as Lang) : 'en';
  const t = getTranslation(lang);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Spectral, serif',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>{t.errorTitle}</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {t.errorDescription}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#e6b032',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {t.errorRetry}
        </button>
      </div>
    </div>
  );
}
