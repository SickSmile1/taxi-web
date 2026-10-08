#!/usr/bin/env node
/**
 * build-distance-matrix.mjs
 *
 * Pre-computes driving distances between key nodes in the Freiburg
 * road network using the OSRM demo API. Outputs a flat lookup JSON
 * suitable for client-side distance queries.
 *
 * Usage:
 *   node scripts/build-distance-matrix.mjs
 *
 * Output: public/data/distance-matrix.json
 */

import { writeFileSync, existsSync } from 'fs'

const OSRM = 'https://router.project-osrm.org/route/v1/driving'
const OUT = 'public/data/distance-matrix.json'

const KEY_NODES = {
  // B31 corridor
  'A5xB31': [7.797, 47.947],
  'B31xBerlinerAllee': [7.837, 47.992],
  'B31xBismarckallee': [7.848, 47.991],
  'B31xSchwarzwaldstr': [7.872, 47.985],
  'B31xLittenweiler': [7.896, 47.977],
  // North-South axis
  'B3xZaehringerStr': [7.856, 48.015],
  'B3xHabsburgerstr': [7.851, 48.005],
  'B3xEschholzstr': [7.841, 47.996],
  'B3xBaslerStr': [7.836, 47.985],
  'B31axStGeorgen': [7.812, 47.975],
  // Other gateways
  'HaslachB294': [7.806, 47.984],
  'Rieselfeld': [7.788, 47.992],
  'Ebnet': [7.918, 47.985],
  'Landwasser': [7.806, 48.020],
  'Tiengen': [7.727, 48.035],
  // Destinations
  'HbfZOB': [7.841452, 47.996942],
  'Muenster': [7.8525, 47.9956],
  'Stadion': [7.8297, 48.0216],
  'BaselExit': [7.552, 47.582],
  'KarlsruheExit': [7.980, 48.780],
  'FrankfurtExit': [8.558, 50.058],
  'MunichExit': [11.700, 48.340],
}

const nodeNames = Object.keys(KEY_NODES)

async function fetchDistance(a, b) {
  const url = `${OSRM}/${a.join(',')};${b.join(',')}?geometries=geojson&overview=false&steps=false&alternatives=false`
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`OSRM ${resp.status}`)
  const data = await resp.json()
  if (data.code !== 'Ok') throw new Error(`OSRM ${data.code}`)
  const route = data.routes[0]
  return { meters: Math.round(route.distance), seconds: Math.round(route.duration) }
}

async function main() {
  if (existsSync(OUT)) {
    console.log(`[build-distance-matrix] Target file ${OUT} already exists. Skipping API generation.`);
    process.exit(0);
  }
  console.log('=== Building distance matrix ===\n')
  const matrix = {}
  let total = nodeNames.length * (nodeNames.length - 1) / 2
  let done = 0

  for (let i = 0; i < nodeNames.length; i++) {
    for (let j = i + 1; j < nodeNames.length; j++) {
      const key = `${nodeNames[i]}_${nodeNames[j]}`
      process.stdout.write(`  [${++done}/${total}] ${key} … `)
      try {
        const result = await fetchDistance(KEY_NODES[nodeNames[i]], KEY_NODES[nodeNames[j]])
        matrix[key] = result
        console.log(`${(result.meters / 1000).toFixed(1)} km, ${(result.seconds / 60).toFixed(0)} min`)
      } catch (e) {
        console.error(`FAILED: ${e.message}`)
      }
    }
  }

  writeFileSync(OUT, JSON.stringify(matrix, null, 2))
  console.log(`\nWritten ${OUT} — ${Object.keys(matrix).length} pairs (${(Buffer.byteLength(JSON.stringify(matrix)) / 1024).toFixed(0)} KB)`)
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
