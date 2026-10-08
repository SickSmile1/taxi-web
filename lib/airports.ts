import { getPrices } from './prices';

interface Airport {
  name: string;
  iata: string;
  std: string;
  large: string;
  shape: 'sedan' | 'estate';
  tone: 'white' | 'black';
}

const SLUGS: Record<string, string> = {
  'EuroAirport Basel-Mulhouse-Freiburg': 'euroairport-basel',
  'Karlsruhe / Baden-Baden': 'karlsruhe-airport',
  'Flughafen Zürich': 'flughafen-zuerich',
  'Flughafen Stuttgart': 'flughafen-stuttgart',
  'Allgäu Airport Memmingen': 'flughafen-memmingen',
  'Flughafen Frankfurt': 'flughafen-frankfurt',
  'München International': 'muenchen-airport',
};

type RawAirport = Omit<Airport, 'std' | 'large'>;

function enrichAirport(a: RawAirport): Airport {
  const slug = SLUGS[a.name];
  const p = slug ? getPrices(slug) : null;
  return {
    ...a,
    std: p?.std ?? '',
    large: p?.large ?? '',
  };
}

const baseData: RawAirport[] = [
  {
    name: 'EuroAirport Basel-Mulhouse-Freiburg',
    iata: 'MLH · BSL · EAP',
    shape: 'sedan',
    tone: 'white',
  },
  {
    name: 'Karlsruhe / Baden-Baden',
    iata: 'FKB',
    shape: 'sedan',
    tone: 'black',
  },
  {
    name: 'Flughafen Zürich',
    iata: 'ZRH',
    shape: 'sedan',
    tone: 'white',
  },
  {
    name: 'Flughafen Stuttgart',
    iata: 'STR',
    shape: 'estate',
    tone: 'black',
  },
  {
    name: 'Allgäu Airport Memmingen',
    iata: 'FMM',
    shape: 'estate',
    tone: 'white',
  },
  {
    name: 'Flughafen Frankfurt',
    iata: 'FRA',
    shape: 'sedan',
    tone: 'white',
  },
];

export const airportBase: Airport[] = baseData.map(enrichAirport);
