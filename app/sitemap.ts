export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';
import { destinations } from '@/lib/destinations';
import { DISTRICT_NAMES, getDistrictSlug } from '@/lib/districts';
import { LANGS } from '@/lib/translations';

const BASE = 'https://taxi-alica.de';

const SERVICE_PATHS = [
  'krankenfahrten',
  'flughafentransfer',
  'stadtfahrten',
  'kontakt',
  'interactive-map',
  'datenschutz',
  'impressum',
  'fuhrpark',
  'company-cars',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const landing = LANGS.map((lang) => ({
    url: `${BASE}/${lang}/`,
    lastModified: new Date('2026-06-30'),
    changeFrequency: 'monthly' as const,
    priority: lang === 'de' ? 1.0 : 0.9,
    alternates: {
      languages: Object.fromEntries(LANGS.map((l) => [l, `${BASE}/${l}/`])),
    },
  }));

  const service = LANGS.flatMap((lang) =>
    SERVICE_PATHS.map((path) => ({
      url: `${BASE}/${lang}/${path}/`,
      lastModified: new Date('2026-06-30'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          LANGS.map((l) => [l, `${BASE}/${l}/${path}/`]),
        ),
      },
    })),
  );

  const dest = LANGS.flatMap((lang) =>
    destinations.map((d) => ({
      url: `${BASE}/${lang}/destination/${d.slug}/`,
      lastModified: new Date('2026-06-30'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LANGS.map((l) => [l, `${BASE}/${l}/destination/${d.slug}/`]),
        ),
      },
    })),
  );

  const districts = LANGS.flatMap((lang) =>
    DISTRICT_NAMES.map((d) => {
      const slug = getDistrictSlug(d);
      return {
        url: `${BASE}/${lang}/stadtteil/${slug}/`,
        lastModified: new Date('2026-07-15'),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            LANGS.map((l) => [l, `${BASE}/${l}/stadtteil/${slug}/`]),
          ),
        },
      };
    }),
  );

  return [...landing, ...service, ...dest, ...districts];
}
