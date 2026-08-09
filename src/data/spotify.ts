export type SpotifyPlaylist = {
  playlistId: string
  title: string
  sourceUrl: string
  uri: string
  stationLabel: string
}

const salonPlaylist: SpotifyPlaylist = {
  playlistId: '7vnd8GlKrfazw3sUQ8gt0q',
  title: 'Raju Mistri Playlist',
  sourceUrl: 'https://open.spotify.com/playlist/7vnd8GlKrfazw3sUQ8gt0q',
  uri: 'spotify:playlist:7vnd8GlKrfazw3sUQ8gt0q',
  stationLabel: 'Salon radio',
}

export const spotifyPlaylists: Record<'salon' | 'truck' | 'railway', SpotifyPlaylist> = {
  salon: salonPlaylist,
  truck: {
    playlistId: '0iT5gTODhpUFGSwqGZUpdG',
    title: 'Highway Playlist',
    sourceUrl: 'https://open.spotify.com/playlist/0iT5gTODhpUFGSwqGZUpdG?si=bcUBy4FuQWyNcN3EDZT7YA',
    uri: 'spotify:playlist:0iT5gTODhpUFGSwqGZUpdG',
    stationLabel: 'Highway radio',
  },
  railway: { ...salonPlaylist, stationLabel: 'Railway radio' },
}

export const getSpotifyEmbedUrl = (playlist: SpotifyPlaylist) => `https://open.spotify.com/embed/playlist/${playlist.playlistId}?utm_source=generator&theme=0`
