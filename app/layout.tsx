import type { Metadata } from 'next';
import './globals.css';
import { p } from '@/lib/base-path';

export const metadata: Metadata = {
  metadataBase: new URL('https://taxi-alica.de'),
  title: {
    default: 'Taxi Alica | Ihr Zuverlässiger Taxi-Service',
    template: '%s | Taxi Alica',
  },
  description:
    'Sitzende Krankenfahrten, Flughafentransfer und komfortable Personenbeförderung in Freiburg im Breisgau. Direktabrechnung mit allen Krankenkassen nach § 60 SGB V.',
  openGraph: {
    siteName: 'Taxi Alica',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href={p('/logo_low_res.png')} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.body.classList.add('light-theme');
                  } else {
                    document.body.classList.remove('light-theme');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
