# Jekyll Plugins Agents

**Generated:** 2026-01-20

## OVERVIEW
Build-time Ruby plugins for analytics, data ingestion, and site generation.

## CATEGORIES
- `analytics/` - metrics calculation and reporting.
- `data/` - external data fetchers and compressors.
- `generators/` - custom page and data generators.
- `utils/` - shared helpers and filters.

## RUBY PATTERNS
- Generators follow `Jekyll::Generator` with `generate(site)`.
- Filters/helpers live under `utils/` and are loaded by Jekyll.
- Data fetchers should be resilient to network errors and cache where possible.

## WHERE TO CHANGE
- Analytics outputs: `/_plugins/analytics/`.
- Data ingestion: `/_plugins/data/`.
- Site structure: `/_plugins/generators/`.
- Shared helpers: `/_plugins/utils/`.

## ANTI-PATTERNS
- Avoid modifying `vendor/` dependencies.
- Do not add runtime JS behavior here (build-time only).
