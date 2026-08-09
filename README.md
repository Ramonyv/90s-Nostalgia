# 90s Yaadein

An immersive, client-side nostalgia experience built with React, Vite and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

The optimized scene illustrations live in `public/scenes`, with separate mobile crops. Music and ambience are royalty-free procedural audio generated in the browser, so no copyrighted recordings ship with the project. New scenes can be added through `src/data/scenes.ts`.

## Spotify radio

The Salon radio opens an official Spotify playlist embed. Change `playlistId`, `title`, and `sourceUrl` in `src/data/spotify.ts` to swap the collection. The Spotify player stays mounted in `AppShell`, so it survives scene navigation while open. Playback availability depends on Spotify, the listener's region, and account state.
