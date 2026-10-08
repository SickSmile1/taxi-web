import { LANGS, type Lang } from './translations';

const BASE = 'https://taxi-alica.de';

export function buildHreflang(pathSuffix = ''): Record<string, string> {
  return {
    ...Object.fromEntries(LANGS.map((l) => [l, `${BASE}/${l}/${pathSuffix}`])),
    'x-default': `${BASE}/de/${pathSuffix}`,
  };
}

export function buildDestHreflang(slug: string): Record<string, string> {
  return buildHreflang(`destination/${slug}/`);
}

export function buildDistrictHreflang(slug: string): Record<string, string> {
  return buildHreflang(`stadtteil/${slug}/`);
}

export const OG_LOCALE: Record<Lang, string> = {
  de: 'de_DE',
  en: 'en_US',
  zh: 'zh_CN',
  ar: 'ar_SA',
  es: 'es_ES',
  fr: 'fr_FR',
  ja: 'ja_JP',
};
