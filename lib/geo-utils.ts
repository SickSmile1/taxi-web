// Coordinate projection constants (Anchor: Freiburg Münster Cathedral)
const EARTH_RADIUS = 6378137;
export const ANCHOR_LNG = 7.8525;
export const ANCHOR_LAT = 47.9956;

// Freiburg terrain altitude above WGS84 ellipsoid (meters)
// Building tileset minH ranges 196-263m; anchor is ~250m
export const FREIBURG_GROUND_ALT = 270;
const ANCHOR_LNG_RAD = (ANCHOR_LNG * Math.PI) / 180;
const ANCHOR_LAT_RAD = (ANCHOR_LAT * Math.PI) / 180;
const COS_ANCHOR_LAT = Math.cos(ANCHOR_LAT_RAD);

export function gpsToLocal(lng: number, lat: number): { x: number; y: number } {
  const lngRad = (lng * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const x = EARTH_RADIUS * (lngRad - ANCHOR_LNG_RAD) * COS_ANCHOR_LAT;
  const y = EARTH_RADIUS * (latRad - ANCHOR_LAT_RAD);
  return { x, y };
}

// WGS84 ellipsoid constants for ECEF conversion
const WGS84_A = 6_378_137.0;
const WGS84_B = 6_356_752.314245179;
const WGS84_E2 = (WGS84_A * WGS84_A - WGS84_B * WGS84_B) / (WGS84_A * WGS84_A);

export function gpsToEcef(
  lng: number,
  lat: number,
  alt = 0,
): { x: number; y: number; z: number } {
  const lngRad = (lng * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const cosLat = Math.cos(latRad);
  const sinLat = Math.sin(latRad);
  const cosLng = Math.cos(lngRad);
  const sinLng = Math.sin(lngRad);
  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLat * sinLat);
  return {
    x: (N + alt) * cosLat * cosLng,
    y: (N + alt) * cosLat * sinLng,
    z: (N * (1 - WGS84_E2) + alt) * sinLat,
  };
}

// Anchor ECEF position (Freiburg Münster Cathedral at ground altitude)
export const ECEF_ANCHOR = gpsToEcef(
  ANCHOR_LNG,
  ANCHOR_LAT,
  FREIBURG_GROUND_ALT,
);

// ENU basis vectors at Freiburg anchor, in ECEF coordinates
const _cosLat = Math.cos(ANCHOR_LAT_RAD);
const _sinLat = Math.sin(ANCHOR_LAT_RAD);
const _cosLng = Math.cos(ANCHOR_LNG_RAD);
const _sinLng = Math.sin(ANCHOR_LNG_RAD);

export const ENU_EAST = { x: -_sinLng, y: _cosLng, z: 0 };
export const ENU_NORTH = {
  x: -_sinLat * _cosLng,
  y: -_sinLat * _sinLng,
  z: _cosLat,
};
export const ENU_UP = {
  x: _cosLat * _cosLng,
  y: _cosLat * _sinLng,
  z: _sinLat,
};

// Convert a raw ECEF xyz to local scene space, centered at ECEF_ANCHOR.
// Result uses Three.js convention: X = East, Y = Up, Z = -North.
export function ecefToEnu(
  ecef: { x: number; y: number; z: number },
  anchorEcef = ECEF_ANCHOR,
): { x: number; y: number; z: number } {
  const dx = ecef.x - anchorEcef.x;
  const dy = ecef.y - anchorEcef.y;
  const dz = ecef.z - anchorEcef.z;

  const east = dx * ENU_EAST.x + dy * ENU_EAST.y + dz * ENU_EAST.z;
  const north = dx * ENU_NORTH.x + dy * ENU_NORTH.y + dz * ENU_NORTH.z;
  const up = dx * ENU_UP.x + dy * ENU_UP.y + dz * ENU_UP.z;

  // X = East, Y = Up, Z = -North (southward)
  return { x: east, y: up, z: -north };
}

// ECEF yaw: heading angle in the local horizontal plane
// Returns angle from north, clockwise (standard bearing)
export function ecefYaw(tangent: { x: number; y: number; z: number }): number {
  const dotEast =
    tangent.x * ENU_EAST.x + tangent.y * ENU_EAST.y + tangent.z * ENU_EAST.z;
  const dotNorth =
    tangent.x * ENU_NORTH.x + tangent.y * ENU_NORTH.y + tangent.z * ENU_NORTH.z;
  return Math.atan2(dotEast, dotNorth);
}

// ECEF forward direction: unit vector in the local horizontal plane at given yaw angle
export function ecefForward(yaw: number): { x: number; y: number; z: number } {
  return {
    x: ENU_NORTH.x * Math.cos(yaw) + ENU_EAST.x * Math.sin(yaw),
    y: ENU_NORTH.y * Math.cos(yaw) + ENU_EAST.y * Math.sin(yaw),
    z: ENU_NORTH.z * Math.cos(yaw) + ENU_EAST.z * Math.sin(yaw),
  };
}

export interface GroundHeightGrid {
  west: number;
  south: number;
  east: number;
  north: number;
  cols: number;
  rows: number;
  cellDeg: number;
  grid: ({ h: number; n: number } | null)[][];
}

export const FALLBACK_GROUND_ALT = 270;

let groundHeightCache: { fn: (lng: number, lat: number) => number } | null =
  null;

export async function loadGroundHeight(): Promise<
  (lng: number, lat: number) => number
> {
  if (groundHeightCache) return groundHeightCache.fn;
  let grid: GroundHeightGrid | null = null;
  try {
    const res = await fetch('/data/ground-height.json');
    if (res.ok) grid = (await res.json()) as GroundHeightGrid;
  } catch {
    grid = null;
  }
  const fn =
    !grid || !grid.grid ? () => FALLBACK_GROUND_ALT : makeGroundLookup(grid);
  groundHeightCache = { fn };
  return fn;
}

function makeGroundLookup(grid: GroundHeightGrid) {
  const { west, south, east, north, cols, rows, cellDeg } = grid;
  return (lng: number, lat: number): number => {
    if (lng < west || lng > east || lat < south || lat > north) {
      return FALLBACK_GROUND_ALT;
    }
    const fx = (lng - west) / cellDeg;
    const fy = (lat - south) / cellDeg;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const read = (x: number, y: number) => {
      if (x < 0 || x >= cols || y < 0 || y >= rows) return null;
      return grid.grid[y][x];
    };
    const a = read(x0, y0),
      b = read(x0 + 1, y0);
    const c = read(x0, y0 + 1),
      d = read(x0 + 1, y0 + 1);
    const v = (p: typeof a) => (p ? p.h : FALLBACK_GROUND_ALT);
    return (
      v(a) * (1 - tx) * (1 - ty) +
      v(b) * tx * (1 - ty) +
      v(c) * (1 - tx) * ty +
      v(d) * tx * ty
    );
  };
}
