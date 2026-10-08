'use client';

import { useEffect } from 'react';
import { p } from '@/lib/base-path';

export default function RootRedirect() {
  useEffect(() => {
    window.location.replace(p('/de/'));
  }, []);
  return (
    <noscript>
      <meta httpEquiv="refresh" content={`0;url=${p('/de/')}`} />
    </noscript>
  );
}
