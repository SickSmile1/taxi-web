import Link from 'next/link';
import { getTranslation } from '@/lib/translations';

export default function NotFound() {
  const t = getTranslation('en');

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
        <h1
          style={{ fontSize: '4rem', color: '#e6b032', marginBottom: '1rem' }}
        >
          404
        </h1>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          {t.notFoundTitle}
        </h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {t.notFoundDescription}
        </p>
        <Link
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#e6b032',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block',
          }}
        >
          {t.notFoundBack}
        </Link>
      </div>
    </div>
  );
}
