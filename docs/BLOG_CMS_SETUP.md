# Secure Blog Studio setup

Blog Studio publishes through same-origin `/api/blog-auth` and `/api/blog-publish` endpoints. The browser receives only a signed HttpOnly session cookie. The admin password hash, session signing secret, and GitHub token remain in the hosting environment.

## 1. Generate authentication secrets

Run:

```bash
npm run cms:secrets
```

Choose a password of at least 12 characters. Copy the generated `BLOG_ADMIN_PASSWORD_HASH` and `BLOG_SESSION_SECRET` values into the hosting provider’s secret/environment settings. Do not put them in `.env` files that are committed to Git.

## 2. Create a GitHub token

Create a fine-grained GitHub personal access token for only the `Ramonyv/90s-Nostalgia` repository. Grant the minimum repository permission:

- Contents: Read and write
- Metadata: Read-only (automatically included by GitHub)

Do not grant account-wide or administration permissions. Store the token as `GITHUB_TOKEN` in the hosting provider.

## 3. Configure the server environment

Required:

```text
BLOG_ADMIN_PASSWORD_HASH=pbkdf2$...
BLOG_SESSION_SECRET=...
GITHUB_TOKEN=github_pat_...
GITHUB_OWNER=Ramonyv
GITHUB_REPO=90s-Nostalgia
GITHUB_BRANCH=main
```

These names intentionally do not use the `VITE_` prefix. A `VITE_` prefix would expose the value to browser JavaScript.

### Netlify

Add all six values under **Site configuration → Environment variables**, then trigger a new deploy. `netlify.toml` maps the same-origin `/api/blog-*` routes to the protected Netlify functions.

### Cloudflare Workers

Add `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BRANCH` as Worker variables. Add the sensitive values with the Cloudflare dashboard’s encrypted secrets UI or:

```bash
npx wrangler secret put BLOG_ADMIN_PASSWORD_HASH
npx wrangler secret put BLOG_SESSION_SECRET
npx wrangler secret put GITHUB_TOKEN
```

Deploy again. The Worker handles only `/api/*`; all other requests continue through the existing static-assets SPA binding.

## Publishing behavior

1. Sign in at `/admin/blog`.
2. Import or create Markdown and resolve required validation errors.
3. Upload the cover; it is converted locally to WebP.
4. Uncheck `Draft`.
5. Select **Publish**.
6. The server validates everything again and creates one atomic Git commit containing `content/blog/{slug}.md` and, when uploaded, `public/blog/{slug}/cover.webp`.
7. The Git push triggers the existing production deployment. Publishing an existing slug requires a separate overwrite confirmation.

Sessions expire after eight hours. Logout invalidates the browser cookie. Passwords and GitHub tokens are never stored in local storage or returned by the API.

The endpoint applies a warm-instance login throttle after five failed attempts. For stronger distributed protection, also enable a hosting-provider rate-limit/WAF rule for `POST /api/blog-auth` before sharing the admin URL.
