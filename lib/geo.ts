interface Point {
  lng: number;
  lat: number;
}

const EARTH_RADIUS_KM = 6371;

function toRad(d: number): number {
  return (d * Math.PI) / 180;
}

export function haversineKm(p1: Point, p2: Point): number {
  const dLng = toRad(p2.lng - p1.lng);
  const dLat = toRad(p2.lat - p1.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
