# Taxi Alica — Web, Multilingual SEO & Booking Platform

This repository contains the Next.js marketing and booking website for Taxi-Alica Freiburg, featuring complete multilingual localization across 7 languages, automated programmatic SEO for all 29 Freiburg districts, service conversion funnels, real-time fare estimation, and DSGVO-compliant client-side architecture.

## Key Features

1. **7 Locales with Full Native Translations**: German (`de`), English (`en`), French (`fr`), Spanish (`es`), Arabic (`ar` with automatic RTL layout switching), Japanese (`ja`), and Simplified Chinese (`zh`).
2. **Programmatic Local SEO Siloing**: Unique static HTML generation for all 29 Freiburg districts (`/de/stadtteil/[slug]/`) with dynamic local POI landmarks, distance matrices, peak-hour traffic delay estimates, and JSON-LD `LocalBusiness`/`TaxiService` structured schema tags.
3. **High-Margin Conversion Funnels**: Dedicated landing pages for **Krankentransport** (direct health insurance billing under § 60 SGB V), **Flughafentransfer** (Basel, Frankfurt, Stuttgart, Zürich, etc.), **Stadtfahrten**, and **Firmenkunden / Business Shuttle**.
4. **Interactive Route & Tariff Calculator**: Street and house-number autocomplete (`freiburg-streets.json`), official municipal taxi tariff formulas (day vs. night/weekend rates), and OSRM route calculation with haversine distance-matrix fallbacks.
5. **Static Export Architecture**: Builds to pure static HTML/CSS/JS (`output: 'export'`) for ultra-fast, edge-compatible CDN or Apache hosting with zero server attack surface.

## Directory Structure

```
├── app/
│   ├── [lang]/              # Dynamic locale routing (de, en, fr, es, ar, ja, zh)
│   │   ├── flughafentransfer/
│   │   ├── fuhrpark/
│   │   ├── krankenfahrten/
│   │   ├── stadtfahrten/
│   │   ├── stadtteil/[slug]/ # 29 district SEO landing pages
│   │   └── ...
│   ├── globals.css
│   ├── layout.tsx
│   ├── sitemap.ts           # Automated multi-locale XML sitemap
│   └── robots.ts
├── components/
│   ├── form/                # Accessible form controls
│   ├── header/              # Multilingual navigation & mobile drawer
│   ├── home/                # Hero, About, Service area sections
│   ├── pricing/             # Tariff breakdown & fare comparison tables
│   ├── route/               # Street autocomplete & fare widgets
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   └── RouteCalculator.tsx
├── lib/
│   ├── translations/        # Translation files for all 7 languages
│   ├── districts-seo.ts     # Curated district descriptions & traffic FAQs
│   ├── tariff.ts            # Official taxi pricing formulas
│   ├── hreflang.ts          # Bidirectional SEO hreflang builder
│   └── route-store.ts       # Event emitter for pickup/dropoff coordinates
├── public/
│   ├── fonts/               # Self-hosted fonts (CloisterBlack, etc.)
│   ├── data/                # Lightweight SEO & route data (districts, streets, tariffs)
│   └── favicon.ico, logo_low_res.png
├── scripts/
│   ├── link-assets.mjs      # Symlinks sister repos (taxi-map, taxi-turntables-pictures)
│   ├── validate-build.mjs   # Comprehensive SEO, canonical, and JSON-LD validator
│   └── patch-html-lang.mjs
├── tests/                   # Playwright mobile and accessibility tests
├── Dockerfile               # Production Apache HTTPD container
└── Makefile
```

## Quick Start (Standalone Mode)

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Visit `http://localhost:3000/de/` in your browser.

## Sister Repository Integration (Map & Media)

To assemble the complete site with the 3D Freiburg city map (`taxi-map`) and vehicle 360 turntables (`taxi-turntables-pictures`):

```bash
# Link 3D tiles and car turntables from sister repositories
npm run link:assets

# Run production static build
npm run build
```

## Production & Deployment

- **Static Export**: Run `npm run build` to generate the production bundle in `out/`.
- **Docker Container**: Run `make docker-build` followed by `make docker-run` to spin up the Apache Alpine container on port 8080.
- **GitHub Pages**: Pushing to `main` triggers `.github/workflows/deploy.yml` which builds with `NEXT_PUBLIC_BASE_PATH` and deploys automatically.
