#!/usr/bin/env node
/**
 * build-street-index.mjs
 *
 * Extracts all named highway ways from the Freiburg OSM extract,
 * deduplicates by name, computes centroids, assigns to districts
 * via point-in-polygon, and outputs a sorted street index JSON.
 *
 * Prerequisites:
 *   - /tmp/tile-pipeline/freiburg-clipped.osm.pbf (run build-districts.mjs first)
 *   - osmium tool installed
 *
 * Usage:
 *   node scripts/build-street-index.mjs
 *
 * Output: public/data/freiburg-streets.json
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const WORK = '/tmp/tile-pipeline'
const FREIBURG_PBF = `${WORK}/freiburg-clipped.osm.pbf`
const OUT = 'public/data/freiburg-streets.json'
const DISTRICTS_FILE = 'public/data/districts.geojson'

if (!existsSync(FREIBURG_PBF)) {
  if (existsSync(OUT)) {
    console.log(`[build-street-index] Missing clipped PBF (${FREIBURG_PBF}), but target file ${OUT} exists. Skipping generation.`);
    process.exit(0);
  }
  console.error(`Missing clipped PBF — run first:
  osmium extract --bbox="7.67,47.92,7.98,48.10" \\
    ${WORK}/baden-wuerttemberg-latest.osm.pbf \\
    --output=${FREIBURG_PBF}`)
  process.exit(1)
}

console.log('Filtering highway ways …')
const FILTERED_PBF = `${WORK}/freiburg-streets.osm.pbf`
execSync(
  `osmium tags-filter "${FREIBURG_PBF}" w/highway --overwrite -o "${FILTERED_PBF}"`,
  { stdio: 'inherit' },
)

console.log('Exporting to GeoJSON …')
const EXPORTED = `${WORK}/freiburg-streets.geojson`
execSync(
  `osmium export "${FILTERED_PBF}" -f geojson --overwrite -o "${EXPORTED}"`,
  { stdio: 'inherit' },
)
const raw = JSON.parse(readFileSync(EXPORTED, 'utf-8'))

const wayFeatures = (raw.features || []).filter(
  (f) =>
    f.geometry?.type === 'LineString' &&
    f.properties?.highway &&
    f.properties?.name,
)

console.log(`  ${wayFeatures.length} named highway ways`)

const merged = new Map()

for (const f of wayFeatures) {
  const name = f.properties['name:de'] || f.properties.name
  const highway = f.properties.highway
  const coords = f.geometry.coordinates

  let sumLng = 0
  let sumLat = 0
  const count = coords.length
  for (const [lng, lat] of coords) {
    sumLng += lng
    sumLat += lat
  }
  const centroid = [sumLng / count, sumLat / count]

  const existing = merged.get(name)
  if (existing) {
    existing.centroid = [
      (existing.centroid[0] * existing.count + centroid[0] * count) / (existing.count + count),
      (existing.centroid[1] * existing.count + centroid[1] * count) / (existing.count + count),
    ]
    existing.count += count
    if (!existing.highwayTypes.includes(highway)) {
      existing.highwayTypes.push(highway)
    }
  } else {
    merged.set(name, {
      name,
      centroid,
      count,
      highwayTypes: [highway],
    })
  }
}

let districtData = null
if (existsSync(DISTRICTS_FILE)) {
  try {
    districtData = JSON.parse(readFileSync(DISTRICTS_FILE, 'utf-8'))
    console.log(`  Loaded ${districtData.features.length} district polygons`)
  } catch {
    console.warn('  Warning: could not parse districts.geojson')
  }
}

function pointInPolygon(point, polygon) {
  const [x, y] = point
  const rings = polygon.type === 'MultiPolygon' ? polygon.coordinates[0] : polygon.coordinates
  for (const ring of rings) {
    let inside = false
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1]
      const xj = ring[j][0], yj = ring[j][1]
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside
      }
    }
    if (inside) return true
  }
  return false
}

function findDistrict(point) {
  if (!districtData) return null
  for (const f of districtData.features) {
    if (pointInPolygon(point, f.geometry)) {
      return f.properties.name
    }
  }
  return null
}

const streets = []
for (const [name, entry] of merged) {
  const district = findDistrict(entry.centroid)
  streets.push({
    name,
    lng: entry.centroid[0],
    lat: entry.centroid[1],
    highwayTypes: entry.highwayTypes,
    district,
  })
}

streets.sort((a, b) => a.name.localeCompare(b.name, 'de'))

writeFileSync(OUT, JSON.stringify(streets, null, 2))
console.log(`\nWritten ${OUT} — ${streets.length} unique streets (${(Buffer.byteLength(JSON.stringify(streets)) / 1024).toFixed(0)} KB)`)
