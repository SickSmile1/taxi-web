interface RouteResult {
  pickup: { street: string; coords: [number, number] };
  destination: { name: string; coords: [number, number] };
  distanceKm: number;
  durationMin: number;
  price: {
    base: number;
    perKm: number;
    kmCost: number;
    surcharge: number;
    total: number;
  };
  geometry: [number, number][];
}

type Listener = (route: RouteResult | null) => void;

const listeners = new Set<Listener>();

export function setRoute(r: RouteResult | null): void {
  for (const fn of listeners) fn(r);
}

export function onRouteChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
