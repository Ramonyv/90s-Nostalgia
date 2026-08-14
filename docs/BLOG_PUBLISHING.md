# Blog publishing

Store one standalone `.md` or `.markdown` file per article in `content/blog`. Drafts must set `draft: true`; they are excluded from public routes, search, related content, RSS, and the sitemap.

Use `/admin/blog` to import, validate, preview, and export a prepared Markdown file. The current deployment has no authenticated server function, so Blog Studio deliberately does not accept credentials or publish to GitHub directly.

Cover uploads are converted locally to WebP at 86% quality and constrained to a maximum width of 2400px without upscaling. Blog Studio updates the cover path to `/blog/{slug}/cover.webp` and exports the converted asset as `cover.webp`; the original upload never leaves the browser.

## Frontmatter

```yaml
---
title: "Article title"
slug: "article-slug"
description: "Search and social description"
excerpt: "Journal listing summary"
date: "2026-08-14"
updated: "2026-08-14"
author: "Raman"
category: "Places"
tags:
  - "90s India"
cover: "/blog/article-slug/cover.webp"
coverAlt: "Descriptive alt text"
featured: false
draft: true
relatedMemory: "/salon"
seoTitle: "Article title"
seoDescription: "Search description"
canonical: ""
---
```

`title`, `slug`, `description`, `date`, and `category` are build-blocking fields. Blog Studio derives editable defaults for slug, excerpt, updated date, author, and SEO fields without changing body content.

## Supported body content

Headings, paragraphs, emphasis, links, lists, blockquotes, images, tables, code, and horizontal rules are rendered. Output is sanitized. For editorial callouts, use fenced directives such as `:::factbox`, `:::quote`, `:::memory`, `:::article`, or `:::sources`, closed by `:::`.
