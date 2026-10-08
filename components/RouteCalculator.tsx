'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { p } from '@/lib/base-path';
import { destinations } from '@/lib/destinations';
import { setRoute } from '@/lib/route-store';
import { calculatePrice, formatPrice, getTariffLabel } from '@/lib/tariff';
import type { Translations } from '@/lib/translations';
import CollapsiblePrice from './route/CollapsiblePrice';
import SuggestionList from './route/SuggestionList';

interface Props {
  t: Translations;
}

interface StreetEntry {
  name: string;
  lng: number;
  lat: number;
  district: string | null;
}

interface DistanceMatrix {
  [key: string]: { meters: number; seconds: number };
}

const OSRM = 'https://router.project-osrm.org/route/v1/driving';

const detailRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2px 0',
  fontSize: 12,
};

const mutedText: React.CSSProperties = {
  color: 'var(--text-muted)',
};

type CalculatorView = 'form' | 'result';

export interface DestinationItem {
  key: string;
  name: string;
  lng: number;
  lat: number;
  isStreet: boolean;
  iata?: string;
}

function parseStreetQuery(q: string): {
  streetQuery: string;
  houseNumber: string;
} {
  const match = q.match(/^(.+?)\s+(\d+[a-zA-Z]?.*)$/);
  if (match) {
    return { streetQuery: match[1].trim(), houseNumber: match[2].trim() };
  }
  return { streetQuery: q.trim(), houseNumber: '' };
}

export default function RouteCalculator({ t }: Props) {
  const [streets, setStreets] = useState<StreetEntry[]>([]);
  const [distanceMatrix, setDistanceMatrix] = useState<DistanceMatrix | null>(
    null,
  );
  const [query, setQuery] = useState('');
  const [selectedStreet, setSelectedStreet] = useState<StreetEntry | null>(
    null,
  );
  const [selectedDestItem, setSelectedDestItem] =
    useState<DestinationItem | null>(null);
  const [destQuery, setDestQuery] = useState('');
  const [view, setView] = useState<CalculatorView>('form');
  const [calculating, setCalculating] = useState(false);
  const [autoCalculated, setAutoCalculated] = useState(false);

  const [activeSugIndex, setActiveSugIndex] = useState(0);
  const [activeDestSugIndex, setActiveDestSugIndex] = useState(0);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const [result, setResult] = useState<{
    destName: string;
    distanceKm: number;
    durationMin: number;
    price: ReturnType<typeof calculatePrice>;
    tariffLabel: string;
    trafficDelayMin?: number;
    trafficWarning?: string;
  } | null>(null);

  useEffect(() => {
    fetch(p('/data/freiburg-streets.json'))
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error('not found');
      })
      .then((data: StreetEntry[]) => setStreets(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(p('/data/distance-matrix.json'))
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error('not found');
      })
      .then((data: DistanceMatrix) => setDistanceMatrix(data))
      .catch(() => {});
  }, []);

  const routeDestinations = useMemo(
    () =>
      destinations.filter((d) => d.kind === 'airport' || d.kind === 'landmark'),
    [],
  );

  const destinationItems = useMemo(() => {
    const pois: DestinationItem[] = routeDestinations.map((d) => ({
      key: d.slug,
      name: d.name,
      lng: d.lng ?? 7.85,
      lat: d.lat ?? 47.99,
      isStreet: false,
      iata: d.iata,
    }));
    const strItems: DestinationItem[] = streets.map((s) => ({
      key: `street:${s.name}`,
      name: s.name,
      lng: s.lng,
      lat: s.lat,
      isStreet: true,
    }));
    return [...pois, ...strItems];
  }, [routeDestinations, streets]);

  // Pre-fill inputs from URL search parameters (?from=Wiehre&to=heuboden-umkirch)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromVal = params.get('from');
    const toVal = params.get('to');

    if (fromVal && streets.length > 0) {
      // Find a street in this district to calculate a valid route
      const matchingStreet = streets.find((s) => s.district === fromVal);
      if (matchingStreet) {
        setSelectedStreet(matchingStreet);
        setQuery(matchingStreet.name);
      } else {
        const directStreet = streets.find(
          (s) => s.name.toLowerCase() === fromVal.toLowerCase(),
        );
        if (directStreet) {
          setSelectedStreet(directStreet);
          setQuery(directStreet.name);
        } else {
          setQuery(fromVal);
        }
      }
    }

    if (toVal && destinationItems.length > 0) {
      const match = destinationItems.find(
        (d) => d.key === toVal || d.name.toLowerCase() === toVal.toLowerCase(),
      );
      if (match) {
        setSelectedDestItem(match);
        setDestQuery(match.name);
      }
    }
  }, [streets, destinationItems]);

  const suggestions = useMemo(() => {
    const { streetQuery } = parseStreetQuery(query);
    if (!streets.length || streetQuery.length < 2) return [];
    const q = streetQuery.toLowerCase();
    return streets.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 10);
  }, [streets, query]);

  const destSuggestions = useMemo(() => {
    const { streetQuery } = parseStreetQuery(destQuery);
    if (streetQuery.length < 2 || selectedDestItem) return [];
    const q = streetQuery.toLowerCase();
    return destinationItems
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.iata && d.iata.toLowerCase().includes(q)),
      )
      .slice(0, 10);
  }, [destinationItems, destQuery, selectedDestItem]);

  useEffect(() => {
    setActiveSugIndex(0);
  }, [suggestions.length]);

  useEffect(() => {
    setActiveDestSugIndex(0);
  }, [destSuggestions.length]);

  const streetSuggestionItems = useMemo(
    () =>
      suggestions.map((s) => ({
        id: s.name,
        label: s.name,
        sublabel: s.district || undefined,
        sublabelColor: 'muted' as const,
      })),
    [suggestions],
  );

  const destSuggestionItems = useMemo(
    () =>
      destSuggestions.map((d) => ({
        id: d.key,
        label: d.name,
        sublabel: d.iata ? `(${d.iata.replace(' / ', '/')})` : undefined,
        sublabelColor: 'gold' as const,
      })),
    [destSuggestions],
  );

  const handleCalculate = useCallback(async () => {
    if (!selectedStreet || !selectedDestItem) return;
    setCalculating(true);

    const pickup: [number, number] = [selectedStreet.lng, selectedStreet.lat];
    const destCoords: [number, number] = [
      selectedDestItem.lng,
      selectedDestItem.lat,
    ];

    let distanceKm = 0;
    let durationMin = 0;

    try {
      const url = `${OSRM}/${pickup.join(',')};${destCoords.join(',')}?overview=simplified`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        if (data.code === 'Ok' && data.routes.length > 0) {
          distanceKm = Math.round((data.routes[0].distance / 1000) * 10) / 10;
          durationMin = Math.ceil(data.routes[0].duration / 60);
        }
      }
    } catch {
      /* proceed to fallbacks below */
    }

    if (distanceKm === 0 && distanceMatrix) {
      const destNodeMap: Record<string, string> = {
        'freiburger-muenster': 'Muenster',
        'freiburg-hauptbahnhof': 'HbfZOB',
        'europa-park-stadion': 'Stadion',
        'euroairport-basel': 'BaselExit',
        'karlsruhe-airport': 'KarlsruheExit',
        'flughafen-stuttgart': 'KarlsruheExit',
        'flughafen-frankfurt': 'FrankfurtExit',
        'muenchen-airport': 'MunichExit',
      };

      const destKey = destNodeMap[selectedDestItem.key];
      if (destKey) {
        let nearestNodeName = '';
        let nearestDist = Infinity;

        const KEY_NODES: Record<string, [number, number]> = {
          A5xB31: [7.797, 47.947],
          B31xBerlinerAllee: [7.837, 47.992],
          B31xBismarckallee: [7.848, 47.991],
          B31xSchwarzwaldstr: [7.872, 47.985],
          B31xLittenweiler: [7.896, 47.977],
          B3xZaehringerStr: [7.856, 48.015],
          B3xHabsburgerstr: [7.851, 48.005],
          B3xEschholzstr: [7.841, 47.996],
          B3xBaslerStr: [7.836, 47.985],
          B31axStGeorgen: [7.812, 47.975],
          HaslachB294: [7.806, 47.984],
          Rieselfeld: [7.788, 47.992],
          Ebnet: [7.918, 47.985],
          Landwasser: [7.806, 48.02],
          Tiengen: [7.727, 48.035],
        };

        for (const [nodeName, nodeCoords] of Object.entries(KEY_NODES)) {
          const d = haversineKm(pickup, nodeCoords);
          if (d < nearestDist) {
            nearestDist = d;
            nearestNodeName = nodeName;
          }
        }

        if (nearestNodeName) {
          const key1 = `${nearestNodeName}_${destKey}`;
          const key2 = `${destKey}_${nearestNodeName}`;
          const matrixEntry = distanceMatrix[key1] || distanceMatrix[key2];
          if (matrixEntry) {
            const matrixDistMeters = matrixEntry.meters + nearestDist * 1000;
            const matrixSeconds = matrixEntry.seconds + nearestDist * 90;
            distanceKm = Math.round((matrixDistMeters / 1000) * 10) / 10;
            durationMin = Math.round(matrixSeconds / 60);
          }
        }
      }
    }

    if (distanceKm === 0) {
      const h = haversineKm(pickup, destCoords);
      distanceKm = Math.round(h * 1.25 * 10) / 10;
      durationMin = Math.round(distanceKm * 1.5);
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeVal = hours + minutes / 60;

    let trafficMultiplier = 1.0;
    let trafficWarning = '';
    let trafficDelayMin = 0;

    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
    if (isWeekday) {
      if (timeVal >= 7.5 && timeVal <= 9.0) {
        trafficMultiplier = 1.35;
        trafficWarning = 'Berufsverkehr am Morgen';
      } else if (timeVal >= 16.5 && timeVal <= 18.5) {
        trafficMultiplier = 1.45;
        trafficWarning = 'Feierabendverkehr';
      }
    }

    if (trafficMultiplier > 1.0) {
      const originalDuration = durationMin;
      durationMin = Math.round(durationMin * trafficMultiplier);
      trafficDelayMin = durationMin - originalDuration;
    }

    const price = calculatePrice(distanceKm);
    const tariffLabel = getTariffLabel();

    setResult({
      destName: selectedDestItem.name,
      distanceKm,
      durationMin,
      price,
      tariffLabel,
      trafficDelayMin: trafficDelayMin > 0 ? trafficDelayMin : undefined,
      trafficWarning: trafficWarning || undefined,
    });
    setView('result');

    try {
      const url = `${OSRM}/${pickup.join(',')};${destCoords.join(',')}?geometries=geojson&overview=full`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        if (data.code === 'Ok' && data.routes.length > 0) {
          const geometry: [number, number][] =
            data.routes[0].geometry.coordinates;
          setRoute({
            pickup: { street: selectedStreet.name, coords: pickup },
            destination: { name: selectedDestItem.name, coords: destCoords },
            distanceKm,
            durationMin,
            price,
            geometry,
          });
          setCalculating(false);
          return;
        }
      }
    } catch {
      /* proceed with fallback geometry below */
    }

    const fallbackGeometry: [number, number][] = [];
    const steps = 15;
    for (let i = 0; i <= steps; i++) {
      const pct = i / steps;
      const lng = pickup[0] + (destCoords[0] - pickup[0]) * pct;
      const lat = pickup[1] + (destCoords[1] - pickup[1]) * pct;
      fallbackGeometry.push([lng, lat]);
    }

    setRoute({
      pickup: { street: selectedStreet.name, coords: pickup },
      destination: { name: selectedDestItem.name, coords: destCoords },
      distanceKm,
      durationMin,
      price,
      geometry: fallbackGeometry,
    });
    setCalculating(false);
  }, [selectedStreet, selectedDestItem, distanceMatrix]);

  useEffect(() => {
    if (
      selectedStreet &&
      selectedDestItem &&
      !autoCalculated &&
      !calculating &&
      view === 'form'
    ) {
      setAutoCalculated(true);
      handleCalculate();
    }
  }, [
    selectedStreet,
    selectedDestItem,
    autoCalculated,
    calculating,
    view,
    handleCalculate,
  ]);

  const handleReset = useCallback(() => {
    setQuery('');
    setSelectedStreet(null);
    setSelectedDestItem(null);
    setDestQuery('');
    setView('form');
    setResult(null);
    setRoute(null);
    setDetailsExpanded(false);
  }, []);

  const handleStreetChange = (val: string) => {
    setQuery(val);
    const { streetQuery } = parseStreetQuery(val);
    const match = streets.find(
      (s) => s.name.toLowerCase() === streetQuery.toLowerCase(),
    );
    if (match) {
      setSelectedStreet(match);
    } else {
      setSelectedStreet(null);
    }
  };

  const handleDestChange = (val: string) => {
    setDestQuery(val);
    const { streetQuery } = parseStreetQuery(val);
    const match = destinationItems.find(
      (d) => d.name.toLowerCase() === streetQuery.toLowerCase(),
    );
    if (match) {
      setSelectedDestItem(match);
    } else {
      setSelectedDestItem(null);
    }
  };

  const handleSelectStreet = (s: StreetEntry) => {
    const { houseNumber } = parseStreetQuery(query);
    const newQuery = houseNumber ? `${s.name} ${houseNumber}` : s.name;
    setQuery(newQuery);
    setSelectedStreet(s);
  };

  const handleSelectDest = (d: DestinationItem) => {
    const { houseNumber } = parseStreetQuery(destQuery);
    const newQuery =
      d.isStreet && houseNumber ? `${d.name} ${houseNumber}` : d.name;
    setDestQuery(newQuery);
    setSelectedDestItem(d);
  };

  const handlePickupKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0 && !selectedStreet) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSugIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSugIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length,
        );
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        const selected = suggestions[activeSugIndex];
        if (selected) {
          handleSelectStreet(selected);
        }
      }
    }
  };

  const handleDestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (destSuggestions.length > 0 && !selectedDestItem) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveDestSugIndex((prev) => (prev + 1) % destSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveDestSugIndex(
          (prev) =>
            (prev - 1 + destSuggestions.length) % destSuggestions.length,
        );
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        const selected = destSuggestions[activeDestSugIndex];
        if (selected) {
          handleSelectDest(selected);
        }
      }
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-page)',
        border: '1px solid var(--border-strong)',
        borderRadius: 12,
        padding: 16,
        fontSize: 13,
        color: 'var(--text-primary)',
        width: 280,
        fontFamily:
          "var(--font-arabic, var(--font-jp, 'Helvetica Neue')), Helvetica, Arial, sans-serif",
      }}
    >
      {view === 'form' ? (
        <>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 12,
              color: 'var(--gold)',
            }}
          >
            Route berechnen
          </div>

          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => handleStreetChange(e.target.value)}
              onKeyDown={handlePickupKeyDown}
              placeholder={t.enterStreet}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'var(--bg-surface)',
                border: `1px solid ${selectedStreet ? 'var(--gold)' : 'var(--border-input)'}`,
                borderRadius: 8,
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            {query.length >= 2 && !selectedStreet && (
              <SuggestionList
                items={streetSuggestionItems}
                activeIndex={activeSugIndex}
                onSelect={(_, idx) => handleSelectStreet(suggestions[idx])}
                onHover={setActiveSugIndex}
                ariaLabel="Street suggestions"
              />
            )}
          </div>

          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              type="text"
              value={destQuery}
              onChange={(e) => handleDestChange(e.target.value)}
              onKeyDown={handleDestKeyDown}
              placeholder="Ziel oder POI eingeben..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'var(--bg-surface)',
                border: `1px solid ${selectedDestItem ? 'var(--gold)' : 'var(--border-input)'}`,
                borderRadius: 8,
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            {destQuery.length >= 2 && !selectedDestItem && (
              <SuggestionList
                items={destSuggestionItems}
                activeIndex={activeDestSugIndex}
                onSelect={(_, idx) => handleSelectDest(destSuggestions[idx])}
                onHover={setActiveDestSugIndex}
                ariaLabel="Destination suggestions"
              />
            )}
          </div>

          <button
            onClick={handleCalculate}
            disabled={!selectedStreet || !selectedDestItem || calculating}
            aria-label="Calculate route price"
            style={{
              width: '100%',
              background:
                !selectedStreet || !selectedDestItem
                  ? 'var(--bg-hover)'
                  : 'var(--gold)',
              color:
                !selectedStreet || !selectedDestItem
                  ? 'var(--text-fainter)'
                  : 'var(--bg-page)',
              border: 'none',
              borderRadius: 8,
              padding: '10px 12px',
              fontWeight: 700,
              fontSize: 13,
              cursor:
                !selectedStreet || !selectedDestItem
                  ? 'not-allowed'
                  : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            {calculating ? t.calculating : t.calculatePrice}
          </button>
        </>
      ) : result ? (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div
              style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}
            >
              {t.priceOverview}
            </div>
            <button
              onClick={handleReset}
              aria-label="Reset route calculator"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-input)',
                borderRadius: 6,
                color: 'var(--text-muted)',
                padding: '4px 8px',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              × Neu
            </button>
          </div>

          <div
            style={{
              fontSize: 12,
              color: 'var(--text-primary)',
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            {selectedStreet?.name} → {result.destName}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            ~{result.distanceKm} km · ~{result.durationMin} min
            {result.trafficDelayMin && result.trafficWarning && (
              <div
                style={{
                  color: 'var(--gold)',
                  fontSize: 11,
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>⚠️</span>
                <span>
                  {result.trafficWarning} (+{result.trafficDelayMin} Min.)
                </span>
              </div>
            )}
          </div>

          {/* Collapsible main price toggle button */}
          <CollapsiblePrice
            open={detailsExpanded}
            onToggle={() => setDetailsExpanded(!detailsExpanded)}
            priceLabel={`Ab ${formatPrice(result.price.total)}`}
          >
            <div
              style={{
                padding: 12,
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-strong)',
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div style={detailRow}>
                <span style={mutedText}>{t.baseFare}</span>
                <span>{formatPrice(result.price.base)}</span>
              </div>
              {result.distanceKm <= 3 ? (
                <div style={detailRow}>
                  <span style={mutedText}>
                    Strecke ({result.distanceKm} km ×{' '}
                    {formatPrice(result.price.rateTier1)}/km)
                  </span>
                  <span>{formatPrice(result.price.kmCost)}</span>
                </div>
              ) : (
                <>
                  <div style={detailRow}>
                    <span style={mutedText}>
                      Strecke (1.–3. km × {formatPrice(result.price.rateTier1)}
                      /km)
                    </span>
                    <span>{formatPrice(result.price.kmCostTier1)}</span>
                  </div>
                  <div style={detailRow}>
                    <span style={mutedText}>
                      Strecke (ab 3. km: {(result.distanceKm - 3).toFixed(1)} km
                      × {formatPrice(result.price.rateTier2)}/km)
                    </span>
                    <span>{formatPrice(result.price.kmCostTier2)}</span>
                  </div>
                </>
              )}
              <div style={detailRow}>
                <span style={mutedText}>Großraumtaxi (5–8 Pers.)</span>
                <span>+{formatPrice(result.price.largeVanSurcharge)}</span>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--border-soft)',
                  marginTop: 6,
                  paddingTop: 4,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                }}
              >
                <span>Tarifklasse</span>
                <span>{result.tariffLabel}</span>
              </div>
            </div>

            <div
              style={{
                fontSize: 10.5,
                color: 'var(--text-faint)',
                lineHeight: 1.4,
                marginBottom: 4,
              }}
            >
              {t.priceDisclaimer}
            </div>
          </CollapsiblePrice>
        </>
      ) : null}
    </div>
  );
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const aVal =
    sinDLat * sinDLat +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      sinDLng *
      sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
}
