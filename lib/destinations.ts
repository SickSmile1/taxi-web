import { getPrices } from './prices';
import type { Lang } from './translations';

type DestinationKind = 'airport' | 'landmark';

interface Destination {
  slug: string;
  kind: DestinationKind;
  name: string;
  iata?: string;
  priceStd?: string;
  priceLarge?: string;
  distanceKm: number;
  lng?: number;
  lat?: number;
  metaTitles: Partial<Record<Lang, string>>;
  metaDescriptions: Partial<Record<Lang, string>>;
  descriptions: Partial<Record<Lang, string>>;
}

export function getMeta(dest: Destination, lang: Lang) {
  const fallback = (map: Partial<Record<Lang, string>>) =>
    map[lang] ?? map.en ?? map.de ?? '';
  return {
    title: fallback(dest.metaTitles),
    description: fallback(dest.metaDescriptions),
    body: fallback(dest.descriptions),
  };
}

function enrichPrices(dest: Destination): Destination {
  const p = getPrices(dest.slug);
  if (p) {
    dest.priceStd = p.std;
    dest.priceLarge = p.large;
  }
  return dest;
}

export const destinations: Destination[] = (
  [
    {
      slug: 'euroairport-basel',
      kind: 'airport',
      name: 'EuroAirport Basel-Mulhouse-Freiburg',
      iata: 'MLH / BSL / EAP',
      distanceKm: 70,
      lng: 7.5297,
      lat: 47.5896,
      metaTitles: {
        de: 'Flughafentransfer EuroAirport Basel | Taxi Freiburg',
        en: 'Airport Transfer EuroAirport Basel | Taxi Freiburg',
      },
      metaDescriptions: {
        de: 'Taxi von Freiburg zum EuroAirport Basel-Mulhouse-Freiburg (MLH/BSL). Standard-Transfer 180–200 €. Großraumtaxi +20 €. Zuverlässiger Transfer von Taxi-Alica.',
        en: 'Taxi from Freiburg to EuroAirport Basel-Mulhouse-Freiburg (MLH/BSL). Standard transfer 180–200 €. Large taxi +20 €. Reliable transfer by Taxi-Alica.',
      },
      descriptions: {
        de: 'Zuverlässiger Transfer vom Freiburg Stadtgebiet zum EuroAirport Basel-Mulhouse-Freiburg (ca. 70 km). Der primäre Regionalflughafen der Region — ideal für Kurz- und Mittelstreckenflüge.',
        en: "Reliable transfer from Freiburg city area to EuroAirport Basel-Mulhouse-Freiburg (approx. 70 km). The region's primary regional airport — ideal for short and medium-haul flights.",
      },
    },
    {
      slug: 'karlsruhe-airport',
      kind: 'airport',
      name: 'Karlsruhe / Baden-Baden Airport',
      iata: 'FKB',
      distanceKm: 110,
      lng: 8.08,
      lat: 48.7794,
      metaTitles: {
        de: 'Flughafentransfer Karlsruhe FKB | Taxi Freiburg',
        en: 'Airport Transfer Karlsruhe FKB | Taxi Freiburg',
      },
      metaDescriptions: {
        de: 'Taxi von Freiburg zum Baden-Airpark Karlsruhe/Baden-Baden (FKB) — ca. 110 km. Standard-Transfer 250–280 €. Großraum +20 €. Taxi-Alica Freiburg.',
        en: 'Taxi from Freiburg to Baden-Airpark Karlsruhe/Baden-Baden (FKB) — approx. 110 km. Standard transfer 250–280 €. Large taxi +20 €. Taxi-Alica Freiburg.',
      },
      descriptions: {
        de: 'Transfer zum Baden-Airpark Karlsruhe/Baden-Baden (ca. 110 km nördlich von Freiburg). Gut geeignet für Ryanair und andere Low-Cost-Carrier.',
        en: 'Transfer to Baden-Airpark Karlsruhe/Baden-Baden (approx. 110 km north of Freiburg). Well suited for Ryanair and other low-cost carriers.',
      },
    },
    {
      slug: 'flughafen-zuerich',
      kind: 'airport',
      name: 'Flughafen Zürich',
      iata: 'ZRH',
      distanceKm: 150,
      lng: 8.5492,
      lat: 47.4582,
      metaTitles: {
        de: 'Flughafentransfer Zürich ZRH | Taxi Freiburg',
        en: 'Airport Transfer Zurich ZRH | Taxi Freiburg',
      },
      metaDescriptions: {
        de: 'Taxi von Freiburg zum Flughafen Zürich (ZRH) — ca. 150 km. Standard-Transfer 400–450 €. Großraum +20 €. Taxi-Alica Freiburg.',
        en: 'Taxi from Freiburg to Zurich Airport (ZRH) — approx. 150 km. Standard transfer 400–450 €. Large taxi +20 €. Taxi-Alica Freiburg.',
      },
      descriptions: {
        de: 'Komfortabler und pünktlicher Transfer von Freiburg zum internationalen Großflughafen Zürich (ZRH, ca. 150 km). Direkt vor das Abflugterminal ohne Umsteigen.',
        en: 'Comfortable and punctual transfer from Freiburg to Zurich International Airport (ZRH, approx. 150 km). Directly to the departure terminal.',
      },
    },
    {
      slug: 'flughafen-stuttgart',
      kind: 'airport',
      name: 'Flughafen Stuttgart',
      iata: 'STR',
      distanceKm: 200,
      lng: 9.2219,
      lat: 48.6899,
      metaTitles: {
        de: 'Flughafentransfer Stuttgart STR | Taxi Freiburg',
        en: 'Airport Transfer Stuttgart STR | Taxi Freiburg',
      },
      metaDescriptions: {
        de: 'Taxi von Freiburg zum Flughafen Stuttgart (STR) — ca. 200 km über die A5/A81. Standard-Transfer 470–520 €. Großraum +20 €. Taxi-Alica Freiburg.',
        en: 'Taxi from Freiburg to Stuttgart Airport (STR) — approx. 200 km via A5/A81. Standard transfer 470–520 €. Large taxi +20 €. Taxi-Alica Freiburg.',
      },
      descriptions: {
        de: 'Komfortabler Transfer von Freiburg zum Flughafen Stuttgart über A5 und A81 (ca. 200 km, ca. 2 Std.). Empfehlenswert für Langstreckenflüge ohne direkten EuroAirport-Anschluss.',
        en: 'Comfortable transfer from Freiburg to Stuttgart Airport via A5 and A81 (approx. 200 km, approx. 2 hrs). Recommended for long-haul flights without a direct EuroAirport connection.',
      },
    },
    {
      slug: 'flughafen-memmingen',
      kind: 'airport',
      name: 'Allgäu Airport Memmingen',
      iata: 'FMM',
      distanceKm: 230,
      lng: 10.2395,
      lat: 47.9888,
      metaTitles: {
        de: 'Flughafentransfer Memmingen FMM | Taxi Freiburg',
        en: 'Airport Transfer Memmingen FMM | Taxi Freiburg',
      },
      metaDescriptions: {
        de: 'Taxi von Freiburg zum Allgäu Airport Memmingen (FMM) — ca. 230 km. Standard-Transfer 600–650 €. Großraum +20 €. Taxi-Alica Freiburg.',
        en: 'Taxi from Freiburg to Memmingen Airport (FMM) — approx. 230 km. Standard transfer 600–650 €. Large taxi +20 €. Taxi-Alica Freiburg.',
      },
      descriptions: {
        de: 'Direkter Transfer von Freiburg zum Allgäu Airport Memmingen (FMM, ca. 230 km). Bequeme Anreise für europäische Urlaubs- und Städteflüge.',
        en: 'Direct transfer from Freiburg to Allgäu Airport Memmingen (FMM, approx. 230 km). Easy travel for European holiday and city flights.',
      },
    },
    {
      slug: 'flughafen-frankfurt',
      kind: 'airport',
      name: 'Flughafen Frankfurt',
      iata: 'FRA',
      distanceKm: 260,
      lng: 8.5705,
      lat: 50.0333,
      metaTitles: {
        de: 'Flughafentransfer Frankfurt FRA | Taxi Freiburg',
        en: 'Airport Transfer Frankfurt FRA | Taxi Freiburg',
      },
      metaDescriptions: {
        de: 'Taxi von Freiburg zum Flughafen Frankfurt (FRA) — ca. 260 km. Standard-Transfer 650–700 €. Großraum +20 €. Taxi-Alica Freiburg.',
        en: 'Taxi from Freiburg to Frankfurt Airport (FRA) — approx. 260 km. Standard transfer 650–700 €. Large taxi +20 €. Taxi-Alica Freiburg.',
      },
      descriptions: {
        de: 'Internationaler Langstreckentransfer von Freiburg zum Flughafen Frankfurt (ca. 260 km). Deutschlands größter Drehkreuz — ideal für interkontinentale Flüge.',
        en: "International long-distance transfer from Freiburg to Frankfurt Airport (approx. 260 km). Germany's largest hub — ideal for intercontinental flights.",
      },
    },
    {
      slug: 'freiburger-muenster',
      kind: 'landmark',
      name: 'Freiburger Münster',
      distanceKm: 0,
      lng: 7.8525,
      lat: 47.9956,
      metaTitles: {
        de: 'Taxi zum Freiburger Münster | Taxi-Alica Freiburg',
        en: 'Taxi to Freiburg Minster | Taxi-Alica Freiburg',
      },
      metaDescriptions: {
        de: 'Zuverlässiger Taxi-Service zur Altstadt und zum Freiburger Münster. Schnell, diskret, zum amtlichen Tarif — Taxi-Alica Freiburg.',
        en: 'Reliable taxi service to Freiburg old town and the Minster. Fast, discreet, at the official tariff — Taxi-Alica Freiburg.',
      },
      descriptions: {
        de: 'Das Freiburger Münster ist das Herzstück der Altstadt und Ausgangspunkt für unsere Stadtfahrten. Unser Service deckt das gesamte Stadtgebiet ab — vom Münsterplatz bis in alle Stadtteile.',
        en: 'Freiburg Minster is the heart of the old town and the starting point for our city rides. Our service covers the entire city area — from Münsterplatz to all districts.',
      },
    },
    {
      slug: 'europa-park-stadion',
      kind: 'landmark',
      name: 'Europa-Park Stadion (SC Freiburg)',
      distanceKm: 4,
      lng: 7.8297,
      lat: 48.0216,
      metaTitles: {
        de: 'Taxi zum Europa-Park Stadion Freiburg | Taxi-Alica',
        en: 'Taxi to Europa-Park Stadion Freiburg | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Europa-Park Stadion (SC Freiburg) — pünktlich und zuverlässig zum Spieltag. Taxi-Alica Freiburg zum amtlichen Tarif.',
        en: 'Taxi to Europa-Park Stadion (SC Freiburg) — punctual and reliable for match day. Taxi-Alica Freiburg at the official tariff.',
      },
      descriptions: {
        de: 'Das Europa-Park Stadion im Wolfswinkel-Quartier ist das Heimstadion des SC Freiburg. Wir bringen Sie pünktlich zum Anpfiff und holen Sie nach dem Spiel sicher ab.',
        en: 'Europa-Park Stadion in the Wolfswinkel district is the home ground of SC Freiburg. We get you there on time for kick-off and safely pick you up after the match.',
      },
    },
    {
      slug: 'freiburg-hauptbahnhof',
      kind: 'landmark',
      name: 'Freiburg Hauptbahnhof',
      distanceKm: 1,
      lng: 7.841452,
      lat: 47.996942,
      metaTitles: {
        de: 'Taxi zum Freiburg Hauptbahnhof | Taxi-Alica',
        en: 'Taxi to Freiburg Central Station | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum oder vom Freiburg Hauptbahnhof (Hbf) — schnell, diskret, zum amtlichen Tarif. Taxi-Alica Freiburg.',
        en: 'Taxi to or from Freiburg Central Station (Hbf) — fast, discreet, at the official tariff. Taxi-Alica Freiburg.',
      },
      descriptions: {
        de: 'Der Freiburger Hauptbahnhof is der zentrale Verkehrsknotenpunkt der Stadt. Wir bringen Sie pünktlich zu Ihrem Zug oder holen Sie direkt am Ausgang ab.',
        en: "Freiburg Central Station is the city's central transport hub. We get you to your train on time or pick you up directly at the exit.",
      },
    },
    {
      slug: 'heuboden-umkirch',
      kind: 'landmark',
      name: 'Heuboden Umkirch',
      distanceKm: 10,
      lng: 7.7615,
      lat: 48.0163,
      metaTitles: {
        de: 'Taxi zum Heuboden Umkirch | Taxi-Alica Freiburg',
        en: 'Taxi to Heuboden Umkirch | Taxi-Alica Freiburg',
      },
      metaDescriptions: {
        de: 'Zuverlässiger Taxi-Service zum Heuboden Umkirch. Feiern ohne Sorgen: Pünktliche Hin- und Rückfahrt. Jetzt Taxi rufen!',
        en: 'Reliable taxi service to Heuboden Umkirch. Party without worries: Punctual rides at the official tariff.',
      },
      descriptions: {
        de: 'Der Heuboden in Umkirch ist ein bekanntes Tanz- und Eventlokal bei Freiburg. Wir bringen Sie sicher zur Party und holen Sie nachts verlässlich wieder ab.',
        en: 'The Heuboden in Umkirch is a well-known club and event venue near Freiburg. We get you there safely and pick you up at night.',
      },
    },
    {
      slug: 'stadtgarten',
      kind: 'landmark',
      name: 'Stadtgarten Freiburg',
      distanceKm: 2,
      lng: 7.859,
      lat: 48.0,
      metaTitles: {
        de: 'Taxi zum Stadtgarten Freiburg | Taxi-Alica',
        en: 'Taxi to Stadtgarten Freiburg | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Stadtgarten Freiburg. Schnell, bequem und pünktlich an Ihr Ziel. Jetzt Fahrt buchen!',
        en: 'Taxi to Stadtgarten Freiburg. Fast, comfortable and punctual service. Book your ride now!',
      },
      descriptions: {
        de: 'Der Stadtgarten Freiburg ist eine grüne Oase im Herzen der Stadt. Wir bringen Sie entspannt dorthin.',
        en: 'The Freiburg Stadtgarten is a green oasis in the heart of the city. We get you there relaxed.',
      },
    },
    {
      slug: 'botanischer-garten',
      kind: 'landmark',
      name: 'Botanischer Garten',
      distanceKm: 3,
      lng: 7.8585,
      lat: 48.011,
      metaTitles: {
        de: 'Taxi zum Botanischen Garten Freiburg | Taxi-Alica',
        en: 'Taxi to Botanical Garden Freiburg | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Botanischen Garten in Herdern. Pünktlicher Service zum amtlichen Taxitarif.',
        en: 'Taxi to the Botanical Garden in Herdern. Punctual service at the official tariff.',
      },
      descriptions: {
        de: 'Der Botanische Garten der Universität Freiburg liegt im Stadtteil Herdern und zeigt eine faszinierende Pflanzenwelt.',
        en: 'The Botanical Garden of the University of Freiburg is located in Herdern and showcases fascinating plant life.',
      },
    },
    {
      slug: 'lorettoberg',
      kind: 'landmark',
      name: 'Lorettoberg',
      distanceKm: 3,
      lng: 7.842,
      lat: 47.979,
      metaTitles: {
        de: 'Taxi zum Lorettoberg Wiehre | Taxi-Alica',
        en: 'Taxi to Lorettoberg Wiehre | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Lorettoberg. Genießen Sie die Aussicht über Freiburg. Zuverlässiger Service.',
        en: 'Taxi to Lorettoberg. Enjoy the view over Freiburg. Reliable local service.',
      },
      descriptions: {
        de: 'Der Lorettoberg in der Wiehre bietet einen der schönsten Ausblicke über Freiburg und das Rheintal.',
        en: 'The Lorettoberg in the Wiehre offers one of the most beautiful views over Freiburg and the Rhine Valley.',
      },
    },
    {
      slug: 'schwabentor',
      kind: 'landmark',
      name: 'Schwabentor',
      distanceKm: 2,
      lng: 7.857,
      lat: 47.9928,
      metaTitles: {
        de: 'Taxi zum Schwabentor Freiburg | Taxi-Alica',
        en: 'Taxi to Schwabentor Freiburg | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum historischen Schwabentor an der Altstadt-Grenze. Schnell und bequem.',
        en: 'Taxi to the historic Schwabentor at the edge of the old town. Fast and comfortable.',
      },
      descriptions: {
        de: 'Das Schwabentor ist eines der beiden erhaltenen mittelalterlichen Stadttore Freiburgs und liegt direkt an der Oberau.',
        en: "The Schwabentor is one of Freiburg's two remaining medieval city gates, located right next to Oberau.",
      },
    },
    {
      slug: 'schwarzwald-stadion',
      kind: 'landmark',
      name: 'Schwarzwald-Stadion',
      distanceKm: 4,
      lng: 7.892,
      lat: 47.989,
      metaTitles: {
        de: 'Taxi zum Schwarzwald-Stadion | Taxi-Alica',
        en: 'Taxi to Schwarzwald-Stadion | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Schwarzwald-Stadion an der Dreisam. Zuverlässiger Transfer zum Spiel oder Event.',
        en: 'Taxi to the Schwarzwald-Stadion by the Dreisam. Reliable transport to matches or events.',
      },
      descriptions: {
        de: 'Das traditionsreiche Schwarzwald-Stadion im Stadtteil Waldsee liegt idyllisch direkt an der Dreisam.',
        en: 'The traditional Schwarzwald-Stadion in the Waldsee district is idyllically situated directly on the Dreisam.',
      },
    },
    {
      slug: 'ph-freiburg',
      kind: 'landmark',
      name: 'Pädagogische Hochschule',
      distanceKm: 5,
      lng: 7.898,
      lat: 47.979,
      metaTitles: {
        de: 'Taxi zur PH Freiburg Littenweiler | Taxi-Alica',
        en: 'Taxi to PH Freiburg Littenweiler | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Pädagogischen Hochschule (PH) Freiburg. Günstig und pünktlich.',
        en: 'Taxi to the University of Education (PH) Freiburg. Affordable and punctual.',
      },
      descriptions: {
        de: 'Die Pädagogische Hochschule Freiburg befindet sich im grünen Osten der Stadt im Stadtteil Littenweiler.',
        en: 'The Freiburg University of Education is located in the green east of the city in Littenweiler.',
      },
    },
    {
      slug: 'schloss-ebnet',
      kind: 'landmark',
      name: 'Schloss Ebnet',
      distanceKm: 6,
      lng: 7.905,
      lat: 47.989,
      metaTitles: {
        de: 'Taxi zum Schloss Ebnet | Taxi-Alica',
        en: 'Taxi to Schloss Ebnet | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum barocken Schloss Ebnet. Stilvoller Fahrservice zum amtlichen Tarif.',
        en: 'Taxi to the baroque Schloss Ebnet. Elegant ride service at the official tariff.',
      },
      descriptions: {
        de: 'Das Schloss Ebnet ist ein elegantes barockes Schloss im Osten Freiburgs und Veranstaltungsort für Konzerte und Feiern.',
        en: 'Schloss Ebnet is an elegant baroque palace in eastern Freiburg and a venue for concerts and celebrations.',
      },
    },
    {
      slug: 'schauinsland-bergwerk',
      kind: 'landmark',
      name: 'Schauinsland Besucherbergwerk',
      distanceKm: 15,
      lng: 7.892,
      lat: 47.912,
      metaTitles: {
        de: 'Taxi zum Schauinsland Besucherbergwerk | Taxi-Alica',
        en: 'Taxi to Schauinsland Museum Mine | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Besucherbergwerk Schauinsland. Zuverlässige Bergfahrten zum Festpreis.',
        en: 'Taxi to the Schauinsland Museum Mine. Reliable mountain transfers.',
      },
      descriptions: {
        de: 'Das Museums-Bergwerk am Schauinsland bietet faszinierende Einblicke in den historischen Silberbergbau.',
        en: 'The museum mine on the Schauinsland offers fascinating insights into historical silver mining.',
      },
    },
    {
      slug: 'freibad-haslach',
      kind: 'landmark',
      name: 'Freibad Haslach',
      distanceKm: 4,
      lng: 7.818,
      lat: 47.983,
      metaTitles: {
        de: 'Taxi zum Freibad Haslach | Taxi-Alica',
        en: 'Taxi to Freibad Haslach | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Hallen- und Freibad Haslach. Bequemer Transfer für die ganze Familie.',
        en: 'Taxi to the Haslach indoor and outdoor pool. Comfortable family transfer.',
      },
      descriptions: {
        de: 'Das Hallen- und Freibad West in Haslach ist ein beliebtes Freizeitbad für Sport- und Wellnessbegeisterte.',
        en: 'The indoor and outdoor pool in Haslach is a popular leisure pool for sports and wellness enthusiasts.',
      },
    },
    {
      slug: 'schneeburghalle',
      kind: 'landmark',
      name: 'Schneeburghalle',
      distanceKm: 5,
      lng: 7.801,
      lat: 47.967,
      metaTitles: {
        de: 'Taxi zur Schneeburghalle St. Georgen | Taxi-Alica',
        en: 'Taxi to Schneeburghalle St. Georgen | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Schneeburghalle in Freiburg St. Georgen. Pünktlicher Service für Veranstaltungen.',
        en: 'Taxi to the Schneeburghalle in Freiburg St. Georgen. Punctual event transport.',
      },
      descriptions: {
        de: 'Die Schneeburghalle ist der sportliche und kulturelle Mittelpunkt im traditionsreichen Stadtteil St. Georgen.',
        en: 'The Schneeburghalle is the athletic and cultural center in the historic district of St. Georgen.',
      },
    },
    {
      slug: 'seepark-freiburg',
      kind: 'landmark',
      name: 'Seepark Freiburg',
      distanceKm: 4,
      lng: 7.801,
      lat: 48.008,
      metaTitles: {
        de: 'Taxi zum Seepark Freiburg | Taxi-Alica',
        en: 'Taxi to Seepark Freiburg | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Seepark Betzenhausen. Bequeme Fahrt zum Badesee und Aussichtsturm.',
        en: 'Taxi to Seepark Betzenhausen. Easy ride to the swimming lake and observation tower.',
      },
      descriptions: {
        de: 'Der Seepark in Betzenhausen ist das weitläufige Gelände der Landesgartenschau 1986 mit See, Turm und Biergarten.',
        en: 'The Seepark in Betzenhausen is a spacious park from the 1986 horticultural show, featuring a lake, tower, and beer garden.',
      },
    },
    {
      slug: 'messe-freiburg',
      kind: 'landmark',
      name: 'Messe Freiburg',
      distanceKm: 5,
      lng: 7.838,
      lat: 48.021,
      metaTitles: {
        de: 'Taxi zur Messe Freiburg | Taxi-Alica',
        en: 'Taxi to Messe Freiburg | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Messe Freiburg. Schnell und stressfrei zu Ausstellungen, Messen und Konzerten.',
        en: 'Taxi to Messe Freiburg. Fast and stress-free transport to exhibitions and concerts.',
      },
      descriptions: {
        de: 'Die Messe Freiburg im Mooswald bietet Platz für Großveranstaltungen, Messen, Konzerte und Events aller Art.',
        en: 'The Freiburg Exhibition Center (Messe) in Mooswald hosts major events, trade fairs, and concerts.',
      },
    },
    {
      slug: 'diakoniekrankenhaus',
      kind: 'landmark',
      name: 'Diakoniekrankenhaus',
      distanceKm: 6,
      lng: 7.809,
      lat: 48.026,
      metaTitles: {
        de: 'Taxi zum Diakoniekrankenhaus | Taxi-Alica',
        en: 'Taxi to Diakoniekrankenhaus | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Diakoniekrankenhaus Landwasser. Krankenfahrten mit Kassenabrechnung.',
        en: 'Taxi to the Diakoniekrankenhaus Landwasser. Seated patient transfers with billing.',
      },
      descriptions: {
        de: 'Das Diakoniekrankenhaus in Freiburg-Landwasser ist eine wichtige Klinik, die wir regelmäßig für Krankenfahrten ansteuern.',
        en: 'The Diakoniekrankenhaus in Freiburg-Landwasser is a key clinic we frequently serve for patient transport.',
      },
    },
    {
      slug: 'tuniberghalle',
      kind: 'landmark',
      name: 'Tuniberghalle',
      distanceKm: 9,
      lng: 7.792,
      lat: 48.047,
      metaTitles: {
        de: 'Taxi zur Tuniberghalle Hochdorf | Taxi-Alica',
        en: 'Taxi to Tuniberghalle Hochdorf | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Tuniberghalle in Hochdorf. Ihr lokaler Fahrservice zum offiziellen Tarif.',
        en: 'Taxi to the Tuniberghalle in Hochdorf. Your local ride service.',
      },
      descriptions: {
        de: 'Die Tuniberghalle in Hochdorf ist eine beliebte Mehrzweckhalle für Sport- und Kulturveranstaltungen im Nordwesten Freiburgs.',
        en: 'The Tuniberghalle in Hochdorf is a popular multi-purpose hall for sports and cultural events in northwest Freiburg.',
      },
    },
    {
      slug: 'kepler-gymnasium',
      kind: 'landmark',
      name: 'Kepler-Gymnasium',
      distanceKm: 6,
      lng: 7.785,
      lat: 47.993,
      metaTitles: {
        de: 'Taxi zum Kepler-Gymnasium Rieselfeld | Taxi-Alica',
        en: 'Taxi to Kepler-Gymnasium Rieselfeld | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Kepler-Gymnasium im Rieselfeld. Pünktlicher und sicherer Schüler- & Fahrservice.',
        en: 'Taxi to Kepler-Gymnasium in Rieselfeld. Punctual and safe transfer.',
      },
      descriptions: {
        de: 'Das Kepler-Gymnasium im modernen Stadtteil Rieselfeld ist eine der größten und modernsten Schulen der Stadt.',
        en: 'Kepler-Gymnasium in the modern Rieselfeld district is one of the largest and most modern schools in the city.',
      },
    },
    {
      slug: 'bundschuh-halle',
      kind: 'landmark',
      name: 'Bundschuh-Halle',
      distanceKm: 6,
      lng: 7.787,
      lat: 48.012,
      metaTitles: {
        de: 'Taxi zur Bundschuh-Halle Lehen | Taxi-Alica',
        en: 'Taxi to Bundschuh-Halle Lehen | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Bundschuh-Halle in Lehen. Zuverlässig und ortskundig.',
        en: 'Taxi to the Bundschuh-Halle in Lehen. Reliable and local driver.',
      },
      descriptions: {
        de: 'Die Bundschuh-Halle in Lehen erinnert an die historischen Bundschuh-Aufstände und ist heute Kultur- und Sportstätte.',
        en: 'The Bundschuh-Halle in Lehen commemorates the historic peasant revolts and is now a local event venue.',
      },
    },
    {
      slug: 'opfinger-see',
      kind: 'landmark',
      name: 'Opfinger See',
      distanceKm: 10,
      lng: 7.742,
      lat: 47.995,
      metaTitles: {
        de: 'Taxi zum Opfinger See | Taxi-Alica',
        en: 'Taxi to Opfinger See | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Opfinger Baggersee. Schnell zum Badespaß im Freiburger Westen.',
        en: 'Taxi to the Opfinger swimming lake. Quick ride to summer fun.',
      },
      descriptions: {
        de: 'Der Opfinger See ist ein beliebtes Naherholungsgebiet und Naturoase vor den Toren des Tunibergs.',
        en: 'The Opfinger See is a popular recreation area and nature oasis just outside the Tuniberg.',
      },
    },
    {
      slug: 'tuniberg-hoehenweg',
      kind: 'landmark',
      name: 'Tuniberg Höhenweg',
      distanceKm: 11,
      lng: 7.729,
      lat: 48.028,
      metaTitles: {
        de: 'Taxi zum Tuniberg Höhenweg | Taxi-Alica',
        en: 'Taxi to Tuniberg Höhenweg | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Wandern am Tuniberg in Tiengen. Pünktlicher Ausflugsservice.',
        en: 'Taxi for hiking at the Tuniberg in Tiengen. Punctual excursion service.',
      },
      descriptions: {
        de: 'Der Tuniberg Höhenweg in Tiengen führt durch malerische Weinberge mit spektakulären Ausblicken auf Schwarzwald und Vogesen.',
        en: 'The Tuniberg Höhenweg in Tiengen winds through picturesque vineyards with spectacular views of the Black Forest and Vosges.',
      },
    },
    {
      slug: 'schloss-reinach',
      kind: 'landmark',
      name: 'Schloss Reinach',
      distanceKm: 12,
      lng: 7.702,
      lat: 47.968,
      metaTitles: {
        de: 'Taxi zum Schloss Reinach Munzingen | Taxi-Alica',
        en: 'Taxi to Schloss Reinach Munzingen | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Hotel & Restaurant Schloss Reinach. Luxuriöser Fahrservice für Hochzeiten & Events.',
        en: 'Taxi to Hotel & Restaurant Schloss Reinach. Premium service for weddings and events.',
      },
      descriptions: {
        de: 'Das historische Schloss Reinach in Munzingen ist eine renommierte Hotel- und Gastro-Anlage und Top-Adresse für Feiern.',
        en: 'The historic Schloss Reinach in Munzingen is a renowned hotel and restaurant complex and a top address for celebrations.',
      },
    },
    {
      slug: 'steinriedhalle',
      kind: 'landmark',
      name: 'Steinriedhalle',
      distanceKm: 12,
      lng: 7.739,
      lat: 48.038,
      metaTitles: {
        de: 'Taxi zur Steinriedhalle Waltershofen | Taxi-Alica',
        en: 'Taxi to Steinriedhalle Waltershofen | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Steinriedhalle in Waltershofen. Pünktlich zum offiziellen Freiburger Tarif.',
        en: 'Taxi to the Steinriedhalle in Waltershofen. Punctual service at the official tariff.',
      },
      descriptions: {
        de: 'Die Steinriedhalle ist die zentrale Mehrzweckhalle für Sport- und Kulturveranstaltungen in Waltershofen.',
        en: 'The Steinriedhalle is the central multi-purpose hall for sports and cultural events in Waltershofen.',
      },
    },
    {
      slug: 'burg-zaehringen',
      kind: 'landmark',
      name: 'Burg Zähringen',
      distanceKm: 6,
      lng: 7.886,
      lat: 48.023,
      metaTitles: {
        de: 'Taxi zur Burg Zähringen | Taxi-Alica',
        en: 'Taxi to Zähringen Castle | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Burgruine Zähringen. Genießen Sie die Waldatmosphäre und das Waldrestaurant.',
        en: 'Taxi to Zähringen Castle ruins. Enjoy the forest restaurant and atmosphere.',
      },
      descriptions: {
        de: 'Die Burgruine Zähringen im Norden der Stadt erinnert an die Gründer Freiburgs und bietet ein beliebtes Ausflugslokal.',
        en: 'The Zähringen Castle ruins in the north of the city recall the founders of Freiburg and offer a popular excursion spot.',
      },
    },
    {
      slug: 'flugplatz-freiburg',
      kind: 'landmark',
      name: 'Flugplatz Freiburg',
      distanceKm: 5,
      lng: 7.832,
      lat: 48.022,
      metaTitles: {
        de: 'Taxi zum Flugplatz Freiburg | Taxi-Alica',
        en: 'Taxi to Freiburg Airport | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Flugplatz Freiburg. Sicher und schnell zum Flugplatz oder der angrenzenden Messe.',
        en: 'Taxi to Freiburg Airport (Flugplatz). Fast ride to the airfield or nearby exhibition center.',
      },
      descriptions: {
        de: 'Der Flugplatz Freiburg im Stadtteil Brühl wird für die Sport- und Geschäftsfliegerei genutzt.',
        en: 'Freiburg Airport in the Brühl district is used for sport and business aviation.',
      },
    },
    {
      slug: 'evangelische-hochschule',
      kind: 'landmark',
      name: 'Evangelische Hochschule',
      distanceKm: 4,
      lng: 7.811,
      lat: 47.998,
      metaTitles: {
        de: 'Taxi zur EH Freiburg Weingarten | Taxi-Alica',
        en: 'Taxi to EH Freiburg Weingarten | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Evangelischen Hochschule (EH) Freiburg. Zuverlässiger Campus-Transfer.',
        en: 'Taxi to the Protestant University (EH) Freiburg. Reliable campus transfer.',
      },
      descriptions: {
        de: 'Die Evangelische Hochschule Freiburg liegt zentral im Stadtteil Weingarten und ist über unseren Service schnell erreichbar.',
        en: 'The Protestant University of Applied Sciences (EH) is centrally located in the Weingarten district and easily accessible.',
      },
    },
    {
      slug: 'solarsiedlung',
      kind: 'landmark',
      name: 'Solarsiedlung Vauban',
      distanceKm: 3,
      lng: 7.832,
      lat: 47.973,
      metaTitles: {
        de: 'Taxi zur Solarsiedlung Vauban | Taxi-Alica',
        en: 'Taxi to Solarsiedlung Vauban | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi ins ökologische Vauban-Viertel. Pünktlich und umweltfreundlich.',
        en: 'Taxi to the ecological Vauban district. Punctual and reliable.',
      },
      descriptions: {
        de: 'Die Solarsiedlung im Stadtteil Vauban ist ein weltbekanntes Vorzeigeprojekt für nachhaltiges, energieeffizientes Wohnen.',
        en: 'The Solarsiedlung in the Vauban district is a world-renowned showcase project for sustainable, energy-efficient living.',
      },
    },
    {
      slug: 'wildtalereck',
      kind: 'landmark',
      name: 'Wildtalereck',
      distanceKm: 6,
      lng: 7.893,
      lat: 48.026,
      metaTitles: {
        de: 'Taxi zum Wildtalereck | Taxi-Alica',
        en: 'Taxi to Wildtalereck | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi nach Wildtal und zum Wildtalereck. Ihr ortskundiger Fahrdienst.',
        en: 'Taxi to Wildtal and Wildtalereck. Your knowledgeable local ride service.',
      },
      descriptions: {
        de: 'Das Wildtalereck ist ein beliebtes Ausgangspunkt für Ausflüge und Wanderungen im waldreichen Norden der Region.',
        en: 'The Wildtalereck is a popular starting point for excursions and hikes in the forested north of the region.',
      },
    },
    {
      slug: 'tiergehege-mundenhof',
      kind: 'landmark',
      name: 'Tiergehege Mundenhof',
      distanceKm: 7,
      lng: 7.779,
      lat: 48.012,
      metaTitles: {
        de: 'Taxi zum Tiergehege Mundenhof | Taxi-Alica',
        en: 'Taxi to Mundenhof Animal Park | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zum Mundenhof Tiergehege. Stressfreie Anreise für Familien und Besucher.',
        en: 'Taxi to the Mundenhof Animal Park. Stress-free travel for families.',
      },
      descriptions: {
        de: 'Der Mundenhof ist das größte Tiergehege Baden-Württembergs mit heimischen und exotischen Tieren auf großem Gelände.',
        en: 'The Mundenhof is the largest animal park in Baden-Württemberg, hosting domestic and exotic animals on spacious grounds.',
      },
    },
    {
      slug: 'schauinslandbahn-tal',
      kind: 'landmark',
      name: 'Schauinslandbahn Talstation',
      distanceKm: 7,
      lng: 7.863,
      lat: 47.937,
      metaTitles: {
        de: 'Taxi zur Schauinslandbahn Talstation | Taxi-Alica',
        en: 'Taxi to Schauinslandbahn Base Station | Taxi-Alica',
      },
      metaDescriptions: {
        de: 'Taxi zur Talstation der Schauinslandbahn in Günterstal. Schnell zur Gondel.',
        en: 'Taxi to the base station of the Schauinsland cable car in Günterstal.',
      },
      descriptions: {
        de: 'Die Talstation der Schauinslandbahn in Günterstal befördert Wanderer und Ausflügler auf den Hausberg Freiburgs.',
        en: "The base station of the Schauinslandbahn in Günterstal carries hikers and visitors to Freiburg's local mountain.",
      },
    },
  ] as Destination[]
).map(enrichPrices);

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
