import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const BASE_URL = 'https://taxi-alica.de';
const OUT_DIR = 'out';
const SITEMAP_FILE = join(OUT_DIR, 'sitemap.xml');

let errors = 0;
let checkedFilesCount = 0;
let jsonLdValidatedCount = 0;

// Helper to recursively find HTML files
function getHtmlFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      if (file === '_next' || file === 'data' || file === 'sprites') continue;
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

// 1. Gather all HTML files
const htmlFiles = getHtmlFiles(OUT_DIR);
console.log(`Found ${htmlFiles.length} HTML files in ${OUT_DIR}/`);

const urlToCanonical = new Map();
const htmlToCanonical = new Map();

for (const filePath of htmlFiles) {
  const relPath = relative(OUT_DIR, filePath);
  // Bypassing root index.html (redirect stub) and 404/error pages which do not require canonical tags
  if (relPath === 'index.html' || relPath.startsWith('404') || relPath.startsWith('_not-found')) continue;

  checkedFilesCount++;
  const html = readFileSync(filePath, 'utf-8');

  // Verify Canonical Path
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+>/i);
  if (!canonicalMatch) {
    console.error(`  [CANONICAL ERROR] ${relPath}: Missing <link rel="canonical" href="..."> tag.`);
    errors++;
    continue;
  }

  const hrefMatch = canonicalMatch[0].match(/href=["']([^"']+)["']/i);
  if (!hrefMatch) {
    console.error(`  [CANONICAL ERROR] ${relPath}: Found canonical link tag but missing 'href' attribute.`);
    errors++;
    continue;
  }

  const canonicalUrl = hrefMatch[1];
  
  if (!canonicalUrl.startsWith(BASE_URL)) {
    console.error(`  [CANONICAL ERROR] ${relPath}: Canonical URL "${canonicalUrl}" does not start with base URL "${BASE_URL}".`);
    errors++;
    continue;
  }

  const urlPath = canonicalUrl.slice(BASE_URL.length);

  let expectedUrlPath;
  if (relPath.endsWith('/index.html')) {
    expectedUrlPath = '/' + relPath.slice(0, -10);
  } else if (relPath === 'index.html') {
    expectedUrlPath = '/';
  } else {
    // Single page export (e.g. 404.html)
    expectedUrlPath = '/' + relPath;
  }

  if (urlPath !== expectedUrlPath) {
    console.error(`  [CANONICAL ERROR] ${relPath}: Canonical path mismatch. Found: "${urlPath}", Expected: "${expectedUrlPath}".`);
    errors++;
  } else {
    urlToCanonical.set(canonicalUrl, filePath);
    htmlToCanonical.set(filePath, canonicalUrl);
  }

  // Verify JSON-LD (LD+JSON)
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const jsonText = match[1].trim();
    jsonLdValidatedCount++;
    try {
      const parsed = JSON.parse(jsonText);
      validateJsonLd(parsed, relPath);
    } catch (e) {
      console.error(`  [JSON-LD ERROR] ${relPath}: Failed to parse JSON-LD payload: ${e.message}`);
      errors++;
    }
  }
}

function validateJsonLd(node, file) {
  if (Array.isArray(node)) {
    for (const item of node) {
      validateJsonLd(item, file);
    }
    return;
  }

  if (typeof node !== 'object' || node === null) {
    console.error(`  [JSON-LD ERROR] ${file}: Root element is not a JSON object.`);
    errors++;
    return;
  }

  if (node['@graph']) {
    validateJsonLd(node['@graph'], file);
    return;
  }

  const type = node['@type'];
  if (!type) {
    console.error(`  [JSON-LD ERROR] ${file}: JSON-LD object is missing "@type". Keys: ${Object.keys(node).join(', ')}`);
    errors++;
    return;
  }

  // Schema.org object type validations
  if (type === 'LocalBusiness') {
    if (!node.name) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: LocalBusiness is missing "name".`);
      errors++;
    }
    if (node.address && (!node.address.addressLocality || !node.address.addressCountry)) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: LocalBusiness address is invalid (missing addressLocality or addressCountry).`);
      errors++;
    }
  } else if (type === 'TaxiService') {
    if (!node.name) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: TaxiService is missing "name".`);
      errors++;
    }
    if (!node.provider) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: TaxiService is missing "provider" information.`);
      errors++;
    } else if (node.provider['@type'] !== 'LocalBusiness' || !node.provider.name) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: TaxiService provider is invalid.`);
      errors++;
    }
    if (!node.offers && !node.hasOfferCatalog) {
      console.log(`  [JSON-LD SCHEMA WARNING] ${file}: TaxiService is missing pricing information (offers or hasOfferCatalog).`);
    }
  } else if (type === 'FAQPage') {
    if (!node.mainEntity || !Array.isArray(node.mainEntity)) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: FAQPage is missing "mainEntity" array.`);
      errors++;
    } else {
      for (const q of node.mainEntity) {
        if (q['@type'] !== 'Question') {
          console.error(`  [JSON-LD SCHEMA ERROR] ${file}: FAQPage mainEntity includes invalid type (expected Question, found ${q['@type']}).`);
          errors++;
        }
        if (!q.name) {
          console.error(`  [JSON-LD SCHEMA ERROR] ${file}: FAQPage question is missing "name".`);
          errors++;
        }
        if (!q.acceptedAnswer || q.acceptedAnswer['@type'] !== 'Answer' || !q.acceptedAnswer.text) {
          console.error(`  [JSON-LD SCHEMA ERROR] ${file}: FAQPage question "${q.name}" is missing a valid acceptedAnswer.`);
          errors++;
        }
      }
    }
  } else if (type === 'Event') {
    if (!node.name) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: Event is missing "name".`);
      errors++;
    }
    if (!node.startDate) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: Event is missing "startDate".`);
      errors++;
    }
    if (!node.location) {
      console.error(`  [JSON-LD SCHEMA ERROR] ${file}: Event is missing "location".`);
      errors++;
    }
  }
}

// 2. Validate Sitemap XML URL listings
if (!existsSync(SITEMAP_FILE)) {
  console.error(`  [SITEMAP ERROR] Sitemap file not found at "${SITEMAP_FILE}".`);
  errors++;
} else {
  const sitemapContent = readFileSync(SITEMAP_FILE, 'utf-8');
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let locMatch;
  const sitemapUrls = new Set();

  while ((locMatch = locRegex.exec(sitemapContent)) !== null) {
    const url = locMatch[1].trim();
    sitemapUrls.add(url);

    if (!url.startsWith(BASE_URL)) {
      console.error(`  [SITEMAP ERROR] URL in sitemap does not match base URL: "${url}"`);
      errors++;
      continue;
    }

    const file = urlToCanonical.get(url);
    if (!file) {
      console.error(`  [SITEMAP ERROR] URL in sitemap does not correspond to any exported HTML page (or canonical URL is missing/mismatched): "${url}"`);
      errors++;
    }
  }

  console.log(`Parsed ${sitemapUrls.size} URLs from sitemap.xml`);

  // Verify no orphaned canonical pages (excluding 404)
  for (const [canonicalUrl, filePath] of urlToCanonical.entries()) {
    if (!sitemapUrls.has(canonicalUrl)) {
      if (filePath.endsWith('404.html') || filePath.endsWith('404/index.html')) continue;

      console.error(`  [SITEMAP ERROR] Canonical URL "${canonicalUrl}" (for file ${relative(OUT_DIR, filePath)}) is missing from sitemap.xml.`);
      errors++;
    }
  }
}

console.log(`\nChecked ${checkedFilesCount} HTML files.`);
console.log(`Validated ${jsonLdValidatedCount} JSON-LD blocks.`);

if (errors > 0) {
  console.error(`\nFAIL: Validation completed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`\nPASS: All canonical, sitemap, and JSON-LD structured data checks passed.`);
}
