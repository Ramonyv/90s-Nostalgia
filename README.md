# 90s Yaadein

An immersive, client-side nostalgia experience built with React, Vite and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

The eleven optimized scene illustrations live in `public/scenes`, with separate mobile crops. Scene ambience is generated in the browser, while music is provided by the persistent Spotify embed. New scenes can be added through the data-driven registry in `src/data/scenes.ts`.

Active routes: `/salon`, `/truck`, `/railway`, `/school`, `/cricket`, `/tv`, `/rain`, `/gaming`, `/cassette-shop`, `/bus-stand`, and `/village`.

## Spotify radio

The global radio uses official Spotify playlist embeds. Playlist-to-scene mappings live in `src/data/spotify.ts`; Highway and Monsoon Memories have their own collections and the remaining scenes use the shared memory playlist. The player stays mounted in `AppShell`, so it survives scene navigation. Playback availability depends on Spotify, the listener's region, and account state.

Background videos retain their original sound at a low ambient mix after the visitor enters the experience. The Ambience control mutes both the generated ambience and video sound; reduced-motion mode uses the static scene artwork instead.
