# 90s Yaadein system audit

Audited 20 August 2026 before the additive `/system` implementation.

## Existing production architecture

- Vite, React, TypeScript, React Router, and lazy route bundles.
- Immersive route selection is driven by `src/data/scenes.ts`; `AppShell` owns scenes, global music, ambience, Spotify, keepsakes, and interactions.
- Editorial routes, legal pages, Journal, Blog Studio, and Experience Control share the editorial shell.
- Markdown posts are parsed and validated in `src/editorial/blog.ts`. The Vite content plugin repeats only build-critical frontmatter checks before exposing published content.
- SEO metadata is managed by `src/editorial/SEO.tsx`; Vite generates static metadata shells, sitemap, RSS, robots.txt, and ads.txt.
- GA4 events pass through `src/lib/analytics.ts`; route page views include a duplicate guard.
- Consent has Necessary, Analytics, and Advertising categories. AdSense loading is disabled without explicit environment configuration and advertising consent.
- Netlify provides functions and SPA fallback. Cloudflare Worker assets use the same `dist` build with API-first routing.

## Registries reused

- Themes: `src/data/scenes.ts`
- Spotify playlists: `src/data/spotify.ts`
- Local tracks: `src/data/tracks.ts`
- Blog schema and validation: `src/editorial/blog.ts`
- Analytics: `src/lib/analytics.ts`
- Ads route permissions: `src/config/monetizationConfig.ts`
- Canonical host: `src/config/site.ts` / `SITE_URL`

## Known readiness warnings at audit time

- Several themes rely on title/description fallbacks instead of explicit SEO fields.
- Three posts reference `/salonalso`, which is not a registered memory route.
- One article body contains an H1 although the article template already renders the page H1.
- Media provenance is not proven by repository metadata, so the system defaults project assets to **Needs review**.
- AdSense publisher ID and certified CMP are not configured.
- Public asset tree contains several roughly 2.3–2.6 MB loop videos and a source PNG that should be reviewed before further growth.

No immersive route, scene implementation, music behavior, CMS API, analytics trigger, hosting rule, or public route was renamed or refactored.
