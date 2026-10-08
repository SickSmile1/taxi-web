import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE = 'https://taxi-alica.de';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
