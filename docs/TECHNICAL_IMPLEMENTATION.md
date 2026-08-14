# Editorial extension technical baseline

Recorded before implementation on 2026-08-14.

## Protected production architecture

- React 19 + TypeScript + Vite SPA.
- `BrowserRouter` is mounted once in `src/main.tsx`; all immersive scene routes are rendered by `src/components/AppShell.tsx` from the data registry in `src/data/scenes.ts`.
- Thirteen active memory routes exist. The default route redirects to `/salon`.
- The ambient-audio, Spotify, creator, navigation, fullscreen, intro, and scene-transition systems are all mounted by `AppShell` and must remain isolated from editorial routes.
- Google Analytics uses the existing `G-N6ZCZW379R` tag in `index.html`. It must not be replaced or loaded twice.
- Scene media lives under `public/scenes`; creator and social assets live under `public`.
- Netlify builds `dist` and applies an SPA fallback. Cloudflare serves the same `dist` directory with SPA not-found handling. No authenticated server or serverless-function layer currently exists.
- Verified creator links are X, Instagram, Behance, and GitHub links already present in `CreatorRadio`.
- Spotify preference/collapse state uses local storage. Intro and audio volume use session storage.

## Additive implementation strategy

1. Keep `AppShell` and every memory component intact, but lazy-load it only for registered immersive routes so journal pages do not load scene/audio code.
2. Add an independent editorial route tree and stylesheet. Preserve the existing full-screen/overflow behavior only while an immersive route is mounted.
3. Load file-based Markdown from `content/blog/*.md` at build time with `import.meta.glob`, validate frontmatter, exclude drafts everywhere public, and sanitize rendered HTML.
4. Generate static `sitemap.xml`, `rss.xml`, and `robots.txt` before Vite builds, using `SITE_URL` (with hosting-provided build URL fallbacks only when the canonical variable is absent).
5. Because neither current host configuration exposes an authenticated server-side publishing mechanism, implement `/admin/blog` as a local importer, validator, previewer, and prepared-package exporter. It will never receive or expose a GitHub token. Automated commits can be added later only behind a host-native authenticated function.
6. Keep AdSense disabled by default. Render neither script nor layout slot unless all required environment settings and advertising consent are present.

## Regression boundary

No scene route, media path, music/ambient behavior, transition, existing social link, GA measurement ID, deployment file, or immersive CSS selector is renamed or removed.

## Subsequent secure publishing extension

After the export fallback shipped, secure one-click publishing was explicitly authorized. The implementation adds same-origin `/api/blog-auth` and `/api/blog-publish` endpoints for both existing hosts: Netlify rewrites to functions, while Cloudflare runs the API through a Worker before the unchanged static-assets SPA fallback. Server-only PBKDF2 password verification, signed HttpOnly sessions, same-origin checks, login throttling, server-side Markdown validation, and atomic GitHub tree/commit/ref updates are shared between both adapters. Export mode remains available when server secrets are absent.
