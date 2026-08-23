# 90s Yaadein

An immersive, client-side nostalgia experience built with React, Vite and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

The optimized scene illustrations live in `public/scenes`, with separate mobile crops. Scene ambience is generated in the browser, while music is provided by the persistent Spotify embed after the visitor enters. New scenes can be added through the data-driven registry in `src/data/scenes.ts`.

Active immersive routes are registered in `src/data/scenes.ts`, including `/gulzar-rain`.

## Live experience control

The protected dashboard at `/admin/experience` controls the featured memory, theme visibility, global static/loop playback, per-theme playback overrides, and whether visitors can change playback themselves. It reuses the Blog Studio admin session.

On Netlify, settings are persisted automatically in the `yaadein-experience-control` site-wide Blob store. The public experience checks `/api/experience-config` on load, when the tab becomes active, and every 45 seconds. Failed or unavailable remote storage falls back safely to the built-in static configuration. On Cloudflare, bind a KV namespace as `EXPERIENCE_CONFIG` to enable writes; reads continue to use safe defaults until that binding exists.

The bottom memory dock uses lazy image thumbnails. Only the hovered or keyboard-focused theme creates a muted video preview, and reduced-motion visitors always receive static thumbnails.

## Live visitor presence

Memory scenes show a real active-browser count and a separate, clearly labeled nostalgia score (100 points per active visitor). Browsers heartbeat every 30 seconds and expire after 90 seconds. Netlify uses the `yaadein-visitor-presence` Blob store automatically. On Cloudflare, bind a KV namespace as `VISITOR_PRESENCE`; without a configured store the UI safely says “You’re here” and does not claim a live crowd count.

## Editorial archive

The journal and trust layer is code-split from the immersive application. Public routes include `/memories`, `/journal`, `/about`, `/contact`, `/privacy`, `/terms`, `/editorial-policy`, `/accessibility`, and `/cookies`. Blog Studio is available only by direct URL at `/admin/blog`; it supports secure server-side GitHub publishing when configured and retains a local export fallback.

Add journal articles to `content/blog` using the schema in `docs/BLOG_PUBLISHING.md`. Drafts and future-dated posts are excluded from public bundles, routes, feeds, search, and sitemaps. The build generates route-specific HTML metadata plus `/sitemap.xml`, `/rss.xml`, `/robots.txt`, and `/ads.txt` from the `SITE_URL` deployment variable.

AdSense remains disabled unless all required variables, slots, and advertising consent are present. See `docs/ADSENSE_SETUP.md`.

Secure Blog Studio deployment is documented in `docs/BLOG_CMS_SETUP.md`.

## Spotify radio

The global radio uses official Spotify playlist embeds. Playlist-to-scene mappings live in `src/data/spotify.ts`; Highway and Monsoon Memories have their own collections and the remaining scenes use the shared memory playlist. The player stays mounted in `AppShell`, so it survives scene navigation. Playback availability depends on Spotify, the listener's region, and account state.

Background videos retain their original sound at a 20% ambient mix after the visitor enters the experience. The Ambience control mutes both the generated ambience and video sound; reduced-motion mode uses the static scene artwork instead.

<!-- Trigger Cloudflare deployment -->
<!-- Trigger Cloudflare build -->
