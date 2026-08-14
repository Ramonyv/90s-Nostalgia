# AdSense setup (currently off)

The integration deliberately renders no script, slot, or layout gap unless advertising is enabled, a client and slot are configured, and the visitor has granted advertising consent.

Configure the deployment environment—not frontend source—with:

```text
SITE_URL=https://your-canonical-domain.example
VITE_ADSENSE_ENABLED=false
VITE_ADSENSE_CLIENT=
VITE_ADSENSE_PUBLISHER_ID=
VITE_ADSENSE_SLOT_ARTICLE=
VITE_ADSENSE_SLOT_LIST=
```

1. Keep `VITE_ADSENSE_ENABLED=false` until Google has approved the site.
2. Add the real `ca-pub-…` client value and real slot IDs from AdSense. Never invent them.
3. Add the publisher value in the `pub-…` form. The build then generates `/ads.txt` as `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. With no publisher ID, `/ads.txt` is intentionally empty.
4. Add any required verification meta/script through the deployment-managed head configuration or a future dedicated environment-backed head field. Do not paste secrets or fake publisher IDs into source.
5. Before enabling ads, connect the selected Google-certified CMP. `ConsentManager` already separates necessary, analytics, and advertising state and dispatches Google consent-mode updates, but it does not claim CMP certification.
6. Confirm `/privacy`, `/terms`, `/contact`, `/about`, `/cookies`, `/sitemap.xml`, `/robots.txt`, article JSON-LD, and enough original published journal material are live before requesting review.

Allowed placements are the journal listing separator and article body/footer regions. Immersive scenes—including `/adhoori-shaam`—remain unmonetized in `src/editorial/ads.tsx`.
