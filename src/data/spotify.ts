import type { SceneId } from './scenes'

export type SpotifyPlaylist = {
  playlistId: string
  title: string
  sourceUrl: string
  uri: string
  stationLabel: string
  cover?: string
  hindiName?: string
  preservePlayback?: boolean
  available?: boolean
}

const salonPlaylist: SpotifyPlaylist = {
  playlistId: '7vnd8GlKrfazw3sUQ8gt0q',
  title: 'Raju Mistri Playlist',
  sourceUrl: 'https://open.spotify.com/playlist/7vnd8GlKrfazw3sUQ8gt0q',
  uri: 'spotify:playlist:7vnd8GlKrfazw3sUQ8gt0q',
  stationLabel: 'Salon radio',
}

const memoryPlaylist = (stationLabel: string): SpotifyPlaylist => ({ ...salonPlaylist, stationLabel })

export const spotifyPlaylists: Record<SceneId, SpotifyPlaylist> = {
  salon: salonPlaylist,
  truck: {
    playlistId: '0iT5gTODhpUFGSwqGZUpdG',
    title: 'Highway Playlist',
    sourceUrl: 'https://open.spotify.com/playlist/0iT5gTODhpUFGSwqGZUpdG?si=bcUBy4FuQWyNcN3EDZT7YA',
    uri: 'spotify:playlist:0iT5gTODhpUFGSwqGZUpdG',
    stationLabel: 'Highway radio',
  },
  railway: memoryPlaylist('Railway radio'),
  school: memoryPlaylist('School radio'),
  cricket: memoryPlaylist('Gully radio'),
  tv: memoryPlaylist('TV room radio'),
  rain: {
    playlistId: '1eydFGwTFhx46dvqo2fnbO',
    title: 'Rainy 90s · Monsoon Mixtape',
    sourceUrl: 'https://open.spotify.com/playlist/1eydFGwTFhx46dvqo2fnbO?si=Ko4RGTwtTgSpiENxFFORpQ',
    uri: 'spotify:playlist:1eydFGwTFhx46dvqo2fnbO',
    stationLabel: 'Monsoon mixtape',
    cover: '/covers/rainy-90s.webp',
    hindiName: 'बारिश वाली धुनें',
  },
  gaming: memoryPlaylist('Game parlour radio'),
  'cassette-shop': memoryPlaylist('Cassette shop radio'),
  'bus-stand': memoryPlaylist('Bus stand radio'),
  village: memoryPlaylist('Village radio'),
  'auto-rickshaw': {
    ...memoryPlaylist('City Ride Mix'),
    playlistId: '0YFA8rR63BkCFr3H1g3LGh',
    title: 'City Ride Mix',
    sourceUrl: 'https://open.spotify.com/playlist/0YFA8rR63BkCFr3H1g3LGh?si=s-PnLaC_QvunyUfgREklnQ',
    uri: 'spotify:playlist:0YFA8rR63BkCFr3H1g3LGh',
    hindiName: 'सवारी वाली धुनें',
  },
  'adhoori-shaam': {
    ...memoryPlaylist('Dard Bhari Raat · Side A · 1997'),
    playlistId: '57NwRU3l6nTtuLk4b8l1qk',
    title: 'Dard Bhari Raat',
    sourceUrl: 'https://open.spotify.com/playlist/57NwRU3l6nTtuLk4b8l1qk?si=bYGr6mOMTZue0RvnDsR0uQ',
    uri: 'spotify:playlist:57NwRU3l6nTtuLk4b8l1qk',
    hindiName: 'अधूरी धुनें',
  },
  'highway-adda': {
    ...memoryPlaylist('Highway Adda radio'),
    playlistId: '0hTAaFIMq8i2FzNVgtJQb6',
    title: 'Highway Adda Playlist',
    sourceUrl: 'https://open.spotify.com/playlist/0hTAaFIMq8i2FzNVgtJQb6?si=oevM7zIiRB6O3TY5hQ6mPQ',
    uri: 'spotify:playlist:0hTAaFIMq8i2FzNVgtJQb6',
  },
  '90s-shaadi': {
    playlistId: '0NZ2TX1Rt8X2BdUvXKgGuQ',
    title: '90s Shaadi Playlist',
    sourceUrl: 'https://open.spotify.com/playlist/0NZ2TX1Rt8X2BdUvXKgGuQ?si=sVFmokgoTriIQ_lmz609dw',
    uri: 'spotify:playlist:0NZ2TX1Rt8X2BdUvXKgGuQ',
    stationLabel: 'Shaadi radio',
  },
  'nusrat-night': {
    playlistId: '2iUv9CXZjCHOkujmQaaJC1',
    title: 'Nusrat Night',
    sourceUrl: 'https://open.spotify.com/playlist/2iUv9CXZjCHOkujmQaaJC1?si=LGNhRFEtRnCzIJI2QYzErw',
    uri: 'spotify:playlist:2iUv9CXZjCHOkujmQaaJC1',
    stationLabel: 'Nusrat Night · Side A · 1997',
    hindiName: 'रात की आवाज़',
    available: true,
  },
}

export const getSpotifyEmbedUrl = (playlist: SpotifyPlaylist) => `https://open.spotify.com/embed/playlist/${playlist.playlistId}?utm_source=generator&theme=0`
