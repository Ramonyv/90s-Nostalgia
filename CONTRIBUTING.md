# Contributing to 90s Yaadein

Start with [`docs/CODEX_RULES.md`](docs/CODEX_RULES.md) and the corresponding `/system` section. Preserve existing routes, immersive behavior, CMS workflows, analytics, SEO, and deployment compatibility.

## Add a theme

Add one typed entry to `src/data/scenes.ts`, required desktop/mobile/fallback assets under `public/scenes`, optional Spotify metadata in `src/data/spotify.ts`, and intentional analytics using the existing registry. Verify mobile and reduced motion. See `/system/themes`.

## Add a blog post

Use Blog Studio or a Markdown file in `content/blog`. Follow the existing `BlogFrontmatter` schema and shared `validatePost` rules. Drafts must remain excluded. See `/system/content` and `/system/seo`.

## Add a playlist or media asset

Use authorized embeds/links. Do not host unauthorized music or assume usage rights. Record source, owner, attribution, and license evidence before changing a media status from **Needs review**. See `/system/copyright` and `/system/performance`.

## Add an analytics event

Add the name and runtime definition together in `src/lib/analytics.ts`, then emit it through `trackEvent` or `trackEventOnce`. Do not send PII or create duplicates. See `/system/analytics`.

## Add a component

Reuse tokens from `src/styles/globals.css`, meet keyboard/touch/reduced-motion requirements, and register the component in `src/system/systemData.ts` when it becomes part of the shared library. See `/system/design`.

## Before release

Run:

```sh
npm run validate
npm run build
npm run lint
```

Treat validator errors as blockers. Review warnings individually; readiness warnings must remain visible rather than being converted to fake success.
