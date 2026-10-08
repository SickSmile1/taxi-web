#!/usr/bin/env node
/**
 * build-districts.mjs
 *
 * Extracts Freiburg city-district (Stadtteil/Stadtbezirk) boundary polygons
 * from the cached Baden-Württemberg OSM extract and writes a static GeoJSON
 * file with one MultiPolygon feature per district.
 *
 * The script filters OSM boundary relations by admin_level (9, 10, 11),
 * resolves them to polygons, then keeps only features belonging to Freiburg
 * (checked via name matching against a known district list).
 *
 * Usage:
 *   node scripts/build-districts.mjs
 *
 * Output: public/data/districts.geojson
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const WORK = '/tmp/tile-pipeline'
const FREIBURG_PBF = `${WORK}/freiburg-clipped.osm.pbf`
const OUT = 'public/data/districts.geojson'

if (!existsSync(FREIBURG_PBF)) {
  if (existsSync(OUT)) {
    console.log(`[build-districts] Missing clipped PBF (${FREIBURG_PBF}), but target file ${OUT} exists. Skipping generation.`);
    process.exit(0);
  }
  console.error(`Missing clipped PBF — run first:
  osmium extract --bbox="7.67,47.92,7.98,48.10" \\
    ${WORK}/baden-wuerttemberg-latest.osm.pbf \\
    --output=${FREIBURG_PBF}`)
  process.exit(1)
}

// --- Step 1: filter to boundary relations ---
console.log('Filtering boundary relations …')
const FILTERED_PBF = `${WORK}/freiburg-districts.osm.pbf`

// tags-filter automatically keeps referenced members (ways, nodes)
execSync(
  `osmium tags-filter "${FREIBURG_PBF}" r/admin_level --overwrite -o "${FILTERED_PBF}"`,
  { stdio: 'inherit' },
)

// --- Step 2: export as GeoJSON (resolves relation members into polygons) ---
console.log('Exporting to GeoJSON …')
const EXPORTED = `${WORK}/freiburg-districts.geojson`
execSync(
  `osmium export "${FILTERED_PBF}" -f geojson --overwrite -o "${EXPORTED}"`,
  { stdio: 'inherit' },
)
const raw = JSON.parse(readFileSync(EXPORTED, 'utf-8'))

// --- Step 3: parse, keep MultiPolygon boundary=administrative features ---
const features = (raw.features || []).filter(
  (f) =>
    f.geometry?.type === 'MultiPolygon' &&
    f.properties?.boundary === 'administrative' &&
    f.properties?.admin_level &&
    f.properties?.name,
)
console.log(`  ${features.length} polygon features with names`)

// --- Step 4: known Freiburg districts ---
// All Stadtteile/Stadtbezirke that belong to the city of Freiburg im Breisgau.
// This list is the canonical source for which boundaries we keep.
// Source of truth: lib/district-names.json (also consumed by lib/districts.ts)
const FREIBURG_DISTRICTS = new Set([
  // admin_level=9 — eingemeindete Dörfer (outer districts)
  'Ebnet',
  'Hochdorf',
  'Kappel',
  'Lehen',
  'Munzingen',
  'Opfingen',
  'Tiengen',
  'Waltershofen',
  // admin_level=10 — innere Stadtbezirke
  'Altstadt',
  'Betzenhausen',
  'Brühl',
  'Haslach',
  'Herdern',
  'Landwasser',
  'Littenweiler',
  'Mooswald',
  'Mundenhof',
  'Neuburg',
  'Oberau',
  'Rieselfeld',
  'Sankt Georgen',
  'Stühlinger',
  'Vauban',
  'Waldsee',
  'Weingarten',
  'Wiehre',
  'Wildtal',
  'Zähringen',
  // alias: St. Georgen → Sankt Georgen
  'St. Georgen',
  // admin_level=11 — sub-quarters (kept because they have distinct names)
  'Günterstal',
])

// Build a case-insensitive lookup from known names
const districtLower = new Set(
  [...FREIBURG_DISTRICTS].map((n) => n.toLowerCase()),
)

// Sub-district prefixes that indicate a Freiburg sub-quarter
// e.g. "Altstadt-Mitte" → parent "Altstadt" is in FREIBURG_DISTRICTS
const subPrefixes = ['Mittel', 'Unter', 'Ober', 'Alt-', 'Alt']

function isFreiburgDistrict(name) {
  const nl = name.toLowerCase()
  if (districtLower.has(nl)) return true
  // Check if the name starts with a known district (e.g. "Altstadt-Mitte")
  for (const d of FREIBURG_DISTRICTS) {
    const dl = d.toLowerCase()
    if (nl.startsWith(dl + '-') || nl.startsWith(dl + ' ')) return true
  }
  // Some sub-quarters have custom prefix+name like "Mittelwiehre" or "Unterwiehre-Nord"
  for (const p of subPrefixes) {
    if (nl.startsWith(p.toLowerCase())) {
      const suffix = nl.slice(p.length) // e.g. "wiehre-nord"
      if (suffix.length > 0) {
        if (districtLower.has(suffix)) return true
        // Also try stripping a dash-suffix: "wiehre-nord" → check "wiehre"
        const dashIdx = suffix.indexOf('-')
        if (dashIdx > 0) {
          const base = suffix.slice(0, dashIdx)
          if (districtLower.has(base)) return true
        }
      }
    }
  }
  return false
}

// --- Step 5: filter to Freiburg districts only ---
const cityFeatures = features.filter((f) => isFreiburgDistrict(f.properties.name))
console.log(`  ${cityFeatures.length} features belonging to Freiburg`)

// --- Step 6: for duplicate names (e.g. admin_level=9 and 10 for same area),
// keep the more specific one (higher admin_level number = more detailed).
// But actually Freiburg doesn't have overlaps between 9 and 10 for the same name.
// So just group by name, keep the one with highest admin_level.
const byName = {}
for (const f of cityFeatures) {
  const name = f.properties.name
  const level = parseInt(f.properties.admin_level, 10)
  if (!byName[name] || level > byName[name].level) {
    byName[name] = { level, feature: f }
  }
}

// --- Step 7: assign colors ---
const COLOR_PALETTE = [
  { name: 'Altstadt', color: '#C4956A' },
  { name: 'Neuburg', color: '#8FA87A' },
  { name: 'Herdern', color: '#A8836A' },
  { name: 'Stühlinger', color: '#7A9B8F' },
  { name: 'Wiehre', color: '#9B8F7A' },
  { name: 'Oberau', color: '#8F7A6A' },
  { name: 'Waldsee', color: '#6A8F7A' },
  { name: 'Littenweiler', color: '#7A8FA8' },
  { name: 'Ebnet', color: '#A87A6A' },
  { name: 'Kappel', color: '#8F7A9B' },
  { name: 'Haslach', color: '#6A7A8F' },
  { name: 'Sankt Georgen', color: '#7A6A8F' },
  { name: 'St. Georgen', color: '#7A6A8F' },
  { name: 'Betzenhausen', color: '#9B8F6A' },
  { name: 'Mooswald', color: '#6A8F8F' },
  { name: 'Landwasser', color: '#8F6A6A' },
  { name: 'Hochdorf', color: '#7A8F6A' },
  { name: 'Rieselfeld', color: '#6A9B8F' },
  { name: 'Lehen', color: '#8F7A8F' },
  { name: 'Opfingen', color: '#6A7A7A' },
  { name: 'Tiengen', color: '#7A6A7A' },
  { name: 'Munzingen', color: '#8F8F6A' },
  { name: 'Waltershofen', color: '#6A6A8F' },
  { name: 'Zähringen', color: '#8FA88A' },
  { name: 'Brühl', color: '#7A8A7A' },
  { name: 'Weingarten', color: '#8A6A7A' },
  { name: 'Vauban', color: '#6A8A8A' },
  { name: 'Wildtal', color: '#8A7A6A' },
  { name: 'Mundenhof', color: '#7A7A6A' },
  { name: 'Günterstal', color: '#6A7A6A' },
  // Sub-quarters with their own colors
  { name: 'Altstadt-Mitte', color: '#C4956A' },
  { name: 'Altstadt-Ring', color: '#B4855A' },
  { name: 'Stühlinger-Eschholz', color: '#7A9B8F' },
  { name: 'Alt-Stühlinger', color: '#6A8B7F' },
  { name: 'Herdern-Nord', color: '#A8836A' },
  { name: 'Herdern-Süd', color: '#98735A' },
  { name: 'Mittelwiehre', color: '#9B8F7A' },
  { name: 'Oberwiehre', color: '#8B7F6A' },
  { name: 'Unterwiehre-Nord', color: '#7B6F5A' },
  { name: 'Unterwiehre-Süd', color: '#6B5F4A' },
  { name: 'Brühl-Beurbarung', color: '#7A8A7A' },
  { name: 'Brühl-Güterbahnhof', color: '#6A7A6A' },
  { name: 'Brühl-Industriegebiet', color: '#5A6A5A' },
  { name: 'Mooswald-West', color: '#6A8F8F' },
  { name: 'Mooswald-Ost', color: '#5A7F7F' },
  { name: 'Betzenhausen-Bischofslinde', color: '#9B8F6A' },
  { name: 'Alt-Betzenhausen', color: '#8B7F5A' },
  { name: 'Sankt Georgen Nord', color: '#7A6A8F' },
  { name: 'Sankt Georgen Süd', color: '#6A5A7F' },
  // Haslach sub-quarters (add explicit colors so hash fallback isn't used)
  { name: 'Haslach-Egerten', color: '#6A7A8F' },
  { name: 'Haslach-Gartenstadt', color: '#5A6A7F' },
  { name: 'Haslach-Haid', color: '#4A5A6F' },
  { name: 'Haslach-Schildacker', color: '#3A4A5F' },
]

const colorMap = {}
for (const entry of COLOR_PALETTE) {
  colorMap[entry.name] = entry.color
}

function getColor(name) {
  if (colorMap[name]) return colorMap[name]
  // Generate a deterministic color for unrecognized names
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = ((hash % 360) + 360) % 360
  return `hsl(${h}, 25%, 35%)`
}

// --- Step 8: build output ---
const outFeatures = []

for (const [name, entry] of Object.entries(byName)) {
  const feature = entry.feature
  const coords = feature.geometry.coordinates

  // Skip tiny fragments
  let area = 0
  try {
    const ring = coords[0][0]
    const n = ring.length
    for (let i = 0; i < n - 1; i++) {
      area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
    }
    area = Math.abs(area) / 2
  } catch {
    area = 0
  }
  if (area < 0.000001) continue

  outFeatures.push({
    type: 'Feature',
    properties: {
      name,
      name_de: name,
      color: getColor(name),
      admin_level: entry.level,
    },
    geometry: feature.geometry,
  })
}

console.log(`  ${outFeatures.length} districts in output`)

// Sort by name
outFeatures.sort((a, b) => a.properties.name.localeCompare(b.properties.name, 'de'))

const geojson = {
  type: 'FeatureCollection',
  features: outFeatures,
}

writeFileSync(OUT, JSON.stringify(geojson, null, 2))
console.log(`\nWritten ${OUT} (${(Buffer.byteLength(JSON.stringify(geojson)) / 1024).toFixed(0)} KB)`)
