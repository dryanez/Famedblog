# FAMED Test Prep SEO Audit

**Date:** 2026-09-02  
**Scope:** Next.js application source and local HTTP checks  
**Method:** Claude SEO v2 categories: technical SEO, schema, content metadata, AI-search readiness, and crawlability

## Executive Summary

The application has a solid SEO foundation with generated `robots.txt`, a generated sitemap, server-rendered blog pages, and article JSON-LD. The main verified issues were inconsistent social image references, a sitewide homepage canonical, missing metadata on key public pages, and dead sitemap entries. These have been corrected in the application source.

The Claude Code `/seo audit` command could not be executed because the Claude session was rate-limited. The local HTTP probe also found that port `8082` is serving a JSON `Not Found` response rather than this Next.js application, so rendered HTML and Core Web Vitals remain unverified.

## Findings

| Priority | Finding | Status |
| --- | --- | --- |
| High | Root layout forced the homepage canonical on every route | Fixed |
| High | Sitemap included `/exam`, `/anamnese`, `/aufklaerung`, `/medicalcases`, and `/brief` without local route files | Fixed by removing dead entries |
| High | Open Graph used missing `/og-image.png`; article JSON-LD used missing `/og-image.jpg` | Fixed to one existing publisher asset |
| Medium | Homepage, book, and lead-magnet pages inherited generic root metadata | Fixed with route-specific titles and descriptions |
| Medium | Blog articles lacked route-specific canonical and Open Graph metadata | Fixed |
| Medium | Sitewide Organization and WebSite structured data was absent | Fixed |
| Medium | Social image is a `199x199` logo, not an optimized `1200x630` card | Open |
| Unknown | Core Web Vitals, rendered accessibility, and external indexation | Requires a running public deployment |

## Implemented Changes

- Added sitewide `Organization` and `WebSite` JSON-LD in `app/layout.tsx`.
- Removed the layout-level canonical that incorrectly applied to all routes.
- Added homepage canonical and explicit metadata.
- Added explicit metadata for the preparation book and free study guide pages.
- Added article canonical, Open Graph article metadata, and consistent JSON-LD image URLs.
- Removed sitemap URLs for routes that do not exist in the current app tree.

## Validation

- TypeScript/editor diagnostics: passed for every touched source file.
- `npm run lint`: blocked because dependencies are not installed.
- `npm ci`: blocked by `ENOSPC` (no space left on the device).
- HTTP probe at `http://localhost:8082`: returned JSON `Not Found`, not the Next.js app.
- Claude Code `/seo audit`: blocked by the current session rate limit.

## Next Audit

Run the following after freeing disk space and starting this Next.js app on an available port:

```powershell
npm ci
npm run lint
npm run build
claude -p "/seo audit http://localhost:<port>" --plugin-dir "$env:TEMP\claude-seo-famed" --no-chrome --permission-mode dontAsk
```

Before production, create a branded `1200x630` OG image at `public/og-image.png`, then repeat the schema and social-card checks.