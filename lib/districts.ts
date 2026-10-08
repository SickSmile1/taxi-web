import DISTRICT_NAMES_JSON from './district-names.json';

export const DISTRICT_NAMES: readonly string[] = DISTRICT_NAMES_JSON;

export function getDistrictSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getDistrictBySlug(slug: string): string | undefined {
  return DISTRICT_NAMES.find((d) => getDistrictSlug(d) === slug);
}

export interface DistrictRegion {
  id: string;
  name: Record<string, string>;
  districts: string[];
}

export const DISTRICT_REGIONS: readonly DistrictRegion[] = [
  {
    id: 'center-east',
    name: {
      de: 'Zentrum & Ost',
      en: 'Center & East',
      zh: '中心与东区',
      ar: 'الوسط والشرق',
      es: 'Centro y Este',
      fr: 'Centre et Est',
      ja: '中心部・東部',
    },
    districts: [
      'Altstadt',
      'Neuburg',
      'Oberau',
      'Herdern',
      'Wiehre',
      'Waldsee',
      'Littenweiler',
      'Ebnet',
      'Kappel',
    ],
  },
  {
    id: 'north-west',
    name: {
      de: 'Nord & West',
      en: 'North & West',
      zh: '北区与西区',
      ar: 'الشمال والغرب',
      es: 'Norte y Oeste',
      fr: 'Nord et Ouest',
      ja: '北部・西部',
    },
    districts: [
      'Zähringen',
      'Brühl',
      'Mooswald',
      'Landwasser',
      'Betzenhausen',
      'Lehen',
      'Hochdorf',
      'Wildtal',
    ],
  },
  {
    id: 'south-southwest',
    name: {
      de: 'Süd & Südwest',
      en: 'South & Southwest',
      zh: '南区与西南区',
      ar: 'الجنوب والجنوب الغربي',
      es: 'Sur y Suroeste',
      fr: 'Sud et Sud-Ouest',
      ja: '南部・南西部',
    },
    districts: [
      'Stühlinger',
      'Haslach',
      'Weingarten',
      'Rieselfeld',
      'Vauban',
      'Sankt Georgen',
      'Günterstal',
    ],
  },
  {
    id: 'tuniberg-outskirts',
    name: {
      de: 'Tuniberg & Umland',
      en: 'Tuniberg & Outskirts',
      zh: '图尼堡与周边地区',
      ar: 'تونيبيرغ والمحيط',
      es: 'Tuniberg y Alrededores',
      fr: 'Tuniberg et Environs',
      ja: 'トゥニベルク・周辺地域',
    },
    districts: [
      'Opfingen',
      'Tiengen',
      'Munzingen',
      'Waltershofen',
      'Mundenhof',
    ],
  },
];
